'use client'

import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  const router = useRouter()

  const toggle = () => {
    const next: typeof lang = lang === 'en' ? 'es' : 'en'
    document.cookie = `lang=${next};path=/;max-age=31536000;SameSite=Lax`
    setLang(next)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
      className="font-heading text-[10px] uppercase tracking-widest border border-white/15 hover:border-brand-red/60 transition-all px-2.5 py-1.5 flex items-center gap-1 flex-shrink-0"
    >
      <span className={lang === 'en' ? 'text-white' : 'text-white/30'}>EN</span>
      <span className="text-white/20 mx-0.5">|</span>
      <span className={lang === 'es' ? 'text-brand-red' : 'text-white/30'}>ES</span>
    </button>
  )
}
