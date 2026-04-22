import type { Metadata } from 'next'
import Link from 'next/link'
import { readContent } from '@/lib/store'
import { getLang } from '@/lib/getLang'
import { translations } from '@/lib/i18n'
import BookingForm from '@/components/booking/BookingForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Book the Band',
  description: 'Book Rebound Rock Band for your bar, private event, festival, or corporate show in South Florida.',
}

export default async function BookingPage() {
  const [{ siteContent }, lang] = await Promise.all([readContent(), getLang()])
  const tr = translations[lang].booking

  return (
    <div className="pt-24 pb-24 min-h-screen bg-brand-bg">
      <div className="max-w-5xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <div className="py-14 border-b border-brand-border mb-14">
          <div className="flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-6">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
            {tr.eyebrow}
          </div>
          <h1 className="font-display uppercase text-5xl sm:text-7xl text-white leading-[0.9] mb-4">
            {tr.heading} <span className="text-brand-red">{tr.headingAccent}</span>
          </h1>
          <p className="font-body text-brand-text text-base max-w-xl leading-relaxed">
            {tr.sub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Form */}
          <div className="lg:col-span-3">
            <BookingForm contactEmail={siteContent.contactEmail} lang={lang} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Direct contact */}
            <div className="border border-brand-border bg-brand-surface p-7">
              <h3 className="font-heading text-[11px] uppercase tracking-widest text-brand-red mb-5 flex items-center gap-2">
                <span className="w-4 h-px bg-brand-red/60" />
                {tr.directContact}
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="font-heading text-[10px] text-brand-muted/60 uppercase tracking-widest mb-1.5">{tr.emailLabel}</div>
                  <a href={`mailto:${siteContent.contactEmail}`} className="font-body text-sm text-white/90 hover:text-brand-red transition-colors break-all">
                    {siteContent.contactEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* What we offer */}
            <div className="border border-brand-border bg-brand-surface p-7">
              <h3 className="font-heading text-[11px] uppercase tracking-widest text-brand-red mb-5 flex items-center gap-2">
                <span className="w-4 h-px bg-brand-red/60" />
                {tr.whatWeOffer}
              </h3>
              <ul className="flex flex-col gap-3">
                {tr.offerItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-sm text-brand-text">
                    <span className="w-1 h-1 rounded-full bg-brand-red flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Press Kit */}
            <div className="border border-brand-border bg-brand-surface p-7">
              <h3 className="font-heading text-[11px] uppercase tracking-widest text-brand-red mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-brand-red/60" />
                {tr.pressKit}
              </h3>
              <p className="font-body text-sm text-brand-text leading-relaxed mb-5">
                {tr.pressKitSub}
              </p>
              <Link
                href="/epk"
                className="block text-center font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted px-4 py-3 hover:border-brand-red hover:text-brand-red transition-all"
              >
                {tr.viewPressKit}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
