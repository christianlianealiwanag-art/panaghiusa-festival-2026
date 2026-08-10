/* ===========================================================
   lib/qr.ts
   Claver Children's Festival 2026
   Safari Adventure
=========================================================== */

export type Registration = {
  id?: number;

  explorer_no: string;

  child_name: string;

  age: number | null;

  sex: string | null;

  parent_name: string | null;

  relationship?: string | null;

  contact_number: string | null;

  email?: string | null;

  emergency_contact?: string | null;

  emergency_number?: string | null;

  lives_in_claver?: boolean | null;

  barangay?: string | null;

  purok?: string | null;

  studies_in_claver?: boolean | null;

  school_name?: string | null;

  kit_disclaimer_accepted?: boolean;

  waiver_accepted?: boolean;

  waiver_accepted_at?: string | null;

  checked_in: boolean;

  arrival_time: string | null;

  created_at?: string | null;
};

/* ===========================================================
   FORMAT DATE/TIME
=========================================================== */

export function formatArrivalTime(
  arrivalTime: string | null
): string {
  if (!arrivalTime) {
    return "Not yet checked in";
  }

  const date = new Date(arrivalTime);

  if (Number.isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(date);
}

/* ===========================================================
   FORMAT DATE ONLY
=========================================================== */

export function formatDate(
  value: string | null
): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeZone: "Asia/Manila",
  }).format(date);
}

/* ===========================================================
   NORMALIZE EXPLORER NUMBER

   Examples:

   5
   -> EXP-2026-0005

   25
   -> EXP-2026-0025

   105
   -> EXP-2026-0105

   1000
   -> EXP-2026-1000
=========================================================== */

export function normalizeExplorerNumber(
  rawValue: string
): string {
  let value = rawValue
    .trim()
    .toUpperCase();

  if (/^\d{1,4}$/.test(value)) {
    return `EXP-2026-${value.padStart(
      4,
      "0"
    )}`;
  }

  return value;
}

/* ===========================================================
   VALIDATE EXPLORER NUMBER
=========================================================== */

export function isExplorerNumber(
  value: string
): boolean {
  return /^EXP-2026-\d{4}$/.test(
    value.trim().toUpperCase()
  );
}

/* ===========================================================
   EXTRACT EXPLORER NUMBER FROM URL

   Supports:

   http://localhost:3000/success?id=EXP-2026-0001

=========================================================== */

export function explorerNumberFromUrl(
  value: string
): string {
  try {
    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      const url = new URL(value);

      const id =
        url.searchParams.get("id");

      if (id) {
        return normalizeExplorerNumber(id);
      }
    }
  } catch {
    // Ignore URL parsing errors
  }

  return normalizeExplorerNumber(value);
}

/* ===========================================================
   GENERATE EXPLORER NUMBER

   Example:

   1
   -> EXP-2026-0001

   27
   -> EXP-2026-0027
=========================================================== */

export function generateExplorerNumber(
  number: number
): string {
  return `EXP-2026-${String(number).padStart(
    4,
    "0"
  )}`;
}

/* ===========================================================
   STRIP PREFIX

   EXP-2026-0007
   -> 7
=========================================================== */

export function explorerNumericPart(
  explorerNumber: string
): number | null {
  const match =
    explorerNumber.match(
      /^EXP-2026-(\d{4})$/i
    );

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

/* ===========================================================
   EXTRACT EXPLORER NUMBER (FROM SCAN)

   Accepts a raw scanned value (a full QR URL or a plain
   Explorer Number) and returns the normalized Explorer
   Number, or an empty string if it isn't valid.
=========================================================== */

export function extractExplorerNumber(
  rawValue: string
): string {
  const candidate =
    explorerNumberFromUrl(rawValue);

  return isExplorerNumber(candidate)
    ? candidate
    : "";
}

/* ===========================================================
   NORMALIZE MANUAL EXPLORER NUMBER

   Accepts manual keyboard input, such as:

   5, 25, 105, 1000

   and returns the normalized Explorer Number, or an
   empty string if the input isn't 1 to 4 digits.
=========================================================== */

export function normalizeManualExplorerNumber(
  rawValue: string
): string {
  const trimmed = rawValue.trim();

  if (!/^\d{1,4}$/.test(trimmed)) {
    return "";
  }

  return normalizeExplorerNumber(trimmed);
}

/* ===========================================================
   CHECK-IN RESULT

   Shape returned by the "check_in_registration" RPC.
=========================================================== */

export type CheckInResult = {
  checked_in: boolean;
  arrival_time: string | null;
};