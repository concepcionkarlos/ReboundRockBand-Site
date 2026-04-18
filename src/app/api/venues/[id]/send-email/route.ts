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
    const { id } = await params
    const body = await req.json() as {
      templateId: string
      toEmail: string
      vars?: Record<string, string>
    }

    if (!body.templateId || !body.toEmail) {
      return NextResponse.json({ error: 'templateId and toEmail are required' }, { status: 400 })
    }

    const [store, templates, { siteContent }] = await Promise.all([
      readVenueStore(),
      getTemplates(),
      readContent(),
    ])

    const venue = store.venues.find((v) => v.id === id)
    if (!venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 })

    const template = templates.find((t) => t.id === body.templateId)
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

    // Build template variables
    const vars: Record<string, string> = {
      venueName: venue.name,
      bandName: 'Rebound Rock Band',
      serviceArea: siteContent.serviceArea,
      contactEmail: siteContent.contactEmail,
      ...body.vars,
    }

    const { subject, bodyHtml } = renderTemplate(template, vars)

    // Send via Resend (or dev log)
    let resendEmailId: string | undefined
    let sendStatus: 'sent' | 'failed' = 'sent'
    let errorMessage: string | undefined

    try {
      const result = await sendOutreachEmail({ toEmail: body.toEmail, subject, bodyHtml })
      resendEmailId = result.resendEmailId
    } catch (err) {
      sendStatus = 'failed'
      errorMessage = err instanceof Error ? err.message : String(err)
    }

    // Write outreach log
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

    // Update venue: lastContactedAt + advance status if New/Reviewed
    const statusAdvance =
      sendStatus === 'sent' &&
      (venue.status === 'New' || venue.status === 'Reviewed' || venue.status === 'Contact Added' || venue.status === 'Draft Ready')
        ? { status: 'Sent' as const }
        : {}

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
