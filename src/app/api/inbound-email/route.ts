import { NextRequest, NextResponse } from 'next/server'
import { addInboundEmail } from '@/lib/venueStore'
import type { InboundEmail } from '@/lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Resend sends inbound emails as POST to this endpoint.
// Set webhook URL in Resend dashboard: https://yourdomain.com/api/inbound-email?secret=YOUR_SECRET
// Add RESEND_WEBHOOK_SECRET to env to require the shared secret.

function parseFrom(raw: string): { fromEmail: string; fromName?: string } {
  const match = raw.match(/^(.*?)\s*<(.+)>$/)
  if (match) return { fromName: match[1].trim() || undefined, fromEmail: match[2].trim() }
  return { fromEmail: raw.trim() }
}

function parseEntityTag(toAddress: string): {
  entityType?: InboundEmail['entityType']
  entityId?: string
} {
  const tagMatch = toAddress.match(/\+([^@]+)@/)
  if (!tagMatch) return {}
  const tag = tagMatch[1]
  if (tag.startsWith('bk-')) return { entityType: 'booking', entityId: tag.slice(3) }
  if (tag.startsWith('sr-')) return { entityType: 'song-request', entityId: tag.slice(3) }
  if (tag.startsWith('ve-')) return { entityType: 'venue', entityId: tag.slice(3) }
  return {}
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.RESEND_WEBHOOK_SECRET
    if (secret) {
      const url = new URL(req.url)
      if (url.searchParams.get('secret') !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body = await req.json() as {
      from?: string
      to?: string[]
      subject?: string
      text?: string
      html?: string
      messageId?: string
    }

    const fromRaw = body.from ?? ''
    const toRaw = Array.isArray(body.to) ? body.to : [body.to ?? '']
    const toEmail = toRaw[0] ?? ''

    const { fromEmail, fromName } = parseFrom(fromRaw)
    const { entityType, entityId } = parseEntityTag(toEmail)

    await addInboundEmail({
      fromEmail,
      fromName,
      toEmail,
      subject: body.subject ?? '(no subject)',
      bodyText: body.text,
      bodyHtml: body.html,
      receivedAt: new Date().toISOString(),
      entityType,
      entityId,
      read: false,
      resendMessageId: body.messageId,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/inbound-email]', err)
    return NextResponse.json({ error: 'Failed to store inbound email' }, { status: 500 })
  }
}
