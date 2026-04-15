import Image from 'next/image'
import Link from 'next/link'
import { readContent } from '@/lib/store'

const quickLinks = [
  { label: 'Shows & Events', href: '/shows' },
  { label: 'About the Band', href: '/about' },
  { label: 'Media Gallery', href: '/media' },
  { label: 'Merch', href: '/merch' },
  { label: 'Book Us', href: '/booking' },
  { label: 'Press Kit (EPK)', href: '/epk' },
]

const SocialIcon = {
  Facebook: (
    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
}

export default function Footer() {
  const { siteContent } = readContent()
  const socials = [
    { label: 'Facebook', href: siteContent.facebook, icon: SocialIcon.Facebook },
  ]

  return (
    <footer className="bg-brand-surface border-t border-brand-border">
      {/* Red gradient accent bar */}
      <div className="divider-red" />

      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">

        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div className="relative h-11 w-11 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo-improved.png"
                alt="Rebound Rock Band"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display uppercase text-lg text-white leading-none tracking-wide">
              Rebound <span className="text-brand-red">Rock Band</span>
            </span>
          </Link>
          <p className="font-body text-sm text-brand-muted leading-relaxed max-w-xs">
            {siteContent.footerTagline}
          </p>
          {/* Social icons */}
          <div className="flex gap-3 mt-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 flex items-center justify-center border border-brand-border text-brand-muted hover:border-brand-red hover:text-brand-red transition-all duration-150"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-5 flex items-center gap-2">
            <span className="w-4 h-px bg-brand-red/50" />
            Quick Links
          </h4>
          <ul className="flex flex-col gap-0">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-sm text-brand-muted hover:text-white transition-colors py-1.5 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-brand-red transition-all duration-200 flex-shrink-0 overflow-hidden" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-5 flex items-center gap-2">
            <span className="w-4 h-px bg-brand-red/50" />
            Book Rebound Rock Band
          </h4>
          <p className="font-body text-sm text-brand-muted leading-relaxed mb-5">
            Available for bars, private events, corporate shows, festivals, and parties across {siteContent.serviceArea}.
          </p>
          <div className="flex flex-col gap-2.5 mb-5">
            <a
              href={`mailto:${siteContent.contactEmail}`}
              className="font-body text-sm text-white/80 hover:text-brand-red transition-colors break-all flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {siteContent.contactEmail}
            </a>
          </div>
          <Link
            href="/booking"
            className="inline-block font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-colors btn-glow-red"
          >
            Get a Quote
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-12 flex items-center justify-between gap-4">
          <p className="font-body text-xs text-brand-muted/60">
            © {new Date().getFullYear()} Rebound Rock Band · {siteContent.serviceArea}
          </p>
          <Link href="/admin" className="font-body text-xs text-brand-muted/20 hover:text-brand-muted/50 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
