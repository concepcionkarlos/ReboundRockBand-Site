'use client'

import { useState } from 'react'

interface Props {
  images: string[]
  name: string
}

export default function MerchGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-2">
      {/* Main image */}
      <div className="relative aspect-square bg-brand-elevated overflow-hidden border border-brand-border group-hover:border-brand-red/30 transition-colors duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={images[active]}
          src={images[active]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-red origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-14 h-14 overflow-hidden border flex-shrink-0 transition-all duration-150 ${
                active === i
                  ? 'border-brand-red'
                  : 'border-brand-border hover:border-brand-red/40'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${name} view ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
