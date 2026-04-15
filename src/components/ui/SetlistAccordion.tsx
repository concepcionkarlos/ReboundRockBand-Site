'use client'

import { useState } from 'react'

interface SetlistAccordionProps {
  setlists: { title: string; songs: string[] }[]
}

export default function SetlistAccordion({ setlists }: SetlistAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!setlists || setlists.length === 0) return null

  return (
    <div className="border border-brand-border overflow-hidden">
      {setlists.map((set, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className={`${i < setlists.length - 1 ? 'border-b border-brand-border' : ''}`}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left group hover:bg-brand-surface transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-xl text-brand-red leading-none w-8 flex-shrink-0">
                  {i + 1}
                </span>
                <span className="font-heading text-sm uppercase tracking-widest text-white group-hover:text-brand-red transition-colors">
                  {set.title}
                </span>
                <span className="font-body text-xs text-brand-muted/50 hidden sm:block">
                  · {set.songs.length} songs
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-brand-red flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 bg-brand-surface/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1.5 pt-3">
                  {set.songs.map((song, j) => (
                    <div key={j} className="flex items-baseline gap-2.5">
                      <span className="font-display text-brand-red text-sm leading-none w-5 flex-shrink-0 text-right">
                        {j + 1}
                      </span>
                      <span className="font-body text-sm text-brand-muted leading-snug">{song}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}

      <div className="px-5 py-3 bg-brand-surface border-t border-brand-border">
        <p className="font-body text-xs text-brand-muted/50 italic">
          Sets can be adjusted based on event, audience, and venue. Contact us to discuss a custom arrangement.
        </p>
      </div>
    </div>
  )
}
