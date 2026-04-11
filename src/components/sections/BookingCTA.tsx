import Link from 'next/link'

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
  return (
    <section className="relative bg-brand-surface border-y border-brand-border overflow-hidden py-16 lg:py-24">
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[280px] bg-brand-red/8 blur-[100px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      <div className="absolute top-0 inset-x-0 h-px divider-red" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-heading text-brand-red text-xs tracking-widest uppercase border border-brand-red/40 px-3 py-1.5 mb-6 inline-block">
            Available for Booking
          </span>

          <h2 className="font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-none text-white mb-5">
            Planning an Event?
          </h2>
          <h2
            className="font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-none mb-8"
            style={{ color: '#e0101e', textShadow: '0 0 40px rgba(224,16,30,0.4)' }}
          >
            We&apos;ve Got the Stage.
          </h2>

          <p className="font-body text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Rebound Rock Band delivers a high-energy live show that gets crowds moving and keeps them
            on the dance floor. We handle the music — you take the credit for throwing an incredible event.
          </p>

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {eventTypes.map((type) => (
              <span
                key={type}
                className="font-heading text-xs text-brand-muted border border-brand-border px-3 py-1.5 tracking-wide uppercase hover:border-brand-red/40 hover:text-white/80 transition-colors"
              >
                {type}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/booking"
              className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-colors btn-glow-red text-center"
            >
              Request a Quote
            </Link>
            <Link
              href="/epk"
              className="font-heading text-sm uppercase tracking-widest border border-white/30 text-white px-8 py-4 hover:border-brand-red hover:text-brand-red transition-colors text-center"
            >
              Download Press Kit
            </Link>
          </div>

          <p className="font-body text-sm text-brand-muted mt-7">
            Fast response · South Florida based · Available year-round
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px divider-red" aria-hidden="true" />
    </section>
  )
}
