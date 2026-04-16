'use client'

import Image from 'next/image'
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
        <Image
          key={images[active]}
          src={images[active]}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={active === 0}
        />
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
              <Image
                src={src}
                alt={`${name} view ${i + 1}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
