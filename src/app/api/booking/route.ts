import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import type { BookingRequest } from '@/lib/data'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const REQUIRED_FIELDS = ['fullName', 'email', 'eventDate', 'eventType'] as const

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>

    for (const field of REQUIRED_FIELDS) {
      if (!body[field] || String(body[field]).trim() === '') {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const now = new Date().toISOString()
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

    const current = readContent()
    const updated = [...(current.bookingRequests ?? []), newRequest]
    writeContent({ bookingRequests: updated })

    return NextResponse.json({ success: true, id: newRequest.id })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
