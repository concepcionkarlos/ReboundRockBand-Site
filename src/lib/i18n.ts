export type Lang = 'en' | 'es'

export const translations = {
  en: {
    nav: {
      shows: 'Shows',
      about: 'About',
      media: 'Media',
      merch: 'Merch',
      epk: 'EPK',
      bookNow: 'Book Now',
      bookFull: 'Book Rebound Rock Band',
    },
    hero: {
      eyebrow: 'Live Rock Experience',
      upcomingShows: 'Upcoming Shows',
      scroll: 'Scroll',
      followUs: 'Follow us:',
      stats: {
        members: 'Live Members',
        decades: 'Decades of Hits',
        shows: 'Shows Played',
        basedIn: 'Based In',
      },
    },
    footer: {
      followBand: 'Follow the Band',
      quickLinks: 'Quick Links',
      bookSection: 'Book Rebound Rock Band',
      available: 'Available for bars, private events, corporate shows, festivals, and parties across',
      getQuote: 'Get a Quote',
      followFacebook: 'Follow on Facebook',
      links: {
        shows: 'Shows & Events',
        about: 'About the Band',
        media: 'Media Gallery',
        merch: 'Merch',
        booking: 'Book Us',
        epk: 'Press Kit (EPK)',
      },
    },
  },
  es: {
    nav: {
      shows: 'Conciertos',
      about: 'Nosotros',
      media: 'Media',
      merch: 'Merch',
      epk: 'EPK',
      bookNow: 'Reservar',
      bookFull: 'Reservar a Rebound Rock Band',
    },
    hero: {
      eyebrow: 'Experiencia de Rock en Vivo',
      upcomingShows: 'Próximos Conciertos',
      scroll: 'Desliza',
      followUs: 'Síguenos:',
      stats: {
        members: 'Integrantes',
        decades: 'Décadas de Éxitos',
        shows: 'Shows Realizados',
        basedIn: 'Con base en',
      },
    },
    footer: {
      followBand: 'Síguenos',
      quickLinks: 'Accesos Rápidos',
      bookSection: 'Reservar a Rebound Rock Band',
      available: 'Disponibles para bares, eventos privados, corporativos, festivales y fiestas en',
      getQuote: 'Pedir Cotización',
      followFacebook: 'Seguir en Facebook',
      links: {
        shows: 'Conciertos y Eventos',
        about: 'Sobre la Banda',
        media: 'Galería de Medios',
        merch: 'Merch',
        booking: 'Contrátanos',
        epk: 'Kit de Prensa (EPK)',
      },
    },
  },
} as const

export type Translations = typeof translations['en']
