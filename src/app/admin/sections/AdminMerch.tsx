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
  'w-full bg-[#0f0f1c] border border-white/10 text-white font-body text-sm px-3 py-2.5 focus:outline-none focus:border-brand-red/50 transition-colors rounded-sm placeholder:text-white/20'

export default function AdminMerch() {
  const [items, setItems] = useState<MerchItem[]>(initialMerch)
  const [editing, setEditing] = useState<MerchItem | null>(null)
  const [form, setForm] = useState<Omit<MerchItem, 'id'>>(emptyItem)
  const [isAdding, setIsAdding] = useState(false)
  const [saved, setSaved] = useState(false)

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const openEdit = (item: MerchItem) => {
    setEditing(item)
    setForm({ name: item.name, price: item.price, category: item.category, available: item.available, visible: item.visible, externalUrl: item.externalUrl ?? '' })
    setIsAdding(false)
  }

  const openAdd = () => { setEditing(null); setForm(emptyItem); setIsAdding(true) }
  const cancel = () => { setEditing(null); setIsAdding(false) }

  const save = () => {
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

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display uppercase text-3xl text-white">Merch</h1>
          <p className="font-body text-xs text-white/40 mt-1">{items.length} products · Printful-ready</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="font-heading text-[10px] text-green-400 uppercase tracking-widest animate-pulse">Saved ✓</span>}
          <button onClick={openAdd} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-4 py-2.5 hover:bg-brand-red-bright transition-colors">
            + Add Item
          </button>
        </div>
      </div>

      {/* Form */}
      {(isAdding || editing) && (
        <div className="mb-8 p-6 border border-brand-red/30 bg-brand-red/5 rounded-sm">
          <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red mb-5">
            {editing ? 'Edit Item' : 'New Item'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Product Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Rebound Rock Band Tee" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Price ($) *</label>
              <input type="number" min={0} step={0.01} value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as MerchItem['category'] })} className={inputClass}>
                <option value="tshirt">T-Shirt</option>
                <option value="hat">Hat</option>
                <option value="sticker">Sticker</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/40">Buy URL (Printful / External)</label>
              <input type="url" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} className={inputClass} placeholder="https://printful.com/..." />
            </div>
          </div>
          <div className="flex gap-6 mb-5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="w-4 h-4 accent-brand-red" />
              <span className="font-heading text-xs uppercase tracking-widest text-white/60">Available</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} className="w-4 h-4 accent-brand-red" />
              <span className="font-heading text-xs uppercase tracking-widest text-white/60">Visible on site</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-colors">
              {editing ? 'Save Changes' : 'Add Item'}
            </button>
            <button onClick={cancel} className="font-heading text-xs uppercase tracking-widest border border-white/20 text-white/60 px-5 py-2.5 hover:border-white/40 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items table */}
      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 border rounded-sm p-4 transition-opacity ${
              !item.visible ? 'opacity-40' : ''
            } border-white/8 bg-[#0f0f1c]`}
          >
            {/* Image placeholder */}
            <div className="w-10 h-10 bg-white/5 rounded-sm flex-shrink-0 flex items-center justify-center">
              <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-heading text-sm text-white truncate">{item.name}</div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="font-body text-xs text-white/40 capitalize">{item.category}</span>
                <span className="font-display text-sm text-brand-red">${item.price}</span>
                {item.externalUrl && (
                  <span className="font-heading text-[9px] uppercase tracking-widest text-green-400/70 border border-green-400/30 px-1.5 py-0.5">
                    Linked
                  </span>
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => toggleAvailable(item.id)}
                className={`font-heading text-[9px] uppercase tracking-widest px-2 py-1 border transition-colors ${
                  item.available ? 'border-green-500/40 text-green-400/70' : 'border-white/15 text-white/30'
                }`}
              >
                {item.available ? 'In Stock' : 'Sold Out'}
              </button>
              <button
                onClick={() => toggleVisible(item.id)}
                className={`font-heading text-[9px] uppercase tracking-widest px-2 py-1 border transition-colors ${
                  item.visible ? 'border-white/20 text-white/50' : 'border-white/10 text-white/20'
                }`}
              >
                {item.visible ? 'Visible' : 'Hidden'}
              </button>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(item)} className="font-heading text-[10px] uppercase tracking-widest border border-white/15 text-white/50 px-3 py-1.5 hover:border-white/40 hover:text-white transition-colors">
                Edit
              </button>
              <button onClick={() => remove(item.id)} className="font-heading text-[10px] uppercase tracking-widest border border-red-900/40 text-red-400/60 px-3 py-1.5 hover:border-red-500 hover:text-red-400 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="font-body text-xs text-white/20 mt-8">
        Add a Printful or external URL to each item to enable &quot;Buy Now&quot; buttons on the public site.
      </p>
    </div>
  )
}
