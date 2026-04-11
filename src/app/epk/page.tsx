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
              <span className="font-heading text-brand-red text-xs tracking-widest uppercase border border-brand-red/40 px-3 py-1.5 mb-5 inline-block">
                For Bookers & Promoters
              </span>
              <h1 className="font-display uppercase text-5xl sm:text-6xl text-white leading-none">
                Press <span className="text-brand-red">Kit</span>
              </h1>
            </div>
            <Link
              href="/booking"
              className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-6 py-3.5 hover:bg-brand-red-bright transition-colors btn-glow-red flex-shrink-0 self-start"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Hero card */}
        <div className="flex flex-col sm:flex-row gap-8 mb-14 p-7 border border-brand-border bg-brand-surface rounded-sm">
          <div className="flex-shrink-0 flex items-center justify-center sm:justify-start">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36">
              <Image src="/logo-improved.png" alt="Rebound Rock Band" fill className="object-contain" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display uppercase text-3xl text-white mb-1">Rebound Rock Band</h2>
            <div className="font-heading text-brand-red text-xs uppercase tracking-widest mb-4">
              South Florida · 5-Piece Live Cover Band · Classic Rock 50s–90s
            </div>
            <p className="font-body text-gray-300 text-sm leading-relaxed mb-5">
              {siteContent.aboutText[0]}
            </p>
            <div className="flex gap-7 flex-wrap">
              {[['5', 'Live Members'], ['4', 'Decades of Hits'], ['100+', 'Shows Played']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display text-2xl text-white">{val}</div>
                  <div className="font-body text-[10px] text-brand-muted uppercase tracking-widest">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Repertoire */}
        <section className="mb-14">
          <h2 className="font-display uppercase text-3xl text-white mb-6">
            Repertoire by <span className="text-brand-red">Era</span>
          </h2>
          <div className="divide-y divide-brand-border border border-brand-border rounded-sm overflow-hidden">
            {repertoire.map((row) => (
              <div key={row.era} className="flex gap-5 p-4 hover:bg-brand-surface transition-colors">
                <div className="flex-shrink-0 w-10 font-display text-2xl text-brand-red">{row.era}s</div>
                <p className="font-body text-sm text-brand-muted leading-relaxed">{row.artists}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech rider */}
        <section className="mb-14">
          <h2 className="font-display uppercase text-3xl text-white mb-6">
            Technical <span className="text-brand-red">Rider</span>
          </h2>
          <div className="divide-y divide-brand-border border border-brand-border rounded-sm overflow-hidden">
            {techSpecs.map((spec) => (
              <div key={spec.label} className="flex gap-5 p-4 hover:bg-brand-surface transition-colors">
                <div className="flex-shrink-0 w-32 font-heading text-[10px] uppercase tracking-widest text-brand-muted self-center">
                  {spec.label}
                </div>
                <div className="font-body text-sm text-white">{spec.value}</div>
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-brand-muted mt-3">
            Full tech rider available on request. We&apos;re flexible and happy to work with your existing setup.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-brand-border bg-brand-surface p-8 rounded-sm text-center">
          <h2 className="font-display uppercase text-4xl text-white mb-3">Ready to Book?</h2>
          <p className="font-body text-brand-muted text-sm max-w-md mx-auto mb-7 leading-relaxed">
            Contact us directly for availability, pricing, and to request the full press kit PDF with photos and setlist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/booking"
              className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-colors btn-glow-red text-center"
            >
              Book Rebound Rock Band
            </Link>
            <a
              href={`mailto:${siteContent.contactEmail}`}
              className="font-heading text-sm uppercase tracking-widest border border-white/30 text-white px-8 py-4 hover:border-brand-red hover:text-brand-red transition-colors text-center"
            >
              Email Us Directly
            </a>
          </div>
          <p className="font-body text-xs text-brand-muted mt-6">
            {siteContent.contactEmail} · {siteContent.contactPhone} · South Florida
          </p>
        </div>
      </div>
    </div>
  )
}
