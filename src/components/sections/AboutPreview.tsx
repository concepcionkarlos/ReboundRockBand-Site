import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import { siteContent } from '@/lib/data'

export default function AboutPreview() {
  return (
    <section className="bg-brand-bg py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Visual side */}
          <div className="w-full max-w-sm lg:max-w-md flex-shrink-0">
            <div className="relative aspect-square bg-brand-elevated border border-brand-border rounded-sm overflow-hidden flex items-center justify-center">
              {/* Placeholder until real band photo is added */}
              <div className="text-center px-8 py-10">
                <div
                  className="font-display text-8xl text-brand-red leading-none mb-4"
                  style={{ textShadow: '0 0 40px rgba(224,16,30,0.5)' }}
                >
                  LIVE.
                </div>
                <p className="font-heading text-xs text-brand-muted tracking-widest uppercase">
                  Rebound Rock Band
                </p>
                <p className="font-body text-xs text-brand-muted/50 mt-1">Band photo coming soon</p>
              </div>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-brand-red/40" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-brand-red/40" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-brand-red/40" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-brand-red/40" />
            </div>
          </div>

          {/* Text side */}
          <div className="flex-1 min-w-0">
            <SectionHeader
              eyebrow="The Band"
              title="Who We Are"
              titleHighlight="We Are"
              align="left"
              className="mb-6"
            />
            <div className="space-y-4 font-body text-gray-300 leading-relaxed text-base mb-8">
              {siteContent.aboutText.slice(0, 2).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <Link
              href="/about"
              className="inline-block font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-6 py-3 hover:bg-brand-red-bright transition-colors btn-glow-red"
            >
              Meet the Band
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
