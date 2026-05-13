// ─── api/bookings/[id]/send-email/route.ts ─────────────────────────────────
// Permite al admin enviar un correo manual a un cliente con una reserva existente.
// Usa las plantillas configuradas en el panel de admin (EmailTemplates).
// El envío real está desactivado en emailService.ts — los logs se guardan igual
// para mantener historial aunque el correo no se mande realmente.
// ──────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { getTemplates, addBookingEmailLog } from '@/lib/venueStore'
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
    // Obtener el ID de la reserva desde la URL dinámica
    const { id } = await params

    const body = await req.json() as {
      templateId: string
      toEmail: string
      subject?: string   // override opcional si el admin editó el asunto manualmente
      bodyHtml?: string  // override opcional si el admin editó el cuerpo manualmente
      vars?: Record<string, string>
    }

    if (!body.templateId || !body.toEmail) {
      return NextResponse.json({ error: 'templateId and toEmail are required' }, { status: 400 })
    }

    // Cargar plantillas y configuración del sitio en paralelo
    const [templates, { siteContent }, content] = await Promise.all([
      getTemplates(),
      readContent(),
      readContent(),
    ])

    // Buscar la plantilla elegida por el admin
    const template = templates.find((t) => t.id === body.templateId)
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

    // Variables base que se inyectan en la plantilla
    // El caller puede sobreescribir cualquiera via body.vars
    const vars: Record<string, string> = {
      bandName: 'Rebound Rock Band',
      replyEmail: siteContent.contactEmail,
      serviceArea: siteContent.serviceArea,
      contactEmail: siteContent.contactEmail,
      ...body.vars,
    }

    // Si el admin editó el correo manualmente, usar ese contenido directamente
    // Si no, renderizar la plantilla con las variables
    const rendered = (body.subject && body.bodyHtml)
      ? { subject: body.subject, bodyHtml: body.bodyHtml }
      : renderTemplate(template, vars)

    // Intentar enviar — el emailService decide si lo manda de verdad o solo loguea
    let resendEmailId: string | undefined
    let sendStatus: 'sent' | 'failed' = 'sent'
    let errorMessage: string | undefined

    try {
      const result = await sendOutreachEmail({
        toEmail: body.toEmail,
        subject: rendered.subject,
        bodyHtml: rendered.bodyHtml,
        // reply-to personalizado para rastrear respuestas por booking
        replyTo: `booking+bk-${id}@reboundrockband.com`,
      })
      resendEmailId = result.resendEmailId
    } catch (err) {
      sendStatus = 'failed'
      errorMessage = err instanceof Error ? err.message : String(err)
    }

    // Guardar el log del correo en la BD independientemente del resultado
    const emailLog = await addBookingEmailLog({
      entityType: 'booking',
      entityId: id,
      toEmail: body.toEmail,
      subject: rendered.subject,
      bodyHtml: rendered.bodyHtml,
      templateId: template.id,
      templateSlug: template.slug,
      sentAt: new Date().toISOString(),
      resendEmailId,
      status: sendStatus,
      errorMessage,
    })

    if (sendStatus === 'failed') {
      return NextResponse.json({ error: errorMessage ?? 'Send failed', emailLog }, { status: 502 })
    }

    return NextResponse.json({ success: true, emailLog })
  } catch (err) {
    console.error('[POST /api/bookings/[id]/send-email]', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
