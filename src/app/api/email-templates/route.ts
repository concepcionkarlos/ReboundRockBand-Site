import { NextResponse } from 'next/server'
import { getTemplates } from '@/lib/venueStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const templates = await getTemplates()
    return NextResponse.json({ templates })
  } catch (err) {
    console.error('[GET /api/email-templates]', err)
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 })
  }
}
