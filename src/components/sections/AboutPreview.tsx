import Link from 'next/link'
import { readContent } from '@/lib/store'

export default function AboutPreview() {
  const { siteContent } = readContent()
  return (
    <section className="relative bg-brand-bg py-24 lg:py-32 overflow-hidden border-t border-brand-border">
      {/* Atmospheric red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[280px] rounded-full bg-brand-red/4 blur-[140px] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid-texture opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-5 lg:px-10 text-center">
        <div className="inline-flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
          <span className="w-5 h-px bg-brand-red/60" />
          The Band
          <span className="w-5 h-px bg-brand-red/60" />
        </div>

        <h2 className="font-display uppercase text-4xl sm:text-5xl lg:text-6xl text-white leading-none mb-6">
          {siteContent.aboutHeadline.split(' ').slice(0, -1).join(' ')}{' '}
          <span className="text-brand-red">{siteContent.aboutHeadline.split(' ').slice(-1)}</span>
        </h2>

        <p className="font-body text-gray-300/80 leading-relaxed text-base lg:text-lg max-w-2xl mx-auto mb-9">
          {siteContent.aboutShort}
        </p>

        <Link
          href="/about"
          className="inline-flex items-center gap-2 font-heading text-sm uppercase tracking-widest border border-white/25 text-white px-7 py-3.5 hover:border-brand-red hover:text-brand-red transition-all"
        >
          Meet the Band
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
