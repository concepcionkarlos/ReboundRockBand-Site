'use client'

import { useState, useEffect } from 'react'
import type { EmailTemplate } from '@/lib/data'
import { extractTemplateVars } from '@/lib/templateUtils'

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

const SLUG_LABELS: Record<string, string> = {
  'booking-auto-reply': 'Auto-Reply',
  'venue-first-outreach': 'First Outreach',
  'venue-follow-up': 'Follow-Up',
  'venue-thanks-booked': 'Thanks / Booked',
}

export default function AdminEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selected, setSelected] = useState<EmailTemplate | null>(null)
  const [form, setForm] = useState({ name: '', subject: '', bodyHtml: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/email-templates')
      .then((r) => r.json())
      .then((d) => {
        if (d.templates) {
          setTemplates(d.templates)
          if (d.templates.length > 0) select(d.templates[0])
        }
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function select(t: EmailTemplate) {
    setSelected(t)
    setForm({ name: t.name, subject: t.subject, bodyHtml: t.bodyHtml })
    setSaved(false)
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/email-templates/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.template) {
        const updated = templates.map((t) => (t.id === selected.id ? data.template : t))
        setTemplates(updated)
        setSelected(data.template)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } finally {
      setSaving(false)
    }
  }

  const vars = form.bodyHtml ? extractTemplateVars(form.subject + ' ' + form.bodyHtml) : []

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="border-l-2 border-brand-red pl-4 mb-8">
        <h1 className="font-display uppercase text-4xl text-white leading-none">Email Templates</h1>
        <p className="font-body text-xs text-white/30 mt-1.5">
          Edit the templates used for booking auto-replies and venue outreach
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Template list */}
        <div className="flex flex-col gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => select(t)}
              className={`text-left p-4 border transition-all ${
                selected?.id === t.id
                  ? 'border-brand-red/50 bg-brand-red/[0.06]'
                  : 'border-white/6 bg-[#0d0d1e] hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-heading text-[9px] uppercase tracking-widest text-brand-red border border-brand-red/30 bg-brand-red/10 px-1.5 py-0.5">
                  {SLUG_LABELS[t.slug] ?? t.slug}
                </span>
                {t.isSystem && (
                  <span className="font-heading text-[9px] uppercase tracking-widest text-white/25 border border-white/10 px-1.5 py-0.5">
                    System
                  </span>
                )}
              </div>
              <p className="font-heading text-xs text-white uppercase tracking-wide truncate">{t.name}</p>
              <p className="font-body text-xs text-white/35 truncate mt-0.5">{t.subject}</p>
            </button>
          ))}
        </div>

        {/* Editor */}
        {selected ? (
          <div className="border border-white/8 bg-[#0d0d1e]">
            <div className="flex items-center justify-between gap-3 px-6 py-3.5 border-b border-white/6">
              <h2 className="font-heading text-xs uppercase tracking-widest text-white/60">
                Editing: <span className="text-white">{selected.name}</span>
              </h2>
              <div className="flex items-center gap-3">
                {saved && (
                  <span className="font-heading text-[10px] text-green-400 uppercase tracking-widest flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="font-heading text-[10px] uppercase tracking-widest bg-brand-red text-white px-4 py-1.5 hover:bg-brand-red-bright transition-all disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* Template Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">
                  Template Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className={inputClass}
                  placeholder="Subject supports {{variables}}"
                />
              </div>

              {/* Variable hints */}
              {vars.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="font-heading text-[9px] uppercase tracking-widest text-white/25">
                    Variables disponibles
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {vars.map((v) => (
                      <code
                        key={v}
                        className="font-mono text-[10px] bg-white/5 border border-white/10 text-brand-red/80 px-1.5 py-0.5"
                      >
                        {`{{${v}}}`}
                      </code>
                    ))}
                  </div>
                  <p className="font-body text-xs text-white/20">
                    These variables are automatically replaced when the email is sent.
                  </p>
                </div>
              )}

              {/* Preview */}
              <div className="flex flex-col gap-1.5">
                <p className="font-heading text-[9px] uppercase tracking-widest text-white/25">
                  Vista previa del correo
                </p>
                <iframe
                  srcDoc={form.bodyHtml.replace(/\{\{(\w+)\}\}/g, (_: string, k: string) => `[${k}]`)}
                  className="w-full h-[520px] border border-white/8"
                  sandbox="allow-same-origin"
                  title="Email preview"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-white/6 flex items-center justify-center py-16">
            <p className="font-heading text-white/20 text-xs tracking-widest uppercase">
              Select a template to edit
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
