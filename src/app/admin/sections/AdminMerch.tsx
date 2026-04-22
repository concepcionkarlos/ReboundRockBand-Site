'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { merch as initialMerch, type MerchItem } from '@/lib/data'
import ImageUpload from '@/components/admin/ImageUpload'

const emptyItem: Omit<MerchItem, 'id'> = {
  name: '',
  price: 0,
  category: 'tshirt',
  available: true,
  visible: true,
  externalUrl: '',
  image: '',
  description: '',
  atShows: false,
  stockQuantity: undefined,
}

function specsToText(specs?: { label: string; value: string }[]): string {
  return specs?.map((s) => `${s.label}: ${s.value}`).join('\n') ?? ''
}

function textToSpecs(text: string): { label: string; value: string }[] | undefined {
  const lines = text.split('\n').filter((l) => l.trim())
  if (lines.length === 0) return undefined
  return lines.map((line) => {
    const idx = line.indexOf(':')
    if (idx === -1) return { label: line.trim(), value: '' }
    return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() }
  })
}

const inputClass =
  'w-full bg-[#111121] border border-white/8 text-white font-body text-sm px-3.5 py-2.5 focus:outline-none focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)] transition-all placeholder:text-white/20 rounded-none'

export default function AdminMerch() {
  const [items, setItems] = useState<MerchItem[]>(initialMerch)
  const [editing, setEditing] = useState<MerchItem | null>(null)
  const [form, setForm] = useState<Omit<MerchItem, 'id'>>(emptyItem)
  const [specsText, setSpecsText] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingStockId, setEditingStockId] = useState<string | null>(null)
  const [stockDraft, setStockDraft] = useState('')
  const [merchView, setMerchView] = useState<'products' | 'inventory'>('products')

  // Load from API on mount
  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => { if (d.merch) setItems(d.merch) })
      .catch(() => {})
  }, [])

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const saveStock = async (id: string) => {
    const qty = stockDraft === '' ? undefined : parseInt(stockDraft)
    const updated = items.map((i) => i.id === id ? { ...i, stockQuantity: qty } : i)
    setItems(updated)
    setEditingStockId(null)
    await persist(updated)
  }

  const persist = useCallback(async (updated: MerchItem[]) => {
    setSaving(true)
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'merch', data: updated }),
      })
      flash()
    } finally {
      setSaving(false)
    }
  }, [])

  const openEdit = (item: MerchItem) => {
    setEditing(item)
    setForm({
      name: item.name,
      price: item.price,
      category: item.category,
      available: item.available,
      visible: item.visible,
      externalUrl: item.externalUrl ?? '',
      image: item.image ?? '',
      description: item.description ?? '',
      atShows: item.atShows ?? false,
      stockQuantity: item.stockQuantity,
    })
    setSpecsText(specsToText(item.specs))
    setIsAdding(false)
  }

  const openAdd = () => { setEditing(null); setForm(emptyItem); setSpecsText(''); setIsAdding(true) }
  const cancel = () => { setEditing(null); setIsAdding(false) }

  const save = async () => {
    if (!form.name) return
    const parsedSpecs = textToSpecs(specsText)
    const itemData = { ...form, specs: parsedSpecs }
    const updated = editing
      ? items.map((i) => i.id === editing.id ? { ...editing, ...itemData } : i)
      : [...items, { id: Date.now().toString(), ...itemData }]
    setItems(updated)
    cancel()
    await persist(updated)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this item?')) return
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    await persist(updated)
  }

  const toggleVisible = async (id: string) => {
    const updated = items.map((i) => i.id === id ? { ...i, visible: !i.visible } : i)
    setItems(updated)
    await persist(updated)
  }

  const toggleAvailable = async (id: string) => {
    const updated = items.map((i) => i.id === id ? { ...i, available: !i.available } : i)
    setItems(updated)
    await persist(updated)
  }

  const adjustStock = async (id: string, delta: number) => {
    const item = items.find((i) => i.id === id)
    if (!item || item.stockQuantity === undefined) return
    const next = Math.max(0, item.stockQuantity + delta)
    const updated = items.map((i) => i.id === id ? { ...i, stockQuantity: next } : i)
    setItems(updated)
    await persist(updated)
  }

  const enableTracking = async (id: string) => {
    const updated = items.map((i) => i.id === id ? { ...i, stockQuantity: 0 } : i)
    setItems(updated)
    await persist(updated)
  }

  const moveItem = async (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= items.length) return
    const updated = [...items]
    ;[updated[index], updated[next]] = [updated[next], updated[index]]
    setItems(updated)
    await persist(updated)
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
        <div className="border-l-2 border-brand-red pl-4">
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
          {saving && (
            <div className="font-heading text-[10px] text-white/30 uppercase tracking-widest">Saving…</div>
          )}
          <div className="flex border border-white/10">
            {(['products', 'inventory'] as const).map((v, i) => (
              <button
                key={v}
                type="button"
                onClick={() => setMerchView(v)}
                className={`font-heading text-[10px] uppercase tracking-widest px-3.5 py-2 transition-colors ${i > 0 ? 'border-l border-white/10' : ''} ${merchView === v ? 'bg-white/8 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                {v}
              </button>
            ))}
          </div>
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

      {/* ── Inventory view ── */}
      {merchView === 'inventory' && (() => {
        const tracked = items.filter((i) => i.stockQuantity !== undefined)
          .sort((a, b) => (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0))
        const untracked = items.filter((i) => i.stockQuantity === undefined)
        const totalValue = tracked.reduce((s, i) => s + (i.stockQuantity ?? 0) * i.price, 0)
        const outOfStock = tracked.filter((i) => i.stockQuantity === 0).length
        const lowStock   = tracked.filter((i) => (i.stockQuantity ?? 0) > 0 && (i.stockQuantity ?? 0) <= 2).length
        return (
          <div className="mb-8">
            {/* Summary chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { label: 'Tracked Items', value: tracked.length, color: 'text-white' },
                ...(outOfStock > 0 ? [{ label: 'Out of Stock', value: outOfStock, color: 'text-red-400' }] : []),
                ...(lowStock > 0 ? [{ label: 'Low Stock', value: lowStock, color: 'text-yellow-400' }] : []),
                ...(totalValue > 0 ? [{ label: 'Stock Value', value: `$${totalValue.toLocaleString()}`, color: 'text-green-400' }] : []),
              ].map((s) => (
                <div key={s.label} className="border border-white/8 bg-[#0d0d1e] px-4 py-2.5 flex items-center gap-2.5">
                  <span className="font-heading text-[9px] uppercase tracking-widest text-white/25">{s.label}</span>
                  <span className={`font-display text-lg leading-none ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Tracked items */}
            {tracked.length > 0 && (
              <div className="border border-white/8 divide-y divide-white/[0.05] mb-4">
                {tracked.map((item) => {
                  const qty = item.stockQuantity ?? 0
                  const stockColor = qty === 0 ? 'text-red-400 border-red-400/30' : qty <= 2 ? 'text-yellow-400 border-yellow-400/30' : 'text-green-400 border-green-400/30'
                  const stockBg    = qty === 0 ? 'bg-red-400/5' : qty <= 2 ? 'bg-yellow-400/5' : ''
                  return (
                    <div key={item.id} className={`flex items-center gap-4 px-5 py-3.5 ${stockBg}`}>
                      <div className="flex-1 min-w-0">
                        <span className="font-body text-sm text-white truncate block">{item.name}</span>
                        <span className="font-heading text-[9px] uppercase tracking-widest text-white/25">{item.category} · ${item.price}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => adjustStock(item.id, -1)}
                          disabled={qty === 0}
                          aria-label="Decrease stock"
                          className="w-7 h-7 border border-white/10 text-white/40 hover:border-white/30 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center font-body text-base"
                        >−</button>
                        <div className={`border px-3 py-1 font-display text-lg leading-none min-w-[3rem] text-center ${stockColor}`}>
                          {qty}
                        </div>
                        <button
                          onClick={() => adjustStock(item.id, 1)}
                          aria-label="Increase stock"
                          className="w-7 h-7 border border-white/10 text-white/40 hover:border-white/30 hover:text-white transition-all flex items-center justify-center font-body text-base"
                        >+</button>
                        <button
                          onClick={() => adjustStock(item.id, 10)}
                          aria-label="Restock +10"
                          className="font-heading text-[9px] uppercase tracking-widest border border-white/10 text-white/25 px-2.5 py-1.5 hover:border-white/30 hover:text-white/60 transition-all"
                        >+10</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Untracked items */}
            {untracked.length > 0 && (
              <div>
                <p className="font-heading text-[9px] uppercase tracking-widest text-white/20 mb-2">Not Tracked ({untracked.length})</p>
                <div className="border border-white/6 divide-y divide-white/[0.04]">
                  {untracked.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 px-5 py-3 opacity-50 hover:opacity-80 transition-opacity">
                      <span className="font-body text-sm text-white/60 flex-1 truncate">{item.name}</span>
                      <button
                        onClick={() => enableTracking(item.id)}
                        className="font-heading text-[9px] uppercase tracking-widest border border-white/10 text-white/30 px-3 py-1.5 hover:border-brand-red/40 hover:text-brand-red transition-all flex-shrink-0"
                      >
                        Start Tracking
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {items.length === 0 && (
              <p className="font-body text-sm text-white/20 text-center py-12">No merch items yet.</p>
            )}
          </div>
        )
      })()}

      {/* ── Products view ── */}
      {merchView === 'products' && <>

      {/* Storefront info callout */}
      <div className="mb-6 p-5 border border-white/6 bg-[#0d0d1e] flex items-start gap-3">
        <svg className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div>
          <p className="font-heading text-[10px] uppercase tracking-widest text-white/40 mb-1">Connecting to a Storefront</p>
          <p className="font-body text-xs text-white/25 leading-relaxed">
            To enable <span className="text-white/50">"Buy Now"</span> buttons, set the <span className="text-white/50 font-mono">Buy URL</span> field on each item to your product&apos;s URL from{' '}
            <span className="text-white/40">Spreadshop</span>, <span className="text-white/40">Fourthwall</span>, <span className="text-white/40">Printful</span>, or any other storefront. Items without a URL will show an{' '}
            <span className="text-white/50">"Inquire to Order"</span> mailto link instead.
          </p>
        </div>
      </div>

      {/* Form */}
      {(isAdding || editing) && (
        <div className="mb-8 border border-brand-red/25 bg-brand-red/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between gap-3 px-6 py-3.5 border-b border-brand-red/15">
            <h2 className="font-heading text-xs uppercase tracking-widest text-brand-red">
              {editing ? 'Edit Item' : 'New Item'}
            </h2>
            <button type="button" onClick={cancel} aria-label="Close form" className="text-white/30 hover:text-white transition-colors">
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
                <label htmlFor="merch-price" className="font-heading text-[10px] uppercase tracking-widest text-white/35">Price ($) *</label>
                <input id="merch-price" type="number" min={0} step={0.01} value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className={inputClass} placeholder="0" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="merch-category" className="font-heading text-[10px] uppercase tracking-widest text-white/35">Category *</label>
                <select id="merch-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as MerchItem['category'] })} className={inputClass} aria-label="Product category">
                  <option value="tshirt">T-Shirt</option>
                  <option value="hat">Hat</option>
                  <option value="sticker">Sticker</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="merch-stock" className="font-heading text-[10px] uppercase tracking-widest text-white/35">Stock Qty</label>
                <input
                  id="merch-stock"
                  type="number" min={0} step={1}
                  value={form.stockQuantity ?? ''}
                  onChange={(e) => setForm({ ...form, stockQuantity: e.target.value ? parseInt(e.target.value) : undefined })}
                  className={inputClass} placeholder="Leave blank to not track"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="merch-url" className="font-heading text-[10px] uppercase tracking-widest text-white/35">Buy URL (Printful / External)</label>
                <input id="merch-url" type="url" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} className={inputClass} placeholder="https://printful.com/..." />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="merch-desc" className="font-heading text-[10px] uppercase tracking-widest text-white/35">Description</label>
                <textarea
                  id="merch-desc"
                  rows={2}
                  value={form.description ?? ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="Short product description shown on the merch page"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="merch-specs" className="font-heading text-[10px] uppercase tracking-widest text-white/35">
                  Specs <span className="text-white/20 normal-case tracking-normal font-body">(one per line, format: Label: Value)</span>
                </label>
                <textarea
                  id="merch-specs"
                  rows={4}
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                  className={`${inputClass} resize-none font-mono text-xs`}
                  placeholder={'Fabric: 100% cotton\nFit: Unisex\nPrint: DTG'}
                />
              </div>
              <div className="sm:col-span-2">
                <ImageUpload
                  label="Product Image"
                  value={form.image ?? ''}
                  onChange={(url) => setForm({ ...form, image: url })}
                  previewClassName="w-28 h-28"
                  helper="Upload a square product shot for best results in the merch grid."
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-5 mb-5">
              {([
                { key: 'available' as const, label: 'Available / In Stock' },
                { key: 'visible' as const, label: 'Visible on Site' },
                { key: 'atShows' as const, label: 'Sold at Shows' },
              ]).map(({ key, label }) => (
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
              <button type="button" onClick={save} disabled={saving} className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-5 py-2.5 hover:bg-brand-red-bright transition-all disabled:opacity-60">
                {editing ? 'Save Changes' : 'Add Item'}
              </button>
              <button type="button" onClick={cancel} className="font-heading text-xs uppercase tracking-widest border border-white/15 text-white/40 px-5 py-2.5 hover:border-white/30 hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="flex flex-col gap-1.5">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`relative flex items-center gap-0 border border-white/6 bg-[#0d0d1e] hover:border-white/12 transition-all overflow-hidden group ${
              !item.visible ? 'opacity-40' : ''
            }`}
          >
            {/* Animated left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-red origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

            {/* Reorder */}
            <div className="flex flex-col border-r border-white/6 flex-shrink-0">
              <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} className="p-1.5 text-white/20 hover:text-white/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="Move up">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
              </button>
              <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className="p-1.5 text-white/20 hover:text-white/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="Move down">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            {/* Image thumb */}
            <div className="relative w-14 h-14 bg-white/4 border-r border-white/6 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              ) : (
                <svg className="w-5 h-5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
              )}
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
                {item.atShows && (
                  <span className="font-heading text-[9px] uppercase tracking-widest text-yellow-400/60 border border-yellow-400/20 px-1.5 py-0.5">
                    At Shows
                  </span>
                )}
                {item.stockQuantity !== undefined && (
                  editingStockId === item.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="number"
                        min={0}
                        value={stockDraft}
                        onChange={(e) => setStockDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveStock(item.id); if (e.key === 'Escape') setEditingStockId(null) }}
                        autoFocus
                        className="w-16 bg-[#111121] border border-brand-red/40 text-white font-body text-xs px-2 py-0.5 focus:outline-none"
                        aria-label="Stock quantity"
                      />
                      <button type="button" onClick={() => saveStock(item.id)} className="font-heading text-[9px] text-green-400 hover:text-green-300 transition-colors">✓</button>
                      <button type="button" onClick={() => setEditingStockId(null)} className="font-heading text-[9px] text-white/30 hover:text-white transition-colors">✕</button>
                    </div>
                  ) : (
                    <button
                      title="Click to edit stock"
                      onClick={(e) => { e.stopPropagation(); setEditingStockId(item.id); setStockDraft(String(item.stockQuantity ?? '')) }}
                      className={`font-heading text-[9px] uppercase tracking-widest border px-1.5 py-0.5 transition-colors hover:border-white/30 ${item.stockQuantity === 0 ? 'text-red-400/60 border-red-400/20 hover:text-red-400' : 'text-white/35 border-white/10 hover:text-white/60'}`}
                    >
                      {item.stockQuantity} in stock
                    </button>
                  )
                )}
              </div>
              <div className="font-body text-xs text-white/30 capitalize mt-0.5">{item.category}</div>
            </div>

            {/* Toggles */}
            <div className="flex gap-1.5 flex-shrink-0 px-3">
              <Toggle checked={item.available} onToggle={() => toggleAvailable(item.id)} label={item.available ? 'In Stock' : 'Sold Out'} />
              <Toggle checked={item.visible} onToggle={() => toggleVisible(item.id)} label={item.visible ? 'Visible' : 'Hidden'} />
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 flex-shrink-0 pr-3">
              <button type="button" onClick={() => openEdit(item)} className="font-heading text-[10px] uppercase tracking-widest border border-white/10 text-white/35 px-3 py-1.5 hover:border-white/30 hover:text-white transition-all">
                Edit
              </button>
              <button type="button" onClick={() => remove(item.id)} className="font-heading text-[10px] uppercase tracking-widest border border-red-900/30 text-red-500/40 px-3 py-1.5 hover:border-red-500/60 hover:text-red-400 transition-all">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 border border-white/6">
          <p className="font-heading text-white/25 text-xs tracking-widest uppercase">No products yet — add one above</p>
        </div>
      )}

      <p className="font-body text-xs text-white/15 mt-8">
        Add a Printful or external URL to each item to enable &quot;Buy Now&quot; buttons on the public site.
      </p>

      </> /* end products view */}
    </div>
  )
}
