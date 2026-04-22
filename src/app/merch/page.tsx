import type { Metadata } from 'next'
import Reveal from '@/components/ui/Reveal'
import SizeGuide from '@/components/ui/SizeGuide'
import MerchGallery from '@/components/merch/MerchGallery'
import { readContent } from '@/lib/store'
import { getLang } from '@/lib/getLang'
import { translations } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Merch',
  description: 'Official Rebound Rock Band merchandise — tees, hats, stickers and more.',
}

const categoryIcons: Record<string, React.ReactNode> = {
  tshirt: (
    <svg className="w-14 h-14 text-brand-muted/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  hat: (
    <svg className="w-14 h-14 text-brand-muted/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8" />
    </svg>
  ),
  sticker: (
    <svg className="w-14 h-14 text-brand-muted/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  other: (
    <svg className="w-14 h-14 text-brand-muted/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
}

export default async function MerchPage() {
  const [{ merch, siteContent }, lang] = await Promise.all([readContent(), getLang()])
  const tr = translations[lang].merch
  const visible = merch.filter((m) => m.visible)

  return (
    <div className="pt-24 pb-24 min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <Reveal>
          <div className="py-14 border-b border-brand-border mb-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-6">
                  <span className="w-8 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
                  {tr.eyebrow}
                </div>
                <h1 className="font-display uppercase text-5xl sm:text-7xl text-white leading-[0.9] mb-4">
                  {tr.heading} <span className="text-brand-red">{tr.headingAccent}</span>
                </h1>
                <p className="font-body text-brand-text text-base max-w-xl leading-relaxed">
                  {tr.sub}
                </p>
              </div>
              {/* Free shipping callout */}
              <div className="flex-shrink-0 border border-brand-border bg-brand-surface px-5 py-4 text-center sm:text-right">
                <div className="font-heading text-[10px] uppercase tracking-widest text-brand-red mb-1">Free Shipping</div>
                <div className="font-body text-xs text-brand-text">On orders over $75</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Product grid */}
        <Reveal delay={1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-14">
            {visible.map((item) => {
              const allImages = item.images && item.images.length > 0
                ? item.images
                : item.image
                  ? [item.image]
                  : []

              return (
                <div key={item.id} className="group flex flex-col">

                  {/* Image section */}
                  {allImages.length > 1 ? (
                    <MerchGallery images={allImages} name={item.name} />
                  ) : allImages.length === 1 ? (
                    <div className="relative aspect-square bg-brand-elevated overflow-hidden border border-brand-border group-hover:border-brand-red/30 transition-colors duration-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={allImages[0]}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                      {!item.available && (
                        <div className="absolute inset-0 bg-brand-bg/75 flex items-center justify-center">
                          <span className="font-heading text-xs uppercase tracking-widest text-white/70 border border-white/30 px-4 py-2">
                            {tr.soldOut}
                          </span>
                        </div>
                      )}
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-red origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="relative aspect-square bg-brand-elevated overflow-hidden border border-brand-border group-hover:border-brand-red/30 transition-colors duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-elevated via-brand-bg to-[#0a0a18] flex flex-col items-center justify-center">
                        <div className="absolute inset-0 bg-grid-texture opacity-20" />
                        <div className="relative flex flex-col items-center gap-3">
                          {categoryIcons[item.category] ?? categoryIcons.other}
                          <span className="font-heading text-[9px] uppercase tracking-widest text-brand-muted/30">{item.category}</span>
                        </div>
                      </div>
                      {!item.available && (
                        <div className="absolute inset-0 bg-brand-bg/75 flex items-center justify-center">
                          <span className="font-heading text-xs uppercase tracking-widest text-white/70 border border-white/30 px-4 py-2">
                            {tr.soldOut}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex flex-col flex-1 pt-5 gap-4">

                    {/* Name + price row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="font-display text-xl text-white uppercase leading-tight">{item.name}</h2>
                        {/* Badges */}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="font-heading text-[9px] uppercase tracking-widest border border-brand-border text-brand-muted/70 px-2 py-0.5">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="font-display text-2xl text-brand-red leading-none flex-shrink-0 pt-0.5">
                        ${item.price}
                      </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="font-body text-sm text-brand-text leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Specs */}
                    {item.specs && item.specs.length > 0 && (
                      <div className="border border-brand-border divide-y divide-brand-border">
                        {item.specs.map((spec) => (
                          <div key={spec.label} className="flex gap-4 px-4 py-2.5">
                            <span className="font-heading text-[10px] uppercase tracking-widest text-brand-muted flex-shrink-0 w-20 self-center">
                              {spec.label}
                            </span>
                            <span className="font-body text-xs text-white/80 self-center">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Size guide — only for tshirts */}
                    {item.category === 'tshirt' && <SizeGuide />}

                    {/* CTA */}
                    {item.available ? (
                      item.externalUrl ? (
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-4 py-4 hover:bg-brand-red-bright transition-all btn-glow-red mt-auto"
                        >
                          {tr.buyNow} — ${item.price}
                        </a>
                      ) : (
                        <a
                          href={`mailto:${siteContent.contactEmail}?subject=Merch Order: ${encodeURIComponent(item.name)}`}
                          className="block text-center font-heading text-sm uppercase tracking-widest border border-brand-red text-brand-red px-4 py-4 hover:bg-brand-red hover:text-white transition-all mt-auto"
                        >
                          {tr.inquire}
                        </a>
                      )
                    ) : (
                      <div className="text-center font-heading text-sm uppercase tracking-widest text-brand-muted border border-brand-border px-4 py-4 mt-auto cursor-not-allowed">
                        Sold Out
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>

        {/* Bottom info */}
        <Reveal delay={2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="border border-brand-border bg-brand-surface p-6 text-center">
              <div className="font-heading text-[10px] uppercase tracking-widest text-brand-red mb-2">Free Shipping</div>
              <p className="font-body text-sm text-brand-text leading-relaxed">
                Free shipping on all orders over $75 in the US.
              </p>
            </div>
            <div className="border border-brand-border bg-brand-surface p-6 text-center">
              <div className="font-heading text-[10px] uppercase tracking-widest text-brand-red mb-2">Bulk & Custom</div>
              <p className="font-body text-sm text-brand-text leading-relaxed">
                Email{' '}
                <a href={`mailto:${siteContent.contactEmail}`} className="text-brand-red hover:underline">
                  {siteContent.contactEmail}
                </a>{' '}
                for bulk orders or event packages.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
