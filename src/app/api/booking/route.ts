// api/booking/route.ts — Public booking form submission
//
// Validates required fields, generates a unique ID, and saves to the database.

import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import type { BookingRequest } from '@/lib/data'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

    const emailVal = String(body.email ?? '').trim()
    if (!EMAIL_RE.test(emailVal)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
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

    // Return the new booking ID so the frontend can display a confirmation
    return NextResponse.json({ success: true, id: newRequest.id })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
