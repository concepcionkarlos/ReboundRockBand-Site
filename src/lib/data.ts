export interface Show {
  id: string
  date: string        // ISO: "2026-04-18"
  venue: string
  city: string
  time: string
  ticketUrl?: string
  isFeatured?: boolean
}

export interface MerchItem {
  id: string
  name: string
  price: number
  image?: string          // path in /public/images/merch/
  category: 'tshirt' | 'hat' | 'sticker' | 'other'
  available: boolean
  externalUrl?: string    // Printful / external checkout URL
  visible: boolean
}

export interface BandMember {
  id: string
  name: string
  role: string
  bio: string
  photo?: string
}

export interface SiteContent {
  heroHeadline: string
  heroSubheadline: string
  aboutText: string[]
  contactEmail: string
  contactPhone: string
  instagram: string
  facebook: string
  youtube: string
}

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
    price: 25,
    category: 'tshirt',
    available: true,
    visible: true,
    externalUrl: '',
  },
  {
    id: '2',
    name: 'Gnome Logo Snapback',
    price: 30,
    category: 'hat',
    available: true,
    visible: true,
    externalUrl: '',
  },
  {
    id: '3',
    name: 'Sticker Pack — 5 Pack',
    price: 10,
    category: 'sticker',
    available: true,
    visible: true,
    externalUrl: '',
  },
]

export const bandMembers: BandMember[] = [
  {
    id: '1',
    name: 'TBA',
    role: 'Lead Vocals',
    bio: 'Powerhouse voice built for classic rock anthems — front of stage, all night.',
  },
  {
    id: '2',
    name: 'TBA',
    role: 'Lead Guitar',
    bio: 'Riff machine with decades of stage experience and tone to match.',
  },
  {
    id: '3',
    name: 'TBA',
    role: 'Rhythm Guitar',
    bio: 'The groove architect keeping the energy locked tight every set.',
  },
  {
    id: '4',
    name: 'TBA',
    role: 'Bass Guitar',
    bio: 'Low-end thunder you feel before you hear it.',
  },
  {
    id: '5',
    name: 'TBA',
    role: 'Drums',
    bio: 'The heartbeat of the band — precise, powerful, relentless.',
  },
]

export const siteContent: SiteContent = {
  heroHeadline: 'Classic Rock That Brings the House Down',
  heroSubheadline:
    '5 live musicians. 4 decades of hits. One night you won\'t forget. Available for bars, festivals, private events, and corporate shows across South Florida.',
  aboutText: [
    'Rebound Rock Band is a South Florida-based five-piece live cover band bringing the greatest rock and roll hits from the 1950s through the 1990s back to the stage — where they belong.',
    'Whether it\'s Chuck Berry, The Beatles, Led Zeppelin, Queen, or Bon Jovi, we play the songs that shaped rock and roll history with the energy and authenticity they deserve. No backing tracks. No auto-tune. Just five musicians who love great music and know how to work a crowd.',
    'Based in South Florida and available for shows, private events, festivals, and corporate engagements throughout the region and beyond.',
  ],
  contactEmail: 'booking@reboundrockband.com',
  contactPhone: '(305) 555-0100',
  instagram: 'https://instagram.com/reboundrockband',
  facebook: 'https://facebook.com/reboundrockband',
  youtube: 'https://youtube.com/@reboundrockband',
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
