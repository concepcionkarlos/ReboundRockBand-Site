'use client'

import { useState } from 'react'
import AdminInbox from './AdminInbox'
import AdminEmailTemplates from './AdminEmailTemplates'

type Tab = 'inbox' | 'templates' | 'setup'

interface Props {
  onNavigate: (section: string) => void
  inboxUnread?: number
}

export default function AdminEmailManagement({ onNavigate, inboxUnread = 0 }: Props) {
  const [tab, setTab] = useState<Tab>('inbox')

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'inbox', label: 'Inbox', badge: inboxUnread },
    { id: 'templates', label: 'Templates' },
    { id: 'setup', label: 'Setup' },
  ]

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="border-l-2 border-brand-red pl-4 mb-8">
        <h1 className="font-display uppercase text-4xl text-white leading-none">Email Management</h1>
        <p className="font-body text-xs text-white/30 mt-1.5">Inbox, templates y configuración de correos</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-8 border-b border-white/8">
        {tabs.map((t) => (
          <button
            key={t.id}
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
      {tab === 'setup' && <EmailSetup />}
    </div>
  )
}

function EmailSetup() {
  const [secret, setSecret] = useState('')
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://reboundrockband.com'
  const baseUrl = `${origin}/api/inbound-email`
  const webhookUrl = secret ? `${baseUrl}?secret=${encodeURIComponent(secret)}` : baseUrl

  return (
    <div className="max-w-2xl flex flex-col gap-8">

      {/* Webhook config */}
      <div className="border border-white/8 bg-[#0d0d1e]">
        <div className="px-6 py-4 border-b border-white/6">
          <h2 className="font-heading text-xs uppercase tracking-widest text-white">Resend Inbound Webhook</h2>
          <p className="font-body text-xs text-white/35 mt-1">
            Configura esta URL en el dashboard de Resend para recibir correos entrantes.
          </p>
        </div>
        <div className="p-6 flex flex-col gap-5">

          {/* Secret input */}
          <div className="flex flex-col gap-2">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">
              RESEND_WEBHOOK_SECRET <span className="text-white/20">(de tus Vercel env vars)</span>
            </label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Pega aquí el valor de RESEND_WEBHOOK_SECRET…"
              className="w-full bg-[#111121] border border-white/8 text-white font-mono text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 transition-all placeholder:text-white/20"
            />
            <p className="font-body text-xs text-white/25">
              Vercel → tu proyecto → Settings → Environment Variables → RESEND_WEBHOOK_SECRET
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">
              Webhook URL {secret ? <span className="text-green-400/70">— con secret incluido</span> : <span className="text-yellow-400/60">— agrega el secret arriba</span>}
            </label>
            <div className="flex items-center gap-2">
              <code className={`flex-1 font-mono text-sm bg-black/30 border px-4 py-3 truncate ${secret ? 'text-green-400 border-green-400/20' : 'text-brand-red border-white/8'}`}>
                {webhookUrl}
              </code>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(webhookUrl)}
                className="font-heading text-[10px] uppercase tracking-widest border border-white/12 text-white/40 px-3 py-3 hover:border-white/25 hover:text-white transition-all flex-shrink-0"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/6 pt-5">
            <p className="font-heading text-[10px] uppercase tracking-widest text-white/35">Pasos en Resend</p>
            <ol className="flex flex-col gap-3">
              {[
                'Ve a resend.com → Domains → tu dominio (reboundrockband.com)',
                'En la sección "Inbound", agrega la URL del webhook — debe incluir ?secret=… al final',
                'Asegúrate de que el dominio esté verificado para recibir emails',
                'Envía un email de prueba a booking@reboundrockband.com y revisa el Inbox',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-heading text-[10px] text-brand-red border border-brand-red/40 w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="font-body text-sm text-white/55 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Email addressing */}
      <div className="border border-white/8 bg-[#0d0d1e]">
        <div className="px-6 py-4 border-b border-white/6">
          <h2 className="font-heading text-xs uppercase tracking-widest text-white">Tagged Addressing</h2>
          <p className="font-body text-xs text-white/35 mt-1">
            Para vincular un correo entrante a un booking, song request o venue usa estas direcciones como Reply-To al enviar.
          </p>
        </div>
        <div className="p-6">
          <div className="border border-white/8 divide-y divide-white/6">
            {[
              { tag: '+bk-{id}', type: 'Booking', example: 'noreply+bk-abc123@reboundrockband.com' },
              { tag: '+sr-{id}', type: 'Song Request', example: 'noreply+sr-abc123@reboundrockband.com' },
              { tag: '+ve-{id}', type: 'Venue', example: 'noreply+ve-abc123@reboundrockband.com' },
            ].map((row) => (
              <div key={row.tag} className="grid grid-cols-[80px_110px_1fr] gap-4 px-5 py-3 items-center">
                <code className="font-mono text-[11px] text-brand-red">{row.tag}</code>
                <span className="font-heading text-[10px] uppercase tracking-widest text-white/40">{row.type}</span>
                <span className="font-body text-xs text-white/30 truncate">{row.example}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
