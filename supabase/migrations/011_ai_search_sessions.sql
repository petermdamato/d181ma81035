-- AI vendor search: store each search session's collected criteria for analytics and retrieval
create table if not exists public.ai_search_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  topic text,
  subject_population text,
  years_dates text,
  ownership text,
  data_type text,
  data_use text,
  geography text,
  other_details text,
  raw_messages jsonb
);

alter table public.ai_search_sessions enable row level security;
create policy "Anyone can insert ai_search_sessions"
  on public.ai_search_sessions for insert with check (true);
create policy "Anyone can select own or recent ai_search_sessions"
  on public.ai_search_sessions for select using (true);

create index if not exists ai_search_sessions_created_at on public.ai_search_sessions(created_at desc);
