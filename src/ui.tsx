import type { CSSProperties } from 'react'

export const card: CSSProperties = {
  background: '#fff',
  border: '1px solid oklch(90% 0.008 260)',
  borderRadius: 10,
  padding: 24,
}

export const muted: CSSProperties = { fontSize: 14, color: 'oklch(45% 0.02 260)' }

export const th: CSSProperties = { padding: '12px 16px', fontSize: 12, color: 'oklch(45% 0.02 260)' }
export const td: CSSProperties = { padding: '12px 16px', color: 'oklch(40% 0.02 260)' }
export const theadRow: CSSProperties = { background: 'oklch(97% 0.008 260)', textAlign: 'left' }
export const bodyRow: CSSProperties = { borderTop: '1px solid oklch(93% 0.008 260)' }

export const input: CSSProperties = {
  padding: '10px 12px',
  border: '1px solid oklch(85% 0.01 260)',
  borderRadius: 6,
  fontSize: 14,
}

export const button: CSSProperties = {
  background: 'oklch(24% 0.045 250)',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: 6,
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

export const dangerLink: CSSProperties = {
  fontSize: 13,
  color: 'oklch(55% 0.15 30)',
  cursor: 'pointer',
  fontWeight: 600,
  whiteSpace: 'nowrap',
}

export const bare: CSSProperties = { border: 'none', background: 'transparent', padding: 0 }

const statusColors: Record<string, string> = {
  New: 'oklch(50% 0.15 250)',
  Contacted: 'oklch(60% 0.13 75)',
  Quoted: 'oklch(55% 0.1 150)',
  Closed: 'oklch(55% 0.01 260)',
}

export const badge = (status: string): CSSProperties => ({
  background: statusColors[status] ?? statusColors.New,
  color: '#fff',
  padding: '4px 10px',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
})

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{title}</div>
      <div style={{ ...muted, marginBottom: 28 }}>{subtitle}</div>
    </>
  )
}
