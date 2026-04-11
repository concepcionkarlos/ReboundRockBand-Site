import type { Metadata } from 'next'
import { merch } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Merch',
  description: 'Official Rebound Rock Band merchandise — tees, hats, stickers and more.',
}

export default function MerchPage() {
  const visible = merch.filter((m) => m.visible)

  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <div className="py-12 border-b border-brand-border mb-10">
          <span className="font-heading text-brand-red text-xs tracking-widest uppercase border border-brand-red/40 px-3 py-1.5 mb-5 inline-block">
            Rep the Band
          </span>
          <h1 className="font-display uppercase text-5xl sm:text-6xl text-white leading-none">
            Official <span className="text-brand-red">Merch</span>
          </h1>
          <p className="font-body text-brand-muted text-base mt-3 max-w-xl leading-relaxed">
            Tees, hats, stickers, and more. Available at shows and online.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex flex-col border border-brand-border bg-brand-surface rounded-sm overflow-hidden hover:border-brand-red/40 transition-colors group"
            >
              {/* Image */}
              <div className="aspect-square bg-brand-elevated flex flex-col items-center justify-center gap-2">
                <svg
                  className="w-12 h-12 text-brand-muted/25 group-hover:text-brand-muted/40 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-body text-[10px] text-brand-muted/50 uppercase tracking-widest">Photo Coming Soon</span>
              </div>

              <div className="flex flex-col flex-1 p-5 gap-4">
                <div className="flex items-start justify-between gap-2 flex-1">
                  <div>
                    <h2 className="font-heading text-sm text-white tracking-wide leading-snug">{item.name}</h2>
                    <span className="font-body text-xs text-brand-muted capitalize mt-0.5 block">{item.category}</span>
                  </div>
                  <span className="font-display text-2xl text-brand-red flex-shrink-0">${item.price}</span>
                </div>

                {item.available ? (
                  item.externalUrl ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-3 hover:bg-brand-red-bright transition-colors btn-glow-red"
                    >
                      Buy Now
                    </a>
                  ) : (
                    <a
                      href="mailto:booking@reboundrockband.com"
                      className="block text-center font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted px-4 py-3 hover:border-brand-red hover:text-brand-red transition-colors"
                    >
                      Inquire to Order
                    </a>
                  )
                ) : (
                  <div className="text-center font-heading text-xs uppercase tracking-widest text-brand-muted/50 border border-brand-border py-3">
                    Sold Out
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center border border-brand-border bg-brand-surface p-8 rounded-sm">
          <p className="font-body text-brand-muted text-sm mb-1">Merch is also available at every show.</p>
          <p className="font-body text-brand-muted text-sm">
            For bulk orders or custom items, email{' '}
            <a href="mailto:booking@reboundrockband.com" className="text-brand-red hover:underline">
              booking@reboundrockband.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
