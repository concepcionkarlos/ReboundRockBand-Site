import { merch } from '@/lib/data'
import SectionHeader from '@/components/ui/SectionHeader'
import Link from 'next/link'

const categoryIcons: Record<string, React.ReactNode> = {
  tshirt: (
    <svg className="w-10 h-10 text-brand-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  hat: (
    <svg className="w-10 h-10 text-brand-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5C7 4.5 3 7.5 3 11h18c0-3.5-4-6.5-9-6.5zM3 11v2h18v-2" />
    </svg>
  ),
  sticker: (
    <svg className="w-10 h-10 text-brand-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  other: (
    <svg className="w-10 h-10 text-brand-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
}

export default function MerchPreview() {
  const visible = merch.filter((m) => m.visible)

  return (
    <section className="bg-brand-bg border-t border-brand-border py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <SectionHeader
            eyebrow="Rep the Band"
            title="Official Merch"
            titleHighlight="Merch"
            align="left"
          />
          <Link
            href="/merch"
            className="font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted hover:border-brand-red hover:text-brand-red transition-all px-4 py-2 self-start sm:self-auto flex-shrink-0 inline-flex items-center gap-1.5"
          >
            Shop All
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex flex-col border border-brand-border bg-brand-surface overflow-hidden hover:border-brand-red/40 transition-all duration-200 group card-hover"
            >
              {/* Product image area */}
              <div className="relative aspect-square bg-brand-elevated flex flex-col items-center justify-center gap-3 overflow-hidden">
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/4 transition-colors duration-300" />
                {categoryIcons[item.category] || categoryIcons.other}
                <span className="font-heading text-[10px] text-brand-muted/40 uppercase tracking-widest">
                  Coming Soon
                </span>

                {/* Price badge */}
                <div className="absolute top-3 right-3 font-display text-xl text-brand-red leading-none">
                  ${item.price}
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3 font-heading text-[9px] uppercase tracking-widest text-brand-muted/60 border border-brand-border px-2 py-0.5 bg-brand-bg/80">
                  {item.category}
                </div>
              </div>

              {/* Info + CTA */}
              <div className="flex flex-col gap-3 p-4">
                <div>
                  <h3 className="font-heading text-sm text-white tracking-wide">{item.name}</h3>
                </div>

                {item.available ? (
                  item.externalUrl ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-all btn-glow-red"
                    >
                      Buy Now
                    </a>
                  ) : (
                    <Link
                      href="/merch"
                      className="block text-center font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted px-4 py-2.5 hover:border-brand-red hover:text-brand-red transition-all"
                    >
                      View Item
                    </Link>
                  )
                ) : (
                  <div className="text-center font-heading text-xs uppercase tracking-widest text-brand-muted/40 border border-brand-border py-2.5">
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
