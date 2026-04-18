import { NextRequest, NextResponse } from 'next/server'
import { updateVenue, deleteVenue, readVenueStore, getOutreachLogsForVenue } from '@/lib/venueStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const store = await readVenueStore()
    const venue = store.venues.find((v) => v.id === id)
    if (!venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    const outreachLogs = await getOutreachLogsForVenue(id)
    return NextResponse.json({ venue, outreachLogs })
  } catch (err) {
    console.error('[GET /api/venues/[id]]', err)
    return NextResponse.json({ error: 'Failed to load venue' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const patch = await req.json() as Record<string, unknown>
    const venue = await updateVenue(id, patch)
    return NextResponse.json({ venue })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Update failed'
    return NextResponse.json({ error: msg }, { status: msg.includes('not found') ? 404 : 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteVenue(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/venues/[id]]', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
