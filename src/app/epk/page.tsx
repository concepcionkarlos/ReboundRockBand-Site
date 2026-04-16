import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import SetlistAccordion from '@/components/ui/SetlistAccordion'
import SongRequestForm from '@/components/epk/SongRequestForm'
import { readContent } from '@/lib/store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Press Kit (EPK)',
  description: 'Rebound Rock Band electronic press kit — bio, tech rider, setlists, and booking info for promoters and venues.',
}

export default async function EpkPage() {
  const { epkContent, siteContent } = await readContent()

  return (
    <div className="pt-24 pb-24 min-h-screen bg-brand-bg">
      <div className="max-w-5xl mx-auto px-5 lg:px-10">

        {/* Header */}
        <Reveal>
          <div className="py-14 border-b border-brand-border mb-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-6">
                  <span className="w-8 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
                  For Bookers &amp; Promoters
                </div>
                <h1 className="font-display uppercase text-5xl sm:text-7xl text-white leading-[0.9]">
                  Press <span className="text-brand-red">Kit</span>
                </h1>
              </div>
              <Link
                href="/booking"
                className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-7 py-4 hover:bg-brand-red-bright transition-all btn-glow-red flex-shrink-0 self-start"
              >
                Book Now
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Hero card */}
        <Reveal delay={1}>
          <div className="relative flex flex-col sm:flex-row gap-8 mb-16 p-8 border border-brand-border bg-brand-surface overflow-hidden">
            <div className="absolute top-0 left-0 h-px w-full divider-red pointer-events-none" />
            <div className="absolute top-0 left-0 w-[3px] h-full bg-brand-red pointer-events-none" />
            <div className="flex-shrink-0 flex items-center justify-center sm:justify-start pl-3">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                <div className="absolute inset-[-14px] rounded-full bg-brand-red/[0.09] blur-2xl" />
                <Image src="/logo-improved.png" alt="Rebound Rock Band" fill className="object-contain drop-shadow-2xl" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display uppercase text-3xl sm:text-4xl text-white mb-1">Rebound Rock Band</h2>
              <div className="font-heading text-brand-red text-xs uppercase tracking-widest mb-5">
                {epkContent.tagline}
              </div>
              <p className="font-body text-brand-text text-sm leading-relaxed">
                {siteContent.aboutText[0]}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Sample Setlists */}
        {epkContent.setlists && epkContent.setlists.length > 0 && (
          <Reveal>
            <section className="mb-16">
              <div className="flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-6">
                <span className="w-8 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
                Setlists
              </div>
              <h2 className="font-display uppercase text-3xl sm:text-4xl text-white leading-[0.92] mb-7">
                Sample <span className="text-brand-red">Repertoire</span>
              </h2>
              <SetlistAccordion setlists={epkContent.setlists} />
            </section>
          </Reveal>
        )}

        {/* Song Requests */}
        <Reveal>
          <section className="mb-16">
            <div className="flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-6">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
              Song Requests
            </div>
            <h2 className="font-display uppercase text-3xl sm:text-4xl text-white leading-[0.92] mb-3">
              Request a <span className="text-brand-red">Song</span>
            </h2>
            <p className="font-body text-brand-text text-sm leading-relaxed mb-8 max-w-xl">
              Have a song you&apos;d love to hear? Send your request and the band may consider it for future shows or private events.
            </p>
            <div className="border border-brand-border bg-brand-surface p-7 sm:p-10">
              <SongRequestForm />
            </div>
          </section>
        </Reveal>

        {/* Tech rider */}
        <Reveal>
          <section className="mb-16">
            <div className="flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-6">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
              Technical
            </div>
            <h2 className="font-display uppercase text-3xl sm:text-4xl text-white leading-[0.92] mb-7">
              Tech <span className="text-brand-red">Rider</span>
            </h2>
            <div className="border border-brand-border overflow-hidden">
              {epkContent.techSpecs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex gap-6 p-5 lg:p-6 hover:bg-brand-surface transition-colors ${
                    i < epkContent.techSpecs.length - 1 ? 'border-b border-brand-border' : ''
                  }`}
                >
                  <div className="flex-shrink-0 w-36 font-heading text-[10px] uppercase tracking-widest text-brand-muted self-center">
                    {spec.label}
                  </div>
                  <div className="font-body text-sm text-white/90 self-center">{spec.value}</div>
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-brand-muted/60 mt-4">
              Full tech rider available on request. We&apos;re flexible and happy to work with your existing setup.
            </p>
          </section>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="relative border border-brand-border bg-brand-surface p-12 text-center overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px divider-red" />
            <div className="absolute bottom-0 inset-x-0 h-px divider-red" />
            <div className="absolute inset-0 bg-stripe-texture pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display uppercase text-4xl sm:text-5xl text-white leading-[0.92] mb-4">
                Ready to <span className="text-brand-red">Book?</span>
              </h2>
              <p className="font-body text-brand-text text-sm max-w-md mx-auto mb-9 leading-relaxed">
                {epkContent.bookerIntro}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link
                  href="/booking"
                  className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-9 py-4 hover:bg-brand-red-bright transition-all btn-glow-red text-center"
                >
                  {siteContent.ctaPrimaryLabel}
                </Link>
                <a
                  href={`mailto:${siteContent.contactEmail}`}
                  className="font-heading text-sm uppercase tracking-widest border border-white/20 text-white/85 px-9 py-4 hover:border-brand-red hover:text-brand-red transition-all text-center"
                >
                  Email Us Directly
                </a>
              </div>
              <p className="font-body text-xs text-brand-muted/50">
                {siteContent.contactEmail} · {siteContent.serviceArea}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
