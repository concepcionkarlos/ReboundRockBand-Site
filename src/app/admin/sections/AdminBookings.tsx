'use client'

import { useState, useEffect, useCallback } from 'react'
import type { BookingRequest, BookingStatus } from '@/lib/data'

const ALL_STATUSES: BookingStatus[] = [
  'New', 'Contacted', 'Quote Sent', 'Follow-up', 'Negotiating', 'Confirmed', 'Lost', 'Archived',
]

const statusColors: Record<BookingStatus, string> = {
  'New': 'border-blue-400/40 text-blue-400',
  'Contacted': 'border-yellow-400/40 text-yellow-400',
  'Quote Sent': 'border-purple-400/40 text-purple-400',
  'Follow-up': 'border-orange-400/40 text-orange-400',
  'Negotiating': 'border-cyan-400/40 text-cyan-400',
  'Confirmed': 'border-green-400/40 text-green-400',
  'Lost': 'border-red-400/30 text-red-400/70',
  'Archived': 'border-white/10 text-white/25',
}

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

interface Props {
  onNavigate: (section: string) => void
}

function fmt(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso + (iso.includes('T') ? '' : 'T00:00:00'))
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminBookings({ onNavigate }: Props) {
  const [requests, setRequests] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'All'>('All')
  const [selected, setSelected] = useState<BookingRequest | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => { if (d.bookingRequests) setRequests(d.bookingRequests) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const persist = useCallback(async (updated: BookingRequest[]) => {
    setSaving(true)
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'bookingRequests', data: updated }),
      })
      setRequests(updated)
      flash()
    } finally {
      setSaving(false)
    }
  }, [])

  const saveDetail = async () => {
    if (!selected) return
    const updated = requests.map((r) =>
      r.id === selected.id ? { ...selected, updatedAt: new Date().toISOString() } : r
    )
    await persist(updated)
  }

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Venue/Company', 'City', 'Event Date',
      'Event Type', 'Budget', 'Guests', 'Status', 'Follow-up Date', 'Assigned To', 'Notes', 'Source', 'Created At']
    const rows = requests.map((r) => [
      r.id, r.fullName, r.email, r.phone, r.venueOrCompany, r.city, r.eventDate,
      r.eventType, r.budgetRange, r.guestCount, r.status, r.followUpDate ?? '',
      r.assignedTo ?? '', (r.notes ?? '').replace(/\n/g, ' '), r.source, r.createdAt,
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `booking-requests-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const today = new Date().toISOString().split('T')[0]

  const counts = {
    total: requests.length,
    new: requests.filter((r) => r.status === 'New').length,
    confirmed: requests.filter((r) => r.status === 'Confirmed').length,
    followUp: requests.filter((r) => r.followUpDate && r.followUpDate <= today && r.status !== 'Confirmed' && r.status !== 'Lost' && r.status !== 'Archived').length,
  }

  const filtered = requests
    .filter((r) => filterStatus === 'All' || r.status === filterStatus)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const statCards = [
    { label: 'Total Requests', value: counts.total, color: 'text-white' },
    { label: 'New', value: counts.new, color: counts.new > 0 ? 'text-blue-400' : 'text-white/40' },
    { label: 'Confirmed', value: counts.confirmed, color: counts.confirmed > 0 ? 'text-green-400' : 'text-white/40' },
    { label: 'Follow-up Due', value: counts.followUp, color: counts.followUp > 0 ? 'text-orange-400' : 'text-white/40' },
  ]

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="border-l-2 border-brand-red pl-4">
          <h1 className="font-display uppercase text-4xl text-white leading-none">Bookings</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">Incoming booking requests from the website</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-1.5 font-heading text-[10px] text-green-400 uppercase tracking-widest">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </div>
          )}
          <button
            onClick={exportCSV}
            disabled={requests.length === 0}
            className="font-heading text-xs uppercase tracking-widest border border-white/12 text-white/40 px-4 py-2.5 hover:border-brand-red hover:text-brand-red transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((c) => (
          <div key={c.label} className="border border-white/6 bg-[#0d0d1e] p-5">
            <div className={`font-display text-4xl leading-none mb-1 ${c.color}`}>{c.value}</div>
            <div className="font-heading text-[10px] uppercase tracking-widest text-white/30">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="font-heading text-[10px] uppercase tracking-widest text-white/30">Filter:</span>
        {(['All', ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setFilterStatus(s); setSelected(null) }}
            className={`font-heading text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all ${
              filterStatus === s
                ? 'border-brand-red text-brand-red'
                : 'border-white/10 text-white/30 hover:border-white/25 hover:text-white/60'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="font-body text-sm text-white/30 py-10 text-center">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="font-body text-sm text-white/30 py-10 text-center border border-white/6">
          {filterStatus === 'All' ? 'No booking requests yet.' : `No requests with status "${filterStatus}".`}
        </div>
      ) : (
        <div className="flex flex-col gap-px mb-6">
          {/* Column headers */}
          <div className="hidden lg:grid grid-cols-[2fr_2fr_1fr_1.5fr_1fr_1fr] gap-3 px-4 py-2 font-heading text-[9px] uppercase tracking-widest text-white/20">
            <span>Name</span>
            <span>Venue / Company</span>
            <span>Event Date</span>
            <span>Event Type</span>
            <span>Status</span>
            <span>Received</span>
          </div>
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(selected?.id === r.id ? null : r)}
              className={`w-full text-left border transition-all group ${
                selected?.id === r.id
                  ? 'border-brand-red/50 bg-brand-red/5'
                  : 'border-white/6 bg-[#0d0d1e] hover:border-white/15'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1fr_1.5fr_1fr_1fr] gap-1 lg:gap-3 px-4 py-4 items-center">
                <div>
                  <div className="font-body text-sm text-white font-medium">{r.fullName}</div>
                  <div className="font-body text-xs text-brand-muted/60 truncate">{r.email}</div>
                </div>
                <div className="font-body text-sm text-brand-muted truncate">{r.venueOrCompany || <span className="text-white/20">—</span>}</div>
                <div className="font-body text-sm text-brand-muted">{fmt(r.eventDate)}</div>
                <div className="font-body text-xs text-brand-muted/80 truncate">{r.eventType}</div>
                <div>
                  <span className={`font-heading text-[9px] uppercase tracking-widest border px-2 py-0.5 ${statusColors[r.status]}`}>
                    {r.status}
                  </span>
                </div>
                <div className="font-body text-xs text-white/25">{fmt(r.createdAt)}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="border border-brand-red/30 bg-[#0d0d1e] p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display uppercase text-2xl text-white leading-none">{selected.fullName}</h2>
              <p className="font-body text-xs text-white/30 mt-1">{selected.source} · {fmt(selected.createdAt)}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="font-heading text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Contact & event info (read-only) */}
            <div className="flex flex-col gap-4">
              <p className="font-heading text-[10px] uppercase tracking-widest text-white/30 border-b border-white/6 pb-2">Contact Details</p>
              {[
                { label: 'Email', value: selected.email, href: `mailto:${selected.email}` },
                { label: 'Phone', value: selected.phone || '—' },
                { label: 'Venue / Company', value: selected.venueOrCompany || '—' },
                { label: 'City', value: selected.city || '—' },
                { label: 'Event Date', value: fmt(selected.eventDate) },
                { label: 'Event Type', value: selected.eventType },
                { label: 'Budget Range', value: selected.budgetRange || '—' },
                { label: 'Guest Count', value: selected.guestCount || '—' },
              ].map(({ label, value, href }) => (
                <div key={label}>
                  <div className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-0.5">{label}</div>
                  {href ? (
                    <a href={href} className="font-body text-sm text-white hover:text-brand-red transition-colors">{value}</a>
                  ) : (
                    <div className="font-body text-sm text-white/80">{value}</div>
                  )}
                </div>
              ))}
              {selected.message && (
                <div>
                  <div className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-0.5">Message</div>
                  <p className="font-body text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              )}
            </div>

            {/* Right: Editable CRM fields */}
            <div className="flex flex-col gap-4">
              <p className="font-heading text-[10px] uppercase tracking-widest text-white/30 border-b border-white/6 pb-2">CRM</p>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Status</label>
                <select
                  value={selected.status}
                  onChange={(e) => setSelected({ ...selected, status: e.target.value as BookingStatus })}
                  className={inputClass}
                >
                  {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Assigned To</label>
                <input
                  type="text"
                  value={selected.assignedTo ?? ''}
                  onChange={(e) => setSelected({ ...selected, assignedTo: e.target.value })}
                  className={inputClass}
                  placeholder="Team member name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Follow-up Date</label>
                <input
                  type="date"
                  value={selected.followUpDate ?? ''}
                  onChange={(e) => setSelected({ ...selected, followUpDate: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Internal Notes</label>
                <textarea
                  value={selected.notes ?? ''}
                  onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
                  rows={5}
                  className={`${inputClass} resize-none`}
                  placeholder="Internal notes about this booking request…"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={saveDetail}
                  disabled={saving}
                  className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all btn-glow-red disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  Save Changes
                </button>
                {selected.status === 'Confirmed' && (
                  <button
                    onClick={() => {
                      sessionStorage.setItem('prefillShow', JSON.stringify({
                        date: selected.eventDate,
                        venue: selected.venueOrCompany || selected.fullName,
                        city: selected.city,
                        time: '',
                      }))
                      onNavigate('shows')
                    }}
                    className="font-heading text-xs uppercase tracking-widest border border-green-400/30 text-green-400/80 px-5 py-2.5 hover:border-green-400 hover:text-green-400 transition-all flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Convert to Show
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
