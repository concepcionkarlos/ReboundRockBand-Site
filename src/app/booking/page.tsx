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
  'w-full bg-brand-elevated border border-brand-border text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.08)] transition-all placeholder:text-brand-muted/40 rounded-none'

export default function BookingPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-5xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <div className="py-12 border-b border-brand-border mb-12">
          <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
            <span className="w-5 h-px bg-brand-red/60" />
            Let&apos;s Make It Happen
          </div>
          <h1 className="font-display uppercase text-5xl sm:text-7xl text-white leading-none mb-3">
            Book <span className="text-brand-red">the Band</span>
          </h1>
          <p className="font-body text-brand-muted text-base max-w-xl leading-relaxed">
            Fill out the form and we&apos;ll get back to you within 24 hours with availability and pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Form */}
          <div className="lg:col-span-3">
            <form className="flex flex-col gap-5" action={`mailto:${siteContent.contactEmail}`} method="GET">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">Your Name *</label>
                  <input type="text" name="name" required className={inputClass} placeholder="Full name" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">Email *</label>
                  <input type="email" name="email" required className={inputClass} placeholder="your@email.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">Phone</label>
                  <input type="tel" name="phone" className={inputClass} placeholder="(305) 000-0000" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">Event Date *</label>
                  <input type="date" name="date" required className={inputClass} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">Venue / Location *</label>
                <input type="text" name="venue" required className={inputClass} placeholder="Venue name and city" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">Event Type *</label>
                <select name="eventType" required className={inputClass}>
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[11px] uppercase tracking-widest text-brand-muted">Message / Details</label>
                <textarea
                  name="message"
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your event — expected crowd size, set length, any special requests..."
                />
              </div>

              <button
                type="submit"
                className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-all btn-glow-red mt-1"
              >
                Send Booking Request
              </button>
              <p className="font-body text-xs text-brand-muted/60 text-center">We typically respond within 24 hours.</p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Direct contact */}
            <div className="border border-brand-border bg-brand-surface p-6">
              <h3 className="font-heading text-[11px] uppercase tracking-widest text-brand-red mb-4 flex items-center gap-2">
                <span className="w-3 h-px bg-brand-red/60" />
                Direct Contact
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="font-heading text-[10px] text-brand-muted/60 uppercase tracking-widest mb-1">Email</div>
                  <a href={`mailto:${siteContent.contactEmail}`} className="font-body text-sm text-white hover:text-brand-red transition-colors break-all">
                    {siteContent.contactEmail}
                  </a>
                </div>
                <div>
                  <div className="font-heading text-[10px] text-brand-muted/60 uppercase tracking-widest mb-1">Phone</div>
                  <a href={`tel:${siteContent.contactPhone}`} className="font-body text-sm text-white hover:text-brand-red transition-colors">
                    {siteContent.contactPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* What we offer */}
            <div className="border border-brand-border bg-brand-surface p-6">
              <h3 className="font-heading text-[11px] uppercase tracking-widest text-brand-red mb-4 flex items-center gap-2">
                <span className="w-3 h-px bg-brand-red/60" />
                What We Offer
              </h3>
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
                    <span className="w-1 h-1 rounded-full bg-brand-red flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Press Kit */}
            <div className="border border-brand-border bg-brand-surface p-6">
              <h3 className="font-heading text-[11px] uppercase tracking-widest text-brand-red mb-3 flex items-center gap-2">
                <span className="w-3 h-px bg-brand-red/60" />
                Press Kit
              </h3>
              <p className="font-body text-xs text-brand-muted leading-relaxed mb-4">
                Booking agent or promoter? View our full EPK with bio, tech rider, and press info.
              </p>
              <Link
                href="/epk"
                className="block text-center font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted px-4 py-2.5 hover:border-brand-red hover:text-brand-red transition-all"
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
