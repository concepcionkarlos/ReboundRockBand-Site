'use client'

import { useState, useEffect, useCallback } from 'react'
import type { BookingRequest, BookingStatus, EmailTemplate, BookingEmailLog, InboundEmail } from '@/lib/data'
import { renderTemplate } from '@/lib/templateUtils'

// ── Pipeline config ──────────────────────────────────────────────────────────

const PIPELINE_STAGES: BookingStatus[] = [
  'New', 'Contacted', 'Quote Sent', 'Negotiating', 'Confirmed', 'Advance Sent', 'Paid',
]

const CLOSED_STAGES: BookingStatus[] = ['Completed', 'Lost', 'Archived']

const ALL_STATUSES: BookingStatus[] = [...PIPELINE_STAGES, ...CLOSED_STAGES]

const STAGE_META: Record<BookingStatus, { label: string; color: string; dot: string; badge: string }> = {
  'New':          { label: 'New Lead',     color: 'border-blue-400/30 text-blue-400',     dot: 'bg-blue-400',     badge: 'bg-blue-400/15 text-blue-400' },
  'Contacted':    { label: 'Contacted',    color: 'border-yellow-400/30 text-yellow-400', dot: 'bg-yellow-400',   badge: 'bg-yellow-400/15 text-yellow-400' },
  'Quote Sent':   { label: 'Quote Sent',   color: 'border-purple-400/30 text-purple-400', dot: 'bg-purple-400',   badge: 'bg-purple-400/15 text-purple-400' },
  'Follow-up':    { label: 'Follow-up',    color: 'border-orange-400/30 text-orange-400', dot: 'bg-orange-400',   badge: 'bg-orange-400/15 text-orange-400' },
  'Negotiating':  { label: 'Negotiating',  color: 'border-cyan-400/30 text-cyan-400',     dot: 'bg-cyan-400',     badge: 'bg-cyan-400/15 text-cyan-400' },
  'Confirmed':    { label: 'Confirmed',    color: 'border-green-400/30 text-green-400',   dot: 'bg-green-400',    badge: 'bg-green-400/15 text-green-400' },
  'Advance Sent': { label: 'Advance Sent', color: 'border-teal-400/30 text-teal-400',     dot: 'bg-teal-400',     badge: 'bg-teal-400/15 text-teal-400' },
  'Paid':         { label: 'Paid',         color: 'border-emerald-400/30 text-emerald-400', dot: 'bg-emerald-400', badge: 'bg-emerald-400/15 text-emerald-400' },
  'Completed':    { label: 'Completed',    color: 'border-white/15 text-white/40',         dot: 'bg-white/30',    badge: 'bg-white/8 text-white/35' },
  'Lost':         { label: 'Lost',         color: 'border-red-400/20 text-red-400/60',     dot: 'bg-red-400/60',  badge: 'bg-red-400/10 text-red-400/60' },
  'Archived':     { label: 'Archived',     color: 'border-white/8 text-white/20',          dot: 'bg-white/15',    badge: 'bg-white/5 text-white/20' },
}

