import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export type Spec = { label: string; unit: string; value: string }
export type Media = { url: string; type: 'image' | 'video'; path: string }

export type Inquiry = {
  id: string
  name: string
  company: string | null
  product: string | null
  status: 'New' | 'Contacted' | 'Quoted' | 'Closed'
  created_at: string
}

export type Product = {
  id: string
  name: string
  specs: Spec[]
  media: Media[]
  position: number
}

export type Partner = { id: string; name: string }
