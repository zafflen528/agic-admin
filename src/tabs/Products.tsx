import { useState } from 'react'
import { move } from '../lib/move'
import type { Media, Product, Spec } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { PageHeader, bare, button, card, dangerLink, input } from '../ui'

const BUCKET = 'product-media'

const BLANK_SPECS: Spec[] = [
  ['Total Moisture', '% ARB'],
  ['Inherent Moisture', '% ADB'],
  ['Ash', '% ADB'],
  ['Volatile Matter', '% ADB'],
  ['Fixed Carbon', '% ADB'],
  ['Sulphur', '% ADB'],
  ['Gross Calorific Value', 'ARB'],
].map(([label, unit]) => ({ label, unit, value: '' }))

export default function Products({
  products,
  onChange,
}: {
  products: Product[]
  onChange: (next: Product[]) => void
}) {
  const [newName, setNewName] = useState('')
  // `armed` is the card the grab handle has enabled dragging on; `dragId` is the
  // card currently in flight. Both are ids so a re-render can't stale them.
  const [armed, setArmed] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)

  /** Live-reorder as the dragged card passes over another one. */
  function dragOver(overId: string) {
    if (!dragId || dragId === overId) return
    const from = products.findIndex(p => p.id === dragId)
    const to = products.findIndex(p => p.id === overId)
    if (from < 0 || to < 0) return
    onChange(move(products, from, to))
  }

  async function dropOrder() {
    setArmed(null)
    setDragId(null)
    const rows = products.map((p, i) => ({ ...p, position: i + 1 }))
    if (rows.every((r, i) => r.position === products[i].position)) return
    onChange(rows)
    const { error } = await supabase.from('products').upsert(rows)
    if (error) alert(`Could not save order: ${error.message}`)
  }

  /** Update one product in local state without touching the database. */
  const patch = (id: string, fields: Partial<Product>) =>
    onChange(products.map(p => (p.id === id ? { ...p, ...fields } : p)))

  /** Persist the given fields; local state is assumed already updated. */
  async function save(id: string, fields: Partial<Product>) {
    const { error } = await supabase.from('products').update(fields).eq('id', id)
    if (error) alert(`Could not save product: ${error.message}`)
  }

  const patchSpecs = (p: Product, specs: Spec[], persist: boolean) => {
    patch(p.id, { specs })
    if (persist) save(p.id, { specs })
  }

  async function addProduct() {
    const name = newName.trim()
    if (!name) return
    const { data, error } = await supabase
      .from('products')
      .insert({ name, specs: BLANK_SPECS, media: [], position: products.length + 1 })
      .select()
      .single()
    if (error) return alert(`Could not add product: ${error.message}`)
    onChange([...products, data])
    setNewName('')
  }

  async function removeProduct(p: Product) {
    if (!confirm(`Delete "${p.name}" and its media?`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) return alert(`Could not delete product: ${error.message}`)
    if (p.media.length) await supabase.storage.from(BUCKET).remove(p.media.map(m => m.path))
    onChange(products.filter(x => x.id !== p.id))
  }

  async function uploadMedia(p: Product, files: FileList) {
    const uploaded: Media[] = []
    for (const file of Array.from(files)) {
      const path = `${p.id}/${crypto.randomUUID()}-${file.name}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, file)
      if (error) {
        alert(`Upload failed for ${file.name}: ${error.message}`)
        continue
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      uploaded.push({
        url: data.publicUrl,
        type: file.type.startsWith('video') ? 'video' : 'image',
        path,
      })
    }
    if (!uploaded.length) return
    const media = [...p.media, ...uploaded]
    patch(p.id, { media })
    save(p.id, { media })
  }

  async function removeMedia(p: Product, target: Media) {
    const media = p.media.filter(m => m.path !== target.path)
    patch(p.id, { media })
    await supabase.storage.from(BUCKET).remove([target.path])
    save(p.id, { media })
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Coal specification sheets shown on the landing page — drag ⠿ to reorder"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {products.map(p => (
          <div
            key={p.id}
            draggable={armed === p.id}
            onDragStart={() => setDragId(p.id)}
            onDragOver={e => {
              e.preventDefault()
              dragOver(p.id)
            }}
            onDrop={dropOrder}
            onDragEnd={dropOrder}
            style={{ ...card, opacity: dragId === p.id ? 0.5 : 1 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
                gap: 12,
              }}
            >
              <div
                onMouseDown={() => setArmed(p.id)}
                onMouseUp={() => setArmed(null)}
                title="Drag to reorder"
                style={{
                  cursor: 'grab',
                  color: 'oklch(65% 0.02 260)',
                  fontSize: 16,
                  lineHeight: 1,
                  padding: '0 2px',
                  userSelect: 'none',
                }}
              >
                ⠿
              </div>
              <input
                value={p.name}
                onChange={e => patch(p.id, { name: e.target.value })}
                onBlur={e => save(p.id, { name: e.target.value })}
                style={{ ...bare, fontWeight: 700, fontSize: 16, flex: 1 }}
              />
              <div style={dangerLink} onClick={() => removeProduct(p)}>
                Delete product
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'oklch(45% 0.02 260)',
                  marginBottom: 10,
                }}
              >
                Media
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {p.media.map(m => (
                  <div
                    key={m.path}
                    style={{
                      position: 'relative',
                      width: 96,
                      height: 96,
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: '1px solid oklch(90% 0.008 260)',
                      background: 'oklch(95% 0.008 260)',
                    }}
                  >
                    {m.type === 'video' ? (
                      <video
                        src={m.url}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <img
                        src={m.url}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                    <div
                      onClick={() => removeMedia(p, m)}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </div>
                  </div>
                ))}
                <label
                  htmlFor={`media-${p.id}`}
                  style={{
                    width: 96,
                    height: 96,
                    border: '1px dashed oklch(80% 0.01 260)',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'oklch(45% 0.13 75)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    padding: 6,
                  }}
                >
                  + Upload photo/video
                </label>
                <input
                  id={`media-${p.id}`}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={e => {
                    if (e.target.files) uploadMedia(p, e.target.files)
                    e.target.value = ''
                  }}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))',
                gap: 12,
              }}
            >
              {p.specs.map((r, i) => {
                const edit = (fields: Partial<Spec>, persist: boolean) =>
                  patchSpecs(
                    p,
                    p.specs.map((s, j) => (i === j ? { ...s, ...fields } : s)),
                    persist,
                  )
                const small = {
                  ...bare,
                  fontSize: 11,
                  color: 'oklch(45% 0.02 260)',
                } as const
                return (
                  <div
                    key={i}
                    style={{
                      border: '1px solid oklch(93% 0.008 260)',
                      borderRadius: 6,
                      padding: '10px 12px',
                      position: 'relative',
                    }}
                  >
                    <div
                      onClick={() =>
                        patchSpecs(p, p.specs.filter((_, j) => j !== i), true)
                      }
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 8,
                        fontSize: 11,
                        color: 'oklch(60% 0.15 30)',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      ✕
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 6, paddingRight: 14 }}>
                      <input
                        value={r.label}
                        onChange={e => edit({ label: e.target.value }, false)}
                        onBlur={() => save(p.id, { specs: p.specs })}
                        style={{ ...small, flex: 1, minWidth: 0 }}
                      />
                      <input
                        value={r.unit}
                        onChange={e => edit({ unit: e.target.value }, false)}
                        onBlur={() => save(p.id, { specs: p.specs })}
                        style={{ ...small, width: 56, textAlign: 'right' }}
                      />
                    </div>
                    <input
                      value={r.value}
                      onChange={e => edit({ value: e.target.value }, false)}
                      onBlur={() => save(p.id, { specs: p.specs })}
                      style={{ ...bare, width: '100%', fontSize: 15, fontWeight: 700 }}
                    />
                  </div>
                )
              })}
              <div
                onClick={() =>
                  patchSpecs(p, [...p.specs, { label: 'New Spec', unit: '', value: '' }], true)
                }
                style={{
                  border: '1px dashed oklch(80% 0.01 260)',
                  borderRadius: 6,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'oklch(45% 0.13 75)',
                  cursor: 'pointer',
                  minHeight: 56,
                }}
              >
                + Add spec
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            ...card,
            border: '1px dashed oklch(80% 0.01 260)',
            padding: 20,
            display: 'flex',
            gap: 10,
          }}
        >
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addProduct()}
            placeholder="New product name (e.g. Coal GAR 52)"
            style={{ ...input, flex: 1 }}
          />
          <button style={button} onClick={addProduct}>
            Add Product
          </button>
        </div>
      </div>
    </div>
  )
}
