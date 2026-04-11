import type { Metadata } from 'next'
import Link from 'next/link'
import { siteContent } from '@/lib/data'

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

const inputClass =
  'w-full bg-brand-surface border border-brand-border text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-brand-red/60 transition-colors placeholder:text-brand-muted/50 rounded-sm'

export default function BookingPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-5xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <div className="py-12 border-b border-brand-border mb-12">
          <span className="font-heading text-brand-red text-xs tracking-widest uppercase border border-brand-red/40 px-3 py-1.5 mb-5 inline-block">
            Let&apos;s Make It Happen
          </span>
          <h1 className="font-display uppercase text-5xl sm:text-6xl text-white leading-none">
            Book <span className="text-brand-red">Rebound Rock Band</span>
          </h1>
          <p className="font-body text-brand-muted text-base mt-3 max-w-xl leading-relaxed">
            Fill out the form and we&apos;ll get back to you within 24 hours with availability and pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <form className="flex flex-col gap-5" action={`mailto:${siteContent.contactEmail}`} method="GET">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Your Name *</label>
                  <input type="text" name="name" required className={inputClass} placeholder="Full name" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Email *</label>
                  <input type="email" name="email" required className={inputClass} placeholder="your@email.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Phone</label>
                  <input type="tel" name="phone" className={inputClass} placeholder="(305) 000-0000" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Event Date *</label>
                  <input type="date" name="date" required className={inputClass} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Venue / Location *</label>
                <input type="text" name="venue" required className={inputClass} placeholder="Venue name and city" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-xs uppercase tracking-widest text-brand-muted">Event Type *</label>
                <select name="eventType" required className={inputClass}>
                  <option value="">Select event type</option>
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
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your event — expected crowd size, set length, any special requests..."
                />
              </div>

              <button
                type="submit"
                className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-colors btn-glow-red mt-1"
              >
                Send Booking Request
              </button>
              <p className="font-body text-xs text-brand-muted text-center">We typically respond within 24 hours.</p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="border border-brand-border bg-brand-surface p-6 rounded-sm">
              <h3 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-4">Direct Contact</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="font-heading text-[10px] text-brand-muted uppercase tracking-widest mb-1">Email</div>
                  <a href={`mailto:${siteContent.contactEmail}`} className="font-body text-sm text-white hover:text-brand-red transition-colors break-all">
                    {siteContent.contactEmail}
                  </a>
                </div>
                <div>
                  <div className="font-heading text-[10px] text-brand-muted uppercase tracking-widest mb-1">Phone</div>
                  <a href={`tel:${siteContent.contactPhone}`} className="font-body text-sm text-white hover:text-brand-red transition-colors">
                    {siteContent.contactPhone}
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
                  <li key={item} className="flex items-start gap-2.5 font-body text-sm text-brand-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0 mt-1.5" />
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
              <Link
                href="/epk"
                className="block text-center font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted px-4 py-2.5 hover:border-brand-red hover:text-brand-red transition-colors"
              >
                View Press Kit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
