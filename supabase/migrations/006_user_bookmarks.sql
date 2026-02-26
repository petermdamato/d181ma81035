-- User bookmarks (saved companies)
create table if not exists public.user_bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, company_id)
);

alter table public.user_bookmarks enable row level security;

create policy "Users can view own bookmarks"
  on public.user_bookmarks for select using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.user_bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.user_bookmarks for delete using (auth.uid() = user_id);

create index if not exists user_bookmarks_user_id on public.user_bookmarks(user_id);
create index if not exists user_bookmarks_company_id on public.user_bookmarks(company_id);
