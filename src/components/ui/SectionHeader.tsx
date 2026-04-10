interface SectionHeaderProps {
  eyebrow?: string
  title: string
  titleHighlight?: string   // word(s) in title to color red — must exactly match a substring of title
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  const renderTitle = () => {
    if (!titleHighlight) return title
    const idx = title.indexOf(titleHighlight)
    if (idx === -1) return title
    return (
      <>
        {title.slice(0, idx)}
        <span className="text-brand-red text-glow-red">{titleHighlight}</span>
        {title.slice(idx + titleHighlight.length)}
      </>
    )
  }

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="font-heading text-brand-red text-xs tracking-widest uppercase border border-brand-red/40 px-3 py-1 self-start">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display uppercase text-5xl lg:text-6xl leading-none text-white">
        {renderTitle()}
      </h2>
      {subtitle && (
        <p className="font-body text-brand-muted text-base max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
