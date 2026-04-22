import { getLang } from '@/lib/getLang'
import { translations } from '@/lib/i18n'

const icons = [
  <svg key="0" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>,
  <svg key="1" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  <svg key="2" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  <svg key="3" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>,
]

const nums = ['01', '02', '03', '04']

export default async function BandHighlights() {
  const lang = await getLang()
  const items = translations[lang].home.bandHighlights.items
  return (
    <section className="bg-brand-surface border-y border-brand-border py-12 lg:py-16 relative overflow-hidden">
      {/* Subtle stripe texture */}
      <div className="absolute inset-0 bg-stripe-texture pointer-events-none opacity-100" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-brand-border divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-5 p-8 lg:p-10 group hover:bg-brand-elevated transition-colors duration-200 relative"
            >
              {/* Number label */}
              <span className="font-display text-6xl text-brand-border/70 group-hover:text-brand-red/15 leading-none transition-colors duration-300 absolute top-5 right-5 select-none">
                {nums[i]}
              </span>

              {/* Icon */}
              <div className="text-brand-red group-hover:scale-110 transition-transform duration-200 w-fit mt-1">
                {icons[i]}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-heading uppercase tracking-wide text-white text-sm mb-2.5 group-hover:text-brand-red transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-brand-text leading-relaxed">{item.body}</p>
              </div>

              {/* Bottom accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
