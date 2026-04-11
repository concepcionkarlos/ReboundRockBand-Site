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
        <div className="py-12 border-b border-brand-border mb-10">
          <span className="font-heading text-brand-red text-xs tracking-widest uppercase border border-brand-red/40 px-3 py-1.5 mb-5 inline-block">
            Watch & Listen
          </span>
          <h1 className="font-display uppercase text-5xl sm:text-6xl text-white leading-none">
            Media <span className="text-brand-red">Gallery</span>
          </h1>
          <p className="font-body text-brand-muted text-base mt-3 max-w-xl leading-relaxed">
            Live videos and photos from Rebound Rock Band shows across South Florida.
          </p>
        </div>

        {/* Featured video */}
        <section className="mb-12">
          <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-4">Live Video</h2>
          <div className="relative w-full max-w-4xl aspect-video bg-brand-elevated border border-brand-border rounded-sm overflow-hidden">
            <video
              src="/videos/live-performance.mp4"
              controls
              className="w-full h-full object-cover"
              poster="/logo-improved.png"
            />
          </div>
        </section>

        {/* Photo grid */}
        <section>
          <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-4">Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-brand-elevated border border-brand-border rounded-sm flex flex-col items-center justify-center gap-2 text-brand-muted hover:border-brand-red/30 transition-colors"
              >
                <svg className="w-7 h-7 opacity-25" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-body text-[10px] uppercase tracking-widest opacity-40">Photo {i + 1}</span>
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-brand-muted mt-4">
            More photos coming soon. Follow us on{' '}
            <a
              href="https://instagram.com/reboundrockband"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red hover:underline"
            >
              Instagram
            </a>{' '}
            for the latest.
          </p>
        </section>
      </div>
    </div>
  )
}
