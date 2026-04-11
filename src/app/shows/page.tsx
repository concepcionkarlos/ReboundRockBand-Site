import type { Metadata } from 'next'
import { shows } from '@/lib/data'
import ShowCard from '@/components/ui/ShowCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shows & Events',
  description: 'Upcoming Rebound Rock Band shows and live performances across South Florida.',
}

export default function ShowsPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <div className="py-12 border-b border-brand-border mb-10">
          <span className="font-heading text-brand-red text-xs tracking-widest uppercase border border-brand-red/40 px-3 py-1.5 mb-5 inline-block">
            On the Road
          </span>
          <h1 className="font-display uppercase text-5xl sm:text-6xl text-white leading-none">
            Upcoming <span className="text-brand-red">Shows</span>
          </h1>
          <p className="font-body text-brand-muted text-base mt-3 max-w-xl leading-relaxed">
            Catch Rebound Rock Band live across South Florida. Check back often — new dates added regularly.
          </p>
        </div>

        {/* Shows grid */}
        {shows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-14">
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-brand-border mb-14">
            <p className="font-heading text-brand-muted text-xs tracking-widest uppercase">
              New dates being announced — check back soon
            </p>
          </div>
        )}

        {/* Booking pitch */}
        <div className="p-8 border border-brand-border bg-brand-surface rounded-sm text-center">
          <h2 className="font-display uppercase text-3xl text-white mb-3">Want Us at Your Venue?</h2>
          <p className="font-body text-brand-muted text-sm max-w-md mx-auto mb-6 leading-relaxed">
            We&apos;re always looking for great venues and events. Reach out to book Rebound Rock Band at your
            bar, restaurant, festival, or private event.
          </p>
          <Link
            href="/booking"
            className="inline-block font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-3.5 hover:bg-brand-red-bright transition-colors btn-glow-red"
          >
            Contact Us for Booking
          </Link>
        </div>
      </div>
    </div>
  )
}
