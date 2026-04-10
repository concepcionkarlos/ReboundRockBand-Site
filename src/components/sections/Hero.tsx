import Image from 'next/image'
import Button from '@/components/ui/Button'

const stats = [
  { value: '5', label: 'Live Members' },
  { value: '4', label: 'Decades of Hits' },
  { value: '100+', label: 'Shows Played' },
  { value: '∞', label: 'Great Nights' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-bg">
      {/* Atmospheric red glow — center */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand-red/10 blur-[120px]" />
        <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full bg-brand-blue/8 blur-[90px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-brand-red/6 blur-[90px]" />
      </div>

      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-grid-texture pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Text block */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 font-heading text-brand-red text-xs tracking-widest uppercase border border-brand-red/40 px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse-slow" />
              South Florida's Live Rock Experience
            </span>

            <h1 className="font-display uppercase leading-[0.92] text-white mb-7">
              <span className="block text-[4rem] sm:text-[5.5rem] lg:text-[7rem]">Classic Rock</span>
              <span
                className="block text-[4rem] sm:text-[5.5rem] lg:text-[7rem] text-brand-red"
                style={{ textShadow: '0 0 40px rgba(224,16,30,0.5), 0 0 80px rgba(224,16,30,0.25)' }}
              >
                That Brings
              </span>
              <span className="block text-[4rem] sm:text-[5.5rem] lg:text-[7rem]">the House Down</span>
            </h1>

            <p className="font-body text-lg text-gray-300 max-w-lg mx-auto lg:mx-0 mb-9 leading-relaxed">
              5 live musicians. 4 decades of hits. One night you won&apos;t forget.
              Available for bars, festivals, private events, and corporate shows across South Florida.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button href="/booking" variant="primary" size="lg">
                Book the Band
              </Button>
              <Button href="/shows" variant="outline" size="lg">
                Upcoming Shows
              </Button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-4 mt-12 pt-8 border-t border-brand-border max-w-sm mx-auto lg:mx-0">
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="font-display text-3xl lg:text-4xl text-white leading-none">{s.value}</div>
                  <div className="font-body text-[10px] text-brand-muted uppercase tracking-widest mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mascot / Logo */}
          <div className="order-1 lg:order-2 flex-shrink-0">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-[380px] lg:h-[380px]">
              {/* Glow rings */}
              <div className="absolute inset-[-20px] rounded-full bg-brand-red/12 blur-2xl" />
              <div className="absolute inset-0 rounded-full border border-brand-red/25" />
              <div className="absolute inset-[-14px] rounded-full border border-brand-red/10" />
              <Image
                src="/images/logo.jpeg"
                alt="Rebound Rock Band Mascot"
                fill
                className="object-contain relative z-10"
                priority
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-brand-bg to-transparent pointer-events-none" />

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-muted animate-bounce-slow">
        <span className="font-body text-[10px] tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
