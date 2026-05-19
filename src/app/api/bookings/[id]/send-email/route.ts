// api/bookings/[id]/send-email/route.ts — Admin-triggered email to a booking client
//
// Loads the selected template, renders it with booking-specific variables,
// sends via emailService (currently disabled — logs only), and records the
// result in the email log regardless of send outcome.

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
    // Get the booking ID from the dynamic route segment
    const { id } = await params

    const body = await req.json() as {
      templateId: string
      toEmail: string
      subject?: string   // optional — present when admin manually edited the subject
      bodyHtml?: string  // optional — present when admin manually edited the body
      vars?: Record<string, string>
    }

    if (!body.templateId || !body.toEmail) {
      return NextResponse.json({ error: 'templateId and toEmail are required' }, { status: 400 })
    }

    // Load templates and site config in parallel
    const [templates, { siteContent }] = await Promise.all([
      getTemplates(),
      readContent(),
    ])

    const template = templates.find((t) => t.id === body.templateId)
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

    // Base variables injected into every template; caller vars take priority
    const vars: Record<string, string> = {
      bandName: 'Rebound Rock Band',
      replyEmail: siteContent.contactEmail,
      serviceArea: siteContent.serviceArea,
      contactEmail: siteContent.contactEmail,
      ...body.vars,
    }

    // If the admin edited the email manually, skip template rendering and use it as-is
    const rendered = (body.subject && body.bodyHtml)
      ? { subject: body.subject, bodyHtml: body.bodyHtml }
      : renderTemplate(template, vars)

    let resendEmailId: string | undefined
    let sendStatus: 'sent' | 'failed' = 'sent'
    let errorMessage: string | undefined

    try {
      const result = await sendOutreachEmail({
        toEmail: body.toEmail,
        subject: rendered.subject,
        bodyHtml: rendered.bodyHtml,
        // Unique reply-to per booking so inbound replies are traceable
        replyTo: `booking+bk-${id}@reboundrockband.com`,
      })
      resendEmailId = result.resendEmailId
    } catch (err) {
      sendStatus = 'failed'
      errorMessage = err instanceof Error ? err.message : String(err)
    }

    // Always write the log — even failures are recorded for admin review
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
