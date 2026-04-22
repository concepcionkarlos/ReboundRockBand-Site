'use client'

import { useState, useEffect, useRef } from 'react'
import type { AdminNote, AdminNotePriority } from '@/lib/data'

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

type Filter = 'all' | 'active' | 'done'

function fmtDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 60000)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function AdminNotes() {
  const [notes, setNotes] = useState<AdminNote[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState('')
  const [priority, setPriority] = useState<AdminNotePriority>('normal')
  const [filter, setFilter] = useState<Filter>('active')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => setNotes(d.adminNotes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const persist = async (updated: AdminNote[]) => {
    setSaving(true)
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'adminNotes', data: updated }),
      })
      setNotes(updated)
    } finally {
      setSaving(false)
    }
  }

  const addNote = async () => {
    const text = draft.trim()
    if (!text) return
    const note: AdminNote = {
      id: `${Date.now()}`,
      text,
      done: false,
      priority,
      createdAt: new Date().toISOString(),
    }
    await persist([note, ...notes])
    setDraft('')
    setPriority('normal')
    inputRef.current?.focus()
  }

  const toggleDone = async (id: string) => {
    await persist(notes.map((n) => n.id === id ? { ...n, done: !n.done } : n))
  }

  const deleteNote = async (id: string) => {
    await persist(notes.filter((n) => n.id !== id))
  }

  const startEdit = (note: AdminNote) => {
    setEditingId(note.id)
    setEditText(note.text)
  }

  const saveEdit = async (id: string) => {
    const text = editText.trim()
    if (!text) return
    await persist(notes.map((n) => n.id === id ? { ...n, text } : n))
    setEditingId(null)
  }

  const clearDone = async () => {
    await persist(notes.filter((n) => !n.done))
  }

  const filtered = notes.filter((n) => {
    if (filter === 'active') return !n.done
    if (filter === 'done') return n.done
    return true
  })

  const activeCount = notes.filter((n) => !n.done).length
  const doneCount = notes.filter((n) => n.done).length
  const highCount = notes.filter((n) => n.priority === 'high' && !n.done).length

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div className="border-l-2 border-brand-red pl-4">
          <h1 className="font-display uppercase text-4xl text-white leading-none">Notes</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">Internal team scratchpad · shared across all admin sessions</p>
        </div>
        <div className="flex gap-5">
          <div className="text-right">
            <div className={`font-display text-2xl leading-none ${activeCount > 0 ? 'text-white' : 'text-white/20'}`}>{activeCount}</div>
            <div className="font-heading text-[9px] uppercase tracking-widest text-white/30">Active</div>
          </div>
          {highCount > 0 && (
            <div className="text-right">
              <div className="font-display text-2xl leading-none text-brand-red">{highCount}</div>
              <div className="font-heading text-[9px] uppercase tracking-widest text-white/30">High Priority</div>
            </div>
          )}
          <div className="text-right">
            <div className={`font-display text-2xl leading-none ${doneCount > 0 ? 'text-white/40' : 'text-white/15'}`}>{doneCount}</div>
            <div className="font-heading text-[9px] uppercase tracking-widest text-white/30">Done</div>
          </div>
        </div>
      </div>

      {/* Quick-add */}
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addNote() }}
            placeholder="Add a note or task… (Enter to save)"
            className={`${inputClass} flex-1`}
            aria-label="New note text"
          />
          <button
            type="button"
            onClick={addNote}
            disabled={!draft.trim() || saving}
            className="font-heading text-[10px] uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-all disabled:opacity-40 flex-shrink-0"
          >
            Add
          </button>
        </div>
        {/* Priority toggle */}
        <div className="flex items-center gap-2">
          <span className="font-heading text-[9px] uppercase tracking-widest text-white/25">Priority:</span>
          {(['normal', 'high'] as AdminNotePriority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`font-heading text-[9px] uppercase tracking-widest px-2.5 py-1 border transition-colors ${
                priority === p
                  ? p === 'high' ? 'border-brand-red text-brand-red bg-brand-red/10' : 'border-white/30 text-white bg-white/8'
                  : 'border-white/8 text-white/25 hover:border-white/20 hover:text-white/50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {(['active', 'all', 'done'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`font-heading text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                filter === f
                  ? 'bg-brand-red border-brand-red text-white'
                  : 'border-white/10 text-white/35 hover:border-white/25 hover:text-white/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {doneCount > 0 && (
          <button
            type="button"
            onClick={clearDone}
            disabled={saving}
            className="font-heading text-[9px] uppercase tracking-widest text-white/20 hover:text-red-400/60 transition-colors disabled:opacity-40"
          >
            Clear done ({doneCount})
          </button>
        )}
      </div>

      {/* Notes list */}
      {loading ? (
        <div className="font-body text-sm text-white/30 py-16 text-center">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="border border-white/6 border-dashed py-16 text-center">
          <p className="font-heading text-[10px] uppercase tracking-widest text-white/15">
            {filter === 'active' ? 'No active notes — add one above' : filter === 'done' ? 'No completed notes' : 'No notes yet'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {filtered.map((note) => (
            <div
              key={note.id}
              className={`flex items-start gap-3 border px-4 py-3.5 group transition-all ${
                note.done
                  ? 'border-white/5 bg-[#0a0a16] opacity-50'
                  : note.priority === 'high'
                  ? 'border-brand-red/20 bg-brand-red/[0.03]'
                  : 'border-white/6 bg-[#0d0d1e]'
              }`}
            >
              {/* Checkbox */}
              <button
                type="button"
                onClick={() => toggleDone(note.id)}
                aria-label={note.done ? 'Mark as active' : 'Mark as done'}
                className={`mt-0.5 w-4 h-4 flex-shrink-0 border transition-all ${
                  note.done
                    ? 'border-white/20 bg-white/10 flex items-center justify-center'
                    : note.priority === 'high'
                    ? 'border-brand-red/50 hover:bg-brand-red/10'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {note.done && (
                  <svg className="w-2.5 h-2.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Text */}
              <div className="flex-1 min-w-0">
                {editingId === note.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(note.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    onBlur={() => saveEdit(note.id)}
                    autoFocus
                    className="w-full bg-transparent text-white font-body text-sm focus:outline-none border-b border-brand-red/50"
                    aria-label="Edit note"
                  />
                ) : (
                  <p
                    className={`font-body text-sm leading-relaxed cursor-pointer ${note.done ? 'line-through text-white/30' : 'text-white/80'}`}
                    onClick={() => !note.done && startEdit(note)}
                  >
                    {note.text}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {note.priority === 'high' && !note.done && (
                    <span className="font-heading text-[8px] uppercase tracking-widest text-brand-red border border-brand-red/30 px-1">High</span>
                  )}
                  <span className="font-body text-[10px] text-white/20">{fmtDate(note.createdAt)}</span>
                </div>
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => deleteNote(note.id)}
                aria-label="Delete note"
                className="mt-0.5 flex-shrink-0 text-white/0 group-hover:text-white/20 hover:!text-red-400/60 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
