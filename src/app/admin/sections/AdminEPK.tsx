'use client'

import { useState, useEffect, useCallback } from 'react'
import { epkContent as initialEpk, type EpkContent } from '@/lib/data'

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

const textareaClass = `${inputClass} resize-none`

type Tab = 'intro' | 'repertoire' | 'tech' | 'setlists'

const defaultSetlists = initialEpk.setlists ?? []

export default function AdminEPK() {
  const [content, setContent] = useState<EpkContent>(initialEpk)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('intro')

  // Load from API on mount
  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => { if (d.epkContent) setContent(d.epkContent) })
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

  // ── Repertoire helpers ──
  const updateRepertoire = (index: number, field: 'era' | 'artists', value: string) => {
    const next = content.repertoire.map((r, i) => i === index ? { ...r, [field]: value } : r)
    setContent({ ...content, repertoire: next })
  }
  const addRepertoireRow = () => setContent({ ...content, repertoire: [...content.repertoire, { era: '', artists: '' }] })
  const removeRepertoireRow = (index: number) => setContent({ ...content, repertoire: content.repertoire.filter((_, i) => i !== index) })

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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'intro', label: 'Intro' },
    { id: 'repertoire', label: 'Repertoire' },
    { id: 'tech', label: 'Tech Rider' },
    { id: 'setlists', label: 'Setlists' },
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

      {/* ── Repertoire Tab ── */}
      {activeTab === 'repertoire' && (
        <div className="flex flex-col gap-4">
          <p className="font-body text-xs text-white/30 leading-relaxed">
            Decade rows shown on the EPK page. Enter the decade without the trailing <code className="text-brand-red/70">s</code>
            {' '}(e.g. <code className="text-brand-red/70">60</code> renders as <span className="text-white/60">60s</span>).
          </p>
          {content.repertoire.map((row, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex flex-col gap-1.5 w-24 flex-shrink-0">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Era</label>
                <input type="text" value={row.era} onChange={(e) => updateRepertoire(i, 'era', e.target.value)} className={inputClass} placeholder="60" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Artists</label>
                <input type="text" value={row.artists} onChange={(e) => updateRepertoire(i, 'artists', e.target.value)} className={inputClass} placeholder="The Beatles, The Rolling Stones..." />
              </div>
              <button onClick={() => removeRepertoireRow(i)} className="font-heading text-[10px] uppercase tracking-widest border border-red-900/30 text-red-500/40 px-3 py-2.5 mt-5 hover:border-red-500/60 hover:text-red-400 transition-all flex-shrink-0">
                Remove
              </button>
            </div>
          ))}
          <button onClick={addRepertoireRow} className="self-start font-heading text-xs uppercase tracking-widest border border-white/12 text-white/40 px-4 py-2 hover:border-white/25 hover:text-white transition-all flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Decade
          </button>
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
            One song per line. These appear as an accordion on the public EPK page.
          </p>
          {setlists.map((set, i) => (
            <div key={i} className="border border-white/8 bg-[#0d0d1e]">
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/6">
                <input
                  type="text"
                  value={set.title}
                  onChange={(e) => updateSetlistTitle(i, e.target.value)}
                  className="bg-transparent border-none text-white font-heading text-xs uppercase tracking-widest focus:outline-none focus:text-brand-red transition-colors w-full"
                  placeholder="Set Name"
                />
                <button onClick={() => removeSetlist(i)} className="font-heading text-[9px] uppercase tracking-widest text-red-500/40 hover:text-red-400 transition-colors flex-shrink-0">
                  Remove
                </button>
              </div>
              <div className="p-4">
                <textarea
                  rows={12}
                  value={set.songs.join('\n')}
                  onChange={(e) => updateSetlistSongs(i, e.target.value)}
                  className={textareaClass}
                  placeholder="Song title&#10;Another song&#10;..."
                />
                <p className="font-body text-xs text-white/20 mt-1.5">{set.songs.length} songs</p>
              </div>
            </div>
          ))}
          <button onClick={addSetlist} className="self-start font-heading text-xs uppercase tracking-widest border border-white/12 text-white/40 px-4 py-2 hover:border-white/25 hover:text-white transition-all flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Set
          </button>
        </div>
      )}
    </div>
  )
}
