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
  const [drawerTab, setDrawerTab] = useState<'details' | 'email' | 'quote' | 'contract' | 'invoice'>('details')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [queueExpanded, setQueueExpanded] = useState(false)

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
        const reqs: BookingRequest[] = d.bookingRequests ?? []
        if (reqs.length) setRequests(reqs)
        if (td.templates) {
          setTemplates(
            (td.templates as EmailTemplate[]).filter((t) => !t.slug.startsWith('venue-'))
          )
        }
        // Deep-link from Inbox "Go to detail →"
        const raw = sessionStorage.getItem('openEntityId')
        if (raw) {
          try {
            const { type, id } = JSON.parse(raw) as { type: string; id: string }
            if (type === 'booking') {
              const target = reqs.find((r) => r.id === id)
              if (target) openDrawer(target, 'email')
            }
          } catch { /* ignore */ }
          sessionStorage.removeItem('openEntityId')
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const duplicateBooking = async (booking: BookingRequest) => {
    const now = new Date().toISOString()
    const clone: BookingRequest = {
      ...booking,
      id: `${Date.now()}`,
      status: 'New',
      eventDate: '',
      quoteAmount: undefined,
      followUpDate: undefined,
      assignedTo: undefined,
      notes: undefined,
      createdAt: now,
      updatedAt: now,
    }
    const updated = [clone, ...requests]
    await persist(updated)
    setSelected(null)
    setTimeout(() => openDrawer(clone), 50)
  }

  const advanceStage = async (booking: BookingRequest) => {
    const next = NEXT_STAGE[booking.status]
    if (!next) return
    const patched = { ...booking, status: next, updatedAt: new Date().toISOString() }
    const updated = requests.map((r) => r.id === booking.id ? patched : r)
    setSelected(patched)
    await persist(updated)
  }

  const snoozeFollowUp = async (id: string, days: number) => {
    const snoozeDate = new Date()
    snoozeDate.setDate(snoozeDate.getDate() + days)
    const newDate = snoozeDate.toISOString().split('T')[0]
    const updated = requests.map((r) =>
      r.id === id ? { ...r, followUpDate: newDate, updatedAt: new Date().toISOString() } : r
    )
    await persist(updated)
  }

  const quickContacted = async (id: string) => {
    const updated = requests.map((r) =>
      r.id === id && r.status === 'New'
        ? { ...r, status: 'Contacted' as BookingStatus, updatedAt: new Date().toISOString() }
        : r
    )
    await persist(updated)
  }

  const openDrawer = (r: BookingRequest, tab: 'details' | 'email' | 'quote' | 'invoice' = 'details') => {
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

  const emailCounts: Record<string, number> = {}
  for (const r of requests) emailCounts[r.email] = (emailCounts[r.email] ?? 0) + 1
  const repeatEmails = new Set(Object.entries(emailCounts).filter(([, c]) => c > 1).map(([e]) => e))

  const followUpQueue = requests
    .filter((r) => r.followUpDate && r.followUpDate <= today && !CLOSED_STAGES.includes(r.status) && r.status !== 'Confirmed')
    .sort((a, b) => (a.followUpDate ?? '').localeCompare(b.followUpDate ?? ''))

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

        {/* Follow-up Queue */}
        {!loading && followUpQueue.length > 0 && (
          <div className="mb-5 border border-orange-400/30 bg-orange-400/[0.04]">
            <button
              type="button"
              onClick={() => setQueueExpanded((v) => !v)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-orange-400/5 transition-colors text-left"
            >
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
              <span className="font-heading text-xs uppercase tracking-widest text-orange-400">
                {followUpQueue.length} follow-up{followUpQueue.length > 1 ? 's' : ''} due
              </span>
              <div className="flex-1" />
              <svg className={`w-3.5 h-3.5 text-orange-400/60 transition-transform ${queueExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {queueExpanded && (
              <div className="border-t border-orange-400/15 divide-y divide-orange-400/8">
                {followUpQueue.map((r) => {
                  const daysOverdue = Math.floor(
                    (new Date(today + 'T00:00:00').getTime() - new Date(r.followUpDate! + 'T00:00:00').getTime()) / 86400000
                  )
                  return (
                    <div key={r.id} className="flex items-center gap-3 px-5 py-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`font-heading text-[8px] uppercase tracking-widest border px-1.5 py-0.5 flex-shrink-0 ${STAGE_META[r.status].color}`}>
                          {STAGE_META[r.status].label}
                        </span>
                        <span className="font-body text-sm text-white truncate">{r.fullName}</span>
                        {r.eventType && <span className="font-body text-xs text-white/30 truncate hidden sm:block">{r.eventType}</span>}
                        <span className={`font-heading text-[9px] uppercase tracking-widest flex-shrink-0 ${daysOverdue === 0 ? 'text-orange-400' : 'text-red-400'}`}>
                          {daysOverdue === 0 ? 'Today' : `${daysOverdue}d overdue`}
                        </span>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        {r.status === 'New' && (
                          <button
                            type="button"
                            onClick={() => quickContacted(r.id)}
                            className="font-heading text-[9px] uppercase tracking-widest border border-yellow-400/30 text-yellow-400/70 px-2.5 py-1 hover:bg-yellow-400/10 transition-all"
                          >
                            Contacted
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => snoozeFollowUp(r.id, 3)}
                          className="font-heading text-[9px] uppercase tracking-widest border border-white/10 text-white/30 px-2.5 py-1 hover:border-white/25 hover:text-white/60 transition-all"
                        >
                          +3d
                        </button>
                        <button
                          type="button"
                          onClick={() => snoozeFollowUp(r.id, 7)}
                          className="font-heading text-[9px] uppercase tracking-widest border border-white/10 text-white/30 px-2.5 py-1 hover:border-white/25 hover:text-white/60 transition-all"
                        >
                          +7d
                        </button>
                        <button
                          type="button"
                          onClick={() => openDrawer(r)}
                          className="font-heading text-[9px] uppercase tracking-widest border border-orange-400/25 text-orange-400/60 px-2.5 py-1 hover:bg-orange-400/10 transition-all"
                        >
                          Open →
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="font-body text-sm text-white/30 py-16 text-center">Loading…</div>
        ) : view === 'pipeline' ? (
          <PipelineView
            requests={requests}
            selected={selected}
            onSelect={openDrawer}
            today={today}
            repeatEmails={repeatEmails}
          />
        ) : (
          <ListView
            requests={listData}
            filter={listFilter}
            onFilterChange={(f) => { setListFilter(f); setSelected(null) }}
            selected={selected}
            onSelect={openDrawer}
            today={today}
            repeatEmails={repeatEmails}
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
              setDrawerTab(t as 'details' | 'email' | 'quote' | 'contract' | 'invoice')
              if (t === 'email') loadEmailLogs(selected.id)
            }}

            repeatBookings={requests.filter((r) => r.id !== selected.id && r.email === selected.email)}
            onClose={() => setSelected(null)}
            onUpdate={updateSelected}
            onSave={saveDetail}
            onAdvance={() => advanceStage(selected)}
            onDuplicate={() => duplicateBooking(selected)}
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
  requests, selected, onSelect, today, repeatEmails,
}: {
  requests: BookingRequest[]
  selected: BookingRequest | null
  onSelect: (r: BookingRequest, tab?: 'details' | 'email') => void
  today: string
  repeatEmails: Set<string>
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
                          <div className="flex items-center gap-1.5 mb-1">
                            <p className="font-heading text-[11px] text-white truncate flex-1">{r.fullName}</p>
                            {repeatEmails.has(r.email) && (
                              <span className="font-heading text-[8px] uppercase tracking-widest text-cyan-400 border border-cyan-400/30 px-1 flex-shrink-0">↺</span>
                            )}
                          </div>
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
  requests, filter, onFilterChange, selected, onSelect, today, repeatEmails,
}: {
  requests: BookingRequest[]
  filter: BookingStatus | 'All' | 'Open'
  onFilterChange: (f: BookingStatus | 'All' | 'Open') => void
  selected: BookingRequest | null
  onSelect: (r: BookingRequest) => void
  today: string
  repeatEmails: Set<string>
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
                      {repeatEmails.has(r.email) && (
                        <span className="font-heading text-[8px] uppercase tracking-widest text-cyan-400 border border-cyan-400/30 px-1.5 py-0.5 flex-shrink-0">Repeat</span>
                      )}
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
  tab: 'details' | 'email' | 'quote' | 'contract' | 'invoice'
  onTabChange: (t: 'details' | 'email' | 'quote' | 'contract' | 'invoice') => void
  onClose: () => void
  onUpdate: (patch: Partial<BookingRequest>) => void
  onSave: () => void
  onAdvance: () => void
  onConvertToShow: () => void
  onDuplicate: () => void
  repeatBookings: BookingRequest[]
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

function buildInvoiceHtml(b: BookingRequest): string {
  const invoiceNo = `RRB-INV-${b.id.slice(-6).toUpperCase()}`
  const issued = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const dueDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  })()
  const eventDate = b.eventDate
    ? new Date(b.eventDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'To be confirmed'
  const isPaid = b.status === 'Paid' || b.status === 'Completed'
  const perfFee = b.quoteAmount ?? 0
  const total = perfFee
  const deposit = perfFee > 0 ? Math.round(perfFee * 0.5 * 100) / 100 : 0
  const balance = total - deposit
  const fmtAmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Invoice ${invoiceNo} — Rebound Rock Band</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, serif; color: #1a1a1a; background: #fff; padding: 48px 56px; max-width: 800px; margin: 0 auto; font-size: 13px; line-height: 1.6; }
  .header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 3px solid #e0101e; padding-bottom: 24px; margin-bottom: 32px; }
  .brand-name { font-size: 28px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
  .brand-sub { font-size: 11px; color: #888; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }
  .doc-meta { text-align: right; }
  .doc-meta .title { font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #e0101e; }
  .doc-meta .no { font-size: 13px; color: #555; margin-top: 4px; }
  .doc-meta .date { font-size: 11px; color: #888; margin-top: 2px; }
  h2 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: #999; border-bottom: 1px solid #e8e8e8; padding-bottom: 6px; margin: 24px 0 12px; font-family: Arial, sans-serif; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 32px; margin-bottom: 8px; }
  .field-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; font-family: Arial, sans-serif; margin-bottom: 2px; }
  .field-value { font-size: 13px; color: #1a1a1a; font-weight: 500; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  thead tr { background: #f4f4f4; }
  th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; padding: 10px 14px; font-family: Arial, sans-serif; font-weight: 600; }
  td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
  td.right { text-align: right; font-weight: 600; }
  .total-section { display: flex; justify-content: flex-end; margin-top: 8px; }
  .total-box { min-width: 260px; }
  .total-row-line { display: flex; justify-content: space-between; align-items: baseline; padding: 5px 0; font-family: Arial, sans-serif; font-size: 12px; color: #555; }
  .total-grand { display: flex; justify-content: space-between; align-items: baseline; border-top: 2px solid #1a1a1a; padding-top: 10px; margin-top: 4px; }
  .total-grand-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-family: Arial, sans-serif; }
  .total-grand-amount { font-size: 26px; font-weight: 700; color: #e0101e; }
  .status-badge { display: inline-block; padding: 4px 14px; font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px; }
  .status-paid { background: #dcfce7; color: #16a34a; }
  .status-outstanding { background: #fef9c3; color: #a16207; }
  .payment-box { background: #fafafa; border: 1px solid #e8e8e8; padding: 14px 16px; margin-top: 8px; font-size: 12px; color: #555; line-height: 1.8; }
  .footer { margin-top: 32px; border-top: 1px solid #e8e8e8; padding-top: 16px; font-size: 11px; color: #999; font-family: Arial, sans-serif; text-align: center; }
  @media print { body { padding: 24px 32px; } @page { margin: 0.6in; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-name">Rebound Rock Band</div>
      <div class="brand-sub">South Florida · Live Classic Rock</div>
    </div>
    <div class="doc-meta">
      <div class="title">Invoice</div>
      <div class="no">${invoiceNo}</div>
      <div class="date">Issued ${issued}</div>
    </div>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
    <div>
      <h2 style="margin-top:0;">Bill To</h2>
      <div class="field-value" style="font-size:15px;">${b.fullName}</div>
      <div style="font-size:12px;color:#555;margin-top:2px;">${b.email}</div>
      ${b.phone ? `<div style="font-size:12px;color:#555;">${b.phone}</div>` : ''}
      ${b.venueOrCompany ? `<div style="font-size:12px;color:#555;margin-top:4px;">${b.venueOrCompany}</div>` : ''}
      ${b.city ? `<div style="font-size:12px;color:#555;">${b.city}</div>` : ''}
    </div>
    <div style="text-align:right;">
      <div class="field-label">Status</div>
      <div style="margin-top:4px;">
        <span class="status-badge ${isPaid ? 'status-paid' : 'status-outstanding'}">${isPaid ? 'Paid' : 'Outstanding'}</span>
      </div>
      <div class="field-label" style="margin-top:10px;">Due Date</div>
      <div class="field-value">${dueDate}</div>
    </div>
  </div>

  <h2>Event Details</h2>
  <div class="grid2">
    <div><div class="field-label">Event Date</div><div class="field-value">${eventDate}</div></div>
    <div><div class="field-label">Event Type</div><div class="field-value">${b.eventType || '—'}</div></div>
    ${b.venueOrCompany ? `<div><div class="field-label">Venue</div><div class="field-value">${b.venueOrCompany}</div></div>` : ''}
    ${b.city ? `<div><div class="field-label">Location</div><div class="field-value">${b.city}</div></div>` : ''}
  </div>

  <h2>Line Items</h2>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong>Live Performance — Rebound Rock Band</strong><br/>
          <span style="font-size:11px;color:#888;">Two sets (approx. 45 min each) · classic rock repertoire</span>
        </td>
        <td class="right">${fmtAmt(perfFee)}</td>
      </tr>
    </tbody>
  </table>

  <div class="total-section">
    <div class="total-box">
      ${deposit > 0 ? `
      <div class="total-row-line">
        <span>Deposit (50% — due on booking)</span>
        <span>${fmtAmt(deposit)}</span>
      </div>
      <div class="total-row-line">
        <span>Balance (due day of show)</span>
        <span>${fmtAmt(balance)}</span>
      </div>` : ''}
      <div class="total-grand">
        <span class="total-grand-label">Total Due</span>
        <span class="total-grand-amount">${fmtAmt(total)}</span>
      </div>
    </div>
  </div>

  <h2>Payment Instructions</h2>
  <div class="payment-box">
    <strong>Accepted payment methods:</strong><br/>
    • <strong>Zelle</strong> — send to booking@reboundrockband.com<br/>
    • <strong>Check</strong> — payable to "Rebound Rock Band"<br/>
    • <strong>Cash</strong> — at time of performance<br/><br/>
    Please reference invoice number <strong>${invoiceNo}</strong> with your payment.
    ${!isPaid ? `<br/><br/><em style="color:#a16207;">A 50% deposit is required to secure your date. The remaining balance is due before the performance begins.</em>` : ''}
  </div>

  ${b.notes ? `<h2>Notes</h2><div style="font-size:13px;color:#555;line-height:1.6;white-space:pre-wrap;">${b.notes}</div>` : ''}

  <div class="footer">
    booking@reboundrockband.com · reboundrockband.com · South Florida
  </div>
</body>
</html>`
}

function buildContractHtml(b: BookingRequest): string {
  const contractNo = `RRB-C-${b.id.slice(-6).toUpperCase()}`
  const issued = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const eventDate = b.eventDate
    ? new Date(b.eventDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'To be confirmed'
  const amount = b.quoteAmount ? `$${b.quoteAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '[AMOUNT TBD]'
  const deposit = b.quoteAmount ? `$${(b.quoteAmount * 0.5).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '[50% of Total]'
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Performance Contract ${contractNo} — Rebound Rock Band</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, serif; color: #1a1a1a; background: #fff; padding: 48px 56px; max-width: 800px; margin: 0 auto; font-size: 13px; line-height: 1.6; }
  .header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 3px solid #e0101e; padding-bottom: 24px; margin-bottom: 32px; }
  .brand-name { font-size: 28px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
  .brand-sub { font-size: 11px; color: #888; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }
  .doc-meta { text-align: right; }
  .doc-meta .title { font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #e0101e; }
  .doc-meta .no { font-size: 12px; color: #555; margin-top: 4px; }
  .doc-meta .date { font-size: 11px; color: #888; margin-top: 2px; }
  h2 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: #999; border-bottom: 1px solid #e8e8e8; padding-bottom: 6px; margin: 24px 0 12px; font-family: Arial, sans-serif; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 32px; margin-bottom: 8px; }
  .field-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; font-family: Arial, sans-serif; margin-bottom: 2px; }
  .field-value { font-size: 13px; color: #1a1a1a; font-weight: 500; }
  .clause { margin-bottom: 14px; }
  .clause-num { font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; color: #333; }
  .clause-title { font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 0.06em; }
  .highlight-box { background: #fafafa; border: 1px solid #e8e8e8; padding: 14px 16px; margin: 8px 0; }
  .amount-large { font-size: 22px; font-weight: 700; color: #e0101e; }
  .sig-block { margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .sig-line { border-top: 1px solid #ccc; padding-top: 8px; font-size: 10px; color: #888; font-family: Arial, sans-serif; }
  .sig-name { font-size: 12px; color: #333; font-weight: 600; margin-top: 4px; }
  .footer { margin-top: 32px; border-top: 1px solid #e8e8e8; padding-top: 16px; font-size: 11px; color: #999; font-family: Arial, sans-serif; text-align: center; }
  @media print { body { padding: 24px 32px; } @page { margin: 0.6in; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-name">Rebound Rock Band</div>
      <div class="brand-sub">South Florida · Live Classic Rock</div>
    </div>
    <div class="doc-meta">
      <div class="title">Performance Agreement</div>
      <div class="no">${contractNo}</div>
      <div class="date">Dated ${issued}</div>
    </div>
  </div>

  <p>This Performance Agreement ("Agreement") is entered into between <strong>Rebound Rock Band</strong> ("Band") and the client identified below ("Client"), governing the live musical performance described herein.</p>

  <h2>1. Parties</h2>
  <div class="grid2">
    <div><div class="field-label">Client Name</div><div class="field-value">${b.fullName}</div></div>
    <div><div class="field-label">Email</div><div class="field-value">${b.email}</div></div>
    ${b.phone ? `<div><div class="field-label">Phone</div><div class="field-value">${b.phone}</div></div>` : ''}
    ${b.venueOrCompany ? `<div><div class="field-label">Venue / Organization</div><div class="field-value">${b.venueOrCompany}</div></div>` : ''}
    ${b.city ? `<div><div class="field-label">City</div><div class="field-value">${b.city}</div></div>` : ''}
  </div>

  <h2>2. Event Details</h2>
  <div class="grid2">
    <div><div class="field-label">Event Date</div><div class="field-value">${eventDate}</div></div>
    <div><div class="field-label">Event Type</div><div class="field-value">${b.eventType || '—'}</div></div>
    ${b.guestCount ? `<div><div class="field-label">Expected Attendance</div><div class="field-value">${b.guestCount} guests</div></div>` : ''}
  </div>

  <h2>3. Performance Scope</h2>
  <div class="clause">
    Rebound Rock Band will deliver a live classic rock performance consisting of <strong>two (2) sets of approximately 45 minutes each</strong> (approximately 90 minutes total), with a 20-minute break between sets. Set times to be confirmed no later than 7 days prior to the event. The Band's repertoire spans classic rock from the 1950s through the 1990s.
  </div>

  <h2>4. Compensation</h2>
  <div class="highlight-box">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;">
      <span style="font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#666;">Total Performance Fee</span>
      <span class="amount-large">${amount}</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-family:Arial,sans-serif;font-size:12px;">
      <div><strong>Deposit (due upon signing):</strong> ${deposit}</div>
      <div><strong>Balance (due day of show):</strong> ${deposit}</div>
    </div>
  </div>
  <p>Payment may be made via Zelle, check payable to "Rebound Rock Band," or cash. The deposit is required to secure the date. The balance is due in full before the Band takes the stage.</p>

  <h2>5. Cancellation & Rescheduling</h2>
  <div class="clause">
    <p><strong>By Client:</strong> If Client cancels with 30+ days notice, the deposit will be refunded in full. Cancellations within 30 days of the event forfeit the deposit. Cancellations within 7 days of the event are liable for the full contract amount.</p>
    <p style="margin-top:8px;"><strong>By Band:</strong> If Rebound Rock Band must cancel due to circumstances beyond their control (illness, emergency, or force majeure), a full refund of all payments will be issued. Every reasonable effort will be made to find a suitable replacement act.</p>
  </div>

  <h2>6. Technical Requirements</h2>
  <div class="clause">
    Client agrees to provide: (a) a minimum stage area of 12 ft × 10 ft; (b) access to adequate electrical power (two 20-amp circuits minimum); (c) at least one hour of setup/soundcheck time before the event begins; (d) parking accommodations for a band trailer or cargo van. Detailed tech rider available upon request.
  </div>

  <h2>7. General Terms</h2>
  <div class="clause">
    The Band reserves the right to audio-record and/or photograph the performance for promotional purposes unless expressly prohibited in writing. Client grants permission for the Band to display its name and logo at the venue. This Agreement constitutes the entire understanding between the parties and supersedes all prior negotiations.
  </div>

  ${b.notes ? `<h2>8. Additional Notes</h2><div class="clause">${b.notes}</div>` : ''}

  <div class="sig-block">
    <div>
      <div class="sig-line">Client Signature</div>
      <div class="sig-name">${b.fullName}</div>
      <div style="margin-top:20px;border-top:1px solid #ccc;padding-top:6px;font-size:10px;color:#aaa;font-family:Arial,sans-serif;">Date</div>
    </div>
    <div>
      <div class="sig-line">Rebound Rock Band — Authorized Representative</div>
      <div style="margin-top:20px;border-top:1px solid #ccc;padding-top:6px;font-size:10px;color:#aaa;font-family:Arial,sans-serif;">Date</div>
    </div>
  </div>

  <div class="footer">
    booking@reboundrockband.com · reboundrockband.com · South Florida
  </div>
</body>
</html>`
}

function buildQuoteHtml(b: BookingRequest): string {
  const quoteNo = `RRB-${b.id.slice(-6).toUpperCase()}`
  const issued = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const eventDate = b.eventDate
    ? new Date(b.eventDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'To be confirmed'
  const amount = b.quoteAmount ? `$${b.quoteAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'To be determined'
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Quote ${quoteNo} — Rebound Rock Band</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, serif; color: #1a1a1a; background: #fff; padding: 48px 56px; max-width: 800px; margin: 0 auto; }
  .header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 3px solid #e0101e; padding-bottom: 24px; margin-bottom: 32px; }
  .brand-name { font-size: 28px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
  .brand-sub { font-size: 12px; color: #888; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }
  .quote-meta { text-align: right; }
  .quote-meta .title { font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #e0101e; }
  .quote-meta .no { font-size: 13px; color: #555; margin-top: 4px; }
  .quote-meta .date { font-size: 12px; color: #888; margin-top: 2px; }
  .section { margin-bottom: 28px; }
  .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: #999; border-bottom: 1px solid #e8e8e8; padding-bottom: 6px; margin-bottom: 12px; font-family: Arial, sans-serif; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
  .field { font-size: 13px; }
  .field-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; font-family: Arial, sans-serif; margin-bottom: 2px; }
  .field-value { font-size: 14px; color: #1a1a1a; }
  .line-items { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  .line-items thead tr { background: #f4f4f4; }
  .line-items th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; padding: 10px 14px; font-family: Arial, sans-serif; font-weight: 600; }
  .line-items td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
  .line-items td.amount { text-align: right; font-weight: 600; }
  .total-row { display: flex; justify-content: flex-end; margin-top: 8px; }
  .total-box { border-top: 2px solid #1a1a1a; padding-top: 10px; min-width: 220px; display: flex; justify-content: space-between; align-items: baseline; }
  .total-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; font-family: Arial, sans-serif; }
  .total-amount { font-size: 22px; font-weight: 700; color: #e0101e; }
  .notes-box { background: #fafafa; border: 1px solid #e8e8e8; padding: 14px 16px; font-size: 13px; color: #555; line-height: 1.6; white-space: pre-wrap; }
  .footer { margin-top: 40px; border-top: 1px solid #e8e8e8; padding-top: 20px; font-size: 12px; color: #888; font-family: Arial, sans-serif; display: flex; justify-content: space-between; }
  .sig-block { margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .sig-line { border-top: 1px solid #ccc; padding-top: 6px; font-size: 11px; color: #888; font-family: Arial, sans-serif; }
  @media print {
    body { padding: 24px 32px; }
    @page { margin: 0.6in; }
  }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-name">Rebound Rock Band</div>
      <div class="brand-sub">South Florida · Live Classic Rock</div>
    </div>
    <div class="quote-meta">
      <div class="title">Performance Quote</div>
      <div class="no">${quoteNo}</div>
      <div class="date">Issued ${issued}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Client Information</div>
    <div class="grid2">
      <div class="field"><div class="field-label">Name</div><div class="field-value">${b.fullName}</div></div>
      <div class="field"><div class="field-label">Email</div><div class="field-value">${b.email}</div></div>
      ${b.phone ? `<div class="field"><div class="field-label">Phone</div><div class="field-value">${b.phone}</div></div>` : ''}
      ${b.venueOrCompany ? `<div class="field"><div class="field-label">Venue / Company</div><div class="field-value">${b.venueOrCompany}</div></div>` : ''}
      ${b.city ? `<div class="field"><div class="field-label">City</div><div class="field-value">${b.city}</div></div>` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Event Details</div>
    <div class="grid2">
      <div class="field"><div class="field-label">Event Date</div><div class="field-value">${eventDate}</div></div>
      <div class="field"><div class="field-label">Event Type</div><div class="field-value">${b.eventType || '—'}</div></div>
      ${b.guestCount ? `<div class="field"><div class="field-label">Expected Guests</div><div class="field-value">${b.guestCount}</div></div>` : ''}
      ${b.budgetRange ? `<div class="field"><div class="field-label">Budget Range</div><div class="field-value">${b.budgetRange}</div></div>` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Quote Summary</div>
    <table class="line-items">
      <thead>
        <tr>
          <th style="width:60%">Description</th>
          <th>Details</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Live Performance — Rebound Rock Band</td>
          <td>${b.eventType || 'Live Event'}</td>
          <td class="amount">${amount}</td>
        </tr>
        <tr>
          <td colspan="2" style="color:#999;font-size:12px;">Travel, setup, and soundcheck included</td>
          <td class="amount" style="color:#999;font-size:12px;">—</td>
        </tr>
      </tbody>
    </table>
    <div class="total-row">
      <div class="total-box">
        <span class="total-label">Total</span>
        <span class="total-amount">${amount}</span>
      </div>
    </div>
  </div>

  ${b.notes ? `<div class="section"><div class="section-title">Notes</div><div class="notes-box">${b.notes}</div></div>` : ''}

  <div class="sig-block">
    <div>
      <div class="sig-line">Client Signature &amp; Date</div>
    </div>
    <div>
      <div class="sig-line">Rebound Rock Band Representative</div>
    </div>
  </div>

  <div class="footer">
    <span>booking@reboundrockband.com · reboundrockband.com</span>
    <span>Quote valid for 30 days from issue date</span>
  </div>
</body>
</html>`
}

function BookingDrawer({
  booking, tab, onTabChange, onClose, onUpdate, onSave, onAdvance, onConvertToShow, onDuplicate,
  repeatBookings, saving, saved, templates, selectedTemplateId, onTemplateChange, toEmail, onToEmailChange,
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
          <button
            type="button"
            onClick={onDuplicate}
            disabled={saving}
            title="Duplicate this lead with status reset to New"
            className="font-heading text-[10px] uppercase tracking-widest border border-white/10 text-white/25 px-2.5 py-1 hover:border-white/25 hover:text-white/60 transition-all disabled:opacity-40 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
            </svg>
            Duplicate
          </button>
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
      <div className="flex border-b border-white/8 flex-shrink-0 overflow-x-auto">
        {(['details', 'email', 'quote', 'contract', 'invoice'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTabChange(t)}
            className={`font-heading text-[10px] uppercase tracking-widest px-4 py-3 transition-colors border-b-2 -mb-px whitespace-nowrap ${
              tab === t ? 'border-brand-red text-white' : 'border-transparent text-white/30 hover:text-white/60'
            }`}
          >
            {t === 'details' ? 'Details'
              : t === 'email' ? `Conversation${thread.length > 0 ? ` (${thread.length})` : ''}`
              : t === 'quote' ? 'Quote'
              : t === 'contract' ? 'Contract'
              : 'Invoice'}
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
                  ...(booking.source && booking.source !== 'website_form' ? [{ label: 'Source', value: booking.source }] : []),
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

            {repeatBookings.length > 0 && (
              <div className="border border-cyan-400/20 bg-cyan-400/[0.03] px-4 py-3.5">
                <p className="font-heading text-[10px] uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-2">
                  <span>↺</span> Repeat Client — {repeatBookings.length} previous booking{repeatBookings.length !== 1 ? 's' : ''}
                </p>
                <div className="flex flex-col gap-1.5">
                  {repeatBookings.map((rb) => (
                    <div key={rb.id} className="flex items-center gap-2.5">
                      <span className={`font-heading text-[8px] uppercase tracking-widest border px-1.5 py-0.5 flex-shrink-0 ${STAGE_META[rb.status].color}`}>
                        {STAGE_META[rb.status].label}
                      </span>
                      <span className="font-body text-xs text-white/60 truncate">{rb.eventType || 'Booking'}</span>
                      <span className="font-body text-[10px] text-white/30 flex-shrink-0">{fmtShort(rb.eventDate)}</span>
                      {rb.quoteAmount && (
                        <span className="font-heading text-[9px] text-green-400/70 flex-shrink-0">${rb.quoteAmount.toLocaleString()}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Lead Source</label>
                <select
                  value={booking.source || 'website_form'}
                  onChange={(e) => onUpdate({ source: e.target.value })}
                  className={inputClass}
                  aria-label="Lead source"
                >
                  <option value="website_form">Website Form</option>
                  <option value="referral">Referral</option>
                  <option value="facebook">Facebook / Instagram</option>
                  <option value="google">Google Search</option>
                  <option value="phone">Phone Call</option>
                  <option value="email">Direct Email</option>
                  <option value="repeat">Repeat Client</option>
                  <option value="other">Other</option>
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

        {tab === 'quote' && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-heading text-[10px] uppercase tracking-widest text-white/25 mb-1">Quote Preview</p>
              <p className="font-body text-xs text-white/30">Opens a print-ready quote in a new tab. Set quote amount in Details first.</p>
            </div>

            {/* Preview card */}
            <div className="border border-white/8 bg-[#0d0d1e] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-display uppercase text-sm text-white tracking-wide">Rebound Rock Band</span>
                <span className="font-heading text-[10px] uppercase tracking-widest text-brand-red">Performance Quote</span>
              </div>
              <div className="border-t border-white/8 pt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { label: 'Client', value: booking.fullName },
                  { label: 'Email', value: booking.email },
                  { label: 'Event Date', value: booking.eventDate ? new Date(booking.eventDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                  { label: 'Event Type', value: booking.eventType || '—' },
                  { label: 'Venue / Co.', value: booking.venueOrCompany || '—' },
                  { label: 'Guests', value: booking.guestCount || '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="font-heading text-[9px] uppercase tracking-widest text-white/25">{label}</div>
                    <div className="font-body text-xs text-white/70 truncate">{value}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/8 pt-3 flex items-center justify-between">
                <span className="font-heading text-[10px] uppercase tracking-widest text-white/40">Total</span>
                <span className={`font-display text-xl ${booking.quoteAmount ? 'text-green-400' : 'text-white/20'}`}>
                  {booking.quoteAmount ? `$${booking.quoteAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Amount TBD'}
                </span>
              </div>
            </div>

            {!booking.quoteAmount && (
              <p className="font-body text-xs text-orange-400/70">
                No quote amount set — go to Details to add one before printing.
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                const w = window.open('', '_blank')
                if (!w) return
                w.document.write(buildQuoteHtml(booking))
                w.document.close()
                w.focus()
                setTimeout(() => w.print(), 400)
              }}
              className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all self-start btn-glow-red"
            >
              Print / Save as PDF
            </button>
          </div>
        )}

        {tab === 'contract' && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-heading text-[10px] uppercase tracking-widest text-white/25 mb-1">Performance Contract</p>
              <p className="font-body text-xs text-white/30">Print-ready agreement covering scope, payment, cancellation policy, and technical requirements.</p>
            </div>

            {/* Summary card */}
            <div className="border border-white/8 bg-[#0d0d1e] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-display uppercase text-sm text-white tracking-wide">Rebound Rock Band</span>
                <span className="font-heading text-[10px] uppercase tracking-widest text-brand-red">Performance Agreement</span>
              </div>
              <div className="border-t border-white/8 pt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { label: 'Client', value: booking.fullName },
                  { label: 'Email', value: booking.email },
                  { label: 'Event Date', value: booking.eventDate ? new Date(booking.eventDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                  { label: 'Event Type', value: booking.eventType || '—' },
                  { label: 'Venue / Co.', value: booking.venueOrCompany || '—' },
                  { label: 'City', value: booking.city || '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="font-heading text-[9px] uppercase tracking-widest text-white/25">{label}</div>
                    <div className="font-body text-xs text-white/70 truncate">{value}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/8 pt-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-[9px] uppercase tracking-widest text-white/30">Total Fee</span>
                  <span className={`font-display text-lg ${booking.quoteAmount ? 'text-green-400' : 'text-white/20'}`}>
                    {booking.quoteAmount ? `$${booking.quoteAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Amount TBD'}
                  </span>
                </div>
                {booking.quoteAmount && (
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-[9px] uppercase tracking-widest text-white/20">Deposit · Balance</span>
                    <span className="font-body text-xs text-white/40">
                      ${(booking.quoteAmount * 0.5).toLocaleString('en-US', { minimumFractionDigits: 2 })} each
                    </span>
                  </div>
                )}
              </div>
              <div className="border-t border-white/8 pt-3 flex flex-col gap-1 text-xs font-body text-white/30">
                <span>• 2 sets × 45 min · 20-min break</span>
                <span>• 50% deposit on signing · 50% day of show</span>
                <span>• Full cancellation policy included</span>
              </div>
            </div>

            {!booking.quoteAmount && (
              <p className="font-body text-xs text-orange-400/70">
                No amount set — add quote amount in Details for a complete contract.
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                const w = window.open('', '_blank')
                if (!w) return
                w.document.write(buildContractHtml(booking))
                w.document.close()
                w.focus()
                setTimeout(() => w.print(), 400)
              }}
              className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all self-start btn-glow-red"
            >
              Print / Save as PDF
            </button>
          </div>
        )}

        {tab === 'invoice' && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-heading text-[10px] uppercase tracking-widest text-white/25 mb-1">Invoice</p>
              <p className="font-body text-xs text-white/30">Print-ready invoice with line items, payment breakdown, and payment instructions.</p>
            </div>

            {/* Summary card */}
            <div className="border border-white/8 bg-[#0d0d1e] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-display uppercase text-sm text-white tracking-wide">{booking.fullName}</span>
                <span className={`font-heading text-[10px] uppercase tracking-widest ${['Paid','Completed'].includes(booking.status) ? 'text-green-400' : 'text-yellow-400'}`}>
                  {['Paid','Completed'].includes(booking.status) ? 'Paid' : 'Outstanding'}
                </span>
              </div>
              <div className="border-t border-white/8 pt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { label: 'Invoice #', value: `RRB-INV-${booking.id.slice(-6).toUpperCase()}` },
                  { label: 'Event Date', value: booking.eventDate ? new Date(booking.eventDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                  { label: 'Event Type', value: booking.eventType || '—' },
                  { label: 'Venue / Co.', value: booking.venueOrCompany || '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="font-heading text-[9px] uppercase tracking-widest text-white/25">{label}</div>
                    <div className="font-body text-xs text-white/70 truncate">{value}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/8 pt-3 flex flex-col gap-1">
                {booking.quoteAmount ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-[9px] uppercase tracking-widest text-white/30">Performance Fee</span>
                      <span className="font-body text-xs text-white/60">{`$${booking.quoteAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/8 mt-1">
                      <span className="font-heading text-[9px] uppercase tracking-widest text-white/30">Total</span>
                      <span className="font-display text-lg text-green-400">{`$${booking.quoteAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}</span>
                    </div>
                  </>
                ) : (
                  <span className="font-body text-xs text-white/20">No amount set</span>
                )}
              </div>
            </div>

            {!booking.quoteAmount && (
              <p className="font-body text-xs text-orange-400/70">
                No amount set — add quote amount in Details for a complete invoice.
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                const w = window.open('', '_blank')
                if (!w) return
                w.document.write(buildInvoiceHtml(booking))
                w.document.close()
                w.focus()
                setTimeout(() => w.print(), 400)
              }}
              className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all self-start btn-glow-red"
            >
              Print / Save as PDF
            </button>
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
