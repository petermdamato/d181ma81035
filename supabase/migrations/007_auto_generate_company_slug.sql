-- Auto-generate company slug from name, category, and subcategory.
-- Slug is a URL-safe combination of the three; collisions get a numeric suffix (-2, -3, ...).

create or replace function public.slugify(t text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(trim(coalesce(t, ''))), '[^a-z0-9]+', '-', 'g'))
$$;

create or replace function public.companies_set_slug()
returns trigger
language plpgsql
as $$
declare
  base_slug text;
  candidate_slug text;
  suffix int := 0;
  slug_exists boolean;
  part_name text;
  part_cat text;
  part_sub text;
begin
  part_name := nullif(public.slugify(NEW.name), '');
  part_cat  := nullif(public.slugify(NEW.category), '');
  part_sub  := nullif(public.slugify(NEW.subcategory), '');

  base_slug := trim(both '-' from concat_ws('-', part_name, part_cat, part_sub));

  if base_slug = '' or base_slug is null then
    base_slug := 'company';
  end if;

  candidate_slug := base_slug;
  loop
    select exists(
      select 1 from public.companies
       where companies.slug = candidate_slug
         and id is distinct from NEW.id
    ) into slug_exists;
    exit when not slug_exists;
    suffix := suffix + 1;
    candidate_slug := base_slug || '-' || suffix;
  end loop;

  NEW.slug := candidate_slug;
  return NEW;
end;
$$;

drop trigger if exists companies_set_slug_trigger on public.companies;
create trigger companies_set_slug_trigger
  before insert or update of name, category, subcategory
  on public.companies
  for each row
  execute function public.companies_set_slug();

-- Backfill existing rows so slug is consistent with name+category+subcategory
update public.companies
set name = name
where true;
