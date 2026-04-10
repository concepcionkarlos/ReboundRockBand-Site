import type { Show } from '@/lib/data'
import { formatDate } from '@/lib/data'
import Link from 'next/link'

interface ShowCardProps {
  show: Show
  variant?: 'default' | 'featured'
}

export default function ShowCard({ show, variant = 'default' }: ShowCardProps) {
  const { day, month } = formatDate(show.date)
  const isFeatured = variant === 'featured' || show.isFeatured

  return (
    <div
      className={`flex items-center gap-5 border rounded-sm p-4 transition-colors group
        ${isFeatured
          ? 'border-brand-red/50 bg-brand-red/5 hover:bg-brand-red/10'
          : 'border-brand-border bg-brand-surface hover:border-brand-red/30 hover:bg-brand-elevated'
        }`}
    >
      {/* Date block */}
      <div
        className={`flex-shrink-0 w-14 text-center border-r pr-5
          ${isFeatured ? 'border-brand-red/40' : 'border-brand-border'}`}
      >
        <div className="font-display text-3xl leading-none text-white">{day}</div>
        <div className="font-heading text-xs text-brand-red tracking-widest mt-0.5">{month}</div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-heading text-white text-sm tracking-wide truncate">{show.venue}</div>
        <div className="font-body text-brand-muted text-xs mt-0.5 truncate">{show.city}</div>
        <div className="font-body text-brand-muted text-xs mt-0.5">{show.time}</div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0">
        {show.ticketUrl ? (
          <Link
            href={show.ticketUrl}
            className="font-heading text-xs tracking-widest uppercase border border-brand-red text-brand-red px-3 py-1.5 hover:bg-brand-red hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tickets
          </Link>
        ) : (
          <span className="font-heading text-xs tracking-widest uppercase text-brand-muted group-hover:text-white transition-colors">
            Free Entry →
          </span>
        )}
      </div>
    </div>
  )
}
