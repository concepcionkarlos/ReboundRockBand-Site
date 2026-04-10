const highlights = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    title: '5-Piece Live Band',
    body: 'Full lineup every show — vocals, lead guitar, rhythm guitar, bass, and drums. No tracks, no shortcuts.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "50s Through the 90s",
    body: 'Four decades of the greatest rock, pop-rock, and classic hits — songs every crowd knows and loves.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Any Crowd, Any Venue',
    body: 'Bars, rooftops, festivals, corporate events, private parties, and weddings — we bring the energy everywhere.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Professional & Reliable',
    body: 'Full PA and lighting setup available. On time, prepared, and ready to put on a great show.',
  },
]

export default function BandHighlights() {
  return (
    <section className="bg-brand-surface border-y border-brand-border py-16">
      <div className="container mx-auto px-6 lg:px-10">
        {/* Grid of highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 border border-brand-border bg-brand-elevated rounded-sm group hover:border-brand-red/40 transition-colors"
            >
              <div className="text-brand-red group-hover:scale-110 transition-transform w-fit">
                {h.icon}
              </div>
              <div>
                <h3 className="font-heading uppercase tracking-wide text-white text-sm mb-2">{h.title}</h3>
                <p className="font-body text-sm text-brand-muted leading-relaxed">{h.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
