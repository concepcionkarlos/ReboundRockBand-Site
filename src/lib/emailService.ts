// emailService.ts — All outbound email logic (Resend)
//
// Sending is enabled. Requires RESEND_API_KEY in the environment.
// If the key is missing, falls back to DEV_MODE (console-only logging).

import type { BookingRequest } from './data'
import {
  getAutoReplyLogForBooking,
  addAutoReplyLog,
  updateAutoReplyLog,
  getTemplateBySlug,
} from './venueStore'
import { renderTemplate } from './templateUtils'

// "From" address shown in outbound emails
const FROM =
  process.env.RESEND_FROM_EMAIL ?? 'Rebound Rock Band <noreply@reboundrockband.com>'

// Master kill-switch — flip to false (and set RESEND_API_KEY) to re-enable sending
const EMAIL_DISABLED = false

// True when either the kill-switch is on or the API key is missing
const DEV_MODE = EMAIL_DISABLED || !process.env.RESEND_API_KEY

// Sends an auto-reply to the client 5 minutes after they submit a booking request
export async function triggerAutoReply(booking: BookingRequest): Promise<void> {
  // Skip if we already sent (or scheduled) a reply for this booking
  const existing = await getAutoReplyLogForBooking(booking.id)
  if (existing && (existing.status === 'scheduled' || existing.status === 'sent')) {
    return
  }

  // Schedule 5 minutes out
  const scheduledAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

  // Write the log first — acts as a distributed lock to prevent double sends
  const log = await addAutoReplyLog({
    bookingId: booking.id,
    scheduledAt,
    status: 'scheduled',
  })

  // Disabled — just log and mark sent so the record stays clean
  if (DEV_MODE) {
    console.log(
      `[auto-reply][DISABLED] Would send to ${booking.email} for booking ${booking.id} at ${scheduledAt}`
    )
    await updateAutoReplyLog(log.id, {
      status: 'sent',
      sentAt: new Date().toISOString(),
    })
    return
  }

  // Load the "booking-auto-reply" template from the database
  const template = await getTemplateBySlug('booking-auto-reply')
  if (!template) {
    await updateAutoReplyLog(log.id, {
      status: 'failed',
      errorMessage: 'Template "booking-auto-reply" not found',
    })
    return
  }

  // Substitute template variables with the actual booking data
  const clientName = booking.fullName.split(' ')[0] || booking.fullName
  const { subject, bodyHtml } = renderTemplate(template, {
    clientName,
    eventDate: booking.eventDate || '(date not specified)',
    eventType: booking.eventType || 'your event',
    bandName: 'Rebound Rock Band',
  })

  // Call Resend with a 5-minute scheduled delay
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
    // Record the error so admin can review it in the dashboard
    await updateAutoReplyLog(log.id, {
      status: 'failed',
      errorMessage: err instanceof Error ? err.message : String(err),
    })
  }
}

// Sends an internal alert to the admin when a new booking request arrives
export async function sendAdminNotification(opts: {
  toEmail: string
  subject: string
  bodyHtml: string
}): Promise<void> {
  // Disabled — only log, don't send
  if (DEV_MODE) {
    console.log(`[admin-notify][DISABLED] Would send to ${opts.toEmail}: ${opts.subject}`)
    return
  }

  // Non-critical — swallow errors silently so they never break the booking flow
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: FROM,
      to: opts.toEmail,
      subject: opts.subject,
      html: opts.bodyHtml,
    })
  } catch { /* intentionally ignored */ }
}

// Sends admin-initiated outreach emails to venues or clients
export async function sendOutreachEmail(opts: {
  toEmail: string
  subject: string
  bodyHtml: string
  replyTo?: string
}): Promise<{ resendEmailId?: string }> {
  // Disabled — return a fake ID so the email log still gets written to the DB
  if (DEV_MODE) {
    console.log(
      `[outreach][DISABLED] Would send to ${opts.toEmail}: ${opts.subject}` +
      (opts.replyTo ? ` (reply-to: ${opts.replyTo})` : '')
    )
    return { resendEmailId: `disabled-${Date.now()}` }
  }

  // Live send via Resend
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
