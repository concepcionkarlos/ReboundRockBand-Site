import type { BookingRequest } from './data'
import {
  getAutoReplyLogForBooking,
  addAutoReplyLog,
  updateAutoReplyLog,
  getTemplateBySlug,
} from './venueStore'
import { renderTemplate } from './templateUtils'

const FROM =
  process.env.RESEND_FROM_EMAIL ?? 'Rebound Rock Band <noreply@reboundrockband.com>'
const DEV_MODE = !process.env.RESEND_API_KEY

export async function triggerAutoReply(booking: BookingRequest): Promise<void> {
  // 1. Idempotency check — never send twice for the same booking
  const existing = await getAutoReplyLogForBooking(booking.id)
  if (existing && (existing.status === 'scheduled' || existing.status === 'sent')) {
    return
  }

  const scheduledAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

  // 2. Write log immediately — acts as a soft lock before calling Resend
  const log = await addAutoReplyLog({
    bookingId: booking.id,
    scheduledAt,
    status: 'scheduled',
  })

  // 3. Dev mode — no Resend call, just console + mark sent
  if (DEV_MODE) {
    console.log(
      `[auto-reply][DEV] Would send to ${booking.email} for booking ${booking.id} at ${scheduledAt}`
    )
    await updateAutoReplyLog(log.id, {
      status: 'sent',
      sentAt: new Date().toISOString(),
    })
    return
  }

  // 4. Load template
  const template = await getTemplateBySlug('booking-auto-reply')
  if (!template) {
    await updateAutoReplyLog(log.id, {
      status: 'failed',
      errorMessage: 'Template "booking-auto-reply" not found',
    })
    return
  }

  // 5. Render variables
  const clientName = booking.fullName.split(' ')[0] || booking.fullName
  const { subject, bodyHtml } = renderTemplate(template, {
    clientName,
    eventDate: booking.eventDate || '(date not specified)',
    eventType: booking.eventType || 'your event',
    bandName: 'Rebound Rock Band',
  })

  // 6. Send via Resend with 5-minute delay
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
    await updateAutoReplyLog(log.id, {
      status: 'failed',
      errorMessage: err instanceof Error ? err.message : String(err),
    })
  }
}

export async function sendOutreachEmail(opts: {
  toEmail: string
  subject: string
  bodyHtml: string
  replyTo?: string
}): Promise<{ resendEmailId?: string }> {
  if (DEV_MODE) {
    console.log(`[outreach][DEV] Would send to ${opts.toEmail}: ${opts.subject}${opts.replyTo ? ` (reply-to: ${opts.replyTo})` : ''}`)
    return { resendEmailId: `dev-${Date.now()}` }
  }
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
