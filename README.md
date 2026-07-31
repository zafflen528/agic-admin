# AGIC Admin

Vite + React + TypeScript admin panel for AGIC, backed by Supabase.

## Setup

1. Create a Supabase project, then run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
   It creates the `inquiries`, `products`, `partners` tables, the public `product-media`
   storage bucket, RLS policies, and seeds the three coal grades.
2. Copy `.env.example` to `.env.local` and fill in the project URL and anon key.
3. `npm install && npm run dev`

## Tabs

| Tab | Source |
| --- | --- |
| Dashboard | inquiry counts + 5 most recent |
| Inquiries | `inquiries` table, status editable inline |
| Products | `products` table — name, spec rows (jsonb), media in Supabase Storage |
| Partners | `partners` table |
| Users | static list (see note in `src/tabs/Users.tsx`) |

Product text fields save on blur, not per keystroke.

## Not built

- **Auth.** The panel talks to Supabase with the anon key and no login. RLS grants writes to
  `authenticated` only, so add `supabase.auth.signInWithPassword` plus a gate in `App.tsx`
  before this is reachable from the internet. Until then run it locally.
- **Site visits (30d)** shows `—`; wire it to whatever analytics the landing page uses.
