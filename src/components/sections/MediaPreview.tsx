import SectionHeader from '@/components/ui/SectionHeader'
import Link from 'next/link'

export default function MediaPreview() {
  return (
    <section className="bg-brand-surface border-t border-brand-border py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <SectionHeader
            eyebrow="Watch & Listen"
            title="Live in Action"
            titleHighlight="in Action"
            align="left"
          />
          <Link
            href="/media"
            className="font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted hover:border-brand-red hover:text-brand-red transition-all px-4 py-2 self-start sm:self-auto flex-shrink-0 inline-flex items-center gap-1.5"
          >
            Full Gallery
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Video + photos grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Featured video — spans 2 cols on desktop */}
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-video bg-brand-elevated border border-brand-border overflow-hidden group">
              <video
                src="/videos/live-performance.mp4"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                muted
                loop
                playsInline
                autoPlay
              />
              {/* Overlay */}
              <div className="absolute inset-0 flex items-end p-5 lg:p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none">
                <div>
                  <div className="font-heading text-[10px] text-brand-red uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse-slow" />
                    Live Performance
                  </div>
                  <div className="font-display text-2xl lg:text-3xl text-white uppercase leading-none">
                    Watch the Show
                  </div>
                </div>
              </div>
              {/* Hover play indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Photo placeholders */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="aspect-video lg:aspect-auto lg:flex-1 bg-brand-elevated border border-brand-border flex flex-col items-center justify-center gap-2.5 min-h-[120px] group hover:border-brand-red/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full border border-brand-border/60 flex items-center justify-center group-hover:border-brand-red/40 transition-colors">
                  <svg
                    className="w-5 h-5 text-brand-muted/30 group-hover:text-brand-muted/50 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-body text-[10px] text-brand-muted/40 uppercase tracking-widest">
                  Photo Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA below */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-brand-border bg-brand-elevated/50">
          <p className="font-body text-sm text-brand-muted">
            More photos and videos added regularly. Follow us on social for the latest.
          </p>
          <Link
            href="/media"
            className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all btn-glow-red flex-shrink-0"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  )
}
