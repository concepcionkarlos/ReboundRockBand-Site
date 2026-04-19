export interface Show {
  id: string
  date: string        // ISO: "2026-04-18"
  venue: string
  city: string
  time: string
  ticketUrl?: string
  isFeatured?: boolean
  visible?: boolean
}

export interface MerchItem {
  id: string
  name: string
  price: number
  image?: string            // primary product image
  images?: string[]         // additional gallery images (front, detail, etc.)
  category: 'tshirt' | 'hat' | 'sticker' | 'other'
  available: boolean
  externalUrl?: string      // Printful / external checkout URL
  visible: boolean
  description?: string      // short product description
  specs?: { label: string; value: string }[]   // fabric, fit, print method, etc.
  atShows?: boolean         // sold at live shows
}

export interface BandMember {
  id: string
  name: string
  role: string
  bio: string
  photo?: string
  visible?: boolean
}

export interface SiteContent {
  heroHeadline: string
  heroSubheadline: string
  aboutText: string[]              // long bio used on the About page
  aboutShort: string               // short Home-page teaser (NOT a slice of aboutText)
  aboutHeadline: string            // editable About hero headline
  groupPhoto: string               // path in /public/ for the About page featured image
  serviceArea: string              // e.g. "South Florida" — used everywhere instead of hardcoded literals
  footerTagline: string            // line under the footer logo
  ctaPrimaryLabel: string          // primary CTA label (default "Book Rebound Rock Band")
  ctaSecondaryLabel: string        // secondary CTA label (default "View Press Kit")
  contactEmail: string
  facebook: string
  instagram?: string
  youtube?: string
}

export interface MediaItem {
  id: string
  type: 'photo' | 'video'
  url: string                      // /public path or external URL
  poster?: string                  // optional poster image for videos
  caption: string
  isFeatured?: boolean
  visible: boolean
}

export interface EpkContent {
  tagline: string
  bookerIntro: string
  repertoire: { era: string; artists: string }[]   // era WITHOUT trailing 's'
  techSpecs: { label: string; value: string }[]
  setlists?: { title: string; songs: string[] }[]
}

export type BookingStatus =
  | 'New'
  | 'Contacted'
  | 'Quote Sent'
  | 'Follow-up'
  | 'Negotiating'
  | 'Confirmed'
  | 'Lost'
  | 'Archived'

