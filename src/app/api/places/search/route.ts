import { NextRequest, NextResponse } from 'next/server'
import type { PlaceSearchResult } from '@/lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const keyword = searchParams.get('keyword')?.trim() ?? ''
  const city = searchParams.get('city')?.trim() ?? ''
  const q = searchParams.get('q')?.trim() ?? ''

  // Build the text query
  const textQuery = q || [keyword, city].filter(Boolean).join(' ')

  if (!textQuery) {
    return NextResponse.json({ error: 'Provide keyword and city, or a search query q' }, { status: 400 })
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({
      results: [],
      devWarning: 'GOOGLE_PLACES_API_KEY is not set. Add it to .env.local to enable real venue search.',
    })
  }

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
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
