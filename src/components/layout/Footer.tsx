import Image from 'next/image'
import Link from 'next/link'
import { siteContent } from '@/lib/data'

const quickLinks = [
  { label: 'Shows & Events', href: '/shows' },
  { label: 'About the Band', href: '/about' },
  { label: 'Media Gallery', href: '/media' },
  { label: 'Merch', href: '/merch' },
  { label: 'Book Us', href: '/booking' },
  { label: 'Press Kit (EPK)', href: '/epk' },
]

const SocialIcon = {
  Instagram: (
    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  Facebook: (
    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  YouTube: (
    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
}

export default function Footer() {
  const socials = [
    { label: 'Instagram', href: siteContent.instagram, icon: SocialIcon.Instagram },
    { label: 'Facebook', href: siteContent.facebook, icon: SocialIcon.Facebook },
    { label: 'YouTube', href: siteContent.youtube, icon: SocialIcon.YouTube },
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
            South Florida&apos;s live 5-piece classic rock cover band. Greatest hits from the 1950s through the 1990s.
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
            Available for bars, private events, corporate shows, festivals, and parties across South Florida.
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
            <a
              href={`tel:${siteContent.contactPhone}`}
              className="font-body text-sm text-brand-muted hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {siteContent.contactPhone}
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
            © {new Date().getFullYear()} Rebound Rock Band · South Florida
          </p>
          <Link href="/admin" className="font-body text-xs text-brand-muted/20 hover:text-brand-muted/50 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
