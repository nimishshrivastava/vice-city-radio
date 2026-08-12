# Vice City Radio — production-ready starter

A retro/synthwave music-radio web app inspired by the visual direction created from the supplied coastal-drive image.

## Included

- Next.js + React + TypeScript
- Full-screen visual radio homepage
- Responsive mobile layout
- YouTube IFrame player
- Automatic time-based programming using Asia/Kolkata
- Playlists and queue
- Supabase database schema
- Supabase Auth-ready admin area
- Admin CRUD for songs and playlists
- Local demo data fallback when Supabase is not configured
- Deployment-ready for Vercel

## 1. Install

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 2. Supabase setup

Create a Supabase project, then run `supabase/schema.sql` in the SQL editor.

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For admin access, create a user in Supabase Authentication. Then add that user's UUID to the `admin_users` table:

```sql
insert into public.admin_users (user_id, role)
values ('YOUR_AUTH_USER_UUID', 'admin');
```

## 3. Add songs

The admin screen is at:

`/admin`

Each song needs a YouTube video ID. Example:

`dQw4w9WgXcQ`

The player uses YouTube's embedded player; do not download or self-host copyrighted music unless you have the required rights.

## 4. Time programming

The database stores playlist windows as local India time. The default demo schedule is:

- 06:00–12:00 — 90s Drive
- 12:00–18:00 — Retro Afternoon
- 18:00–00:00 — Night Cruise
- 00:00–06:00 — Midnight Vibes

The schedule can be changed from the database/admin layer.

## 5. Deploy

Push this folder to GitHub and import the repository into Vercel. Add the two Supabase environment variables in Vercel.

## Production hardening

Before public launch:

- Enable Supabase email verification.
- Add a custom domain.
- Replace demo playlist data with licensed/authorized content.
- Add analytics and error monitoring.
- Add rate limiting to any future public write endpoints.
- Keep Supabase Row Level Security enabled.
