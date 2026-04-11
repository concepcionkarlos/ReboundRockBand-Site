'use client'

import { useState } from 'react'
import AdminShows from './sections/AdminShows'
import AdminMerch from './sections/AdminMerch'
import AdminMedia from './sections/AdminMedia'
import AdminContent from './sections/AdminContent'
import Image from 'next/image'
import Link from 'next/link'

type Section = 'shows' | 'merch' | 'media' | 'content'

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: 'shows',
    label: 'Shows',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'merch',
    label: 'Merch',
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
  const [active, setActive] = useState<Section>('shows')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sectionMap: Record<Section, React.ReactNode> = {
    shows: <AdminShows />,
    merch: <AdminMerch />,
    media: <AdminMedia />,
    content: <AdminContent />,
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-[#0c0c1a] border-r border-white/5 z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5 flex-shrink-0">
          <div className="relative h-9 w-9 flex-shrink-0">
            <Image src="/logo-improved.png" alt="Rebound Rock Band" fill className="object-contain" />
          </div>
          <div className="min-w-0">
            <div className="font-display uppercase text-sm text-white leading-none tracking-wide truncate">Rebound Rock Band</div>
            <div className="font-heading text-[9px] text-brand-red uppercase tracking-widest mt-0.5">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-sm mb-1 text-left transition-colors font-heading text-xs uppercase tracking-widest
                ${active === item.id
                  ? 'bg-brand-red/15 text-white border border-brand-red/30'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            >
              <span className={active === item.id ? 'text-brand-red' : ''}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-body text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-5 h-14 border-b border-white/5 bg-[#0c0c1a] sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/60 hover:text-white p-1 -ml-1"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-heading text-xs uppercase tracking-widest text-white/60">
            {navItems.find((n) => n.id === active)?.label}
          </span>
        </div>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {sectionMap[active]}
        </main>
      </div>
    </div>
  )
}
