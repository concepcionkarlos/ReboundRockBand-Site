import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { siteContent } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Press Kit (EPK)',
  description: 'Rebound Rock Band electronic press kit — bio, tech rider, and booking info for promoters and venues.',
}

const techSpecs = [
  { label: 'Set Length', value: '2 × 45-min sets (or custom)' },
  { label: 'Setup Time', value: '90 minutes prior to show' },
  { label: 'Soundcheck', value: '30 minutes' },
  { label: 'PA System', value: 'Self-contained (or house PA accepted)' },
  { label: 'Lighting', value: 'Basic stage lighting available' },
  { label: 'Stage Required', value: '15ft × 12ft minimum' },
  { label: 'Power', value: '2 × 20A circuits minimum' },
]

const repertoire = [
  { era: '50s', artists: 'Chuck Berry, Elvis Presley, Buddy Holly, Little Richard' },
  { era: '60s', artists: 'The Beatles, The Rolling Stones, The Doors, Jimi Hendrix' },
  { era: '70s', artists: 'Led Zeppelin, Queen, Fleetwood Mac, Aerosmith, Lynyrd Skynyrd' },
  { era: '80s', artists: "Bon Jovi, Journey, Def Leppard, Van Halen, Guns N' Roses" },
  { era: '90s', artists: 'Nirvana, Pearl Jam, Red Hot Chili Peppers, Green Day, Counting Crows' },
]

export default function EpkPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-5xl mx-auto px-5 lg:px-10">

        {/* Header */}
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

        {/* Hero card */}
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
              South Florida · 5-Piece Live Cover Band · Classic Rock 50s–90s
            </div>
            <p className="font-body text-gray-300/80 text-sm leading-relaxed mb-6">
              {siteContent.aboutText[0]}
            </p>
            <div className="flex gap-8 flex-wrap">
              {[['5', 'Live Members'], ['4', 'Decades of Hits'], ['100+', 'Shows Played']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display text-3xl text-white leading-none">{val}</div>
                  <div className="font-body text-[10px] text-brand-muted uppercase tracking-widest mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Repertoire */}
        <section className="mb-14">
          <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-6">
            <span className="w-5 h-px bg-brand-red/60" />
            Repertoire
          </div>
          <h2 className="font-display uppercase text-3xl sm:text-4xl text-white mb-6">
            Songs by <span className="text-brand-red">Era</span>
          </h2>
          <div className="border border-brand-border overflow-hidden">
            {repertoire.map((row, i) => (
              <div
                key={row.era}
                className={`flex gap-5 p-4 lg:p-5 hover:bg-brand-surface transition-colors ${
                  i < repertoire.length - 1 ? 'border-b border-brand-border' : ''
                }`}
              >
                <div className="flex-shrink-0 w-12 font-display text-3xl text-brand-red leading-none pt-0.5">{row.era}s</div>
                <p className="font-body text-sm text-brand-muted leading-relaxed self-center">{row.artists}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech rider */}
        <section className="mb-14">
          <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-6">
            <span className="w-5 h-px bg-brand-red/60" />
            Technical
          </div>
          <h2 className="font-display uppercase text-3xl sm:text-4xl text-white mb-6">
            Tech <span className="text-brand-red">Rider</span>
          </h2>
          <div className="border border-brand-border overflow-hidden">
            {techSpecs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex gap-5 p-4 lg:p-5 hover:bg-brand-surface transition-colors ${
                  i < techSpecs.length - 1 ? 'border-b border-brand-border' : ''
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

        {/* CTA */}
        <div className="relative border border-brand-border bg-brand-surface p-10 text-center overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px divider-red" />
          <div className="absolute inset-0 bg-stripe-texture pointer-events-none opacity-50" />
          <div className="relative z-10">
            <h2 className="font-display uppercase text-4xl sm:text-5xl text-white mb-3">
              Ready to <span className="text-brand-red">Book?</span>
            </h2>
            <p className="font-body text-brand-muted text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Contact us directly for availability, pricing, and to request the full press kit PDF with photos and setlist.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link
                href="/booking"
                className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-all btn-glow-red text-center"
              >
                Book Rebound Rock Band
              </Link>
              <a
                href={`mailto:${siteContent.contactEmail}`}
                className="font-heading text-sm uppercase tracking-widest border border-white/25 text-white px-8 py-4 hover:border-brand-red hover:text-brand-red transition-all text-center"
              >
                Email Us Directly
              </a>
            </div>
            <p className="font-body text-xs text-brand-muted/60">
              {siteContent.contactEmail} · {siteContent.contactPhone} · South Florida
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