const NEXT_STAGE: Partial<Record<BookingStatus, BookingStatus>> = {
  'New': 'Contacted',
  'Contacted': 'Quote Sent',
  'Quote Sent': 'Negotiating',
  'Negotiating': 'Confirmed',
  'Confirmed': 'Advance Sent',
  'Advance Sent': 'Paid',
  'Paid': 'Completed',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

function fmt(iso: string) {
  if (!iso) return '—'
  return new Date(iso + (iso.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function fmtShort(iso: string) {
  if (!iso) return '—'
  return new Date(iso + (iso.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
}

interface Props {
  onNavigate: (section: string) => void
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminBookings({ onNavigate }: Props) {
  const [requests, setRequests] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline')
  const [listFilter, setListFilter] = useState<BookingStatus | 'All' | 'Open'>('Open')
  const [selected, setSelected] = useState<BookingRequest | null>(null)
  const [drawerTab, setDrawerTab] = useState<'details' | 'email'>('details')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Email compose state
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [toEmail, setToEmail] = useState('')
  const [editableSubject, setEditableSubject] = useState('')
  const [editableBody, setEditableBody] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const [emailLogs, setEmailLogs] = useState<BookingEmailLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [inboundEmails, setInboundEmails] = useState<InboundEmail[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/content').then((r) => r.json()),
      fetch('/api/email-templates').then((r) => r.json()),
    ])
      .then(([d, td]) => {
        if (d.bookingRequests) setRequests(d.bookingRequests)
        if (td.templates) {
          setTemplates(
            (td.templates as EmailTemplate[]).filter((t) =>
              t.slug.startsWith('booking-reply') || t.slug === 'booking-auto-reply'
            )
          )
        }
      })
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

  const updateSelected = useCallback((patch: Partial<BookingRequest>) => {
    setSelected((prev) => prev ? { ...prev, ...patch } : null)
  }, [])

  const saveDetail = async () => {
    if (!selected) return
    const updated = requests.map((r) =>
      r.id === selected.id ? { ...selected, updatedAt: new Date().toISOString() } : r
    )
    await persist(updated)
  }

  const advanceStage = async (booking: BookingRequest) => {
    const next = NEXT_STAGE[booking.status]
    if (!next) return
    const patched = { ...booking, status: next, updatedAt: new Date().toISOString() }
    const updated = requests.map((r) => r.id === booking.id ? patched : r)
    setSelected(patched)
    await persist(updated)
  }

  const openDrawer = (r: BookingRequest, tab: 'details' | 'email' = 'details') => {
    setSelected(r)
    setDrawerTab(tab)
    setSaved(false)
    setSendResult(null)
    setSelectedTemplateId('')
    setToEmail(r.email)
    setEditableSubject('')
    setEditableBody('')
    setShowPreview(false)
    setEmailLogs([])
    setInboundEmails([])
    if (tab === 'email') loadEmailLogs(r.id)
  }

  const loadEmailLogs = async (bookingId: string) => {
    setLoadingLogs(true)
    try {
      const [logsRes, inboundRes] = await Promise.all([
        fetch(`/api/bookings/${bookingId}/email-logs`),
        fetch(`/api/inbound-emails?entityType=booking&entityId=${bookingId}`),
      ])
      const logsData = await logsRes.json()
      const inboundData = await inboundRes.json()
      setEmailLogs(logsData.logs ?? [])
      setInboundEmails(inboundData.emails ?? [])
    } catch {
      setEmailLogs([])
      setInboundEmails([])
    } finally {
      setLoadingLogs(false)
    }
  }

  useEffect(() => {
    if (!selectedTemplateId || !selected) {
      setEditableSubject('')
      setEditableBody('')
      return
    }
    const tmpl = templates.find((t) => t.id === selectedTemplateId)
    if (!tmpl) return
    const { subject, bodyHtml } = renderTemplate(tmpl, {
      clientName: selected.fullName.split(' ')[0] || selected.fullName,
      eventDate: selected.eventDate || '(not specified)',
      eventType: selected.eventType || 'your event',
      bandName: 'Rebound Rock Band',
      replyEmail: 'booking@reboundrockband.com',
    })
    setEditableSubject(subject)
    setEditableBody(bodyHtml)
  }, [selectedTemplateId, selected, templates])

  const handleSendEmail = async () => {
    if (!selected || !selectedTemplateId || !toEmail) return
    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch(`/api/bookings/${selected.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          toEmail,
          subject: editableSubject,
          bodyHtml: editableBody,
          vars: {
            clientName: selected.fullName.split(' ')[0] || selected.fullName,
            eventDate: selected.eventDate || '(not specified)',
            eventType: selected.eventType || 'your event',
          },
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSendResult({ ok: true, msg: 'Email sent.' })
        if (data.emailLog) setEmailLogs((prev) => [data.emailLog, ...prev])
        if (selected.status === 'New') {
          const patched = { ...selected, status: 'Contacted' as BookingStatus, updatedAt: new Date().toISOString() }
          const updated = requests.map((r) => r.id === selected.id ? patched : r)
          setRequests(updated)
          setSelected(patched)
          await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section: 'bookingRequests', data: updated }),
          })
        }
      } else {
        setSendResult({ ok: false, msg: data.error ?? 'Send failed.' })
      }
    } catch {
      setSendResult({ ok: false, msg: 'Network error.' })
    } finally {
      setSending(false)
    }
  }

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Venue/Company', 'City', 'Event Date',
      'Event Type', 'Budget', 'Quote Amount', 'Guests', 'Status', 'Follow-up Date', 'Assigned To', 'Notes', 'Created At']
    const rows = requests.map((r) => [
      r.id, r.fullName, r.email, r.phone, r.venueOrCompany, r.city, r.eventDate,
      r.eventType, r.budgetRange, r.quoteAmount ?? '', r.guestCount, r.status,
      r.followUpDate ?? '', r.assignedTo ?? '', (r.notes ?? '').replace(/\n/g, ' '), r.createdAt,
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `bookings-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const today = new Date().toISOString().split('T')[0]
  const openCount = requests.filter((r) => !CLOSED_STAGES.includes(r.status)).length
  const newCount = requests.filter((r) => r.status === 'New').length
  const confirmedCount = requests.filter((r) => r.status === 'Confirmed' || r.status === 'Paid').length
  const followUpCount = requests.filter((r) => r.followUpDate && r.followUpDate <= today && !CLOSED_STAGES.includes(r.status) && r.status !== 'Confirmed').length

  const listData = requests
    .filter((r) => {
      if (listFilter === 'All') return true
      if (listFilter === 'Open') return !CLOSED_STAGES.includes(r.status)
      return r.status === listFilter
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-0 min-h-0 relative">

      {/* ── Main area ── */}
      <div className={`flex flex-col min-w-0 transition-all duration-300 ${selected ? 'flex-1' : 'w-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="border-l-2 border-brand-red pl-4">
            <h1 className="font-display uppercase text-4xl text-white leading-none">Bookings CRM</h1>
            <p className="font-body text-xs text-white/30 mt-1.5">{openCount} open leads</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex border border-white/10">
              <button
                type="button"
                onClick={() => setView('pipeline')}
                className={`px-3 py-2 font-heading text-[10px] uppercase tracking-widest transition-colors ${view === 'pipeline' ? 'bg-white/8 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                Pipeline
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={`px-3 py-2 font-heading text-[10px] uppercase tracking-widest transition-colors border-l border-white/10 ${view === 'list' ? 'bg-white/8 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                List
              </button>
            </div>
            <button
              type="button"
              onClick={exportCSV}
              disabled={requests.length === 0}
              className="font-heading text-[10px] uppercase tracking-widest border border-white/10 text-white/30 px-3 py-2 hover:border-brand-red/40 hover:text-brand-red transition-all disabled:opacity-30 hidden sm:block"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: 'Total', value: requests.length, color: 'text-white' },
            { label: 'New', value: newCount, color: newCount > 0 ? 'text-blue-400' : 'text-white/30' },
            { label: 'Confirmed', value: confirmedCount, color: confirmedCount > 0 ? 'text-green-400' : 'text-white/30' },
            { label: 'Follow-up Due', value: followUpCount, color: followUpCount > 0 ? 'text-orange-400' : 'text-white/30' },
          ].map((s) => (
            <div key={s.label} className="border border-white/6 bg-[#0d0d1e] px-4 py-3 text-center">
              <div className={`font-display text-2xl leading-none mb-0.5 ${s.color}`}>{s.value}</div>
              <div className="font-heading text-[9px] uppercase tracking-widest text-white/25">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="font-body text-sm text-white/30 py-16 text-center">Loading…</div>
        ) : view === 'pipeline' ? (
          <PipelineView
            requests={requests}
            selected={selected}
            onSelect={openDrawer}
            today={today}
          />
        ) : (
          <ListView
            requests={listData}
            filter={listFilter}
            onFilterChange={(f) => { setListFilter(f); setSelected(null) }}
            selected={selected}
            onSelect={openDrawer}
            today={today}
          />
        )}
      </div>

      {/* ── Drawer ── */}
      {selected && (
        <div className="w-[520px] flex-shrink-0 border-l border-white/8 bg-[#0a0a18] flex flex-col overflow-y-auto max-h-[calc(100vh-120px)] sticky top-0">
          <BookingDrawer
            booking={selected}
            tab={drawerTab}
            onTabChange={(t) => {
              setDrawerTab(t)
              if (t === 'email') loadEmailLogs(selected.id)
            }}
            onClose={() => setSelected(null)}
            onUpdate={updateSelected}
            onSave={saveDetail}
            onAdvance={() => advanceStage(selected)}
            onConvertToShow={() => {
              sessionStorage.setItem('prefillShow', JSON.stringify({
                date: selected.eventDate, venue: selected.venueOrCompany || selected.fullName, city: selected.city, time: '',
              }))
              onNavigate('shows')
            }}
            saving={saving}
            saved={saved}
            // Email props
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onTemplateChange={setSelectedTemplateId}
            toEmail={toEmail}
            onToEmailChange={setToEmail}
            editableSubject={editableSubject}
            onSubjectChange={setEditableSubject}
            editableBody={editableBody}
            onBodyChange={setEditableBody}
            showPreview={showPreview}
            onTogglePreview={() => setShowPreview((p) => !p)}
            sending={sending}
            sendResult={sendResult}
            onSendEmail={handleSendEmail}
            emailLogs={emailLogs}
            inboundEmails={inboundEmails}
            loadingLogs={loadingLogs}
          />
        </div>
      )}
    </div>
  )
}

// ── Pipeline View ─────────────────────────────────────────────────────────────

function PipelineView({
  requests, selected, onSelect, today,
}: {
  requests: BookingRequest[]
  selected: BookingRequest | null
  onSelect: (r: BookingRequest, tab?: 'details' | 'email') => void
  today: string
}) {
  const closedCount = requests.filter((r) => CLOSED_STAGES.includes(r.status)).length

  return (
    <div className="flex flex-col gap-4">
      {/* Horizontal kanban */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {PIPELINE_STAGES.map((stage) => {
            const cards = requests.filter((r) => r.status === stage)
            const meta = STAGE_META[stage]
            return (
              <div key={stage} className="w-52 flex-shrink-0 flex flex-col gap-2">
                {/* Column header */}
                <div className="flex items-center justify-between px-3 py-2 border border-white/6 bg-[#0d0d1e]">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${meta.dot}`} />
                    <span className="font-heading text-[9px] uppercase tracking-widest text-white/50">{meta.label}</span>
                  </div>
                  <span className="font-body text-xs text-white/30 tabular-nums">{cards.length}</span>
                </div>

                {/* Cards */}
                {cards.length === 0 ? (
                  <div className="border border-white/4 border-dashed h-16 flex items-center justify-center">
                    <span className="font-body text-xs text-white/15">Empty</span>
                  </div>
                ) : (
                  cards
                    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                    .map((r) => {
                      const isFollowUp = r.followUpDate && r.followUpDate <= today
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => onSelect(r)}
                          className={`w-full text-left border p-3 transition-all group ${
                            selected?.id === r.id
                              ? 'border-brand-red/50 bg-brand-red/8'
                              : 'border-white/6 bg-[#0d0d1e] hover:border-white/15 hover:bg-white/[0.02]'
                          }`}
                        >
                          <p className="font-heading text-[11px] text-white truncate mb-1">{r.fullName}</p>
                          <p className="font-body text-[10px] text-white/40 truncate mb-2">{r.eventType}</p>
                          <p className="font-body text-[10px] text-white/30 mb-2">{fmtShort(r.eventDate)}</p>
                          <div className="flex items-center justify-between gap-1">
                            {r.quoteAmount ? (
                              <span className="font-heading text-[9px] text-green-400/70">${r.quoteAmount.toLocaleString()}</span>
                            ) : (
                              <span className="font-body text-[9px] text-white/20">{r.budgetRange?.split('–')[0] ?? '—'}</span>
                            )}
                            {isFollowUp && (
                              <span className="font-heading text-[9px] text-orange-400 border border-orange-400/30 px-1">!</span>
                            )}
                          </div>
                        </button>
                      )
                    })
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Closed deals summary */}
      {closedCount > 0 && (
        <div className="border border-white/6 bg-[#0d0d1e] px-5 py-3 flex items-center justify-between">
          <span className="font-heading text-[10px] uppercase tracking-widest text-white/25">
            Closed · {closedCount} deals
          </span>
          <div className="flex gap-4">
            {CLOSED_STAGES.map((stage) => {
              const count = requests.filter((r) => r.status === stage).length
              if (count === 0) return null
              return (
                <span key={stage} className="font-body text-xs text-white/30">
                  {STAGE_META[stage].label}: <span className="text-white/50">{count}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── List View ─────────────────────────────────────────────────────────────────

function ListView({
  requests, filter, onFilterChange, selected, onSelect, today,
}: {
  requests: BookingRequest[]
  filter: BookingStatus | 'All' | 'Open'
  onFilterChange: (f: BookingStatus | 'All' | 'Open') => void
  selected: BookingRequest | null
  onSelect: (r: BookingRequest) => void
  today: string
}) {
  const filterOpts: { value: BookingStatus | 'All' | 'Open'; label: string }[] = [
    { value: 'Open', label: 'Open' },
    { value: 'All', label: 'All' },
    ...ALL_STATUSES.map((s) => ({ value: s, label: STAGE_META[s].label })),
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5 flex-wrap">
        {filterOpts.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onFilterChange(opt.value)}
            className={`font-heading text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all ${
              filter === opt.value
                ? 'border-brand-red text-brand-red bg-brand-red/8'
                : 'border-white/8 text-white/30 hover:border-white/20 hover:text-white/60'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="border border-white/6 p-12 text-center">
          <p className="font-body text-sm text-white/25">No bookings in this filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-px">
          <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1fr] gap-3 px-4 py-2 font-heading text-[9px] uppercase tracking-widest text-white/20">
            <span>Name</span><span>Venue / Company</span><span>Event Date</span>
            <span>Event Type</span><span>Status</span><span>Received</span>
          </div>
          {requests.map((r) => {
            const isFollowUp = r.followUpDate && r.followUpDate <= today && !CLOSED_STAGES.includes(r.status)
            const meta = STAGE_META[r.status]
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelect(r)}
                className={`w-full text-left border transition-all ${
                  selected?.id === r.id
                    ? 'border-brand-red/40 bg-brand-red/5'
                    : 'border-white/6 bg-[#0d0d1e] hover:border-white/12'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1fr] gap-1 lg:gap-3 px-4 py-3.5 items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      {isFollowUp && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />}
                      <span className="font-body text-sm text-white font-medium truncate">{r.fullName}</span>
                    </div>
                    <span className="font-body text-xs text-white/35 truncate">{r.email}</span>
                  </div>
                  <span className="font-body text-sm text-white/50 truncate">{r.venueOrCompany || '—'}</span>
                  <span className="font-body text-sm text-white/50">{fmtShort(r.eventDate)}</span>
                  <span className="font-body text-xs text-white/50 truncate">{r.eventType}</span>
                  <span className={`font-heading text-[9px] uppercase tracking-widest border px-2 py-0.5 self-start ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span className="font-body text-xs text-white/25">{fmtShort(r.createdAt)}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Booking Drawer ─────────────────────────────────────────────────────────────

interface DrawerProps {
  booking: BookingRequest
  tab: 'details' | 'email'
  onTabChange: (t: 'details' | 'email') => void
  onClose: () => void
  onUpdate: (patch: Partial<BookingRequest>) => void
  onSave: () => void
  onAdvance: () => void
  onConvertToShow: () => void
  saving: boolean
  saved: boolean
  templates: EmailTemplate[]
  selectedTemplateId: string
  onTemplateChange: (id: string) => void
  toEmail: string
  onToEmailChange: (v: string) => void
  editableSubject: string
  onSubjectChange: (v: string) => void
  editableBody: string
  onBodyChange: (v: string) => void
  showPreview: boolean
  onTogglePreview: () => void
  sending: boolean
  sendResult: { ok: boolean; msg: string } | null
  onSendEmail: () => void
  emailLogs: BookingEmailLog[]
  inboundEmails: InboundEmail[]
  loadingLogs: boolean
}

function BookingDrawer({
  booking, tab, onTabChange, onClose, onUpdate, onSave, onAdvance, onConvertToShow,
  saving, saved, templates, selectedTemplateId, onTemplateChange, toEmail, onToEmailChange,
  editableSubject, onSubjectChange, editableBody, onBodyChange, showPreview, onTogglePreview,
  sending, sendResult, onSendEmail, emailLogs, inboundEmails, loadingLogs,
}: DrawerProps) {
  const meta = STAGE_META[booking.status]
  const nextStage = NEXT_STAGE[booking.status]
  const thread = [
    ...emailLogs.map((l) => ({ kind: 'sent' as const, date: l.sentAt, data: l })),
    ...inboundEmails.map((e) => ({ kind: 'received' as const, date: e.receivedAt, data: e })),
  ].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      {/* Drawer header */}
      <div className="px-6 py-5 border-b border-white/8 flex-shrink-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h2 className="font-display uppercase text-xl text-white leading-tight truncate">{booking.fullName}</h2>
            <p className="font-body text-xs text-white/35 mt-0.5">{booking.eventType} · {fmt(booking.eventDate)}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close drawer" className="text-white/30 hover:text-white transition-colors flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stage badge + advance */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-heading text-[10px] uppercase tracking-widest border px-2.5 py-1 ${meta.color}`}>
            {meta.label}
          </span>
          {nextStage && (
            <button
              type="button"
              onClick={onAdvance}
              disabled={saving}
              className="font-heading text-[10px] uppercase tracking-widest border border-white/12 text-white/35 px-2.5 py-1 hover:border-brand-red/40 hover:text-brand-red transition-all disabled:opacity-50"
            >
              → {STAGE_META[nextStage].label}
            </button>
          )}
          {saved && (
            <span className="font-heading text-[10px] text-green-400 uppercase tracking-widest flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Drawer tabs */}
      <div className="flex border-b border-white/8 flex-shrink-0">
        {(['details', 'email'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTabChange(t)}
            className={`font-heading text-[10px] uppercase tracking-widest px-5 py-3 transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-brand-red text-white' : 'border-transparent text-white/30 hover:text-white/60'
            }`}
          >
            {t === 'details' ? 'Details' : `Conversation${thread.length > 0 ? ` (${thread.length})` : ''}`}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">

        {tab === 'details' && (
          <div className="flex flex-col gap-6">

            {/* Contact info */}
            <div>
              <p className="font-heading text-[10px] uppercase tracking-widest text-white/25 mb-3">Contact</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Email', value: booking.email, href: `mailto:${booking.email}` },
                  { label: 'Phone', value: booking.phone || '—' },
                  { label: 'Venue / Company', value: booking.venueOrCompany || '—' },
                  { label: 'City', value: booking.city || '—' },
                  { label: 'Budget', value: booking.budgetRange || '—' },
                  { label: 'Guests', value: booking.guestCount || '—' },
                ].map(({ label, value, href }) => (
                  <div key={label} className="flex gap-3 items-start">
                    <span className="font-heading text-[9px] uppercase tracking-widest text-white/25 w-20 flex-shrink-0 pt-0.5">{label}</span>
                    {href ? (
                      <a href={href} className="font-body text-sm text-white/70 hover:text-brand-red transition-colors min-w-0 truncate">{value}</a>
                    ) : (
                      <span className="font-body text-sm text-white/70 min-w-0 truncate">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {booking.message && (
              <div>
                <p className="font-heading text-[10px] uppercase tracking-widest text-white/25 mb-2">Message</p>
                <p className="font-body text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{booking.message}</p>
              </div>
            )}

            {/* CRM fields */}
            <div className="border-t border-white/6 pt-5 flex flex-col gap-4">
              <p className="font-heading text-[10px] uppercase tracking-widest text-white/25">CRM</p>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Status</label>
                <select
                  value={booking.status}
                  onChange={(e) => onUpdate({ status: e.target.value as BookingStatus })}
                  className={inputClass}
                  aria-label="Booking status"
                >
                  {ALL_STATUSES.map((s) => <option key={s} value={s}>{STAGE_META[s].label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Quote Amount (USD)</label>
                <input
                  type="number"
                  min="0"
                  value={booking.quoteAmount ?? ''}
                  onChange={(e) => onUpdate({ quoteAmount: e.target.value ? Number(e.target.value) : undefined })}
                  className={inputClass}
                  placeholder="e.g. 1500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Follow-up Date</label>
                <input
                  type="date"
                  value={booking.followUpDate ?? ''}
                  onChange={(e) => onUpdate({ followUpDate: e.target.value })}
                  className={inputClass}
                  aria-label="Follow-up date"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Assigned To</label>
                <input
                  type="text"
                  value={booking.assignedTo ?? ''}
                  onChange={(e) => onUpdate({ assignedTo: e.target.value })}
                  className={inputClass}
                  placeholder="Team member"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Internal Notes</label>
                <textarea
                  value={booking.notes ?? ''}
                  onChange={(e) => onUpdate({ notes: e.target.value })}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="Private notes…"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={saving}
                  className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all btn-glow-red disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                {(booking.status === 'Confirmed' || booking.status === 'Advance Sent' || booking.status === 'Paid') && (
                  <button
                    type="button"
                    onClick={onConvertToShow}
                    className="font-heading text-xs uppercase tracking-widest border border-green-400/30 text-green-400/80 px-5 py-2.5 hover:border-green-400 hover:text-green-400 transition-all"
                  >
                    → Convert to Show
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'email' && (
          <div className="flex flex-col gap-6">

            {/* Compose */}
            <div className="flex flex-col gap-4">
              <p className="font-heading text-[10px] uppercase tracking-widest text-white/25">Send Email</p>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => { onTemplateChange(e.target.value); }}
                  className={inputClass}
                  aria-label="Email template"
                >
                  <option value="">— Select template —</option>
                  {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">To</label>
                <input type="email" value={toEmail} onChange={(e) => onToEmailChange(e.target.value)} className={inputClass} aria-label="Recipient email" placeholder="recipient@example.com" />
              </div>

              {editableSubject && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Subject</label>
                  <input type="text" value={editableSubject} onChange={(e) => onSubjectChange(e.target.value)} className={inputClass} aria-label="Email subject" placeholder="Subject line" />
                </div>
              )}

              {editableBody && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Body</label>
                    <button type="button" onClick={onTogglePreview} className="font-heading text-[10px] uppercase tracking-widest text-white/30 hover:text-white border border-white/8 px-2 py-1 transition-colors">
                      {showPreview ? 'Edit' : 'Preview'}
                    </button>
                  </div>
                  {showPreview ? (
                    <iframe srcDoc={editableBody} className="w-full h-52 border border-white/8" sandbox="allow-same-origin" title="Preview" />
                  ) : (
                    <textarea value={editableBody} onChange={(e) => onBodyChange(e.target.value)} className={`${inputClass} h-36 resize-y font-mono text-xs`} spellCheck={false} />
                  )}
                </div>
              )}

              {sendResult && (
                <p className={`font-body text-sm ${sendResult.ok ? 'text-green-400' : 'text-red-400'}`}>{sendResult.msg}</p>
              )}

              <button
                type="button"
                onClick={onSendEmail}
                disabled={!selectedTemplateId || !toEmail || !editableSubject || sending}
                className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all disabled:opacity-50 self-start"
              >
                {sending ? 'Sending…' : 'Send Email'}
              </button>
            </div>

            {/* Thread */}
            <div className="border-t border-white/6 pt-5 flex flex-col gap-3">
              <p className="font-heading text-[10px] uppercase tracking-widest text-white/25">
                Conversation {thread.length > 0 ? `· ${thread.length} messages` : ''}
              </p>

              {loadingLogs && <p className="font-body text-xs text-white/30">Loading…</p>}
              {!loadingLogs && thread.length === 0 && (
                <p className="font-body text-xs text-white/25 italic">No emails yet for this booking.</p>
              )}

              {thread.map((item) => {
                if (item.kind === 'sent') {
                  const log = item.data as BookingEmailLog
                  return (
                    <div key={log.id} className="border border-white/8 bg-[#111121] px-4 py-3">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-heading text-[9px] uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                          </svg>
                          Sent to {log.toEmail}
                        </span>
                        <span className={`font-heading text-[9px] uppercase tracking-widest border px-1.5 py-0.5 ${log.status === 'sent' ? 'text-green-400/60 border-green-400/20' : 'text-red-400/60 border-red-400/20'}`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="font-body text-sm text-white/70">{log.subject}</p>
                      <p className="font-body text-xs text-white/25 mt-1">{fmt(log.sentAt)}</p>
                    </div>
                  )
                } else {
                  const email = item.data as InboundEmail
                  return (
                    <div key={email.id} className={`border px-4 py-3 ${email.read ? 'border-white/8 bg-[#111121]' : 'border-blue-400/25 bg-blue-400/5'}`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {!email.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                        <span className="font-heading text-[9px] uppercase tracking-widest text-blue-400/60">Reply received</span>
                      </div>
                      <p className="font-body text-sm text-white font-medium">{email.fromName || email.fromEmail}</p>
                      <p className="font-body text-sm text-white/60 mt-0.5">{email.subject}</p>
                      {email.bodyText && (
                        <p className="font-body text-xs text-white/40 leading-relaxed mt-1.5 line-clamp-3">{email.bodyText.slice(0, 200)}</p>
                      )}
                      <p className="font-body text-xs text-white/25 mt-1.5">{fmt(email.receivedAt)}</p>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
