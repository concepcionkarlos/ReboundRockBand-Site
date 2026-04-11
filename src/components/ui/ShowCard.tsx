import type { Show } from '@/lib/data'
import { formatDate } from '@/lib/data'
import Link from 'next/link'

interface ShowCardProps {
  show: Show
  variant?: 'default' | 'featured'
}

export default function ShowCard({ show, variant = 'default' }: ShowCardProps) {
  const { day, month, weekday } = formatDate(show.date)
  const isFeatured = variant === 'featured' || show.isFeatured

  return (
    <div
      className={`flex items-stretch gap-0 border rounded-sm overflow-hidden transition-colors group ${
        isFeatured
          ? 'border-brand-red/40 bg-brand-red/5 hover:bg-brand-red/8'
          : 'border-brand-border bg-brand-surface hover:border-brand-red/30'
      }`}
    >
      {/* Date column */}
      <div
        className={`flex-shrink-0 flex flex-col items-center justify-center w-16 py-4 border-r text-center ${
          isFeatured ? 'border-brand-red/30 bg-brand-red/10' : 'border-brand-border bg-brand-elevated'
        }`}
      >
        <span className="font-body text-[9px] text-brand-muted uppercase tracking-widest">{weekday}</span>
        <span className="font-display text-3xl text-white leading-none mt-0.5">{day}</span>
        <span className="font-heading text-[10px] text-brand-red tracking-widest uppercase mt-0.5">{month}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex items-center gap-4 px-4 py-3.5">
        <div className="flex-1 min-w-0">
          <div className="font-heading text-sm text-white tracking-wide truncate">{show.venue}</div>
          <div className="font-body text-xs text-brand-muted mt-0.5 truncate">{show.city}</div>
          <div className="font-body text-xs text-brand-muted/70 mt-0.5">{show.time}</div>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0">
          {show.ticketUrl ? (
            <Link
              href={show.ticketUrl}
              className="font-heading text-[10px] tracking-widest uppercase border border-brand-red text-brand-red px-3 py-1.5 hover:bg-brand-red hover:text-white transition-colors whitespace-nowrap"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tickets
            </Link>
          ) : (
            <span className="font-heading text-[10px] tracking-widest uppercase text-brand-muted group-hover:text-brand-red transition-colors whitespace-nowrap">
              Free Entry
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
