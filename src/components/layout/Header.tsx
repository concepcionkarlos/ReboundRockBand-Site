'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import Button from '@/components/ui/Button'

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
    <header className="fixed top-0 inset-x-0 z-50 bg-brand-bg/95 backdrop-blur-sm border-b border-brand-border">
      <div className="container mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-9 h-9">
            <Image
              src="/images/logo.jpeg"
              alt="Rebound Rock Band"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <span className="font-display uppercase text-lg tracking-wide text-white leading-none hidden sm:block">
            Rebound<span className="text-brand-red">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-xs uppercase tracking-widest text-brand-muted hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block flex-shrink-0">
          <Button href="/booking" variant="primary" size="sm">
            Book the Band
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-surface border-t border-brand-border px-6 py-5 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-sm uppercase tracking-widest text-white"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Button href="/booking" variant="primary" size="md" className="w-full">
              Book the Band
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
