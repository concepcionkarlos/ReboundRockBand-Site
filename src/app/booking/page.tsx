import type { Metadata } from 'next'
import Link from 'next/link'
import { readContent } from '@/lib/store'
import BookingForm from '@/components/booking/BookingForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Book the Band',
  description: 'Book Rebound Rock Band for your bar, private event, festival, or corporate show in South Florida.',
}

export default function BookingPage() {
  const { siteContent } = readContent()

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
            <BookingForm contactEmail={siteContent.contactEmail} />
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
