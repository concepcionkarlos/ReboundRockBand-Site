import type { Metadata } from 'next'
import SectionHeader from '@/components/ui/SectionHeader'

export const metadata: Metadata = {
  title: 'Media',
  description: 'Watch and listen to Rebound Rock Band — live performance videos and photos.',
}

export default function MediaPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="py-14 border-b border-brand-border mb-12">
          <SectionHeader
            eyebrow="Watch & Listen"
            title="Media Gallery"
            titleHighlight="Gallery"
            subtitle="Live videos and photos from our shows across South Florida."
            align="left"
          />
        </div>

        {/* Featured video */}
        <section className="mb-14">
          <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-5">Live Video</h2>
          <div className="relative aspect-video max-w-3xl bg-brand-elevated border border-brand-border rounded-sm overflow-hidden">
            <video
              src="/videos/live-performance.mp4"
              controls
              className="w-full h-full object-cover"
              poster="/images/logo.jpeg"
            />
          </div>
        </section>

        {/* Photo grid */}
        <section>
          <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-5">Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-brand-elevated border border-brand-border rounded-sm flex flex-col items-center justify-center gap-2 text-brand-muted hover:border-brand-red/30 transition-colors"
              >
                <svg className="w-8 h-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-body text-xs uppercase tracking-widest opacity-50">Photo {i + 1}</span>
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-brand-muted mt-4">
            Band photos will be added soon. Check our{' '}
            <a href="https://instagram.com/reboundrockband" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
              Instagram
            </a>{' '}
            for the latest shots.
          </p>
        </section>
      </div>
    </div>
  )
}
