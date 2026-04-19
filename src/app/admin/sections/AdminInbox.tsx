'use client'

import { useState, useEffect } from 'react'
import type { InboundEmail } from '@/lib/data'

type Filter = 'all' | 'unread' | 'booking' | 'song-request' | 'venue' | 'general'

interface Props {
  onNavigate: (section: string) => void
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function fmtShort(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  if (isToday) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const ENTITY_STYLES: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  booking:        { label: 'Booking',      bg: 'bg-blue-400/10',   text: 'text-blue-400',   dot: 'bg-blue-400' },
  'song-request': { label: 'Song Request', bg: 'bg-purple-400/10', text: 'text-purple-400', dot: 'bg-purple-400' },
  venue:          { label: 'Venue',        bg: 'bg-yellow-400/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  general:        { label: 'General',      bg: 'bg-white/5',       text: 'text-white/40',   dot: 'bg-white/30' },
}

const SECTION_MAP: Record<string, string> = {
  booking: 'bookings',
  'song-request': 'song-requests',
  venue: 'venues',
}

export default function AdminInbox({ onNavigate }: Props) {
  const [emails, setEmails] = useState<InboundEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<InboundEmail | null>(null)
  const [showHtml, setShowHtml] = useState(false)

  useEffect(() => {
    fetch('/api/inbound-emails')
      .then((r) => r.json())
      .then((d) => setEmails(d.emails ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const markRead = async (email: InboundEmail) => {
    if (email.read) return
    await fetch(`/api/inbound-emails/${email.id}`, { method: 'PATCH' }).catch(() => {})
    setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, read: true } : e))
    setSelected((prev) => prev?.id === email.id ? { ...prev, read: true } : prev)
  }

  const openEmail = (email: InboundEmail) => {
    setSelected(email)
    setShowHtml(!!email.bodyHtml)
    markRead(email)
  }

  const filtered = emails.filter((e) => {
    if (filter === 'unread') return !e.read
    if (filter === 'general') return !e.entityType
    if (filter === 'all') return true
    return e.entityType === filter
  })

  const unreadCount = emails.filter((e) => !e.read).length

  const counts: Record<Filter, number> = {
    all: emails.length,
    unread: unreadCount,
    booking: emails.filter((e) => e.entityType === 'booking').length,
    'song-request': emails.filter((e) => e.entityType === 'song-request').length,
    venue: emails.filter((e) => e.entityType === 'venue').length,
    general: emails.filter((e) => !e.entityType).length,
  }

  const filterItems: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'unread', label: 'Sin leer' },
    { id: 'booking', label: 'Bookings' },
    { id: 'song-request', label: 'Song Requests' },
    { id: 'venue', label: 'Venues' },
    { id: 'general', label: 'General' },
  ]

  return (
    <div className="max-w-full">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="border-l-2 border-brand-red pl-4">
          <h1 className="font-display uppercase text-4xl text-white leading-none">Inbox</h1>
          <p className="font-body text-sm text-white/40 mt-1.5">Correos recibidos de clientes, fans y venues</p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 border border-blue-400/30 bg-blue-400/8 px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-heading text-xs uppercase tracking-widest text-blue-400">
              {unreadCount} sin leer
            </span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 mb-6 flex-wrap">
        {filterItems.map((f) => (
          <button
            key={f.id}
            onClick={() => { setFilter(f.id); setSelected(null) }}
            className={`font-heading text-xs uppercase tracking-widest px-4 py-2 border transition-all flex items-center gap-2 ${
              filter === f.id
                ? 'border-brand-red bg-brand-red/8 text-white'
                : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70'
            }`}
          >
            {f.label}
            {counts[f.id] > 0 && (
              <span className={`font-body text-xs px-1.5 py-0.5 rounded-sm tabular-nums ${
                filter === f.id ? 'bg-white/15 text-white' : 'bg-white/8 text-white/35'
              }`}>
                {counts[f.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="font-body text-base text-white/30 py-16 text-center">Cargando…</div>
      ) : filtered.length === 0 ? (
        <div className="border border-white/8 p-16 text-center bg-[#0d0d1e]">
          <svg className="w-10 h-10 text-white/15 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
          </svg>
          <p className="font-body text-base text-white/30">
            {filter === 'all' ? 'No hay correos recibidos todavía.' : 'No hay correos en esta categoría.'}
          </p>
        </div>
      ) : (
        <div className="flex min-h-[500px] border border-white/8">

          {/* ── Email list ── */}
          <div className={`flex flex-col divide-y divide-white/6 ${selected ? 'hidden lg:flex lg:w-[360px] xl:w-[420px] flex-shrink-0 border-r border-white/8' : 'w-full'}`}>
            {filtered.map((email) => {
              const entityKey = email.entityType ?? 'general'
              const style = ENTITY_STYLES[entityKey]
              const isSelected = selected?.id === email.id
              return (
                <button
                  key={email.id}
                  onClick={() => isSelected ? setSelected(null) : openEmail(email)}
                  className={`w-full text-left px-5 py-5 transition-all ${
                    isSelected
                      ? 'bg-brand-red/8 border-l-2 border-l-brand-red'
                      : email.read
                        ? 'bg-[#0d0d1e] hover:bg-white/[0.03] border-l-2 border-l-transparent'
                        : 'bg-[#0d0d1e] hover:bg-white/[0.03] border-l-2 border-l-blue-400'
                  }`}
                >
                  {/* Top row: sender name + date */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {!email.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`font-body text-base leading-tight truncate ${email.read ? 'text-white/55 font-normal' : 'text-white font-semibold'}`}>
                        {email.fromName || email.fromEmail}
                      </span>
                    </div>
                    <span className="font-body text-xs text-white/35 flex-shrink-0 mt-0.5">
                      {fmtShort(email.receivedAt)}
                    </span>
                  </div>

                  {/* Email address (always visible) */}
                  <p className="font-body text-xs text-white/35 mb-2 truncate ml-4.5">
                    {email.fromEmail}
                  </p>

                  {/* Subject */}
                  <p className={`font-body text-sm truncate mb-3 ${email.read ? 'text-white/40' : 'text-white/75'}`}>
                    {email.subject}
                  </p>

                  {/* Preview */}
                  {email.bodyText && (
                    <p className="font-body text-xs text-white/30 line-clamp-2 leading-relaxed mb-3">
                      {email.bodyText.slice(0, 120)}
                    </p>
                  )}

                  {/* Entity badge + link */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-heading text-[10px] uppercase tracking-widest px-2 py-1 ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                    {email.entityType && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onNavigate(SECTION_MAP[email.entityType!]) }}
                        className="font-heading text-[10px] uppercase tracking-widest text-white/30 hover:text-brand-red transition-colors"
                      >
                        Ver detalle →
                      </button>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* ── Detail pane ── */}
          {selected ? (
            <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d1e]">

              {/* Detail header */}
              <div className="px-7 py-6 border-b border-white/8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-body text-xl text-white font-semibold leading-snug mb-1">
                      {selected.subject}
                    </h2>
                    <p className="font-body text-sm text-white/40">{fmtDate(selected.receivedAt)}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-white/30 hover:text-white transition-colors flex-shrink-0 mt-1"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Sender card */}
                <div className="bg-white/[0.04] border border-white/8 px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-heading text-[10px] uppercase tracking-widest text-white/30 mb-1">De</p>
                    <p className="font-body text-base text-white font-medium">
                      {selected.fromName || selected.fromEmail}
                    </p>
                    {selected.fromName && (
                      <p className="font-body text-sm text-white/45 mt-0.5">{selected.fromEmail}</p>
                    )}
                  </div>
                  {selected.entityType && (
                    <div className="flex flex-col items-end gap-2">
                      <span className={`font-heading text-[10px] uppercase tracking-widest px-2.5 py-1 ${ENTITY_STYLES[selected.entityType].bg} ${ENTITY_STYLES[selected.entityType].text}`}>
                        {ENTITY_STYLES[selected.entityType].label}
                      </span>
                      <button
                        onClick={() => onNavigate(SECTION_MAP[selected.entityType!])}
                        className="font-heading text-[10px] uppercase tracking-widest text-white/30 hover:text-brand-red transition-colors"
                      >
                        Ir al detalle →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col">
                {selected.bodyHtml && selected.bodyText && (
                  <div className="flex gap-2 px-7 pt-5">
                    <button
                      onClick={() => setShowHtml(true)}
                      className={`font-heading text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${showHtml ? 'border-white/20 text-white' : 'border-white/8 text-white/30 hover:text-white/60'}`}
                    >
                      Vista HTML
                    </button>
                    <button
                      onClick={() => setShowHtml(false)}
                      className={`font-heading text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${!showHtml ? 'border-white/20 text-white' : 'border-white/8 text-white/30 hover:text-white/60'}`}
                    >
                      Texto plano
                    </button>
                  </div>
                )}
                <div className="px-7 py-5 overflow-auto flex-1">
                  {showHtml && selected.bodyHtml ? (
                    <iframe
                      srcDoc={selected.bodyHtml}
                      className="w-full h-96 border border-white/8"
                      sandbox="allow-same-origin"
                      title="Email body"
                    />
                  ) : (
                    <pre className="font-body text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                      {selected.bodyText || selected.bodyHtml?.replace(/<[^>]+>/g, '') || '(vacío)'}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden lg:flex items-center justify-center bg-[#0d0d1e]">
              <p className="font-body text-base text-white/20">Selecciona un correo para leerlo</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
