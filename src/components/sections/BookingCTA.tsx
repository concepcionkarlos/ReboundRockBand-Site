import Link from 'next/link'
import { readContent } from '@/lib/store'

const eventTypes = [
  'Bars & Nightclubs',
  'Private Parties',
  'Corporate Events',
  'Festivals',
  'Wedding Receptions',
  'Restaurant Shows',
  'Outdoor Events',
  'Holiday Parties',
]

export default async function BookingCTA() {
  const { siteContent } = await readContent()

  return (
    <section className="relative bg-brand-surface border-y border-brand-border overflow-hidden py-24 lg:py-32">
      {/* Background layers */}
      <div className="absolute inset-0 bg-stripe-texture pointer-events-none" aria-hidden="true" />
      {/* Main glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-brand-red/[0.07] blur-[150px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      {/* Side glows */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-brand-red/[0.03] blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-brand-red/[0.03] blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

      {/* Top/bottom red dividers */}
      <div className="absolute top-0 inset-x-0 h-px divider-red" aria-hidden="true" />
      <div className="absolute bottom-0 inset-x-0 h-px divider-red" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-7">
            <span className="w-10 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
            Available for Booking
            <span className="w-10 h-px bg-gradient-to-l from-transparent to-brand-red/70" />
          </div>

          {/* Headline */}
          <h2 className="font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-white mb-3">
            Planning an Event?
          </h2>
          <h2 className="font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9] mb-10 text-brand-red text-glow-red">
            We&apos;ve Got the Stage.
          </h2>

          <p className="font-body text-base sm:text-lg text-brand-text max-w-2xl mx-auto mb-10 leading-relaxed">
            Rebound Rock Band delivers a high-energy live show that gets crowds moving and keeps them
            on the dance floor. We handle the music — you take the credit for throwing an incredible event.
          </p>

          {/* Event type tags */}
          <div className="flex flex-wrap gap-2.5 justify-center mb-11">
            {eventTypes.map((type) => (
              <span
                key={type}
                className="font-heading text-xs text-brand-muted/80 border border-brand-border px-4 py-2 tracking-wide uppercase hover:border-brand-red/60 hover:text-white transition-all duration-150 cursor-default"
              >
                {type}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/booking"
              className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-10 py-4 hover:bg-brand-red-bright transition-all btn-glow-red text-center"
            >
              Request a Quote
            </Link>
            <Link
              href="/epk"
              className="font-heading text-sm uppercase tracking-widest border border-white/20 text-white/85 px-10 py-4 hover:border-brand-red hover:text-brand-red transition-all text-center"
            >
              {siteContent.ctaSecondaryLabel}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-brand-border" />
            <p className="font-body text-sm text-brand-muted">
              Fast response · {siteContent.serviceArea} based · Available year-round
            </p>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-brand-border" />
          </div>
        </div>
      </div>
    </section>
  )
}
