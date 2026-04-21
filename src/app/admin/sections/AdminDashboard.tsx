'use client'

import { useState, useEffect } from 'react'
import type { Show, BookingRequest } from '@/lib/data'
import Link from 'next/link'

interface Props {
  onNavigate: (section: string) => void
}

interface LiveData {
  bookingRequests: BookingRequest[]
  shows: Show[]
  inboxUnread: number
  venueCount: number
}

function fmtCurrency(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`
}

function fmtDate(iso: string) {
  return new Date(iso + (iso.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
}

const PIPELINE_STAGES = [
  'New', 'Contacted', 'Quote Sent', 'Negotiating', 'Confirmed', 'Advance Sent', 'Paid',
] as const

const STAGE_COLOR: Record<string, string> = {
  'New':          'bg-blue-400',
  'Contacted':    'bg-yellow-400',
  'Quote Sent':   'bg-purple-400',
  'Negotiating':  'bg-orange-400',
  'Confirmed':    'bg-green-400',
  'Advance Sent': 'bg-cyan-400',
  'Paid':         'bg-emerald-400',
}

export default function AdminDashboard({ onNavigate }: Props) {
  const [live, setLive] = useState<LiveData>({
    bookingRequests: [], shows: [], inboxUnread: 0, venueCount: 0,
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/content').then((r) => r.json()),
      fetch('/api/inbound-emails').then((r) => r.json()),
      fetch('/api/venues').then((r) => r.json()),
    ])
      .then(([d, inbox, v]) => setLive({
        bookingRequests: d.bookingRequests ?? [],
        shows: (d.shows ?? []).filter((s: Show) => s.visible !== false),
        inboxUnread: (inbox.emails ?? []).filter((e: { read: boolean }) => !e.read).length,
        venueCount: (v.venues ?? []).length,
      }))
      .catch(() => {})
  }, [])

  const { bookingRequests, shows, inboxUnread, venueCount } = live

  const today = new Date()
  const thisMonth = today.toISOString().slice(0, 7)

  const activeLeads = bookingRequests.filter(
    (r) => !['Lost', 'Archived', 'Completed'].includes(r.status)
  ).length

  const confirmedThisMonth = bookingRequests.filter(
    (r) => (r.status === 'Confirmed' || r.status === 'Paid' || r.status === 'Advance Sent') &&
    r.updatedAt?.startsWith(thisMonth)
  ).length

  const pipelineRevenue = bookingRequests
    .filter((r) => !['Lost', 'Archived'].includes(r.status) && r.quoteAmount)
    .reduce((sum, r) => sum + (r.quoteAmount ?? 0), 0)

  const followUpDue = bookingRequests.filter((r) => {
    if (!r.followUpDate) return false
    if (['Confirmed', 'Lost', 'Archived', 'Completed', 'Paid'].includes(r.status)) return false
    return r.followUpDate <= today.toISOString().slice(0, 10)
  }).length

  const nextShow = shows
    .filter((s) => s.date >= today.toISOString().slice(0, 10))
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  const stageCounts = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: bookingRequests.filter((r) => r.status === stage).length,
  }))
  const maxStageCount = Math.max(...stageCounts.map((s) => s.count), 1)

  const kpis = [
    {
      label: 'Active Leads',
      value: activeLeads,
      sub: followUpDue > 0 ? `${followUpDue} follow-up due` : 'No follow-ups due',
      color: activeLeads > 0 ? 'blue' : 'neutral',
      urgent: followUpDue > 0,
      action: () => onNavigate('bookings'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
      ),
    },
    {
      label: 'Confirmed This Month',
      value: confirmedThisMonth,
      sub: confirmedThisMonth > 0 ? 'Gigs locked in' : 'None confirmed yet',
      color: confirmedThisMonth > 0 ? 'green' : 'neutral',
      urgent: false,
      action: () => onNavigate('bookings'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Pipeline Revenue',
      value: pipelineRevenue > 0 ? fmtCurrency(pipelineRevenue) : '—',
      sub: pipelineRevenue > 0 ? 'Across open deals' : 'Add quotes to track',
      color: pipelineRevenue > 0 ? 'red' : 'neutral',
      urgent: false,
      action: () => onNavigate('bookings'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
        </svg>
      ),
    },
    {
      label: 'Unread Messages',
      value: inboxUnread,
      sub: inboxUnread > 0 ? 'Needs your attention' : 'All caught up',
      color: inboxUnread > 0 ? 'blue' : 'neutral',
      urgent: inboxUnread > 0,
      action: () => onNavigate('email'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
        </svg>
      ),
    },
  ] as const

  const colorMap = {
    red:     { icon: 'text-brand-red bg-brand-red/10 border-brand-red/20',     value: 'text-brand-red', ring: 'hover:border-brand-red/30' },
    neutral: { icon: 'text-white/40 bg-white/5 border-white/10',               value: 'text-white',     ring: 'hover:border-white/15' },
    green:   { icon: 'text-green-400 bg-green-400/10 border-green-400/20',     value: 'text-green-400', ring: 'hover:border-green-400/20' },
    blue:    { icon: 'text-blue-400 bg-blue-400/10 border-blue-400/20',        value: 'text-blue-400',  ring: 'hover:border-blue-400/20' },
  }

  return (
    <div className="max-w-5xl">

      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-heading text-[10px] uppercase tracking-widest text-white/25 mb-2">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1 className="font-display uppercase text-4xl text-white leading-none">Command Center</h1>
        </div>
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 font-heading text-[10px] uppercase tracking-widest text-white/25 hover:text-white/60 transition-colors border border-white/8 px-3 py-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
          Site Live
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {kpis.map((kpi) => {
          const c = colorMap[kpi.color as keyof typeof colorMap]
          return (
            <button
              key={kpi.label}
              type="button"
              onClick={kpi.action}
              className={`relative flex flex-col gap-4 p-5 border border-white/8 bg-[#0d0d1e] text-left transition-all group ${c.ring}`}
            >
              {kpi.urgent && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
              <div className={`w-9 h-9 rounded-sm border flex items-center justify-center flex-shrink-0 ${c.icon}`}>
                {kpi.icon}
              </div>
              <div>
                <div className={`font-display text-3xl leading-none mb-1.5 ${c.value}`}>{kpi.value}</div>
                <div className="font-heading text-[10px] uppercase tracking-widest text-white/50 mb-0.5">{kpi.label}</div>
                <div className="font-body text-[11px] text-white/25">{kpi.sub}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Pipeline Funnel + Next Show */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 mb-8">

        {/* Pipeline */}
        <div className="border border-white/8 bg-[#0d0d1e] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-xs uppercase tracking-widest text-white">Booking Pipeline</h2>
              <p className="font-body text-xs text-white/30 mt-0.5">{bookingRequests.filter(r => !['Lost','Archived','Completed'].includes(r.status)).length} active leads</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('bookings')}
              className="font-heading text-[10px] uppercase tracking-widest text-brand-red border border-brand-red/30 px-3 py-1.5 hover:bg-brand-red/10 transition-colors"
            >
              Open CRM
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {stageCounts.map(({ stage, count }) => (
              <div key={stage} className="flex items-center gap-3">
                <span className="font-heading text-[10px] uppercase tracking-widest text-white/30 w-28 flex-shrink-0 truncate">{stage}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${STAGE_COLOR[stage] ?? 'bg-white/20'}`}
                    style={{ width: count > 0 ? `${(count / maxStageCount) * 100}%` : '0%' }}
                  />
                </div>
                <span className="font-body text-xs text-white/40 w-4 text-right tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Show */}
        <div className="border border-white/8 bg-[#0d0d1e] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xs uppercase tracking-widest text-white">Next Show</h2>
            <button
              type="button"
              onClick={() => onNavigate('shows')}
              className="font-heading text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors"
            >
              All Shows →
            </button>
          </div>
          {nextShow ? (
            <div className="flex gap-4 items-start flex-1">
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-brand-red/10 border border-brand-red/30 text-center">
                <span className="font-display text-2xl text-white leading-none">
                  {nextShow.date.split('-')[2]}
                </span>
                <span className="font-heading text-[9px] text-brand-red tracking-widest uppercase">
                  {new Date(nextShow.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-heading text-sm text-white uppercase truncate">{nextShow.venue}</p>
                <p className="font-body text-xs text-white/40 mt-0.5">{nextShow.city}</p>
                <p className="font-body text-xs text-white/30 mt-0.5">{nextShow.time}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <p className="font-body text-sm text-white/25">No upcoming shows</p>
              <button
                type="button"
                onClick={() => onNavigate('shows')}
                className="mt-3 font-heading text-[10px] uppercase tracking-widest text-brand-red border border-brand-red/30 px-3 py-1.5 hover:bg-brand-red/10 transition-colors"
              >
                Add Show
              </button>
            </div>
          )}

          {shows.length > 1 && (
            <div className="border-t border-white/6 pt-4 mt-4 flex flex-col gap-2">
              {shows
                .filter((s) => s.date >= today.toISOString().slice(0, 10))
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(1, 3)
                .map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="font-body text-xs text-white/25 w-16 flex-shrink-0">{fmtDate(s.date)}</span>
                    <span className="font-body text-xs text-white/50 truncate">{s.venue}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-heading text-[10px] uppercase tracking-widest text-white/25 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'New Booking Lead', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />, action: () => onNavigate('bookings') },
            { label: 'Add Show', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />, action: () => onNavigate('shows') },
            { label: 'View Inbox', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51" />, action: () => onNavigate('email') },
            { label: 'Venue Finder', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></>, action: () => onNavigate('venues') },
          ].map((qa) => (
            <button
              key={qa.label}
              type="button"
              onClick={qa.action}
              className="flex items-center gap-3 px-4 py-3.5 border border-white/8 bg-[#0d0d1e] hover:border-brand-red/30 hover:bg-brand-red/5 transition-all text-left group"
            >
              <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {qa.icon}
              </svg>
              <span className="font-heading text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors leading-tight">
                {qa.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom row: Venues + Recent bookings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border border-white/8 bg-[#0d0d1e] p-5 text-center">
          <div className="font-display text-3xl text-white mb-1">{venueCount}</div>
          <div className="font-heading text-[10px] uppercase tracking-widest text-white/40">Venues Tracked</div>
        </div>
        <div className="border border-white/8 bg-[#0d0d1e] p-5 text-center">
          <div className="font-display text-3xl text-white mb-1">{shows.length}</div>
          <div className="font-heading text-[10px] uppercase tracking-widest text-white/40">Upcoming Shows</div>
        </div>
        <div className="border border-white/8 bg-[#0d0d1e] p-5 text-center">
          <div className={`font-display text-3xl mb-1 ${inboxUnread > 0 ? 'text-blue-400' : 'text-white'}`}>{inboxUnread}</div>
          <div className="font-heading text-[10px] uppercase tracking-widest text-white/40">Unread Emails</div>
        </div>
      </div>

    </div>
  )
}
