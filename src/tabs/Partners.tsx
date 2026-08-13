import { useState } from 'react'
import type { Partner } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { confirmDialog, toast } from '../toast'
import { PageHeader, button, card, dangerLink, input } from '../ui'

export default function Partners({
  partners,
  onChange,
}: {
  partners: Partner[]
  onChange: (next: Partner[]) => void
}) {
  const [name, setName] = useState('')

  async function add() {
    const trimmed = name.trim()
    if (!trimmed) return
    const { data, error } = await supabase
      .from('partners')
      .insert({ name: trimmed })
      .select()
      .single()
    if (error) return toast(`Could not add partner: ${error.message}`, 'error')
    onChange([...partners, data])
    setName('')
    toast(`${data.name} added`)
  }

  async function remove(p: Partner) {
    if (!(await confirmDialog(`Remove “${p.name}” from the landing page?`, 'Remove'))) return
    const { error } = await supabase.from('partners').delete().eq('id', p.id)
    if (error) return toast(`Could not remove partner: ${error.message}`, 'error')
    onChange(partners.filter(x => x.id !== p.id))
    toast(`${p.name} removed`)
  }

  return (
    <div>
      <PageHeader title="Partners" subtitle="Companies featured on the landing page" />
      <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {partners.map(p => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid oklch(93% 0.008 260)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
            <div style={dangerLink} onClick={() => remove(p)}>
              Remove
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="New partner name"
            style={{ ...input, flex: 1 }}
          />
          <button style={button} onClick={add}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
