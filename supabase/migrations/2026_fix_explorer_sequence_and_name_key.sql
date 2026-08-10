-- ============================================================
-- Claver Children's Festival 2026 — Fix explorer numbering
-- and tighten duplicate-child matching (middle initial only)
--
-- Run this in the Supabase SQL Editor, one statement/block at
-- a time, reading the output as you go.
-- ============================================================

-- ------------------------------------------------------------
-- STEP 1 — Find the sequence(s) behind explorer_no.
--
-- pg_sequences shows every sequence in the "public" schema
-- along with its current value. Whichever one currently sits
-- around 14 or 15 is almost certainly the explorer number
-- generator (even if its name doesn't contain "explorer").
-- ------------------------------------------------------------
select schemaname, sequencename, last_value
from pg_sequences
where schemaname = 'public';

-- Also check exactly how explorer_no is populated (default
-- expression or trigger), for reference:
select column_name, column_default
from information_schema.columns
where table_name = 'registrations'
  and column_name = 'explorer_no';

select trigger_name, action_timing, event_manipulation, action_statement
from information_schema.triggers
where event_object_table = 'registrations';

-- ------------------------------------------------------------
-- STEP 2 — Reset that sequence back to 1.
--
-- Replace <sequence_name> with the name found in Step 1, then
-- run this on its own:
-- ------------------------------------------------------------
-- alter sequence <sequence_name> restart with 1;

-- ------------------------------------------------------------
-- STEP 3 — Recompute child_name_key using ONLY the middle
-- name's first letter (matches the updated app logic), so
-- "Aliwanag" and "A." are treated as the same child.
--
-- First, check whether recomputing would create any new
-- collisions among your CURRENT rows:
-- ------------------------------------------------------------
select
  lower(regexp_replace(
    coalesce(child_surname, '') || coalesce(child_first_name, '') || left(coalesce(child_middle_name, ''), 1),
    '[^a-zA-Z0-9]', '', 'g'
  )) as new_key,
  array_agg(id order by created_at) as ids,
  array_agg(explorer_no order by created_at) as explorer_numbers
from public.registrations
group by new_key
having count(*) > 1;

-- ------------------------------------------------------------
-- STEP 4 — If Step 3 showed collisions, decide which row(s)
-- to keep for each group (e.g. keep the earliest id) and
-- delete the rest. Example (adjust the id list as needed):
-- ------------------------------------------------------------
-- delete from public.registrations where id in (15);

-- ------------------------------------------------------------
-- STEP 5 — Once there are no collisions, recompute the key
-- for every remaining row using the middle-initial rule:
-- ------------------------------------------------------------
update public.registrations
set child_name_key = lower(regexp_replace(
  coalesce(child_surname, '') || coalesce(child_first_name, '') || left(coalesce(child_middle_name, ''), 1),
  '[^a-zA-Z0-9]', '', 'g'
));
