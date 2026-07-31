import { PageHeader, bodyRow, card, td, th, theadRow } from '../ui'

// ponytail: roster is static — the design shows fixed rows. Move to a `users`
// table joined on auth.users when someone actually needs to invite a teammate.
const USERS = [
  {
    name: 'Arrayhan Ramadhan',
    email: 'ar.mail@arrayglobeinternationalcapital.com',
    role: 'Admin',
  },
  { name: 'Content Editor', email: 'editor@arrayglobeinternationalcapital.com', role: 'Editor' },
]

export default function Users() {
  return (
    <div>
      <PageHeader title="Users & Roles" subtitle="Team members with access to this admin panel" />
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={theadRow}>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Role</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map(u => (
              <tr key={u.email} style={bodyRow}>
                <td style={{ ...td, color: 'inherit', fontWeight: 700 }}>{u.name}</td>
                <td style={td}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      background: u.role === 'Admin' ? 'oklch(24% 0.045 250)' : 'oklch(90% 0.01 260)',
                      color: u.role === 'Admin' ? '#fff' : 'oklch(30% 0.01 260)',
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
