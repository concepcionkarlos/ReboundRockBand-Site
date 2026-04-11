import { merch } from '@/lib/data'
import SectionHeader from '@/components/ui/SectionHeader'
import Link from 'next/link'

export default function MerchPreview() {
  const visible = merch.filter((m) => m.visible)

  return (
    <section className="bg-brand-bg border-t border-brand-border py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <SectionHeader
            eyebrow="Rep the Band"
            title="Official Merch"
            titleHighlight="Merch"
            align="left"
          />
          <Link
            href="/merch"
            className="font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted hover:border-brand-red hover:text-brand-red transition-colors px-4 py-2 self-start sm:self-auto flex-shrink-0"
          >
            Shop All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex flex-col border border-brand-border bg-brand-surface rounded-sm overflow-hidden hover:border-brand-red/40 transition-colors group"
            >
              {/* Product image */}
              <div className="aspect-square bg-brand-elevated flex flex-col items-center justify-center gap-2">
                <svg
                  className="w-12 h-12 text-brand-muted/25 group-hover:text-brand-muted/40 transition-colors"
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
                <span className="font-body text-[10px] text-brand-muted/50 uppercase tracking-widest">
                  Coming Soon
                </span>
              </div>

              {/* Info + CTA */}
              <div className="flex flex-col flex-1 p-4 gap-4">
                <div className="flex items-start justify-between gap-2 flex-1">
                  <div className="min-w-0">
                    <h3 className="font-heading text-sm text-white tracking-wide leading-snug">{item.name}</h3>
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
                      className="block text-center font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-colors btn-glow-red"
                    >
                      Buy Now
                    </a>
                  ) : (
                    <Link
                      href="/merch"
                      className="block text-center font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted px-4 py-2.5 hover:border-brand-red hover:text-brand-red transition-colors"
                    >
                      View Item
                    </Link>
                  )
                ) : (
                  <div className="text-center font-heading text-xs uppercase tracking-widest text-brand-muted/50 border border-brand-border py-2.5">
                    Sold Out
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
