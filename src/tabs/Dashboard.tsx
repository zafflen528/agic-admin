import type { Inquiry } from '../lib/supabase'
import { PageHeader, badge, card, fmtDate, muted } from '../ui'

const WEEK = 7 * 24 * 60 * 60 * 1000

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ ...card, padding: 22 }}>
      <div style={{ ...muted, fontSize: 13, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800 }}>{value}</div>
    </div>
  )
}

export default function Dashboard({
  inquiries,
  productCount,
}: {
  inquiries: Inquiry[]
  productCount: number
}) {
  const newCount = inquiries.filter(q => Date.now() - +new Date(q.created_at) < WEEK).length

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of site activity and leads" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: 20,
          marginBottom: 36,
        }}
      >
        <Stat label="Site visits (30d)" value="—" />
        <Stat label="Total inquiries" value={inquiries.length} />
        <Stat label="New this week" value={newCount} />
        <Stat label="Active listings" value={productCount} />
      </div>

      <div style={card}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Recent Inquiries</div>
        {inquiries.length === 0 ? (
          <div style={{ ...muted, padding: '20px 0', textAlign: 'center' }}>
            No inquiries yet — submissions from the landing page contact form will appear here.
          </div>
        ) : (
          inquiries.slice(0, 5).map(q => (
            <div
              key={q.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid oklch(93% 0.008 260)',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{q.name}</div>
                <div style={{ ...muted, fontSize: 12 }}>
                  {q.product ?? '—'} · {fmtDate(q.created_at)}
                </div>
              </div>
              <div style={badge(q.status)}>{q.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
