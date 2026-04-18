'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SongRequest, SongRequestStatus, EmailTemplate, BookingEmailLog } from '@/lib/data'
import { renderTemplate } from '@/lib/templateUtils'

const ALL_STATUSES: SongRequestStatus[] = ['New', 'Review', 'Consider', 'Added', 'Declined']

const statusColors: Record<SongRequestStatus, string> = {
  'New': 'border-blue-400/40 text-blue-400',
  'Review': 'border-yellow-400/40 text-yellow-400',
  'Consider': 'border-cyan-400/40 text-cyan-400',
  'Added': 'border-green-400/40 text-green-400',
  'Declined': 'border-white/10 text-white/25',
}

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

function fmt(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso + (iso.includes('T') ? '' : 'T00:00:00'))
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminSongRequests() {
  const [requests, setRequests] = useState<SongRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<SongRequestStatus | 'All'>('All')
  const [selected, setSelected] = useState<SongRequest | null>(null)
  const [detailTab, setDetailTab] = useState<'crm' | 'reply'>('crm')
  const [editStatus, setEditStatus] = useState<SongRequestStatus>('New')
  const [editNotes, setEditNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Email reply state
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [toEmail, setToEmail] = useState('')
  const [editableSubject, setEditableSubject] = useState('')
  const [editableBody, setEditableBody] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const [emailLogs, setEmailLogs] = useState<BookingEmailLog[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/content').then((r) => r.json()),
      fetch('/api/email-templates').then((r) => r.json()),
    ])
      .then(([d, td]) => {
        if (d.songRequests) setRequests(d.songRequests)
        if (td.templates) {
          setTemplates(
            (td.templates as EmailTemplate[]).filter((t) => t.slug === 'song-request-reply')
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const persist = useCallback(async (updated: SongRequest[]) => {
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'songRequests', data: updated }),
    })
    setRequests(updated)
  }, [])

  const openDetail = (req: SongRequest) => {
    setSelected(req)
    setDetailTab('crm')
    setEditStatus(req.status)
    setEditNotes(req.notes ?? '')
    setSaved(false)
    setSendResult(null)
    setSelectedTemplateId('')
    setToEmail(req.email)
    setEditableSubject('')
    setEditableBody('')
    setShowPreview(false)
    setEmailLogs([])
  }

  const closeDetail = () => setSelected(null)

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    const now = new Date().toISOString()
    const updated = requests.map((r) =>
      r.id === selected.id
        ? { ...r, status: editStatus, notes: editNotes || undefined, updatedAt: now }
        : r
    )
    await persist(updated)
    setSelected((prev) => prev ? { ...prev, status: editStatus, notes: editNotes || undefined, updatedAt: now } : null)
    setSaving(false)
    flash()
  }

  const loadEmailLogs = async (songRequestId: string) => {
    try {
      const res = await fetch(`/api/song-requests/${songRequestId}/email-logs`)
      if (!res.ok) { setEmailLogs([]); return }
      const data = await res.json()
      setEmailLogs(data.logs ?? [])
    } catch {
      setEmailLogs([])
    }
  }

  // Re-render when template or selected changes
  useEffect(() => {
    if (!selectedTemplateId || !selected) {
      setEditableSubject('')
      setEditableBody('')
      return
    }
    const tmpl = templates.find((t) => t.id === selectedTemplateId)
    if (!tmpl) return
    const clientName = selected.fullName.split(' ')[0] || selected.fullName
    const songs = [selected.song1, selected.song2, selected.song3].filter(Boolean).join(', ')
    const { subject, bodyHtml } = renderTemplate(tmpl, {
      clientName,
      songList: songs,
      bandName: 'Rebound Rock Band',
      replyEmail: 'booking@reboundrockband.com',
    })
    setEditableSubject(subject)
    setEditableBody(bodyHtml)
  }, [selectedTemplateId, selected, templates])

  const handleSendReply = async () => {
    if (!selected || !selectedTemplateId || !toEmail) return
    setSending(true)
    setSendResult(null)
    try {
      const songs = [selected.song1, selected.song2, selected.song3].filter(Boolean).join(', ')
      const res = await fetch(`/api/song-requests/${selected.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          toEmail,
          subject: editableSubject,
          bodyHtml: editableBody,
          vars: {
            clientName: selected.fullName.split(' ')[0] || selected.fullName,
            songList: songs,
          },
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSendResult({ ok: true, msg: 'Reply sent successfully.' })
        if (data.emailLog) setEmailLogs((prev) => [data.emailLog, ...prev])
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
    const header = 'ID,Name,Email,Event Date,Song 1,Song 2,Song 3,Notes,Status,Created'
    const rows = requests.map((r) =>
      [r.id, r.fullName, r.email, r.eventDate ?? '', r.song1, r.song2 ?? '', r.song3 ?? '',
        (r.notes ?? '').replace(/"/g, '""'), r.status, r.createdAt]
        .map((v) => `"${v}"`).join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `song-requests-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sorted = [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const filtered = filterStatus === 'All' ? sorted : sorted.filter((r) => r.status === filterStatus)

  const countNew = requests.filter((r) => r.status === 'New').length
  const countAdded = requests.filter((r) => r.status === 'Added').length

  if (loading) {
    return <div className="font-body text-sm text-white/30 py-12 text-center">Loading…</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display uppercase text-2xl text-white">Song Requests</h2>
          <p className="font-body text-xs text-white/40 mt-0.5">{requests.length} total request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={exportCSV}
          className="self-start font-heading text-[11px] uppercase tracking-widest border border-white/15 text-white/60 px-4 py-2.5 hover:border-white/30 hover:text-white transition-all"
        >
          Export CSV
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-white/8 bg-brand-surface p-4">
          <div className="font-display text-3xl text-white leading-none mb-1">{requests.length}</div>
          <div className="font-heading text-[10px] uppercase tracking-widest text-white/40">Total</div>
        </div>
        <div className={`border p-4 ${countNew > 0 ? 'border-blue-400/30 bg-blue-400/5' : 'border-white/8 bg-brand-surface'}`}>
          <div className={`font-display text-3xl leading-none mb-1 ${countNew > 0 ? 'text-blue-400' : 'text-white'}`}>{countNew}</div>
          <div className="font-heading text-[10px] uppercase tracking-widest text-white/40">New</div>
        </div>
        <div className={`border p-4 ${countAdded > 0 ? 'border-green-400/30 bg-green-400/5' : 'border-white/8 bg-brand-surface'}`}>
          <div className={`font-display text-3xl leading-none mb-1 ${countAdded > 0 ? 'text-green-400' : 'text-white'}`}>{countAdded}</div>
          <div className="font-heading text-[10px] uppercase tracking-widest text-white/40">Added</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="font-heading text-[10px] uppercase tracking-widest text-white/40">Filter:</span>
        <div className="flex flex-wrap gap-2">
          {(['All', ...ALL_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`font-heading text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all ${
                filterStatus === s
                  ? 'border-brand-red text-brand-red'
                  : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="border border-white/8 bg-brand-surface p-10 text-center">
          <p className="font-body text-sm text-white/30">No song requests yet.</p>
        </div>
      ) : (
        <div className="border border-white/8 overflow-hidden">
          {filtered.map((req, i) => (
            <div key={req.id}>
              <button
                onClick={() => selected?.id === req.id ? closeDetail() : openDetail(req)}
                className={`w-full text-left flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-4 hover:bg-brand-surface transition-colors ${
                  i < filtered.length - 1 ? 'border-b border-white/6' : ''
                } ${selected?.id === req.id ? 'bg-brand-surface' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="font-heading text-sm text-white">{req.fullName}</span>
                    <span className={`font-heading text-[10px] uppercase tracking-widest border px-2 py-0.5 ${statusColors[req.status]}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="font-body text-xs text-white/40 truncate">
                    {req.song1}{req.song2 ? ` · ${req.song2}` : ''}{req.song3 ? ` · ${req.song3}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {req.eventDate && (
                    <span className="font-body text-xs text-white/40">{fmt(req.eventDate)}</span>
                  )}
                  <span className="font-body text-xs text-white/25">{fmt(req.createdAt)}</span>
                </div>
              </button>

              {/* Detail panel */}
              {selected?.id === req.id && (
                <div className="border-t border-white/8 bg-[#0d0d1a] px-5 py-6 space-y-5">
                  {/* Tabs */}
                  <div className="flex border-b border-white/8">
                    {(['crm', 'reply'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setDetailTab(tab)
                          if (tab === 'reply') loadEmailLogs(selected.id)
                        }}
                        className={`font-heading text-[10px] uppercase tracking-widest px-5 py-3 transition-colors ${
                          detailTab === tab
                            ? 'text-white border-b-2 border-brand-red -mb-px'
                            : 'text-white/35 hover:text-white'
                        }`}
                      >
                        {tab === 'crm' ? 'CRM' : 'Reply by Email'}
                        {tab === 'reply' && emailLogs.length > 0 && (
                          <span className="ml-1.5 font-heading text-[9px] bg-white/10 text-white/50 px-1.5 py-0.5">
                            {emailLogs.length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {detailTab === 'crm' && (
                    <>
                      {/* Contact info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="font-heading text-[10px] uppercase tracking-widest text-white/35 mb-1">Name</div>
                          <div className="font-body text-sm text-white">{selected.fullName}</div>
                        </div>
                        <div>
                          <div className="font-heading text-[10px] uppercase tracking-widest text-white/35 mb-1">Email</div>
                          <a href={`mailto:${selected.email}`} className="font-body text-sm text-brand-red hover:underline">{selected.email}</a>
                        </div>
                        {selected.eventDate && (
                          <div>
                            <div className="font-heading text-[10px] uppercase tracking-widest text-white/35 mb-1">Event Date</div>
                            <div className="font-body text-sm text-white">{fmt(selected.eventDate)}</div>
                          </div>
                        )}
                        <div>
                          <div className="font-heading text-[10px] uppercase tracking-widest text-white/35 mb-1">Submitted</div>
                          <div className="font-body text-sm text-white/60">{fmt(selected.createdAt)}</div>
                        </div>
                      </div>

                      {/* Songs */}
                      <div>
                        <div className="font-heading text-[10px] uppercase tracking-widest text-white/35 mb-2">Song Requests</div>
                        <div className="space-y-1">
                          {[selected.song1, selected.song2, selected.song3].filter(Boolean).map((song, idx) => (
                            <div key={idx} className="font-body text-sm text-white px-3 py-2 bg-brand-surface border border-white/6">
                              {idx + 1}. {song}
                            </div>
                          ))}
                        </div>
                      </div>

                      {selected.notes && (
                        <div>
                          <div className="font-heading text-[10px] uppercase tracking-widest text-white/35 mb-1">Notes from Requester</div>
                          <p className="font-body text-sm text-white/70 leading-relaxed">{selected.notes}</p>
                        </div>
                      )}

                      {/* Editable fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/8">
                        <div>
                          <label className="font-heading text-[10px] uppercase tracking-widest text-white/35 mb-1.5 block">Status</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as SongRequestStatus)}
                            className={inputClass}
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-heading text-[10px] uppercase tracking-widest text-white/35 mb-1.5 block">Internal Notes</label>
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          rows={3}
                          className={`${inputClass} resize-none`}
                          placeholder="Notes for the band…"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="font-heading text-[11px] uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all disabled:opacity-50"
                        >
                          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => { setDetailTab('reply'); loadEmailLogs(selected.id) }}
                          className="font-heading text-[11px] uppercase tracking-widest border border-brand-red/30 text-brand-red/70 px-5 py-2.5 hover:bg-brand-red/10 hover:border-brand-red transition-all flex items-center gap-2"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                          Reply by Email
                        </button>
                        <button
                          onClick={closeDetail}
                          className="font-heading text-[11px] uppercase tracking-widest border border-white/10 text-white/40 px-5 py-2.5 hover:border-white/25 hover:text-white/60 transition-all"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}

                  {detailTab === 'reply' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Compose */}
                      <div className="flex flex-col gap-4">
                        <p className="font-heading text-[10px] uppercase tracking-widest text-white/30 border-b border-white/6 pb-2">
                          Reply to {selected.fullName}
                        </p>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Template</label>
                          <select
                            value={selectedTemplateId}
                            onChange={(e) => { setSelectedTemplateId(e.target.value); setShowPreview(false) }}
                            className={inputClass}
                          >
                            <option value="">— Select a template —</option>
                            {templates.map((t) => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                          {templates.length === 0 && (
                            <p className="font-body text-[10px] text-white/25">No song request reply template found. Check Email Templates admin.</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">To</label>
                          <input type="email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} className={inputClass} />
                        </div>

                        {editableSubject !== '' && (
                          <div className="flex flex-col gap-1.5">
                            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Subject</label>
                            <input
                              type="text"
                              value={editableSubject}
                              onChange={(e) => setEditableSubject(e.target.value)}
                              className={inputClass}
                            />
                          </div>
                        )}

                        {editableBody !== '' && (
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Body</label>
                              <button
                                type="button"
                                onClick={() => setShowPreview((p) => !p)}
                                className="font-heading text-[9px] uppercase tracking-widest text-white/30 hover:text-white border border-white/10 px-2 py-1 transition-colors"
                              >
                                {showPreview ? 'Edit' : 'Preview'}
                              </button>
                            </div>
                            {showPreview ? (
                              <iframe srcDoc={editableBody} className="w-full h-56 border border-white/8" sandbox="allow-same-origin" title="Email preview" />
                            ) : (
                              <textarea
                                value={editableBody}
                                onChange={(e) => setEditableBody(e.target.value)}
                                className={`${inputClass} h-36 resize-y font-mono text-xs`}
                                spellCheck={false}
                              />
                            )}
                          </div>
                        )}

                        {sendResult && (
                          <p className={`font-body text-xs flex items-center gap-1.5 ${sendResult.ok ? 'text-green-400' : 'text-red-400'}`}>
                            {sendResult.ok && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {sendResult.msg}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={handleSendReply}
                          disabled={!selectedTemplateId || !toEmail || !editableSubject || sending}
                          className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all disabled:opacity-60 flex items-center gap-2 self-start"
                        >
                          {sending && (
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          )}
                          {sending ? 'Sending…' : 'Send Reply'}
                        </button>
                      </div>

                      {/* History */}
                      <div className="flex flex-col gap-3">
                        <p className="font-heading text-[10px] uppercase tracking-widest text-white/30 border-b border-white/6 pb-2">Reply History</p>
                        {emailLogs.length === 0 && (
                          <p className="font-body text-xs text-white/25 italic">No replies sent yet.</p>
                        )}
                        {emailLogs.map((log) => (
                          <div key={log.id} className="border border-white/8 px-4 py-3 bg-[#111121]">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className={`font-heading text-[9px] uppercase tracking-widest border px-1.5 py-0.5 ${log.status === 'sent' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}>
                                {log.status}
                              </span>
                              <span className="font-body text-[10px] text-white/25">
                                {new Date(log.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <p className="font-body text-xs text-white/70 truncate">{log.subject}</p>
                            <p className="font-body text-[10px] text-white/30 mt-0.5">→ {log.toEmail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
