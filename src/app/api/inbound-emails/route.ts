import { NextRequest, NextResponse } from 'next/server'
import { getInboundEmails, getInboundEmailsForEntity } from '@/lib/venueStore'
import type { InboundEmail } from '@/lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const entityType = searchParams.get('entityType') as InboundEmail['entityType'] | null
    const entityId = searchParams.get('entityId')

    const emails = entityType && entityId
      ? await getInboundEmailsForEntity(entityType, entityId)
      : await getInboundEmails()

    return NextResponse.json({ emails })
  } catch (err) {
    console.error('[GET /api/inbound-emails]', err)
    return NextResponse.json({ error: 'Failed to load emails' }, { status: 500 })
  }
}
