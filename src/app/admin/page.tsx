'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import AdminShows from './sections/AdminShows'
import AdminMerch from './sections/AdminMerch'
import AdminMedia from './sections/AdminMedia'
import AdminContent from './sections/AdminContent'
import AdminDashboard from './sections/AdminDashboard'
import AdminBandMembers from './sections/AdminBandMembers'
import AdminEPK from './sections/AdminEPK'
import AdminBookings from './sections/AdminBookings'
import AdminSongRequests from './sections/AdminSongRequests'
import AdminVenueFinder from './sections/AdminVenueFinder'
import AdminEmailManagement from './sections/AdminEmailManagement'
import AdminAnalytics from './sections/AdminAnalytics'
import AdminNotes from './sections/AdminNotes'
import AdminLogin from './AdminLogin'
import Image from 'next/image'
import Link from 'next/link'

type Section = 'dashboard' | 'members' | 'shows' | 'bookings' | 'song-requests' | 'merch' | 'media' | 'epk' | 'content' | 'venues' | 'email' | 'analytics' | 'notes'

interface SearchItem {
  id: string
  type: 'booking' | 'show' | 'song-request' | 'venue'
  title: string
  sub: string
  section: Section
}

interface Badges { members: number; shows: number; merch: number; media: number; epk: number; bookings: number; songRequests: number; venues: number; inbox: number }

