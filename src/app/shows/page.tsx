import type { Metadata } from 'next'
import { shows } from '@/lib/data'
import ShowCard from '@/components/ui/ShowCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shows & Events',
  description: 'Upcoming Rebound Rock Band shows and live performances across South Florida.',
}

export default function ShowsPage() {
  const featuredShows = shows.filter((s) => s.isFeatured)
  const regularShows = shows.filter((s) => !s.isFeatured)

  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <div className="py-12 border-b border-brand-border mb-12">
          <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
            <span className="w-5 h-px bg-brand-red/60" />
            On the Road
          </div>
          <h1 className="font-display uppercase text-5xl sm:text-7xl text-white leading-none mb-3">
            Upcoming <span className="text-brand-red">Shows</span>
          </h1>
          <p className="font-body text-brand-muted text-base max-w-xl leading-relaxed">
            Catch Rebound Rock Band live across South Florida. Check back often — new dates added regularly.
          </p>
        </div>

        {shows.length > 0 ? (
          <div className="mb-14">
            {/* Featured shows */}
            {featuredShows.length > 0 && (
              <div className="mb-8">
                <h2 className="font-heading text-[11px] uppercase tracking-[0.2em] text-brand-muted mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse-slow" />
                  Highlighted Shows
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {featuredShows.map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
                </div>
              </div>
            )}

            {/* All other shows */}
            {regularShows.length > 0 && (
              <div>
                <h2 className="font-heading text-[11px] uppercase tracking-[0.2em] text-brand-muted mb-4 flex items-center gap-3">
                  <span className="w-5 h-px bg-brand-border" />
                  All Upcoming Dates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {regularShows.map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 border border-brand-border mb-14">
            <p className="font-heading text-brand-muted text-xs tracking-widest uppercase">
              New dates being announced — check back soon
            </p>
          </div>
        )}

        {/* Booking pitch */}
        <div className="relative p-8 lg:p-10 border border-brand-border bg-brand-surface overflow-hidden text-center">
          <div className="absolute inset-0 bg-stripe-texture pointer-events-none opacity-50" />
          <div className="absolute top-0 inset-x-0 h-px divider-red" />
          <div className="relative z-10">
            <h2 className="font-display uppercase text-3xl sm:text-4xl text-white mb-3">Want Us at Your Venue?</h2>
            <p className="font-body text-brand-muted text-sm max-w-md mx-auto mb-7 leading-relaxed">
              We&apos;re always looking for great venues and events. Reach out to book Rebound Rock Band at your
              bar, restaurant, festival, or private event.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/booking"
                className="inline-block font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-3.5 hover:bg-brand-red-bright transition-all btn-glow-red"
              >
                Contact Us for Booking
              </Link>
              <Link
                href="/epk"
                className="inline-block font-heading text-sm uppercase tracking-widest border border-white/25 text-white px-8 py-3.5 hover:border-brand-red hover:text-brand-red transition-all"
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
