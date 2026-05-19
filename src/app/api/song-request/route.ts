import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import type { SongRequest } from '@/lib/data'
import crypto from 'crypto'
import { sendAdminNotification } from '@/lib/emailService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>

    const song1 = String(body.song1 ?? '').trim()
    const fullName = String(body.fullName ?? '').trim()
    const email = String(body.email ?? '').trim()

    if (!fullName || !email || !song1) {
      return NextResponse.json({ error: 'Missing required fields: fullName, email, song1' }, { status: 400 })
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const newRequest: SongRequest = {
      id: crypto.randomBytes(8).toString('hex'),
      fullName,
      email,
      eventDate: String(body.eventDate ?? '').trim() || undefined,
      song1,
      song2: String(body.song2 ?? '').trim() || undefined,
      song3: String(body.song3 ?? '').trim() || undefined,
      notes: String(body.notes ?? '').trim() || undefined,
      bookingRequestId: String(body.bookingRequestId ?? '').trim() || undefined,
      status: 'New',
      createdAt: now,
      updatedAt: now,
    }

    const current = await readContent()
    const updated = [...(current.songRequests ?? []), newRequest]
    await writeContent({ songRequests: updated })

    const adminEmail = current.siteContent?.contactEmail
    if (adminEmail) {
      const songs = [newRequest.song1, newRequest.song2, newRequest.song3].filter(Boolean).join(' · ')
      const rows = [
        ['From', newRequest.fullName],
        ['Email', newRequest.email],
        ['Songs', songs],
        ...(newRequest.eventDate ? [['Event Date', newRequest.eventDate] as [string, string]] : []),
        ...(newRequest.notes ? [['Notes', newRequest.notes] as [string, string]] : []),
      ].map(([l, v]) => `<tr><td style="padding:6px 12px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;border-bottom:1px solid #1e1e2e">${esc(l)}</td><td style="padding:6px 12px;font-size:14px;color:#fff;border-bottom:1px solid #1e1e2e">${esc(v)}</td></tr>`).join('')
      void sendAdminNotification({
        toEmail: adminEmail,
        subject: `New Song Request: ${newRequest.fullName} — ${newRequest.song1}`,
        bodyHtml: `<!DOCTYPE html><html><body style="background:#080810;color:#fff;font-family:Arial,sans-serif;padding:32px"><h2 style="color:#e0101e;font-size:20px;margin:0 0 20px">New Song Request</h2><table style="border-collapse:collapse;width:100%;max-width:560px">${rows}</table><p style="margin-top:24px;font-size:12px;color:#555">Rebound Rock Band · reboundrockband.com</p></body></html>`,
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, id: newRequest.id })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
