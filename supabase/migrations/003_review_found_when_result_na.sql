-- Add found_when and result to reviews, allow null for rating (N/A)
alter table public.reviews
  add column if not exists found_when text,
  add column if not exists result text;

-- Make overall rating nullable for N/A option
alter table public.reviews
  alter column rating drop not null;

-- Update check to allow null
alter table public.reviews
  drop constraint if exists reviews_rating_check;

alter table public.reviews
  add constraint reviews_rating_check check (
    rating is null or (rating >= 1 and rating <= 5)
  );
