'use client'

import { useState, useEffect } from 'react'
import type { BookingRequest, SongRequest, Show } from '@/lib/data'

interface MonthBucket { label: string; bookings: number; guaranteed: number; paid: number; shows: number }

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const STATUS_ORDER = ['New','Contacted','Quote Sent','Follow-up','Negotiating','Confirmed','Advance Sent','Paid','Completed','Lost','Archived']
const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-400',
  Contacted: 'bg-sky-400',
  'Quote Sent': 'bg-yellow-400',
  'Follow-up': 'bg-orange-400',
  Negotiating: 'bg-purple-400',
  Confirmed: 'bg-brand-red',
  'Advance Sent': 'bg-pink-400',
  Paid: 'bg-green-400',
  Completed: 'bg-green-600',
  Lost: 'bg-white/20',
  Archived: 'bg-white/10',
}

function fmtMoney(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="border border-white/8 bg-[#0d0d1e] px-5 py-4">
      <div className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/30 mb-1.5">{label}</div>
      <div className="font-display text-2xl text-white leading-none">{value}</div>
      {sub && <div className="font-body text-[11px] text-white/25 mt-1">{sub}</div>}
    </div>
  )
}

function BarChart({ data, valueKey, label, color = 'bg-brand-red', format }: {
  data: MonthBucket[]
  valueKey: keyof MonthBucket
  label: string
  color?: string
  format?: (v: number) => string
}) {
  const max = Math.max(...data.map((d) => d[valueKey] as number), 1)
  return (
    <div>
      <div className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/30 mb-3">{label}</div>
      <div className="flex items-end gap-1.5 h-28">
        {data.map((d) => {
          const val = d[valueKey] as number
          const pct = (val / max) * 100
          return (
            <div key={d.label} className="flex flex-col items-center gap-1 flex-1 min-w-0 h-full justify-end group">
              <div className="relative flex-1 flex flex-col justify-end w-full">
                {val > 0 && (
                  <div
                    className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity font-body text-[9px] text-white/60 text-center pb-0.5"
                    style={{ bottom: `${pct}%` }}
                  >
                    {format ? format(val) : val}
                  </div>
                )}
                <div
                  className={`w-full ${color} opacity-80 group-hover:opacity-100 transition-opacity`}
                  style={{ height: `${Math.max(pct, val > 0 ? 4 : 0)}%` }}
                />
              </div>
              <span className="font-heading text-[8px] text-white/25 uppercase">{d.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminAnalytics() {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [songReqs, setSongReqs] = useState<SongRequest[]>([])
  const [shows, setShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => {
        setBookings(d.bookingRequests ?? [])
        setSongReqs(d.songRequests ?? [])
        setShows(d.shows ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Build rolling 6-month buckets
  const today = new Date()
  const buckets: MonthBucket[] = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1)
    return { label: MONTH_SHORT[d.getMonth()], bookings: 0, guaranteed: 0, paid: 0, shows: 0 }
  })
  const bucketKeys = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  for (const b of bookings) {
    const ym = b.createdAt?.slice(0, 7)
    const idx = bucketKeys.indexOf(ym)
    if (idx >= 0) {
      buckets[idx].bookings++
      if (b.quoteAmount) buckets[idx].guaranteed += b.quoteAmount
      if (b.status === 'Paid' || b.status === 'Completed') buckets[idx].paid += b.quoteAmount ?? 0
    }
  }
  for (const s of shows) {
    const ym = s.date?.slice(0, 7)
    const idx = bucketKeys.indexOf(ym)
    if (idx >= 0) buckets[idx].shows++
  }

  // Status distribution
  const statusMap: Record<string, number> = {}
  for (const b of bookings) statusMap[b.status] = (statusMap[b.status] ?? 0) + 1
  const statusDist = STATUS_ORDER.filter((s) => statusMap[s] > 0).map((s) => ({ status: s, count: statusMap[s] }))
  const maxStatus = Math.max(...statusDist.map((s) => s.count), 1)

  // Event type breakdown
  const typeMap: Record<string, number> = {}
  for (const b of bookings) if (b.eventType) typeMap[b.eventType] = (typeMap[b.eventType] ?? 0) + 1
  const topTypes = Object.entries(typeMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxType = topTypes[0]?.[1] ?? 1

  // Pipeline revenue by stage
  const PIPELINE_STAGES_ORDER = ['New','Contacted','Quote Sent','Follow-up','Negotiating','Confirmed','Advance Sent','Paid','Completed']
  const pipelineRevenue = PIPELINE_STAGES_ORDER.map((stage) => {
    const staged = bookings.filter((b) => b.status === stage && b.quoteAmount)
    return { stage, value: staged.reduce((a, b) => a + (b.quoteAmount ?? 0), 0), count: staged.length }
  }).filter((s) => s.value > 0)
  const maxPipelineValue = Math.max(...pipelineRevenue.map((s) => s.value), 1)

  // Song request top songs
  const songMap: Record<string, number> = {}
  for (const r of songReqs) for (const s of [r.song1, r.song2, r.song3].filter(Boolean) as string[]) {
    songMap[s] = (songMap[s] ?? 0) + 1
  }
  const topSongs = Object.entries(songMap).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const maxSong = topSongs[0]?.[1] ?? 1

  // Source breakdown
  const SOURCE_LABELS: Record<string, string> = {
    website_form: 'Website Form', referral: 'Referral', facebook: 'Facebook / IG',
    google: 'Google', phone: 'Phone Call', email: 'Direct Email', repeat: 'Repeat Client', other: 'Other',
  }
  const sourceMap: Record<string, number> = {}
  for (const b of bookings) {
    const key = b.source || 'website_form'
    sourceMap[key] = (sourceMap[key] ?? 0) + 1
  }
  const sourceDist = Object.entries(sourceMap)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, label: SOURCE_LABELS[key] ?? key, count }))
  const sourceMax = sourceDist[0]?.count ?? 1

  // Win / Loss analysis
  const wonBookings   = bookings.filter((b) => ['Confirmed','Advance Sent','Paid','Completed'].includes(b.status))
  const lostBookings  = bookings.filter((b) => b.status === 'Lost')
  const decided       = wonBookings.length + lostBookings.length
  const winRate       = decided > 0 ? Math.round((wonBookings.length / decided) * 100) : null

  const avgDaysToClose = (() => {
    const daysArr = [...wonBookings, ...lostBookings]
      .filter((b) => b.createdAt && b.updatedAt)
      .map((b) => Math.max(0, Math.floor((new Date(b.updatedAt!).getTime() - new Date(b.createdAt).getTime()) / 86400000)))
    return daysArr.length > 0 ? Math.round(daysArr.reduce((a, d) => a + d, 0) / daysArr.length) : null
  })()

  const avgWonDeal = wonBookings.filter((b) => b.quoteAmount).length > 0
    ? Math.round(wonBookings.filter((b) => b.quoteAmount).reduce((a, b) => a + (b.quoteAmount ?? 0), 0) / wonBookings.filter((b) => b.quoteAmount).length)
    : null

  // Top cities
  const cityMap: Record<string, number> = {}
  for (const b of bookings) if (b.city) {
    const city = b.city.split(',')[0].trim()
    cityMap[city] = (cityMap[city] ?? 0) + 1
  }
  const topCities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxCity = topCities[0]?.[1] ?? 1

  // Revenue by event month (12-month forward window)
  const CONFIRMED_STATUSES = ['Confirmed', 'Advance Sent', 'Paid', 'Completed']
  const eventMonthBuckets: { label: string; ym: string; revenue: number; count: number }[] = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
    return {
      label: `${MONTH_SHORT[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
      ym: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      revenue: 0,
      count: 0,
    }
  })
  for (const b of bookings) {
    if (!b.eventDate || !CONFIRMED_STATUSES.includes(b.status)) continue
    const ym = b.eventDate.slice(0, 7)
    const bucket = eventMonthBuckets.find((bk) => bk.ym === ym)
    if (bucket) {
      bucket.revenue += b.quoteAmount ?? 0
      bucket.count++
    }
  }
  const eventMonthMax = Math.max(...eventMonthBuckets.map((bk) => bk.revenue), 1)
  const eventMonthTotal = eventMonthBuckets.reduce((a, bk) => a + bk.revenue, 0)

  // KPI totals
  const totalBookings = bookings.length
  const totalGuaranteed = bookings.reduce((a, b) => a + (b.quoteAmount ?? 0), 0)
  const totalPaid = bookings.filter((b) => b.status === 'Paid' || b.status === 'Completed').reduce((a, b) => a + (b.quoteAmount ?? 0), 0)
  const convRate = totalBookings > 0
    ? Math.round((bookings.filter((b) => ['Confirmed','Advance Sent','Paid','Completed'].includes(b.status)).length / totalBookings) * 100)
    : 0
  const totalSongReqs = songReqs.length
  const newBookings = bookings.filter((b) => b.status === 'New').length

  if (loading) {
    return (
      <div className="max-w-4xl">
        <div className="font-heading text-xs uppercase tracking-widest text-white/20 animate-pulse">Loading analytics…</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="border-l-2 border-brand-red pl-4 mb-8">
        <h1 className="font-display uppercase text-4xl text-white leading-none">Analytics</h1>
        <p className="font-body text-xs text-white/30 mt-1.5">Booking pipeline · revenue · shows · fan requests</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total Bookings" value={totalBookings} sub={`${newBookings} new`} />
        <StatCard label="Conversion Rate" value={`${convRate}%`} sub="confirmed or better" />
        <StatCard label="Quoted Revenue" value={totalGuaranteed > 0 ? fmtMoney(totalGuaranteed) : '—'} sub={totalPaid > 0 ? `${fmtMoney(totalPaid)} paid` : 'none paid yet'} />
        <StatCard label="Song Requests" value={totalSongReqs} sub={`${topSongs.length} unique songs`} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5">
          <BarChart data={buckets} valueKey="bookings" label="Bookings (last 6 months)" />
        </div>
        <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5">
          <BarChart data={buckets} valueKey="shows" label="Shows (last 6 months)" color="bg-purple-400" />
        </div>
        <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5">
          <BarChart data={buckets} valueKey="guaranteed" label="Quoted revenue / mo." color="bg-green-400" format={fmtMoney} />
        </div>
        <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5">
          <BarChart data={buckets} valueKey="paid" label="Paid out / mo." color="bg-yellow-400" format={fmtMoney} />
        </div>
      </div>

      {/* Status distribution + Event types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Booking status distribution */}
        <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5">
          <div className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/30 mb-4">Booking Status Distribution</div>
          {statusDist.length === 0 ? (
            <div className="font-body text-xs text-white/20">No bookings yet.</div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {statusDist.map(({ status, count }) => (
                <div key={status} className="flex items-center gap-3">
                  <span className="font-heading text-[10px] uppercase tracking-widest text-white/40 w-28 flex-shrink-0 truncate">{status}</span>
                  <div className="flex-1 h-1.5 bg-white/[0.05] rounded-none overflow-hidden">
                    <div
                      className={`h-full ${STATUS_COLORS[status] ?? 'bg-white/30'}`}
                      style={{ width: `${(count / maxStatus) * 100}%` }}
                    />
                  </div>
                  <span className="font-body text-[11px] text-white/30 w-5 text-right tabular-nums flex-shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event type breakdown */}
        <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5">
          <div className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/30 mb-4">Bookings by Event Type</div>
          {topTypes.length === 0 ? (
            <div className="font-body text-xs text-white/20">No bookings yet.</div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {topTypes.map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="font-heading text-[10px] uppercase tracking-widest text-white/40 w-28 flex-shrink-0 truncate">{type}</span>
                  <div className="flex-1 h-1.5 bg-white/[0.05] overflow-hidden">
                    <div className="h-full bg-brand-red" style={{ width: `${(count / maxType) * 100}%` }} />
                  </div>
                  <span className="font-body text-[11px] text-white/30 w-5 text-right tabular-nums flex-shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pipeline Revenue */}
      {pipelineRevenue.length > 0 && (
        <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5 mb-6">
          <div className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/30 mb-4">Pipeline Revenue by Stage</div>
          <div className="flex flex-col gap-2.5">
            {pipelineRevenue.map(({ stage, value, count }) => (
              <div key={stage} className="flex items-center gap-3">
                <span className="font-heading text-[10px] uppercase tracking-widest text-white/40 w-28 flex-shrink-0 truncate">{stage}</span>
                <div className="flex-1 h-4 bg-white/[0.04] overflow-hidden relative">
                  <div
                    className={`h-full transition-all ${STATUS_COLORS[stage] ?? 'bg-white/30'} opacity-70`}
                    style={{ width: `${(value / maxPipelineValue) * 100}%` }}
                  />
                </div>
                <span className="font-body text-xs text-white/60 w-14 text-right tabular-nums flex-shrink-0">{fmtMoney(value)}</span>
                <span className="font-body text-[10px] text-white/20 w-12 text-right tabular-nums flex-shrink-0">{count} deal{count !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/6 flex gap-6">
            <div>
              <div className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-0.5">Total Pipeline</div>
              <div className="font-display text-xl text-white">{fmtMoney(pipelineRevenue.reduce((a, s) => a + s.value, 0))}</div>
            </div>
            <div>
              <div className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-0.5">Avg Deal Size</div>
              <div className="font-display text-xl text-white">
                {fmtMoney(Math.round(pipelineRevenue.reduce((a, s) => a + s.value, 0) / pipelineRevenue.reduce((a, s) => a + s.count, 0)))}
              </div>
            </div>
            <div>
              <div className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-0.5">Won Revenue</div>
              <div className="font-display text-xl text-green-400">
                {fmtMoney(pipelineRevenue.filter((s) => ['Paid','Completed','Confirmed','Advance Sent'].includes(s.stage)).reduce((a, s) => a + s.value, 0))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Source Breakdown */}
      {sourceDist.length > 0 && (
        <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5 mb-8">
          <div className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/30 mb-4">Bookings by Lead Source</div>
          <div className="flex flex-col gap-2.5">
            {sourceDist.map(({ key, label, count }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="font-heading text-[10px] uppercase tracking-widest text-white/40 w-32 flex-shrink-0 truncate">{label}</span>
                <div className="flex-1 h-1.5 bg-white/[0.05] overflow-hidden">
                  <div className="h-full bg-brand-red/70 transition-all" style={{ width: `${(count / sourceMax) * 100}%` }} />
                </div>
                <span className="font-body text-[11px] text-white/30 w-5 text-right tabular-nums flex-shrink-0">{count}</span>
                <span className="font-body text-[10px] text-white/20 w-8 text-right tabular-nums flex-shrink-0">{Math.round((count / Math.max(bookings.length, 1)) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Win / Loss + Top Cities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

        {/* Win/Loss panel */}
        <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5">
          <div className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/30 mb-4">Deal Performance</div>
          {decided === 0 ? (
            <div className="font-body text-xs text-white/20">No decided deals yet.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Win rate bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading text-[10px] uppercase tracking-widest text-white/40">Win Rate</span>
                  <span className={`font-display text-2xl leading-none ${(winRate ?? 0) >= 50 ? 'text-green-400' : 'text-orange-400'}`}>
                    {winRate}%
                  </span>
                </div>
                <div className="h-3 bg-white/5 overflow-hidden flex">
                  <div
                    className="h-full bg-green-400 transition-all"
                    style={{ width: `${winRate ?? 0}%` }}
                  />
                  <div className="h-full bg-red-400/40 flex-1" />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-heading text-[9px] text-green-400/60">{wonBookings.length} won</span>
                  <span className="font-heading text-[9px] text-red-400/40">{lostBookings.length} lost</span>
                </div>
              </div>
              {/* Metrics row */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/6">
                <div>
                  <div className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-0.5">Avg Days to Close</div>
                  <div className="font-display text-xl text-white">{avgDaysToClose !== null ? avgDaysToClose : '—'}</div>
                </div>
                <div>
                  <div className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-0.5">Avg Won Deal</div>
                  <div className="font-display text-xl text-green-400">{avgWonDeal !== null ? fmtMoney(avgWonDeal) : '—'}</div>
                </div>
                <div>
                  <div className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-0.5">Total Won</div>
                  <div className="font-display text-xl text-white">{wonBookings.length}</div>
                </div>
                <div>
                  <div className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-0.5">Total Lost</div>
                  <div className="font-display text-xl text-white/40">{lostBookings.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Cities */}
        <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5">
          <div className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/30 mb-4">Bookings by City</div>
          {topCities.length === 0 ? (
            <div className="font-body text-xs text-white/20">No city data yet.</div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {topCities.map(([city, count]) => (
                <div key={city} className="flex items-center gap-3">
                  <span className="font-heading text-[10px] uppercase tracking-widest text-white/40 w-28 flex-shrink-0 truncate">{city}</span>
                  <div className="flex-1 h-1.5 bg-white/[0.05] overflow-hidden">
                    <div className="h-full bg-cyan-400/60 transition-all" style={{ width: `${(count / maxCity) * 100}%` }} />
                  </div>
                  <span className="font-body text-[11px] text-white/30 w-5 text-right tabular-nums flex-shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Revenue by Event Month */}
      <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5 mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <div className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/30">Revenue by Event Month (next 12 months)</div>
          {eventMonthTotal > 0 && (
            <div className="font-display text-sm text-green-400">{fmtMoney(eventMonthTotal)}</div>
          )}
        </div>
        {eventMonthBuckets.every((bk) => bk.revenue === 0) ? (
          <div className="font-body text-xs text-white/20">No confirmed bookings with event dates yet.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {eventMonthBuckets.map((bk) => (
              <div key={bk.ym} className="flex items-center gap-3">
                <span className="font-heading text-[10px] uppercase tracking-widest text-white/40 w-14 flex-shrink-0">{bk.label}</span>
                <div className="flex-1 h-4 bg-white/[0.04] overflow-hidden relative">
                  {bk.revenue > 0 && (
                    <div
                      className="h-full bg-green-400/60 transition-all"
                      style={{ width: `${(bk.revenue / eventMonthMax) * 100}%` }}
                    />
                  )}
                </div>
                <span className="font-body text-xs text-white/50 w-16 text-right tabular-nums flex-shrink-0">
                  {bk.revenue > 0 ? fmtMoney(bk.revenue) : '—'}
                </span>
                {bk.count > 0 && (
                  <span className="font-body text-[10px] text-white/20 w-12 text-right tabular-nums flex-shrink-0">
                    {bk.count} show{bk.count !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        {eventMonthTotal > 0 && (
          <div className="mt-3 pt-3 border-t border-white/6 font-heading text-[9px] uppercase tracking-widest text-white/20">
            Confirmed, advance sent, paid &amp; completed bookings only
          </div>
        )}
      </div>

      {/* Top requested songs */}
      <div className="border border-white/8 bg-[#0d0d1e] px-5 py-5">
        <div className="font-heading text-[9px] uppercase tracking-[0.18em] text-white/30 mb-4">Top Fan-Requested Songs</div>
        {topSongs.length === 0 ? (
          <div className="font-body text-xs text-white/20">No song requests yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
            {topSongs.map(([song, count], i) => (
              <div key={song} className="flex items-center gap-3">
                <span className="font-heading text-[9px] text-white/20 w-4 text-right tabular-nums flex-shrink-0">{i + 1}</span>
                <span className="font-body text-sm text-white/70 flex-1 truncate">{song}</span>
                <div className="w-20 h-1.5 bg-white/[0.05] flex-shrink-0 overflow-hidden">
                  <div className="h-full bg-purple-400/70" style={{ width: `${(count / maxSong) * 100}%` }} />
                </div>
                <span className="font-body text-[11px] text-white/30 w-4 text-right tabular-nums flex-shrink-0">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
