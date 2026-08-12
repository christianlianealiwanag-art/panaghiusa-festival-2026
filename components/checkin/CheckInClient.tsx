"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import ManualSearch from "@/components/checkin/ManualSearch";
import QRScanner from "@/components/checkin/QRScanner";
import RegistrationCard from "@/components/checkin/RegistrationCard";

import { supabase } from "@/lib/supabase";

import {
  extractExplorerNumber,
  normalizeManualExplorerNumber,
  type CheckInResult,
  type Registration,
} from "@/lib/qr";

export default function CheckInClient() {
  const searchingRef = useRef(false);
  const lastSearchRef = useRef("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const [manualExplorerNo, setManualExplorerNo] =
    useState("");

  const [registration, setRegistration] =
    useState<Registration | null>(null);

  const [searching, setSearching] =
    useState(false);

  const [checkingIn, setCheckingIn] =
    useState(false);

  const [scannerResetKey, setScannerResetKey] =
    useState(0);

  const [statusMessage, setStatusMessage] =
    useState(
      "Start the camera, upload a QR image, or search an Explorer Number."
    );

  const [errorMessage, setErrorMessage] =
    useState("");

  const lookupExplorer = useCallback(
    async (explorerNo: string) => {
      const normalizedExplorerNo =
        extractExplorerNumber(explorerNo);

      if (!normalizedExplorerNo) {
        setRegistration(null);

        setErrorMessage(
          "The QR Code or Explorer Number is invalid."
        );

        setStatusMessage(
          "Invalid Explorer Number."
        );

        return;
      }

      if (searchingRef.current) {
        return;
      }

      if (
        lastSearchRef.current ===
        normalizedExplorerNo
      ) {
        return;
      }

      searchingRef.current = true;
      lastSearchRef.current =
        normalizedExplorerNo;

      setSearching(true);
      setRegistration(null);
      setErrorMessage("");

      setStatusMessage(
        `Searching for ${normalizedExplorerNo}...`
      );

      try {
        const { data, error } =
          await supabase.rpc(
            "get_registration_for_checkin",
            {
              p_explorer_no:
                normalizedExplorerNo,
            }
          );

        if (error) {
          console.error(
            "Registration lookup error:",
            error
          );

          setErrorMessage(error.message);

          setStatusMessage(
            "Unable to verify this registration."
          );

          lastSearchRef.current = "";
          return;
        }

        const result =
          Array.isArray(data) &&
          data.length > 0
            ? (data[0] as Registration)
            : null;

        if (!result) {
          setErrorMessage(
            `No registration was found for ${normalizedExplorerNo}.`
          );

          setStatusMessage(
            "Explorer not found."
          );

          lastSearchRef.current = "";
          return;
        }

        setRegistration(result);
        setManualExplorerNo(
          result.explorer_no
        );

        if (result.checked_in) {
          setStatusMessage(
            "This explorer is already checked in."
          );
        } else {
          setStatusMessage(
            "Registration verified. Press CHECK IN to record arrival."
          );
        }
      } catch (error) {
        console.error(
          "Unexpected lookup error:",
          error
        );

        setErrorMessage(
          "Something went wrong while checking the registration."
        );

        setStatusMessage(
          "Unable to verify this registration."
        );

        lastSearchRef.current = "";
      } finally {
        searchingRef.current = false;
        setSearching(false);
      }
    },
    []
  );

  const handleQRDecoded = useCallback(
    (decodedText: string) => {
      lastSearchRef.current = "";
      void lookupExplorer(decodedText);

      /*
       * On mobile the result card sits below the
       * scanner. Once a QR is decoded the camera
       * stops, which without this can look like
       * nothing happened if the result is off-screen.
       */
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [lookupExplorer]
  );

  const handleManualSearch = useCallback(
    (value: string) => {
      const normalizedExplorerNo =
        normalizeManualExplorerNumber(value);

      if (!normalizedExplorerNo) {
        setRegistration(null);

        setErrorMessage(
          "Enter 1 to 4 digits, such as 5, 25, 105 or 1000."
        );

        setStatusMessage(
          "Invalid Explorer Number."
        );

        return;
      }

      lastSearchRef.current = "";

      void lookupExplorer(
        normalizedExplorerNo
      );
    },
    [lookupExplorer]
  );

  const handleManualValueChange = useCallback(
    (value: string) => {
      setManualExplorerNo(value);
      setErrorMessage("");
      setRegistration(null);

      lastSearchRef.current = "";

      if (!value) {
        setStatusMessage(
          "Start the camera, upload a QR image, or search an Explorer Number."
        );
      }
    },
    []
  );

  async function handleCheckIn() {
    if (!registration || checkingIn) {
      return;
    }

    if (registration.checked_in) {
      setErrorMessage(
        "This explorer has already been checked in."
      );

      return;
    }

    setCheckingIn(true);
    setErrorMessage("");

    setStatusMessage(
      "Recording arrival..."
    );

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

        setErrorMessage(error.message);

        setStatusMessage(
          "Check-in was not completed."
        );

        return;
      }

      const updated =
        Array.isArray(data) &&
        data.length > 0
          ? (data[0] as CheckInResult)
          : null;

      if (!updated) {
        setErrorMessage(
          "No updated registration was returned."
        );

        setStatusMessage(
          "Check-in was not completed."
        );

        return;
      }

      setRegistration((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          checked_in:
            updated.checked_in,
          arrival_time:
            updated.arrival_time,
        };
      });

      setStatusMessage(
        "Explorer successfully checked in!"
      );
    } catch (error) {
      console.error(
        "Unexpected check-in error:",
        error
      );

      setErrorMessage(
        "Something went wrong while recording the arrival."
      );

      setStatusMessage(
        "Check-in was not completed."
      );
    } finally {
      setCheckingIn(false);
    }
  }

  function handleScanAnother() {
    setRegistration(null);
    setManualExplorerNo("");
    setErrorMessage("");

    setStatusMessage(
      "Ready to scan, upload, or search the next Explorer Number."
    );

    searchingRef.current = false;
    lastSearchRef.current = "";

    /*
     * Remounting the scanner creates a completely
     * fresh scanner instance for the next explorer.
     */
    setScannerResetKey(
      (current) => current + 1
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-yellow-500 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center text-white">
          <div className="text-6xl">
            🦁
          </div>

          <h1 className="mt-3 text-3xl font-black md:text-5xl">
            Volunteer QR Check-in
          </h1>

          <p className="mt-3 text-green-50">
            Panaghiusa Children&apos;s
            Festival 2026
          </p>
        </header>

        <section className="grid gap-7 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-2xl md:p-7">
            <QRScanner
              key={scannerResetKey}
              onScan={handleQRDecoded}
              disabled={
                searching || checkingIn
              }
            />

            <ManualSearch
              value={manualExplorerNo}
              onChange={
                handleManualValueChange
              }
              onSearch={
                handleManualSearch
              }
              searching={searching}
            />
          </div>

          <div ref={resultsRef}>
            <RegistrationCard
              registration={registration}
              statusMessage={statusMessage}
              errorMessage={errorMessage}
              checkingIn={checkingIn}
              onCheckIn={() =>
                void handleCheckIn()
              }
              onScanAnother={
                handleScanAnother
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}