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

const FacebookIcon = (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramIcon = (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const YouTubeIcon = (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const FacebookIconSm = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

export default function Footer() {
  const { siteContent } = readContent()

  type SocialItem = { label: string; href: string; icon: React.ReactNode }

  const socials: SocialItem[] = []
  if (siteContent.facebook) socials.push({ label: 'Facebook', href: siteContent.facebook, icon: FacebookIcon })
  if (siteContent.instagram) socials.push({ label: 'Instagram', href: siteContent.instagram, icon: InstagramIcon })
  if (siteContent.youtube) socials.push({ label: 'YouTube', href: siteContent.youtube, icon: YouTubeIcon })

  const platformRows: SocialItem[] = [...socials]

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
          {/* Social icon squares */}
          {socials.length > 0 && (
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
          )}
        </div>

        {/* Follow the Band */}
        <div>
          <h4 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-5 flex items-center gap-2">
            <span className="w-4 h-px bg-brand-red/50" />
            Follow the Band
          </h4>
          {/* Social platform rows */}
          {platformRows.length > 0 && (
            <div className="flex flex-col gap-2 mb-6">
              {platformRows.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-body text-sm text-brand-muted hover:text-white border border-brand-border/60 hover:border-brand-red/40 px-3 py-2.5 transition-all group"
                >
                  <span className="text-brand-muted/50 group-hover:text-brand-red transition-colors">{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
          )}
          {/* Compact nav list */}
          <div className="border-t border-brand-border/50 pt-4">
            <p className="font-heading text-[9px] uppercase tracking-widest text-brand-muted/40 mb-3">Quick Links</p>
            <ul className="flex flex-col gap-0">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-xs text-brand-muted/60 hover:text-white transition-colors py-1 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-brand-red transition-all duration-200 flex-shrink-0 overflow-hidden" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
          {siteContent.facebook && (
            <a
              href={siteContent.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-1.5 font-heading text-[10px] uppercase tracking-widest text-brand-muted/50 hover:text-brand-red transition-colors"
            >
              {FacebookIconSm}
              Follow on Facebook
            </a>
          )}
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
