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

function entityLabel(entityType?: string) {
  if (entityType === 'booking') return { label: 'Booking', color: 'text-blue-400 border-blue-400/30' }
  if (entityType === 'song-request') return { label: 'Song Request', color: 'text-purple-400 border-purple-400/30' }
  if (entityType === 'venue') return { label: 'Venue', color: 'text-yellow-400 border-yellow-400/30' }
  return { label: 'General', color: 'text-white/40 border-white/20' }
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
  const counts = {
    all: emails.length,
    unread: unreadCount,
    booking: emails.filter((e) => e.entityType === 'booking').length,
    'song-request': emails.filter((e) => e.entityType === 'song-request').length,
    venue: emails.filter((e) => e.entityType === 'venue').length,
    general: emails.filter((e) => !e.entityType).length,
  }

  const filterItems: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'booking', label: 'Bookings' },
    { id: 'song-request', label: 'Song Requests' },
    { id: 'venue', label: 'Venues' },
    { id: 'general', label: 'General' },
  ]

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="border-l-2 border-brand-red pl-4">
          <h1 className="font-display uppercase text-4xl text-white leading-none">Inbox</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">
            Replies received from clients, fans, and venues
          </p>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 border border-blue-400/30 bg-blue-400/5 px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-heading text-[10px] uppercase tracking-widest text-blue-400">
                {unreadCount} unread
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Setup notice */}
      <div className="border border-yellow-400/20 bg-yellow-400/5 px-5 py-4 mb-6 flex items-start gap-3">
        <svg className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <div>
          <p className="font-heading text-[10px] uppercase tracking-widest text-yellow-400 mb-1">Inbound Email Setup Required</p>
          <p className="font-body text-xs text-white/50 leading-relaxed">
            To receive replies here, configure an inbound route in your{' '}
            <span className="text-white/70">Resend dashboard</span> pointing to{' '}
            <code className="text-yellow-400/80 font-mono text-[11px]">
              https://reboundrockband.com/api/inbound-email
            </code>
            {' '}and add MX records for{' '}
            <code className="text-yellow-400/80 font-mono text-[11px]">reboundrockband.com</code>.
            When you send emails from the admin, replies will automatically be linked to the right booking, song request, or venue.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="font-heading text-[10px] uppercase tracking-widest text-white/30">Filter:</span>
        {filterItems.map((f) => (
          <button
            key={f.id}
            onClick={() => { setFilter(f.id); setSelected(null) }}
            className={`font-heading text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
              filter === f.id
                ? 'border-brand-red text-brand-red'
                : 'border-white/10 text-white/30 hover:border-white/25 hover:text-white/60'
            }`}
          >
            {f.label}
            {counts[f.id] > 0 && (
              <span className="font-body text-[9px] bg-white/10 text-white/40 px-1 py-0.5 rounded-sm">
                {counts[f.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="font-body text-sm text-white/30 py-12 text-center">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="border border-white/6 p-12 text-center">
          <div className="mx-auto mb-3 w-10 h-10 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
            </svg>
          </div>
          <p className="font-body text-sm text-white/30">
            {filter === 'all' ? 'No emails received yet.' : `No ${filter} emails.`}
          </p>
        </div>
      ) : (
        <div className="flex gap-0 min-h-[400px]">
          {/* Email list */}
          <div className={`flex flex-col gap-px ${selected ? 'hidden lg:flex lg:w-80 xl:w-96 flex-shrink-0' : 'w-full'}`}>
            {filtered.map((email) => {
              const tag = entityLabel(email.entityType)
              return (
                <button
                  key={email.id}
                  onClick={() => selected?.id === email.id ? setSelected(null) : openEmail(email)}
                  className={`w-full text-left px-4 py-4 border transition-all group ${
                    selected?.id === email.id
                      ? 'border-brand-red/50 bg-brand-red/5'
                      : email.read
                        ? 'border-white/5 bg-[#0d0d1e] hover:border-white/12'
                        : 'border-white/10 bg-[#0d0d1e] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {!email.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1" />
                      )}
                      <span className={`font-body text-sm truncate ${email.read ? 'text-white/60' : 'text-white font-medium'}`}>
                        {email.fromName || email.fromEmail}
                      </span>
                    </div>
                    <span className="font-body text-[10px] text-white/25 flex-shrink-0">
                      {new Date(email.receivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className={`font-body text-xs truncate mb-2 ${email.read ? 'text-white/40' : 'text-white/70'}`}>
                    {email.subject}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`font-heading text-[9px] uppercase tracking-widest border px-1.5 py-0.5 ${tag.color}`}>
                      {tag.label}
                    </span>
                    {email.entityType && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const sectionMap: Record<string, string> = {
                            booking: 'bookings',
                            'song-request': 'song-requests',
                            venue: 'venues',
                          }
                          onNavigate(sectionMap[email.entityType!])
                        }}
                        className="font-heading text-[9px] uppercase tracking-widest text-white/25 hover:text-brand-red transition-colors"
                      >
                        View →
                      </button>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detail pane */}
          {selected && (
            <div className="flex-1 border border-white/8 bg-[#0d0d1e] min-w-0 lg:border-l-0">
              <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/8">
                <div className="min-w-0">
                  <h2 className="font-body text-base text-white font-medium leading-tight truncate mb-1">
                    {selected.subject}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-body text-xs text-white/50">
                      From: <span className="text-white/70">{selected.fromName ? `${selected.fromName} <${selected.fromEmail}>` : selected.fromEmail}</span>
                    </span>
                    <span className="font-body text-xs text-white/30">{fmtDate(selected.receivedAt)}</span>
                  </div>
                  {selected.entityType && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`font-heading text-[9px] uppercase tracking-widest border px-1.5 py-0.5 ${entityLabel(selected.entityType).color}`}>
                        {entityLabel(selected.entityType).label}
                      </span>
                      <button
                        onClick={() => {
                          const sectionMap: Record<string, string> = {
                            booking: 'bookings',
                            'song-request': 'song-requests',
                            venue: 'venues',
                          }
                          onNavigate(sectionMap[selected.entityType!])
                        }}
                        className="font-heading text-[9px] uppercase tracking-widest text-white/30 hover:text-brand-red transition-colors"
                      >
                        Go to {entityLabel(selected.entityType).label} →
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {selected.bodyHtml && selected.bodyText && (
                    <button
                      onClick={() => setShowHtml((p) => !p)}
                      className="font-heading text-[9px] uppercase tracking-widest border border-white/10 text-white/30 hover:text-white px-2 py-1 transition-colors"
                    >
                      {showHtml ? 'Plain Text' : 'HTML'}
                    </button>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className="font-heading text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-6 py-5 overflow-auto max-h-[600px]">
                {showHtml && selected.bodyHtml ? (
                  <iframe
                    srcDoc={selected.bodyHtml}
                    className="w-full h-96 border border-white/6"
                    sandbox="allow-same-origin"
                    title="Email body"
                  />
                ) : (
                  <pre className="font-body text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                    {selected.bodyText || selected.bodyHtml?.replace(/<[^>]+>/g, '') || '(empty)'}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
