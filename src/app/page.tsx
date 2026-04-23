import Hero from '@/components/sections/Hero'
import UpcomingShows from '@/components/sections/UpcomingShows'
import BandHighlights from '@/components/sections/BandHighlights'
import BookingCTA from '@/components/sections/BookingCTA'
import AboutPreview from '@/components/sections/AboutPreview'
import MediaPreview from '@/components/sections/MediaPreview'
import MerchPreview from '@/components/sections/MerchPreview'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <Hero />
      <UpcomingShows limit={4} showViewAll={true} />
      <BandHighlights />
      <BookingCTA />
      <AboutPreview />
      <MediaPreview />
      <MerchPreview />
    </>
  )
}
