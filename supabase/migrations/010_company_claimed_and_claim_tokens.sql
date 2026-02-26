-- Company claim: claimed, claimed_contact (email), claimed_by_user_id (who can edit).
-- When claimed = true, only claimed_by_user_id can update the company.

alter table public.companies
  add column if not exists claimed boolean not null default false,
  add column if not exists claimed_contact text,
  add column if not exists claimed_by_user_id uuid references auth.users(id) on delete set null;

create index if not exists companies_claimed_by_user_id on public.companies(claimed_by_user_id) where claimed_by_user_id is not null;

-- Verification tokens for claim flow (server-only access via service role; RLS allows no anon/auth)
create table if not exists public.company_claim_tokens (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  email text not null,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

alter table public.company_claim_tokens enable row level security;
-- No policies: only service role can read/insert/delete (for claim flow server actions)

create index if not exists company_claim_tokens_token on public.company_claim_tokens(token);
create index if not exists company_claim_tokens_expires_at on public.company_claim_tokens(expires_at);

-- RLS: only claimer can update when claimed; any authenticated can update when not claimed
drop policy if exists "Authenticated users can update companies" on public.companies;
create policy "Users can update unclaimed companies"
  on public.companies for update
  using (
    (claimed = false and auth.role() = 'authenticated')
    or (claimed = true and claimed_by_user_id = auth.uid())
  );
