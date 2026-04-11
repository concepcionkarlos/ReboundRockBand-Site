import SectionHeader from '@/components/ui/SectionHeader'
import Link from 'next/link'

export default function MediaPreview() {
  return (
    <section className="bg-brand-surface border-t border-brand-border py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <SectionHeader
            eyebrow="Watch & Listen"
            title="Live in Action"
            titleHighlight="in Action"
            align="left"
          />
          <Link
            href="/media"
            className="font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted hover:border-brand-red hover:text-brand-red transition-colors px-4 py-2 self-start sm:self-auto flex-shrink-0"
          >
            Full Gallery →
          </Link>
        </div>

        {/* Video + photos grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Featured video — spans 2 cols on desktop */}
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-video bg-brand-elevated border border-brand-border rounded-sm overflow-hidden group">
              <video
                src="/videos/live-performance.mp4"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                muted
                loop
                playsInline
                autoPlay
              />
              <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none">
                <div>
                  <div className="font-heading text-xs text-brand-red uppercase tracking-widest mb-1">
                    Live Performance
                  </div>
                  <div className="font-display text-2xl text-white uppercase leading-none">
                    Watch the Show
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo placeholders */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="aspect-video lg:aspect-auto lg:flex-1 bg-brand-elevated border border-brand-border rounded-sm flex flex-col items-center justify-center gap-2 min-h-[120px]"
              >
                <svg
                  className="w-8 h-8 text-brand-muted/30"
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
                <span className="font-body text-[10px] text-brand-muted uppercase tracking-widest">
                  Photo {i}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
