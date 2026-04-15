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
