'use client'

import { useState } from 'react'
import { siteContent, type SiteContent } from '@/lib/data'

const inputClass =
  'w-full bg-[#0f0f1c] border border-white/10 text-white font-body text-sm px-3 py-2.5 focus:outline-none focus:border-brand-red/50 transition-colors rounded-sm placeholder:text-white/20'

const textareaClass = `${inputClass} resize-none`

export default function AdminContent() {
  const [content, setContent] = useState<SiteContent>(siteContent)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'contact'>('hero')

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const updateAboutText = (index: number, value: string) => {
    const updated = [...content.aboutText]
    updated[index] = value
    setContent({ ...content, aboutText: updated })
  }

  const addAboutParagraph = () => {
    setContent({ ...content, aboutText: [...content.aboutText, ''] })
  }

  const removeAboutParagraph = (index: number) => {
    const updated = content.aboutText.filter((_, i) => i !== index)
    setContent({ ...content, aboutText: updated })
  }

  const tabs = [
    { id: 'hero' as const, label: 'Hero Text' },
    { id: 'about' as const, label: 'About' },
    { id: 'contact' as const, label: 'Contact & Socials' },
  ]

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display uppercase text-3xl text-white">Content</h1>
          <p className="font-body text-xs text-white/40 mt-1">Hero, About, Contact & Socials</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="font-heading text-[10px] text-green-400 uppercase tracking-widest animate-pulse">Saved ✓</span>}
          <button
            onClick={flash}
            className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-white/8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-heading text-xs uppercase tracking-widest px-4 py-2.5 border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-brand-red text-white'
                : 'border-transparent text-white/40 hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Hero Tab ── */}
      {activeTab === 'hero' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Main Headline</label>
            <input
              type="text"
              value={content.heroHeadline}
              onChange={(e) => setContent({ ...content, heroHeadline: e.target.value })}
              className={inputClass}
            />
            <p className="font-body text-xs text-white/25">Shown in red below the band name in the hero section.</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Subheadline / Description</label>
            <textarea
              rows={3}
              value={content.heroSubheadline}
              onChange={(e) => setContent({ ...content, heroSubheadline: e.target.value })}
              className={textareaClass}
            />
            <p className="font-body text-xs text-white/25">Supporting copy below the headline.</p>
          </div>

          {/* Preview */}
          <div className="p-5 border border-white/8 bg-white/3 rounded-sm">
            <p className="font-heading text-[9px] uppercase tracking-widest text-white/30 mb-3">Preview</p>
            <div className="font-display uppercase text-xl text-white mb-1">Rebound Rock Band</div>
            <div className="font-display uppercase text-lg text-brand-red mb-2">{content.heroHeadline}</div>
            <p className="font-body text-xs text-white/50 leading-relaxed">{content.heroSubheadline}</p>
          </div>
        </div>
      )}

      {/* ── About Tab ── */}
      {activeTab === 'about' && (
        <div className="flex flex-col gap-5">
          <p className="font-body text-xs text-white/40">
            These paragraphs appear on the About page and in the About preview section on the homepage.
          </p>
          {content.aboutText.map((para, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Paragraph {i + 1}</label>
                {content.aboutText.length > 1 && (
                  <button
                    onClick={() => removeAboutParagraph(i)}
                    className="font-heading text-[9px] uppercase tracking-widest text-red-400/50 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                value={para}
                onChange={(e) => updateAboutText(i, e.target.value)}
                className={textareaClass}
              />
            </div>
          ))}
          <button
            onClick={addAboutParagraph}
            className="self-start font-heading text-xs uppercase tracking-widest border border-white/15 text-white/50 px-4 py-2 hover:border-white/30 hover:text-white transition-colors"
          >
            + Add Paragraph
          </button>
        </div>
      )}

      {/* ── Contact Tab ── */}
      {activeTab === 'contact' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Booking Email</label>
            <input
              type="email"
              value={content.contactEmail}
              onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Phone</label>
            <input
              type="text"
              value={content.contactPhone}
              onChange={(e) => setContent({ ...content, contactPhone: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="border-t border-white/8 pt-5">
            <p className="font-heading text-xs uppercase tracking-widest text-white/40 mb-4">Social Links</p>
            <div className="flex flex-col gap-4">
              {[
                { key: 'instagram' as const, label: 'Instagram URL' },
                { key: 'facebook' as const, label: 'Facebook URL' },
                { key: 'youtube' as const, label: 'YouTube URL' },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">{label}</label>
                  <input
                    type="url"
                    value={content[key]}
                    onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="font-body text-xs text-white/20 mt-10">
        Changes are local to this session. Connect to a database or CMS to persist content across deployments.
      </p>
    </div>
  )
}
