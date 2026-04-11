'use client'

import { useState } from 'react'
import { merch as initialMerch, type MerchItem } from '@/lib/data'

const emptyItem: Omit<MerchItem, 'id'> = {
  name: '',
  price: 0,
  category: 'tshirt',
  available: true,
  visible: true,
  externalUrl: '',
}

const inputClass =
  'w-full bg-[#0d0d1e] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

export default function AdminMerch() {
  const [items, setItems] = useState<MerchItem[]>(initialMerch)
  const [editing, setEditing] = useState<MerchItem | null>(null)
  const [form, setForm] = useState<Omit<MerchItem, 'id'>>(emptyItem)
  const [isAdding, setIsAdding] = useState(false)
  const [saved, setSaved] = useState(false)

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const openEdit = (item: MerchItem) => {
    setEditing(item)
    setForm({ name: item.name, price: item.price, category: item.category, available: item.available, visible: item.visible, externalUrl: item.externalUrl ?? '' })
    setIsAdding(false)
  }

  const openAdd = () => { setEditing(null); setForm(emptyItem); setIsAdding(true) }
  const cancel = () => { setEditing(null); setIsAdding(false) }

  const save = () => {
    if (!form.name) return
    if (editing) {
      setItems(items.map((i) => i.id === editing.id ? { ...editing, ...form } : i))
    } else {
      setItems([...items, { id: Date.now().toString(), ...form }])
    }
    cancel()
    flash()
  }

  const remove = (id: string) => {
    if (confirm('Delete this item?')) setItems(items.filter((i) => i.id !== id))
  }

  const toggleVisible = (id: string) => {
    setItems(items.map((i) => i.id === id ? { ...i, visible: !i.visible } : i))
  }

  const toggleAvailable = (id: string) => {
    setItems(items.map((i) => i.id === id ? { ...i, available: !i.available } : i))
  }

  const Toggle = ({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) => (
    <button
      onClick={onToggle}
      className={`font-heading text-[9px] uppercase tracking-widest px-2 py-1 border transition-colors ${
        checked
          ? 'border-green-500/40 text-green-400/80 bg-green-400/5'
          : 'border-white/10 text-white/25 hover:border-white/25'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display uppercase text-4xl text-white leading-none">Merch</h1>
          <p className="font-body text-xs text-white/30 mt-1.5">{items.length} product{items.length !== 1 ? 's' : ''} · Printful-ready</p>
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
          <button
            onClick={openAdd}
            className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-all btn-glow-red flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Item
          </button>
        </div>
      </div>

      {/* Form */}
      {(isAdding || editing) && (
        <div className="mb-8 border border-brand-red/25 bg-brand-red/4">
          <div className="flex items-center justify-between gap-3 px-6 py-3.5 border-b border-brand-red/15">
            <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red">
              {editing ? 'Edit Item' : 'New Item'}
            </h2>
            <button onClick={cancel} className="text-white/30 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Rebound Rock Band Tee" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Price ($) *</label>
                <input type="number" min={0} step={0.01} value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as MerchItem['category'] })} className={inputClass}>
                  <option value="tshirt">T-Shirt</option>
                  <option value="hat">Hat</option>
                  <option value="sticker">Sticker</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">Buy URL (Printful / External)</label>
                <input type="url" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} className={inputClass} placeholder="https://printful.com/..." />
              </div>
            </div>
            <div className="flex gap-5 mb-5">
              {[
                { key: 'available' as const, label: 'Available / In Stock' },
                { key: 'visible' as const, label: 'Visible on Site' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                      form[key] ? 'bg-brand-red border-brand-red' : 'border-white/20 group-hover:border-white/40'
                    }`}
                    onClick={() => setForm({ ...form, [key]: !form[key] })}
                  >
                    {form[key] && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-heading text-xs uppercase tracking-widest text-white/50">{label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2.5">
              <button onClick={save} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all">
                {editing ? 'Save Changes' : 'Add Item'}
              </button>
              <button onClick={cancel} className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/40 px-5 py-2.5 hover:border-white/30 hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-0 border border-white/6 bg-[#0d0d1e] hover:border-white/10 transition-all overflow-hidden ${
              !item.visible ? 'opacity-40' : ''
            }`}
          >
            {/* Image thumb */}
            <div className="w-12 h-12 bg-white/4 border-r border-white/6 flex-shrink-0 flex items-center justify-center">
              <svg className="w-5 h-5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 px-4 py-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-heading text-sm text-white truncate">{item.name}</span>
                <span className="font-display text-base text-brand-red">${item.price}</span>
                {item.externalUrl && (
                  <span className="font-heading text-[9px] uppercase tracking-widest text-green-400/60 border border-green-400/25 px-1.5 py-0.5">
                    Linked
                  </span>
                )}
              </div>
              <div className="font-body text-xs text-white/30 capitalize mt-0.5">{item.category}</div>
            </div>

            {/* Toggles */}
            <div className="flex gap-1.5 flex-shrink-0 px-3">
              <Toggle
                checked={item.available}
                onToggle={() => toggleAvailable(item.id)}
                label={item.available ? 'In Stock' : 'Sold Out'}
              />
              <Toggle
                checked={item.visible}
                onToggle={() => toggleVisible(item.id)}
                label={item.visible ? 'Visible' : 'Hidden'}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 flex-shrink-0 pr-3">
              <button onClick={() => openEdit(item)} className="font-heading text-[10px] uppercase tracking-widest border border-white/10 text-white/35 px-3 py-1.5 hover:border-white/30 hover:text-white transition-all">
                Edit
              </button>
              <button onClick={() => remove(item.id)} className="font-heading text-[10px] uppercase tracking-widest border border-red-900/30 text-red-500/40 px-3 py-1.5 hover:border-red-500/60 hover:text-red-400 transition-all">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="font-body text-xs text-white/15 mt-8">
        Add a Printful or external URL to each item to enable &quot;Buy Now&quot; buttons on the public site.
      </p>
    </div>
  )
}
