'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { label: 'Shows', href: '/shows' },
  { label: 'About', href: '/about' },
  { label: 'Media', href: '/media' },
  { label: 'Merch', href: '/merch' },
  { label: 'EPK', href: '/epk' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-brand-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between gap-4">

        {/* Logo — left */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 min-w-0">
          <div className="relative h-11 w-11 flex-shrink-0">
            <Image
              src="/logo-improved.png"
              alt="Rebound Rock Band"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-display uppercase text-base leading-none text-white tracking-wide hidden sm:block whitespace-nowrap">
            Rebound Rock Band
          </span>
        </Link>

        {/* Nav — center (desktop) */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA — right (desktop) */}
        <div className="hidden md:block flex-shrink-0">
          <Link
            href="/booking"
            className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-colors btn-glow-red"
          >
            Book Rebound Rock Band
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 p-2 -mr-2 text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 origin-center ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${
              menuOpen ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 origin-center ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-brand-surface border-t border-brand-border px-5 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-sm uppercase tracking-widest text-white/80 hover:text-white py-3 border-b border-brand-border last:border-b-0 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/booking"
              className="block text-center font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-5 py-3.5 hover:bg-brand-red-bright transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Book Rebound Rock Band
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
