'use client'

import { useState, useEffect, useCallback } from 'react'
import { mediaItems as initialMedia, type MediaItem } from '@/lib/data'
import ImageUpload from '@/components/admin/ImageUpload'

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

type FormState = {
  type: 'photo' | 'video'
  url: string
  poster: string
  caption: string
  visible: boolean
  isFeatured: boolean
}

const emptyForm: FormState = { type: 'photo', url: '', poster: '', caption: '', visible: true, isFeatured: false }

export default function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>(initialMedia)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => { if (d.mediaItems) setItems(d.mediaItems) })
      .catch(() => {})
  }, [])

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const persist = useCallback(async (updated: MediaItem[]) => {
    setSaving(true)
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'mediaItems', data: updated }),
      })
      flash()
    } finally {
      setSaving(false)
    }
  }, [])

  const save = async () => {
    if (!form.url) return
    const newItem: MediaItem = {
      id: Date.now().toString(),
      type: form.type,
      url: form.url,
      caption: form.caption,
      visible: form.visible,
      isFeatured: form.isFeatured,
      ...(form.poster ? { poster: form.poster } : {}),
    }
    const updated = [...items, newItem]
    setItems(updated)
    setForm(emptyForm)
    setIsAdding(false)
    await persist(updated)
  }

  const remove = async (id: string) => {
    if (!confirm('Remove this media item?')) return
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    await persist(updated)
  }

  const toggleVisible = async (id: string) => {
    const updated = items.map((i) => i.id === id ? { ...i, visible: !i.visible } : i)
    setItems(updated)
    await persist(updated)
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="border-l-2 border-brand-red pl-4">
          <h1 className="font-display uppercase text-4xl text-white leading-none">Media</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
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
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-all btn-glow-red flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Media
            </button>
          )}
        </div>
      </div>

      {/* Add form */}
      {isAdding && (
        <div className="mb-8 border border-brand-red/25 bg-brand-red/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between gap-3 px-6 py-3.5 border-b border-brand-red/15">
            <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red">Add Media Item</h2>
            <button onClick={() => setIsAdding(false)} className="text-white/30 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'photo' | 'video' })} className={inputClass}>
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Caption</label>
                <input type="text" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className={inputClass} placeholder="Live at Titanic Brewing..." />
              </div>
            </div>

            {form.type === 'photo' ? (
              <div className="mb-5">
                <ImageUpload
                  label="Photo *"
                  value={form.url}
                  onChange={(url) => setForm({ ...form, url })}
                  previewClassName="w-full aspect-video max-w-xs"
                  helper="Upload a photo from your device, or paste a URL."
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Video URL or Path *</label>
                  <input type="text" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputClass} placeholder="/videos/show.mp4 or https://..." />
                  <p className="font-body text-xs text-white/20">
                    Videos: paste a URL (YouTube, Vimeo) or a path to a file in <code className="text-brand-red/70">/public/videos/</code>.
                  </p>
                </div>
                <ImageUpload
                  label="Poster Image (optional)"
                  value={form.poster}
                  onChange={(url) => setForm({ ...form, poster: url })}
                  previewClassName="w-full aspect-video max-w-xs"
                  helper="Thumbnail shown before the video plays."
                />
                {form.url && (
                  <div>
                    <p className="font-heading text-[9px] uppercase tracking-widest text-white/20 mb-2">Video Preview</p>
                    <div className="relative w-full aspect-video max-w-xs bg-[#0d0d1e] border border-white/8 overflow-hidden">
                      <video src={form.url} poster={form.poster || undefined} className="w-full h-full object-cover" muted playsInline />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col gap-3 mb-5">
              {[
                { key: 'visible' as const, label: 'Visible on site' },
                { key: 'isFeatured' as const, label: 'Featured (spotlight on Media page)' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${form[key] ? 'bg-brand-red border-brand-red' : 'border-white/20 group-hover:border-white/40'}`} onClick={() => setForm({ ...form, [key]: !form[key] })}>
                    {form[key] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="font-heading text-xs uppercase tracking-widest text-white/50">{label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2.5">
              <button onClick={save} disabled={saving} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all disabled:opacity-60">
                Add Item
              </button>
              <button onClick={() => setIsAdding(false)} className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/40 px-5 py-2.5 hover:border-white/30 hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media list */}
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.id} className={`relative flex items-center gap-0 border border-white/6 bg-[#0d0d1e] hover:border-white/12 transition-all overflow-hidden group ${!item.visible ? 'opacity-40' : ''}`}>
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-red origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
            <div className="w-12 h-12 bg-white/4 border-r border-white/6 flex-shrink-0 flex items-center justify-center">
              {item.type === 'video' ? (
                <svg className="w-5 h-5 text-brand-red/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0 px-4 py-3">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-heading text-[9px] uppercase tracking-widest text-white/30">{item.type}</span>
                {item.isFeatured && <span className="font-heading text-[9px] uppercase tracking-widest text-brand-red border border-brand-red/40 bg-brand-red/10 px-1">★ Featured</span>}
                {!item.visible && <span className="font-heading text-[9px] uppercase tracking-widest text-white/20 border border-white/10 px-1">Hidden</span>}
              </div>
              <div className="font-body text-sm text-white truncate">{item.caption || item.url}</div>
              <div className="font-body text-xs text-white/25 truncate">{item.url}</div>
            </div>
            <div className="flex gap-1.5 flex-shrink-0 pr-3">
              <button onClick={() => toggleVisible(item.id)} className={`font-heading text-[9px] uppercase tracking-widest px-2 py-1 border transition-colors ${item.visible ? 'border-white/15 text-white/40 hover:border-white/30 hover:text-white' : 'border-white/8 text-white/20 hover:border-white/20'}`}>
                {item.visible ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => remove(item.id)} className="font-heading text-[10px] uppercase tracking-widest border border-red-900/30 text-red-500/40 px-3 py-1.5 hover:border-red-500/60 hover:text-red-400 transition-all">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 border border-white/6">
          <p className="font-heading text-white/25 text-xs tracking-widest uppercase">No media yet — add some above</p>
        </div>
      )}
    </div>
  )
}
