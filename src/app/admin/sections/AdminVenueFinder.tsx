'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Venue, VenueStatus, VenueActivity, OutreachLog, EmailTemplate, PlaceSearchResult } from '@/lib/data'
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
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([])
  const [searchWarning, setSearchWarning] = useState<string | null>(
    !process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ? null : null
  )
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
  const [outreachVenueName, setOutreachVenueName] = useState('')
  const [renderedSubject, setRenderedSubject] = useState('')
  const [renderedBody, setRenderedBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null)

  // Activity log
  const [activityDraft, setActivityDraft] = useState('')
  const [savingActivity, setSavingActivity] = useState(false)

  // Bulk outreach
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkTemplateId, setBulkTemplateId] = useState('')
  const [bulkSending, setBulkSending] = useState(false)
  const [bulkResults, setBulkResults] = useState<{ id: string; name: string; ok: boolean }[]>([])
  const [showBulkPanel, setShowBulkPanel] = useState(false)
  const [venueQueueExpanded, setVenueQueueExpanded] = useState(false)

  // Bulk status update
  const [bulkStatus, setBulkStatus] = useState<VenueStatus | ''>('')
  const [bulkStatusUpdating, setBulkStatusUpdating] = useState(false)

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
      name: venue.name,
      status: venue.status,
      contactEmail: venue.contactEmail ?? '',
      assignedTo: venue.assignedTo ?? '',
      followUpDate: venue.followUpDate ?? '',
      notes: venue.notes ?? '',
    })
    setOutreachVenueName(venue.name)
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
      venueName: outreachVenueName || selected.name,
      bandName: 'Rebound Rock Band',
      serviceArea: 'South Florida',
      contactEmail: 'booking@reboundrockband.com',
    })
    setRenderedSubject(subject)
    setRenderedBody(bodyHtml)
    if (!toEmail && selected.contactEmail) setToEmail(selected.contactEmail)
  }, [selectedTemplateId, selected, templates, toEmail, outreachVenueName])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchKeyword.trim() && !searchCity.trim()) return
    setSearching(true)
    setSearchResults([])
    setSearchWarning(null)
    try {
      const params = new URLSearchParams()
      if (searchKeyword) params.set('keyword', searchKeyword)
      if (searchCity) params.set('city', searchCity)
      const res = await fetch(`/api/places/search?${params}`)
      const data = await res.json()
      setSearchResults(data.results ?? [])
      if (data.devWarning) setSearchWarning(data.devWarning)
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

  const addActivityEntry = async () => {
    if (!selected || !activityDraft.trim()) return
    setSavingActivity(true)
    const entry: VenueActivity = { ts: new Date().toISOString(), text: activityDraft.trim() }
    const updatedLog: VenueActivity[] = [entry, ...(selected.activityLog ?? [])]
    try {
      const res = await fetch(`/api/venues/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityLog: updatedLog }),
      })
      const data = await res.json()
      if (data.venue) {
        setVenues((prev) => prev.map((v) => (v.id === selected.id ? data.venue : v)))
        setSelected(data.venue)
        setActivityDraft('')
      }
    } finally {
      setSavingActivity(false)
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
        body: JSON.stringify({
          templateId: selectedTemplateId,
          toEmail,
          vars: outreachVenueName ? { venueName: outreachVenueName } : undefined,
        }),
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

  const handleBulkSend = async () => {
    if (!bulkTemplateId || selectedIds.size === 0) return
    setBulkSending(true)
    setBulkResults([])
    const targets = venues.filter((v) => selectedIds.has(v.id) && v.contactEmail)
    const results: { id: string; name: string; ok: boolean }[] = []
    for (const venue of targets) {
      try {
        const res = await fetch(`/api/venues/${venue.id}/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId: bulkTemplateId, toEmail: venue.contactEmail }),
        })
        results.push({ id: venue.id, name: venue.name, ok: res.ok })
        if (res.ok) {
          const refreshed = await fetch(`/api/venues/${venue.id}`).then((r) => r.json())
          if (refreshed.venue) setVenues((prev) => prev.map((v) => v.id === venue.id ? refreshed.venue : v))
        }
      } catch {
        results.push({ id: venue.id, name: venue.name, ok: false })
      }
    }
    setBulkResults(results)
    setBulkSending(false)
    setSelectedIds(new Set())
  }

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedIds.size === 0) return
    setBulkStatusUpdating(true)
    const targets = venues.filter((v) => selectedIds.has(v.id))
    await Promise.all(targets.map(async (venue) => {
      try {
        const res = await fetch(`/api/venues/${venue.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: bulkStatus }),
        })
        const data = await res.json()
        if (data.venue) setVenues((prev) => prev.map((v) => v.id === venue.id ? data.venue : v))
      } catch { /* skip failed */ }
    }))
    setBulkStatusUpdating(false)
    setSelectedIds(new Set())
    setBulkStatus('')
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const today = new Date().toISOString().split('T')[0]

  const snoozeVenueFollowUp = async (id: string, days: number) => {
    const d = new Date(); d.setDate(d.getDate() + days)
    const newDate = d.toISOString().split('T')[0]
    const res = await fetch(`/api/venues/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followUpDate: newDate }),
    })
    const data = await res.json()
    if (data.venue) setVenues((prev) => prev.map((v) => v.id === id ? data.venue : v))
  }

  const markVenueContacted = async (venue: Venue) => {
    const nextStatus: Partial<Record<VenueStatus, VenueStatus>> = {
      'New': 'Reviewed', 'Reviewed': 'Contact Added', 'Contact Added': 'Draft Ready',
      'Draft Ready': 'Sent', 'Sent': 'Follow-up',
    }
    const patch = {
      lastContactedAt: today,
      followUpDate: '',
      ...(nextStatus[venue.status] ? { status: nextStatus[venue.status] } : {}),
    }
    const res = await fetch(`/api/venues/${venue.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const data = await res.json()
    if (data.venue) setVenues((prev) => prev.map((v) => v.id === venue.id ? data.venue : v))
  }

  const venueFollowUpQueue = venues
    .filter((v) => v.followUpDate && v.followUpDate <= today && !['Archived', 'Not Interested', 'Booked'].includes(v.status))
    .sort((a, b) => (a.followUpDate ?? '').localeCompare(b.followUpDate ?? ''))

  const filtered = filterStatus === 'All'
    ? venues
    : venues.filter((v) => v.status === filterStatus)

  const pipelineCounts = VENUE_STATUSES.reduce((acc, s) => {
    acc[s] = venues.filter((v) => v.status === s).length
    return acc
  }, {} as Record<VenueStatus, number>)
  const maxCount = Math.max(1, ...Object.values(pipelineCounts))
  const sentCount = pipelineCounts['Sent'] + pipelineCounts['Follow-up']
  const conversionRate = sentCount > 0
    ? Math.round((pipelineCounts['Interested'] + pipelineCounts['Booked']) / sentCount * 100)
    : 0

  const exportVenuesCSV = () => {
    const headers = ['Name', 'Address', 'Status', 'Contact Email', 'Phone', 'Website',
      'Assigned To', 'Follow-up Date', 'Last Contacted', 'Rating', 'Notes']
    const rows = venues.map((v) => [
      v.name, v.address, v.status, v.contactEmail ?? '', v.phone ?? '', v.website ?? '',
      v.assignedTo ?? '', v.followUpDate ?? '', v.lastContactedAt ?? '',
      v.rating ?? '', (v.notes ?? '').replace(/\n/g, ' '),
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `venues-${new Date().toISOString().split('T')[0]}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div className="border-l-2 border-brand-red pl-4">
          <h1 className="font-display uppercase text-4xl text-white leading-none">Venue Finder</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">Discover and track venues for outreach</p>
        </div>
        <div className="flex gap-4 flex-wrap items-end">
          <div className="text-right">
            <div className="font-display text-2xl leading-none text-white">{venues.length}</div>
            <div className="font-heading text-[9px] uppercase tracking-widest text-white/30">Total Venues</div>
          </div>
          <div className="text-right">
            <div className={`font-display text-2xl leading-none ${pipelineCounts['Booked'] > 0 ? 'text-green-300' : 'text-white/20'}`}>{pipelineCounts['Booked']}</div>
            <div className="font-heading text-[9px] uppercase tracking-widest text-white/30">Booked</div>
          </div>
          <div className="text-right">
            <div className={`font-display text-2xl leading-none ${conversionRate > 0 ? 'text-green-400' : 'text-white/20'}`}>{conversionRate}%</div>
            <div className="font-heading text-[9px] uppercase tracking-widest text-white/30">Response Rate</div>
          </div>
          <button
            onClick={exportVenuesCSV}
            disabled={venues.length === 0}
            className="font-heading text-[10px] uppercase tracking-widest border border-white/10 text-white/30 px-3 py-2 hover:border-brand-red/40 hover:text-brand-red transition-all disabled:opacity-30 self-end"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Pipeline funnel */}
      {venues.length > 0 && (
        <div className="mb-6 border border-white/6 bg-[#0d0d1e] p-4">
          <p className="font-heading text-[9px] uppercase tracking-widest text-white/25 mb-3">Pipeline — click to filter</p>
          <div className="flex gap-1 items-end h-16">
            {VENUE_STATUSES.map((s) => {
              const count = pipelineCounts[s]
              const pct = Math.max(count > 0 ? 8 : 0, Math.round((count / maxCount) * 100))
              const color = STATUS_COLORS[s].split(' ')[0].replace('text-', 'bg-').replace('/60', '/40').replace('/20', '/20')
              const isActive = filterStatus === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilterStatus(isActive ? 'All' : s)}
                  className={`flex-1 min-w-0 flex flex-col items-center gap-1 group transition-opacity ${count === 0 ? 'opacity-30' : ''}`}
                  title={`${s}: ${count}`}
                >
                  <div className="w-full flex flex-col justify-end" style={{ height: '44px' }}>
                    <div
                      className={`w-full transition-all ${color} ${isActive ? 'ring-1 ring-white/30' : 'group-hover:opacity-80'}`}
                      style={{ height: `${pct}%`, minHeight: count > 0 ? '4px' : '0' }}
                    />
                  </div>
                  <div className={`font-heading text-[8px] uppercase tracking-widest truncate w-full text-center ${isActive ? 'text-white' : 'text-white/30'}`}>
                    {count > 0 ? count : '·'}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="flex gap-1 mt-0.5">
            {VENUE_STATUSES.map((s) => (
              <div key={s} className="flex-1 min-w-0 text-center">
                <span className="font-heading text-[7px] uppercase tracking-widest text-white/15 truncate block leading-tight" title={s}>
                  {s.length > 7 ? s.slice(0, 6) + '…' : s}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="font-heading text-[9px] uppercase tracking-widest text-white/25">Keyword</label>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className={inputClass}
              placeholder="e.g. live music venue, bar, brewery"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="font-heading text-[9px] uppercase tracking-widest text-white/25">City / Area</label>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className={inputClass}
              placeholder="e.g. Miami FL, Coral Gables, 33134"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-heading text-[9px] uppercase tracking-widest text-white/25 invisible">Go</label>
            <button
              type="submit"
              disabled={searching || (!searchKeyword.trim() && !searchCity.trim())}
              className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all disabled:opacity-60 flex-shrink-0 h-[42px]"
            >
              {searching ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>
        {/* Quick keyword chips */}
        <div className="flex gap-1.5 flex-wrap">
          {['live music venue', 'bar', 'brewery', 'restaurant live music', 'event venue', 'private event venue'].map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => setSearchKeyword(kw)}
              className={`font-heading text-[9px] uppercase tracking-widest px-2 py-1 border transition-colors ${
                searchKeyword === kw
                  ? 'border-brand-red text-brand-red bg-brand-red/10'
                  : 'border-white/10 text-white/30 hover:border-white/25 hover:text-white/60'
              }`}
            >
              {kw}
            </button>
          ))}
        </div>
      </form>

      {/* Dev/API key warning */}
      {searchWarning && (
        <div className="mb-4 border border-yellow-400/20 bg-yellow-400/5 px-4 py-3 flex items-start gap-3">
          <svg className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="font-body text-xs text-yellow-400/80">{searchWarning}</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6 border border-white/8 bg-[#0a0a18]">
          <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
            <p className="font-heading text-[10px] uppercase tracking-widest text-white/40">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </p>
            <button
              onClick={() => setSearchResults([])}
              aria-label="Clear search results"
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
          {/* Bulk action bar */}
          {selectedIds.size > 0 && (
            <div className="border border-purple-400/30 bg-purple-400/5 px-4 py-3 flex items-center gap-3 flex-wrap mb-1">
              <span className="font-heading text-[10px] uppercase tracking-widest text-purple-400">
                {selectedIds.size} selected
              </span>
              <button
                onClick={() => { setShowBulkPanel((v) => !v); setBulkResults([]) }}
                className="font-heading text-[10px] uppercase tracking-widest bg-purple-400/20 text-purple-300 border border-purple-400/30 px-3 py-1.5 hover:bg-purple-400/30 transition-all"
              >
                {showBulkPanel ? 'Hide Email' : 'Send Email'}
              </button>
              {/* Bulk status update */}
              <div className="flex items-center gap-1.5">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value as VenueStatus | '')}
                  aria-label="Bulk status"
                  className="bg-[#111121] border border-white/10 text-white/60 font-heading text-[10px] uppercase tracking-widest px-2 py-1.5 focus:outline-none focus:border-purple-400/40 transition-all"
                >
                  <option value="">Set status…</option>
                  {VENUE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  onClick={handleBulkStatusUpdate}
                  disabled={!bulkStatus || bulkStatusUpdating}
                  className="font-heading text-[10px] uppercase tracking-widest border border-purple-400/30 text-purple-300 px-3 py-1.5 hover:bg-purple-400/20 transition-all disabled:opacity-40"
                >
                  {bulkStatusUpdating ? 'Updating…' : 'Apply'}
                </button>
              </div>
              <button type="button" onClick={() => { setSelectedIds(new Set()); setShowBulkPanel(false); setBulkResults([]); setBulkStatus('') }}
                className="font-heading text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                Clear
              </button>
              <div className="flex-1" />
              <span className="font-body text-[10px] text-white/25">
                {venues.filter((v) => selectedIds.has(v.id) && v.contactEmail).length} have email
              </span>
            </div>
          )}

          {/* Bulk send panel */}
          {showBulkPanel && selectedIds.size > 0 && (
            <div className="border border-purple-400/20 bg-[#0d0d1e] px-4 py-4 mb-1 flex flex-col gap-3">
              <p className="font-heading text-[10px] uppercase tracking-widest text-purple-400">Bulk Email Campaign</p>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[9px] uppercase tracking-widest text-white/30">Template</label>
                <select
                  value={bulkTemplateId}
                  onChange={(e) => setBulkTemplateId(e.target.value)}
                  className={inputClass}
                  aria-label="Bulk email template"
                >
                  <option value="">— Select template —</option>
                  {templates.filter((t) => t.slug !== 'booking-auto-reply').map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 max-h-28 overflow-y-auto border border-white/6 px-3 py-2">
                {venues.filter((v) => selectedIds.has(v.id)).map((v) => (
                  <div key={v.id} className="flex items-center gap-2">
                    <span className={`font-heading text-[8px] ${v.contactEmail ? 'text-green-400' : 'text-red-400/60'}`}>
                      {v.contactEmail ? '✓' : '✗'}
                    </span>
                    <span className="font-body text-xs text-white/60 truncate">{v.name}</span>
                    {v.contactEmail && <span className="font-body text-[10px] text-white/25 truncate">{v.contactEmail}</span>}
                  </div>
                ))}
              </div>
              {bulkResults.length > 0 && (
                <div className="flex flex-col gap-1">
                  {bulkResults.map((r) => (
                    <div key={r.id} className="flex items-center gap-2">
                      <span className={`font-heading text-[9px] ${r.ok ? 'text-green-400' : 'text-red-400'}`}>{r.ok ? '✓' : '✗'}</span>
                      <span className="font-body text-xs text-white/50">{r.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={handleBulkSend}
                disabled={!bulkTemplateId || bulkSending || venues.filter((v) => selectedIds.has(v.id) && v.contactEmail).length === 0}
                className="font-heading text-xs uppercase tracking-widest bg-purple-500 text-white px-5 py-2.5 hover:bg-purple-400 transition-all disabled:opacity-50 self-start"
              >
                {bulkSending ? 'Sending…' : `Send to ${venues.filter((v) => selectedIds.has(v.id) && v.contactEmail).length} venues`}
              </button>
            </div>
          )}

          {/* Venue follow-up queue */}
          {venueFollowUpQueue.length > 0 && (
            <div className="mb-3 border border-purple-400/30 bg-purple-400/[0.03]">
              <button
                onClick={() => setVenueQueueExpanded((v) => !v)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-purple-400/5 transition-colors text-left"
              >
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse flex-shrink-0" />
                <span className="font-heading text-xs uppercase tracking-widest text-purple-400">
                  {venueFollowUpQueue.length} venue follow-up{venueFollowUpQueue.length > 1 ? 's' : ''} due
                </span>
                <div className="flex-1" />
                <svg className={`w-3.5 h-3.5 text-purple-400/60 transition-transform ${venueQueueExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {venueQueueExpanded && (
                <div className="border-t border-purple-400/15 divide-y divide-purple-400/8">
                  {venueFollowUpQueue.map((v) => {
                    const daysOverdue = Math.floor(
                      (new Date(today + 'T00:00:00').getTime() - new Date(v.followUpDate! + 'T00:00:00').getTime()) / 86400000
                    )
                    return (
                      <div key={v.id} className="flex items-center gap-3 px-5 py-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={`font-heading text-[8px] uppercase tracking-widest border px-1.5 py-0.5 flex-shrink-0 ${STATUS_COLORS[v.status]}`}>{v.status}</span>
                          <span className="font-body text-sm text-white truncate">{v.name}</span>
                          <span className={`font-heading text-[9px] uppercase tracking-widest flex-shrink-0 ${daysOverdue === 0 ? 'text-purple-400' : 'text-red-400'}`}>
                            {daysOverdue === 0 ? 'Today' : `${daysOverdue}d overdue`}
                          </span>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button type="button" onClick={() => markVenueContacted(v)}
                            className="font-heading text-[9px] uppercase tracking-widest border border-yellow-400/30 text-yellow-400/70 px-2.5 py-1 hover:bg-yellow-400/10 transition-all">
                            Contacted
                          </button>
                          <button type="button" onClick={() => snoozeVenueFollowUp(v.id, 3)}
                            className="font-heading text-[9px] uppercase tracking-widest border border-white/10 text-white/30 px-2.5 py-1 hover:border-white/25 hover:text-white/60 transition-all">
                            +3d
                          </button>
                          <button type="button" onClick={() => snoozeVenueFollowUp(v.id, 7)}
                            className="font-heading text-[9px] uppercase tracking-widest border border-white/10 text-white/30 px-2.5 py-1 hover:border-white/25 hover:text-white/60 transition-all">
                            +7d
                          </button>
                          <button type="button" onClick={() => selectVenue(v)}
                            className="font-heading text-[9px] uppercase tracking-widest border border-purple-400/25 text-purple-400/60 px-2.5 py-1 hover:bg-purple-400/10 transition-all">
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

          {filtered.length === 0 && (
            <div className="border border-white/6 py-12 text-center">
              <p className="font-heading text-white/20 text-xs tracking-widest uppercase">
                {filterStatus === 'All' ? 'No venues saved yet — search above to get started' : `No venues with status "${filterStatus}"`}
              </p>
            </div>
          )}
          {filtered.map((venue) => (
            <div
              key={venue.id}
              className={`relative flex items-center gap-0 border transition-all overflow-hidden group ${
                selected?.id === venue.id
                  ? 'border-brand-red/50 bg-brand-red/[0.04]'
                  : selectedIds.has(venue.id)
                  ? 'border-purple-400/30 bg-purple-400/[0.03]'
                  : 'border-white/6 bg-[#0d0d1e] hover:border-white/12'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-red origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
              {/* Checkbox */}
              <button
                onClick={() => toggleSelect(venue.id)}
                aria-label={selectedIds.has(venue.id) ? 'Deselect venue' : 'Select venue'}
                className={`flex-shrink-0 w-8 h-full flex items-center justify-center self-stretch transition-colors ${
                  selectedIds.has(venue.id) ? 'bg-purple-400/10' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className={`w-3.5 h-3.5 border transition-all flex items-center justify-center ${
                  selectedIds.has(venue.id) ? 'border-purple-400 bg-purple-400/20' : 'border-white/20'
                }`}>
                  {selectedIds.has(venue.id) && (
                    <svg className="w-2 h-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
              <button
                onClick={() => selectVenue(venue)}
                className="flex-1 min-w-0 text-left flex items-center gap-0"
              >
                <div className="flex-1 min-w-0 px-3 py-3">
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
            </div>
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
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Venue Name</label>
                  <input
                    type="text"
                    value={crmForm.name ?? ''}
                    onChange={(e) => setCrmForm({ ...crmForm, name: e.target.value })}
                    className={inputClass}
                    placeholder="Venue name"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Status</label>
                  <select
                    value={crmForm.status ?? selected.status}
                    onChange={(e) => setCrmForm({ ...crmForm, status: e.target.value as VenueStatus })}
                    className={inputClass}
                    aria-label="Venue status"
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
                    aria-label="Follow-up date"
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
                    onClick={handleCrmSave}
                    disabled={saving}
                    className="font-heading text-[10px] uppercase tracking-widest bg-brand-red text-white px-4 py-2 hover:bg-brand-red-bright transition-all disabled:opacity-60 flex items-center gap-2"
                  >
                    {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleDeleteVenue}
                    className="font-heading text-[10px] uppercase tracking-widest border border-red-900/30 text-red-500/40 px-4 py-2 hover:border-red-500/60 hover:text-red-400 transition-all"
                  >
                    Delete
                  </button>
                </div>

                {/* Activity Log */}
                <div className="border-t border-white/8 pt-5 flex flex-col gap-3">
                  <p className="font-heading text-[10px] uppercase tracking-widest text-white/30">Contact Activity Log</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={activityDraft}
                      onChange={(e) => setActivityDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addActivityEntry() } }}
                      className={`${inputClass} flex-1`}
                      placeholder="Left voicemail · booked follow-up for Thursday…"
                    />
                    <button
                      onClick={addActivityEntry}
                      disabled={savingActivity || !activityDraft.trim()}
                      className="font-heading text-[10px] uppercase tracking-widest border border-white/12 text-white/50 px-3 py-2 hover:border-brand-red/40 hover:text-white transition-all disabled:opacity-40 flex-shrink-0"
                    >
                      {savingActivity ? '…' : 'Log'}
                    </button>
                  </div>
                  {(selected.activityLog ?? []).length > 0 ? (
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                      {(selected.activityLog ?? []).map((entry, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400/50" />
                            {i < (selected.activityLog ?? []).length - 1 && (
                              <div className="w-px flex-1 min-h-[12px] bg-white/8" />
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0 flex-1 pb-2">
                            <span className="font-heading text-[9px] uppercase tracking-widest text-white/25">
                              {new Date(entry.ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {' · '}
                              {new Date(entry.ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </span>
                            <span className="font-body text-xs text-white/60 leading-relaxed">{entry.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body text-xs text-white/20">No activity logged yet.</p>
                  )}
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
                      aria-label="Email template"
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

                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">
                      Name in the email
                    </label>
                    <input
                      type="text"
                      value={outreachVenueName}
                      onChange={(e) => setOutreachVenueName(e.target.value)}
                      className={inputClass}
                      placeholder="Name shown in the email"
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
