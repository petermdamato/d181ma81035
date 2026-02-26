alter table public.reviews
  add column if not exists hidden boolean not null default false;
