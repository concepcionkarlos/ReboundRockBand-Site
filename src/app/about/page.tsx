import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import { readContent } from '@/lib/store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About the Band',
  description: 'Meet Rebound Rock Band — South Florida\'s 5-piece live classic rock cover band.',
}

export default function AboutPage() {
  const { bandMembers, siteContent } = readContent()
  const visibleMembers = bandMembers.filter((m) => m.visible !== false)

  return (
    <div className="min-h-screen bg-brand-bg">

      {/* ── Page hero — text only ── */}
      <Reveal>
        <section className="relative overflow-hidden pt-36 pb-14 lg:pb-16">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[380px] rounded-full bg-brand-red/5 blur-[140px] pointer-events-none" />
          <div className="absolute inset-0 bg-grid-texture opacity-35 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-px divider-red pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10">
            <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-6">
              <span className="w-5 h-px bg-brand-red/60" />
              The Band
            </div>
            <h1
              className="font-display uppercase leading-[0.95] text-white max-w-5xl"
              style={{ fontSize: 'clamp(3.25rem, 9vw, 6.5rem)' }}
            >
              {siteContent.aboutHeadline.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-brand-red">{siteContent.aboutHeadline.split(' ').slice(-1)}</span>
            </h1>
          </div>
        </section>
      </Reveal>

      {/* ── Group photo ── */}
      {siteContent.groupPhoto && (
        <Reveal delay={1}>
          <section className="max-w-7xl mx-auto px-5 lg:px-10 pt-10 pb-0">
            <div className="relative mx-auto w-full max-w-md sm:max-w-lg border border-brand-border bg-brand-elevated overflow-hidden">
              <Image
                src={siteContent.groupPhoto}
                alt="Rebound Rock Band"
                width={1200}
                height={1600}
                className="block w-full h-auto"
                priority
                sizes="(max-width: 640px) 100vw, 512px"
              />
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-brand-red pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-brand-red pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-brand-red pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-brand-red pointer-events-none" />
            </div>
          </section>
        </Reveal>
      )}

      {/* ── Our Story ── */}
      <Reveal delay={1}>
        <section className="max-w-7xl mx-auto px-5 lg:px-10 py-16 lg:py-20 border-b border-brand-border">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
              <span className="w-5 h-px bg-brand-red/60" />
              Our Story
            </div>
            <div className="space-y-5 font-body text-gray-300/80 leading-relaxed text-base lg:text-lg">
              {siteContent.aboutText.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Meet the Band ── */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 lg:pt-20 pb-24">
        <Reveal>
          <div className="flex items-end justify-between gap-6 mb-12 lg:mb-14 flex-wrap">
            <div>
              <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-4">
                <span className="w-5 h-px bg-brand-red/60" />
                The Members
              </div>
              <h2 className="font-display uppercase text-4xl sm:text-5xl lg:text-6xl text-white leading-none">
                Meet the <span className="text-brand-red">Band</span>
              </h2>
            </div>
            <p className="font-body text-sm text-brand-muted max-w-xs leading-relaxed">
              {visibleMembers.length} musicians, one sound. No backing tracks, no shortcuts.
            </p>
          </div>
        </Reveal>

        {/* Member cards */}
        <Reveal delay={1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 mb-20">
            {visibleMembers.map((member) => (
              <div key={member.id} className="group">
                {/* Portrait photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-elevated mb-4">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-[600ms] ease-out"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 18vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-elevated">
                      <svg className="w-10 h-10 text-brand-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-bg/60 to-transparent pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-red origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
                </div>

                {/* Text */}
                <div className="transition-transform duration-300 group-hover:-translate-y-0.5">
                  <div className="font-heading text-[10px] text-brand-red uppercase tracking-widest mb-1 leading-none">
                    {member.role}
                  </div>
                  <div className="font-display text-xl lg:text-2xl text-white uppercase leading-tight mb-1.5">
                    {member.name}
                  </div>
                  <p className="font-body text-xs text-brand-muted leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Booking CTA */}
        <Reveal>
          <div className="relative border-t border-brand-border pt-14 text-center">
            <div className="absolute top-0 inset-x-0 h-px divider-red" />
            <h2 className="font-display uppercase text-4xl sm:text-5xl text-white mb-4">
              Ready to <span className="text-brand-red">Book?</span>
            </h2>
            <p className="font-body text-brand-muted max-w-md mx-auto mb-8 leading-relaxed">
              Get in touch to check availability and pricing for your event.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/booking" className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-all btn-glow-red text-center">
                {siteContent.ctaPrimaryLabel}
              </Link>
              <Link href="/epk" className="font-heading text-sm uppercase tracking-widest border border-white/25 text-white px-8 py-4 hover:border-brand-red hover:text-brand-red transition-all text-center">
                {siteContent.ctaSecondaryLabel}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
