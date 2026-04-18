'use client'

import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'

const IS_PROD = process.env.NODE_ENV === 'production'
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
const MAX_MB = 500
const MAX_BYTES = MAX_MB * 1024 * 1024

export function isExternalVideoUrl(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url)
}

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
  helper?: string
}

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

export default function VideoUpload({ value, onChange, label, helper }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<'upload' | 'external'>(() =>
    value && isExternalVideoUrl(value) ? 'external' : 'upload'
  )
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedName, setUploadedName] = useState<string | null>(null)

  const switchMode = (m: 'upload' | 'external') => {
    setMode(m)
    setError(null)
    onChange('')
    setUploadedName(null)
  }

  const doUpload = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Unsupported type. Use MP4, MOV, or WebM.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(0)} MB). Max ${MAX_MB} MB.`)
      return
    }

    setError(null)
    setUploading(true)
    setProgress(0)
    setUploadedName(file.name)

    try {
      if (IS_PROD) {
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`
        const blob = await upload(safeName, file, {
          access: 'public',
          handleUploadUrl: '/api/upload-video',
          multipart: true,
          onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
        })
        onChange(blob.url)
      } else {
        // Dev: XHR for upload progress
        await new Promise<void>((resolve, reject) => {
          const fd = new FormData()
          fd.append('file', file)
          const xhr = new XMLHttpRequest()
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
          }
          xhr.onload = () => {
            try {
              const data = JSON.parse(xhr.responseText) as { url?: string; error?: string }
              if (!data.url) reject(new Error(data.error || 'Upload failed'))
              else { onChange(data.url); resolve() }
            } catch { reject(new Error('Server error')) }
          }
          xhr.onerror = () => reject(new Error('Network error'))
          xhr.open('POST', '/api/upload-video')
          xhr.send(fd)
        })
      }
      setProgress(100)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
      setUploadedName(null)
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void doUpload(file)
    e.target.value = ''
  }

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void doUpload(file)
  }

  const hasVideo = value && !isExternalVideoUrl(value)

  return (
    <div className="flex flex-col gap-2.5">
      {label && (
        <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">{label}</label>
      )}

      {/* Mode toggle */}
      <div className="flex gap-0">
        {(['upload', 'external'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`font-heading text-[10px] uppercase tracking-widest px-4 py-2 border transition-colors ${
              mode === m
                ? 'bg-brand-red border-brand-red text-white'
                : 'bg-transparent border-white/15 text-white/40 hover:border-white/30 hover:text-white/70'
            }`}
          >
            {m === 'upload' ? 'Upload Video' : 'YouTube / Vimeo'}
          </button>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        onChange={handleFile}
        className="hidden"
      />

      {mode === 'upload' ? (
        hasVideo ? (
          /* Uploaded video — show preview + controls */
          <div className="flex flex-col gap-3">
            <div className="relative w-full aspect-video max-w-sm bg-[#0d0d1e] border border-white/8 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <video src={value} className="w-full h-full object-cover" muted playsInline />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {uploadedName && (
                <span className="font-body text-xs text-green-400 flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {uploadedName}
                </span>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="font-heading text-[10px] uppercase tracking-widest bg-brand-red text-white px-3 py-1.5 hover:bg-brand-red-bright transition-all btn-glow-red disabled:opacity-60"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => { onChange(''); setUploadedName(null) }}
                disabled={uploading}
                className="font-heading text-[10px] uppercase tracking-widest border border-white/15 text-white/40 px-3 py-1.5 hover:border-white/30 hover:text-white transition-all disabled:opacity-60"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* Drop zone */
          <div
            className={`relative w-full aspect-video max-w-sm flex flex-col items-center justify-center gap-3 border-2 border-dashed transition-all ${
              uploading
                ? 'border-brand-red/40 bg-brand-red/5 cursor-not-allowed'
                : isDragging
                ? 'border-brand-red/70 bg-brand-red/5 cursor-copy'
                : 'border-white/10 bg-[#0d0d1e] hover:border-white/25 cursor-pointer'
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !uploading && fileRef.current?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3 w-full px-8">
                <svg className="w-8 h-8 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {uploadedName && (
                  <p className="font-body text-xs text-white/50 text-center truncate w-full">{uploadedName}</p>
                )}
                <div className="w-full bg-white/10 h-1">
                  <div
                    className="h-1 bg-brand-red transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="font-heading text-[10px] uppercase tracking-widest text-white/40">
                  {progress < 100 ? `${progress}% uploading…` : 'Processing…'}
                </p>
              </div>
            ) : isDragging ? (
              <div className="flex flex-col items-center gap-2 pointer-events-none text-brand-red">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="font-heading text-[10px] uppercase tracking-widest">Drop to upload</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 pointer-events-none text-white/30">
                <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="font-heading text-[10px] uppercase tracking-widest text-center leading-relaxed">
                  Drop a video here<br />or click to browse
                </p>
                <p className="font-body text-[10px] text-white/20">MP4 · MOV · WebM · Max {MAX_MB} MB</p>
              </div>
            )}
          </div>
        )
      ) : (
        /* External URL */
        <div className="flex flex-col gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => { onChange(e.target.value); setError(null) }}
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {value && isExternalVideoUrl(value) && (
            <p className="font-body text-xs text-green-400 flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {/youtube/i.test(value) ? 'YouTube' : 'Vimeo'} link detected — will embed on site
            </p>
          )}
          <p className="font-body text-xs text-white/20">Paste a YouTube or Vimeo URL.</p>
        </div>
      )}

      {error && (
        <p className="font-body text-xs text-red-400 flex items-center gap-1.5">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      )}
      {helper && !error && <p className="font-body text-xs text-white/20">{helper}</p>}
    </div>
  )
}
