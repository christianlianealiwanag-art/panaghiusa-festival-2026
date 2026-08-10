-- ============================================================
-- Claver Children's Festival 2026 — Wipe ALL registrations
--
-- Run this in the Supabase SQL Editor when you want to clear
-- out sample/test data and start fresh from Explorer Number 1.
--
-- WARNING: This permanently deletes every row in
-- `registrations`. There is no undo. Only run this if you are
-- certain there are no real registrations you need to keep.
-- ============================================================

-- Deletes all rows and resets the table's own identity/serial
-- column (e.g. "id") back to 1.
truncate table public.registrations restart identity cascade;

-- ------------------------------------------------------------
-- If your Explorer Number (e.g. EXP-2026-0001) is generated
-- from its own database sequence (rather than derived directly
-- from the "id" column), that sequence needs to be reset
-- separately so the next registration becomes EXP-2026-0001
-- again. Run the SELECT below to find it:
-- ------------------------------------------------------------
select sequence_name
from information_schema.sequences
where sequence_name ilike '%explorer%';

-- Then run this, replacing <sequence_name> with the result above:
-- alter sequence <sequence_name> restart with 1;
