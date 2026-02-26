-- Add category and subcategory to companies (run if table already exists)
alter table public.companies
  add column if not exists category text,
  add column if not exists subcategory text;

create index if not exists companies_category on public.companies(category);
create index if not exists companies_subcategory on public.companies(category, subcategory);
