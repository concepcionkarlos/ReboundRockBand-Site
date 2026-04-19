import type { Metadata } from 'next'
import { readContent } from '@/lib/store'
import ShowCard from '@/components/ui/ShowCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shows & Events',
  description: 'Upcoming Rebound Rock Band shows and live performances across South Florida.',
}

export default async function ShowsPage() {
  const { shows, siteContent } = await readContent()
  const visibleShows = shows
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.date.localeCompare(b.date))
  const featuredShows = visibleShows.filter((s) => s.isFeatured)
  const regularShows = visibleShows.filter((s) => !s.isFeatured)

  return (
    <div className="pt-24 pb-24 min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <div className="py-14 border-b border-brand-border mb-14">
          <div className="flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-6">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
            On the Road
          </div>
          <h1 className="font-display uppercase text-5xl sm:text-7xl text-white leading-[0.9] mb-4">
            Upcoming <span className="text-brand-red">Shows</span>
          </h1>
          <p className="font-body text-brand-text text-base max-w-xl leading-relaxed">
            Catch Rebound Rock Band live across South Florida. Check back often — new dates added regularly.
          </p>
        </div>

        {visibleShows.length > 0 ? (
          <div className="mb-16">
            {/* Featured shows */}
            {featuredShows.length > 0 && (
              <div className="mb-10">
                <h2 className="font-heading text-[11px] uppercase tracking-[0.2em] text-brand-muted mb-5 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse-slow" />
                  Highlighted Shows
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {featuredShows.map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
                </div>
              </div>
            )}

            {/* All other shows */}
            {regularShows.length > 0 && (
              <div>
                <h2 className="font-heading text-[11px] uppercase tracking-[0.2em] text-brand-muted mb-5 flex items-center gap-3">
                  <span className="w-6 h-px bg-brand-border" />
                  All Upcoming Dates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {regularShows.map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 border border-brand-border mb-16 flex flex-col items-center gap-5 bg-brand-surface">
            <p className="font-heading text-brand-muted text-xs tracking-widest uppercase">
              New dates are always in the works — follow us on Facebook for announcements
            </p>
            {siteContent.facebook && (
              <a
                href={siteContent.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-heading text-[10px] uppercase tracking-widest text-brand-muted hover:text-brand-red transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Follow on Facebook
              </a>
            )}
          </div>
        )}

        {/* Booking pitch */}
        <div className="relative p-10 lg:p-14 border border-brand-border bg-brand-surface overflow-hidden text-center">
          <div className="absolute inset-0 bg-stripe-texture pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-px divider-red" />
          <div className="absolute bottom-0 inset-x-0 h-px divider-red" />
          <div className="relative z-10">
            <h2 className="font-display uppercase text-3xl sm:text-5xl text-white leading-[0.92] mb-4">
              Want Us at Your <span className="text-brand-red">Venue?</span>
            </h2>
            <p className="font-body text-brand-text text-sm max-w-md mx-auto mb-8 leading-relaxed">
              We&apos;re always looking for great venues and events. Reach out to book Rebound Rock Band at your
              bar, restaurant, festival, or private event.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/booking"
                className="inline-block font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-9 py-4 hover:bg-brand-red-bright transition-all btn-glow-red"
              >
                Contact Us for Booking
              </Link>
              <Link
                href="/epk"
                className="inline-block font-heading text-sm uppercase tracking-widest border border-white/20 text-white/85 px-9 py-4 hover:border-brand-red hover:text-brand-red transition-all"
              >
                View Press Kit
              </Link>
              {siteContent.facebook && (
                <a
                  href={siteContent.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-heading text-sm uppercase tracking-widest border border-brand-border text-brand-muted px-9 py-4 hover:border-brand-red hover:text-brand-red transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Follow on Facebook
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
