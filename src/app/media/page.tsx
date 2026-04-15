import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import { readContent } from '@/lib/store'
import type { MediaItem } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Media',
  description: 'Watch and listen to Rebound Rock Band — live performance videos and photos.',
}

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <div className="group relative aspect-[4/5] overflow-hidden bg-brand-elevated border border-brand-border hover:border-brand-red/40 transition-colors">
      {item.type === 'video' ? (
        <video src={item.url} controls poster={item.poster} className="w-full h-full object-cover" />
      ) : (
        <Image
          src={item.url}
          alt={item.caption}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      )}
      {item.caption && (
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-brand-bg via-brand-bg/70 to-transparent pointer-events-none">
          <div className="font-heading text-[10px] text-brand-red uppercase tracking-widest mb-0.5">{item.type}</div>
          <div className="font-body text-sm text-white truncate">{item.caption}</div>
        </div>
      )}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-red origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
    </div>
  )
}

export default function MediaPage() {
  const { mediaItems, siteContent } = readContent()
  const visible = mediaItems.filter((m) => m.visible !== false)
  const featured = visible.filter((m) => m.isFeatured)
  const rest = visible.filter((m) => !m.isFeatured)
  const isEmpty = visible.length === 0

  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <Reveal>
          <div className="py-12 border-b border-brand-border mb-12">
            <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
              <span className="w-5 h-px bg-brand-red/60" />
              Watch &amp; Listen
            </div>
            <h1 className="font-display uppercase text-5xl sm:text-7xl text-white leading-none mb-3">
              Media <span className="text-brand-red">Gallery</span>
            </h1>
            <p className="font-body text-brand-muted text-base max-w-xl leading-relaxed">
              Live videos and photos from Rebound Rock Band shows across {siteContent.serviceArea}.
            </p>
          </div>
        </Reveal>

        {/* Featured spotlight */}
        {featured.length > 0 && (
          <Reveal delay={1}>
            <section className="mb-10">
              <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
                <span className="w-5 h-px bg-brand-red/60" />
                Featured
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {featured.map((item) => (
                  <div key={item.id} className="relative aspect-video bg-brand-elevated border border-brand-border overflow-hidden group">
                    {item.type === 'video' ? (
                      <video src={item.url} controls poster={item.poster ?? '/logo-improved.png'} className="w-full h-full object-cover" />
                    ) : (
                      <Image src={item.url} alt={item.caption} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                    )}
                    <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-brand-red pointer-events-none" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-brand-red pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-brand-red pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-brand-red pointer-events-none" />
                  </div>
                ))}
              </div>
              {/* Facebook callout below featured */}
              <div className="mt-4 flex items-center justify-end gap-3">
                <span className="font-body text-xs text-brand-muted/60">New clips added regularly</span>
                <a
                  href={siteContent.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-[10px] uppercase tracking-widest border border-white/15 text-white/40 hover:border-brand-red hover:text-brand-red transition-all px-3 py-1.5 flex items-center gap-1.5"
                >
                  Follow on Facebook
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </section>
          </Reveal>
        )}

        {/* Gallery grid (non-featured) */}
        {rest.length > 0 && (
          <Reveal delay={2}>
            <section className="mb-14">
              <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
                <span className="w-5 h-px bg-brand-red/60" />
                More Media
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {rest.map((item) => <MediaCard key={item.id} item={item} />)}
              </div>
            </section>
          </Reveal>
        )}

        {/* Empty state — only show when there's truly nothing */}
        {isEmpty && (
          <Reveal delay={1}>
            <section className="mb-14">
              <div className="relative border border-brand-border bg-brand-surface p-10 lg:p-14 overflow-hidden text-center">
                <div className="absolute top-0 inset-x-0 h-px divider-red" />
                <div className="absolute inset-0 bg-stripe-texture pointer-events-none opacity-40" />
                <div className="relative z-10 max-w-lg mx-auto">
                  <h2 className="font-display uppercase text-3xl text-white mb-3">
                    Media <span className="text-brand-red">Coming Soon</span>
                  </h2>
                  <p className="font-body text-brand-muted text-sm leading-relaxed mb-6">
                    Fresh photos and live clips are added regularly. Follow us on Facebook for the latest from the road.
                  </p>
                  <a
                    href={siteContent.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest border border-white/25 text-white px-5 py-2.5 hover:border-brand-red hover:text-brand-red transition-all"
                  >
                    Follow on Facebook
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* Booking pitch */}
        <Reveal>
          <div className="relative p-8 border border-brand-border bg-brand-surface text-center overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px divider-red" />
            <h2 className="font-display uppercase text-3xl text-white mb-3">Saw Us Live?</h2>
            <p className="font-body text-brand-muted text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Tag us on social media or reach out to book Rebound Rock Band for your next event.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/booking" className="inline-block font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-3.5 hover:bg-brand-red-bright transition-all btn-glow-red">
                {siteContent.ctaPrimaryLabel}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
