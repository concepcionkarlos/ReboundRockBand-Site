import { NextRequest, NextResponse } from 'next/server'
import { getBookingEmailLogs } from '@/lib/venueStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const logs = await getBookingEmailLogs('song-request', id)
    return NextResponse.json({ logs })
  } catch (err) {
    console.error('[GET /api/song-requests/[id]/email-logs]', err)
    return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 })
  }
}
