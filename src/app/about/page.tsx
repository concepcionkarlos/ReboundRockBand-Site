import type { Metadata } from 'next'
import { bandMembers, siteContent } from '@/lib/data'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About the Band',
  description: 'Meet Rebound Rock Band — South Florida\'s 5-piece live classic rock cover band.',
}

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* Page header */}
        <div className="py-12 border-b border-brand-border mb-14">
          <span className="font-heading text-brand-red text-xs tracking-widest uppercase border border-brand-red/40 px-3 py-1.5 mb-5 inline-block">
            The Band
          </span>
          <h1 className="font-display uppercase text-5xl sm:text-6xl text-white leading-none">
            Who <span className="text-brand-red">We Are</span>
          </h1>
          <p className="font-body text-brand-muted text-base mt-3 max-w-xl leading-relaxed">
            Five musicians. Four decades of hits. One mission — deliver an unforgettable live rock show every single night.
          </p>
        </div>

        {/* Band bio */}
        <div className="max-w-3xl mb-16">
          <div className="space-y-5 font-body text-gray-300 leading-relaxed text-base">
            {siteContent.aboutText.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        {/* Band members */}
        <div className="mb-16">
          <h2 className="font-display uppercase text-4xl text-white mb-8">
            Meet the <span className="text-brand-red">Members</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {bandMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col border border-brand-border bg-brand-surface rounded-sm overflow-hidden hover:border-brand-red/40 transition-colors"
              >
                {/* Photo placeholder */}
                <div className="aspect-square bg-brand-elevated flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-brand-muted/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="p-4 flex flex-col gap-1.5 flex-1">
                  <span className="font-heading text-[10px] text-brand-red uppercase tracking-widest">{member.role}</span>
                  <span className="font-heading text-sm text-white">{member.name}</span>
                  <p className="font-body text-xs text-brand-muted leading-relaxed mt-1">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-brand-muted/50 mt-4">Member names and photos coming soon.</p>
        </div>

        {/* Booking CTA */}
        <div className="border-t border-brand-border pt-12 text-center">
          <h2 className="font-display uppercase text-4xl text-white mb-4">Ready to Book?</h2>
          <p className="font-body text-brand-muted max-w-md mx-auto mb-7 leading-relaxed">
            Get in touch to check availability and get a quote for your event.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/booking"
              className="font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-8 py-4 hover:bg-brand-red-bright transition-colors btn-glow-red text-center"
            >
              Book Rebound Rock Band
            </Link>
            <Link
              href="/epk"
              className="font-heading text-sm uppercase tracking-widest border border-white/30 text-white px-8 py-4 hover:border-brand-red hover:text-brand-red transition-colors text-center"
            >
              Download EPK
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
