import Image from 'next/image'
import Link from 'next/link'

const quickLinks = [
  { label: 'Shows & Events', href: '/shows' },
  { label: 'About the Band', href: '/about' },
  { label: 'Media Gallery', href: '/media' },
  { label: 'Merch', href: '/merch' },
  { label: 'Book Us', href: '/booking' },
  { label: 'Press Kit (EPK)', href: '/epk' },
]

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/reboundrockband',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/reboundrockband',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@reboundrockband',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border">
      {/* Main footer */}
      <div className="container mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/images/logo.jpeg" alt="Rebound Rock Band" fill className="object-contain rounded-full" />
            </div>
            <span className="font-display uppercase text-xl text-white leading-none">
              Rebound<span className="text-brand-red">.</span>
            </span>
          </Link>
          <p className="font-body text-sm text-brand-muted leading-relaxed max-w-xs">
            South Florida's live 5-piece classic rock cover band.
            Playing the greatest hits from the 1950s through the 1990s.
          </p>
          <div className="flex gap-3 mt-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-brand-muted hover:text-brand-red transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-5">Quick Links</h4>
          <ul className="flex flex-col gap-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-sm text-brand-muted hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-5">Book the Band</h4>
          <p className="font-body text-sm text-brand-muted leading-relaxed mb-4">
            Available for bars, private events, corporate shows, festivals, and parties across South Florida.
          </p>
          <a
            href="mailto:booking@reboundrockband.com"
            className="font-heading text-sm text-white hover:text-brand-red transition-colors tracking-wide"
          >
            booking@reboundrockband.com
          </a>
          <div className="mt-3">
            <a
              href="tel:+13055550100"
              className="font-body text-sm text-brand-muted hover:text-white transition-colors"
            >
              (305) 555-0100
            </a>
          </div>
          <p className="font-body text-xs text-brand-muted mt-4 leading-relaxed">
            Based in South Florida<br />
            <span className="text-brand-red">www.reboundrockband.com</span>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-border">
        <div className="container mx-auto px-6 lg:px-10 h-12 flex items-center justify-between">
          <p className="font-body text-xs text-brand-muted">
            © {new Date().getFullYear()} Rebound Rock Band. All rights reserved.
          </p>
          <p className="font-body text-xs text-brand-muted">
            South Florida
          </p>
        </div>
      </div>
    </footer>
  )
}
