// ─── api/venues/[id]/send-email/route.ts ───────────────────────────────────
// Permite al admin enviar un correo de outreach a un venue guardado en la lista.
// Renderiza una plantilla con los datos del venue, envía el correo,
// actualiza el estado del venue a "Sent" y guarda el log del envío.
// El envío real está desactivado en emailService.ts — ver ese archivo para reactivar.
// ──────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { readVenueStore, updateVenue, addOutreachLog, getTemplates } from '@/lib/venueStore'
import { renderTemplate } from '@/lib/templateUtils'
import { sendOutreachEmail } from '@/lib/emailService'
import { readContent } from '@/lib/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Obtener el ID del venue desde la ruta dinámica
    const { id } = await params

    const body = await req.json() as {
      templateId: string
      toEmail: string
      vars?: Record<string, string>
    }

    if (!body.templateId || !body.toEmail) {
      return NextResponse.json({ error: 'templateId and toEmail are required' }, { status: 400 })
    }

    // Cargar el store de venues, las plantillas y la config del sitio en paralelo
    const [store, templates, { siteContent }] = await Promise.all([
      readVenueStore(),
      getTemplates(),
      readContent(),
    ])

    // Verificar que el venue existe en la lista
    const venue = store.venues.find((v) => v.id === id)
    if (!venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 })

    // Verificar que la plantilla elegida por el admin existe
    const template = templates.find((t) => t.id === body.templateId)
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

    // Variables para inyectar en la plantilla — el caller puede sobreescribir via body.vars
    const vars: Record<string, string> = {
      venueName: venue.name,
      bandName: 'Rebound Rock Band',
      serviceArea: siteContent.serviceArea,
      contactEmail: siteContent.contactEmail,
      ...body.vars,
    }

    // Renderizar la plantilla sustituyendo todas las variables
    const { subject, bodyHtml } = renderTemplate(template, vars)

    // Intentar enviar el correo via emailService (puede estar desactivado)
    let resendEmailId: string | undefined
    let sendStatus: 'sent' | 'failed' = 'sent'
    let errorMessage: string | undefined

    try {
      const result = await sendOutreachEmail({
        toEmail: body.toEmail,
        subject,
        bodyHtml,
        // reply-to con prefijo ve- para identificar respuestas de venues
        replyTo: `booking+ve-${id}@reboundrockband.com`,
      })
      resendEmailId = result.resendEmailId
    } catch (err) {
      sendStatus = 'failed'
      errorMessage = err instanceof Error ? err.message : String(err)
    }

    // Guardar el log de outreach en la BD
    const outreachLog = await addOutreachLog({
      venueId: venue.id,
      venueName: venue.name,
      toEmail: body.toEmail,
      subject,
      bodyHtml,
      templateId: template.id,
      templateSlug: template.slug,
      sentAt: new Date().toISOString(),
      resendEmailId,
      status: sendStatus,
      errorMessage,
    })

    // Avanzar el estado del venue a "Sent" si el envío fue exitoso
    // Solo aplica si el venue estaba en etapas tempranas del pipeline
    const statusAdvance =
      sendStatus === 'sent' &&
      (venue.status === 'New' ||
        venue.status === 'Reviewed' ||
        venue.status === 'Contact Added' ||
        venue.status === 'Draft Ready')
        ? { status: 'Sent' as const }
        : {}

    // Actualizar la fecha de último contacto y posiblemente el estado
    await updateVenue(id, {
      lastContactedAt: new Date().toISOString(),
      ...statusAdvance,
    })

    if (sendStatus === 'failed') {
      return NextResponse.json(
        { error: errorMessage ?? 'Send failed', outreachLog },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, outreachLog })
  } catch (err) {
    console.error('[POST /api/venues/[id]/send-email]', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
