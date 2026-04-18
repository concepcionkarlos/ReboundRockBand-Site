import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED_VIDEO_TYPES: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
}

const MAX_SIZE = 500 * 1024 * 1024 // 500 MB

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      // Production: Vercel Blob client upload — generate signed token for the browser
      const { handleUpload } = await import('@vercel/blob/client')
      const body = (await request.json()) as Parameters<typeof handleUpload>[0]['body']
      const json = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: Object.keys(ALLOWED_VIDEO_TYPES),
          maximumSizeInBytes: MAX_SIZE,
        }),
        onUploadCompleted: async () => {},
      })
      return NextResponse.json(json)
    }

    // Dev: receive FormData and write to local disk
    const form = await request.formData()
    const file = form.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = ALLOWED_VIDEO_TYPES[file.type]
    if (!ext) {
      return NextResponse.json(
        { error: `Unsupported video type. Use MP4, MOV, or WebM.` },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(0)} MB). Max 500 MB.` },
        { status: 400 }
      )
    }

    const id = crypto.randomBytes(6).toString('hex')
    const safeBase =
      (file.name || 'video')
        .toLowerCase()
        .replace(/\.[a-z0-9]+$/i, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 40) || 'video'
    const filename = `${Date.now()}-${id}-${safeBase}.${ext}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(path.join(uploadDir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    console.error('Video upload failed:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
