import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import { readContent } from '@/lib/store'

export default function MediaPreview() {
  const { mediaItems, siteContent } = readContent()
  const visible = mediaItems.filter((m) => m.visible !== false)
  const featured = visible.find((m) => m.type === 'video' && m.isFeatured) ?? visible[0]

  return (
    <section className="bg-brand-surface border-t border-brand-border py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
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

        {/* Featured video */}
        {featured && featured.type === 'video' && (
          <Link href="/media" className="block group">
            <div className="relative w-full aspect-video bg-brand-elevated border border-brand-border overflow-hidden">
              <video
                src={featured.url}
                className="w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-opacity duration-500"
                muted
                loop
                playsInline
                autoPlay
                poster={featured.poster}
              />
              {/* Overlay */}
              <div className="absolute inset-0 flex items-end p-7 lg:p-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none">
                <div>
                  <div className="font-heading text-[10px] text-brand-red uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse-slow" />
                    {featured.caption || 'Live Performance'}
                  </div>
                  <div className="font-display text-4xl lg:text-6xl text-white uppercase leading-none">
                    Watch the Show
                  </div>
                </div>
              </div>
              {/* Top-left corner bracket */}
              <div className="absolute top-4 left-4 w-7 h-7 border-l-2 border-t-2 border-brand-red/60 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-7 h-7 border-r-2 border-b-2 border-brand-red/60 pointer-events-none" />
              {/* Hover play indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Social pitch bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border border-brand-border bg-brand-elevated/60">
          <p className="font-body text-sm text-brand-text">
            New photos and live clips added regularly. Follow for updates.
          </p>
          <div className="flex gap-2.5 flex-shrink-0">
            {siteContent.facebook && (
              <a
                href={siteContent.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted hover:border-brand-red hover:text-brand-red transition-all px-4 py-2"
              >
                Facebook
              </a>
            )}
            <Link
              href="/media"
              className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2 hover:bg-brand-red-bright transition-all btn-glow-red"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
