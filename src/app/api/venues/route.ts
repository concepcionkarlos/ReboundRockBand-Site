import { NextRequest, NextResponse } from 'next/server'
import { getVenues, addVenue, readVenueStore } from '@/lib/venueStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const venues = await getVenues()
    return NextResponse.json({ venues })
  } catch (err) {
    console.error('[GET /api/venues]', err)
    return NextResponse.json({ error: 'Failed to load venues' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      placeId: string
      name: string
      address: string
      website?: string
      phone?: string
      rating?: number
      types?: string[]
    }

    if (!body.placeId || !body.name || !body.address) {
      return NextResponse.json({ error: 'placeId, name, and address are required' }, { status: 400 })
    }

    // Deduplication by Google Place ID
    const store = await readVenueStore()
    const existing = store.venues.find((v) => v.placeId === body.placeId)
    if (existing) {
      return NextResponse.json(
        { error: 'Venue already saved', id: existing.id },
        { status: 409 }
      )
    }

    const venue = await addVenue({
      placeId: body.placeId,
      name: body.name,
      address: body.address,
      website: body.website,
      phone: body.phone,
      rating: body.rating,
      types: body.types ?? [],
      status: 'New',
    })

    return NextResponse.json({ venue }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/venues]', err)
    return NextResponse.json({ error: 'Failed to save venue' }, { status: 500 })
  }
}
