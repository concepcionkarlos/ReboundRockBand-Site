'use client'

import { useState, useEffect } from 'react'
import type { Show, BookingRequest, MerchItem, SongRequest, InboundEmail } from '@/lib/data'
import Link from 'next/link'

interface Props {
  onNavigate: (section: string) => void
}

interface ActivityItem {
  id: string
  kind: 'booking' | 'song-request' | 'inbox'
  label: string
  sub: string
  date: string
  section: string
}

interface LiveData {
  bookingRequests: BookingRequest[]
  shows: Show[]
  inboxUnread: number
  venueCount: number
  lowStockItems: MerchItem[]
  activity: ActivityItem[]
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

const STAGE_PROBABILITY: Record<string, number> = {
  'New':          0.05,
  'Contacted':    0.10,
  'Quote Sent':   0.25,
  'Follow-up':    0.20,
  'Negotiating':  0.50,
  'Confirmed':    0.90,
  'Advance Sent': 0.95,
  'Paid':         1.00,
  'Completed':    1.00,
}

const STAGE_COLOR: Record<string, string> = {
  'New':          'bg-blue-400',
  'Contacted':    'bg-yellow-400',
  'Quote Sent':   'bg-purple-400',
  'Negotiating':  'bg-orange-400',
  'Confirmed':    'bg-green-400',
  'Advance Sent': 'bg-cyan-400',
  'Paid':         'bg-emerald-400',
}

interface MonthlyGoal { month: string; bookingTarget: number; revenueTarget: number }

export default function AdminDashboard({ onNavigate }: Props) {
  const [live, setLive] = useState<LiveData>({
    bookingRequests: [], shows: [], inboxUnread: 0, venueCount: 0, lowStockItems: [], activity: [],
  })
  const [goal, setGoal] = useState<MonthlyGoal | null>(null)
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalDraft, setGoalDraft] = useState({ bookingTarget: '', revenueTarget: '' })
  const [savingGoal, setSavingGoal] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/content').then((r) => r.json()),
      fetch('/api/inbound-emails').then((r) => r.json()),
      fetch('/api/venues').then((r) => r.json()),
    ])
      .then(([d, inbox, v]) => {
        const bookings: BookingRequest[] = d.bookingRequests ?? []
        const songReqs: SongRequest[] = d.songRequests ?? []
        const inboundEmails: InboundEmail[] = inbox.emails ?? []

        const activity: ActivityItem[] = [
          ...bookings.map((b) => ({
            id: b.id,
            kind: 'booking' as const,
            label: b.fullName,
            sub: `${b.eventType || 'Booking'} · ${b.status}`,
            date: b.createdAt,
            section: 'bookings',
          })),
          ...songReqs.map((r) => ({
            id: r.id,
            kind: 'song-request' as const,
            label: r.fullName,
            sub: r.song1 + (r.song2 ? `, ${r.song2}` : ''),
            date: r.createdAt,
            section: 'song-requests',
          })),
          ...inboundEmails.map((e) => ({
            id: e.id,
            kind: 'inbox' as const,
            label: e.fromName || e.fromEmail,
            sub: e.subject,
            date: e.receivedAt,
            section: 'email',
          })),
        ]
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 10)

        setLive({
          bookingRequests: bookings,
          shows: (d.shows ?? []).filter((s: Show) => s.visible !== false),
          inboxUnread: inboundEmails.filter((e) => !e.read).length,
          venueCount: (v.venues ?? []).length,
          lowStockItems: (d.merch ?? []).filter((m: MerchItem) => m.stockQuantity !== undefined && m.stockQuantity <= 2),
          activity,
        })
        const savedGoal: MonthlyGoal | undefined = d.monthlyGoal
        const currentMonth = new Date().toISOString().slice(0, 7)
        if (savedGoal && savedGoal.month === currentMonth) {
          setGoal(savedGoal)
        }
      })
      .catch(() => {})
  }, [])

  const { bookingRequests, shows, inboxUnread, venueCount, lowStockItems, activity } = live

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

  const saveGoal = async () => {
    const bt = parseInt(goalDraft.bookingTarget) || 0
    const rt = parseFloat(goalDraft.revenueTarget) || 0
    if (bt === 0 && rt === 0) return
    const currentMonth = today.toISOString().slice(0, 7)
    const newGoal: MonthlyGoal = { month: currentMonth, bookingTarget: bt, revenueTarget: rt }
    setSavingGoal(true)
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'monthlyGoal', data: newGoal }),
      })
      setGoal(newGoal)
      setEditingGoal(false)
    } finally {
      setSavingGoal(false)
    }
  }

  const goalActualBookings = bookingRequests.filter(
    (r) => ['Confirmed', 'Advance Sent', 'Paid', 'Completed'].includes(r.status) && r.updatedAt?.startsWith(thisMonth)
  ).length
  const goalActualRevenue = bookingRequests
    .filter((r) => ['Confirmed', 'Advance Sent', 'Paid', 'Completed'].includes(r.status) && r.updatedAt?.startsWith(thisMonth) && r.quoteAmount)
    .reduce((s, r) => s + (r.quoteAmount ?? 0), 0)

  const forecast = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    const deals = bookingRequests.filter(
      (r) => r.eventDate?.startsWith(monthKey) && r.quoteAmount && !['Lost', 'Archived'].includes(r.status)
    )
    const weighted = deals.reduce(
      (sum, r) => sum + (r.quoteAmount ?? 0) * (STAGE_PROBABILITY[r.status] ?? 0.05),
      0
    )
    return { monthKey, label, weighted: Math.round(weighted), count: deals.length, isCurrent: i === 0 }
  })
  const forecastMax = Math.max(...forecast.map((f) => f.weighted), 1)

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
              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm text-white uppercase truncate">{nextShow.venue}</p>
                <p className="font-body text-xs text-white/40 mt-0.5">{nextShow.city}</p>
                <p className="font-body text-xs text-white/30 mt-0.5">{nextShow.time}</p>
                {(() => {
                  const diff = Math.ceil((new Date(nextShow.date + 'T00:00:00').getTime() - new Date(today.toISOString().slice(0, 10) + 'T00:00:00').getTime()) / 86400000)
                  return diff === 0 ? (
                    <span className="inline-block mt-1.5 font-heading text-[10px] uppercase tracking-widest text-brand-red border border-brand-red/40 px-2 py-0.5">Today!</span>
                  ) : diff === 1 ? (
                    <span className="inline-block mt-1.5 font-heading text-[10px] uppercase tracking-widest text-orange-400/80">Tomorrow</span>
                  ) : (
                    <span className="font-body text-[11px] text-white/25 mt-0.5 block">in {diff} days</span>
                  )
                })()}
                {(nextShow.guarantee || nextShow.loadInTime) && (
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/6">
                    {nextShow.guarantee && (
                      <span className="font-heading text-[10px] uppercase tracking-widest text-green-400/70">
                        {fmtCurrency(nextShow.guarantee)}
                      </span>
                    )}
                    {nextShow.loadInTime && (
                      <span className="font-body text-[11px] text-white/30">
                        Load-in {nextShow.loadInTime}
                      </span>
                    )}
                    {nextShow.soundCheckTime && (
                      <span className="font-body text-[11px] text-white/30">
                        SC {nextShow.soundCheckTime}
                      </span>
                    )}
                  </div>
                )}
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

      {/* Merch low-stock alert */}
      {lowStockItems.length > 0 && (
        <div className="mb-6 border border-yellow-400/25 bg-yellow-400/5 px-5 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
            <span className="font-heading text-xs uppercase tracking-widest text-yellow-400">
              {lowStockItems.filter((m) => m.stockQuantity === 0).length > 0
                ? `${lowStockItems.filter((m) => m.stockQuantity === 0).length} item${lowStockItems.filter((m) => m.stockQuantity === 0).length > 1 ? 's' : ''} out of stock`
                : `${lowStockItems.length} item${lowStockItems.length > 1 ? 's' : ''} low stock`}
            </span>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => onNavigate('merch')}
              className="font-heading text-[10px] uppercase tracking-widest border border-yellow-400/30 text-yellow-400/70 px-3 py-1.5 hover:bg-yellow-400/10 transition-all"
            >
              View Merch
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className={`font-heading text-[9px] uppercase tracking-widest border px-1.5 py-0.5 flex-shrink-0 ${item.stockQuantity === 0 ? 'border-red-400/30 text-red-400' : 'border-yellow-400/30 text-yellow-400'}`}>
                  {item.stockQuantity === 0 ? 'Out' : `${item.stockQuantity} left`}
                </span>
                <span className="font-body text-sm text-white/60 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Monthly Goals */}
      <div className="mt-6 mb-6 border border-white/8 bg-[#0d0d1e] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-xs uppercase tracking-widest text-white">Monthly Goals</h2>
            <p className="font-body text-[11px] text-white/25 mt-0.5">
              {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingGoal((v) => !v)
              if (goal) setGoalDraft({ bookingTarget: String(goal.bookingTarget || ''), revenueTarget: String(goal.revenueTarget || '') })
              else setGoalDraft({ bookingTarget: '', revenueTarget: '' })
            }}
            className="font-heading text-[10px] uppercase tracking-widest border border-white/10 text-white/30 px-3 py-1.5 hover:border-white/25 hover:text-white/60 transition-all flex items-center gap-1.5"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            {goal ? 'Edit' : 'Set Goals'}
          </button>
        </div>

        {editingGoal ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[9px] uppercase tracking-widest text-white/30">Bookings Target</label>
                <input
                  type="number" min={0}
                  value={goalDraft.bookingTarget}
                  onChange={(e) => setGoalDraft({ ...goalDraft, bookingTarget: e.target.value })}
                  className="w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3 py-2 focus:outline-none focus:border-brand-red/50 transition-all placeholder:text-white/20"
                  placeholder="e.g. 4"
                  aria-label="Monthly booking target"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[9px] uppercase tracking-widest text-white/30">Revenue Target ($)</label>
                <input
                  type="number" min={0} step={500}
                  value={goalDraft.revenueTarget}
                  onChange={(e) => setGoalDraft({ ...goalDraft, revenueTarget: e.target.value })}
                  className="w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3 py-2 focus:outline-none focus:border-brand-red/50 transition-all placeholder:text-white/20"
                  placeholder="e.g. 5000"
                  aria-label="Monthly revenue target"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={saveGoal} disabled={savingGoal || (!goalDraft.bookingTarget && !goalDraft.revenueTarget)} className="font-heading text-[10px] uppercase tracking-widest bg-brand-red text-white px-4 py-2 hover:bg-brand-red-bright transition-all disabled:opacity-50">
                {savingGoal ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditingGoal(false)} className="font-heading text-[10px] uppercase tracking-widest border border-white/10 text-white/40 px-4 py-2 hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        ) : goal ? (
          <div className="flex flex-col gap-4">
            {goal.bookingTarget > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-heading text-[10px] uppercase tracking-widest text-white/40">Bookings Confirmed</span>
                  <span className="font-heading text-[10px] uppercase tracking-widest text-white/50 tabular-nums">
                    {goalActualBookings} / {goal.bookingTarget}
                    {goalActualBookings >= goal.bookingTarget && <span className="text-green-400 ml-1.5">✓</span>}
                  </span>
                </div>
                <div className="h-2 bg-white/5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${goalActualBookings >= goal.bookingTarget ? 'bg-green-400' : 'bg-brand-red'}`}
                    style={{ width: `${Math.min((goalActualBookings / goal.bookingTarget) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {goal.revenueTarget > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-heading text-[10px] uppercase tracking-widest text-white/40">Revenue Confirmed</span>
                  <span className="font-heading text-[10px] uppercase tracking-widest text-white/50 tabular-nums">
                    {fmtCurrency(goalActualRevenue)} / {fmtCurrency(goal.revenueTarget)}
                    {goalActualRevenue >= goal.revenueTarget && <span className="text-green-400 ml-1.5">✓</span>}
                  </span>
                </div>
                <div className="h-2 bg-white/5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${goalActualRevenue >= goal.revenueTarget ? 'bg-green-400' : 'bg-brand-red'}`}
                    style={{ width: `${Math.min((goalActualRevenue / goal.revenueTarget) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="font-body text-sm text-white/20 text-center py-4">No goals set for this month — click "Set Goals" to get started.</p>
        )}
      </div>

      {/* Revenue Forecast */}
      <div className="mb-6 border border-white/8 bg-[#0d0d1e] p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading text-xs uppercase tracking-widest text-white">Revenue Forecast</h2>
            <p className="font-body text-[11px] text-white/25 mt-0.5">Stage-weighted · 3-month outlook</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('bookings')}
            className="font-heading text-[10px] uppercase tracking-widest text-white/25 hover:text-white/60 transition-colors"
          >
            Open CRM →
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {forecast.map((f) => (
            <div
              key={f.monthKey}
              className={`border px-4 py-3.5 flex flex-col gap-1 ${f.isCurrent ? 'border-brand-red/25 bg-brand-red/[0.04]' : 'border-white/6'}`}
            >
              <span className={`font-heading text-[9px] uppercase tracking-widest ${f.isCurrent ? 'text-brand-red' : 'text-white/30'}`}>
                {f.label}{f.isCurrent ? ' · Now' : ''}
              </span>
              <span className={`font-display text-2xl leading-none ${f.weighted > 0 ? (f.isCurrent ? 'text-brand-red' : 'text-white') : 'text-white/20'}`}>
                {f.weighted > 0 ? fmtCurrency(f.weighted) : '—'}
              </span>
              <span className="font-body text-[11px] text-white/25">
                {f.count > 0 ? `${f.count} deal${f.count !== 1 ? 's' : ''}` : 'No deals'}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {forecast.map((f) => (
            <div key={f.monthKey} className="flex items-center gap-3">
              <span className="font-heading text-[9px] uppercase tracking-widest text-white/25 w-14 flex-shrink-0">{f.label}</span>
              <div className="flex-1 h-1.5 bg-white/5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${f.isCurrent ? 'bg-brand-red' : 'bg-white/20'}`}
                  style={{ width: f.weighted > 0 ? `${(f.weighted / forecastMax) * 100}%` : '0%' }}
                />
              </div>
              <span className="font-body text-[11px] text-white/30 w-14 text-right tabular-nums flex-shrink-0">
                {f.weighted > 0 ? fmtCurrency(f.weighted) : '—'}
              </span>
            </div>
          ))}
        </div>
        <p className="font-body text-[10px] text-white/15 mt-4 leading-relaxed">
          Weighted by stage probability: Confirmed 90% · Negotiating 50% · Quote Sent 25% · Contacted 10%
        </p>
      </div>

      {/* Recent Activity */}
      {activity.length > 0 && (
        <div className="mt-6">
          <h2 className="font-heading text-[10px] uppercase tracking-widest text-white/25 mb-3">Recent Activity</h2>
          <div className="border border-white/8 bg-[#0d0d1e] divide-y divide-white/[0.04]">
            {activity.map((item) => {
              const kindMeta = {
                'booking':      { dot: 'bg-blue-400',   label: 'Booking',      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /> },
                'song-request': { dot: 'bg-purple-400', label: 'Song Request', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /> },
                'inbox':        { dot: 'bg-green-400',  label: 'Inbox',        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /> },
              }[item.kind]
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.section)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex-shrink-0 w-7 h-7 border border-white/8 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white/30 group-hover:text-white/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {kindMeta.icon}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm text-white/80 truncate">{item.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${kindMeta.dot}`} />
                      <span className="font-heading text-[9px] uppercase tracking-widest text-white/25 flex-shrink-0">{kindMeta.label}</span>
                    </div>
                    <p className="font-body text-xs text-white/35 truncate">{item.sub}</p>
                  </div>
                  <span className="font-body text-xs text-white/20 flex-shrink-0 tabular-nums">
                    {fmtDate(item.date)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
