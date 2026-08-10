"use client";

import {
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";

import { FaKeyboard } from "react-icons/fa";

type ManualSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  searching?: boolean;
};

export default function ManualSearch({
  value,
  onChange,
  onSearch,
  searching = false,
}: ManualSearchProps) {
  const timeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function scheduleSearch(
    nextValue: string
  ) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!nextValue) {
      return;
    }

    const isShortNumber =
      /^\d{1,4}$/.test(nextValue);

    const isFullExplorerNumber =
      /^EXP-2026-\d{4}$/.test(nextValue);

    if (
      !isShortNumber &&
      !isFullExplorerNumber
    ) {
      return;
    }

    timeoutRef.current =
      setTimeout(() => {
        onSearch(nextValue);
      }, 500);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    onSearch(value);
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-xl bg-green-100 p-3 text-green-700">
          <FaKeyboard className="text-xl" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-green-600">
            Manual Verification
          </p>

          <h3 className="font-bold text-green-900">
            Search Explorer Number
          </h3>
        </div>
      </div>

      <p className="mb-4 text-sm leading-6 text-gray-600">
        Enter either the complete Explorer Number
        or just the last 1 to 4 digits.
      </p>

      <input
        type="text"
        value={value}
        onChange={(event) => {
          const nextValue =
            event.target.value
              .toUpperCase()
              .replace(/\s/g, "");

          onChange(nextValue);
          scheduleSearch(nextValue);
        }}
        onKeyDown={handleKeyDown}
        inputMode="text"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        disabled={searching}
        placeholder="Example: 25 or EXP-2026-0025"
        className="w-full rounded-xl border border-gray-300 px-4 py-4 text-lg font-semibold uppercase outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
      />

      <p className="mt-2 text-xs text-gray-500">
        Examples: 5, 25, 105, 1000 or
        EXP-2026-0025
      </p>

      {searching && (
        <div className="mt-4 rounded-xl bg-green-50 p-3">
          <p className="text-sm font-semibold text-green-700">
            Searching registration...
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => onSearch(value)}
        disabled={
          searching ||
          !value.trim()
        }
        className="mt-5 w-full rounded-full bg-green-700 px-6 py-3 font-black text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {searching
          ? "Searching..."
          : "Search Explorer"}
      </button>
    </div>
  );
}