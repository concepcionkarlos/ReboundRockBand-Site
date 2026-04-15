import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import SetlistAccordion from '@/components/ui/SetlistAccordion'
import { readContent } from '@/lib/store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Press Kit (EPK)',
  description: 'Rebound Rock Band electronic press kit — bio, tech rider, setlists, and booking info for promoters and venues.',
}

export default function EpkPage() {
  const { epkContent, siteContent } = readContent()

  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-5xl mx-auto px-5 lg:px-10">

        {/* Header */}
        <Reveal>
          <div className="py-12 border-b border-brand-border mb-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
                  <span className="w-5 h-px bg-brand-red/60" />
                  For Bookers &amp; Promoters
                </div>
                <h1 className="font-display uppercase text-5xl sm:text-7xl text-white leading-none">
                  Press <span className="text-brand-red">Kit</span>
                </h1>
              </div>
              <Link
                href="/booking"
                className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-6 py-3.5 hover:bg-brand-red-bright transition-all btn-glow-red flex-shrink-0 self-start"
              >
                Book Now
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Hero card */}
        <Reveal delay={1}>
          <div className="relative flex flex-col sm:flex-row gap-8 mb-14 p-7 border border-brand-border bg-brand-surface overflow-hidden">
            <div className="absolute top-0 left-0 h-px w-full divider-red pointer-events-none" />
            <div className="absolute top-0 left-0 w-[3px] h-full bg-brand-red pointer-events-none" />
            <div className="flex-shrink-0 flex items-center justify-center sm:justify-start pl-3">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                <div className="absolute inset-[-10px] rounded-full bg-brand-red/10 blur-2xl" />
                <Image src="/logo-improved.png" alt="Rebound Rock Band" fill className="object-contain drop-shadow-2xl" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display uppercase text-3xl sm:text-4xl text-white mb-1">Rebound Rock Band</h2>
              <div className="font-heading text-brand-red text-xs uppercase tracking-widest mb-4">
                {epkContent.tagline}
              </div>
              <p className="font-body text-gray-300/80 text-sm leading-relaxed">
                {siteContent.aboutText[0]}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Repertoire */}
        <Reveal>
          <section className="mb-14">
            <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-6">
              <span className="w-5 h-px bg-brand-red/60" />
              Repertoire
            </div>
            <h2 className="font-display uppercase text-3xl sm:text-4xl text-white mb-6">
              Songs by <span className="text-brand-red">Era</span>
            </h2>
            <div className="border border-brand-border overflow-hidden">
              {epkContent.repertoire.map((row, i) => (
                <div
                  key={row.era}
                  className={`flex gap-5 p-4 lg:p-5 hover:bg-brand-surface transition-colors ${
                    i < epkContent.repertoire.length - 1 ? 'border-b border-brand-border' : ''
                  }`}
                >
                  <div className="flex-shrink-0 w-12 font-display text-3xl text-brand-red leading-none pt-0.5">{row.era}s</div>
                  <p className="font-body text-sm text-brand-muted leading-relaxed self-center">{row.artists}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Sample Setlists */}
        {epkContent.setlists && epkContent.setlists.length > 0 && (
          <Reveal>
            <section className="mb-14">
              <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-6">
                <span className="w-5 h-px bg-brand-red/60" />
                Setlists
              </div>
              <h2 className="font-display uppercase text-3xl sm:text-4xl text-white mb-6">
                Sample <span className="text-brand-red">Repertoire</span>
              </h2>
              <SetlistAccordion setlists={epkContent.setlists} />
            </section>
          </Reveal>
        )}

        {/* Tech rider */}
        <Reveal>
          <section className="mb-14">
            <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-6">
              <span className="w-5 h-px bg-brand-red/60" />
              Technical
            </div>
            <h2 className="font-display uppercase text-3xl sm:text-4xl text-white mb-6">
              Tech <span className="text-brand-red">Rider</span>
            </h2>
            <div className="border border-brand-border overflow-hidden">
              {epkContent.techSpecs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex gap-5 p-4 lg:p-5 hover:bg-brand-surface transition-colors ${
                    i < epkContent.techSpecs.length - 1 ? 'border-b border-brand-border' : ''
                  }`}
                >
                  <div className="flex-shrink-0 w-36 font-heading text-[10px] uppercase tracking-widest text-brand-muted self-center">
                    {spec.label}
                  </div>
                  <div className="font-body text-sm text-white self-center">{spec.value}</div>
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-brand-muted/60 mt-3">
              Full tech rider available on request. We&apos;re flexible and happy to work with your existing setup.
            </p>
          </section>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="relative border border-brand-border bg-brand-surface p-10 text-center overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px divider-red" />
            <div className="absolute inset-0 bg-stripe-texture pointer-events-none opacity-50" />
            <div className="relative z-10">
              <h2 className="font-display uppercase text-4xl sm:text-5xl text-white mb-3">
                Ready to <span className="text-brand-red">Book?</span>
              </h2>
              <p className="font-body text-brand-muted text-sm max-w-md mx-auto mb-8 leading-relaxed">
                {epkContent.bookerIntro}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link
                  href="/booking"
                  className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-all btn-glow-red text-center"
                >
                  {siteContent.ctaPrimaryLabel}
                </Link>
                <a
                  href={`mailto:${siteContent.contactEmail}`}
                  className="font-heading text-sm uppercase tracking-widest border border-white/25 text-white px-8 py-4 hover:border-brand-red hover:text-brand-red transition-all text-center"
                >
                  Email Us Directly
                </a>
              </div>
              <p className="font-body text-xs text-brand-muted/60">
                {siteContent.contactEmail} · {siteContent.serviceArea}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
