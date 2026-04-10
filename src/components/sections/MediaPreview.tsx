import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'

export default function MediaPreview() {
  return (
    <section className="bg-brand-surface border-t border-brand-border py-20">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <SectionHeader
            eyebrow="Watch & Listen"
            title="Live in Action"
            titleHighlight="in Action"
            align="left"
          />
          <Button href="/media" variant="outline" size="sm" className="self-start lg:self-auto flex-shrink-0">
            Full Gallery
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Featured video */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-brand-elevated border border-brand-border rounded-sm overflow-hidden group">
              <video
                src="/videos/live-performance.mp4"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                muted
                loop
                playsInline
                autoPlay
              />
              {/* Play overlay hint */}
              <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div>
                  <div className="font-heading text-xs text-brand-red uppercase tracking-widest mb-1">Live Performance</div>
                  <div className="font-display text-2xl text-white uppercase leading-none">Watch the Show</div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo grid placeholders */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="relative aspect-video lg:aspect-auto lg:flex-1 bg-brand-elevated border border-brand-border rounded-sm overflow-hidden flex items-center justify-center min-h-[100px]"
              >
                <div className="text-center px-4">
                  <div className="font-display text-brand-red/40 text-2xl mb-1">+</div>
                  <p className="font-body text-xs text-brand-muted uppercase tracking-widest">Photo {i}</p>
                  <p className="font-body text-xs text-brand-muted/60">Add band photos here</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
