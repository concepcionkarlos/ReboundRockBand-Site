'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-brand-red/[0.06] blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-texture opacity-30 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        <div className="inline-flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-8">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
          Something went wrong
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-brand-red/70" />
        </div>

        <h1
          className="font-display uppercase text-white leading-none mb-2"
          style={{ fontSize: 'clamp(4rem, 16vw, 10rem)', textShadow: '0 0 80px rgba(224,16,30,0.15)' }}
        >
          Aw, <span className="text-brand-red" style={{ textShadow: '0 0 60px rgba(224,16,30,0.5)' }}>snap.</span>
        </h1>

        <p className="font-display uppercase text-2xl sm:text-3xl text-white/70 leading-tight mb-3">
          The show hit a snag.
        </p>
        <p className="font-body text-brand-text text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          Something unexpected went wrong on our end. Try again or head back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <button
            type="button"
            onClick={reset}
            className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-all btn-glow-red"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="font-heading text-sm uppercase tracking-widest border border-white/20 text-white/80 px-8 py-4 hover:border-brand-red hover:text-brand-red transition-all"
          >
            Back Home
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
          {[
            { href: '/shows', label: 'Shows' },
            { href: '/about', label: 'About' },
            { href: '/booking', label: 'Book Us' },
            { href: '/epk', label: 'Press Kit' },
          ].map(({ href, label }) => (
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
