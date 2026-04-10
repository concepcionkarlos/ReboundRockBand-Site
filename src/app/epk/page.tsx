import type { Metadata } from 'next'
import Image from 'next/image'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'

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
  { label: 'Space Required', value: '15ft × 12ft minimum stage area' },
  { label: 'Power', value: '2 × 20A circuits minimum' },
]

const genreHighlights = [
  { era: "50s", artists: 'Chuck Berry, Elvis Presley, Buddy Holly, Little Richard' },
  { era: "60s", artists: 'The Beatles, The Rolling Stones, The Doors, Jimi Hendrix' },
  { era: "70s", artists: 'Led Zeppelin, Queen, Fleetwood Mac, Aerosmith, Lynyrd Skynyrd' },
  { era: "80s", artists: 'Bon Jovi, Journey, Def Leppard, Van Halen, Guns N\' Roses' },
  { era: "90s", artists: 'Nirvana, Pearl Jam, Red Hot Chili Peppers, Green Day, Counting Crows' },
]

export default function EpkPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="container mx-auto px-6 lg:px-10 max-w-5xl">
        <div className="py-14 border-b border-brand-border mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <SectionHeader
              eyebrow="For Bookers & Promoters"
              title="Press Kit"
              titleHighlight="Press Kit"
              align="left"
            />
            <Button href="/booking" variant="primary" size="md" className="flex-shrink-0 self-start sm:self-auto">
              Book Now
            </Button>
          </div>
        </div>

        {/* Hero card */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16 p-8 border border-brand-border bg-brand-surface rounded-sm">
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <Image src="/images/logo.jpeg" alt="Rebound Rock Band" fill className="object-contain" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-display uppercase text-4xl text-white mb-2">Rebound Rock Band</h2>
            <div className="font-heading text-brand-red text-xs uppercase tracking-widest mb-4">
              South Florida · 5-Piece Live Cover Band · Classic Rock 50s–90s
            </div>
            <p className="font-body text-gray-300 text-sm leading-relaxed mb-5">
              Rebound Rock Band is a high-energy five-piece live cover band based in South Florida,
              performing classic rock and crowd-favorite hits from the 1950s through the 1990s.
              With a reputation for tight musicianship, stage energy, and crowd connection, Rebound
              delivers a live show that gets audiences on their feet and keeps them there.
            </p>
            <div className="flex flex-wrap gap-5">
              <div>
                <div className="font-display text-2xl text-white">5</div>
                <div className="font-body text-xs text-brand-muted uppercase tracking-widest">Live Members</div>
              </div>
              <div>
                <div className="font-display text-2xl text-white">4</div>
                <div className="font-body text-xs text-brand-muted uppercase tracking-widest">Decades of Hits</div>
              </div>
              <div>
                <div className="font-display text-2xl text-white">100+</div>
                <div className="font-body text-xs text-brand-muted uppercase tracking-widest">Shows Played</div>
              </div>
            </div>
          </div>
        </div>

        {/* Repertoire */}
        <section className="mb-14">
          <h2 className="font-display uppercase text-3xl text-white mb-6">
            Repertoire by <span className="text-brand-red">Era</span>
          </h2>
          <div className="divide-y divide-brand-border border border-brand-border">
            {genreHighlights.map((row) => (
              <div key={row.era} className="flex gap-6 p-4 hover:bg-brand-surface transition-colors">
                <div className="flex-shrink-0 w-12 font-display text-2xl text-brand-red">{row.era}s</div>
                <p className="font-body text-sm text-brand-muted leading-relaxed">{row.artists}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech specs */}
        <section className="mb-14">
          <h2 className="font-display uppercase text-3xl text-white mb-6">
            Technical <span className="text-brand-red">Rider</span>
          </h2>
          <div className="border border-brand-border divide-y divide-brand-border">
            {techSpecs.map((spec) => (
              <div key={spec.label} className="flex gap-6 p-4 hover:bg-brand-surface transition-colors">
                <div className="flex-shrink-0 w-36 font-heading text-xs uppercase tracking-widest text-brand-muted self-center">
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

        {/* Booking CTA */}
        <div className="border border-brand-border bg-brand-surface p-8 rounded-sm text-center">
          <h3 className="font-display uppercase text-4xl text-white mb-3">
            Ready to Book?
          </h3>
          <p className="font-body text-brand-muted text-sm max-w-md mx-auto mb-7 leading-relaxed">
            Contact us directly for availability, pricing, and to request the full press kit PDF with photos and setlist.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/booking" variant="primary" size="lg">Book the Band</Button>
            <Button href="mailto:booking@reboundrockband.com" variant="outline" size="lg" external>
              Email Us Directly
            </Button>
          </div>
          <div className="mt-6 font-body text-xs text-brand-muted">
            booking@reboundrockband.com · (305) 555-0100 · South Florida
          </div>
        </div>
      </div>
    </div>
  )
}
