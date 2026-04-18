'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Venue, VenueStatus, OutreachLog, EmailTemplate, PlaceSearchResult } from '@/lib/data'
import { renderTemplate } from '@/lib/templateUtils'

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

const VENUE_STATUSES: VenueStatus[] = [
  'New', 'Reviewed', 'Contact Added', 'Draft Ready',
  'Sent', 'Follow-up', 'Interested', 'Not Interested', 'Booked', 'Archived',
]

const STATUS_COLORS: Record<VenueStatus, string> = {
  'New': 'text-white/50 border-white/20',
  'Reviewed': 'text-blue-400 border-blue-400/40',
  'Contact Added': 'text-cyan-400 border-cyan-400/40',
  'Draft Ready': 'text-yellow-400 border-yellow-400/40',
  'Sent': 'text-orange-400 border-orange-400/40',
  'Follow-up': 'text-purple-400 border-purple-400/40',
  'Interested': 'text-green-400 border-green-400/40',
  'Not Interested': 'text-red-400/60 border-red-400/20',
  'Booked': 'text-green-300 border-green-300/60',
  'Archived': 'text-white/20 border-white/8',
}

type FilterStatus = 'All' | VenueStatus

export default function AdminVenueFinder() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All')
  const [selected, setSelected] = useState<Venue | null>(null)
  const [outreachLogs, setOutreachLogs] = useState<OutreachLog[]>([])
  const [activeTab, setActiveTab] = useState<'crm' | 'outreach'>('crm')

  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(new Set())
  const [savingPlaceId, setSavingPlaceId] = useState<string | null>(null)

  // CRM form
  const [crmForm, setCrmForm] = useState<Partial<Venue>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Outreach form
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [toEmail, setToEmail] = useState('')
  const [renderedSubject, setRenderedSubject] = useState('')
  const [renderedBody, setRenderedBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/venues').then((r) => r.json()),
      fetch('/api/email-templates').then((r) => r.json()),
    ])
      .then(([vd, td]) => {
        if (vd.venues) {
          setVenues(vd.venues)
          setSavedPlaceIds(new Set(vd.venues.map((v: Venue) => v.placeId)))
        }
        if (td.templates) setTemplates(td.templates)
      })
      .catch(() => {})
  }, [])

  const selectVenue = useCallback(async (venue: Venue) => {
    setSelected(venue)
    setCrmForm({
      status: venue.status,
      contactEmail: venue.contactEmail ?? '',
      assignedTo: venue.assignedTo ?? '',
      followUpDate: venue.followUpDate ?? '',
      notes: venue.notes ?? '',
    })
    setActiveTab('crm')
    setSaved(false)
    setSendResult(null)
    setSelectedTemplateId('')
    setRenderedSubject('')
    setRenderedBody('')
    // Fetch latest outreach logs
    try {
      const res = await fetch(`/api/venues/${venue.id}`)
      const data = await res.json()
      setOutreachLogs(data.outreachLogs ?? [])
    } catch {
      setOutreachLogs([])
    }
  }, [])

  // Update email preview when template or venue changes
  useEffect(() => {
    if (!selectedTemplateId || !selected) { setRenderedSubject(''); setRenderedBody(''); return }
    const tmpl = templates.find((t) => t.id === selectedTemplateId)
    if (!tmpl) return
    const { subject, bodyHtml } = renderTemplate(tmpl, {
      venueName: selected.name,
      bandName: 'Rebound Rock Band',
      serviceArea: 'South Florida',
      contactEmail: 'booking@reboundrockband.com',
    })
    setRenderedSubject(subject)
    setRenderedBody(bodyHtml)
    if (!toEmail && selected.contactEmail) setToEmail(selected.contactEmail)
  }, [selectedTemplateId, selected, templates, toEmail])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    setSearchResults([])
    try {
      const res = await fetch(`/api/places/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      setSearchResults(data.results ?? [])
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleSaveVenue = async (place: PlaceSearchResult) => {
    setSavingPlaceId(place.placeId)
    try {
      const res = await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(place),
      })
      const data = await res.json()
      if (res.ok && data.venue) {
        setVenues((prev) => [data.venue, ...prev])
        setSavedPlaceIds((prev) => new Set([...prev, place.placeId]))
      } else if (res.status === 409) {
        setSavedPlaceIds((prev) => new Set([...prev, place.placeId]))
      }
    } finally {
      setSavingPlaceId(null)
    }
  }

  const handleCrmSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/venues/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crmForm),
      })
      const data = await res.json()
      if (data.venue) {
        const updated = venues.map((v) => (v.id === selected.id ? data.venue : v))
        setVenues(updated)
        setSelected(data.venue)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteVenue = async () => {
    if (!selected) return
    if (!confirm(`Remove "${selected.name}" from your saved venues?`)) return
    await fetch(`/api/venues/${selected.id}`, { method: 'DELETE' })
    setVenues((prev) => prev.filter((v) => v.id !== selected.id))
    setSavedPlaceIds((prev) => { const s = new Set(prev); s.delete(selected.placeId); return s })
    setSelected(null)
  }

  const handleSendEmail = async () => {
    if (!selected || !selectedTemplateId || !toEmail) return
    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch(`/api/venues/${selected.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: selectedTemplateId, toEmail }),
      })
      const data = await res.json()
      if (res.ok) {
        setSendResult({ ok: true, msg: 'Email sent successfully.' })
        if (data.outreachLog) setOutreachLogs((prev) => [data.outreachLog, ...prev])
        // Refresh venue status
        const refreshed = await fetch(`/api/venues/${selected.id}`).then((r) => r.json())
        if (refreshed.venue) {
          setSelected(refreshed.venue)
          setVenues((prev) => prev.map((v) => (v.id === selected.id ? refreshed.venue : v)))
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

  const filtered = filterStatus === 'All'
    ? venues
    : venues.filter((v) => v.status === filterStatus)

  const stats = {
    total: venues.length,
    interested: venues.filter((v) => v.status === 'Interested').length,
    booked: venues.filter((v) => v.status === 'Booked').length,
    sent: venues.filter((v) => v.status === 'Sent').length,
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div className="border-l-2 border-brand-red pl-4">
          <h1 className="font-display uppercase text-4xl text-white leading-none">Venue Finder</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">Discover and track venues for outreach</p>
        </div>
        {/* Stats */}
        <div className="flex gap-4 flex-wrap">
          {[
            { label: 'Total', value: stats.total, color: 'text-white' },
            { label: 'Interested', value: stats.interested, color: 'text-green-400' },
            { label: 'Booked', value: stats.booked, color: 'text-green-300' },
            { label: 'Sent', value: stats.sent, color: 'text-orange-400' },
          ].map((s) => (
            <div key={s.label} className="text-right">
              <div className={`font-display text-2xl leading-none ${s.color}`}>{s.value}</div>
              <div className="font-heading text-[9px] uppercase tracking-widest text-white/30">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${inputClass} flex-1`}
          placeholder="Search: bar miami fl, brewery coral gables, live music venue homestead..."
        />
        <button
          type="submit"
          disabled={searching}
          className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all disabled:opacity-60 flex-shrink-0"
        >
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6 border border-white/8 bg-[#0a0a18]">
          <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
            <p className="font-heading text-[10px] uppercase tracking-widest text-white/40">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </p>
            <button
              type="button"
              onClick={() => setSearchResults([])}
              className="text-white/25 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {searchResults.map((place) => {
              const alreadySaved = savedPlaceIds.has(place.placeId)
              return (
                <div key={place.placeId} className="flex items-start gap-4 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-xs text-white uppercase tracking-wide truncate">{place.name}</p>
                    <p className="font-body text-xs text-white/40 truncate">{place.address}</p>
                    <div className="flex gap-3 mt-1 flex-wrap">
                      {place.phone && <span className="font-body text-xs text-white/30">{place.phone}</span>}
                      {place.rating && (
                        <span className="font-body text-xs text-yellow-400/70">★ {place.rating}</span>
                      )}
                      {place.types.slice(0, 2).map((t) => (
                        <span key={t} className="font-heading text-[9px] uppercase tracking-widest text-white/20 border border-white/8 px-1">
                          {t.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => !alreadySaved && handleSaveVenue(place)}
                    disabled={alreadySaved || savingPlaceId === place.placeId}
                    className={`font-heading text-[10px] uppercase tracking-widest px-3 py-1.5 flex-shrink-0 transition-all ${
                      alreadySaved
                        ? 'border border-green-400/30 text-green-400/60 cursor-default'
                        : 'bg-brand-red text-white hover:bg-brand-red-bright disabled:opacity-60'
                    }`}
                  >
                    {alreadySaved ? '✓ Saved' : savingPlaceId === place.placeId ? 'Saving…' : 'Save'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Status filter */}
      <div className="flex gap-1 flex-wrap mb-4">
        {(['All', ...VENUE_STATUSES] as FilterStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterStatus(s)}
            className={`font-heading text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
              filterStatus === s
                ? 'bg-brand-red border-brand-red text-white'
                : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5">
        {/* Venue list */}
        <div className="flex flex-col gap-1">
          {filtered.length === 0 && (
            <div className="border border-white/6 py-12 text-center">
              <p className="font-heading text-white/20 text-xs tracking-widest uppercase">
                {filterStatus === 'All' ? 'No venues saved yet — search above to get started' : `No venues with status "${filterStatus}"`}
              </p>
            </div>
          )}
          {filtered.map((venue) => (
            <button
              key={venue.id}
              type="button"
              onClick={() => selectVenue(venue)}
              className={`relative text-left flex items-center gap-0 border transition-all overflow-hidden group ${
                selected?.id === venue.id
                  ? 'border-brand-red/50 bg-brand-red/[0.04]'
                  : 'border-white/6 bg-[#0d0d1e] hover:border-white/12'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-red origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
              <div className="flex-1 min-w-0 px-4 py-3">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`font-heading text-[9px] uppercase tracking-widest border px-1.5 py-0.5 ${STATUS_COLORS[venue.status]}`}>
                    {venue.status}
                  </span>
                  {venue.contactEmail && (
                    <span className="font-heading text-[9px] uppercase tracking-widest text-cyan-400/60 border border-cyan-400/20 px-1.5 py-0.5">
                      Email
                    </span>
                  )}
                </div>
                <p className="font-heading text-sm text-white uppercase tracking-wide truncate">{venue.name}</p>
                <p className="font-body text-xs text-white/35 truncate">{venue.address}</p>
              </div>
              <div className="px-4 flex-shrink-0 text-right">
                {venue.rating && <p className="font-body text-xs text-yellow-400/60">★ {venue.rating}</p>}
                {venue.followUpDate && (
                  <p className="font-heading text-[9px] uppercase tracking-widest text-purple-400/60">
                    {venue.followUpDate}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="border border-white/8 bg-[#0d0d1e] self-start">
            {/* Venue header */}
            <div className="px-5 py-4 border-b border-white/6">
              <p className="font-heading text-xs text-white uppercase tracking-wide truncate">{selected.name}</p>
              <p className="font-body text-xs text-white/35 truncate mt-0.5">{selected.address}</p>
              <div className="flex gap-3 mt-1.5 flex-wrap">
                {selected.phone && <span className="font-body text-[11px] text-white/30">{selected.phone}</span>}
                {selected.website && (
                  <a
                    href={selected.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-[11px] text-brand-red/60 hover:text-brand-red transition-colors truncate max-w-[160px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selected.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/6">
              {(['crm', 'outreach'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`font-heading text-[10px] uppercase tracking-widest px-5 py-3 transition-colors ${
                    activeTab === tab
                      ? 'text-white border-b-2 border-brand-red -mb-px'
                      : 'text-white/35 hover:text-white'
                  }`}
                >
                  {tab === 'crm' ? 'CRM' : 'Outreach'}
                  {tab === 'outreach' && outreachLogs.length > 0 && (
                    <span className="ml-1.5 font-heading text-[9px] bg-white/10 text-white/50 px-1.5 py-0.5">
                      {outreachLogs.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === 'crm' && (
              <div className="p-5 flex flex-col gap-4">
                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Status</label>
                  <select
                    value={crmForm.status ?? selected.status}
                    onChange={(e) => setCrmForm({ ...crmForm, status: e.target.value as VenueStatus })}
                    className={inputClass}
                  >
                    {VENUE_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Contact Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={crmForm.contactEmail ?? ''}
                    onChange={(e) => setCrmForm({ ...crmForm, contactEmail: e.target.value })}
                    className={inputClass}
                    placeholder="booking@venue.com"
                  />
                </div>

                {/* Assigned To */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Assigned To</label>
                  <input
                    type="text"
                    value={crmForm.assignedTo ?? ''}
                    onChange={(e) => setCrmForm({ ...crmForm, assignedTo: e.target.value })}
                    className={inputClass}
                    placeholder="Pepe"
                  />
                </div>

                {/* Follow-up Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Follow-up Date</label>
                  <input
                    type="date"
                    value={crmForm.followUpDate ?? ''}
                    onChange={(e) => setCrmForm({ ...crmForm, followUpDate: e.target.value })}
                    className={inputClass}
                  />
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Notes</label>
                  <textarea
                    value={crmForm.notes ?? ''}
                    onChange={(e) => setCrmForm({ ...crmForm, notes: e.target.value })}
                    className={`${inputClass} h-24 resize-none`}
                    placeholder="Spoke with manager, call back next week..."
                  />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleCrmSave}
                    disabled={saving}
                    className="font-heading text-[10px] uppercase tracking-widest bg-brand-red text-white px-4 py-2 hover:bg-brand-red-bright transition-all disabled:opacity-60 flex items-center gap-2"
                  >
                    {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteVenue}
                    className="font-heading text-[10px] uppercase tracking-widest border border-red-900/30 text-red-500/40 px-4 py-2 hover:border-red-500/60 hover:text-red-400 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'outreach' && (
              <div className="p-5 flex flex-col gap-5">
                {/* Email composer */}
                <div className="flex flex-col gap-3">
                  <p className="font-heading text-[10px] uppercase tracking-widest text-brand-red">
                    Compose Email
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Template</label>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">— Select a template —</option>
                      {templates
                        .filter((t) => t.slug !== 'booking-auto-reply')
                        .map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">To Email</label>
                    <input
                      type="email"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      className={inputClass}
                      placeholder="contact@venue.com"
                    />
                  </div>

                  {renderedSubject && (
                    <div className="border border-white/6 bg-[#111121] px-3 py-2">
                      <p className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-1">Subject Preview</p>
                      <p className="font-body text-xs text-white/70">{renderedSubject}</p>
                    </div>
                  )}

                  {renderedBody && (
                    <div>
                      <p className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-2">Email Preview</p>
                      <iframe
                        srcDoc={renderedBody}
                        className="w-full h-64 border border-white/8"
                        sandbox="allow-same-origin"
                        title="Email body preview"
                      />
                    </div>
                  )}

                  {sendResult && (
                    <p className={`font-body text-xs flex items-center gap-1.5 ${sendResult.ok ? 'text-green-400' : 'text-red-400'}`}>
                      {sendResult.msg}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={!selectedTemplateId || !toEmail || sending}
                    className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all disabled:opacity-60"
                  >
                    {sending ? 'Sending…' : 'Send Email'}
                  </button>
                </div>

                {/* Outreach history */}
                {outreachLogs.length > 0 && (
                  <div>
                    <p className="font-heading text-[10px] uppercase tracking-widest text-white/30 mb-3 pt-3 border-t border-white/6">
                      History
                    </p>
                    <div className="flex flex-col gap-2">
                      {outreachLogs.map((log) => (
                        <div key={log.id} className="border border-white/6 px-3 py-2.5">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className={`font-heading text-[9px] uppercase tracking-widest border px-1.5 py-0.5 ${log.status === 'sent' ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}>
                              {log.status}
                            </span>
                            <span className="font-body text-[10px] text-white/25">
                              {new Date(log.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="font-body text-xs text-white/60 truncate">{log.subject}</p>
                          <p className="font-body text-[10px] text-white/30">→ {log.toEmail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
