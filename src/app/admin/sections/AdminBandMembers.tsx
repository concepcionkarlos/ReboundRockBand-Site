'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { bandMembers as initialMembers, type BandMember } from '@/lib/data'
import ImageUpload from '@/components/admin/ImageUpload'

const emptyMember: Omit<BandMember, 'id'> = { name: '', role: '', bio: '', photo: '', visible: true }

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

export default function AdminBandMembers() {
  const [members, setMembers] = useState<BandMember[]>(initialMembers)
  const [editing, setEditing] = useState<BandMember | null>(null)
  const [form, setForm] = useState<Omit<BandMember, 'id'>>(emptyMember)
  const [isAdding, setIsAdding] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => { if (d.bandMembers) setMembers(d.bandMembers) })
      .catch(() => {})
  }, [])

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const persist = useCallback(async (updated: BandMember[]) => {
    setSaving(true)
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'bandMembers', data: updated }),
      })
      flash()
    } finally {
      setSaving(false)
    }
  }, [])

  const openEdit = (member: BandMember) => {
    setEditing(member)
    setForm({ name: member.name, role: member.role, bio: member.bio, photo: member.photo ?? '', visible: member.visible ?? true })
    setIsAdding(false)
  }
  const openAdd = () => { setEditing(null); setForm(emptyMember); setIsAdding(true) }
  const cancel = () => { setEditing(null); setIsAdding(false) }

  const save = async () => {
    if (!form.name || !form.role) return
    const updated = editing
      ? members.map((m) => m.id === editing.id ? { ...editing, ...form } : m)
      : [...members, { id: Date.now().toString(), ...form }]
    setMembers(updated)
    cancel()
    await persist(updated)
  }

  const remove = async (id: string) => {
    if (!confirm('Remove this band member?')) return
    const updated = members.filter((m) => m.id !== id)
    setMembers(updated)
    await persist(updated)
  }

  const toggleVisible = async (id: string) => {
    const updated = members.map((m) => m.id === id ? { ...m, visible: !m.visible } : m)
    setMembers(updated)
    await persist(updated)
  }

  const moveUp = async (index: number) => {
    if (index === 0) return
    const updated = [...members];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    setMembers(updated)
    await persist(updated)
  }

  const moveDown = async (index: number) => {
    if (index === members.length - 1) return
    const updated = [...members];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    setMembers(updated)
    await persist(updated)
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="border-l-2 border-brand-red pl-4">
          <h1 className="font-display uppercase text-4xl text-white leading-none">Band Members</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">
            {members.length} member{members.length !== 1 ? 's' : ''} · {members.filter(m => m.visible !== false).length} visible
          </p>
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
          {!isAdding && !editing && (
            <button onClick={openAdd} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-all btn-glow-red flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Member
            </button>
          )}
        </div>
      </div>

      {/* Add / Edit form */}
      {(isAdding || editing) && (
        <div className="mb-8 border border-brand-red/25 bg-brand-red/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between gap-3 px-6 py-3.5 border-b border-brand-red/15">
            <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red">{editing ? 'Edit Member' : 'New Member'}</h2>
            <button onClick={cancel} className="text-white/30 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder='Jose "Pepe" Ortiz' />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Role *</label>
                <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass} placeholder="Lead Vocals" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Short Bio</label>
                <textarea rows={2} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={`${inputClass} resize-none`} placeholder="One-line description." />
              </div>
              <div className="sm:col-span-2">
                <ImageUpload
                  label="Member Photo"
                  value={form.photo ?? ''}
                  onChange={(url) => setForm({ ...form, photo: url })}
                  previewClassName="w-20 h-20"
                  objectPosition="center top"
                  helper="Upload a portrait photo. Square or 3:4 works best."
                />
              </div>
            </div>
            <label className="flex items-center gap-2.5 mb-5 cursor-pointer group">
              <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${form.visible ? 'bg-brand-red border-brand-red' : 'border-white/20 group-hover:border-white/40'}`} onClick={() => setForm({ ...form, visible: !form.visible })}>
                {form.visible && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="font-heading text-xs uppercase tracking-widest text-white/50">Visible on site</span>
            </label>
            <div className="flex gap-2.5">
              <button onClick={save} disabled={saving} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all disabled:opacity-60">
                {editing ? 'Save Changes' : 'Add Member'}
              </button>
              <button onClick={cancel} className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/40 px-5 py-2.5 hover:border-white/30 hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Members list */}
      <div className="flex flex-col gap-1.5">
        {members.map((member, index) => (
          <div key={member.id} className={`relative flex items-center gap-0 border border-white/6 bg-[#0d0d1e] hover:border-white/12 transition-all overflow-hidden group ${member.visible === false ? 'opacity-40' : ''}`}>
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-red origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
            <div className="w-14 h-14 bg-white/4 border-r border-white/6 flex-shrink-0 overflow-hidden relative">
              {member.photo ? (
                <Image src={member.photo} alt={member.name} fill className="object-cover object-top" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 px-4 py-3">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="font-heading text-sm text-white">{member.name}</span>
                {member.visible === false && <span className="font-heading text-[9px] uppercase tracking-widest text-white/20 border border-white/10 px-1">Hidden</span>}
              </div>
              <div className="font-heading text-[10px] text-brand-red uppercase tracking-widest">{member.role}</div>
              {member.bio && <div className="font-body text-xs text-white/30 mt-0.5 truncate max-w-xs">{member.bio}</div>}
            </div>
            <div className="flex flex-col gap-0.5 flex-shrink-0 px-2">
              <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 text-white/20 hover:text-white/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="Move up">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
              </button>
              <button onClick={() => moveDown(index)} disabled={index === members.length - 1} className="p-1 text-white/20 hover:text-white/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="Move down">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </button>
            </div>
            <div className="flex gap-1.5 flex-shrink-0 pr-3">
              <button onClick={() => toggleVisible(member.id)} className={`font-heading text-[9px] uppercase tracking-widest px-2 py-1 border transition-colors ${member.visible !== false ? 'border-white/15 text-white/40 hover:border-white/30 hover:text-white' : 'border-white/8 text-white/20 hover:border-white/20'}`}>
                {member.visible !== false ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => openEdit(member)} className="font-heading text-[10px] uppercase tracking-widest border border-white/10 text-white/35 px-3 py-1.5 hover:border-white/30 hover:text-white transition-all">Edit</button>
              <button onClick={() => remove(member.id)} className="font-heading text-[10px] uppercase tracking-widest border border-red-900/30 text-red-500/40 px-3 py-1.5 hover:border-red-500/60 hover:text-red-400 transition-all">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-16 border border-white/6">
          <p className="font-heading text-white/25 text-xs tracking-widest uppercase">No members yet — add some above</p>
        </div>
      )}
    </div>
  )
}
