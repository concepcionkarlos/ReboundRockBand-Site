import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Oswald, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { LanguageProvider } from '@/context/LanguageContext'
import type { Lang } from '@/lib/i18n'
import { getLang } from '@/lib/getLang'
import { readContent } from '@/lib/store'

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

const DEFAULT_DESCRIPTION = "Rebound Rock Band is South Florida's live 5-piece classic rock cover band. Greatest hits from the 1950s through the 1990s. Available for bars, private events, festivals, and corporate shows."
const DEFAULT_OG_TITLE = 'Rebound Rock Band — Classic Rock Cover Band'
const DEFAULT_OG_DESC = "South Florida's live 5-piece classic rock cover band. Book us for your next event."
const DEFAULT_KEYWORDS = ['Rebound Rock Band','rock cover band','south florida band','live band for hire','classic rock band miami','private event band','corporate event band','wedding band florida']

export async function generateMetadata(): Promise<Metadata> {
  const { siteContent: sc } = await readContent()
  return {
    title: {
      default: 'Rebound Rock Band — Classic Rock Cover Band | South Florida',
      template: '%s | Rebound Rock Band',
    },
    description: sc.metaDescription || DEFAULT_DESCRIPTION,
    keywords: sc.metaKeywords ? sc.metaKeywords.split(',').map((k) => k.trim()).filter(Boolean) : DEFAULT_KEYWORDS,
    openGraph: {
      title: sc.ogTitle || DEFAULT_OG_TITLE,
      description: sc.ogDescription || DEFAULT_OG_DESC,
      type: 'website',
      siteName: 'Rebound Rock Band',
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#080810',
  colorScheme: 'dark',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang: Lang = await getLang()

  return (
    <html lang={lang} className={`${bebasNeue.variable} ${oswald.variable} ${inter.variable}`}>
      <body className="bg-brand-bg text-white font-body antialiased overflow-x-hidden">
        <LanguageProvider initialLang={lang}>
          <Header />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
