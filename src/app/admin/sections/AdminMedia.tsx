'use client'

import { useState } from 'react'

interface MediaItem {
  id: string
  type: 'photo' | 'video'
  url: string
  caption: string
  visible: boolean
}

const initialMedia: MediaItem[] = [
  { id: '1', type: 'video', url: '/videos/live-performance.mp4', caption: 'Live Performance', visible: true },
]

const inputClass =
  'w-full bg-[#0f0f1c] border border-white/10 text-white font-body text-sm px-3 py-2.5 focus:outline-none focus:border-brand-red/50 transition-colors rounded-sm placeholder:text-white/20'

export default function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>(initialMedia)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({ type: 'photo' as 'photo' | 'video', url: '', caption: '', visible: true })
  const [saved, setSaved] = useState(false)

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const save = () => {
    if (!form.url) return
    setItems([...items, { id: Date.now().toString(), ...form }])
    setForm({ type: 'photo', url: '', caption: '', visible: true })
    setIsAdding(false)
    flash()
  }

  const remove = (id: string) => {
    if (confirm('Remove this media item?')) setItems(items.filter((i) => i.id !== id))
  }

  const toggleVisible = (id: string) => {
    setItems(items.map((i) => i.id === id ? { ...i, visible: !i.visible } : i))
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display uppercase text-3xl text-white">Media</h1>
          <p className="font-body text-xs text-white/40 mt-1">{items.length} items</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="font-heading text-[10px] text-green-400 uppercase tracking-widest animate-pulse">Saved ✓</span>}
          <button onClick={() => setIsAdding(true)} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-colors">
            + Add Media
          </button>
        </div>
      </div>

      {/* Upload note */}
      <div className="mb-6 p-4 border border-white/8 bg-white/3 rounded-sm">
        <p className="font-body text-xs text-white/40 leading-relaxed">
          <span className="text-white/60">Photo/video hosting:</span> Upload files to <code className="text-brand-red">/public/images/</code> or{' '}
          <code className="text-brand-red">/public/videos/</code> and enter the path below. For external media, paste a full URL.
          Full cloud upload integration can be added when connected to a CMS or storage service.
        </p>
      </div>

      {/* Add form */}
      {isAdding && (
        <div className="mb-8 p-6 border border-brand-red/30 bg-brand-red/5 rounded-sm">
          <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-5">Add Media Item</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'photo' | 'video' })} className={inputClass}>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">URL or Path *</label>
              <input type="text" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputClass} placeholder="/images/photo.jpg" />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Caption</label>
              <input type="text" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className={inputClass} placeholder="Live at Titanic Brewing..." />
            </div>
          </div>
          <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} className="w-4 h-4 accent-brand-red" />
            <span className="font-heading text-xs uppercase tracking-widest text-white/60">Visible on site</span>
          </label>
          <div className="flex gap-3">
            <button onClick={save} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-colors">
              Add Item
            </button>
            <button onClick={() => setIsAdding(false)} className="font-heading text-xs uppercase tracking-widest border border-white/20 text-white/60 px-5 py-2.5 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Media list */}
      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 border rounded-sm p-4 border-white/8 bg-[#0f0f1c] transition-opacity ${!item.visible ? 'opacity-40' : ''}`}
          >
            {/* Preview */}
            <div className="w-14 h-10 bg-white/5 rounded-sm flex-shrink-0 overflow-hidden flex items-center justify-center">
              {item.type === 'video' ? (
                <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-heading text-xs uppercase tracking-widest text-white/50 mb-0.5">{item.type}</div>
              <div className="font-body text-sm text-white truncate">{item.caption || item.url}</div>
              <div className="font-body text-xs text-white/30 truncate">{item.url}</div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => toggleVisible(item.id)}
                className={`font-heading text-[9px] uppercase tracking-widest px-2 py-1 border transition-colors ${
                  item.visible ? 'border-white/20 text-white/50' : 'border-white/10 text-white/20'
                }`}
              >
                {item.visible ? 'Visible' : 'Hidden'}
              </button>
              <button onClick={() => remove(item.id)} className="font-heading text-[10px] uppercase tracking-widest border border-red-900/40 text-red-400/60 px-3 py-1.5 hover:border-red-500 hover:text-red-400 transition-colors">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 border border-white/8 rounded-sm">
          <p className="font-heading text-white/30 text-xs tracking-widest uppercase">No media yet — add some above</p>
        </div>
      )}
    </div>
  )
}
