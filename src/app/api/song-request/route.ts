import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'
import type { SongRequest } from '@/lib/data'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>

    const song1 = String(body.song1 ?? '').trim()
    const fullName = String(body.fullName ?? '').trim()
    const email = String(body.email ?? '').trim()

    if (!fullName || !email || !song1) {
      return NextResponse.json({ error: 'Missing required fields: fullName, email, song1' }, { status: 400 })
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

    return NextResponse.json({ success: true, id: newRequest.id })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
