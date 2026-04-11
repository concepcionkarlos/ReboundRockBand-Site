import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { bandMembers, siteContent } from '@/lib/data'

export const metadata: Metadata = {
  title: 'About the Band',
  description: 'Meet Rebound Rock Band — South Florida\'s 5-piece live classic rock cover band.',
}

export default function AboutPage() {
  const visibleMembers = bandMembers.filter((m) => m.visible !== false)

  return (
    <div className="min-h-screen bg-brand-bg">

      {/* ── Page hero — text only, atmospheric ── */}
      <div className="relative overflow-hidden pt-36 pb-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-brand-red/5 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-texture pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
            <span className="w-5 h-px bg-brand-red/60" />
            The Band
          </div>
          <h1
            className="font-display uppercase leading-none text-white"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}
          >
            Who <span className="text-brand-red">We Are</span>
          </h1>
          <p className="font-body text-white/45 text-base max-w-md leading-relaxed mt-4">
            Five musicians. Four decades of hits. South Florida&apos;s live classic rock show.
          </p>
        </div>
      </div>

      {/* ── Featured group photo — one, properly framed ── */}
      <div className="relative w-full overflow-hidden pb-4">
        <div className="relative max-w-5xl mx-auto px-5 lg:px-10">
          {/* Corner frame accents */}
          <span className="absolute top-0 left-5 lg:left-10 w-7 h-7 border-l-2 border-t-2 border-brand-red z-10 pointer-events-none" />
          <span className="absolute top-0 right-5 lg:right-10 w-7 h-7 border-r-2 border-t-2 border-brand-red z-10 pointer-events-none" />
          <span className="absolute bottom-4 left-5 lg:left-10 w-7 h-7 border-l-2 border-b-2 border-brand-red z-10 pointer-events-none" />
          <span className="absolute bottom-4 right-5 lg:right-10 w-7 h-7 border-r-2 border-b-2 border-brand-red z-10 pointer-events-none" />

          {/* Photo — object-contain so no head cropping, ever */}
          <div
            className="relative w-full bg-brand-bg overflow-hidden"
            style={{ height: 'clamp(240px, 40vw, 520px)' }}
          >
            <Image
              src={siteContent.groupPhoto}
              alt="Rebound Rock Band — all 5 members"
              fill
              className="object-contain"
              priority
            />
            {/* Subtle left/right edge vignette so photo blends into dark bg */}
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-brand-bg to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-brand-bg to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-24">

        {/* ── Bio ── */}
        <div className="py-14 border-b border-brand-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <div>
              <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-5">
                <span className="w-5 h-px bg-brand-red/60" />
                Our Story
              </div>
              <div className="space-y-5 font-body text-gray-300/80 leading-relaxed text-base">
                {siteContent.aboutText.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Right column — key facts */}
            <div className="flex flex-col gap-5 lg:pt-9">
              {[
                { value: '5', label: 'Live musicians — no backing tracks' },
                { value: '4', label: 'Decades of rock & roll hits' },
                { value: '100+', label: 'Live shows performed' },
                { value: 'S. FL', label: 'Based & available statewide' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-5 border-b border-brand-border/50 pb-5 last:border-0 last:pb-0">
                  <div className="font-display text-4xl text-brand-red leading-none w-16 flex-shrink-0">{stat.value}</div>
                  <div className="font-body text-sm text-white/55 leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Meet the Band ── */}
        <div className="pt-14">
          <div className="flex items-center gap-2.5 font-heading text-brand-red text-[11px] tracking-[0.2em] uppercase mb-4">
            <span className="w-5 h-px bg-brand-red/60" />
            The Members
          </div>
          <h2 className="font-display uppercase text-4xl sm:text-5xl text-white mb-12">
            Meet the <span className="text-brand-red">Band</span>
          </h2>

          {/* Member cards — portrait, no boxy grid, premium feel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6 mb-20">
            {visibleMembers.map((member) => (
              <div key={member.id} className="group">
                {/* Portrait photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-elevated mb-4">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-elevated">
                      <svg className="w-10 h-10 text-brand-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                  )}
                  {/* Bottom gradient — only covers lower portion, faces stay clear */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/60 via-transparent to-transparent" />
                  {/* Red left-edge accent — slides up from bottom on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-red origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                </div>

                {/* Text — outside the image container so it's never overlaid */}
                <div className="font-heading text-[10px] text-brand-red uppercase tracking-widest mb-1 leading-none">
                  {member.role}
                </div>
                <div className="font-display text-lg sm:text-xl text-white uppercase leading-tight mb-1.5">
                  {member.name}
                </div>
                {member.bio && (
                  <p className="font-body text-xs text-brand-muted leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ── Booking CTA ── */}
          <div className="relative border-t border-brand-border pt-14 text-center">
            <div className="absolute top-0 inset-x-0 h-px divider-red" />
            <h2 className="font-display uppercase text-4xl sm:text-5xl text-white mb-4">
              Ready to <span className="text-brand-red">Book?</span>
            </h2>
            <p className="font-body text-brand-muted max-w-md mx-auto mb-8 leading-relaxed">
              Get in touch to check availability and pricing for your event.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/booking"
                className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-all btn-glow-red text-center"
              >
                Book Rebound Rock Band
              </Link>
              <Link
                href="/epk"
                className="font-heading text-sm uppercase tracking-widest border border-white/25 text-white px-8 py-4 hover:border-brand-red hover:text-brand-red transition-all text-center"
              >
                Download EPK
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
