import type { Metadata } from 'next'
import { Bebas_Neue, Oswald, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Rebound Rock Band — Classic Rock Cover Band | South Florida',
    template: '%s | Rebound Rock Band',
  },
  description:
    'Rebound Rock Band is South Florida\'s live 5-piece classic rock cover band. Greatest hits from the 1950s through the 1990s. Available for bars, private events, festivals, and corporate shows.',
  keywords: [
    'Rebound Rock Band',
    'rock cover band',
    'south florida band',
    'live band for hire',
    'classic rock band miami',
    'private event band',
    'corporate event band',
    'wedding band florida',
  ],
  openGraph: {
    title: 'Rebound Rock Band — Classic Rock Cover Band',
    description: 'South Florida\'s live 5-piece classic rock cover band. Book us for your next event.',
    type: 'website',
    siteName: 'Rebound Rock Band',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${oswald.variable} ${inter.variable}`}>
      <body className="bg-brand-bg text-white font-body antialiased overflow-x-hidden">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
