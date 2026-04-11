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
      className={`flex items-stretch gap-0 overflow-hidden transition-all duration-200 group relative ${
        isFeatured
          ? 'border border-brand-red/50 bg-brand-red/5 hover:bg-brand-red/8 box-glow-red'
          : 'border border-brand-border bg-brand-surface hover:border-brand-red/30 hover:bg-brand-elevated'
      }`}
    >
      {/* Featured left accent stripe */}
      {isFeatured && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-red" />
      )}

      {/* Date column */}
      <div
        className={`flex-shrink-0 flex flex-col items-center justify-center w-[68px] py-4 text-center ${
          isFeatured
            ? 'bg-brand-red/12 border-r border-brand-red/30 ml-[3px]'
            : 'bg-brand-elevated border-r border-brand-border'
        }`}
      >
        <span className="font-body text-[9px] text-brand-muted uppercase tracking-widest">{weekday}</span>
        <span className="font-display text-[2.2rem] text-white leading-none mt-0.5">{day}</span>
        <span className="font-heading text-[10px] text-brand-red tracking-widest uppercase mt-0.5">{month}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex items-center gap-4 px-4 py-3.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-heading text-sm text-white tracking-wide truncate">{show.venue}</div>
            {isFeatured && (
              <span className="font-heading text-[9px] uppercase tracking-widest text-brand-red border border-brand-red/40 px-1.5 py-0.5 flex-shrink-0">
                Featured
              </span>
            )}
          </div>
          <div className="font-body text-xs text-brand-muted mt-0.5 truncate">{show.city}</div>
          <div className="font-body text-xs text-brand-muted/60 mt-0.5">{show.time}</div>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0">
          {show.ticketUrl ? (
            <Link
              href={show.ticketUrl}
              className="font-heading text-[10px] tracking-widest uppercase border border-brand-red text-brand-red px-3 py-1.5 hover:bg-brand-red hover:text-white transition-all duration-150 whitespace-nowrap"
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
