import { NextRequest, NextResponse } from 'next/server'
import { markInboundEmailRead, deleteInboundEmail } from '@/lib/venueStore'

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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteInboundEmail(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/inbound-emails/[id]]', err)
    return NextResponse.json({ error: 'Failed to delete email' }, { status: 500 })
  }
}
