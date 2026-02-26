-- Delivery methods (fixed list for company profiles)
create table if not exists public.data_delivery_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

alter table public.data_delivery_methods enable row level security;
create policy "Delivery methods are viewable by everyone"
  on public.data_delivery_methods for select using (true);

insert into public.data_delivery_methods (name) values
  ('SFTP'),
  ('Email Delivery'),
  ('REST API'),
  ('File Export'),
  ('Google Cloud Storage'),
  ('Streaming API'),
  ('Compressed Files'),
  ('SOAP API'),
  ('Azure Blob Storage'),
  ('Snowflake'),
  ('Databricks Delta'),
  ('MCP Server'),
  ('Google BigQuery'),
  ('Websocket'),
  ('FIX API'),
  ('RAG API'),
  ('Other')
on conflict (name) do nothing;

-- Data attributes (commonly used + user-created; public = true => in search dropdown)
create table if not exists public.data_attributes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  public boolean not null default true
);

alter table public.data_attributes enable row level security;
create policy "Data attributes are viewable by everyone"
  on public.data_attributes for select using (true);
create policy "Authenticated users can insert data attributes"
  on public.data_attributes for insert with check (auth.role() = 'authenticated');

create index if not exists data_attributes_public on public.data_attributes(public) where public = true;

-- Seed commonly used attributes (public = show in search/dropdown)
insert into public.data_attributes (name, public)
select v.name, v.public
from (values
  ('Demographics', true),
  ('Firmographic', true),
  ('Transactional', true),
  ('Behavioral', true),
  ('B2B', true),
  ('Consumer', true),
  ('Geospatial', true),
  ('Financial', true),
  ('Identity', true),
  ('Contact', true),
  ('Intent', true),
  ('Technographic', true)
) as v(name, public)
where not exists (
  select 1 from public.data_attributes d where d.name = v.name and d.public = true
);

-- Add delivery methods and datapoints (attribute ids) to companies
alter table public.companies
  add column if not exists delivery_method_ids uuid[] default '{}',
  add column if not exists data_attribute_ids uuid[] default '{}';
