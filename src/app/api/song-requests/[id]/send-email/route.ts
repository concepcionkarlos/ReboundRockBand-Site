// ─── api/song-requests/[id]/send-email/route.ts ────────────────────────────
// Permite al admin enviar un correo de respuesta a quien hizo una song request.
// Funciona igual que el send-email de bookings pero para el flujo de EPK.
// El envío real está desactivado en emailService.ts — ver ese archivo para reactivar.
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
    // Obtener el ID de la song request desde la URL dinámica
    const { id } = await params

    const body = await req.json() as {
      templateId: string
      toEmail: string
      subject?: string   // override si el admin editó el asunto manualmente
      bodyHtml?: string  // override si el admin editó el cuerpo manualmente
      vars?: Record<string, string>
    }

    if (!body.templateId || !body.toEmail) {
      return NextResponse.json({ error: 'templateId and toEmail are required' }, { status: 400 })
    }

    // Cargar plantillas y config del sitio en paralelo
    const [templates, { siteContent }] = await Promise.all([getTemplates(), readContent()])

    // Buscar la plantilla elegida por el admin
    const template = templates.find((t) => t.id === body.templateId)
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

    // Variables base para inyectar en la plantilla
    const vars: Record<string, string> = {
      bandName: 'Rebound Rock Band',
      replyEmail: siteContent.contactEmail,
      serviceArea: siteContent.serviceArea,
      contactEmail: siteContent.contactEmail,
      ...body.vars,
    }

    // Si el admin editó el correo manualmente, usar ese contenido directamente
    const rendered = (body.subject && body.bodyHtml)
      ? { subject: body.subject, bodyHtml: body.bodyHtml }
      : renderTemplate(template, vars)

    // Intentar enviar el correo (puede estar desactivado en emailService.ts)
    let resendEmailId: string | undefined
    let sendStatus: 'sent' | 'failed' = 'sent'
    let errorMessage: string | undefined

    try {
      const result = await sendOutreachEmail({
        toEmail: body.toEmail,
        subject: rendered.subject,
        bodyHtml: rendered.bodyHtml,
        // reply-to con prefijo sr- para identificar respuestas de song requests
        replyTo: `booking+sr-${id}@reboundrockband.com`,
      })
      resendEmailId = result.resendEmailId
    } catch (err) {
      sendStatus = 'failed'
      errorMessage = err instanceof Error ? err.message : String(err)
    }

    // Guardar el log del correo en la BD independientemente del resultado
    const emailLog = await addBookingEmailLog({
      entityType: 'song-request',
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
    console.error('[POST /api/song-requests/[id]/send-email]', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
