import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

async function tokenFor(password: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

const COOKIE = 'admin_session'
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 * 30,
  path: '/',
}

function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD ?? process.env.NEXT_PUBLIC_ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  const adminPwd = getAdminPassword()
  if (!adminPwd) return NextResponse.json({ ok: true })

  const session = req.cookies.get(COOKIE)?.value
  if (!session) return NextResponse.json({ ok: false }, { status: 401 })

  const expected = await tokenFor(adminPwd)
  if (session !== expected) return NextResponse.json({ ok: false }, { status: 401 })

  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  const { password } = await req.json() as { password?: string }
  const adminPwd = getAdminPassword()

  if (adminPwd && password !== adminPwd) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = adminPwd ? await tokenFor(adminPwd) : 'no-auth'
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, token, COOKIE_OPTS)
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COOKIE)
  return res
}
