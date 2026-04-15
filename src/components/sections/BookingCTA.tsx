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

export default function BookingCTA() {
  const { siteContent } = readContent()

  return (
    <section className="relative bg-brand-surface border-y border-brand-border overflow-hidden py-20 lg:py-28">
      {/* Background layers */}
      <div className="absolute inset-0 bg-stripe-texture pointer-events-none" aria-hidden="true" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-brand-red/4 blur-[130px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Top/bottom red dividers */}
      <div className="absolute top-0 inset-x-0 h-px divider-red" aria-hidden="true" />
      <div className="absolute bottom-0 inset-x-0 h-px divider-red" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-6">
            <span className="w-8 h-px bg-brand-red/60" />
            Available for Booking
            <span className="w-8 h-px bg-brand-red/60" />
          </div>

          {/* Headline */}
          <h2 className="font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-none text-white mb-3">
            Planning an Event?
          </h2>
          <h2
            className="font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-none mb-8 text-brand-red"
          >
            We&apos;ve Got the Stage.
          </h2>

          <p className="font-body text-base sm:text-lg text-gray-300/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Rebound Rock Band delivers a high-energy live show that gets crowds moving and keeps them
            on the dance floor. We handle the music — you take the credit for throwing an incredible event.
          </p>

          {/* Event type tags */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {eventTypes.map((type) => (
              <span
                key={type}
                className="font-heading text-xs text-brand-muted border border-brand-border px-3 py-1.5 tracking-wide uppercase hover:border-brand-red/50 hover:text-white/80 transition-all duration-150 cursor-default"
              >
                {type}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              href="/booking"
              className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-10 py-4 hover:bg-brand-red-bright transition-all btn-glow-red text-center"
            >
              Request a Quote
            </Link>
            <Link
              href="/epk"
              className="font-heading text-sm uppercase tracking-widest border border-white/25 text-white px-10 py-4 hover:border-brand-red hover:text-brand-red transition-all text-center"
            >
              {siteContent.ctaSecondaryLabel}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-brand-border" />
            <p className="font-body text-sm text-brand-muted">
              Fast response · {siteContent.serviceArea} based · Available year-round
            </p>
            <span className="w-8 h-px bg-brand-border" />
          </div>
        </div>
      </div>
    </section>
  )
}
