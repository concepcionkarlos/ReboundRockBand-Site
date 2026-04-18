'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  helper?: string
  previewClassName?: string
  objectFit?: 'cover' | 'contain'
  objectPosition?: string
  accept?: string
}

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-xs px-3 py-2 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

export default function ImageUpload({
  value,
  onChange,
  label,
  helper,
  previewClassName = 'w-28 h-28',
  objectFit = 'cover',
  objectPosition,
  accept = 'image/*',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const doUpload = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Upload failed')
      onChange(data.url as string)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void doUpload(file)
    e.target.value = ''
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void doUpload(file)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="hidden"
      />

      <div className="flex items-start gap-3 flex-wrap">
        {/* Preview — drag & drop target, also clickable */}
        <div
          className={`relative ${previewClassName} bg-[#0d0d1e] border overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
            isDragging
              ? 'border-brand-red/70 shadow-[0_0_0_3px_rgba(224,16,30,0.15)]'
              : 'border-white/8 hover:border-white/20'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
        >
          {value ? (
            <Image
              src={value}
              alt="Preview"
              fill
              sizes="320px"
              className={objectFit === 'contain' ? 'object-contain' : 'object-cover'}
              style={objectPosition ? { objectPosition } : undefined}
              onError={() => {}}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
              <svg
                className="w-6 h-6 text-white/15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-heading text-[8px] uppercase tracking-widest text-white/15">Drop or click</span>
            </div>
          )}

          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-red/10 border-2 border-brand-red/50 border-dashed">
              <svg
                className="w-6 h-6 text-brand-red/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
          )}

          {/* Upload spinner overlay */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <svg className="w-5 h-5 animate-spin text-brand-red" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 flex-1 min-w-[220px]">
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="font-heading text-[10px] uppercase tracking-widest bg-brand-red text-white px-3 py-2 hover:bg-brand-red-bright transition-all btn-glow-red disabled:opacity-60 flex items-center gap-1.5"
            >
              {uploading ? (
                <>
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Uploading…
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {value ? 'Replace Image' : 'Upload Image'}
                </>
              )}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                disabled={uploading}
                className="font-heading text-[10px] uppercase tracking-widest border border-white/15 text-white/40 px-3 py-2 hover:border-white/30 hover:text-white transition-all disabled:opacity-60"
              >
                Clear
              </button>
            )}
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder="or paste an image URL / path"
          />

          {error && <p className="font-body text-xs text-red-400">{error}</p>}
          {helper && !error && <p className="font-body text-xs text-white/20">{helper}</p>}
        </div>
      </div>
    </div>
  )
}
