import Image from 'next/image'
import Button from '@/components/ui/Button'
import SectionHeader from '@/components/ui/SectionHeader'

export default function AboutPreview() {
  return (
    <section className="bg-brand-bg py-20">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Image side */}
          <div className="flex-shrink-0 w-full max-w-sm lg:max-w-md">
            <div className="relative aspect-square bg-brand-elevated border border-brand-border rounded-sm overflow-hidden">
              {/* Placeholder band photo — swap with real band photo */}
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-brand-muted">
                <Image
                  src="/images/logo.jpeg"
                  alt="Rebound Rock Band"
                  fill
                  className="object-cover opacity-20"
                />
                <div className="relative z-10 text-center px-6">
                  <div className="font-display text-4xl text-brand-red mb-2">LIVE.</div>
                  <p className="font-body text-xs text-brand-muted tracking-widest uppercase">Band photo coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="flex-1">
            <SectionHeader
              eyebrow="The Band"
              title="Who We Are"
              titleHighlight="We Are"
              align="left"
              className="mb-6"
            />

            <div className="space-y-4 font-body text-gray-300 leading-relaxed mb-8">
              <p>
                Rebound Rock Band is a South Florida-based five-piece live cover band bringing the greatest
                rock and roll hits from the 1950s through the 1990s back to the stage — where they belong.
              </p>
              <p>
                Whether it&apos;s Chuck Berry, The Beatles, Led Zeppelin, Queen, or Bon Jovi, we play the songs
                that shaped rock and roll history with the energy and authenticity they deserve. No backing tracks.
                No auto-tune. Just five musicians who love great music and know how to work a crowd.
              </p>
              <p>
                Based in South Florida and available for shows, private events, festivals, and corporate
                engagements throughout the region and beyond.
              </p>
            </div>

            <Button href="/about" variant="primary" size="md">
              Meet the Band
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}
