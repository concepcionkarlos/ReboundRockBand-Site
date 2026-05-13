// ─── api/places/search/route.ts ────────────────────────────────────────────
// Endpoint para buscar venues/locales usando Google Places API (New).
// DESACTIVADO — el Venue Finder no está en uso actualmente.
// Para reactivarlo: agregar GOOGLE_PLACES_API_KEY en Vercel → Settings → Env vars
// y cambiar VENUE_FINDER_DISABLED a false más abajo.
// ──────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import type { PlaceSearchResult } from '@/lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Controla si el Venue Finder está habilitado o no.
// Cambiar a false y configurar GOOGLE_PLACES_API_KEY para reactivar.
const VENUE_FINDER_DISABLED = true

export async function GET(req: NextRequest) {
  // Si está desactivado manualmente, devolver respuesta vacía sin llamar a Google
  if (VENUE_FINDER_DISABLED) {
    return NextResponse.json({
      results: [] as PlaceSearchResult[],
      devWarning: 'El Venue Finder está desactivado. Configura GOOGLE_PLACES_API_KEY y pon VENUE_FINDER_DISABLED en false para reactivarlo.',
    })
  }

  // Leer los parámetros de búsqueda de la URL
  const { searchParams } = req.nextUrl
  const keyword = searchParams.get('keyword')?.trim() ?? ''
  const city = searchParams.get('city')?.trim() ?? ''
  const q = searchParams.get('q')?.trim() ?? ''

  // Construir el query de texto — acepta ?q=... o ?keyword=...&city=...
  const textQuery = q || [keyword, city].filter(Boolean).join(' ')

  if (!textQuery) {
    return NextResponse.json(
      { error: 'Provide keyword and city, or a search query q' },
      { status: 400 }
    )
  }

  // Verificar que la API key de Google está configurada en el entorno
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({
      results: [],
      devWarning: 'GOOGLE_PLACES_API_KEY no está configurado. Agrégalo en .env.local o en Vercel para habilitar la búsqueda real de venues.',
    })
  }

  try {
    // Llamar a la Google Places API (New) con búsqueda por texto
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // La API key va en el header, no en la URL (requisito de Places API v2)
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
        // Solo pedimos los campos que necesitamos (facturación por campo en Google)
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
      console.error('[places/search] Error de Google API:', err)
      return NextResponse.json(
        { error: 'Google Places API error', details: err },
        { status: 502 }
      )
    }

    // Tipar la respuesta cruda de Google Places
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

    // Filtrar lugares cerrados permanentemente y mapear al formato interno
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
