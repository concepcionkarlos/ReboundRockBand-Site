import { NextRequest, NextResponse } from 'next/server'

// These routes are callable without authentication
const PUBLIC_API = new Set([
  '/api/booking',
  '/api/song-request',
  '/api/admin/login',
])

async function tokenFor(password: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/api/') || PUBLIC_API.has(pathname)) {
    return NextResponse.next()
  }

  const adminPwd = process.env.ADMIN_PASSWORD ?? process.env.NEXT_PUBLIC_ADMIN_PASSWORD
  if (!adminPwd) return NextResponse.next() // no password configured

  const session = req.cookies.get('admin_session')?.value
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const expected = await tokenFor(adminPwd)
  if (session !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
