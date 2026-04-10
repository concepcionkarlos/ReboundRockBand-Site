import type { Metadata } from 'next'
import { shows } from '@/lib/data'
import ShowCard from '@/components/ui/ShowCard'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Shows & Events',
  description: 'Upcoming Rebound Rock Band shows, events, and live performances across South Florida.',
}

export default function ShowsPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="container mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="py-14 border-b border-brand-border mb-12">
          <SectionHeader
            eyebrow="On the Road"
            title="Upcoming Shows"
            titleHighlight="Shows"
            subtitle="Catch us live across South Florida. Check back often — we announce new dates regularly."
            align="left"
          />
        </div>

        {/* Shows list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-14">
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>

        {/* No shows fallback */}
        {shows.length === 0 && (
          <div className="text-center py-20 border border-brand-border">
            <p className="font-heading text-brand-muted text-sm tracking-widest uppercase">
              New dates being added — check back soon
            </p>
          </div>
        )}

        {/* Booking pitch */}
        <div className="mt-10 p-8 border border-brand-border bg-brand-surface rounded-sm text-center">
          <h3 className="font-display uppercase text-3xl text-white mb-3">
            Want Us at Your Venue?
          </h3>
          <p className="font-body text-brand-muted text-sm max-w-md mx-auto mb-6 leading-relaxed">
            We&apos;re always looking for great venues and events. Reach out to book us at your bar,
            restaurant, festival, or private event.
          </p>
          <Button href="/booking" variant="primary" size="md">
            Contact Us for Booking
          </Button>
        </div>
      </div>
    </div>
  )
}
