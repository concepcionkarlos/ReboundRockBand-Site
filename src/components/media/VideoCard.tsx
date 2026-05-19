'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  url: string
  caption: string
}

function parseVideo(url: string): { type: 'youtube' | 'vimeo' | 'html5'; id: string } {
  if (/youtube\.com|youtu\.be/i.test(url)) {
    const id = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? ''
    return { type: 'youtube', id }
  }
  if (/vimeo\.com/i.test(url)) {
    const id = url.match(/vimeo\.com\/(\d+)/)?.[1] ?? ''
    return { type: 'vimeo', id }
  }
  return { type: 'html5', id: '' }
}

function embedUrl(type: 'youtube' | 'vimeo', id: string) {
  if (type === 'youtube') return `https://www.youtube.com/embed/${id}?rel=0&autoplay=1`
  return `https://player.vimeo.com/video/${id}?autoplay=1`
}

export default function VideoCard({ url, caption }: Props) {
  const [playing, setPlaying] = useState(false)
  const { type, id } = parseVideo(url)

  if (type === 'html5') {
    return (
      <div className="group relative aspect-video overflow-hidden bg-brand-elevated border border-brand-border hover:border-brand-red/40 transition-all duration-300">
        <video src={url} controls className="w-full h-full object-cover" />
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-red origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-brand-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </div>
    )
  }

  const thumbnail = type === 'youtube' ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null

  return (
    <div className="group relative aspect-video overflow-hidden bg-brand-elevated border border-brand-border hover:border-brand-red/40 transition-all duration-300">
      {playing ? (
        <iframe
          src={embedUrl(type, id)}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={caption || 'Video'}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 w-full h-full"
          aria-label={`Play ${caption || 'video'}`}
        >
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={caption || 'Video thumbnail'}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-brand-elevated" />
          )}
          <div className="absolute inset-0 bg-brand-bg/40 group-hover:bg-brand-bg/20 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-brand-red/90 flex items-center justify-center group-hover:bg-brand-red group-hover:scale-110 transition-all duration-200 shadow-lg shadow-brand-red/30">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {caption && (
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-transparent pointer-events-none">
              <div className="font-heading text-[10px] text-brand-red uppercase tracking-widest mb-0.5">video</div>
              <div className="font-body text-sm text-white truncate">{caption}</div>
            </div>
          )}
        </button>
      )}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-red origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-brand-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 pointer-events-none" />
    </div>
  )
}
