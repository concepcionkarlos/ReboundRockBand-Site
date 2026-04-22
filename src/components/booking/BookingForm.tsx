'use client'

import { useState } from 'react'
import Link from 'next/link'
import { translations, type Lang } from '@/lib/i18n'

const eventTypes = [
  'Bar / Nightclub',
  'Private Party',
  'Corporate Event',
  'Festival / Outdoor',
  'Wedding Reception',
  'Restaurant Show',
  'Holiday Party',
  'Other',
]

const budgetRanges = [
  'Under $500',
  '$500–$1,000',
  '$1,000–$2,500',
  '$2,500–$5,000',
  '$5,000+',
  'Not sure yet',
]

const guestCounts = [
  'Under 50',
  '50–100',
  '100–250',
  '250–500',
  '500+',
  'Private (not applicable)',
]

const inputClass =
  'w-full bg-brand-elevated border border-brand-border text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.08)] transition-all placeholder:text-brand-muted/40 rounded-none'

const emptyForm = {
  fullName: '',
  venueOrCompany: '',
  email: '',
  phone: '',
  eventDate: '',
  city: '',
  eventType: '',
  budgetRange: '',
  guestCount: '',
  message: '',
}

interface Props {
  contactEmail: string
  lang?: Lang
}

export default function BookingForm({ contactEmail, lang = 'en' }: Props) {
  const tr = translations[lang].bookingForm
  const [form, setForm] = useState(emptyForm)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.fullName.trim()) next.fullName = tr.errorRequired
    if (!form.email.trim()) next.email = tr.errorRequired
    if (!form.eventDate.trim()) next.eventDate = tr.errorRequired
    if (!form.eventType.trim()) next.eventType = tr.errorRequired
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitStatus('submitting')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setSubmitStatus('error')
      } else {
        setSubmitStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setSubmitStatus('error')
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
        <div className="w-14 h-14 border border-green-400/40 flex items-center justify-center">
          <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h2 className="font-display uppercase text-4xl text-white leading-none mb-3">
            {tr.successHeading} <span className="text-brand-red">{tr.successHeadingAccent}</span>
          </h2>
          <p className="font-body text-brand-muted text-sm max-w-sm leading-relaxed mx-auto">
            {tr.successSub}
          </p>
        </div>
        <Link
          href="/"
          className="font-heading text-xs uppercase tracking-widest border border-white/20 text-white/60 px-5 py-2.5 hover:border-brand-red hover:text-brand-red transition-all"
        >
          {tr.backHome}
        </Link>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">
            {tr.name} <span className="text-brand-red">*</span>
          </label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            className={`${inputClass} ${errors.fullName ? 'border-brand-red/60' : ''}`}
            placeholder={tr.namePlaceholder}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">{tr.phone}</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            className={inputClass}
            placeholder="(305) 000-0000"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">
            {tr.eventDate} <span className="text-brand-red">*</span>
          </label>
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => set('eventDate', e.target.value)}
            className={`${inputClass} ${errors.eventDate ? 'border-brand-red/60' : ''}`}
          />
          {errors.eventDate && <span className="font-body text-[11px] text-brand-red">{errors.eventDate}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">{tr.venueCompany}</label>
          <input
            type="text"
            value={form.venueOrCompany}
            onChange={(e) => set('venueOrCompany', e.target.value)}
            className={inputClass}
            placeholder={tr.venueCompanyPlaceholder}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">{tr.city}</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            className={inputClass}
            placeholder={tr.cityPlaceholder}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">
          {tr.eventType} <span className="text-brand-red">*</span>
        </label>
        <select
          value={form.eventType}
          onChange={(e) => set('eventType', e.target.value)}
          className={`${inputClass} ${errors.eventType ? 'border-brand-red/60' : ''}`}
        >
          <option value="">{tr.eventTypePlaceholder}</option>
          {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.eventType && <span className="font-body text-[11px] text-brand-red">{errors.eventType}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">{tr.budget}</label>
          <select
            value={form.budgetRange}
            onChange={(e) => set('budgetRange', e.target.value)}
            className={inputClass}
          >
            <option value="">{tr.budgetPlaceholder}</option>
            {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">{tr.guests}</label>
          <select
            value={form.guestCount}
            onChange={(e) => set('guestCount', e.target.value)}
            className={inputClass}
          >
            <option value="">{tr.guestsPlaceholder}</option>
            {guestCounts.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">{tr.message}</label>
        <textarea
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder={tr.messagePlaceholder}
        />
      </div>

      {submitStatus === 'error' && (
        <p className="font-body text-sm text-brand-red border border-brand-red/30 px-4 py-3 bg-brand-red/5">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={submitStatus === 'submitting'}
        className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-all btn-glow-red mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitStatus === 'submitting' ? tr.submitting : tr.submit}
      </button>
      <p className="font-body text-xs text-brand-muted/60 text-center">
        {tr.responseTime}{' '}
        <a href={`mailto:${contactEmail}`} className="text-white/40 hover:text-brand-red transition-colors">
          {contactEmail}
        </a>
      </p>
    </form>
  )
}
