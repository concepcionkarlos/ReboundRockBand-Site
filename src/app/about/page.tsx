import type { Metadata } from 'next'
import { bandMembers } from '@/lib/data'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About the Band',
  description: 'Meet Rebound Rock Band — South Florida\'s 5-piece classic rock cover band.',
}

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="container mx-auto px-6 lg:px-10">
        {/* Page header */}
        <div className="py-14 border-b border-brand-border mb-16">
          <SectionHeader
            eyebrow="The Band"
            title="Who We Are"
            titleHighlight="We Are"
            subtitle="Five musicians. Four decades of hits. One mission — deliver an unforgettable live rock show every single night."
            align="left"
          />
        </div>

        {/* Band bio */}
        <div className="max-w-3xl mb-16">
          <div className="space-y-5 font-body text-gray-300 leading-relaxed text-base">
            <p>
              Rebound Rock Band is a five-piece live cover band based in South Florida, performing the
              greatest classic rock and crowd-pleasing hits from the 1950s through the 1990s. From
              Chuck Berry and Elvis Presley to The Beatles, Led Zeppelin, The Rolling Stones, Queen,
              AC/DC, Bon Jovi, and everything in between — we play the songs that defined rock and roll.
            </p>
            <p>
              We formed with a simple philosophy: give every audience the live rock experience they deserve.
              No backing tracks. No filler. Just five passionate musicians delivering tight, energetic
              performances that get crowds on their feet and keep them there.
            </p>
            <p>
              We&apos;ve played festivals, bars, rooftops, restaurant stages, corporate events, private
              parties, and everywhere in between. No matter the venue or the crowd, we bring the same
              level of energy and professionalism every time.
            </p>
          </div>
        </div>

        {/* Band members */}
        <div className="mb-16">
          <h2 className="font-display uppercase text-4xl text-white mb-8">
            Meet the <span className="text-brand-red">Members</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {bandMembers.map((member) => (
              <div
                key={member.id}
                className="border border-brand-border bg-brand-surface rounded-sm p-5 hover:border-brand-red/40 transition-colors"
              >
                {/* Photo placeholder */}
                <div className="aspect-square bg-brand-elevated rounded-sm mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-brand-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="font-heading text-xs text-brand-red uppercase tracking-widest mb-1">{member.role}</div>
                <div className="font-heading text-sm text-white mb-2">{member.name}</div>
                <p className="font-body text-xs text-brand-muted leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-brand-muted mt-4">* Member names and photos coming soon.</p>
        </div>

        {/* Booking pitch */}
        <div className="border-t border-brand-border pt-12 text-center">
          <h3 className="font-display uppercase text-4xl text-white mb-4">
            Ready to Book?
          </h3>
          <p className="font-body text-brand-muted max-w-md mx-auto mb-7 leading-relaxed">
            Get in touch to check availability and get a quote for your event.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button href="/booking" variant="primary" size="lg">Book the Band</Button>
            <Button href="/epk" variant="outline" size="lg">Download EPK</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
