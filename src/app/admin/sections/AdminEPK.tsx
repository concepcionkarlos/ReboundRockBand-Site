'use client'

import { useState, useEffect, useCallback } from 'react'
import { epkContent as initialEpk, type EpkContent } from '@/lib/data'

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

const textareaClass = `${inputClass} resize-none`

function buildEpkHtml(content: EpkContent): string {
  const repertoireRows = content.repertoire.map((r) =>
    `<tr><td class="era">${r.era}s</td><td>${r.artists}</td></tr>`
  ).join('')
  const techRows = content.techSpecs.map((r) =>
    `<tr><td class="spec-label">${r.label}</td><td class="spec-value">${r.value}</td></tr>`
  ).join('')
  const firstSetlist = content.setlists?.[0]
  const setlistHtml = firstSetlist && firstSetlist.songs.length > 0
    ? `<div class="section">
        <div class="section-title">Sample Setlist — ${firstSetlist.title}</div>
        <ol class="setlist-ol">
          ${firstSetlist.songs.map((s) => `<li>${s}</li>`).join('')}
        </ol>
       </div>`
    : ''
  const issued = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Press Kit — Rebound Rock Band</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color:#1a1a1a; background:#fff; padding:52px 60px; max-width:820px; margin:0 auto; line-height:1.6; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:4px solid #e0101e; padding-bottom:28px; margin-bottom:36px; }
  .brand-name { font-size:36px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; line-height:1; }
  .brand-sub { font-size:12px; color:#888; letter-spacing:0.12em; text-transform:uppercase; margin-top:6px; }
  .epk-badge { background:#e0101e; color:#fff; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; padding:5px 12px; margin-top:8px; display:inline-block; font-family:Arial,sans-serif; }
  .issue-date { font-family:Arial,sans-serif; font-size:11px; color:#aaa; text-align:right; margin-top:4px; }
  .section { margin-bottom:32px; }
  .section-title { font-family:Arial,sans-serif; font-size:10px; text-transform:uppercase; letter-spacing:0.16em; color:#999; border-bottom:1px solid #e8e8e8; padding-bottom:5px; margin-bottom:14px; font-weight:600; }
  .bio { font-size:14px; line-height:1.8; color:#333; }
  .key-facts { display:flex; flex-wrap:wrap; gap:10px 32px; margin-bottom:0; }
  .fact { font-family:Arial,sans-serif; font-size:13px; color:#444; }
  .fact strong { color:#1a1a1a; }
  table.repertoire { width:100%; border-collapse:collapse; font-size:13px; }
  table.repertoire td { padding:8px 12px; border-bottom:1px solid #f3f3f3; }
  td.era { font-family:Arial,sans-serif; font-weight:700; font-size:12px; color:#e0101e; width:60px; vertical-align:top; padding-top:10px; }
  table.tech { width:100%; border-collapse:collapse; font-size:13px; }
  table.tech td { padding:8px 12px; border-bottom:1px solid #f3f3f3; }
  td.spec-label { font-family:Arial,sans-serif; font-size:10px; text-transform:uppercase; letter-spacing:0.1em; color:#888; width:36%; vertical-align:top; padding-top:10px; }
  td.spec-value { font-weight:500; }
  ol.setlist-ol { columns:2; column-gap:36px; padding-left:20px; font-size:13px; line-height:2; }
  .contact-box { background:#fafafa; border:1px solid #e8e8e8; border-left:4px solid #e0101e; padding:18px 22px; display:flex; justify-content:space-between; align-items:center; margin-top:36px; }
  .contact-label { font-family:Arial,sans-serif; font-size:10px; text-transform:uppercase; letter-spacing:0.12em; color:#888; margin-bottom:4px; }
  .contact-value { font-size:15px; font-weight:600; color:#1a1a1a; }
  .footer { margin-top:24px; border-top:1px solid #e8e8e8; padding-top:14px; font-family:Arial,sans-serif; font-size:11px; color:#aaa; display:flex; justify-content:space-between; }
  @media print { body { padding:28px 36px; } @page { margin:0.5in; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-name">Rebound Rock Band</div>
      <div class="brand-sub">South Florida · Live Classic Rock</div>
      <div class="epk-badge">Electronic Press Kit</div>
    </div>
    <div class="issue-date">${issued}</div>
  </div>

  <div class="section">
    <div class="section-title">About the Band</div>
    <p class="bio">${content.bookerIntro || 'Rebound Rock Band is a 5-piece South Florida cover band delivering the greatest classic rock hits from the 1950s through the 1990s.'}</p>
  </div>

  <div class="section">
    <div class="section-title">At a Glance</div>
    <div class="key-facts">
      <div class="fact"><strong>Formation:</strong> South Florida</div>
      <div class="fact"><strong>Members:</strong> 5 musicians</div>
      <div class="fact"><strong>Genres:</strong> Classic Rock · Blues Rock · Pop Rock</div>
      <div class="fact"><strong>Eras:</strong> 1950s – 1990s</div>
      <div class="fact"><strong>Event Types:</strong> Bars, Festivals, Corporate, Private Events</div>
      <div class="fact"><strong>Set Length:</strong> 2 × 45 min (customizable)</div>
    </div>
  </div>

  ${content.repertoire?.length > 0 ? `
  <div class="section">
    <div class="section-title">Repertoire by Era</div>
    <table class="repertoire">${repertoireRows}</table>
  </div>` : ''}

  ${setlistHtml}

  ${content.techSpecs?.length > 0 ? `
  <div class="section">
    <div class="section-title">Technical Requirements</div>
    <table class="tech">${techRows}</table>
  </div>` : ''}

  ${(content.pressQuotes ?? []).length > 0 ? `
  <div class="section">
    <div class="section-title">Highlights &amp; Press</div>
    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;">
      ${(content.pressQuotes ?? []).map((q) =>
        `<li style="border-left:3px solid #e0101e;padding:6px 0 6px 14px;font-style:italic;font-size:13px;color:#444;line-height:1.7;">${q}</li>`
      ).join('')}
    </ul>
  </div>` : ''}

  <div class="contact-box">
    <div>
      <div class="contact-label">Booking Inquiries</div>
      <div class="contact-value">booking@reboundrockband.com</div>
    </div>
    <div style="text-align:right;">
      <div class="contact-label">Website</div>
      <div class="contact-value">reboundrockband.com</div>
    </div>
  </div>

  <div class="footer">
    <span>Rebound Rock Band · South Florida</span>
    <span>Confidential — for booking use only</span>
  </div>
</body>
</html>`
}

type Tab = 'intro' | 'tech' | 'setlists' | 'quotes'

const defaultSetlists = initialEpk.setlists ?? []

export default function AdminEPK() {
  const [content, setContent] = useState<EpkContent>(initialEpk)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('intro')
  const [reqCounts, setReqCounts] = useState<Record<string, number>>({})

  // Load from API on mount
  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => {
        if (d.epkContent) setContent(d.epkContent)
        // Build song request popularity map
        const counts: Record<string, number> = {}
        for (const req of (d.songRequests ?? [])) {
          for (const song of [req.song1, req.song2, req.song3].filter(Boolean)) {
            const key = String(song).toLowerCase().trim()
            counts[key] = (counts[key] || 0) + 1
          }
        }
        setReqCounts(counts)
      })
      .catch(() => {})
  }, [])

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const persist = useCallback(async (updated: EpkContent) => {
    setSaving(true)
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'epkContent', data: updated }),
      })
      flash()
    } finally {
      setSaving(false)
    }
  }, [])

  const saveContent = async () => {
    await persist(content)
  }

  // ── Tech spec helpers ──
  const updateTechSpec = (index: number, field: 'label' | 'value', value: string) => {
    const next = content.techSpecs.map((r, i) => i === index ? { ...r, [field]: value } : r)
    setContent({ ...content, techSpecs: next })
  }
  const addTechSpec = () => setContent({ ...content, techSpecs: [...content.techSpecs, { label: '', value: '' }] })
  const removeTechSpec = (index: number) => setContent({ ...content, techSpecs: content.techSpecs.filter((_, i) => i !== index) })

  // ── Setlist helpers ──
  const setlists = content.setlists ?? defaultSetlists
  const updateSetlistTitle = (i: number, title: string) => {
    const updated = setlists.map((s, idx) => idx === i ? { ...s, title } : s)
    setContent({ ...content, setlists: updated })
  }
  const updateSetlistSongs = (i: number, raw: string) => {
    const songs = raw.split('\n').map((s) => s.trim()).filter(Boolean)
    const updated = setlists.map((s, idx) => idx === i ? { ...s, songs } : s)
    setContent({ ...content, setlists: updated })
  }
  const addSetlist = () => setContent({ ...content, setlists: [...setlists, { title: 'New Set', songs: [] }] })
  const removeSetlist = (i: number) => setContent({ ...content, setlists: setlists.filter((_, idx) => idx !== i) })

  // ── Per-song helpers ──
  const patchSongs = (setIdx: number, songs: string[]) => {
    const updated = setlists.map((s, i) => i === setIdx ? { ...s, songs } : s)
    setContent({ ...content, setlists: updated })
  }
  const updateSong = (si: number, gi: number, val: string) => {
    const songs = [...setlists[si].songs]; songs[gi] = val; patchSongs(si, songs)
  }
  const removeSong = (si: number, gi: number) => {
    patchSongs(si, setlists[si].songs.filter((_, i) => i !== gi))
  }
  const moveSong = (si: number, gi: number, dir: -1 | 1) => {
    const songs = [...setlists[si].songs]
    const target = gi + dir
    if (target < 0 || target >= songs.length) return
    ;[songs[gi], songs[target]] = [songs[target], songs[gi]]
    patchSongs(si, songs)
  }
  const addSong = (si: number) => {
    patchSongs(si, [...setlists[si].songs, ''])
  }

  // ── Press quote helpers ──
  const pressQuotes = content.pressQuotes ?? []
  const addQuote = () => setContent({ ...content, pressQuotes: [...pressQuotes, ''] })
  const updateQuote = (i: number, val: string) => {
    const updated = pressQuotes.map((q, idx) => idx === i ? val : q)
    setContent({ ...content, pressQuotes: updated })
  }
  const removeQuote = (i: number) => setContent({ ...content, pressQuotes: pressQuotes.filter((_, idx) => idx !== i) })

  const tabs: { id: Tab; label: string }[] = [
    { id: 'intro', label: 'Intro' },
    { id: 'tech', label: 'Tech Rider' },
    { id: 'setlists', label: 'Setlists' },
    { id: 'quotes', label: `Highlights${pressQuotes.length > 0 ? ` (${pressQuotes.length})` : ''}` },
  ]

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="border-l-2 border-brand-red pl-4">
          <h1 className="font-display uppercase text-4xl text-white leading-none">Press Kit</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">EPK content · shown on the public /epk page</p>
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
          {saving && <div className="font-heading text-[10px] text-white/30 uppercase tracking-widest">Saving…</div>}
          <button
            type="button"
            onClick={() => {
              const w = window.open('', '_blank')
              if (!w) return
              w.document.write(buildEpkHtml(content))
              w.document.close()
              w.focus()
              setTimeout(() => w.print(), 400)
            }}
            className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/40 px-4 py-2.5 hover:border-brand-red/40 hover:text-brand-red transition-all flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Print EPK
          </button>
          <button
            type="button"
            onClick={saveContent}
            disabled={saving}
            className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-all btn-glow-red disabled:opacity-60"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-8 border-b border-white/8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`font-heading text-xs uppercase tracking-widest px-5 py-3 border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-brand-red text-white'
                : 'border-transparent text-white/30 hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Intro Tab ── */}
      {activeTab === 'intro' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Tagline</label>
            <input type="text" value={content.tagline} onChange={(e) => setContent({ ...content, tagline: e.target.value })} className={inputClass} />
            <p className="font-body text-xs text-white/20">Short one-liner shown under the band name in the EPK hero card.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Booker Intro</label>
            <textarea rows={4} value={content.bookerIntro} onChange={(e) => setContent({ ...content, bookerIntro: e.target.value })} className={textareaClass} />
            <p className="font-body text-xs text-white/20">Paragraph shown above the CTAs at the bottom of the EPK page.</p>
          </div>
        </div>
      )}

      {/* ── Tech Rider Tab ── */}
      {activeTab === 'tech' && (
        <div className="flex flex-col gap-4">
          <p className="font-body text-xs text-white/30 leading-relaxed">Technical specs shown to promoters and venues on the EPK page.</p>
          {content.techSpecs.map((row, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex flex-col gap-1.5 w-40 flex-shrink-0">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Label</label>
                <input type="text" value={row.label} onChange={(e) => updateTechSpec(i, 'label', e.target.value)} className={inputClass} placeholder="Stage Size" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Value</label>
                <input type="text" value={row.value} onChange={(e) => updateTechSpec(i, 'value', e.target.value)} className={inputClass} placeholder="16' × 12' minimum" />
              </div>
              <button onClick={() => removeTechSpec(i)} className="font-heading text-[10px] uppercase tracking-widest border border-red-900/30 text-red-500/40 px-3 py-2.5 mt-5 hover:border-red-500/60 hover:text-red-400 transition-all flex-shrink-0">
                Remove
              </button>
            </div>
          ))}
          <button onClick={addTechSpec} className="self-start font-heading text-xs uppercase tracking-widest border border-white/12 text-white/40 px-4 py-2 hover:border-white/25 hover:text-white transition-all flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Spec
          </button>
        </div>
      )}

      {/* ── Setlists Tab ── */}
      {activeTab === 'setlists' && (
        <div className="flex flex-col gap-6">
          <p className="font-body text-xs text-white/30 leading-relaxed">
            Drag to reorder — use ↑↓ buttons. Songs with fan requests show a purple badge.
          </p>
          {setlists.map((set, si) => (
            <div key={si} className="border border-white/8 bg-[#0d0d1e]">
              {/* Set header */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/6">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="text"
                    value={set.title}
                    onChange={(e) => updateSetlistTitle(si, e.target.value)}
                    className="bg-transparent border-none text-white font-heading text-xs uppercase tracking-widest focus:outline-none focus:text-brand-red transition-colors flex-1 min-w-0"
                    placeholder="Set Name"
                  />
                  <span className="font-body text-[11px] text-white/25 flex-shrink-0">{set.songs.filter(Boolean).length} songs</span>
                </div>
                <button type="button" onClick={() => removeSetlist(si)} className="font-heading text-[9px] uppercase tracking-widest text-red-500/40 hover:text-red-400 transition-colors flex-shrink-0">
                  Remove Set
                </button>
              </div>

              {/* Song rows */}
              <div className="divide-y divide-white/[0.04]">
                {set.songs.map((song, gi) => {
                  const key = song.toLowerCase().trim()
                  const reqCount = reqCounts[key] ?? 0
                  return (
                    <div key={gi} className="flex items-center gap-2 px-4 py-2 group hover:bg-white/[0.02] transition-colors">
                      <span className="font-heading text-[10px] text-white/20 w-5 text-right flex-shrink-0 tabular-nums">{gi + 1}</span>
                      <input
                        type="text"
                        value={song}
                        onChange={(e) => updateSong(si, gi, e.target.value)}
                        className="flex-1 bg-transparent text-sm text-white font-body focus:outline-none placeholder:text-white/15"
                        placeholder="Song title…"
                        aria-label={`Song ${gi + 1}`}
                      />
                      {reqCount > 0 && (
                        <span className="font-heading text-[9px] uppercase tracking-widest border border-purple-400/30 text-purple-400/70 px-1.5 py-0.5 flex-shrink-0" title={`${reqCount} fan request${reqCount > 1 ? 's' : ''}`}>
                          {reqCount}×
                        </span>
                      )}
                      <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => moveSong(si, gi, -1)}
                          disabled={gi === 0}
                          aria-label="Move song up"
                          className="w-6 h-6 flex items-center justify-center text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSong(si, gi, 1)}
                          disabled={gi === set.songs.length - 1}
                          aria-label="Move song down"
                          className="w-6 h-6 flex items-center justify-center text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSong(si, gi)}
                          aria-label="Remove song"
                          className="w-6 h-6 flex items-center justify-center text-red-500/30 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add song */}
              <div className="px-4 py-3 border-t border-white/6">
                <button
                  type="button"
                  onClick={() => addSong(si)}
                  className="font-heading text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  Add Song
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addSetlist} className="self-start font-heading text-xs uppercase tracking-widest border border-white/12 text-white/40 px-4 py-2 hover:border-white/25 hover:text-white transition-all flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Set
          </button>
        </div>
      )}

      {/* ── Quotes / Highlights tab ── */}
      {activeTab === 'quotes' && (
        <div className="flex flex-col gap-4">
          <p className="font-body text-xs text-white/30 leading-relaxed">
            Press mentions, notable performances, or highlights that appear in the printed EPK. Each entry shows as a blockquote.
          </p>
          {pressQuotes.length === 0 && (
            <p className="font-body text-sm text-white/20 italic py-4">No highlights yet — add your first one below.</p>
          )}
          {pressQuotes.map((quote, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="w-0.5 self-stretch bg-brand-red/40 flex-shrink-0 mt-1" />
              <textarea
                rows={2}
                value={quote}
                onChange={(e) => updateQuote(i, e.target.value)}
                className={`${textareaClass} flex-1`}
                placeholder={`e.g. "A high-energy classic rock band that had the whole crowd on their feet." — Miami New Times`}
                aria-label={`Highlight ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeQuote(i)}
                aria-label="Remove highlight"
                className="text-white/20 hover:text-red-400 transition-colors mt-2.5 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={addQuote}
              className="self-start font-heading text-xs uppercase tracking-widest border border-white/12 text-white/40 px-4 py-2 hover:border-white/25 hover:text-white transition-all flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Highlight
            </button>
            {pressQuotes.length > 0 && (
              <button
                type="button"
                onClick={saveContent}
                disabled={saving}
                className="self-start font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2 hover:bg-brand-red-bright transition-all disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
