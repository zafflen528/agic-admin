# AGIC Admin

Vite + React + TypeScript admin panel for AGIC, backed by Supabase.

## Setup

1. Create a Supabase project, then run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
   It creates the `inquiries`, `products`, `partners` tables, the public `product-media`
   storage bucket, RLS policies, and seeds the three coal grades.
2. Copy `.env.example` to `.env.local` and fill in the project URL and anon key.
3. Create your admin user: Supabase dashboard → **Authentication → Users → Add user**
   (tick *Auto Confirm User*). Writes are `authenticated`-only, so a signed-out client
   gets 401 on every insert/update/delete.
4. `npm install && npm run dev`

## Tabs

| Tab | Source |
| --- | --- |
| Dashboard | inquiry counts + 5 most recent |
| Inquiries | `inquiries` table, status editable inline |
| Products | `products` table — name, spec rows (jsonb), media in Supabase Storage, drag ⠿ to reorder (`position`) |
| Partners | `partners` table |
| Users | static list (see note in `src/tabs/Users.tsx`) |

Product text fields save on blur, not per keystroke.

## Not built

- **Roles.** Any signed-in Supabase user gets full write access — the Users tab's
  Admin/Editor split is cosmetic. Add a `role` claim and split the RLS policies if editors
  should be limited.
- **Site visits (30d)** shows `—`; wire it to whatever analytics the landing page uses.
