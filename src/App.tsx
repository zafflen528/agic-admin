import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Inquiry, Partner, Product } from './lib/supabase'
import { supabase } from './lib/supabase'
import Login from './Login'
import { Loading } from './ui'
import Dashboard from './tabs/Dashboard'
import Inquiries from './tabs/Inquiries'
import Partners from './tabs/Partners'
import Products from './tabs/Products'
import Users from './tabs/Users'

const TABS = ['Dashboard', 'Inquiries', 'Products', 'Partners', 'Users'] as const
type Tab = (typeof TABS)[number]

export default function App() {
  const [tab, setTab] = useState<Tab>('Dashboard')
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    setLoading(true)
    setError(null)
    Promise.all([
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('position'),
      supabase.from('partners').select('*').order('created_at'),
    ]).then(([i, pr, pa]) => {
      const failed = [i, pr, pa].find(r => r.error)
      if (failed) setError(failed.error!.message)
      else {
        setInquiries(i.data ?? [])
        setProducts(pr.data ?? [])
        setPartners(pa.data ?? [])
      }
      setLoading(false)
    })
  }, [session])

  if (!authReady)
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Loading label="Starting…" />
      </div>
    )
  if (!session) return <Login />

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div
        style={{
          width: 220,
          flex: 'none',
          background: 'oklch(24% 0.045 250)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
        }}
      >
        <div style={{ fontSize: 19, fontWeight: 800, padding: '0 8px 28px' }}>AGIC Admin</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {TABS.map(t => (
            <div
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '11px 14px',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                background: tab === t ? 'oklch(32% 0.05 250)' : 'transparent',
                color: tab === t ? '#fff' : 'oklch(78% 0.01 260)',
              }}
            >
              {t}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 'auto',
            padding: '16px 8px 12px',
            fontSize: 12,
            color: 'oklch(65% 0.02 260)',
            borderTop: '1px solid oklch(35% 0.03 250)',
          }}
        >
          Signed in as
          <br />
          <strong style={{ color: '#fff' }}>{session.user.email}</strong>
          <div
            onClick={() => supabase.auth.signOut()}
            style={{ marginTop: 8, cursor: 'pointer', color: 'oklch(78% 0.06 75)' }}
          >
            Sign out
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '36px 44px', overflow: 'auto' }}>
        {error && (
          <div
            style={{
              background: 'oklch(95% 0.05 30)',
              color: 'oklch(40% 0.15 30)',
              padding: '12px 16px',
              borderRadius: 8,
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            Could not load data: {error}
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          <>
            {tab === 'Dashboard' && (
              <Dashboard inquiries={inquiries} productCount={products.length} />
            )}
            {tab === 'Inquiries' && <Inquiries inquiries={inquiries} onChange={setInquiries} />}
            {tab === 'Products' && <Products products={products} onChange={setProducts} />}
            {tab === 'Partners' && <Partners partners={partners} onChange={setPartners} />}
            {tab === 'Users' && <Users />}
          </>
        )}
      </div>
    </div>
  )
}
