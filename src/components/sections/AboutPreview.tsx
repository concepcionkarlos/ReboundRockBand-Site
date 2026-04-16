import Link from 'next/link'
import { readContent } from '@/lib/store'

export default function AboutPreview() {
  const { siteContent } = readContent()
  return (
    <section className="relative bg-brand-bg py-24 lg:py-32 overflow-hidden border-t border-brand-border">
      {/* Atmospheric red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[320px] rounded-full bg-brand-red/[0.05] blur-[150px] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid-texture opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-5 lg:px-10 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 font-heading text-brand-red text-[11px] tracking-[0.22em] uppercase mb-6">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-brand-red/70" />
          The Band
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-brand-red/70" />
        </div>

        <h2 className="font-display uppercase text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.92] mb-7">
          {siteContent.aboutHeadline.split(' ').slice(0, -1).join(' ')}{' '}
          <span className="text-brand-red">{siteContent.aboutHeadline.split(' ').slice(-1)}</span>
        </h2>

        <p className="font-body text-brand-text leading-relaxed text-base lg:text-lg max-w-2xl mx-auto mb-10">
          {siteContent.aboutShort}
        </p>

        <Link
          href="/about"
          className="inline-flex items-center gap-2.5 font-heading text-sm uppercase tracking-widest border border-white/20 text-white/85 px-8 py-4 hover:border-brand-red hover:text-brand-red transition-all"
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
