'use client'

import { useState } from 'react'

const inputClass =
  'w-full bg-brand-elevated border border-brand-border text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.08)] transition-all placeholder:text-brand-muted/40 rounded-none'

const emptyForm = {
  fullName: '',
  email: '',
  eventDate: '',
  song1: '',
  song2: '',
  song3: '',
  notes: '',
}

export default function SongRequestForm() {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.fullName.trim()) next.fullName = 'Required'
    if (!form.email.trim()) next.email = 'Required'
    if (!form.song1.trim()) next.song1 = 'At least one song is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/song-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-5 text-center">
        <div className="w-12 h-12 border border-green-400/40 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p className="font-display uppercase text-2xl text-white leading-none mb-2">
            Request <span className="text-brand-red">Sent</span>
          </p>
          <p className="font-body text-brand-muted text-sm max-w-xs mx-auto leading-relaxed">
            The band will review your song request. Thanks for reaching out!
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">
            Full Name <span className="text-brand-red">*</span>
          </label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            className={`${inputClass} ${errors.fullName ? 'border-brand-red/60' : ''}`}
            placeholder="Your name"
          />
          {errors.fullName && <span className="font-body text-[11px] text-brand-red">{errors.fullName}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">
            Email <span className="text-brand-red">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className={`${inputClass} ${errors.email ? 'border-brand-red/60' : ''}`}
            placeholder="your@email.com"
          />
          {errors.email && <span className="font-body text-[11px] text-brand-red">{errors.email}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">
          Event Date <span className="text-brand-muted/40">(optional — if requesting for a specific event)</span>
        </label>
        <input
          type="date"
          value={form.eventDate}
          onChange={(e) => set('eventDate', e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">
          Song Request 1 <span className="text-brand-red">*</span>
        </label>
        <input
          type="text"
          value={form.song1}
          onChange={(e) => set('song1', e.target.value)}
          className={`${inputClass} ${errors.song1 ? 'border-brand-red/60' : ''}`}
          placeholder="Song title — Artist"
        />
        {errors.song1 && <span className="font-body text-[11px] text-brand-red">{errors.song1}</span>}
        <input
          type="text"
          value={form.song2}
          onChange={(e) => set('song2', e.target.value)}
          className={inputClass}
          placeholder="Song Request 2 (optional) — Song title — Artist"
        />
        <input
          type="text"
          value={form.song3}
          onChange={(e) => set('song3', e.target.value)}
          className={inputClass}
          placeholder="Song Request 3 (optional) — Song title — Artist"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Any context about the request — event type, special occasion, etc."
        />
      </div>

      {status === 'error' && (
        <p className="font-body text-sm text-brand-red border border-brand-red/30 px-4 py-3 bg-brand-red/5">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="self-start font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-all btn-glow-red disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Sending…' : 'Submit Request'}
      </button>
      <p className="font-body text-xs text-brand-muted/50">
        Requests are welcomed but not guaranteed.
      </p>
    </form>
  )
}
