-- Remove reviewer_name from reviews (only user_id is stored)
alter table public.reviews drop column if exists reviewer_name;
