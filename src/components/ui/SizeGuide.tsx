'use client'

import { useState } from 'react'

const sizes = [
  { size: 'S',   chest: '36–38"', length: '28"', sleeve: '8"'  },
  { size: 'M',   chest: '38–40"', length: '29"', sleeve: '8.5"' },
  { size: 'L',   chest: '42–44"', length: '30"', sleeve: '9"'  },
  { size: 'XL',  chest: '46–48"', length: '31"', sleeve: '9.5"' },
  { size: '2XL', chest: '50–52"', length: '32"', sleeve: '10"' },
  { size: '3XL', chest: '54–56"', length: '33"', sleeve: '10.5"' },
]

export default function SizeGuide() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-brand-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 font-heading text-[11px] uppercase tracking-widest text-brand-muted hover:text-white transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
          Size Guide
        </span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="border-t border-brand-border px-5 py-4">
          <p className="font-body text-xs text-brand-text mb-4 leading-relaxed">
            Measurements are body measurements in inches. If between sizes, size up for a relaxed fit.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border">
                  {['Size', 'Chest', 'Length', 'Sleeve'].map((h) => (
                    <th key={h} className="font-heading text-[10px] uppercase tracking-widest text-brand-muted pb-2 pr-5 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizes.map((row, i) => (
                  <tr
                    key={row.size}
                    className={`border-b border-brand-border/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-brand-elevated/40'}`}
                  >
                    <td className="font-heading text-xs text-brand-red py-2.5 pr-5">{row.size}</td>
                    <td className="font-body text-xs text-white/80 py-2.5 pr-5">{row.chest}</td>
                    <td className="font-body text-xs text-white/80 py-2.5 pr-5">{row.length}</td>
                    <td className="font-body text-xs text-white/80 py-2.5">{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
