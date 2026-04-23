'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { translations, type Lang } from '@/lib/i18n'

function getLangFromCookie(): Lang {
  if (typeof document === 'undefined') return 'en'
  return document.cookie.split(';').some((c) => c.trim() === 'lang=es') ? 'es' : 'en'
}

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    console.error(error)
    setLang(getLangFromCookie())
  }, [error])

  const tr = translations[lang].error

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-brand-red/[0.06] blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-texture opacity-30 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        <div className="inline-flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-8">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
          {tr.eyebrow}
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-brand-red/70" />
        </div>

        <h1
          className="font-display uppercase text-white leading-none mb-2"
          style={{ fontSize: 'clamp(4rem, 16vw, 10rem)', textShadow: '0 0 80px rgba(224,16,30,0.15)' }}
        >
          {tr.heading} <span className="text-brand-red" style={{ textShadow: '0 0 60px rgba(224,16,30,0.5)' }}>{tr.headingAccent}</span>
        </h1>

        <p className="font-display uppercase text-2xl sm:text-3xl text-white/70 leading-tight mb-3">
          {tr.tagline}
        </p>
        <p className="font-body text-brand-text text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          {tr.body}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <button
            type="button"
            onClick={reset}
            className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-all btn-glow-red"
          >
            {tr.tryAgain}
          </button>
          <Link
            href="/"
            className="font-heading text-sm uppercase tracking-widest border border-white/20 text-white/80 px-8 py-4 hover:border-brand-red hover:text-brand-red transition-all"
          >
            {tr.backHome}
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
          {tr.links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-heading text-[10px] uppercase tracking-widest text-brand-muted/50 hover:text-brand-red transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
