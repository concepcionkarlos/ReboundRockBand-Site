'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Lang } from '@/lib/i18n'

type LangContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  tr: typeof translations['en']
}

const LangCtx = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  tr: translations.en,
})

export function LanguageProvider({ initialLang, children }: { initialLang: Lang; children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  return (
    <LangCtx.Provider value={{ lang, setLang, tr: translations[lang] as typeof translations['en'] }}>
      {children}
    </LangCtx.Provider>
  )
}

export function useLanguage() {
  return useContext(LangCtx)
}
