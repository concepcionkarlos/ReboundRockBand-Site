// ─── emailService.ts ───────────────────────────────────────────────────────
// Centraliza todo lo relacionado con el envío de correos via Resend.
// Por ahora el envío real está DESACTIVADO — todos los correos se loguean
// en consola pero no se mandan. Para reactivar, pon RESEND_ENABLED=true
// en las variables de entorno del proyecto (Vercel → Settings → Env vars)
// y asegúrate de que RESEND_API_KEY también esté configurado.
// ──────────────────────────────────────────────────────────────────────────

import type { BookingRequest } from './data'
import {
  getAutoReplyLogForBooking,
  addAutoReplyLog,
  updateAutoReplyLog,
  getTemplateBySlug,
} from './venueStore'
import { renderTemplate } from './templateUtils'

// Dirección "from" que aparece en los correos enviados
const FROM =
  process.env.RESEND_FROM_EMAIL ?? 'Rebound Rock Band <noreply@reboundrockband.com>'

// DESACTIVADO manualmente — cambiar a false para reactivar el envío real.
// Cuando está en true, ningún correo sale; solo se imprime en consola.
const EMAIL_DISABLED = true

// Comprueba también si la API key está configurada (doble seguro)
const DEV_MODE = EMAIL_DISABLED || !process.env.RESEND_API_KEY

// ─── Auto-reply al cliente después de que hace una reserva ─────────────────
export async function triggerAutoReply(booking: BookingRequest): Promise<void> {
  // Verificar si ya se envió un auto-reply para esta reserva (evitar duplicados)
  const existing = await getAutoReplyLogForBooking(booking.id)
  if (existing && (existing.status === 'scheduled' || existing.status === 'sent')) {
    return
  }

  // Programar el envío 5 minutos después del momento actual
  const scheduledAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

  // Guardar el registro en la base de datos antes de llamar a Resend
  // (actúa como candado para evitar envíos dobles)
  const log = await addAutoReplyLog({
    bookingId: booking.id,
    scheduledAt,
    status: 'scheduled',
  })

  // Si el correo está desactivado, solo loguear y marcar como enviado
  if (DEV_MODE) {
    console.log(
      `[auto-reply][DESACTIVADO] Se enviaría a ${booking.email} para la reserva ${booking.id} a las ${scheduledAt}`
    )
    await updateAutoReplyLog(log.id, {
      status: 'sent',
      sentAt: new Date().toISOString(),
    })
    return
  }

  // Cargar la plantilla de correo "booking-auto-reply" desde la base de datos
  const template = await getTemplateBySlug('booking-auto-reply')
  if (!template) {
    await updateAutoReplyLog(log.id, {
      status: 'failed',
      errorMessage: 'Template "booking-auto-reply" not found',
    })
    return
  }

  // Reemplazar variables en la plantilla con los datos reales de la reserva
  const clientName = booking.fullName.split(' ')[0] || booking.fullName
  const { subject, bodyHtml } = renderTemplate(template, {
    clientName,
    eventDate: booking.eventDate || '(date not specified)',
    eventType: booking.eventType || 'your event',
    bandName: 'Rebound Rock Band',
  })

  // Llamar a la API de Resend para enviar el correo con un delay de 5 minutos
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({
      from: FROM,
      to: booking.email,
      subject,
      html: bodyHtml,
      scheduledAt,
    })
    await updateAutoReplyLog(log.id, {
      resendEmailId: result.data?.id,
      status: 'scheduled',
      scheduledAt,
    })
  } catch (err) {
    // Si falla, guardar el error para revisión en el panel de admin
    await updateAutoReplyLog(log.id, {
      status: 'failed',
      errorMessage: err instanceof Error ? err.message : String(err),
    })
  }
}

// ─── Notificación interna al admin cuando llega una nueva reserva ───────────
export async function sendAdminNotification(opts: {
  toEmail: string
  subject: string
  bodyHtml: string
}): Promise<void> {
  // Si el correo está desactivado, solo loguear sin enviar nada
  if (DEV_MODE) {
    console.log(`[admin-notify][DESACTIVADO] Se enviaría a ${opts.toEmail}: ${opts.subject}`)
    return
  }

  // Enviar via Resend — si falla no es crítico, se ignora el error
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: FROM,
      to: opts.toEmail,
      subject: opts.subject,
      html: opts.bodyHtml,
    })
  } catch { /* no es crítico — se ignora silenciosamente */ }
}

// ─── Correos de outreach: admin envía emails a venues/clientes ──────────────
export async function sendOutreachEmail(opts: {
  toEmail: string
  subject: string
  bodyHtml: string
  replyTo?: string
}): Promise<{ resendEmailId?: string }> {
  // Si el correo está desactivado, simular envío exitoso sin llamar a Resend
  if (DEV_MODE) {
    console.log(
      `[outreach][DESACTIVADO] Se enviaría a ${opts.toEmail}: ${opts.subject}` +
      (opts.replyTo ? ` (reply-to: ${opts.replyTo})` : '')
    )
    // Devuelve un ID falso para que el log en la BD quede registrado igual
    return { resendEmailId: `disabled-${Date.now()}` }
  }

  // Envío real via Resend cuando está habilitado
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const result = await resend.emails.send({
    from: FROM,
    to: opts.toEmail,
    subject: opts.subject,
    html: opts.bodyHtml,
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  })
  return { resendEmailId: result.data?.id }
}
