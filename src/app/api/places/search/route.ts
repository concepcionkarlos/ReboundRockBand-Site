// api/places/search/route.ts — Google Places API (New) text search
//
// VENUE FINDER IS DISABLED. The route returns an empty result list immediately
// without ever reaching Google, so no API quota is consumed.
// To re-enable: set VENUE_FINDER_DISABLED = false and add
// GOOGLE_PLACES_API_KEY in Vercel project settings.

import { NextRequest, NextResponse } from 'next/server'
import type { PlaceSearchResult } from '@/lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Master kill-switch — flip to false and add GOOGLE_PLACES_API_KEY to re-enable
const VENUE_FINDER_DISABLED = false

export async function GET(req: NextRequest) {
  // Short-circuit before reading params or hitting Google — zero API cost
  if (VENUE_FINDER_DISABLED) {
    return NextResponse.json({
      results: [] as PlaceSearchResult[],
      devWarning:
        'Venue Finder is disabled. Set VENUE_FINDER_DISABLED = false and add GOOGLE_PLACES_API_KEY to re-enable.',
    })
  }

  // Parse search params from the URL
  const { searchParams } = req.nextUrl
  const keyword = searchParams.get('keyword')?.trim() ?? ''
  const city = searchParams.get('city')?.trim() ?? ''
  const q = searchParams.get('q')?.trim() ?? ''

  // Accept either ?q=... or ?keyword=...&city=...
  const textQuery = q || [keyword, city].filter(Boolean).join(' ')

  if (!textQuery) {
    return NextResponse.json(
      { error: 'Provide keyword and city, or a search query q' },
      { status: 400 }
    )
  }

  // Guard: make sure the key is configured before calling Google
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({
      results: [],
      devWarning:
        'GOOGLE_PLACES_API_KEY is not set. Add it to .env.local or Vercel env vars to enable real venue search.',
    })
  }

  try {
    // Call Google Places API (New) — POST with a JSON body
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Key goes in the header per Places API v2 spec (not in the URL)
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
        // Only request the fields we actually use — Google bills per field mask
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.formattedAddress',
          'places.nationalPhoneNumber',
          'places.websiteUri',
          'places.rating',
          'places.types',
          'places.businessStatus',
        ].join(','),
      },
      body: JSON.stringify({
        textQuery,
        languageCode: 'en',
        maxResultCount: 20,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[places/search] Google API error:', err)
      return NextResponse.json({ error: 'Google Places API error', details: err }, { status: 502 })
    }

    // Raw shape returned by the Places API
    const data = (await res.json()) as {
      places?: {
        id: string
        displayName?: { text: string }
        formattedAddress?: string
        nationalPhoneNumber?: string
        websiteUri?: string
        rating?: number
        types?: string[]
        businessStatus?: string
      }[]
    }

    // Strip permanently closed places and map to our internal type
    const results: PlaceSearchResult[] = (data.places ?? [])
      .filter((p) => p.businessStatus !== 'CLOSED_PERMANENTLY')
      .map((p) => ({
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
