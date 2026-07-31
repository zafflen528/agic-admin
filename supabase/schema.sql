-- AGIC Admin — run in Supabase SQL editor.

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  product text,
  message text,
  status text not null default 'New' check (status in ('New','Contacted','Quoted','Closed')),
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specs jsonb not null default '[]',   -- [{label, unit, value}]
  media jsonb not null default '[]',   -- [{url, type, path}]
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Storage for product photos/videos.
insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;

-- RLS: landing page may insert leads; everything else needs a signed-in user.
alter table inquiries enable row level security;
alter table products  enable row level security;
alter table partners  enable row level security;

create policy "public can submit inquiries" on inquiries for insert to anon with check (true);
create policy "admins read/write inquiries" on inquiries for all to authenticated using (true) with check (true);

create policy "public reads products" on products for select to anon using (true);
create policy "admins write products" on products for all to authenticated using (true) with check (true);

create policy "public reads partners" on partners for select to anon using (true);
create policy "admins write partners" on partners for all to authenticated using (true) with check (true);

create policy "public reads media" on storage.objects for select to anon
  using (bucket_id = 'product-media');
create policy "admins write media" on storage.objects for all to authenticated
  using (bucket_id = 'product-media') with check (bucket_id = 'product-media');

-- Seed the three grades from the design.
insert into products (name, position, specs) values
('Coal GAR 45', 1, '[{"label":"Total Moisture","unit":"% ARB","value":"31.2"},{"label":"Inherent Moisture","unit":"% ADB","value":"16.8"},{"label":"Ash","unit":"% ADB","value":"4.46"},{"label":"Volatile Matter","unit":"% ADB","value":"41.9"},{"label":"Fixed Carbon","unit":"% ADB","value":"36.7"},{"label":"Sulphur","unit":"% ADB","value":"0.79"},{"label":"Gross Calorific Value","unit":"ARB","value":"4570"}]'),
('Coal GAR 48', 2, '[{"label":"Total Moisture","unit":"% ARB","value":"28.3"},{"label":"Inherent Moisture","unit":"% ADB","value":"16.4"},{"label":"Ash","unit":"% ADB","value":"5.8"},{"label":"Volatile Matter","unit":"% ADB","value":"42.6"},{"label":"Fixed Carbon","unit":"% ADB","value":"35.2"},{"label":"Sulphur","unit":"% ADB","value":"0.74"},{"label":"Gross Calorific Value","unit":"ARB","value":"4798"}]'),
('Coal GAR 58', 3, '[{"label":"Total Moisture","unit":"% ARB","value":"20.3"},{"label":"Inherent Moisture","unit":"% ADB","value":"10.8"},{"label":"Ash","unit":"% ADB","value":"9.4"},{"label":"Volatile Matter","unit":"% ADB","value":"42.6"},{"label":"Fixed Carbon","unit":"% ADB","value":"40.1"},{"label":"Sulphur","unit":"% ADB","value":"0.74"},{"label":"Gross Calorific Value","unit":"ARB","value":"5815"}]')
on conflict do nothing;

insert into partners (name) values ('PT. Zata Eksporia Nusantara') on conflict do nothing;
