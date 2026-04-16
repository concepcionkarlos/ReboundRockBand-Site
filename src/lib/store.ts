import fs from 'fs'
import path from 'path'
import type { Show, MerchItem, BandMember, SiteContent, MediaItem, EpkContent, BookingRequest, SongRequest } from './data'
import {
  shows as defaultShows,
  merch as defaultMerch,
  bandMembers as defaultBandMembers,
  siteContent as defaultSiteContent,
  mediaItems as defaultMediaItems,
  epkContent as defaultEpkContent,
  bookingRequests as defaultBookingRequests,
  songRequests as defaultSongRequests,
} from './data'

export interface ContentStore {
  shows: Show[]
  merch: MerchItem[]
  bandMembers: BandMember[]
  siteContent: SiteContent
  mediaItems: MediaItem[]
  epkContent: EpkContent
  bookingRequests: BookingRequest[]
  songRequests: SongRequest[]
}

const DATA_PATH = path.join(process.cwd(), 'data', 'content.json')
const KV_KEY = 'content'

function getDefaults(): ContentStore {
  return {
    shows: defaultShows,
    merch: defaultMerch,
    bandMembers: defaultBandMembers,
    siteContent: defaultSiteContent,
    mediaItems: defaultMediaItems,
    epkContent: defaultEpkContent,
    bookingRequests: defaultBookingRequests,
    songRequests: defaultSongRequests,
  }
}

function mergeWithDefaults(parsed: Partial<ContentStore>): ContentStore {
  const defaults = getDefaults()
  return {
    ...defaults,
    ...parsed,
    siteContent: { ...defaults.siteContent, ...parsed.siteContent },
    epkContent: { ...defaults.epkContent, ...parsed.epkContent },
  }
}

// ── Local filesystem (development) ──────────────────────────────────────────

function readLocal(): ContentStore {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      const defaults = getDefaults()
      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
      fs.writeFileSync(DATA_PATH, JSON.stringify(defaults, null, 2), 'utf-8')
      return defaults
    }
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    return mergeWithDefaults(JSON.parse(raw) as Partial<ContentStore>)
  } catch {
    return getDefaults()
  }
}

function writeLocal(updates: Partial<ContentStore>): ContentStore {
  const current = readLocal()
  const next = { ...current, ...updates }
  fs.writeFileSync(DATA_PATH, JSON.stringify(next, null, 2), 'utf-8')
  return next
}

// ── Vercel KV (production) ───────────────────────────────────────────────────

async function readKV(): Promise<ContentStore> {
  const { kv } = await import('@vercel/kv')
  const stored = await kv.get<ContentStore>(KV_KEY)
  if (!stored) {
    // Seed from the shipped content.json on first run
    const initial = readLocal()
    await kv.set(KV_KEY, initial)
    return initial
  }
  return mergeWithDefaults(stored as Partial<ContentStore>)
}

async function writeKV(updates: Partial<ContentStore>): Promise<ContentStore> {
  const { kv } = await import('@vercel/kv')
  const current = await readKV()
  const next = { ...current, ...updates }
  await kv.set(KV_KEY, next)
  return next
}

// ── Public API (always async) ────────────────────────────────────────────────

const useKV = !!process.env.KV_REST_API_URL

export async function readContent(): Promise<ContentStore> {
  if (useKV) return readKV()
  return readLocal()
}

export async function writeContent(updates: Partial<ContentStore>): Promise<ContentStore> {
  if (useKV) return writeKV(updates)
  return writeLocal(updates)
}
