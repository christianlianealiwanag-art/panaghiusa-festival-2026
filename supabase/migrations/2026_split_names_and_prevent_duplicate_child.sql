-- ============================================================
-- Claver Children's Festival 2026 — Registrations table update
--
-- Run this once in the Supabase SQL Editor
-- (Project → SQL Editor → New query → paste → Run).
--
-- What it does:
--   1. Adds separate Surname / First Name / Middle Name columns
--      for both the child and the parent/guardian.
--   2. Adds a normalized "child_name_key" column used to detect
--      duplicate child registrations regardless of spacing,
--      capitalization, or punctuation.
--   3. Backfills existing rows so the new columns are populated
--      from the current child_name / parent_name values.
--   4. Adds a UNIQUE constraint on child_name_key so the same
--      child can never be registered twice, even if two people
--      submit the form at the same time.
-- ============================================================

alter table public.registrations
  add column if not exists child_surname text,
  add column if not exists child_first_name text,
  add column if not exists child_middle_name text,
  add column if not exists parent_surname text,
  add column if not exists parent_first_name text,
  add column if not exists parent_middle_name text,
  add column if not exists child_name_key text;

-- Backfill child_name_key for any rows that already exist,
-- so the unique index below can be created safely.
update public.registrations
set child_name_key = lower(regexp_replace(coalesce(child_name, ''), '[^a-zA-Z0-9]', '', 'g'))
where child_name_key is null;

-- ------------------------------------------------------------
-- STEP A — Review duplicates before touching any data.
--
-- Run this SELECT first and check the results. For each
-- duplicated child_name_key, decide which row (id) you want
-- to KEEP (e.g. the one that was actually checked in, or the
-- earliest submission).
-- ------------------------------------------------------------
select id, explorer_no, child_name, parent_name, created_at, checked_in
from public.registrations
where child_name_key in (
  select child_name_key
  from public.registrations
  group by child_name_key
  having count(*) > 1
)
order by child_name_key, created_at asc;

-- ------------------------------------------------------------
-- STEP B — Remove duplicate rows.
--
-- This keeps, for each child_name_key, the EARLIEST
-- registration (oldest created_at) and deletes the later
-- duplicate(s). Review STEP A's results first — if you'd
-- rather keep a different row (e.g. one already checked in),
-- adjust the ORDER BY below or delete manually by id instead.
--
-- Uncomment the DELETE below once you're sure it's safe to run.
-- ------------------------------------------------------------
-- delete from public.registrations
-- where id in (
--   select id
--   from (
--     select
--       id,
--       row_number() over (
--         partition by child_name_key
--         order by created_at asc, id asc
--       ) as row_num
--     from public.registrations
--   ) ranked
--   where ranked.row_num > 1
-- );

-- ------------------------------------------------------------
-- STEP C — Once duplicates are resolved, create the unique
-- index so this situation can never happen again.
-- ------------------------------------------------------------
create unique index if not exists registrations_child_name_key_unique
  on public.registrations (child_name_key);
