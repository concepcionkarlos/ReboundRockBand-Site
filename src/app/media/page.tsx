import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Media',
  description: 'Watch and listen to Rebound Rock Band — live performance videos and photos.',
}

export default function MediaPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <div className="py-12 border-b border-brand-border mb-12">
          <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
            <span className="w-5 h-px bg-brand-red/60" />
            Watch &amp; Listen
          </div>
          <h1 className="font-display uppercase text-5xl sm:text-7xl text-white leading-none mb-3">
            Media <span className="text-brand-red">Gallery</span>
          </h1>
          <p className="font-body text-brand-muted text-base max-w-xl leading-relaxed">
            Live videos and photos from Rebound Rock Band shows across South Florida.
          </p>
        </div>

        {/* Featured video */}
        <section className="mb-14">
          <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
            <span className="w-5 h-px bg-brand-red/60" />
            Live Video
          </div>
          <div className="relative w-full max-w-5xl aspect-video bg-brand-elevated border border-brand-border overflow-hidden group">
            <video
              src="/videos/live-performance.mp4"
              controls
              className="w-full h-full object-cover"
              poster="/logo-improved.png"
            />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-brand-red pointer-events-none" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-brand-red pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-brand-red pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-brand-red pointer-events-none" />
          </div>
        </section>

        {/* Photo grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase">
              <span className="w-5 h-px bg-brand-red/60" />
              Photos
            </div>
            <span className="font-heading text-[10px] text-brand-muted uppercase tracking-widest">Coming Soon</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-brand-elevated border border-brand-border flex flex-col items-center justify-center gap-2.5 group hover:border-brand-red/30 transition-all"
              >
                <div className="w-10 h-10 rounded-full border border-brand-border/50 flex items-center justify-center group-hover:border-brand-red/30 transition-colors">
                  <svg className="w-5 h-5 text-brand-muted/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-body text-[10px] uppercase tracking-widest text-brand-muted/30">Photo {i + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between gap-4 p-4 border border-brand-border bg-brand-surface">
            <p className="font-body text-sm text-brand-muted">
              More photos coming soon. Follow us on{' '}
              <a
                href="https://instagram.com/reboundrockband"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-red hover:text-brand-red-bright transition-colors"
              >
                @reboundrockband
              </a>
              {' '}for live updates.
            </p>
            <a
              href="https://instagram.com/reboundrockband"
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted px-4 py-2 hover:border-brand-red hover:text-brand-red transition-all flex-shrink-0"
            >
              Instagram
            </a>
          </div>
        </section>

        {/* Booking pitch */}
        <div className="relative p-8 border border-brand-border bg-brand-surface text-center overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px divider-red" />
          <h2 className="font-display uppercase text-3xl text-white mb-3">Saw Us Live?</h2>
          <p className="font-body text-brand-muted text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Tag us on social media or reach out to book Rebound Rock Band for your next event.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/booking"
              className="inline-block font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-3.5 hover:bg-brand-red-bright transition-all btn-glow-red"
            >
              Book the Band
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
