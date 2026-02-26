-- Add new rating columns and reviewer_name to reviews
alter table public.reviews
  add column if not exists ease_of_access_rating int default 5 check (ease_of_access_rating is null or (ease_of_access_rating >= 1 and ease_of_access_rating <= 5)),
  add column if not exists sales_team_rating int default 5 check (sales_team_rating is null or (sales_team_rating >= 1 and sales_team_rating <= 5)),
  add column if not exists data_coverage_rating int default 5 check (data_coverage_rating is null or (data_coverage_rating >= 1 and data_coverage_rating <= 5)),
  add column if not exists value_rating int default 5 check (value_rating is null or (value_rating >= 1 and value_rating <= 5)),
  add column if not exists reviewer_name text;
