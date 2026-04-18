import { NextRequest, NextResponse } from 'next/server'
import type { PlaceSearchResult } from '@/lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FAKE_RESULTS: PlaceSearchResult[] = [
  {
    placeId: 'dev_place_001',
    name: 'The Rock Pub Miami',
    address: '1234 Brickell Ave, Miami, FL 33131',
    phone: '(305) 555-0101',
    website: 'https://example.com',
    rating: 4.2,
    types: ['bar', 'night_club', 'establishment'],
  },
  {
    placeId: 'dev_place_002',
    name: 'Coral Gables Brewing Co.',
    address: '320 Miracle Mile, Coral Gables, FL 33134',
    phone: '(786) 555-0202',
    website: 'https://example.com',
    rating: 4.6,
    types: ['bar', 'brewery', 'establishment'],
  },
  {
    placeId: 'dev_place_003',
    name: 'Homestead Music Hall',
    address: '99 N Krome Ave, Homestead, FL 33030',
    phone: '(305) 555-0303',
    rating: 3.9,
    types: ['music_venue', 'event_venue', 'establishment'],
  },
]

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) {
    return NextResponse.json({ error: 'Missing query param q' }, { status: 400 })
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    // Dev fallback — return fake results so the UI works without an API key
    return NextResponse.json({ results: FAKE_RESULTS })
  }

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.types',
      },
      body: JSON.stringify({ textQuery: q, languageCode: 'en', maxResultCount: 10 }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[places/search] Google API error:', err)
      return NextResponse.json({ error: 'Google Places API error' }, { status: 502 })
    }

    const data = (await res.json()) as {
      places?: {
        id: string
        displayName?: { text: string }
        formattedAddress?: string
        nationalPhoneNumber?: string
        websiteUri?: string
        rating?: number
        types?: string[]
      }[]
    }

    const results: PlaceSearchResult[] = (data.places ?? []).map((p) => ({
      placeId: p.id,
      name: p.displayName?.text ?? '(Unknown)',
      address: p.formattedAddress ?? '',
      phone: p.nationalPhoneNumber,
      website: p.websiteUri,
      rating: p.rating,
      types: p.types ?? [],
    }))

    return NextResponse.json({ results })
  } catch (err) {
    console.error('[places/search]', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
