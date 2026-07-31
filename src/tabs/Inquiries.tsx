import type { Inquiry } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { PageHeader, bodyRow, card, fmtDate, muted, td, th, theadRow } from '../ui'

const STATUSES: Inquiry['status'][] = ['New', 'Contacted', 'Quoted', 'Closed']

export default function Inquiries({
  inquiries,
  onChange,
}: {
  inquiries: Inquiry[]
  onChange: (next: Inquiry[]) => void
}) {
  async function setStatus(id: string, status: Inquiry['status']) {
    onChange(inquiries.map(q => (q.id === id ? { ...q, status } : q)))
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id)
    if (error) alert(`Could not update status: ${error.message}`)
  }

  return (
    <div>
      <PageHeader title="Inquiries" subtitle="Leads submitted through the quote request form" />
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        {inquiries.length === 0 ? (
          <div style={{ ...muted, padding: 40, textAlign: 'center' }}>
            No inquiries yet. Try submitting the quote form on the landing page.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={theadRow}>
                <th style={th}>Name</th>
                <th style={th}>Company</th>
                <th style={th}>Product</th>
                <th style={th}>Date</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(q => (
                <tr key={q.id} style={bodyRow}>
                  <td style={{ ...td, color: 'inherit', fontWeight: 700 }}>{q.name}</td>
                  <td style={td}>{q.company || '—'}</td>
                  <td style={td}>{q.product || '—'}</td>
                  <td style={td}>{fmtDate(q.created_at)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={q.status}
                      onChange={e => setStatus(q.id, e.target.value as Inquiry['status'])}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 5,
                        border: '1px solid oklch(85% 0.01 260)',
                        fontSize: 13,
                      }}
                    >
                      {STATUSES.map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
