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
  'w-full bg-[#0f0f1c] border border-white/10 text-white font-body text-sm px-3 py-2.5 focus:outline-none focus:border-brand-red/50 transition-colors rounded-sm placeholder:text-white/20'

export default function AdminShows() {
  const [shows, setShows] = useState<Show[]>(initialShows)
  const [editing, setEditing] = useState<Show | null>(null)
  const [form, setForm] = useState<Omit<Show, 'id'>>(emptyShow)
  const [isAdding, setIsAdding] = useState(false)
  const [saved, setSaved] = useState(false)

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const openEdit = (show: Show) => {
    setEditing(show)
    setForm({ date: show.date, venue: show.venue, city: show.city, time: show.time, ticketUrl: show.ticketUrl ?? '', isFeatured: show.isFeatured ?? false })
    setIsAdding(false)
  }

  const openAdd = () => {
    setEditing(null)
    setForm(emptyShow)
    setIsAdding(true)
  }

  const cancel = () => { setEditing(null); setIsAdding(false) }

  const save = () => {
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

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display uppercase text-3xl text-white">Shows</h1>
          <p className="font-body text-xs text-white/40 mt-1">{shows.length} upcoming shows</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="font-heading text-[10px] text-green-400 uppercase tracking-widest animate-pulse">
              Saved ✓
            </span>
          )}
          <button
            onClick={openAdd}
            className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-colors"
          >
            + Add Show
          </button>
        </div>
      </div>

      {/* Form (add / edit) */}
      {(isAdding || editing) && (
        <div className="mb-8 p-6 border border-brand-red/30 bg-brand-red/5 rounded-sm">
          <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-5">
            {editing ? 'Edit Show' : 'New Show'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Time *</label>
              <input type="text" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputClass} placeholder="7:00 PM" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Venue *</label>
              <input type="text" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className={inputClass} placeholder="Venue name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">City *</label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} placeholder="Miami, FL" />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Ticket URL (optional)</label>
              <input type="url" value={form.ticketUrl} onChange={(e) => setForm({ ...form, ticketUrl: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <input
              type="checkbox"
              id="featured"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="w-4 h-4 accent-brand-red"
            />
            <label htmlFor="featured" className="font-heading text-xs uppercase tracking-widest text-white/60">Mark as Featured</label>
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-colors">
              {editing ? 'Save Changes' : 'Add Show'}
            </button>
            <button onClick={cancel} className="font-heading text-xs uppercase tracking-widest border border-white/20 text-white/60 px-5 py-2.5 hover:border-white/40 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Shows list */}
      <div className="flex flex-col gap-2">
        {shows.map((show) => (
          <div
            key={show.id}
            className={`flex items-center gap-4 border rounded-sm p-4 transition-colors ${
              show.isFeatured ? 'border-brand-red/30 bg-brand-red/5' : 'border-white/8 bg-[#0f0f1c]'
            }`}
          >
            {/* Date */}
            <div className="flex-shrink-0 w-12 text-center">
              <div className="font-display text-2xl text-white leading-none">
                {show.date.split('-')[2]}
              </div>
              <div className="font-heading text-[9px] text-brand-red tracking-widest uppercase">
                {new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-heading text-sm text-white truncate">{show.venue}</div>
              <div className="font-body text-xs text-white/40 truncate">{show.city} · {show.time}</div>
            </div>

            {/* Featured badge */}
            <button
              onClick={() => toggleFeatured(show.id)}
              className={`flex-shrink-0 font-heading text-[9px] uppercase tracking-widest px-2 py-1 border transition-colors ${
                show.isFeatured
                  ? 'border-brand-red text-brand-red'
                  : 'border-white/15 text-white/30 hover:border-white/30'
              }`}
            >
              {show.isFeatured ? 'Featured' : 'Feature'}
            </button>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => openEdit(show)}
                className="font-heading text-[10px] uppercase tracking-widest border border-white/15 text-white/50 px-3 py-1.5 hover:border-white/40 hover:text-white transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => remove(show.id)}
                className="font-heading text-[10px] uppercase tracking-widest border border-red-900/40 text-red-400/60 px-3 py-1.5 hover:border-red-500 hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {shows.length === 0 && (
        <div className="text-center py-16 border border-white/8 rounded-sm">
          <p className="font-heading text-white/30 text-xs tracking-widest uppercase">No shows yet — add one above</p>
        </div>
      )}

      <p className="font-body text-xs text-white/20 mt-8">
        Note: Changes here are local to this session. Connect to a database or CMS to persist data.
      </p>
    </div>
  )
}
