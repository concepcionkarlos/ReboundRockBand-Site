'use client'

import { useState } from 'react'
import AdminInbox from './AdminInbox'
import AdminEmailTemplates from './AdminEmailTemplates'

type Tab = 'inbox' | 'templates'

interface Props {
  onNavigate: (section: string) => void
  inboxUnread?: number
}

export default function AdminEmailManagement({ onNavigate, inboxUnread = 0 }: Props) {
  const [tab, setTab] = useState<Tab>('inbox')

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'inbox', label: 'Inbox', badge: inboxUnread },
    { id: 'templates', label: 'Templates' },
  ]

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="border-l-2 border-brand-red pl-4 mb-8">
        <h1 className="font-display uppercase text-4xl text-white leading-none">Email Management</h1>
        <p className="font-body text-xs text-white/30 mt-1.5">Inbox and email templates</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-8 border-b border-white/8">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`font-heading text-xs uppercase tracking-widest px-5 py-3 border-b-2 transition-colors -mb-px flex items-center gap-2 ${
              tab === t.id
                ? 'border-brand-red text-white'
                : 'border-transparent text-white/30 hover:text-white/60'
            }`}
          >
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span className="font-body text-[10px] px-1.5 py-0.5 rounded-sm tabular-nums bg-blue-400/20 text-blue-400">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'inbox' && <AdminInbox onNavigate={onNavigate} />}
      {tab === 'templates' && <AdminEmailTemplates />}
    </div>
  )
}
