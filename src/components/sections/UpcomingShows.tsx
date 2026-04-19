import { readContent } from '@/lib/store'
import ShowCard from '@/components/ui/ShowCard'
import SectionHeader from '@/components/ui/SectionHeader'
import Link from 'next/link'

interface UpcomingShowsProps {
  limit?: number
  showViewAll?: boolean
}

export default async function UpcomingShows({ limit = 4, showViewAll = true }: UpcomingShowsProps) {
  const { shows } = await readContent()
  const upcoming = shows
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit)

  return (
    <section className="bg-brand-bg py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <SectionHeader
            eyebrow="On the Road"
            title="Upcoming Shows"
            titleHighlight="Shows"
            align="left"
          />
          {showViewAll && (
            <Link
              href="/shows"
              className="font-heading text-xs uppercase tracking-widest border border-brand-border text-brand-muted hover:border-brand-red hover:text-brand-red transition-colors px-4 py-2 self-start sm:self-auto flex-shrink-0"
            >
              All Shows →
            </Link>
          )}
        </div>

        {upcoming.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcoming.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-brand-border rounded-sm">
            <p className="font-heading text-brand-muted text-xs tracking-widest uppercase">
              New dates coming soon — check back shortly
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
