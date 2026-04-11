import Image from 'next/image'
import Link from 'next/link'
import { siteContent } from '@/lib/data'

const stats = [
  { value: '5', label: 'Live Members' },
  { value: '4', label: 'Decades of Hits' },
  { value: '100+', label: 'Shows Played' },
  { value: 'S. FL', label: 'Based In' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-bg">
      {/* Atmospheric glow — red only, no blue */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-red/5 blur-[130px]" />
        <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-brand-red/15 to-transparent" />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 bg-grid-texture pointer-events-none opacity-50" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 lg:px-10 pt-28 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

          {/* ── Text block ── */}
          <div className="flex-1 text-center lg:text-left min-w-0 order-2 lg:order-1">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-6">
              <span className="w-8 h-px bg-brand-red/60" />
              South Florida&apos;s Live Rock Experience
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse-slow" />
            </div>

            {/* Band name */}
            <div className="font-display uppercase leading-none text-white mb-2 text-5xl sm:text-6xl lg:text-7xl tracking-tight">
              Rebound Rock Band
            </div>

            {/* Headline */}
            <h1
              className="font-display uppercase leading-none mb-6 text-4xl sm:text-5xl lg:text-6xl tracking-tight text-brand-red"
            >
              {siteContent.heroHeadline}
            </h1>

            <p className="font-body text-base sm:text-lg text-gray-300/90 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {siteContent.heroSubheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/booking"
                className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-all btn-glow-red text-center"
              >
                Book Rebound Rock Band
              </Link>
              <Link
                href="/shows"
                className="font-heading text-sm uppercase tracking-widest border border-white/25 text-white px-8 py-4 hover:border-brand-red hover:text-brand-red transition-all text-center"
              >
                Upcoming Shows
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-brand-border/60 grid grid-cols-4 gap-4 max-w-xs mx-auto lg:mx-0">
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-left group">
                  <div
                    className="font-display text-3xl lg:text-4xl text-white leading-none group-hover:text-brand-red transition-colors duration-300"
                  >
                    {s.value}
                  </div>
                  <div className="font-body text-[9px] sm:text-[10px] text-brand-muted uppercase tracking-widest mt-1 leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Mascot logo ── */}
          <div className="order-1 lg:order-2 flex-shrink-0">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-[360px] lg:h-[360px]">
              {/* Layered red glow behind mascot */}
              <div className="absolute inset-[-24px] rounded-full bg-brand-red/8 blur-3xl" aria-hidden="true" />
              <div className="absolute inset-[-8px] rounded-full bg-brand-red/5 blur-xl" aria-hidden="true" />
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
        className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-brand-bg to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-brand-muted/60 animate-bounce-slow">
        <span className="font-body text-[9px] tracking-[0.2em] uppercase">Scroll</span>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
