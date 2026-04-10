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
  imagePlaceholder: string   // CSS color for placeholder
  category: 'tshirt' | 'hat' | 'sticker' | 'other'
  available: boolean
}

export interface BandMember {
  id: string
  name: string
  role: string
  bio: string
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
    venue: 'TBA — Private Event',
    city: 'South Florida',
    time: 'TBA',
  },
]

export const merch: MerchItem[] = [
  {
    id: '1',
    name: 'Rebound Rock Band Tee',
    price: 25,
    imagePlaceholder: '#1a1a2e',
    category: 'tshirt',
    available: true,
  },
  {
    id: '2',
    name: 'Gnome Logo Snapback',
    price: 30,
    imagePlaceholder: '#1a1a2e',
    category: 'hat',
    available: true,
  },
  {
    id: '3',
    name: 'Sticker Pack — 5 Pack',
    price: 10,
    imagePlaceholder: '#1a1a2e',
    category: 'sticker',
    available: true,
  },
]

export const bandMembers: BandMember[] = [
  {
    id: '1',
    name: 'Band Member',
    role: 'Lead Vocals',
    bio: 'Powerhouse voice built for classic rock anthems — front of stage, all night.',
  },
  {
    id: '2',
    name: 'Band Member',
    role: 'Lead Guitar',
    bio: 'Riff machine with decades of stage experience and tone to match.',
  },
  {
    id: '3',
    name: 'Band Member',
    role: 'Rhythm Guitar',
    bio: 'The groove architect keeping the energy locked tight every set.',
  },
  {
    id: '4',
    name: 'Band Member',
    role: 'Bass Guitar',
    bio: 'Low-end thunder you feel before you hear it.',
  },
  {
    id: '5',
    name: 'Band Member',
    role: 'Drums',
    bio: 'The heartbeat of the band — precise, powerful, relentless.',
  },
]

export function formatDate(isoDate: string): { day: string; month: string; year: string; full: string } {
  const date = new Date(isoDate + 'T00:00:00')
  return {
    day: date.toLocaleDateString('en-US', { day: '2-digit' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    year: date.toLocaleDateString('en-US', { year: 'numeric' }),
    full: date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }),
  }
}
