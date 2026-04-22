'use client'

import { useState, useEffect, useCallback } from 'react'
import { shows as initialShows, epkContent as initialEpk, type Show, type ShowStatus } from '@/lib/data'

function buildAdvanceSheetHtml(show: Show, techSpecs: { label: string; value: string }[]): string {
  const showDate = show.date
    ? new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '—'
  const specsHtml = techSpecs.map((r) =>
    `<tr><td class="spec-label">${r.label}</td><td class="spec-value">${r.value}</td></tr>`
  ).join('')
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Advance Sheet — ${show.venue}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color:#1a1a1a; background:#fff; padding:44px 52px; max-width:780px; margin:0 auto; font-size:13px; }
  .header { border-bottom:3px solid #e0101e; padding-bottom:18px; margin-bottom:28px; display:flex; justify-content:space-between; align-items:flex-end; }
  .brand { font-size:22px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; }
  .brand span { color:#e0101e; }
  .doc-title { font-size:11px; text-transform:uppercase; letter-spacing:0.14em; color:#888; text-align:right; }
  .doc-title strong { display:block; font-size:18px; color:#1a1a1a; letter-spacing:0.05em; margin-bottom:2px; }
  .section { margin-bottom:24px; }
  .section-title { font-size:9px; text-transform:uppercase; letter-spacing:0.15em; color:#aaa; border-bottom:1px solid #eee; padding-bottom:5px; margin-bottom:12px; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:6px 28px; }
  .field-label { font-size:9px; text-transform:uppercase; letter-spacing:0.1em; color:#999; margin-bottom:1px; }
  .field-value { font-size:14px; font-weight:600; color:#1a1a1a; }
  .hero-date { background:#e0101e; color:#fff; display:inline-block; padding:10px 20px; margin-bottom:18px; }
  .hero-date .day { font-size:40px; font-weight:700; line-height:1; }
  .hero-date .month-year { font-size:12px; text-transform:uppercase; letter-spacing:0.1em; opacity:0.85; margin-top:2px; }
  table.specs { width:100%; border-collapse:collapse; }
  table.specs td { padding:7px 10px; font-size:13px; border-bottom:1px solid #f3f3f3; }
  td.spec-label { font-size:10px; text-transform:uppercase; letter-spacing:0.08em; color:#888; width:40%; }
  td.spec-value { font-weight:500; }
  .notes-box { background:#f9f9f9; border:1px solid #e8e8e8; padding:12px 14px; font-size:13px; color:#555; line-height:1.6; white-space:pre-wrap; }
  .footer { margin-top:36px; border-top:1px solid #e8e8e8; padding-top:16px; font-size:11px; color:#aaa; display:flex; justify-content:space-between; }
  .badge { display:inline-block; background:#f0f0f0; color:#555; font-size:10px; text-transform:uppercase; letter-spacing:0.1em; padding:3px 8px; border-radius:2px; margin-right:4px; }
  .badge.confirmed { background:#d1fae5; color:#065f46; }
  .badge.pending { background:#fef3c7; color:#92400e; }
  .badge.hold { background:#fef3c7; color:#92400e; }
  .badge.cancelled { background:#fee2e2; color:#991b1b; }
  @media print { body { padding:24px 32px; } @page { margin:0.6in; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Rebound <span>Rock Band</span></div>
      <div style="font-size:11px;color:#888;margin-top:3px;">South Florida · Live Classic Rock</div>
    </div>
    <div class="doc-title">
      <strong>Show Advance Sheet</strong>
      Printed ${new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
    </div>
  </div>

  <div style="margin-bottom:20px;">
    <div class="hero-date">
      <div class="day">${show.date ? show.date.split('-')[2] : '—'}</div>
      <div class="month-year">${show.date ? new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', { month:'short', year:'numeric' }).toUpperCase() : ''}</div>
    </div>
    <div style="display:inline-block;vertical-align:top;margin-left:18px;padding-top:6px;">
      <div style="font-size:22px;font-weight:700;">${show.venue}</div>
      <div style="font-size:14px;color:#555;margin-top:3px;">${show.city}</div>
      <div style="font-size:13px;color:#888;margin-top:2px;">${showDate}</div>
      ${show.showStatus ? `<span class="badge ${show.showStatus.toLowerCase()}">${show.showStatus}</span>` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Schedule</div>
    <div class="grid2">
      <div><div class="field-label">Show Time</div><div class="field-value">${show.time || '—'}</div></div>
      <div><div class="field-label">Set Length</div><div class="field-value">${show.setLength || '—'}</div></div>
      <div><div class="field-label">Load-In</div><div class="field-value">${show.loadInTime || '—'}</div></div>
      <div><div class="field-label">Soundcheck</div><div class="field-value">${show.soundCheckTime || '—'}</div></div>
    </div>
  </div>

  ${(show.contactPerson || show.contactEmail) ? `
  <div class="section">
    <div class="section-title">Venue Contact</div>
    <div class="grid2">
      ${show.contactPerson ? `<div><div class="field-label">Contact Person</div><div class="field-value">${show.contactPerson}</div></div>` : ''}
      ${show.contactEmail ? `<div><div class="field-label">Contact Email</div><div class="field-value">${show.contactEmail}</div></div>` : ''}
    </div>
  </div>` : ''}

  ${show.guarantee ? `
  <div class="section">
    <div class="section-title">Financials</div>
    <div class="grid2">
      <div><div class="field-label">Agreed Guarantee</div><div class="field-value" style="color:#059669;">$${show.guarantee.toLocaleString('en-US')}</div></div>
      ${show.travelBudget ? `<div><div class="field-label">Travel Budget</div><div class="field-value">$${show.travelBudget.toLocaleString('en-US')}</div></div>` : ''}
    </div>
  </div>` : ''}

  ${techSpecs.length > 0 ? `
  <div class="section">
    <div class="section-title">Technical Requirements</div>
    <table class="specs"><tbody>${specsHtml}</tbody></table>
  </div>` : ''}

  ${show.showNotes ? `
  <div class="section">
    <div class="section-title">Notes</div>
    <div class="notes-box">${show.showNotes}</div>
  </div>` : ''}

  <div class="footer">
    <span>booking@reboundrockband.com · reboundrockband.com</span>
    <span>Rebound Rock Band — Advance Sheet</span>
  </div>
</body>
</html>`
}

const emptyShow: Omit<Show, 'id'> = {
  date: '',
  venue: '',
  city: '',
  time: '',
  ticketUrl: '',
  isFeatured: false,
  visible: true,
  showStatus: 'Confirmed',
  guarantee: undefined,
  payout: undefined,
  travelBudget: undefined,
  loadInTime: '',
  soundCheckTime: '',
  setLength: '',
  contactPerson: '',
  contactEmail: '',
  showNotes: '',
}

const ADVANCE_CHECKS = [
  { id: 'advance-confirmed',    label: 'Advance confirmed with venue' },
  { id: 'deposit-received',     label: 'Deposit received' },
  { id: 'tech-rider-sent',      label: 'Tech rider sent' },
  { id: 'venue-contact-set',    label: 'Venue contact confirmed' },
  { id: 'setlist-finalized',    label: 'Setlist finalized' },
  { id: 'travel-arranged',      label: 'Travel arranged' },
]

function fmtMoney(n?: number) {
  if (n === undefined || n === null) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

// ── Canvas story generator ────────────────────────────────────────────────────
async function generateStoryPNG(shows: Show[]): Promise<void> {
  await document.fonts.ready
  const W = 1080, H = 1920
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = '#080810'; ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = 'rgba(255,255,255,0.018)'; ctx.lineWidth = 1
  for (let i = -H; i < W + H; i += 44) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke() }
  const topGlow = ctx.createRadialGradient(W / 2, 180, 0, W / 2, 180, 480)
  topGlow.addColorStop(0, 'rgba(224,16,30,0.18)'); topGlow.addColorStop(1, 'rgba(224,16,30,0)')
  ctx.fillStyle = topGlow; ctx.fillRect(0, 0, W, 600)
  const btmGlow = ctx.createRadialGradient(W / 2, H - 100, 0, W / 2, H - 100, 300)
  btmGlow.addColorStop(0, 'rgba(224,16,30,0.10)'); btmGlow.addColorStop(1, 'rgba(224,16,30,0)')
  ctx.fillStyle = btmGlow; ctx.fillRect(0, H - 350, W, 350)
  ctx.fillStyle = '#e0101e'; ctx.fillRect(0, 0, W, 7); ctx.fillRect(0, H - 7, W, 7)
  const PAD = 80
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#ffffff'; ctx.font = '400 148px "Bebas Neue", Impact, "Arial Narrow", sans-serif'; ctx.fillText('REBOUND', W / 2, 168)
  ctx.fillStyle = '#e0101e'; ctx.font = '400 84px "Bebas Neue", Impact, "Arial Narrow", sans-serif'; ctx.fillText('ROCK BAND', W / 2, 262)
  ctx.strokeStyle = '#2a2a3e'; ctx.lineWidth = 1.5
  const divX = PAD + 60; ctx.beginPath(); ctx.moveTo(divX, 302); ctx.lineTo(W - divX, 302); ctx.stroke()
  ctx.fillStyle = '#e0101e'; ctx.beginPath(); ctx.arc(W / 2, 302, 4, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '700 26px Oswald, "Arial Narrow", sans-serif'
  ctx.letterSpacing = '0.3em'; ctx.fillText('UPCOMING  SHOWS', W / 2, 360); ctx.letterSpacing = '0px'
  ctx.fillStyle = 'rgba(224,16,30,0.7)'; ctx.font = '400 22px Inter, system-ui, sans-serif'
  ctx.fillText(new Date().getFullYear().toString(), W / 2, 394)
  const LIST_TOP = 440, LIST_BTM = 1730, LIST_H = LIST_BTM - LIST_TOP
  const rowH = Math.min(190, Math.floor(LIST_H / Math.max(shows.length, 1)))
  const dateBoxW = 110, dateBoxH = Math.min(rowH - 30, 120)
  shows.forEach((show, i) => {
    const rowY = LIST_TOP + i * rowH
    if (i > 0) { ctx.strokeStyle = '#1e1e2e'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD, rowY); ctx.lineTo(W - PAD, rowY); ctx.stroke() }
    const midY = rowY + rowH / 2, boxX = PAD, boxY = midY - dateBoxH / 2
    ctx.fillStyle = '#e0101e'; ctx.fillRect(boxX, boxY, dateBoxW, dateBoxH)
    const date = new Date(show.date + 'T00:00:00')
    const day = date.toLocaleDateString('en-US', { day: '2-digit' })
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'
    const dayFontSize = Math.min(62, Math.floor(dateBoxH * 0.52))
    ctx.font = `400 ${dayFontSize}px "Bebas Neue", Impact, "Arial Narrow", sans-serif`; ctx.fillText(day, boxX + dateBoxW / 2, boxY + dateBoxH * 0.58)
    const monthFontSize = Math.min(22, Math.floor(dateBoxH * 0.19))
    ctx.font = `700 ${monthFontSize}px Oswald, "Arial Narrow", sans-serif`; ctx.fillText(month, boxX + dateBoxW / 2, boxY + dateBoxH - 10)
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '400 18px Inter, system-ui, sans-serif'; ctx.fillText(weekday, boxX + dateBoxW / 2, boxY - 6)
    const textX = PAD + dateBoxW + 30, venueFs = Math.min(44, Math.floor(rowH * 0.26))
    ctx.textAlign = 'left'; ctx.fillStyle = show.isFeatured ? '#ffffff' : 'rgba(255,255,255,0.9)'
    ctx.font = `700 ${venueFs}px Oswald, "Arial Narrow", sans-serif`
    let venueName = show.venue
    const maxW = W - textX - PAD - (show.isFeatured ? 30 : 0)
    while (ctx.measureText(venueName).width > maxW && venueName.length > 10) venueName = venueName.slice(0, -2) + '…'
    ctx.fillText(venueName, textX, midY - 6)
    if (show.isFeatured) { ctx.fillStyle = '#e0101e'; ctx.font = `700 ${venueFs}px sans-serif`; ctx.textAlign = 'right'; ctx.fillText('★', W - PAD, midY - 6); ctx.textAlign = 'left' }
    const metaFs = Math.min(26, Math.floor(rowH * 0.16))
    ctx.fillStyle = '#6b6b80'; ctx.font = `400 ${metaFs}px Inter, system-ui, sans-serif`; ctx.fillText(`${show.city}  ·  ${show.time}`, textX, midY + metaFs + 6)
  })
  ctx.strokeStyle = '#1e1e2e'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD, LIST_BTM); ctx.lineTo(W - PAD, LIST_BTM); ctx.stroke()
  ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '700 30px Oswald, "Arial Narrow", sans-serif'; ctx.fillText('REBOUND ROCK BAND', W / 2, 1800)
  ctx.fillStyle = 'rgba(107,107,128,0.8)'; ctx.font = '400 22px Inter, system-ui, sans-serif'; ctx.fillText('reboundrockband.com  ·  South Florida', W / 2, 1840)
  const today = new Date().toISOString().split('T')[0]
  const link = document.createElement('a'); link.download = `rebound-rock-band-shows-${today}.png`; link.href = canvas.toDataURL('image/png'); link.click()
}

export default function AdminShows() {
  const [shows, setShows] = useState<Show[]>(initialShows)
  const [editing, setEditing] = useState<Show | null>(null)
  const [form, setForm] = useState<Omit<Show, 'id'>>(emptyShow)
  const [isAdding, setIsAdding] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [showFinancials, setShowFinancials] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [techSpecs, setTechSpecs] = useState<{ label: string; value: string }[]>(initialEpk.techSpecs ?? [])
  const [displayMode, setDisplayMode] = useState<'list' | 'calendar'>('list')
  const [calYear, setCalYear] = useState(() => new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth())
  const [showTab, setShowTab] = useState<'upcoming' | 'past'>('upcoming')
  const [loggingId, setLoggingId] = useState<string | null>(null)
  const [gigLogDraft, setGigLogDraft] = useState({ attendance: '', gigRating: 0, gigHighlight: '', merchSoldAtShow: '' })
  const [advancingId, setAdvancingId] = useState<string | null>(null)
  const [advanceChecksDraft, setAdvanceChecksDraft] = useState<string[]>([])

  const todayIso = new Date().toISOString().split('T')[0]
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const prevCalMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11) }
    else setCalMonth((m) => m - 1)
  }
  const nextCalMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0) }
    else setCalMonth((m) => m + 1)
  }

  const calCells = (() => {
    const firstDow = new Date(calYear, calMonth, 1).getDay()
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(calYear, calMonth, 1 + i - firstDow)
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      return { d, iso, dayShows: shows.filter((s) => s.date === iso), inMonth: d.getMonth() === calMonth }
    })
  })()

  const totalGuarantee = shows.reduce((s, sh) => s + (sh.guarantee ?? 0), 0)
  const totalPayout = shows.reduce((s, sh) => s + (sh.payout ?? 0), 0)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => {
        if (d.shows) setShows(d.shows)
        if (d.epkContent?.techSpecs) setTechSpecs(d.epkContent.techSpecs)
      })
      .catch(() => {})
  }, [])

  // Pre-fill from "Convert to Show" in Bookings CRM
  useEffect(() => {
    const raw = sessionStorage.getItem('prefillShow')
    if (raw) {
      try {
        const data = JSON.parse(raw) as Partial<Omit<Show, 'id'>>
        setForm({ ...emptyShow, ...data })
        setIsAdding(true)
        setEditing(null)
      } catch { /* ignore */ }
      sessionStorage.removeItem('prefillShow')
    }
  }, [])

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const persist = useCallback(async (updated: Show[]) => {
    setSaving(true)
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'shows', data: updated }),
      })
      flash()
    } finally {
      setSaving(false)
    }
  }, [])

  const openEdit = (show: Show) => {
    setEditing(show)
    setForm({
      date: show.date,
      venue: show.venue,
      city: show.city,
      time: show.time,
      ticketUrl: show.ticketUrl ?? '',
      isFeatured: show.isFeatured ?? false,
      visible: show.visible ?? true,
      showStatus: show.showStatus ?? 'Confirmed',
      guarantee: show.guarantee,
      payout: show.payout,
      travelBudget: show.travelBudget,
      loadInTime: show.loadInTime ?? '',
      soundCheckTime: show.soundCheckTime ?? '',
      setLength: show.setLength ?? '',
      contactPerson: show.contactPerson ?? '',
      contactEmail: show.contactEmail ?? '',
      showNotes: show.showNotes ?? '',
    })
    setShowFinancials(false)
    setIsAdding(false)
  }

  const toggleVisible = async (id: string) => {
    const updated = shows.map((s) => s.id === id ? { ...s, visible: s.visible === false ? true : false } : s)
    setShows(updated)
    await persist(updated)
  }

  const openAdd = () => { setEditing(null); setForm(emptyShow); setIsAdding(true); setShowFinancials(false) }
  const cancel = () => { setEditing(null); setIsAdding(false); setShowFinancials(false) }

  const duplicateShow = (show: Show) => {
    setEditing(null)
    setForm({
      date: '',
      venue: show.venue,
      city: show.city,
      time: show.time,
      ticketUrl: show.ticketUrl ?? '',
      isFeatured: false,
      visible: show.visible ?? true,
      showStatus: 'Confirmed',
      guarantee: show.guarantee,
      payout: undefined,
      travelBudget: show.travelBudget,
      loadInTime: show.loadInTime ?? '',
      soundCheckTime: show.soundCheckTime ?? '',
      setLength: show.setLength ?? '',
      contactPerson: show.contactPerson ?? '',
      contactEmail: show.contactEmail ?? '',
      showNotes: show.showNotes ?? '',
    })
    setShowFinancials(false)
    setIsAdding(true)
  }

  const save = async () => {
    if (!form.date || !form.venue || !form.city || !form.time) return
    const updated = editing
      ? shows.map((s) => s.id === editing.id ? { ...editing, ...form } : s)
      : [...shows, { id: Date.now().toString(), ...form }]
    setShows(updated)
    cancel()
    await persist(updated)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this show?')) return
    const updated = shows.filter((s) => s.id !== id)
    setShows(updated)
    await persist(updated)
  }

  const toggleFeatured = async (id: string) => {
    const updated = shows.map((s) => s.id === id ? { ...s, isFeatured: !s.isFeatured } : s)
    setShows(updated)
    await persist(updated)
  }

  const openGigLog = (show: Show) => {
    setLoggingId(show.id)
    setGigLogDraft({
      attendance: show.attendance ? String(show.attendance) : '',
      gigRating: show.gigRating ?? 0,
      gigHighlight: show.gigHighlight ?? '',
      merchSoldAtShow: show.merchSoldAtShow ? String(show.merchSoldAtShow) : '',
    })
  }

  const saveGigLog = async (showId: string) => {
    const updated = shows.map((s) => s.id === showId ? {
      ...s,
      attendance: gigLogDraft.attendance ? parseInt(gigLogDraft.attendance) : undefined,
      gigRating: gigLogDraft.gigRating || undefined,
      gigHighlight: gigLogDraft.gigHighlight.trim() || undefined,
      merchSoldAtShow: gigLogDraft.merchSoldAtShow ? parseFloat(gigLogDraft.merchSoldAtShow) : undefined,
    } : s)
    setShows(updated)
    await persist(updated)
    setLoggingId(null)
  }

  const openAdvance = (show: Show) => {
    setAdvancingId(show.id)
    setAdvanceChecksDraft(show.advanceChecklist ?? [])
  }

  const saveAdvance = async (showId: string) => {
    const updated = shows.map((s) => s.id === showId ? { ...s, advanceChecklist: advanceChecksDraft } : s)
    setShows(updated)
    await persist(updated)
    setAdvancingId(null)
  }

  const toggleAdvanceCheck = (checkId: string) => {
    setAdvanceChecksDraft((prev) =>
      prev.includes(checkId) ? prev.filter((c) => c !== checkId) : [...prev, checkId]
    )
  }

  const exportICal = () => {
    const upcoming = shows.filter((s) => s.date >= todayIso).sort((a, b) => a.date.localeCompare(b.date))
    if (upcoming.length === 0) return

    const pad = (n: number) => String(n).padStart(2, '0')
    const parseTime = (time: string, date: Date): { h: number; m: number } => {
      const m = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
      if (!m) return { h: 19, m: 0 }
      let h = parseInt(m[1]); const min = parseInt(m[2]); const period = m[3]?.toUpperCase()
      if (period === 'PM' && h !== 12) h += 12
      if (period === 'AM' && h === 12) h = 0
      return { h, m: min }
    }

    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Rebound Rock Band//Admin//EN',
      'CALSCALE:GREGORIAN',
      'X-WR-CALNAME:Rebound Rock Band Shows',
      'X-WR-CALDESC:Upcoming shows for Rebound Rock Band',
    ]

    for (const show of upcoming) {
      const [y, mo, d] = show.date.split('-').map(Number)
      const { h, m } = parseTime(show.time, new Date(y, mo - 1, d))
      const dtStart = `${y}${pad(mo)}${pad(d)}T${pad(h)}${pad(m)}00`
      const endH = h + 2; const dtEnd = `${y}${pad(mo)}${pad(d)}T${pad(endH > 23 ? 23 : endH)}${pad(m)}00`
      const uid = `show-${show.id}@reboundrockband.com`
      const summary = `Rebound Rock Band @ ${show.venue}`
      const eventLines = [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${summary}`,
        `LOCATION:${show.venue}${show.city ? `, ${show.city}` : ''}`,
        show.showNotes ? `DESCRIPTION:${show.showNotes.replace(/\n/g, '\\n')}` : 'DESCRIPTION:',
        show.ticketUrl ? `URL:${show.ticketUrl}` : '',
        'END:VEVENT',
      ].filter(Boolean) as string[]
      lines.push(...eventLines)
    }
    lines.push('END:VCALENDAR')

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `rebound-rock-band-shows.ics`; a.click()
    URL.revokeObjectURL(url)
  }

  const copyShowPost = (show: Show) => {
    const d = show.date ? new Date(show.date + 'T00:00:00') : null
    const dateStr = d ? d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''
    const lines = [
      '🎸 REBOUND ROCK BAND — LIVE!',
      '',
      `📅 ${dateStr}`,
      `📍 ${show.venue}${show.city ? ` · ${show.city}` : ''}`,
      `⏰ ${show.time}`,
      '',
      "Come party with us! Five musicians, four decades of the greatest classic rock hits. 🤘",
      '',
      show.ticketUrl ? `🎟️ Tickets: ${show.ticketUrl}` : '',
      '',
      '#ReboundRockBand #LiveMusic #ClassicRock #SouthFlorida #LiveBand',
    ].filter((l) => l !== undefined).join('\n').replace(/\n{3,}/g, '\n\n').trim()

    navigator.clipboard.writeText(lines).then(() => {
      setCopiedId(show.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const exportShowsCSV = () => {
    const headers = [
      'Date', 'Venue', 'City', 'Time', 'Status', 'Featured', 'Visible',
      'Guarantee ($)', 'Payout ($)', 'Travel Budget ($)',
      'Load-In', 'Soundcheck', 'Set Length', 'Contact Person', 'Contact Email',
      'Audience', 'Merch at Show ($)', 'Gig Rating', 'Highlight',
      'Advance Checklist', 'Notes', 'Ticket URL',
    ]
    const rows = [...shows]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((s) => [
        s.date, s.venue, s.city, s.time,
        s.showStatus ?? 'Confirmed',
        s.isFeatured ? 'Yes' : 'No',
        s.visible === false ? 'Hidden' : 'Visible',
        s.guarantee ?? '', s.payout ?? '', s.travelBudget ?? '',
        s.loadInTime ?? '', s.soundCheckTime ?? '', s.setLength ?? '',
        s.contactPerson ?? '', s.contactEmail ?? '',
        s.attendance ?? '', s.merchSoldAtShow ?? '',
        s.gigRating ?? '', (s.gigHighlight ?? '').replace(/"/g, '""'),
        `${(s.advanceChecklist ?? []).length}/${ADVANCE_CHECKS.length}`,
        (s.showNotes ?? '').replace(/"/g, '""'), s.ticketUrl ?? '',
      ])
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `rebound-shows-${new Date().toISOString().split('T')[0]}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadStory = async () => {
    if (shows.length === 0) return
    setGenerating(true)
    try { await generateStoryPNG(shows) } finally { setGenerating(false) }
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="border-l-2 border-brand-red pl-4">
          <h1 className="font-display uppercase text-4xl text-white leading-none">Shows</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">{shows.filter(s => s.date >= todayIso).length} upcoming · {shows.filter(s => s.date < todayIso).length} past</p>
        </div>
        <div className="flex items-center gap-2.5">
          {saved && (
            <div className="flex items-center gap-1.5 font-heading text-[10px] text-green-400 uppercase tracking-widest">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </div>
          )}
          {saving && <div className="font-heading text-[10px] text-white/30 uppercase tracking-widest">Saving…</div>}
          {/* List / Calendar toggle */}
          <div className="flex border border-white/10">
            <button
              onClick={() => setDisplayMode('list')}
              title="List view"
              className={`px-3 py-2 transition-colors ${displayMode === 'list' ? 'bg-white/8 text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
            <button
              onClick={() => setDisplayMode('calendar')}
              title="Calendar view"
              className={`px-3 py-2 border-l border-white/10 transition-colors ${displayMode === 'calendar' ? 'bg-white/8 text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </button>
          </div>
          <button
            onClick={exportShowsCSV}
            disabled={shows.length === 0}
            title="Export all shows as CSV"
            className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/50 px-3.5 py-2.5 hover:border-brand-red/50 hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            CSV
          </button>
          <button
            onClick={exportICal}
            disabled={shows.filter(s => s.date >= todayIso).length === 0}
            title="Export upcoming shows as calendar file (.ics)"
            className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/50 px-3.5 py-2.5 hover:border-brand-red/50 hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            iCal
          </button>
          <button type="button" onClick={handleDownloadStory} disabled={shows.length === 0 || generating} title="Download a 1080×1920 Facebook Story image with all shows"
            className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/50 px-3.5 py-2.5 hover:border-brand-red/50 hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2">
            {generating ? (
              <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Generating…</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>Story PNG</>
            )}
          </button>
          <button type="button" onClick={openAdd} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-all btn-glow-red flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Show
          </button>
        </div>
      </div>

      {/* Upcoming / Past tab strip — only in list mode */}
      {displayMode === 'list' && (
        <div className="flex gap-0 mb-6 border-b border-white/8">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setShowTab(t)}
              className={`font-heading text-xs uppercase tracking-widest px-5 py-3 border-b-2 transition-colors -mb-px ${
                showTab === t ? 'border-brand-red text-white' : 'border-transparent text-white/30 hover:text-white/60'
              }`}
            >
              {t === 'upcoming'
                ? `Upcoming (${shows.filter(s => s.date >= todayIso).length})`
                : `Past (${shows.filter(s => s.date < todayIso).length})`}
            </button>
          ))}
        </div>
      )}

      {/* Financial totals */}
      {(totalGuarantee > 0 || totalPayout > 0) && (
        <div className="mb-6 flex gap-3">
          {totalGuarantee > 0 && (
            <div className="border border-white/8 bg-[#0d0d1e] px-5 py-3 flex items-center gap-3">
              <span className="font-heading text-[10px] uppercase tracking-widest text-white/30">Total Guaranteed</span>
              <span className="font-display text-lg text-green-400">{fmtMoney(totalGuarantee)}</span>
            </div>
          )}
          {totalPayout > 0 && (
            <div className="border border-white/8 bg-[#0d0d1e] px-5 py-3 flex items-center gap-3">
              <span className="font-heading text-[10px] uppercase tracking-widest text-white/30">Total Paid Out</span>
              <span className="font-display text-lg text-white/70">{fmtMoney(totalPayout)}</span>
            </div>
          )}
          {totalGuarantee > 0 && totalPayout > 0 && (
            <div className="border border-white/8 bg-[#0d0d1e] px-5 py-3 flex items-center gap-3">
              <span className="font-heading text-[10px] uppercase tracking-widest text-white/30">Outstanding</span>
              <span className={`font-display text-lg ${totalGuarantee - totalPayout > 0 ? 'text-yellow-400' : 'text-white/30'}`}>{fmtMoney(totalGuarantee - totalPayout)}</span>
            </div>
          )}
        </div>
      )}

      {/* Story info */}
      <div className="mb-6 p-4 border border-white/6 bg-white/2 flex gap-3">
        <svg className="w-4 h-4 text-brand-muted/40 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="font-body text-xs text-white/30 leading-relaxed">
          <span className="text-white/50">Story PNG</span> exports a 1080×1920 image with all current shows — ready to upload as a Facebook or Instagram Story.
        </p>
      </div>

      {/* Form panel */}
      {(isAdding || editing) && (
        <div className="mb-8 border border-brand-red/25 bg-brand-red/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between gap-3 px-6 py-3.5 border-b border-brand-red/15">
            <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red">{editing ? 'Edit Show' : 'New Show'}</h2>
            <button type="button" onClick={cancel} aria-label="Close form" className="text-white/30 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Date *</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} aria-label="Show date" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Time *</label>
                <input type="text" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputClass} placeholder="7:00 PM" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Venue *</label>
                <input type="text" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className={inputClass} placeholder="Venue name" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">City *</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} placeholder="Miami, FL" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Ticket URL (optional)</label>
                <input type="url" value={form.ticketUrl} onChange={(e) => setForm({ ...form, ticketUrl: e.target.value })} className={inputClass} placeholder="https://..." />
              </div>
            </div>
            <div className="flex flex-col gap-3 mb-5">
              {[
                { key: 'isFeatured' as const, label: 'Mark as Featured (★ in Story)' },
                { key: 'visible' as const, label: 'Visible on public site' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group w-fit">
                  <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${form[key] ? 'bg-brand-red border-brand-red' : 'border-white/20 group-hover:border-white/40'}`} onClick={() => setForm({ ...form, [key]: !form[key] })}>
                    {form[key] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="font-heading text-xs uppercase tracking-widest text-white/50">{label}</span>
                </label>
              ))}
            </div>
            {/* Financials & Logistics accordion */}
            <div className="mb-5 border border-white/8">
              <button
                onClick={() => setShowFinancials((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.03] transition-colors"
              >
                <span className="font-heading text-[10px] uppercase tracking-widest text-white/40">
                  Financials &amp; Logistics
                  {(form.guarantee || form.payout || form.contactPerson) && (
                    <span className="ml-2 text-brand-red">●</span>
                  )}
                </span>
                <svg className={`w-3.5 h-3.5 text-white/30 transition-transform ${showFinancials ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showFinancials && (
                <div className="border-t border-white/8 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Show Status</label>
                    <select
                      value={form.showStatus ?? 'Confirmed'}
                      onChange={(e) => setForm({ ...form, showStatus: e.target.value as ShowStatus })}
                      className={inputClass}
                      aria-label="Show status"
                    >
                      {(['Confirmed', 'Pending', 'Hold', 'Cancelled'] as ShowStatus[]).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Guarantee ($)</label>
                    <input
                      type="number" min={0} step={50}
                      value={form.guarantee ?? ''}
                      onChange={(e) => setForm({ ...form, guarantee: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className={inputClass} placeholder="1500"
                      aria-label="Guarantee amount"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Payout ($)</label>
                    <input
                      type="number" min={0} step={50}
                      value={form.payout ?? ''}
                      onChange={(e) => setForm({ ...form, payout: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className={inputClass} placeholder="Actual paid"
                      aria-label="Payout amount"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Travel Budget ($)</label>
                    <input
                      type="number" min={0} step={25}
                      value={form.travelBudget ?? ''}
                      onChange={(e) => setForm({ ...form, travelBudget: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className={inputClass} placeholder="200"
                      aria-label="Travel budget"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Load-In Time</label>
                    <input
                      type="text"
                      value={form.loadInTime ?? ''}
                      onChange={(e) => setForm({ ...form, loadInTime: e.target.value })}
                      className={inputClass} placeholder="5:00 PM"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Soundcheck</label>
                    <input
                      type="text"
                      value={form.soundCheckTime ?? ''}
                      onChange={(e) => setForm({ ...form, soundCheckTime: e.target.value })}
                      className={inputClass} placeholder="6:30 PM"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Set Length</label>
                    <input
                      type="text"
                      value={form.setLength ?? ''}
                      onChange={(e) => setForm({ ...form, setLength: e.target.value })}
                      className={inputClass} placeholder="2 × 45 min"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Contact Person</label>
                    <input
                      type="text"
                      value={form.contactPerson ?? ''}
                      onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                      className={inputClass} placeholder="Venue booker name"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Contact Email</label>
                    <input
                      type="email"
                      value={form.contactEmail ?? ''}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      className={inputClass} placeholder="booker@venue.com"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-3">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Show Notes</label>
                    <textarea
                      value={form.showNotes ?? ''}
                      onChange={(e) => setForm({ ...form, showNotes: e.target.value })}
                      rows={3}
                      className={`${inputClass} resize-none`}
                      placeholder="Parking info, stage notes, special requests…"
                      aria-label="Show notes"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={save} disabled={saving} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all disabled:opacity-60">
                {editing ? 'Save Changes' : 'Add Show'}
              </button>
              <button type="button" onClick={cancel} className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/40 px-5 py-2.5 hover:border-white/30 hover:text-white transition-all">
                Cancel
              </button>
              {editing && (
                <button
                  onClick={() => {
                    const current: Show = { ...editing, ...form }
                    const w = window.open('', '_blank')
                    if (!w) return
                    w.document.write(buildAdvanceSheetHtml(current, techSpecs))
                    w.document.close()
                    w.focus()
                    setTimeout(() => w.print(), 400)
                  }}
                  className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/40 px-5 py-2.5 hover:border-white/30 hover:text-white transition-all flex items-center gap-1.5 ml-auto"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
                  Print Advance Sheet
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Calendar view ── */}
      {displayMode === 'calendar' && (
        <div className="border border-white/8 bg-[#0d0d1e]">
          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6">
            <button type="button" onClick={prevCalMonth} aria-label="Previous month" className="text-white/30 hover:text-white transition-colors p-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="font-heading text-sm uppercase tracking-widest text-white">
              {MONTH_NAMES[calMonth]} {calYear}
            </span>
            <button type="button" onClick={nextCalMonth} aria-label="Next month" className="text-white/30 hover:text-white transition-colors p-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-white/6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="px-2 py-2 text-center font-heading text-[9px] uppercase tracking-widest text-white/25">{d}</div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7">
            {calCells.map(({ d, iso, dayShows, inMonth }, idx) => {
              const isToday = iso === todayIso
              const isLast = idx >= 35 // last row — hide if all out-of-month
              return (
                <div
                  key={iso}
                  className={`min-h-[80px] border-b border-r border-white/[0.04] p-1.5 ${
                    !inMonth ? 'opacity-25' : ''
                  } ${isToday ? 'bg-brand-red/5' : ''} ${
                    idx % 7 === 6 ? 'border-r-0' : ''
                  } ${isLast && !inMonth ? 'hidden' : ''}`}
                >
                  <div className={`font-heading text-[10px] mb-1 w-5 h-5 flex items-center justify-center ${
                    isToday ? 'bg-brand-red text-white' : 'text-white/30'
                  }`}>
                    {d.getDate()}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {dayShows.map((show) => (
                      <button
                        key={show.id}
                        type="button"
                        onClick={() => { openEdit(show); setDisplayMode('list') }}
                        title={`${show.venue} · ${show.time}`}
                        className={`w-full text-left font-heading text-[9px] uppercase tracking-wide px-1.5 py-1 truncate transition-colors ${
                          show.showStatus === 'Cancelled'
                            ? 'bg-red-500/15 text-red-400/70 hover:bg-red-500/25'
                            : show.isFeatured
                              ? 'bg-brand-red text-white hover:bg-brand-red-bright'
                              : 'bg-brand-red/20 text-brand-red hover:bg-brand-red/30'
                        }`}
                      >
                        {show.venue}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── List view ── */}
      {displayMode === 'list' && (
        <>
          {/* Past-shows stats + financial summary */}
          {showTab === 'past' && (() => {
            const past = shows.filter(s => s.date < todayIso)
            if (past.length === 0) return null
            const earned = past.reduce((a, s) => a + (s.payout ?? 0), 0)
            const guaranteed = past.reduce((a, s) => a + (s.guarantee ?? 0), 0)
            const outstanding = guaranteed - earned
            const loggedShows = past.filter(s => s.gigRating !== undefined)
            const avgRating = loggedShows.length > 0
              ? (loggedShows.reduce((a, s) => a + (s.gigRating ?? 0), 0) / loggedShows.length).toFixed(1)
              : null
            const totalAttendance = past.filter(s => s.attendance).reduce((a, s) => a + (s.attendance ?? 0), 0)
            const totalMerchAtShows = past.filter(s => s.merchSoldAtShow).reduce((a, s) => a + (s.merchSoldAtShow ?? 0), 0)
            const uniqueCities = new Set(past.map(s => s.city.split(',')[0].trim())).size
            const bestShow = loggedShows.sort((a, b) => (b.gigRating ?? 0) - (a.gigRating ?? 0))[0]
            return (
              <div className="mb-5 flex flex-col gap-3">
                {/* Quick stat chips */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Total Shows', value: past.length, color: 'text-white' },
                    { label: 'Cities', value: uniqueCities, color: 'text-white/70' },
                    ...(earned > 0 ? [{ label: 'Collected', value: fmtMoney(earned), color: 'text-green-400' }] : []),
                    ...(guaranteed > 0 && outstanding > 0 ? [{ label: 'Outstanding', value: fmtMoney(outstanding), color: 'text-yellow-400' }] : []),
                    ...(avgRating ? [{ label: 'Avg Rating', value: `${avgRating} ★`, color: 'text-yellow-400' }] : []),
                    ...(totalAttendance > 0 ? [{ label: 'Total Audience', value: totalAttendance.toLocaleString(), color: 'text-white/70' }] : []),
                    ...(totalMerchAtShows > 0 ? [{ label: 'Merch at Shows', value: fmtMoney(totalMerchAtShows), color: 'text-purple-400' }] : []),
                  ].map((s) => (
                    <div key={s.label} className="border border-white/8 bg-[#0d0d1e] px-4 py-2.5 flex items-center gap-2.5">
                      <span className="font-heading text-[9px] uppercase tracking-widest text-white/25">{s.label}</span>
                      <span className={`font-display text-lg leading-none ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
                {/* Best show highlight */}
                {bestShow && bestShow.gigHighlight && (
                  <div className="border border-yellow-400/15 bg-yellow-400/5 px-4 py-2.5 flex items-start gap-2.5">
                    <span className="font-heading text-[9px] uppercase tracking-widest text-yellow-400/60 flex-shrink-0 pt-0.5">Best Show</span>
                    <span className="font-body text-xs text-white/60 italic">"{bestShow.gigHighlight}"</span>
                    <span className="font-body text-[10px] text-white/25 flex-shrink-0 ml-auto">{'★'.repeat(bestShow.gigRating ?? 0)}</span>
                  </div>
                )}
              </div>
            )
          })()}
          <div className="flex flex-col gap-1.5">
            {(showTab === 'upcoming'
              ? shows.filter(s => s.date >= todayIso).sort((a, b) => a.date.localeCompare(b.date))
              : shows.filter(s => s.date < todayIso).sort((a, b) => b.date.localeCompare(a.date))
            ).map((show) => {
              const hidden = show.visible === false
              return (
                <div key={show.id} className={`relative flex items-center gap-0 border transition-colors overflow-hidden group ${hidden ? 'border-white/6 bg-[#0d0d1e] opacity-40' : show.isFeatured ? 'border-brand-red/25 bg-brand-red/4' : 'border-white/6 bg-[#0d0d1e] hover:border-white/12'}`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-0.5 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ${show.isFeatured ? 'bg-brand-red scale-y-100' : 'bg-brand-red'}`} />
                  {show.isFeatured && <div className="w-0.5 self-stretch bg-brand-red flex-shrink-0" />}
                  <div className={`flex-shrink-0 flex flex-col items-center justify-center w-14 py-3 text-center border-r ${show.isFeatured ? 'border-brand-red/15' : 'border-white/6'}`}>
                    <div className="font-display text-2xl text-white leading-none">{show.date.split('-')[2]}</div>
                    <div className="font-heading text-[9px] text-brand-red tracking-widest uppercase mt-0.5">
                      {new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 px-4 py-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-heading text-sm text-white truncate">{show.venue}</span>
                      {show.showStatus && show.showStatus !== 'Confirmed' && (
                        <span className={`font-heading text-[9px] uppercase tracking-widest border px-1.5 py-0.5 flex-shrink-0 ${
                          show.showStatus === 'Cancelled' ? 'border-red-500/30 text-red-400' :
                          show.showStatus === 'Hold' ? 'border-yellow-400/30 text-yellow-400' :
                          'border-white/20 text-white/40'
                        }`}>{show.showStatus}</span>
                      )}
                      {fmtMoney(show.guarantee) && (
                        <span className="font-body text-xs text-green-400/60 flex-shrink-0">{fmtMoney(show.guarantee)}</span>
                      )}
                    </div>
                    <div className="font-body text-xs text-white/35 truncate mt-0.5">{show.city} · {show.time}</div>
                  </div>
                  <div className="flex-shrink-0 px-3">
                    <button type="button" onClick={() => toggleFeatured(show.id)} title={show.isFeatured ? 'Remove featured' : 'Mark featured'}
                      className={`font-heading text-[9px] uppercase tracking-widest px-2 py-1 border transition-colors ${show.isFeatured ? 'border-brand-red/60 text-brand-red bg-brand-red/10' : 'border-white/10 text-white/25 hover:border-white/25 hover:text-white/50'}`}>
                      {show.isFeatured ? '★ Featured' : '☆ Feature'}
                    </button>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0 pr-3">
                    <button type="button" onClick={() => toggleVisible(show.id)} title={hidden ? 'Show on public site' : 'Hide from public site'}
                      className={`font-heading text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all ${hidden ? 'border-white/20 text-white/60 hover:border-white/40 hover:text-white' : 'border-white/10 text-white/35 hover:border-white/30 hover:text-white'}`}>
                      {hidden ? 'Hidden' : 'Visible'}
                    </button>
                    <button type="button" onClick={() => openEdit(show)} className="font-heading text-[10px] uppercase tracking-widest border border-white/10 text-white/35 px-3 py-1.5 hover:border-white/30 hover:text-white transition-all">Edit</button>
                    <button type="button" onClick={() => duplicateShow(show)} title="Duplicate show" className="font-heading text-[10px] uppercase tracking-widest border border-white/10 text-white/30 px-3 py-1.5 hover:border-white/30 hover:text-white transition-all">Dupe</button>
                    <button
                      title="Copy social post"
                      onClick={() => copyShowPost(show)}
                      className={`font-heading text-[10px] uppercase tracking-widest border px-2 py-1.5 transition-all flex items-center gap-1 ${copiedId === show.id ? 'border-green-400/40 text-green-400' : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white'}`}
                      aria-label="Copy social post"
                    >
                      {copiedId === show.id ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
                      )}
                    </button>
                    <button
                      title="Print Advance Sheet"
                      onClick={() => {
                        const w = window.open('', '_blank')
                        if (!w) return
                        w.document.write(buildAdvanceSheetHtml(show, techSpecs))
                        w.document.close()
                        w.focus()
                        setTimeout(() => w.print(), 400)
                      }}
                      className="border border-white/10 text-white/30 px-2 py-1.5 hover:border-white/30 hover:text-white transition-all"
                      aria-label="Print advance sheet"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                      </svg>
                    </button>
                    {showTab === 'past' && (
                      <button
                        onClick={() => loggingId === show.id ? setLoggingId(null) : openGigLog(show)}
                        className={`font-heading text-[10px] uppercase tracking-widest border px-3 py-1.5 transition-all ${
                          loggingId === show.id
                            ? 'border-brand-red/50 text-brand-red bg-brand-red/8'
                            : show.gigRating
                            ? 'border-green-400/30 text-green-400/70 hover:border-green-400/60 hover:text-green-400'
                            : 'border-white/10 text-white/35 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {show.gigRating ? `${'★'.repeat(show.gigRating)}` : 'Log'}
                      </button>
                    )}
                    {showTab === 'upcoming' && (() => {
                      const done = (show.advanceChecklist ?? []).length
                      const total = ADVANCE_CHECKS.length
                      const allDone = done === total
                      return (
                        <button
                          onClick={() => advancingId === show.id ? setAdvancingId(null) : openAdvance(show)}
                          title="Pre-show advance checklist"
                          className={`font-heading text-[10px] uppercase tracking-widest border px-3 py-1.5 transition-all ${
                            advancingId === show.id
                              ? 'border-brand-red/50 text-brand-red bg-brand-red/8'
                              : allDone
                              ? 'border-green-400/30 text-green-400/70 hover:border-green-400/50 hover:text-green-400'
                              : done > 0
                              ? 'border-blue-400/30 text-blue-400/70 hover:border-blue-400/50 hover:text-blue-400'
                              : 'border-white/10 text-white/35 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          {allDone ? '✓ Ready' : done > 0 ? `${done}/${total}` : 'Advance'}
                        </button>
                      )
                    })()}
                    <button type="button" onClick={() => remove(show.id)} className="font-heading text-[10px] uppercase tracking-widest border border-red-900/30 text-red-500/40 px-3 py-1.5 hover:border-red-500/60 hover:text-red-400 transition-all">Delete</button>
                  </div>
                </div>
              )
            })}
            {/* Inline gig-log panel */}
            {loggingId && (() => {
              const show = shows.find((s) => s.id === loggingId)
              if (!show) return null
              return (
                <div key={`log-${loggingId}`} className="border border-brand-red/20 bg-brand-red/[0.03] px-6 py-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="font-heading text-xs uppercase tracking-widest text-brand-red">Post-Gig Log — {show.venue}</p>
                    <button type="button" onClick={() => setLoggingId(null)} aria-label="Close log" className="text-white/30 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Audience Count</label>
                      <input
                        type="number" min={0}
                        value={gigLogDraft.attendance}
                        onChange={(e) => setGigLogDraft({ ...gigLogDraft, attendance: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 120"
                        aria-label="Audience count"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Merch Sold ($)</label>
                      <input
                        type="number" min={0} step={10}
                        value={gigLogDraft.merchSoldAtShow}
                        onChange={(e) => setGigLogDraft({ ...gigLogDraft, merchSoldAtShow: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 240"
                        aria-label="Merch sold at show"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Rating</label>
                      <div className="flex gap-1.5 items-center h-[42px]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setGigLogDraft({ ...gigLogDraft, gigRating: gigLogDraft.gigRating === star ? 0 : star })}
                            aria-label={`Rate ${star} stars`}
                            className={`font-body text-xl transition-colors ${star <= gigLogDraft.gigRating ? 'text-yellow-400' : 'text-white/15 hover:text-yellow-400/50'}`}
                          >★</button>
                        ))}
                        {gigLogDraft.gigRating > 0 && (
                          <span className="font-heading text-[9px] uppercase tracking-widest text-white/30 ml-1">
                            {['','Rough','OK','Good','Great','Fire!'][gigLogDraft.gigRating]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-4">
                      <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Highlight / Memorable Moment</label>
                      <input
                        type="text"
                        value={gigLogDraft.gigHighlight}
                        onChange={(e) => setGigLogDraft({ ...gigLogDraft, gigHighlight: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. Crowd sang along to Bohemian Rhapsody the whole way through"
                        aria-label="Show highlight"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => saveGigLog(loggingId)}
                      disabled={saving}
                      className="font-heading text-[10px] uppercase tracking-widest bg-brand-red text-white px-4 py-2 hover:bg-brand-red-bright transition-all disabled:opacity-60"
                    >
                      {saving ? 'Saving…' : 'Save Log'}
                    </button>
                    <button type="button" onClick={() => setLoggingId(null)} className="font-heading text-[10px] uppercase tracking-widest border border-white/15 text-white/40 px-4 py-2 hover:text-white transition-all">Cancel</button>
                  </div>
                </div>
              )
            })()}
          </div>

            {/* Inline advance checklist panel */}
            {advancingId && showTab === 'upcoming' && (() => {
              const show = shows.find((s) => s.id === advancingId)
              if (!show) return null
              return (
                <div key={`advance-${advancingId}`} className="border border-blue-400/20 bg-blue-400/[0.03] px-6 py-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="font-heading text-xs uppercase tracking-widest text-blue-400">Pre-Show Advance — {show.venue}</p>
                    <button type="button" onClick={() => setAdvancingId(null)} aria-label="Close advance panel" className="text-white/30 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ADVANCE_CHECKS.map((check) => {
                      const checked = advanceChecksDraft.includes(check.id)
                      return (
                        <label key={check.id} className="flex items-center gap-3 cursor-pointer group">
                          <button
                            onClick={() => toggleAdvanceCheck(check.id)}
                            aria-label={check.label}
                            className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-green-400 border-green-400' : 'border-white/20 group-hover:border-white/40'}`}
                          >
                            {checked && <svg className="w-3 h-3 text-[#07070f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          </button>
                          <span className={`font-body text-sm transition-colors ${checked ? 'text-white/50 line-through' : 'text-white/70'}`}>{check.label}</span>
                        </label>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${advanceChecksDraft.length === ADVANCE_CHECKS.length ? 'bg-green-400' : 'bg-blue-400'}`}
                        style={{ width: `${(advanceChecksDraft.length / ADVANCE_CHECKS.length) * 100}%` }}
                      />
                    </div>
                    <span className="font-heading text-[10px] uppercase tracking-widest text-white/30 flex-shrink-0">{advanceChecksDraft.length}/{ADVANCE_CHECKS.length}</span>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => saveAdvance(advancingId)}
                      disabled={saving}
                      className="font-heading text-[10px] uppercase tracking-widest bg-blue-500 text-white px-4 py-2 hover:bg-blue-400 transition-all disabled:opacity-60"
                    >
                      {saving ? 'Saving…' : 'Save Checklist'}
                    </button>
                    <button type="button" onClick={() => setAdvancingId(null)} className="font-heading text-[10px] uppercase tracking-widest border border-white/15 text-white/40 px-4 py-2 hover:text-white transition-all">Cancel</button>
                  </div>
                </div>
              )
            })()}
          {(showTab === 'upcoming'
            ? shows.filter(s => s.date >= todayIso)
            : shows.filter(s => s.date < todayIso)
          ).length === 0 && (
            <div className="text-center py-16 border border-white/6">
              <p className="font-heading text-white/25 text-xs tracking-widest uppercase">
                {showTab === 'upcoming' ? 'No upcoming shows — add one above' : 'No past shows yet'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
