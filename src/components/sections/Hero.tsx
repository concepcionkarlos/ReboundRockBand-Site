import Image from 'next/image'
import Link from 'next/link'
import { readContent } from '@/lib/store'

const stats = [
  { value: '5', label: 'Live Members' },
  { value: '4', label: 'Decades of Hits' },
  { value: '100+', label: 'Shows Played' },
  { value: 'S. FL', label: 'Based In' },
]

export default async function Hero() {
  const { siteContent } = await readContent()
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-brand-bg">
      {/* Atmospheric layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Central warm glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-brand-red/[0.06] blur-[160px]" />
        {/* Upper-right secondary glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] rounded-full bg-brand-red/[0.04] blur-[120px]" />
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-px h-48 bg-gradient-to-b from-brand-red/20 to-transparent" />
        <div className="absolute top-0 right-0 w-px h-32 bg-gradient-to-b from-white/5 to-transparent" />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 bg-grid-texture pointer-events-none opacity-60" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 lg:px-10 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-24">

          {/* ── Text block ── */}
          <div className="flex-1 text-center lg:text-left min-w-0 order-2 lg:order-1">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-7">
              <span className="w-10 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
              {siteContent.serviceArea}&apos;s Live Rock Experience
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse-slow" />
            </div>

            {/* Band name */}
            <div className="font-display uppercase leading-[0.9] text-white mb-2 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight">
              Rebound Rock Band
            </div>

            {/* Headline */}
            <h1 className="font-display uppercase leading-[0.9] mb-7 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-brand-red text-glow-red">
              {siteContent.heroHeadline}
            </h1>

            <p className="font-body text-base sm:text-lg text-brand-text max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed">
              {siteContent.heroSubheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/booking"
                className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-9 py-4 hover:bg-brand-red-bright transition-all btn-glow-red text-center"
              >
                {siteContent.ctaPrimaryLabel}
              </Link>
              <Link
                href="/shows"
                className="font-heading text-sm uppercase tracking-widest border border-white/20 text-white/85 px-9 py-4 hover:border-brand-red hover:text-brand-red transition-all text-center"
              >
                Upcoming Shows
              </Link>
            </div>

            {/* Social follow line */}
            {(siteContent.facebook || siteContent.instagram || siteContent.youtube) && (
              <div className="flex items-center justify-center lg:justify-start gap-4 mt-5 flex-wrap">
                <span className="font-body text-[11px] text-brand-muted/50">Follow us:</span>
                {siteContent.facebook && (
                  <a
                    href={siteContent.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-heading text-[10px] uppercase tracking-widest text-brand-muted hover:text-brand-red transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>
                )}
                {siteContent.instagram && (
                  <a
                    href={siteContent.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-heading text-[10px] uppercase tracking-widest text-brand-muted hover:text-brand-red transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    Instagram
                  </a>
                )}
                {siteContent.youtube && (
                  <a
                    href={siteContent.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-heading text-[10px] uppercase tracking-widest text-brand-muted hover:text-brand-red transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube
                  </a>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-brand-border/50 grid grid-cols-4 gap-6 max-w-sm mx-auto lg:mx-0">
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-left group cursor-default">
                  <div className="font-display text-3xl lg:text-4xl text-white leading-none group-hover:text-brand-red transition-colors duration-300">
                    {s.value}
                  </div>
                  <div className="font-body text-[10px] text-brand-muted uppercase tracking-widest mt-1.5 leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Mascot logo ── */}
          <div className="order-1 lg:order-2 flex-shrink-0">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px]">
              {/* Multi-layer glow */}
              <div className="absolute inset-[-40px] rounded-full bg-brand-red/[0.09] blur-[60px]" aria-hidden="true" />
              <div className="absolute inset-[-16px] rounded-full bg-brand-red/[0.07] blur-[30px]" aria-hidden="true" />
              <div className="absolute inset-0 rounded-full bg-brand-red/[0.04] blur-xl" aria-hidden="true" />
              <Image
                src="/logo-improved.png"
                alt="Rebound Rock Band Mascot"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-brand-bg to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-muted/50 animate-bounce-slow">
        <span className="font-body text-[9px] tracking-[0.25em] uppercase">Scroll</span>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
