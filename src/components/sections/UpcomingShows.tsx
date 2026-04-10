import { shows } from '@/lib/data'
import ShowCard from '@/components/ui/ShowCard'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'

interface UpcomingShowsProps {
  limit?: number
  showViewAll?: boolean
}

export default function UpcomingShows({ limit = 4, showViewAll = true }: UpcomingShowsProps) {
  const upcoming = shows.slice(0, limit)

  return (
    <section className="bg-brand-bg py-20">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <SectionHeader
            eyebrow="On the Road"
            title="Upcoming Shows"
            titleHighlight="Shows"
            align="left"
          />
          {showViewAll && (
            <Button href="/shows" variant="outline" size="sm" className="self-start lg:self-auto flex-shrink-0">
              See All Shows
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {upcoming.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>

        {upcoming.length === 0 && (
          <div className="text-center py-16 border border-brand-border rounded-sm">
            <p className="font-heading text-brand-muted text-sm tracking-widest uppercase">
              More dates being announced — check back soon
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
