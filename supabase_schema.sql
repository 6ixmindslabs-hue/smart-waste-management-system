-- Smart Waste Management System schema
-- Run this file in the Supabase SQL Editor before deploying or testing APIs.

create extension if not exists "pgcrypto";

create table if not exists public.bins (
  id uuid primary key default gen_random_uuid(),
  deviceid text not null,
  fillpercentage integer not null check (fillpercentage between 0 and 100),
  status text not null check (status in ('EMPTY', 'HALF', 'FULL')),
  createdat timestamptz not null default timezone('utc'::text, now())
);

create index if not exists bins_deviceid_createdat_idx
on public.bins (deviceid, createdat desc);

alter table public.bins enable row level security;

drop policy if exists "Enable read access for all users" on public.bins;
drop policy if exists "Enable insert access for all users" on public.bins;

create policy "Enable read access for all users"
on public.bins
for select
using (true);

create policy "Enable insert access for all users"
on public.bins
for insert
with check (true);

create table if not exists public.dustbin_registry (
  id uuid primary key default gen_random_uuid(),
  deviceid text unique not null,
  name text not null,
  details text,
  createdat timestamptz not null default timezone('utc'::text, now())
);

create index if not exists dustbin_registry_deviceid_idx
on public.dustbin_registry (deviceid);

alter table public.dustbin_registry enable row level security;

drop policy if exists "Enable select for all" on public.dustbin_registry;
drop policy if exists "Enable insert for all" on public.dustbin_registry;
drop policy if exists "Enable update for all" on public.dustbin_registry;
drop policy if exists "Enable delete for all" on public.dustbin_registry;

create policy "Enable select for all"
on public.dustbin_registry
for select
using (true);

create policy "Enable insert for all"
on public.dustbin_registry
for insert
with check (true);

create policy "Enable update for all"
on public.dustbin_registry
for update
using (true)
with check (true);

create policy "Enable delete for all"
on public.dustbin_registry
for delete
using (true);

insert into public.dustbin_registry (deviceid, name, details)
values ('BIN001', 'Main Lobby Bin', 'Floor 1')
on conflict (deviceid) do nothing;
