import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import { readContent } from '@/lib/store'
import type { MediaItem, SiteContent } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Media',
  description: 'Watch and listen to Rebound Rock Band — live performance videos and photos.',
}

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <div className="group relative aspect-video overflow-hidden bg-brand-elevated border border-brand-border hover:border-brand-red/40 transition-colors">
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
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-brand-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  )
}

function SocialPills({ siteContent, label }: { siteContent: SiteContent; label?: string }) {
  type Platform = { label: string; href: string; path: string }
  const platforms: Platform[] = []
  if (siteContent.facebook) platforms.push({ label: 'Facebook', href: siteContent.facebook, path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' })
  if (siteContent.instagram) platforms.push({ label: 'Instagram', href: siteContent.instagram, path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' })
  if (siteContent.youtube) platforms.push({ label: 'YouTube', href: siteContent.youtube, path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' })

  if (platforms.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {label && <span className="font-body text-xs text-brand-muted/50">{label}</span>}
      {platforms.map((p) => (
        <a
          key={p.label}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading text-[10px] uppercase tracking-widest border border-white/15 text-white/40 hover:border-brand-red hover:text-brand-red transition-all px-3 py-1.5 flex items-center gap-1.5"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d={p.path} /></svg>
          {p.label}
        </a>
      ))}
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
              {/* Social callout below featured */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="font-body text-xs text-brand-muted/60">New clips added regularly</span>
                <SocialPills siteContent={siteContent} />
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
                    Fresh photos and live clips are added regularly. Follow us on social for the latest from the road.
                  </p>
                  <div className="flex items-center justify-center flex-wrap gap-2">
                    <SocialPills siteContent={siteContent} />
                  </div>
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
