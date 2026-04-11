'use client'

import { useState, useEffect } from 'react'
import AdminShows from './sections/AdminShows'
import AdminMerch from './sections/AdminMerch'
import AdminMedia from './sections/AdminMedia'
import AdminContent from './sections/AdminContent'
import AdminDashboard from './sections/AdminDashboard'
import AdminBandMembers from './sections/AdminBandMembers'
import AdminLogin from './AdminLogin'
import Image from 'next/image'
import Link from 'next/link'
import { shows, merch, bandMembers } from '@/lib/data'

// Password is set via NEXT_PUBLIC_ADMIN_PASSWORD env var.
// Default used if var is not defined (change before production deploy).
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Rebound2024!'
const AUTH_KEY = 'rrb-admin-auth'

type Section = 'dashboard' | 'members' | 'shows' | 'merch' | 'media' | 'content'

const navItems: { id: Section; label: string; badge?: number; icon: React.ReactNode }[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: 'members',
    label: 'Band Members',
    badge: bandMembers.length,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    id: 'shows',
    label: 'Shows',
    badge: shows.length,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'merch',
    label: 'Merch',
    badge: merch.length,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: 'media',
    label: 'Media',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'content',
    label: 'Content',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
]

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [active, setActive] = useState<Section>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auth disabled — open access
  useEffect(() => {
    setAuthed(true)
    setAuthChecked(true)
  }, [])

  const handleLogin = (_password: string): boolean => true

  const handleLogout = () => {}

  const navigate = (section: Section) => {
    setActive(section)
    setSidebarOpen(false)
  }

  // Prevent flash before localStorage check completes
  if (!authChecked) return null

  // Show login screen if not authenticated
  if (!authed) return <AdminLogin onLogin={handleLogin} />

  const sectionMap: Record<Section, React.ReactNode> = {
    dashboard: <AdminDashboard onNavigate={(s) => navigate(s as Section)} />,
    members: <AdminBandMembers />,
    shows: <AdminShows />,
    merch: <AdminMerch />,
    media: <AdminMedia />,
    content: <AdminContent />,
  }

  const currentNav = navItems.find((n) => n.id === active)

  return (
    <div className="flex min-h-screen bg-[#07070f]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-[220px] z-30 flex flex-col transition-transform duration-300 bg-[#0a0a18] border-r border-white/6
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/6 flex-shrink-0">
          <div className="relative h-8 w-8 flex-shrink-0">
            <Image src="/logo-improved.png" alt="Rebound Rock Band" fill className="object-contain" />
          </div>
          <div className="min-w-0">
            <div className="font-display uppercase text-[13px] text-white leading-none tracking-wide truncate">
              Rebound <span className="text-brand-red">Rock Band</span>
            </div>
            <div className="font-heading text-[9px] text-white/25 uppercase tracking-widest mt-0.5">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5">
          <div className="mb-1">
            <span className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/20 px-2.5 mb-2 block">
              Navigation
            </span>
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2.5 mb-0.5 text-left transition-all font-heading text-xs uppercase tracking-widest relative group
                    ${isActive
                      ? 'text-white bg-white/6 border-l-2 border-brand-red pl-[9px]'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/4 border-l-2 border-transparent pl-[9px]'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-brand-red' : 'text-white/30 group-hover:text-white/50 transition-colors'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {item.badge !== undefined && (
                    <span className={`font-body text-[10px] px-1.5 py-0.5 rounded-sm ${
                      isActive ? 'bg-brand-red/20 text-brand-red' : 'bg-white/8 text-white/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-white/6 flex-shrink-0 flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 font-heading text-[10px] uppercase tracking-widest text-white/25 hover:text-white/60 transition-colors py-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-heading text-[10px] uppercase tracking-widest text-white/20 hover:text-red-400/60 transition-colors py-1 text-left"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Sign Out
          </button>
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
            <span className="font-body text-[10px] text-white/20">Site Live</span>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 px-5 lg:px-8 h-14 border-b border-white/6 bg-[#08080f] sticky top-0 z-10 flex-shrink-0">
          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/40 hover:text-white p-1 -ml-1 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="font-heading text-[10px] uppercase tracking-widest text-white/20 hidden sm:block">Admin</span>
              <span className="text-white/15 hidden sm:block">/</span>
              <span className="font-heading text-[10px] uppercase tracking-widest text-white/60">
                {currentNav?.label}
              </span>
            </div>
          </div>

          {/* Right: site link */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 font-heading text-[10px] uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors"
          >
            reboundrockband.com
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </Link>
        </div>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {sectionMap[active]}
        </main>
      </div>
    </div>
  )
}
