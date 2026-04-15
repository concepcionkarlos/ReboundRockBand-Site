'use client'

import { useState, useEffect, useCallback } from 'react'
import { siteContent as initialContent, type SiteContent } from '@/lib/data'
import ImageUpload from '@/components/admin/ImageUpload'

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

const textareaClass = `${inputClass} resize-none`

export default function AdminContent() {
  const [content, setContent] = useState<SiteContent>(initialContent)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'contact'>('hero')

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => { if (d.siteContent) setContent(d.siteContent) })
      .catch(() => {})
  }, [])

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const persist = useCallback(async (updated: SiteContent) => {
    setSaving(true)
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'siteContent', data: updated }),
      })
      flash()
    } finally {
      setSaving(false)
    }
  }, [])

  const saveContent = async () => await persist(content)

  const updateAboutText = (index: number, value: string) => {
    const updated = [...content.aboutText]
    updated[index] = value
    setContent({ ...content, aboutText: updated })
  }
  const addAboutParagraph = () => setContent({ ...content, aboutText: [...content.aboutText, ''] })
  const removeAboutParagraph = (index: number) => setContent({ ...content, aboutText: content.aboutText.filter((_, i) => i !== index) })

  const tabs = [
    { id: 'hero' as const, label: 'Hero Text' },
    { id: 'about' as const, label: 'About' },
    { id: 'contact' as const, label: 'Contact & Socials' },
  ]

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="border-l-2 border-brand-red pl-4">
          <h1 className="font-display uppercase text-4xl text-white leading-none">Content</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">Hero, About, Contact &amp; Socials</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-1.5 font-heading text-[10px] text-green-400 uppercase tracking-widest">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </div>
          )}
          {saving && <div className="font-heading text-[10px] text-white/30 uppercase tracking-widest">Saving…</div>}
          <button onClick={saveContent} disabled={saving} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-all btn-glow-red disabled:opacity-60">
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-8 border-b border-white/8">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`font-heading text-xs uppercase tracking-widest px-5 py-3 border-b-2 transition-colors -mb-px ${
              activeTab === tab.id ? 'border-brand-red text-white' : 'border-transparent text-white/30 hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Hero Tab ── */}
      {activeTab === 'hero' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Main Headline</label>
            <input type="text" value={content.heroHeadline} onChange={(e) => setContent({ ...content, heroHeadline: e.target.value })} className={inputClass} />
            <p className="font-body text-xs text-white/20">Shown in red below the band name in the hero section.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Subheadline / Description</label>
            <textarea rows={3} value={content.heroSubheadline} onChange={(e) => setContent({ ...content, heroSubheadline: e.target.value })} className={textareaClass} />
            <p className="font-body text-xs text-white/20">Supporting copy below the headline.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Primary CTA Label</label>
              <input type="text" value={content.ctaPrimaryLabel} onChange={(e) => setContent({ ...content, ctaPrimaryLabel: e.target.value })} className={inputClass} />
              <p className="font-body text-xs text-white/20">Main booking button text.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Secondary CTA Label</label>
              <input type="text" value={content.ctaSecondaryLabel} onChange={(e) => setContent({ ...content, ctaSecondaryLabel: e.target.value })} className={inputClass} />
              <p className="font-body text-xs text-white/20">Secondary button (press kit).</p>
            </div>
          </div>
          <div className="p-5 border border-white/6 bg-[#0d0d1e]">
            <p className="font-heading text-[9px] uppercase tracking-widest text-white/20 mb-4">Live Preview</p>
            <div className="font-display uppercase text-2xl text-white leading-none mb-1">Rebound Rock Band</div>
            <div className="font-display uppercase text-xl text-brand-red leading-none mb-3" style={{ textShadow: '0 0 30px rgba(224,16,30,0.4)' }}>
              {content.heroHeadline}
            </div>
            <p className="font-body text-xs text-white/40 leading-relaxed max-w-sm">{content.heroSubheadline}</p>
          </div>
        </div>
      )}

      {/* ── About Tab ── */}
      {activeTab === 'about' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">About Page Headline</label>
            <input type="text" value={content.aboutHeadline} onChange={(e) => setContent({ ...content, aboutHeadline: e.target.value })} className={inputClass} placeholder="Who We Are" />
            <p className="font-body text-xs text-white/20">H1 on the About page. Last word renders in red.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Short Teaser (Home Page)</label>
            <textarea rows={3} value={content.aboutShort} onChange={(e) => setContent({ ...content, aboutShort: e.target.value })} className={textareaClass} />
            <p className="font-body text-xs text-white/20">One or two sentences shown on the Home page.</p>
          </div>
          <div className="border-t border-white/6 pt-5">
            <ImageUpload
              label="Featured Group Photo"
              value={content.groupPhoto}
              onChange={(url) => setContent({ ...content, groupPhoto: url })}
              previewClassName="w-full aspect-[16/9] max-w-md"
              objectFit="cover"
              objectPosition="50% 45%"
              helper="Shown at the top of the About page. Upload a wide landscape photo for best results."
            />
          </div>
          <div className="border-t border-white/6 pt-5">
            <p className="font-body text-xs text-white/30 leading-relaxed mb-4">Bio paragraphs shown on the About page.</p>
          </div>
          {content.aboutText.map((para, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Paragraph {i + 1}</label>
                {content.aboutText.length > 1 && (
                  <button onClick={() => removeAboutParagraph(i)} className="font-heading text-[9px] uppercase tracking-widest text-red-500/40 hover:text-red-400 transition-colors">
                    Remove
                  </button>
                )}
              </div>
              <textarea rows={4} value={para} onChange={(e) => updateAboutText(i, e.target.value)} className={textareaClass} />
            </div>
          ))}
          <button onClick={addAboutParagraph} className="self-start font-heading text-xs uppercase tracking-widest border border-white/12 text-white/40 px-4 py-2 hover:border-white/25 hover:text-white transition-all flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Paragraph
          </button>
        </div>
      )}

      {/* ── Contact Tab ── */}
      {activeTab === 'contact' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Booking Email</label>
            <input type="email" value={content.contactEmail} onChange={(e) => setContent({ ...content, contactEmail: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Service Area</label>
            <input type="text" value={content.serviceArea} onChange={(e) => setContent({ ...content, serviceArea: e.target.value })} className={inputClass} placeholder="South Florida" />
            <p className="font-body text-xs text-white/20">Used in EPK, footer, and booking CTA.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Footer Tagline</label>
            <textarea rows={2} value={content.footerTagline} onChange={(e) => setContent({ ...content, footerTagline: e.target.value })} className={textareaClass} />
            <p className="font-body text-xs text-white/20">Short blurb under the logo in the footer.</p>
          </div>
          <div className="border-t border-white/6 pt-5">
            <p className="font-heading text-[10px] uppercase tracking-widest text-white/30 mb-4">Social Links</p>
            <div className="flex flex-col gap-4">
              {[
                { key: 'facebook' as const, label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">{label}</label>
                  <input type="url" value={content[key]} onChange={(e) => setContent({ ...content, [key]: e.target.value })} className={inputClass} placeholder={placeholder} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
