import type { Metadata } from 'next'
import { merch } from '@/lib/data'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Merch',
  description: 'Official Rebound Rock Band merchandise — tees, hats, stickers and more.',
}

export default function MerchPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="py-14 border-b border-brand-border mb-12">
          <SectionHeader
            eyebrow="Rep the Band"
            title="Official Merch"
            titleHighlight="Merch"
            subtitle="Tees, hats, stickers, and more. Available at shows and online."
            align="left"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {merch.map((item) => (
            <div
              key={item.id}
              className="border border-brand-border bg-brand-surface rounded-sm overflow-hidden hover:border-brand-red/40 transition-colors group"
            >
              {/* Image placeholder */}
              <div className="aspect-square bg-brand-elevated flex flex-col items-center justify-center gap-2">
                <svg className="w-12 h-12 text-brand-muted/30 group-hover:text-brand-muted/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-body text-xs text-brand-muted uppercase tracking-widest">Photo Coming Soon</span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-heading text-sm text-white tracking-wide">{item.name}</h3>
                    <span className="font-body text-xs text-brand-muted capitalize mt-0.5 block">{item.category}</span>
                  </div>
                  <span className="font-display text-2xl text-brand-red flex-shrink-0">${item.price}</span>
                </div>

                {item.available ? (
                  <Button href="mailto:booking@reboundrockband.com" variant="primary" size="sm" className="w-full" external>
                    Inquire to Order
                  </Button>
                ) : (
                  <div className="font-heading text-xs uppercase tracking-widest text-brand-muted text-center border border-brand-border py-2">
                    Sold Out
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center border border-brand-border bg-brand-surface p-8 rounded-sm">
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
