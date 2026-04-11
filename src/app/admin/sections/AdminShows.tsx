'use client'

import { useState } from 'react'
import { shows as initialShows, type Show } from '@/lib/data'

const emptyShow: Omit<Show, 'id'> = {
  date: '',
  venue: '',
  city: '',
  time: '',
  ticketUrl: '',
  isFeatured: false,
}

const inputClass =
  'w-full bg-[#0d0d1e] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

// ── Canvas story generator ────────────────────────────────────────────────────
// Draws a 1080×1920 (9:16) Facebook-Story-ready PNG with all upcoming shows.
async function generateStoryPNG(shows: Show[]): Promise<void> {
  // Wait for custom fonts (Bebas Neue, Oswald, Inter) to be ready in the browser
  await document.fonts.ready

  const W = 1080
  const H = 1920
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // ── 1. Background ──────────────────────────────────────────────────────────
  ctx.fillStyle = '#080810'
  ctx.fillRect(0, 0, W, H)

  // Diagonal stripe texture (subtle)
  ctx.strokeStyle = 'rgba(255,255,255,0.018)'
  ctx.lineWidth = 1
  for (let i = -H; i < W + H; i += 44) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + H, H)
    ctx.stroke()
  }

  // Atmospheric red glow — top center
  const topGlow = ctx.createRadialGradient(W / 2, 180, 0, W / 2, 180, 480)
  topGlow.addColorStop(0, 'rgba(224,16,30,0.18)')
  topGlow.addColorStop(1, 'rgba(224,16,30,0)')
  ctx.fillStyle = topGlow
  ctx.fillRect(0, 0, W, 600)

  // Bottom glow
  const btmGlow = ctx.createRadialGradient(W / 2, H - 100, 0, W / 2, H - 100, 300)
  btmGlow.addColorStop(0, 'rgba(224,16,30,0.10)')
  btmGlow.addColorStop(1, 'rgba(224,16,30,0)')
  ctx.fillStyle = btmGlow
  ctx.fillRect(0, H - 350, W, 350)

  // ── 2. Top & bottom red bars ──────────────────────────────────────────────
  ctx.fillStyle = '#e0101e'
  ctx.fillRect(0, 0, W, 7)
  ctx.fillRect(0, H - 7, W, 7)

  // ── 3. Header — band name ─────────────────────────────────────────────────
  const PAD = 80

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // "REBOUND"
  ctx.fillStyle = '#ffffff'
  ctx.font = '400 148px "Bebas Neue", Impact, "Arial Narrow", sans-serif'
  ctx.fillText('REBOUND', W / 2, 168)

  // "ROCK BAND" in red
  ctx.fillStyle = '#e0101e'
  ctx.font = '400 84px "Bebas Neue", Impact, "Arial Narrow", sans-serif'
  ctx.fillText('ROCK BAND', W / 2, 262)

  // Thin divider line
  ctx.strokeStyle = '#2a2a3e'
  ctx.lineWidth = 1.5
  const divX = PAD + 60
  ctx.beginPath()
  ctx.moveTo(divX, 302)
  ctx.lineTo(W - divX, 302)
  ctx.stroke()

  // Red dot center on divider
  ctx.fillStyle = '#e0101e'
  ctx.beginPath()
  ctx.arc(W / 2, 302, 4, 0, Math.PI * 2)
  ctx.fill()

  // "UPCOMING SHOWS" eyebrow
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = '700 26px Oswald, "Arial Narrow", sans-serif'
  ctx.letterSpacing = '0.3em'
  ctx.fillText('UPCOMING  SHOWS', W / 2, 360)
  ctx.letterSpacing = '0px'

  // Month / Year sub-label
  const now = new Date()
  const yearLabel = now.getFullYear().toString()
  ctx.fillStyle = 'rgba(224,16,30,0.7)'
  ctx.font = '400 22px Inter, system-ui, sans-serif'
  ctx.fillText(yearLabel, W / 2, 394)

  // ── 4. Shows list ─────────────────────────────────────────────────────────
  const LIST_TOP = 440
  const LIST_BTM = 1730
  const LIST_H = LIST_BTM - LIST_TOP
  const rowH = Math.min(190, Math.floor(LIST_H / Math.max(shows.length, 1)))
  const dateBoxW = 110
  const dateBoxH = Math.min(rowH - 30, 120)

  shows.forEach((show, i) => {
    const rowY = LIST_TOP + i * rowH

    // Separator line (before each row except first)
    if (i > 0) {
      ctx.strokeStyle = '#1e1e2e'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(PAD, rowY)
      ctx.lineTo(W - PAD, rowY)
      ctx.stroke()
    }

    const midY = rowY + rowH / 2

    // Red date box
    const boxX = PAD
    const boxY = midY - dateBoxH / 2
    ctx.fillStyle = '#e0101e'
    ctx.fillRect(boxX, boxY, dateBoxW, dateBoxH)

    // Day number
    const date = new Date(show.date + 'T00:00:00')
    const day = date.toLocaleDateString('en-US', { day: '2-digit' })
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()

    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffffff'
    const dayFontSize = Math.min(62, Math.floor(dateBoxH * 0.52))
    ctx.font = `400 ${dayFontSize}px "Bebas Neue", Impact, "Arial Narrow", sans-serif`
    ctx.fillText(day, boxX + dateBoxW / 2, boxY + dateBoxH * 0.58)

    const monthFontSize = Math.min(22, Math.floor(dateBoxH * 0.19))
    ctx.font = `700 ${monthFontSize}px Oswald, "Arial Narrow", sans-serif`
    ctx.fillText(month, boxX + dateBoxW / 2, boxY + dateBoxH - 10)

    // Weekday label above the date box
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.font = '400 18px Inter, system-ui, sans-serif'
    ctx.fillText(weekday, boxX + dateBoxW / 2, boxY - 6)

    // Venue name
    const textX = PAD + dateBoxW + 30
    const venueFs = Math.min(44, Math.floor(rowH * 0.26))
    ctx.textAlign = 'left'
    ctx.fillStyle = show.isFeatured ? '#ffffff' : 'rgba(255,255,255,0.9)'
    ctx.font = `700 ${venueFs}px Oswald, "Arial Narrow", sans-serif`

    // Truncate venue name to fit
    let venueName = show.venue
    const maxW = W - textX - PAD - (show.isFeatured ? 30 : 0)
    while (ctx.measureText(venueName).width > maxW && venueName.length > 10) {
      venueName = venueName.slice(0, -2) + '…'
    }
    ctx.fillText(venueName, textX, midY - 6)

    // Featured star
    if (show.isFeatured) {
      ctx.fillStyle = '#e0101e'
      ctx.font = `700 ${venueFs}px sans-serif`
      ctx.textAlign = 'right'
      ctx.fillText('★', W - PAD, midY - 6)
      ctx.textAlign = 'left'
    }

    // City + time
    const metaFs = Math.min(26, Math.floor(rowH * 0.16))
    ctx.fillStyle = '#6b6b80'
    ctx.font = `400 ${metaFs}px Inter, system-ui, sans-serif`
    ctx.fillText(`${show.city}  ·  ${show.time}`, textX, midY + metaFs + 6)
  })

  // Bottom border of last row
  ctx.strokeStyle = '#1e1e2e'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, LIST_BTM)
  ctx.lineTo(W - PAD, LIST_BTM)
  ctx.stroke()

  // ── 5. Footer ─────────────────────────────────────────────────────────────
  ctx.textAlign = 'center'

  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = '700 30px Oswald, "Arial Narrow", sans-serif'
  ctx.fillText('REBOUND ROCK BAND', W / 2, 1800)

  ctx.fillStyle = 'rgba(107,107,128,0.8)'
  ctx.font = '400 22px Inter, system-ui, sans-serif'
  ctx.fillText('reboundrockband.com  ·  South Florida', W / 2, 1840)

  // ── 6. Trigger download ───────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0]
  const link = document.createElement('a')
  link.download = `rebound-rock-band-shows-${today}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminShows() {
  const [shows, setShows] = useState<Show[]>(initialShows)
  const [editing, setEditing] = useState<Show | null>(null)
  const [form, setForm] = useState<Omit<Show, 'id'>>(emptyShow)
  const [isAdding, setIsAdding] = useState(false)
  const [saved, setSaved] = useState(false)
  const [generating, setGenerating] = useState(false)

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const openEdit = (show: Show) => {
    setEditing(show)
    setForm({ date: show.date, venue: show.venue, city: show.city, time: show.time, ticketUrl: show.ticketUrl ?? '', isFeatured: show.isFeatured ?? false })
    setIsAdding(false)
  }

  const openAdd = () => { setEditing(null); setForm(emptyShow); setIsAdding(true) }
  const cancel = () => { setEditing(null); setIsAdding(false) }

  const save = () => {
    if (!form.date || !form.venue || !form.city || !form.time) return
    if (editing) {
      setShows(shows.map((s) => s.id === editing.id ? { ...editing, ...form } : s))
    } else {
      setShows([...shows, { id: Date.now().toString(), ...form }])
    }
    cancel()
    flash()
  }

  const remove = (id: string) => {
    if (confirm('Delete this show?')) setShows(shows.filter((s) => s.id !== id))
  }

  const toggleFeatured = (id: string) => {
    setShows(shows.map((s) => s.id === id ? { ...s, isFeatured: !s.isFeatured } : s))
  }

  const handleDownloadStory = async () => {
    if (shows.length === 0) return
    setGenerating(true)
    try {
      await generateStoryPNG(shows)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display uppercase text-4xl text-white leading-none">Shows</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">{shows.length} upcoming date{shows.length !== 1 ? 's' : ''}</p>
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

          {/* Download Story button */}
          <button
            onClick={handleDownloadStory}
            disabled={shows.length === 0 || generating}
            title="Download a 1080×1920 Facebook Story image with all shows"
            className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/50 px-3.5 py-2.5 hover:border-brand-red/50 hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {generating ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Story PNG
              </>
            )}
          </button>

          <button
            onClick={openAdd}
            className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-all btn-glow-red flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Show
          </button>
        </div>
      </div>

      {/* Story download info */}
      <div className="mb-6 p-4 border border-white/6 bg-white/2 flex gap-3">
        <svg className="w-4 h-4 text-brand-muted/40 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="font-body text-xs text-white/30 leading-relaxed">
          <span className="text-white/50">Story PNG</span> exports a 1080×1920 image with all current shows — ready to upload as a Facebook or Instagram Story.
          Edit or reorder shows first, then download.
        </p>
      </div>

      {/* Form panel */}
      {(isAdding || editing) && (
        <div className="mb-8 border border-brand-red/25 bg-brand-red/4">
          <div className="flex items-center justify-between gap-3 px-6 py-3.5 border-b border-brand-red/15">
            <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red">
              {editing ? 'Edit Show' : 'New Show'}
            </h2>
            <button onClick={cancel} className="text-white/30 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Date *</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
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
            <label className="flex items-center gap-3 mb-5 cursor-pointer group w-fit">
              <div
                className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                  form.isFeatured ? 'bg-brand-red border-brand-red' : 'border-white/20 group-hover:border-white/40'
                }`}
                onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
              >
                {form.isFeatured && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-heading text-xs uppercase tracking-widest text-white/50">Mark as Featured (★ in Story)</span>
            </label>
            <div className="flex gap-2.5">
              <button
                onClick={save}
                className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all"
              >
                {editing ? 'Save Changes' : 'Add Show'}
              </button>
              <button
                onClick={cancel}
                className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/40 px-5 py-2.5 hover:border-white/30 hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shows list */}
      <div className="flex flex-col gap-1.5">
        {shows.map((show) => (
          <div
            key={show.id}
            className={`flex items-center gap-0 border transition-colors overflow-hidden ${
              show.isFeatured
                ? 'border-brand-red/25 bg-brand-red/4'
                : 'border-white/6 bg-[#0d0d1e] hover:border-white/10'
            }`}
          >
            {/* Featured left stripe */}
            {show.isFeatured && <div className="w-0.5 self-stretch bg-brand-red flex-shrink-0" />}

            {/* Date block */}
            <div className={`flex-shrink-0 flex flex-col items-center justify-center w-14 py-3 text-center border-r ${
              show.isFeatured ? 'border-brand-red/15' : 'border-white/6'
            }`}>
              <div className="font-display text-2xl text-white leading-none">
                {show.date.split('-')[2]}
              </div>
              <div className="font-heading text-[9px] text-brand-red tracking-widest uppercase mt-0.5">
                {new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 px-4 py-3">
              <div className="font-heading text-sm text-white truncate">{show.venue}</div>
              <div className="font-body text-xs text-white/35 truncate mt-0.5">{show.city} · {show.time}</div>
            </div>

            {/* Featured toggle */}
            <div className="flex-shrink-0 px-3">
              <button
                onClick={() => toggleFeatured(show.id)}
                title={show.isFeatured ? 'Remove featured' : 'Mark featured'}
                className={`font-heading text-[9px] uppercase tracking-widest px-2 py-1 border transition-colors ${
                  show.isFeatured
                    ? 'border-brand-red/60 text-brand-red bg-brand-red/10'
                    : 'border-white/10 text-white/25 hover:border-white/25 hover:text-white/50'
                }`}
              >
                {show.isFeatured ? '★ Featured' : '☆ Feature'}
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 flex-shrink-0 pr-3">
              <button
                onClick={() => openEdit(show)}
                className="font-heading text-[10px] uppercase tracking-widest border border-white/10 text-white/35 px-3 py-1.5 hover:border-white/30 hover:text-white transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => remove(show.id)}
                className="font-heading text-[10px] uppercase tracking-widest border border-red-900/30 text-red-500/40 px-3 py-1.5 hover:border-red-500/60 hover:text-red-400 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {shows.length === 0 && (
        <div className="text-center py-16 border border-white/6">
          <p className="font-heading text-white/25 text-xs tracking-widest uppercase">No shows yet — add one above</p>
        </div>
      )}

      <p className="font-body text-xs text-white/15 mt-8 leading-relaxed">
        Changes here are local to this session. Connect to a database or CMS to persist data across deployments.
      </p>
    </div>
  )
}
