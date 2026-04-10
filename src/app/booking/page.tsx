import type { Metadata } from 'next'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Book the Band',
  description: 'Book Rebound Rock Band for your bar, private event, festival, or corporate show in South Florida.',
}

const eventTypes = [
  'Bar / Nightclub',
  'Private Party',
  'Corporate Event',
  'Festival / Outdoor',
  'Wedding Reception',
  'Restaurant Show',
  'Holiday Party',
  'Other',
]

export default function BookingPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="container mx-auto px-6 lg:px-10 max-w-4xl">
        <div className="py-14 border-b border-brand-border mb-12">
          <SectionHeader
            eyebrow="Let's Make It Happen"
            title="Book the Band"
            titleHighlight="the Band"
            subtitle="Fill out the form below and we'll get back to you within 24 hours with availability and pricing."
            align="left"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <form className="flex flex-col gap-5" action="mailto:booking@reboundrockband.com" method="GET">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="bg-brand-surface border border-brand-border text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-brand-red/60 transition-colors placeholder:text-brand-muted/50"
                    placeholder="Full name"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="bg-brand-surface border border-brand-border text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-brand-red/60 transition-colors placeholder:text-brand-muted/50"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="bg-brand-surface border border-brand-border text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-brand-red/60 transition-colors placeholder:text-brand-muted/50"
                    placeholder="(305) 000-0000"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Event Date *</label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="bg-brand-surface border border-brand-border text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-brand-red/60 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Venue / Location *</label>
                <input
                  type="text"
                  name="venue"
                  required
                  className="bg-brand-surface border border-brand-border text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-brand-red/60 transition-colors placeholder:text-brand-muted/50"
                  placeholder="Venue name and city"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Event Type *</label>
                <select
                  name="eventType"
                  required
                  className="bg-brand-surface border border-brand-border text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-brand-red/60 transition-colors"
                >
                  <option value="" disabled>Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Message / Details</label>
                <textarea
                  name="message"
                  rows={4}
                  className="bg-brand-surface border border-brand-border text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-brand-red/60 transition-colors placeholder:text-brand-muted/50 resize-none"
                  placeholder="Tell us about your event — expected crowd size, set length, any special requests..."
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="mt-1">
                Send Booking Request
              </Button>

              <p className="font-body text-xs text-brand-muted text-center">
                We typically respond within 24 hours.
              </p>
            </form>
          </div>

          {/* Sidebar info */}
          <div className="lg:col-span-2 flex flex-col gap-7">
            <div className="border border-brand-border bg-brand-surface p-6 rounded-sm">
              <h3 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-4">Direct Contact</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="font-heading text-xs text-brand-muted uppercase tracking-widest mb-1">Email</div>
                  <a href="mailto:booking@reboundrockband.com" className="font-body text-sm text-white hover:text-brand-red transition-colors break-all">
                    booking@reboundrockband.com
                  </a>
                </div>
                <div>
                  <div className="font-heading text-xs text-brand-muted uppercase tracking-widest mb-1">Phone</div>
                  <a href="tel:+13055550100" className="font-body text-sm text-white hover:text-brand-red transition-colors">
                    (305) 555-0100
                  </a>
                </div>
              </div>
            </div>

            <div className="border border-brand-border bg-brand-surface p-6 rounded-sm">
              <h3 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-4">What We Offer</h3>
              <ul className="flex flex-col gap-2.5">
                {[
                  '5-piece live band — no tracks',
                  'PA / sound system available',
                  'Stage lighting setup',
                  '2–4 hour sets',
                  'Custom setlist options',
                  'South Florida and beyond',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 font-body text-sm text-brand-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-brand-border bg-brand-surface p-6 rounded-sm">
              <h3 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-3">Press Kit</h3>
              <p className="font-body text-xs text-brand-muted leading-relaxed mb-4">
                Booking agent or promoter? Download our full EPK with bio, tech rider, and press photos.
              </p>
              <Button href="/epk" variant="outline" size="sm" className="w-full">
                View Press Kit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
