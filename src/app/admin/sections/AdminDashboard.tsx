'use client'

import { useState, useEffect } from 'react'
import type { Show, MerchItem, MediaItem, BandMember, BookingRequest } from '@/lib/data'
import Link from 'next/link'

interface AdminDashboardProps {
  onNavigate: (section: 'shows' | 'merch' | 'media' | 'content' | 'members' | 'epk' | 'bookings' | 'venues') => void
}

interface LiveData {
  shows: Show[]
  merch: MerchItem[]
  mediaItems: MediaItem[]
  bandMembers: BandMember[]
  bookingRequests: BookingRequest[]
  venueTotal: number
  venueInterested: number
  venueBooked: number
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [live, setLive] = useState<LiveData>({ shows: [], merch: [], mediaItems: [], bandMembers: [], bookingRequests: [], venueTotal: 0, venueInterested: 0, venueBooked: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/content').then((r) => r.json()),
      fetch('/api/venues').then((r) => r.json()),
    ])
      .then(([d, v]) => setLive({
        shows: d.shows ?? [],
        merch: d.merch ?? [],
        mediaItems: d.mediaItems ?? [],
        bandMembers: d.bandMembers ?? [],
        bookingRequests: d.bookingRequests ?? [],
        venueTotal: (v.venues ?? []).length,
        venueInterested: (v.venues ?? []).filter((vn: { status: string }) => vn.status === 'Interested').length,
        venueBooked: (v.venues ?? []).filter((vn: { status: string }) => vn.status === 'Booked').length,
      }))
      .catch(() => {})
  }, [])

  const { shows, merch, mediaItems, bandMembers, bookingRequests, venueTotal, venueInterested, venueBooked } = live
  const visibleShows = shows.filter((s) => s.visible !== false)
  const upcomingShows = visibleShows.length
  const nextShow = visibleShows[0]
  const totalMerch = merch.length
  const availableMerch = merch.filter((m) => m.available && m.visible).length
  const visibleMedia = mediaItems.filter((m) => m.visible).length
  const totalMembers = bandMembers.filter((m) => m.visible !== false).length
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  const newBookings = bookingRequests.filter((r) => r.status === 'New').length
  const confirmedBookings = bookingRequests.filter((r) => r.status === 'Confirmed').length

  const statCards = [
    {
      label: 'Booking Requests',
      value: bookingRequests.length,
      sub: newBookings > 0 ? `${newBookings} new — needs attention` : 'No new requests',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      action: () => onNavigate('bookings'),
      actionLabel: 'View Bookings',
      color: (newBookings > 0 ? 'blue' : 'neutral') as 'blue' | 'neutral',
    },
    {
      label: 'Confirmed',
      value: confirmedBookings,
      sub: confirmedBookings > 0 ? 'Bookings locked in' : 'No confirmed yet',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: () => onNavigate('bookings'),
      actionLabel: 'View Confirmed',
      color: (confirmedBookings > 0 ? 'green' : 'neutral') as 'green' | 'neutral',
    },
    {
      label: 'Upcoming Shows',
      value: upcomingShows,
      sub: nextShow ? `Next: ${nextShow.venue}` : 'No shows scheduled',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      action: () => onNavigate('shows'),
      actionLabel: 'Manage Shows',
      color: 'red' as const,
    },
    {
      label: 'Band Members',
      value: totalMembers,
      sub: `${totalMembers} visible on site`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      action: () => onNavigate('members'),
      actionLabel: 'Manage Members',
      color: 'neutral' as const,
    },
    {
      label: 'Merch Items',
      value: totalMerch,
      sub: `${availableMerch} available in store`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      action: () => onNavigate('merch'),
      actionLabel: 'Manage Merch',
      color: 'neutral' as const,
    },
    {
      label: 'Media Items',
      value: visibleMedia,
      sub: `${mediaItems.length} total · ${visibleMedia} visible`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      action: () => onNavigate('media'),
      actionLabel: 'Manage Media',
      color: 'neutral' as const,
    },
    {
      label: 'Venues Tracked',
      value: venueTotal,
      sub: venueTotal === 0 ? 'No venues saved yet' : `${venueInterested} interested · ${venueBooked} booked`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      action: () => onNavigate('venues'),
      actionLabel: 'Venue Finder',
      color: (venueBooked > 0 ? 'green' : venueInterested > 0 ? 'blue' : 'neutral') as 'green' | 'blue' | 'neutral',
    },
    {
      label: 'Site Status',
      value: 'Live',
      sub: 'Public site active',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
      action: null,
      actionLabel: 'View Site',
      color: 'green' as const,
    },
  ]

  const colorMap = {
    red: {
      icon: 'text-brand-red bg-brand-red/10 border-brand-red/20',
      value: 'text-white',
      btn: 'border-brand-red/30 text-brand-red hover:bg-brand-red/10',
    },
    neutral: {
      icon: 'text-white/50 bg-white/5 border-white/10',
      value: 'text-white',
      btn: 'border-white/20 text-white/50 hover:bg-white/5',
    },
    green: {
      icon: 'text-green-400 bg-green-400/10 border-green-400/20',
      value: 'text-green-400',
      btn: 'border-green-500/30 text-green-400/70 hover:bg-green-400/5',
    },
    blue: {
      icon: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      value: 'text-blue-400',
      btn: 'border-blue-400/30 text-blue-400 hover:bg-blue-400/5',
    },
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1 h-4 bg-brand-red" />
          <span className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">{today}</span>
        </div>
        <h1 className="font-display uppercase text-4xl text-white mb-1">Dashboard</h1>
        <p className="font-body text-sm text-white/30">Overview of your Rebound Rock Band site</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => {
          const colors = colorMap[card.color]
          return (
            <div
              key={card.label}
              className="flex flex-col gap-4 p-5 border border-white/8 bg-[#0d0d1e] hover:border-white/12 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`w-9 h-9 rounded-sm border flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                  {card.icon}
                </div>
                <span className={`font-display text-3xl leading-none ${colors.value}`}>
                  {card.value}
                </span>
              </div>
              <div>
                <div className="font-heading text-xs uppercase tracking-widest text-white/70 mb-0.5">{card.label}</div>
                <div className="font-body text-[11px] text-white/30 leading-snug">{card.sub}</div>
              </div>
              {card.action ? (
                <button
                  onClick={card.action}
                  className={`self-start font-heading text-[10px] uppercase tracking-widest border px-3 py-1.5 transition-colors ${colors.btn}`}
                >
                  {card.actionLabel}
                </button>
              ) : (
                <Link
                  href="/"
                  target="_blank"
                  className={`self-start font-heading text-[10px] uppercase tracking-widest border px-3 py-1.5 transition-colors ${colors.btn}`}
                >
                  View Site ↗
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="font-heading text-xs uppercase tracking-widest text-white/40 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { label: 'View Bookings', icon: '✉', action: () => onNavigate('bookings') },
            { label: 'Add Show', icon: '＋', action: () => onNavigate('shows') },
            { label: 'Add Merch Item', icon: '＋', action: () => onNavigate('merch') },
            { label: 'Upload Media', icon: '＋', action: () => onNavigate('media') },
            { label: 'Edit Content', icon: '✎', action: () => onNavigate('content') },
          ].map((qa) => (
            <button
              key={qa.label}
              onClick={qa.action}
              className="flex items-center gap-3 px-4 py-3.5 border border-white/8 bg-[#0d0d1e] hover:border-brand-red/30 hover:bg-brand-red/5 transition-all text-left group"
            >
              <span className="text-brand-red text-base font-display leading-none w-5 text-center">{qa.icon}</span>
              <span className="font-heading text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                {qa.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Next show spotlight */}
      {nextShow && (
        <div className="mb-10">
          <h2 className="font-heading text-xs uppercase tracking-widest text-white/40 mb-4">Next Show</h2>
          <div className="flex items-center gap-0 border border-brand-red/30 bg-brand-red/5 overflow-hidden">
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 py-5 bg-brand-red/10 border-r border-brand-red/20 text-center">
              <span className="font-body text-[9px] text-brand-muted uppercase tracking-widest">
                {new Date(nextShow.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
              </span>
              <span className="font-display text-3xl text-white leading-none">
                {nextShow.date.split('-')[2]}
              </span>
              <span className="font-heading text-[10px] text-brand-red tracking-widest uppercase">
                {new Date(nextShow.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 px-5 py-4">
              <div className="font-heading text-sm text-white">{nextShow.venue}</div>
              <div className="font-body text-xs text-white/40 mt-0.5">{nextShow.city} · {nextShow.time}</div>
            </div>
            <button
              onClick={() => onNavigate('shows')}
              className="flex-shrink-0 px-5 font-heading text-[10px] uppercase tracking-widest text-brand-red border-l border-brand-red/20 py-4 hover:bg-brand-red/10 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="p-5 border border-white/6 bg-white/2 rounded-none">
        <h3 className="font-heading text-[10px] uppercase tracking-widest text-white/30 mb-3">Getting Started</h3>
        <ul className="flex flex-col gap-2">
          {[
            'Use Shows to add and manage upcoming gig dates',
            'Add Printful URLs to Merch items to enable "Buy Now" buttons',
            'Connect to a CMS or database to persist changes across deployments',
            'The EPK page is pre-built — just keep your shows and contact info updated',
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2.5 font-body text-xs text-white/25">
              <span className="w-1 h-1 rounded-full bg-brand-red/40 flex-shrink-0 mt-1.5" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
