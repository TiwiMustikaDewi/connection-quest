-- ==============================================================================
-- CONNECTION QUEST - POSTGRESQL SCHEMA FOR AFL WINTER PEAK 2026
-- Capacity Building 1: Real-Time Leaderboard & CTA Submissions
-- ==============================================================================

-- 1. Table: Participants (Identitas Peserta)
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  homegroup text not null, -- 'Homegroup 1' sampai 'Homegroup 16'
  avatar_id text not null, -- 'milo' | 'lumi' | 'kiko'
  created_at timestamptz not null default now()
);

-- 2. Table: Submissions (Hasil Quest, 4 Pilar Skor, & Komitmen CTA 48 Jam)
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.participants(id) on delete set null,
  name text not null,
  homegroup text not null,
  avatar_id text not null,
  archetype text not null, -- 'The Bridge Builder', 'The Empathetic Anchor', etc.
  total_score integer not null default 0,
  speed_score integer not null default 0,
  arcade_score integer not null default 0,
  connection_score integer not null default 0,
  cta_score integer not null default 0,
  pledge text not null default '',
  strategy text default '',
  target_environment text default '',
  indicators jsonb not null default '{}'::jsonb,
  choices jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 3. High-Performance Indexes for 16 Homegroups & Fast Leaderboard Sorting
create index if not exists idx_submissions_score on public.submissions (total_score desc);
create index if not exists idx_submissions_homegroup on public.submissions (homegroup);
create index if not exists idx_submissions_created_at on public.submissions (created_at desc);

-- 4. Enable Row Level Security (RLS)
alter table public.participants enable row level security;
alter table public.submissions enable row level security;

-- Policies for Seminar Environment (Allow public read, insert, update)
drop policy if exists "Allow public submissions insert" on public.submissions;
create policy "Allow public submissions insert" on public.submissions
  for insert with check (true);

drop policy if exists "Allow public submissions read" on public.submissions;
create policy "Allow public submissions read" on public.submissions
  for select using (true);

drop policy if exists "Allow public submissions update" on public.submissions;
create policy "Allow public submissions update" on public.submissions
  for update using (true);

drop policy if exists "Allow public submissions delete" on public.submissions;
create policy "Allow public submissions delete" on public.submissions
  for delete using (true);

drop policy if exists "Allow public participants insert" on public.participants;
create policy "Allow public participants insert" on public.participants
  for insert with check (true);

drop policy if exists "Allow public participants read" on public.participants;
create policy "Allow public participants read" on public.participants
  for select using (true);

-- 5. Safe & Idempotent Real-Time WebSocket Publication
-- Memungkinkan Postgres CDC mereplikasi setiap INSERT secara real-time ke web client
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'submissions'
  ) then
    alter publication supabase_realtime add table public.submissions;
  end if;
end $$;
