-- VOWÉ MY: run this once in Supabase → SQL Editor.
-- Public visitors may read the invitation and guestbook, and add an RSVP or a wish.
-- Only emails listed in public.admins can read RSVPs, the guest list, or edit anything.

create table if not exists public.admins (
  email text primary key
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where email = auth.jwt() ->> 'email');
$$;

-- Invitation settings. `data` holds the Wedding JSON; empty means "use the built-in defaults".
create table if not exists public.weddings (
  slug text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  wedding_slug text not null references public.weddings (slug) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (phone ~ '^[0-9]{8,15}$'),
  attending boolean not null,
  pax int not null check (pax between 0 and 20),
  dietary text not null default '' check (char_length(dietary) <= 300),
  message text not null default '' check (char_length(message) <= 1000),
  created_at timestamptz not null default now(),
  -- One reply per phone number per wedding: blocks duplicate submissions.
  unique (wedding_slug, phone)
);

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  wedding_slug text not null references public.weddings (slug) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  wedding_slug text not null references public.weddings (slug) on delete cascade,
  name text not null,
  phone text not null default '',
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.weddings enable row level security;
alter table public.rsvps enable row level security;
alter table public.wishes enable row level security;
alter table public.guests enable row level security;

-- weddings: anyone reads, admins edit
drop policy if exists "weddings read" on public.weddings;
create policy "weddings read" on public.weddings for select using (true);
drop policy if exists "weddings admin update" on public.weddings;
create policy "weddings admin update" on public.weddings for update using (public.is_admin()) with check (public.is_admin());

-- rsvps: anyone inserts within the guest limit; only admins read or delete.
-- The limit comes from the saved settings (rsvp.maxPax), falling back to 4 like the app default.
drop policy if exists "rsvps insert" on public.rsvps;
create policy "rsvps insert" on public.rsvps for insert with check (
  (attending or pax = 0)
  and pax <= coalesce(
    (select (w.data -> 'rsvp' ->> 'maxPax')::int from public.weddings w where w.slug = wedding_slug),
    4
  )
);
drop policy if exists "rsvps admin read" on public.rsvps;
create policy "rsvps admin read" on public.rsvps for select using (public.is_admin());
drop policy if exists "rsvps admin delete" on public.rsvps;
create policy "rsvps admin delete" on public.rsvps for delete using (public.is_admin());

-- wishes: the guestbook is public by design; admins can remove entries
drop policy if exists "wishes read" on public.wishes;
create policy "wishes read" on public.wishes for select using (true);
drop policy if exists "wishes insert" on public.wishes;
create policy "wishes insert" on public.wishes for insert with check (true);
drop policy if exists "wishes admin delete" on public.wishes;
create policy "wishes admin delete" on public.wishes for delete using (public.is_admin());

-- guests: private invite list, admins only
drop policy if exists "guests admin all" on public.guests;
create policy "guests admin all" on public.guests for all using (public.is_admin()) with check (public.is_admin());

-- admins: a signed-in user may only check their own row
drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins for select using (email = auth.jwt() ->> 'email');

insert into public.weddings (slug) values ('main') on conflict do nothing;

-- Finally, add your organiser login (create the user first under Authentication → Users):
-- insert into public.admins (email) values ('you@example.com');