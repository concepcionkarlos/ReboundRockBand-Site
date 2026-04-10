import Button from '@/components/ui/Button'

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
    <section className="relative bg-brand-surface border-y border-brand-border overflow-hidden py-20 lg:py-24">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-red/8 blur-[100px] rounded-full" />
      </div>

      {/* Accent line top */}
      <div className="absolute top-0 inset-x-0 h-px divider-red" />

      <div className="relative z-10 container mx-auto px-6 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-heading text-brand-red text-xs tracking-widest uppercase border border-brand-red/40 px-3 py-1.5 mb-7 inline-block">
            Available for Booking
          </span>

          <h2 className="font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-none text-white mb-6">
            Planning an Event?<br />
            <span
              className="text-brand-red"
              style={{ textShadow: '0 0 40px rgba(224,16,30,0.45)' }}
            >
              We've Got the Stage.
            </span>
          </h2>

          <p className="font-body text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Rebound Rock Band delivers a high-energy live show that gets crowds moving and keeps them
            on the dance floor. We handle the music — you take the credit for throwing an incredible event.
          </p>

          {/* Event types */}
          <div className="flex flex-wrap gap-2.5 justify-center mb-10">
            {eventTypes.map((type) => (
              <span
                key={type}
                className="font-heading text-xs text-brand-muted border border-brand-border px-3 py-1.5 tracking-wide uppercase hover:border-brand-red/40 hover:text-white transition-colors"
              >
                {type}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/booking" variant="primary" size="lg">
              Request a Quote
            </Button>
            <Button href="/epk" variant="outline" size="lg">
              Download Press Kit
            </Button>
          </div>

          {/* Reassurance */}
          <p className="font-body text-sm text-brand-muted mt-8">
            Fast response · South Florida based · Available year-round
          </p>
        </div>
      </div>

      {/* Accent line bottom */}
      <div className="absolute bottom-0 inset-x-0 h-px divider-red" />
    </section>
  )
}