export interface BookingRequest {
  id: string
  fullName: string
  venueOrCompany: string
  email: string
  phone: string
  eventDate: string
  city: string
  eventType: string
  budgetRange: string
  guestCount: string
  message: string
  source: string
  status: BookingStatus
  assignedTo?: string
  followUpDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export const bookingRequests: BookingRequest[] = []

export type SongRequestStatus = 'New' | 'Review' | 'Consider' | 'Added' | 'Declined'

export interface SongRequest {
  id: string
  fullName: string
  email: string
  eventDate?: string
  song1: string
  song2?: string
  song3?: string
  notes?: string
  bookingRequestId?: string   // optional link to a BookingRequest
  status: SongRequestStatus
  createdAt: string
  updatedAt: string
}

export const songRequests: SongRequest[] = []

export const shows: Show[] = [
  {
    id: '1',
    date: '2026-04-18',
    venue: 'Regatta Festival',
    city: 'Miami Springs, FL',
    time: '12:00 PM',
    isFeatured: true,
  },
  {
    id: '2',
    date: '2026-04-25',
    venue: 'Canela Mel',
    city: 'Miami Springs, FL',
    time: '6:00 PM',
  },
  {
    id: '3',
    date: '2026-05-02',
    venue: 'Canela Mel',
    city: 'Miami Springs, FL',
    time: '6:00 PM',
  },
  {
    id: '4',
    date: '2026-05-09',
    venue: 'Capri Restaurant',
    city: 'Homestead, FL',
    time: '7:00 PM',
  },
  {
    id: '5',
    date: '2026-05-21',
    venue: 'Titanic Brewing Company',
    city: 'Coral Gables, FL',
    time: '8:00 PM',
  },
  {
    id: '6',
    date: '2026-06-06',
    venue: 'Capri Restaurant',
    city: 'Homestead, FL',
    time: '7:00 PM',
  },
  {
    id: '7',
    date: '2026-06-20',
    venue: 'Sand Bar',
    city: 'Cutler Bay, FL',
    time: '7:00 PM',
  },
  {
    id: '8',
    date: '2026-07-04',
    venue: 'Private Event — TBA',
    city: 'South Florida',
    time: 'TBA',
  },
]

export const merch: MerchItem[] = [
  {
    id: '1',
    name: 'Rebound Rock Band Tee',
    price: 28,
    image: '/images/tee-product.webp',
    images: ['/images/tee-front-clean.webp', '/images/tee-product.webp'],
    category: 'tshirt',
    available: true,
    visible: true,
    externalUrl: '',
    atShows: true,
    description: 'Classic unisex crew-neck tee featuring the Rebound Rock Band gnome on the chest and a full back print. Soft, pre-shrunk, and built to last show after show.',
    specs: [
      { label: 'Fabric', value: '100% pre-shrunk cotton, 6 oz' },
      { label: 'Fit', value: 'Unisex — slightly relaxed' },
      { label: 'Print', value: 'Direct-to-garment (DTG)' },
      { label: 'Color', value: 'Black only' },
      { label: 'Care', value: 'Machine wash cold, tumble dry low' },
    ],
  },
  {
    id: '2',
    name: 'Gnome Logo Snapback',
    price: 30,
    category: 'hat',
    available: true,
    visible: true,
    externalUrl: '',
    atShows: true,
    description: 'Structured snapback with the Rebound Rock Band gnome logo embroidered on the front panel. One size fits most.',
    specs: [
      { label: 'Style', value: 'Structured 6-panel snapback' },
      { label: 'Material', value: 'Polyester / cotton blend' },
      { label: 'Closure', value: 'Adjustable snap back' },
      { label: 'Color', value: 'Black with red embroidery' },
    ],
  },
  {
    id: '3',
    name: 'Sticker Pack — 5 Pack',
    price: 10,
    category: 'sticker',
    available: true,
    visible: true,
    externalUrl: '',
    atShows: true,
    description: 'Five die-cut vinyl stickers featuring the Rebound Rock Band gnome in different poses. Weatherproof and UV-resistant.',
    specs: [
      { label: 'Quantity', value: '5 stickers per pack' },
      { label: 'Material', value: 'Weatherproof vinyl' },
      { label: 'Finish', value: 'Gloss laminate' },
      { label: 'Sizes', value: '2"–4" variety' },
    ],
  },
]

export const bandMembers: BandMember[] = [
  {
    id: '1',
    name: 'Tianny Cendan-Gomez',
    role: 'Lead Vocals',
    bio: 'Front of stage powerhouse — built for anthems and crowd energy.',
    photo: '/Tianny Cedan Gomez - lead singer.PNG',
    visible: true,
  },
  {
    id: '2',
    name: 'Jorge Almarales',
    role: 'Lead Guitar',
    bio: 'Riff architect with vintage tone and decades of live-stage command.',
    photo: '/Jorge Lead Guitar.PNG',
    visible: true,
  },
  {
    id: '3',
    name: 'Jose "Pepe" Ortiz',
    role: 'Founder · Bass · Band Director',
    bio: 'Founder, band director, and low-end anchor driving every set.',
    photo: '/Pepe.PNG',
    visible: true,
  },
  {
    id: '4',
    name: 'Adriana Suárez',
    role: 'Keyboards & Backup Vocals',
    bio: 'Keys and harmony that fill every room and lock in the classic sound.',
    photo: '/Adriana Suarez Keyboard.PNG',
    visible: true,
  },
  {
    id: '5',
    name: 'Anthony Curcio',
    role: 'Drums & Backup Vocals',
    bio: 'Precision and power behind the kit — the heartbeat of Rebound.',
    photo: '/Anthony Curcio Drums.PNG',
    visible: true,
  },
]

export const siteContent: SiteContent = {
  heroHeadline: 'Classic Rock That Brings the House Down',
  heroSubheadline:
    '5 live musicians. 4 decades of hits. One night you won\'t forget. Available for bars, festivals, private events, and corporate shows across South Florida.',
  aboutHeadline: 'Who We Are',
  aboutShort:
    'Five musicians, four decades of rock and roll, and one mission — bring the greatest hits of the 50s through 90s back to the stage with the energy they were written for.',
  groupPhoto: '/Band Members.PNG',
  aboutText: [
    'Rebound Rock Band is a South Florida-based five-piece live cover band bringing the greatest rock and roll hits from the 1950s through the 1990s back to the stage — where they belong.',
    'Whether it\'s Chuck Berry, The Beatles, Led Zeppelin, Queen, or Bon Jovi, we play the songs that shaped rock and roll history with the energy and authenticity they deserve. No backing tracks. No auto-tune. Just five musicians who love great music and know how to work a crowd.',
    'Based in South Florida and available for shows, private events, festivals, and corporate engagements throughout the region and beyond.',
  ],
  serviceArea: 'South Florida',
  footerTagline:
    'South Florida\'s live 5-piece classic rock cover band. Greatest hits from the 1950s through the 1990s.',
  ctaPrimaryLabel: 'Book Rebound Rock Band',
  ctaSecondaryLabel: 'View Press Kit',
  contactEmail: 'booking@reboundrockband.com',
  facebook: 'https://www.facebook.com/share/18hs9R8x9S/?mibextid=wwXIfr',
}

export const mediaItems: MediaItem[] = [
  {
    id: '1',
    type: 'video',
    url: '/videos/live-performance.mp4',
    caption: 'Live Performance',
    isFeatured: true,
    visible: true,
  },
]

export const epkContent: EpkContent = {
  tagline: 'South Florida · 5-Piece Live Cover Band · Classic Rock 50s–90s',
  bookerIntro:
    'Contact us directly for availability, pricing, and to request the full press kit PDF with photos and setlist.',
  repertoire: [
    { era: '50', artists: 'Chuck Berry, Elvis Presley, Buddy Holly, Little Richard' },
    { era: '60', artists: 'The Beatles, The Rolling Stones, The Doors, Jimi Hendrix' },
    { era: '70', artists: 'Led Zeppelin, Queen, Fleetwood Mac, Aerosmith, Lynyrd Skynyrd' },
    { era: '80', artists: "Bon Jovi, Journey, Def Leppard, Van Halen, Guns N' Roses" },
    { era: '90', artists: 'Nirvana, Pearl Jam, Red Hot Chili Peppers, Green Day, Counting Crows' },
  ],
  techSpecs: [
    { label: 'Set Length', value: '2 × 45-min sets (or custom)' },
    { label: 'Setup Time', value: '90 minutes prior to show' },
    { label: 'Soundcheck', value: '30 minutes' },
    { label: 'PA System', value: 'Self-contained (or house PA accepted)' },
    { label: 'Lighting', value: 'Basic stage lighting available' },
    { label: 'Stage Required', value: '15ft × 12ft minimum' },
    { label: 'Power', value: '2 × 20A circuits minimum' },
  ],
  setlists: [
    {
      title: 'Set 1',
      songs: [
        'Be My Babe', 'Crimson & Clover', 'Mustang Sally', 'Call Me',
        'I See Red', "Rockin' in the Free World", "Don't Stop Believin'",
        'Have You Ever Seen the Rain?', 'Zombie', 'Some Kind of Wonderful',
        'Flowers', 'Sweet Child of Mine',
      ],
    },
    {
      title: 'Set 2',
      songs: [
        'Here I Go Again', 'All Right Now', "What's Up", 'One Way or Another',
        'Oh! Darling', 'I Heard It Through the Grapevine', 'Proud Mary',
        'Whole Lotta Love', 'Message in the Bottle', 'Smells Like Teen Spirit',
        'I Love Rock & Roll', 'I Hate Myself for Loving You',
      ],
    },
    {
      title: 'Set 3',
      songs: [
        'Just a Girl', "I Think We're Alone Now", 'Come to My Window',
        'All I Wanna Do', 'Runaround Sue', 'Take On Me', "I'm the Only One",
        'Girls Just Wanna Have Fun', 'Love Is a Battlefield',
        'Come and Get Your Love', 'Dream On', 'Get Ready',
      ],
    },
    {
      title: 'Set 4',
      songs: [
        'Hit Me With Your Best Shot', 'Bitch', "I Can't Remember to Forget You",
        'Susie Q', 'Wake Me Up Before You Go-Go', 'Piece of My Heart',
        'You Oughta Know', 'I Want You to Want Me', 'Edge of 17',
        'I Believe in a Thing Called Love', 'TNT', 'Na Na Hey Hey Kiss Him Goodbye',
      ],
    },
  ],
}

// ── Email Templates ───────────────────────────────────────────────────────────

export interface EmailTemplate {
  id: string
  slug: string        // 'booking-auto-reply' | 'venue-first-outreach' | 'venue-follow-up' | 'venue-thanks-booked'
  name: string
  subject: string     // supports {{variables}}
  bodyHtml: string    // full HTML; supports {{variables}}
  isSystem: boolean   // system templates: edit only, no delete
  createdAt: string
  updatedAt: string
}

// ── Auto-Reply Logs ───────────────────────────────────────────────────────────

export type AutoReplyStatus = 'scheduled' | 'sent' | 'failed' | 'skipped'

export interface AutoReplyLog {
  id: string
  bookingId: string
  scheduledAt: string
  sentAt?: string
  resendEmailId?: string
  status: AutoReplyStatus
  errorMessage?: string
}

// ── Venue Finder ──────────────────────────────────────────────────────────────

export type VenueStatus =
  | 'New'
  | 'Reviewed'
  | 'Contact Added'
  | 'Draft Ready'
  | 'Sent'
  | 'Follow-up'
  | 'Interested'
  | 'Not Interested'
  | 'Booked'
  | 'Archived'

export interface Venue {
  id: string
  placeId: string           // Google Place ID — used for deduplication
  name: string
  address: string
  website?: string
  phone?: string
  rating?: number
  types: string[]
  status: VenueStatus
  contactEmail?: string     // manually entered by admin
  notes?: string
  assignedTo?: string
  followUpDate?: string     // YYYY-MM-DD
  lastContactedAt?: string
  createdAt: string
  updatedAt: string
}

// ── Outreach Logs ─────────────────────────────────────────────────────────────

export type OutreachStatus = 'sent' | 'failed'

export interface OutreachLog {
  id: string
  venueId: string
  venueName: string         // denormalized
  toEmail: string
  subject: string
  bodyHtml: string          // rendered (variables already substituted)
  templateId: string
  templateSlug: string      // denormalized
  sentAt: string
  resendEmailId?: string
  status: OutreachStatus
  errorMessage?: string
}

// ── Booking / Song-Request email logs ─────────────────────────────────────────

export interface BookingEmailLog {
  id: string
  entityType: 'booking' | 'song-request'
  entityId: string            // bookingId or songRequestId
  toEmail: string
  subject: string
  bodyHtml: string
  templateId: string
  templateSlug: string
  sentAt: string
  resendEmailId?: string
  status: 'sent' | 'failed'
  errorMessage?: string
}

// ── Inbound Emails ────────────────────────────────────────────────────────────

export interface InboundEmail {
  id: string
  fromEmail: string
  fromName?: string
  toEmail: string            // full to address (may include +tag for entity routing)
  subject: string
  bodyText?: string
  bodyHtml?: string
  receivedAt: string
  entityType?: 'booking' | 'venue' | 'song-request'
  entityId?: string          // parsed from +tag
  read: boolean
  resendMessageId?: string
}

// ── Venue Store (separate from ContentStore) ──────────────────────────────────

export interface VenueStore {
  venues: Venue[]
  outreachLogs: OutreachLog[]
  emailTemplates: EmailTemplate[]
  autoReplyLogs: AutoReplyLog[]
  bookingEmailLogs: BookingEmailLog[]
  inboundEmails: InboundEmail[]
}

// ── Google Places search result (mapped from API response) ────────────────────

export interface PlaceSearchResult {
  placeId: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  types: string[]
}

export function formatDate(isoDate: string): {
  day: string
  month: string
  year: string
  full: string
  weekday: string
} {
  const date = new Date(isoDate + 'T00:00:00')
  return {
    day: date.toLocaleDateString('en-US', { day: '2-digit' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    year: date.toLocaleDateString('en-US', { year: 'numeric' }),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    full: date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  }
}