const navItems: { id: Section; label: string; badgeKey?: keyof Badges; icon: React.ReactNode }[] = [
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
    badgeKey: 'members',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    id: 'shows',
    label: 'Shows',
    badgeKey: 'shows',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'bookings',
    label: 'Bookings',
    badgeKey: 'bookings',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    id: 'song-requests',
    label: 'Song Requests',
    badgeKey: 'songRequests',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
  },
  {
    id: 'merch',
    label: 'Merch',
    badgeKey: 'merch',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: 'media',
    label: 'Media',
    badgeKey: 'media',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'epk',
    label: 'Press Kit',
    badgeKey: 'epk',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
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
  {
    id: 'venues' as Section,
    label: 'Venue Finder',
    badgeKey: 'venues' as keyof Badges,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    id: 'email' as Section,
    label: 'Email Management',
    badgeKey: 'inbox' as keyof Badges,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    id: 'analytics' as Section,
    label: 'Analytics',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    id: 'notes' as Section,
    label: 'Notes',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
]

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [active, setActive] = useState<Section>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [badges, setBadges] = useState<Badges>({ members: 0, shows: 0, merch: 0, media: 0, epk: 0, bookings: 0, songRequests: 0, venues: 0, inbox: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchItems, setSearchItems] = useState<SearchItem[]>([])
  const [searchIdx, setSearchIdx] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_authed')
    if (stored === '1') setAuthed(true)
    setAuthChecked(true)
  }, [])

  useEffect(() => {
    Promise.all([
      fetch('/api/content').then((r) => r.json()),
      fetch('/api/venues').then((r) => r.json()),
      fetch('/api/inbound-emails').then((r) => r.json()),
    ])
      .then(([d, v, inbox]) => {
        const venues: { id: string; name: string; address: string; status: string }[] = v.venues ?? []
        const inboundEmails: { read: boolean }[] = inbox.emails ?? []
        setBadges({
          members: d.bandMembers?.length ?? 0,
          shows: d.shows?.length ?? 0,
          merch: d.merch?.length ?? 0,
          media: d.mediaItems?.length ?? 0,
          epk: d.epkContent?.repertoire?.length ?? 0,
          bookings: (d.bookingRequests ?? []).filter((r: { status: string }) => r.status === 'New').length,
          songRequests: (d.songRequests ?? []).filter((r: { status: string }) => r.status === 'New').length,
          venues: venues.filter((vn) => vn.status === 'New' || vn.status === 'Reviewed').length,
          inbox: inboundEmails.filter((e) => !e.read).length,
        })
        const items: SearchItem[] = [
          ...(d.bookingRequests ?? []).map((r: { id: string; fullName: string; eventType?: string; city?: string; status: string }) => ({
            id: r.id, type: 'booking' as const,
            title: r.fullName,
            sub: [r.eventType, r.city, r.status].filter(Boolean).join(' · '),
            section: 'bookings' as Section,
          })),
          ...(d.shows ?? []).map((s: { id: string; venue: string; city: string; date: string }) => ({
            id: s.id, type: 'show' as const,
            title: s.venue,
            sub: `${s.city} · ${s.date}`,
            section: 'shows' as Section,
          })),
          ...(d.songRequests ?? []).map((r: { id: string; fullName: string; song1: string; song2?: string }) => ({
            id: r.id, type: 'song-request' as const,
            title: r.fullName,
            sub: [r.song1, r.song2].filter(Boolean).join(', '),
            section: 'song-requests' as Section,
          })),
          ...venues.map((vn) => ({
            id: vn.id, type: 'venue' as const,
            title: vn.name,
            sub: `${vn.address} · ${vn.status}`,
            section: 'venues' as Section,
          })),
        ]
        setSearchItems(items)
      })
      .catch(() => {})
  }, [active])

  const handleLogin = (password: string): boolean => {
    const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    if (!correct || password === correct) {
      sessionStorage.setItem('admin_authed', '1')
      setAuthed(true)
      return true
    }
    return false
  }
  const handleLogout = () => {
    sessionStorage.removeItem('admin_authed')
    setAuthed(false)
  }

  const navigate = useCallback((section: Section) => {
    setActive(section)
    setSidebarOpen(false)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const searchResults = searchQuery.trim().length >= 2
    ? searchItems.filter((item) => {
        const q = searchQuery.toLowerCase()
        return item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)
      }).slice(0, 8)
    : []

  const TYPE_META: Record<SearchItem['type'], { label: string; color: string }> = {
    'booking':      { label: 'Booking',      color: 'text-blue-400 border-blue-400/25' },
    'show':         { label: 'Show',         color: 'text-brand-red border-brand-red/25' },
    'song-request': { label: 'Song Req',     color: 'text-purple-400 border-purple-400/25' },
    'venue':        { label: 'Venue',        color: 'text-yellow-400 border-yellow-400/25' },
  }

  if (!authChecked) return null
  if (!authed) return <AdminLogin onLogin={handleLogin} />

  const sectionMap: Record<Section, React.ReactNode> = {
    dashboard: <AdminDashboard onNavigate={(s) => navigate(s as Section)} />,
    members: <AdminBandMembers />,
    shows: <AdminShows />,
    bookings: <AdminBookings onNavigate={(s) => navigate(s as Section)} />,
    'song-requests': <AdminSongRequests />,
    merch: <AdminMerch />,
    media: <AdminMedia />,
    epk: <AdminEPK />,
    content: <AdminContent />,
    venues: <AdminVenueFinder />,
    email: <AdminEmailManagement onNavigate={(s) => navigate(s as Section)} inboxUnread={badges.inbox} />,
    analytics: <AdminAnalytics />,
    notes: <AdminNotes />,
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
        className={`fixed top-0 left-0 h-full w-60 z-30 flex flex-col transition-transform duration-300
          bg-gradient-to-b from-[#0c0c1e] to-[#080810] border-r border-white/[0.06]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06] flex-shrink-0">
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
            {navItems.map((item, idx) => {
              const prevItem = navItems[idx - 1]
              const showDivider = (item.id === 'email' && prevItem?.id !== 'email') || item.id === 'analytics' || item.id === 'notes'
              const isActive = active === item.id
              const badgeCount = item.badgeKey !== undefined ? badges[item.badgeKey] : undefined
              return (
                <div key={item.id}>
                  {showDivider && (
                    <div className="px-2.5 pt-4 pb-1.5">
                      <span className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/20 block">
                        {item.id === 'email' ? 'Email' : item.id === 'notes' ? 'Team' : 'Reports'}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 mb-0.5 text-left transition-all font-heading text-xs uppercase tracking-widest relative group
                      ${isActive
                        ? 'text-white bg-white/[0.06] border-l-[2px] border-brand-red'
                        : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03] border-l-[2px] border-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-brand-red' : 'text-white/30 group-hover:text-white/50 transition-colors'}>
                        {item.icon}
                      </span>
                      {item.label}
                    </div>
                    {badgeCount !== undefined && badgeCount > 0 && (
                      <span className={`font-body text-[10px] px-1.5 py-0.5 rounded-sm tabular-nums ${
                        item.id === 'email'
                          ? 'bg-blue-400/20 text-blue-400'
                          : isActive ? 'bg-brand-red/20 text-brand-red' : 'bg-white/[0.08] text-white/30'
                      }`}>
                        {badgeCount}
                      </span>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-white/[0.06] flex-shrink-0 flex flex-col gap-2">
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
        <div className="flex items-center justify-between gap-3 px-5 lg:px-8 h-14 border-b border-white/[0.06] bg-[#08080f] sticky top-0 z-10 flex-shrink-0">
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

          {/* Right: search + site link */}
          <div className="flex items-center gap-3">
            {/* Global search */}
            <div className="relative hidden sm:block">
              <div className="flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-1.5 focus-within:border-brand-red/40 transition-colors">
                <svg className="w-3.5 h-3.5 text-white/25 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); setSearchIdx(0) }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); setSearchIdx((i) => Math.min(i + 1, searchResults.length - 1)) }
                    if (e.key === 'ArrowUp') { e.preventDefault(); setSearchIdx((i) => Math.max(i - 1, 0)) }
                    if (e.key === 'Enter' && searchResults[searchIdx]) {
                      navigate(searchResults[searchIdx].section)
                      setSearchOpen(false); setSearchQuery('')
                    }
                  }}
                  placeholder="Search… ⌘K"
                  className="bg-transparent text-white font-body text-xs w-44 focus:outline-none placeholder:text-white/20"
                  aria-label="Global search"
                />
              </div>
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-[#0d0d1e] border border-white/12 shadow-2xl z-50">
                  {searchResults.map((item, i) => {
                    const m = TYPE_META[item.type]
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={() => { navigate(item.section); setSearchOpen(false); setSearchQuery('') }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === searchIdx ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-body text-sm text-white truncate">{item.title}</div>
                          <div className="font-body text-xs text-white/35 truncate">{item.sub}</div>
                        </div>
                        <span className={`font-heading text-[8px] uppercase tracking-widest border px-1.5 py-0.5 flex-shrink-0 ${m.color}`}>{m.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
              {searchOpen && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-[#0d0d1e] border border-white/12 shadow-2xl z-50 px-4 py-3">
                  <p className="font-body text-xs text-white/30">No results for &ldquo;{searchQuery}&rdquo;</p>
                </div>
              )}
            </div>
            <Link
              href="/"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 font-heading text-[10px] uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors"
            >
              reboundrockband.com
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {sectionMap[active]}
        </main>
      </div>
    </div>
  )
}
