'use client'

import { useState } from 'react'
import { translations, type Lang } from '@/lib/i18n'

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

export default function SongRequestForm({ lang = 'en' }: { lang?: Lang }) {
  const tr = translations[lang].songRequestForm
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.fullName.trim()) next.fullName = tr.errorRequired
    if (!form.email.trim()) next.email = tr.errorRequired
    else if (!EMAIL_RE.test(form.email.trim())) next.email = tr.errorEmail
    if (!form.song1.trim()) next.song1 = tr.errorSong
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
        setErrorMsg(data.error ?? tr.errorGeneric)
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg(tr.errorNetwork)
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
            {tr.successHeading} <span className="text-brand-red">{tr.successHeadingAccent}</span>
          </p>
          <p className="font-body text-brand-muted text-sm max-w-xs mx-auto leading-relaxed">
            {tr.successSub}
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
            {tr.fullName} <span className="text-brand-red">*</span>
          </label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            className={`${inputClass} ${errors.fullName ? 'border-brand-red/60' : ''}`}
            placeholder={tr.yourName}
          />
          {errors.fullName && <span className="font-body text-[11px] text-brand-red">{errors.fullName}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">
            {tr.email} <span className="text-brand-red">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className={`${inputClass} ${errors.email ? 'border-brand-red/60' : ''}`}
            placeholder={tr.emailPlaceholder}
          />
          {errors.email && <span className="font-body text-[11px] text-brand-red">{errors.email}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">
          {tr.eventDate} <span className="text-brand-muted/40">{tr.eventDateHint}</span>
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
          {tr.song1} <span className="text-brand-red">*</span>
        </label>
        <input
          type="text"
          value={form.song1}
          onChange={(e) => set('song1', e.target.value)}
          className={`${inputClass} ${errors.song1 ? 'border-brand-red/60' : ''}`}
          placeholder={tr.song1Placeholder}
        />
        {errors.song1 && <span className="font-body text-[11px] text-brand-red">{errors.song1}</span>}
        <input
          type="text"
          value={form.song2}
          onChange={(e) => set('song2', e.target.value)}
          className={inputClass}
          placeholder={tr.song2Placeholder}
        />
        <input
          type="text"
          value={form.song3}
          onChange={(e) => set('song3', e.target.value)}
          className={inputClass}
          placeholder={tr.song3Placeholder}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">{tr.notes}</label>
        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder={tr.notesPlaceholder}
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
        {status === 'submitting' ? tr.submitting : tr.submit}
      </button>
      <p className="font-body text-xs text-brand-muted/50">
        {tr.disclaimer}
      </p>
    </form>
  )
}
