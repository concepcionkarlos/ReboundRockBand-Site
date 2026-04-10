import Hero from '@/components/sections/Hero'
import BandHighlights from '@/components/sections/BandHighlights'
import UpcomingShows from '@/components/sections/UpcomingShows'
import BookingCTA from '@/components/sections/BookingCTA'
import AboutPreview from '@/components/sections/AboutPreview'
import MediaPreview from '@/components/sections/MediaPreview'
import MerchPreview from '@/components/sections/MerchPreview'

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — full viewport, logo mascot, headline, stats, dual CTA */}
      <Hero />

      {/* 2. Band Highlights — 4 value props in cards */}
      <BandHighlights />

      {/* 3. Upcoming Shows — next 4 shows with date/venue */}
      <UpcomingShows limit={4} showViewAll={true} />

      {/* 4. Booking CTA — pitch section for event planners/bookers */}
      <BookingCTA />

      {/* 5. About Preview — short bio + band photo + Meet the Band link */}
      <AboutPreview />

      {/* 6. Media Preview — video + photo placeholders + Full Gallery link */}
      <MediaPreview />

      {/* 7. Merch Preview — 3 items + Shop All link */}
      <MerchPreview />
    </>
  )
}
