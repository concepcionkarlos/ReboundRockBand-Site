import { merch } from '@/lib/data'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'

export default function MerchPreview() {
  return (
    <section className="bg-brand-bg border-t border-brand-border py-20">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <SectionHeader
            eyebrow="Rep the Band"
            title="Official Merch"
            titleHighlight="Merch"
            align="left"
          />
          <Button href="/merch" variant="outline" size="sm" className="self-start lg:self-auto flex-shrink-0">
            Shop All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {merch.map((item) => (
            <div
              key={item.id}
              className="border border-brand-border bg-brand-surface rounded-sm overflow-hidden group hover:border-brand-red/40 transition-colors"
            >
              {/* Product image placeholder */}
              <div
                className="aspect-square flex flex-col items-center justify-center bg-brand-elevated gap-2"
                style={{ background: item.imagePlaceholder }}
              >
                <div className="w-16 h-16 opacity-30 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-body text-xs text-brand-muted uppercase tracking-widest">Photo Coming Soon</span>
              </div>

              {/* Info */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-sm text-white tracking-wide">{item.name}</h3>
                  <span className="font-body text-xs text-brand-muted capitalize">{item.category}</span>
                </div>
                <div className="font-display text-xl text-brand-red">${item.price}</div>
              </div>

              {/* CTA */}
              <div className="px-4 pb-4">
                <Button href="/merch" variant="outline" size="sm" className="w-full text-center">
                  View Item
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
