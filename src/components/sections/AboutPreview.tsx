import Image from 'next/image'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import { siteContent } from '@/lib/data'

export default function AboutPreview() {
  return (
    <section className="bg-brand-bg py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Photo side */}
          <div className="w-full max-w-sm lg:max-w-md flex-shrink-0">
            <div className="relative aspect-[3/4] overflow-hidden group">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 border-brand-red z-20" />
              <div className="absolute top-0 right-0 w-10 h-10 border-r-2 border-t-2 border-brand-red z-20" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-l-2 border-b-2 border-brand-red z-20" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-r-2 border-b-2 border-brand-red z-20" />

              {/* Real band photo — anchor 20% from top so faces show in the portrait crop */}
              <Image
                src="/Band Members.PNG"
                alt="Rebound Rock Band — all 5 members"
                fill
                className="object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-700"
              />

              {/* Subtle bottom vignette only — no text overlay, no repeated stats */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
            </div>
          </div>

          {/* Text side */}
          <div className="flex-1 min-w-0">
            <SectionHeader
              eyebrow="The Band"
              title="Who We Are"
              titleHighlight="We Are"
              align="left"
              className="mb-7"
            />
            <div className="space-y-4 font-body text-gray-300/85 leading-relaxed text-base mb-8">
              {siteContent.aboutText.slice(0, 2).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-6 py-3 hover:bg-brand-red-bright transition-all btn-glow-red"
              >
                Meet the Band
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/epk"
                className="inline-block font-heading text-sm uppercase tracking-widest border border-white/25 text-white/80 px-6 py-3 hover:border-brand-red hover:text-brand-red transition-all"
              >
                Press Kit
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
