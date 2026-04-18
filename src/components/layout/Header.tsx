'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import LanguageToggle from '@/components/ui/LanguageToggle'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { tr } = useLanguage()

  const navLinks = [
    { label: tr.nav.shows, href: '/shows' },
    { label: tr.nav.about, href: '/about' },
    { label: tr.nav.media, href: '/media' },
    { label: tr.nav.merch, href: '/merch' },
    { label: tr.nav.epk, href: '/epk' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-brand-bg/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 min-w-0 group">
          <div className="relative h-10 w-10 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo-improved.png"
              alt="Rebound Rock Band"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-display uppercase text-base leading-none text-white tracking-wide hidden sm:block whitespace-nowrap">
            Rebound <span className="text-brand-red">Rock Band</span>
          </span>
        </Link>

        {/* Nav — center (desktop) */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-heading text-xs uppercase tracking-widest px-3 py-2 transition-colors duration-150 group ${
                isActive(link.href)
                  ? 'text-white'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-brand-red transition-all duration-200 ${
                  isActive(link.href)
                    ? 'w-3'
                    : 'w-0 group-hover:w-4'
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <LanguageToggle />
          <Link
            href="/booking"
            className={`font-heading text-xs uppercase tracking-widest px-5 py-2.5 transition-all btn-glow-red ${
              isActive('/booking')
                ? 'bg-brand-red-bright text-white'
                : 'bg-brand-red text-white hover:bg-brand-red-bright'
            }`}
          >
            {tr.nav.bookNow}
          </Link>
        </div>

        {/* Mobile — language toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle />
          <button
            className="flex flex-col justify-center gap-1.5 p-2 -mr-2 text-white"
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
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-brand-surface border-t border-brand-border px-5 py-5 flex flex-col gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between font-heading text-sm uppercase tracking-widest py-3.5 border-b border-brand-border last:border-b-0 transition-colors ${
                isActive(link.href)
                  ? 'text-brand-red'
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
              )}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/booking"
              className="block text-center font-heading text-sm uppercase tracking-widest bg-brand-red text-white px-5 py-3.5 hover:bg-brand-red-bright transition-colors btn-glow-red"
              onClick={() => setMenuOpen(false)}
            >
              {tr.nav.bookFull}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
