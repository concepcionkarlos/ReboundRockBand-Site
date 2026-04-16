import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/store'

const ALLOWED = ['shows', 'merch', 'bandMembers', 'siteContent', 'mediaItems', 'epkContent', 'bookingRequests']

export async function GET() {
  const content = readContent()
  return NextResponse.json(content)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { section, data } = body as { section: string; data: unknown }
    if (!ALLOWED.includes(section)) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }
    const next = writeContent({ [section]: data } as Parameters<typeof writeContent>[0])
    return NextResponse.json(next)
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
