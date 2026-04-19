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
    const { id } = await params
    const body = await req.json() as {
      templateId: string
      toEmail: string
      subject?: string
      bodyHtml?: string
      vars?: Record<string, string>
    }

    if (!body.templateId || !body.toEmail) {
      return NextResponse.json({ error: 'templateId and toEmail are required' }, { status: 400 })
    }

    const [templates, { siteContent }] = await Promise.all([getTemplates(), readContent()])

    const template = templates.find((t) => t.id === body.templateId)
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

    const vars: Record<string, string> = {
      bandName: 'Rebound Rock Band',
      replyEmail: siteContent.contactEmail,
      serviceArea: siteContent.serviceArea,
      contactEmail: siteContent.contactEmail,
      ...body.vars,
    }

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
        replyTo: `booking+sr-${id}@reboundrockband.com`,
      })
      resendEmailId = result.resendEmailId
    } catch (err) {
      sendStatus = 'failed'
      errorMessage = err instanceof Error ? err.message : String(err)
    }

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
