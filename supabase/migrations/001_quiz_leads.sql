-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table if not exists public.quiz_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  answers jsonb not null,
  scores jsonb not null,
  band_label text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.quiz_leads enable row level security;

-- Allow anonymous inserts (for the quiz form)
create policy "Allow anonymous insert"
  on public.quiz_leads
  for insert
  to anon
  with check (true);

-- Optional: restrict reads to authenticated users only (so leads aren't publicly readable)
create policy "Allow service role full access"
  on public.quiz_leads
  for all
  to service_role
  using (true)
  with check (true);
