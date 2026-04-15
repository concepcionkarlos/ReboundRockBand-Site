import fs from 'fs'
import path from 'path'
import type { Show, MerchItem, BandMember, SiteContent, MediaItem, EpkContent } from './data'
import {
  shows as defaultShows,
  merch as defaultMerch,
  bandMembers as defaultBandMembers,
  siteContent as defaultSiteContent,
  mediaItems as defaultMediaItems,
  epkContent as defaultEpkContent,
} from './data'

export interface ContentStore {
  shows: Show[]
  merch: MerchItem[]
  bandMembers: BandMember[]
  siteContent: SiteContent
  mediaItems: MediaItem[]
  epkContent: EpkContent
}

const DATA_PATH = path.join(process.cwd(), 'data', 'content.json')

function getDefaults(): ContentStore {
  return {
    shows: defaultShows,
    merch: defaultMerch,
    bandMembers: defaultBandMembers,
    siteContent: defaultSiteContent,
    mediaItems: defaultMediaItems,
    epkContent: defaultEpkContent,
  }
}

export function readContent(): ContentStore {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      const defaults = getDefaults()
      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
      fs.writeFileSync(DATA_PATH, JSON.stringify(defaults, null, 2), 'utf-8')
      return defaults
    }
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as ContentStore
    // Merge any missing fields from defaults (forward-compat)
    return {
      ...getDefaults(),
      ...parsed,
      siteContent: { ...getDefaults().siteContent, ...parsed.siteContent },
      epkContent: { ...getDefaults().epkContent, ...parsed.epkContent },
    }
  } catch {
    return getDefaults()
  }
}

export function writeContent(updates: Partial<ContentStore>): ContentStore {
  const current = readContent()
  const next = { ...current, ...updates }
  fs.writeFileSync(DATA_PATH, JSON.stringify(next, null, 2), 'utf-8')
  return next
}
