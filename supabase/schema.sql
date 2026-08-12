create extension if not exists "pgcrypto";

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text default '',
  start_time time not null,
  end_time time not null,
  cover_url text default '',
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text default '',
  album text default '',
  youtube_id text not null,
  artwork_url text default '',
  duration_seconds integer default 0,
  playlist_id uuid references public.playlists(id) on delete set null,
  sort_order integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz default now()
);

alter table public.playlists enable row level security;
alter table public.songs enable row level security;
alter table public.admin_users enable row level security;

create policy "Public can read playlists"
on public.playlists for select
using (true);

create policy "Public can read active songs"
on public.songs for select
using (active = true);

create policy "Admins can read all songs"
on public.songs for select
using (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  )
);

create policy "Admins can insert songs"
on public.songs for insert
with check (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  )
);

create policy "Admins can update songs"
on public.songs for update
using (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  )
);

create policy "Admins can delete songs"
on public.songs for delete
using (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  )
);

create policy "Admins can manage playlists"
on public.playlists for all
using (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  )
);

insert into public.playlists (name, slug, description, start_time, end_time, sort_order)
values
('90s Drive', '90s-drive', 'The perfect start to your day.', '06:00', '12:00', 1),
('Retro Afternoon', 'retro-afternoon', 'Timeless hits all day long.', '12:00', '18:00', 2),
('Night Cruise', 'night-cruise', 'Smooth tracks for the night.', '18:00', '00:00', 3),
('Midnight Vibes', 'midnight-vibes', 'Late night, high vibes.', '00:00', '06:00', 4)
on conflict (slug) do nothing;
