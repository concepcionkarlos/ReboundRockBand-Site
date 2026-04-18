import { NextRequest, NextResponse } from 'next/server'
import { updateTemplate } from '@/lib/venueStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json() as { name?: string; subject?: string; bodyHtml?: string }
    const allowed: (keyof typeof body)[] = ['name', 'subject', 'bodyHtml']
    const patch = Object.fromEntries(
      allowed.filter((k) => body[k] !== undefined).map((k) => [k, body[k]])
    ) as { name?: string; subject?: string; bodyHtml?: string }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const template = await updateTemplate(id, patch)
    return NextResponse.json({ template })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Update failed'
    return NextResponse.json({ error: msg }, { status: msg.includes('not found') ? 404 : 500 })
  }
}
