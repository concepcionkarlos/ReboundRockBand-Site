import type { Metadata } from 'next'
import { merch } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Merch',
  description: 'Official Rebound Rock Band merchandise — tees, hats, stickers and more.',
}

const categoryIcons: Record<string, React.ReactNode> = {
  tshirt: (
    <svg className="w-12 h-12 text-brand-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  hat: (
    <svg className="w-12 h-12 text-brand-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8" />
    </svg>
  ),
  sticker: (
    <svg className="w-12 h-12 text-brand-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  other: (
    <svg className="w-12 h-12 text-brand-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
}

export default function MerchPage() {
  const visible = merch.filter((m) => m.visible)

  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <div className="py-12 border-b border-brand-border mb-12">
          <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
            <span className="w-5 h-px bg-brand-red/60" />
            Rep the Band
          </div>
          <h1 className="font-display uppercase text-5xl sm:text-7xl text-white leading-none mb-3">
            Official <span className="text-brand-red">Merch</span>
          </h1>
          <p className="font-body text-brand-muted text-base max-w-xl leading-relaxed">
            Tees, hats, stickers, and more. Available at shows and online.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex flex-col border border-brand-border bg-brand-surface overflow-hidden hover:border-brand-red/40 transition-all duration-200 group card-hover"
            >
              {/* Image area */}
              <div className="relative aspect-square bg-brand-elevated flex flex-col items-center justify-center gap-3 overflow-hidden">
                <div className="absolute inset-0 bg-grid-texture opacity-30" />
                <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/4 transition-colors duration-300" />
                <div className="relative">
                  {categoryIcons[item.category] ?? categoryIcons.other}
                </div>
                <span className="relative font-body text-[10px] text-brand-muted/40 uppercase tracking-widest">Photo Coming Soon</span>
                {/* Price badge */}
                <div className="absolute top-3 right-3 font-display text-2xl text-brand-red leading-none">${item.price}</div>
                {/* Category tag */}
                <div className="absolute top-3 left-3 font-heading text-[9px] uppercase tracking-widest text-brand-muted/60 border border-brand-border bg-brand-bg/80 px-2 py-0.5">
                  {item.category}
                </div>
              </div>

              <div className="flex flex-col flex-1 p-5 gap-4">
                <div>
                  <h2 className="font-heading text-sm text-white tracking-wide">{item.name}</h2>
                </div>

                {item.available ? (
                  item.externalUrl ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-3 hover:bg-brand-red-bright transition-all btn-glow-red"
                    >
                      Buy Now
                    </a>
                  ) : (
                    <a
                      href="mailto:booking@reboundrockband.com"
                      className="block text-center font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted px-4 py-3 hover:border-brand-red hover:text-brand-red transition-all"
                    >
                      Inquire to Order
                    </a>
                  )
                ) : (
                  <div className="text-center font-heading text-xs uppercase tracking-widest text-brand-muted/40 border border-brand-border py-3">
                    Sold Out
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border border-brand-border bg-brand-surface p-8 text-center">
          <p className="font-body text-brand-muted text-sm mb-1.5">Merch is also available at every show.</p>
          <p className="font-body text-brand-muted text-sm">
            For bulk orders or custom items, email{' '}
            <a href="mailto:booking@reboundrockband.com" className="text-brand-red hover:text-brand-red-bright transition-colors">
              booking@reboundrockband.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
