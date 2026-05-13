// api/booking/route.ts — Public booking form submission
//
// Validates required fields, generates a unique ID, saves to the database,
// then fire-and-forgets an admin notification and client auto-reply.
// Email sending is disabled in emailService.ts — see that file to re-enable.

import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import type { BookingRequest } from '@/lib/data'
import crypto from 'crypto'
import { triggerAutoReply, sendAdminNotification } from '@/lib/emailService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Fields the client must include — all others are optional
const REQUIRED_FIELDS = ['fullName', 'email', 'eventDate', 'eventType'] as const

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>

    // Reject early if any required field is missing or blank
    for (const field of REQUIRED_FIELDS) {
      if (!body[field] || String(body[field]).trim() === '') {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const now = new Date().toISOString()

    // Build the booking record with a random 8-byte hex ID
    const newRequest: BookingRequest = {
      id: crypto.randomBytes(8).toString('hex'),
      fullName: String(body.fullName ?? '').trim(),
      venueOrCompany: String(body.venueOrCompany ?? '').trim(),
      email: String(body.email ?? '').trim(),
      phone: String(body.phone ?? '').trim(),
      eventDate: String(body.eventDate ?? '').trim(),
      city: String(body.city ?? '').trim(),
      eventType: String(body.eventType ?? '').trim(),
      budgetRange: String(body.budgetRange ?? '').trim(),
      guestCount: String(body.guestCount ?? '').trim(),
      message: String(body.message ?? '').trim(),
      source: 'website_form',
      status: 'New',
      createdAt: now,
      updatedAt: now,
    }

    // Append the new booking to the existing list and persist
    const current = await readContent()
    const updated = [...(current.bookingRequests ?? []), newRequest]
    await writeContent({ bookingRequests: updated })

    // Notify admin if a contact email is configured in site content
    const adminEmail = current.siteContent?.contactEmail
    if (adminEmail) {
      // Build an HTML summary table for the notification email
      const rows = [
        ['Name', newRequest.fullName],
        ['Email', newRequest.email],
        ['Phone', newRequest.phone || '—'],
        ['Event Date', newRequest.eventDate],
        ['Event Type', newRequest.eventType],
        ['City', newRequest.city || '—'],
        ['Budget', newRequest.budgetRange || '—'],
        ['Guests', newRequest.guestCount || '—'],
        ['Venue / Co.', newRequest.venueOrCompany || '—'],
        ['Message', newRequest.message || '—'],
      ]
        .map(
          ([l, v]) =>
            `<tr><td style="padding:6px 12px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;border-bottom:1px solid #1e1e2e">${l}</td><td style="padding:6px 12px;font-size:14px;color:#fff;border-bottom:1px solid #1e1e2e">${v}</td></tr>`
        )
        .join('')

      // Fire-and-forget — email failure must never block the HTTP response
      void sendAdminNotification({
        toEmail: adminEmail,
        subject: `New Booking Request: ${newRequest.fullName} — ${newRequest.eventDate}`,
        bodyHtml: `<!DOCTYPE html><html><body style="background:#080810;color:#fff;font-family:Arial,sans-serif;padding:32px"><h2 style="color:#e0101e;font-size:20px;margin:0 0 20px">New Booking Request</h2><table style="border-collapse:collapse;width:100%;max-width:560px">${rows}</table><p style="margin-top:24px;font-size:12px;color:#555">Rebound Rock Band · reboundrockband.com</p></body></html>`,
      }).catch(() => {})
    }

    // Trigger the client auto-reply — also fire-and-forget
    void triggerAutoReply(newRequest).catch((e) =>
      console.error('[auto-reply] failed to trigger:', e)
    )

    // Return the new booking ID so the frontend can display a confirmation
    return NextResponse.json({ success: true, id: newRequest.id })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
