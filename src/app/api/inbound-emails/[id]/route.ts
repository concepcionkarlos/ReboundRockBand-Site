import { NextRequest, NextResponse } from 'next/server'
import { markInboundEmailRead } from '@/lib/venueStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await markInboundEmailRead(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[PATCH /api/inbound-emails/[id]]', err)
    return NextResponse.json({ error: 'Failed to mark read' }, { status: 500 })
  }
}
