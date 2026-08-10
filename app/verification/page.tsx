"use client";

import { useState } from "react";

import QRScanner from "@/components/checkin/QRScanner";
import ManualSearch from "@/components/checkin/ManualSearch";
import RegistrationCard from "@/components/checkin/RegistrationCard";

import { supabase } from "@/lib/supabase";
import type { Registration } from "@/lib/qr";

export default function VerificationPage() {
  const [searchValue, setSearchValue] =
    useState("");

  const [registration, setRegistration] =
    useState<Registration | null>(null);

  const [statusMessage, setStatusMessage] =
    useState(
      "Scan a QR Code or enter an Explorer Number."
    );

  const [errorMessage, setErrorMessage] =
    useState("");

  const [searching, setSearching] =
    useState(false);

  const [checkingIn, setCheckingIn] =
    useState(false);

  /* ======================================================
     NORMALIZE EXPLORER NUMBER
  ====================================================== */

  function normalizeExplorerNumber(
    rawValue: string
  ) {
    let value = rawValue
      .trim()
      .toUpperCase();

    /*
      If QR contains a URL such as:

      http://localhost:3000/verification?id=EXP-2026-0001

      extract the id.
    */

    try {
      if (
        value.startsWith("HTTP://") ||
        value.startsWith("HTTPS://")
      ) {
        const url = new URL(value);

        const id =
          url.searchParams.get("id");

        if (id) {
          value = id
            .trim()
            .toUpperCase();
        }
      }
    } catch {
      // Ignore URL parsing errors.
    }

    /*
      User may manually type:
      5
      25
      105
      1000

      Convert to:
      EXP-2026-0005
      EXP-2026-0025
      EXP-2026-0105
      EXP-2026-1000
    */

    if (/^\d{1,4}$/.test(value)) {
      return `EXP-2026-${value.padStart(
        4,
        "0"
      )}`;
    }

    return value;
  }

  /* ======================================================
     FIND REGISTRATION
  ====================================================== */

  async function findRegistration(
    rawValue: string
  ) {
    if (searching) {
      return;
    }

    const explorerNumber =
      normalizeExplorerNumber(rawValue);

    if (!explorerNumber) {
      setErrorMessage(
        "Please enter or scan an Explorer Number."
      );

      return;
    }

    if (
      !/^EXP-2026-\d{4}$/.test(
        explorerNumber
      )
    ) {
      setErrorMessage(
        "Invalid Explorer Number. Example: EXP-2026-0001."
      );

      setStatusMessage(
        "Please check the Explorer Number."
      );

      return;
    }

    setSearching(true);
    setErrorMessage("");
    setRegistration(null);

    setStatusMessage(
      `Searching for ${explorerNumber}...`
    );

    try {
      const { data, error } =
        await supabase.rpc(
          "get_registration_for_checkin",
          {
            p_explorer_no:
              explorerNumber,
          }
        );

      if (error) {
        console.error(
          "Verification search error:",
          error
        );

        setErrorMessage(
          error.message ||
            "Unable to search the registration."
        );

        setStatusMessage(
          "Registration verification failed."
        );

        return;
      }

      const matchedRegistration =
        Array.isArray(data) && data.length > 0
          ? (data[0] as Registration)
          : null;

      if (!matchedRegistration) {
        setErrorMessage(
          `No registration was found for ${explorerNumber}.`
        );

        setStatusMessage(
          "Explorer Number not found."
        );

        return;
      }

      setRegistration(
        matchedRegistration
      );

      setSearchValue(
        matchedRegistration.explorer_no
      );

      if (matchedRegistration.checked_in) {
        setStatusMessage(
          "This explorer has already checked in."
        );
      } else {
        setStatusMessage(
          "Registration verified! You may now check in this explorer."
        );
      }
    } catch (error) {
      console.error(
        "Unexpected verification error:",
        error
      );

      setErrorMessage(
        "Something went wrong while verifying the registration."
      );

      setStatusMessage(
        "Unable to verify registration."
      );
    } finally {
      setSearching(false);
    }
  }

  /* ======================================================
     CHECK IN
  ====================================================== */

  async function handleCheckIn() {
    if (
      !registration ||
      checkingIn ||
      registration.checked_in
    ) {
      return;
    }

    setCheckingIn(true);
    setErrorMessage("");

    try {
      const { data, error } =
        await supabase.rpc(
          "check_in_registration",
          {
            p_explorer_no:
              registration.explorer_no,
          }
        );

      if (error) {
        console.error(
          "Check-in error:",
          error
        );

        setErrorMessage(
          error.message ||
            "Unable to check in this explorer."
        );

        return;
      }

      const updatedRegistration =
        data && typeof data === "object"
          ? (Array.isArray(data)
              ? data[0]
              : data) as Registration
          : null;

      if (!updatedRegistration) {
        setErrorMessage(
          "The registration could not be updated."
        );

        setStatusMessage(
          "Check-in was not completed."
        );

        return;
      }

      setRegistration(
        updatedRegistration
      );

      setStatusMessage(
        "✅ Explorer successfully checked in!"
      );
    } catch (error) {
      console.error(
        "Unexpected check-in error:",
        error
      );

      setErrorMessage(
        "Something went wrong during check-in."
      );
    } finally {
      setCheckingIn(false);
    }
  }

  /* ======================================================
     SCAN ANOTHER
  ====================================================== */

  function handleScanAnother() {
    setRegistration(null);

    setSearchValue("");

    setErrorMessage("");

    setStatusMessage(
      "Scan a QR Code or enter an Explorer Number."
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* ======================================================
     PAGE
  ====================================================== */

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-yellow-400 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-7 rounded-3xl bg-white p-6 text-center shadow-2xl md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-600">
            Claver Children&apos;s Festival
            2026
          </p>

          <h1 className="mt-2 text-3xl font-black text-green-900 md:text-5xl">
            🦁 Safari Ranger Check-In
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Scan the explorer&apos;s QR Code
            or enter the Explorer Number for
            quick registration verification
            and event check-in.
          </p>
        </div>

        {/* VERIFICATION TOOLS */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* QR SCANNER */}

          <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
            <QRScanner
              onScan={findRegistration}
              disabled={
                searching ||
                checkingIn
              }
            />
          </div>

          {/* MANUAL SEARCH */}

          <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
            <ManualSearch
              value={searchValue}
              onChange={
                setSearchValue
              }
              onSearch={
                findRegistration
              }
              searching={
                searching
              }
            />
          </div>
        </div>

        {/* RESULT */}

        <div className="mt-6">
          <RegistrationCard
            registration={
              registration
            }
            statusMessage={
              statusMessage
            }
            errorMessage={
              errorMessage
            }
            checkingIn={
              checkingIn
            }
            onCheckIn={
              handleCheckIn
            }
            onScanAnother={
              handleScanAnother
            }
          />
        </div>

        {/* FOOTER NOTE */}

        <div className="mt-6 rounded-2xl bg-green-950/80 p-4 text-center text-sm text-white">
          Safari Ranger Station •
          Claver Children&apos;s Festival
          2026
        </div>
      </div>
    </main>
  );
}