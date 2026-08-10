"use client";

import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo,
  FaUserCheck,
} from "react-icons/fa";

import {
  formatArrivalTime,
  type Registration,
} from "@/lib/qr";

type RegistrationCardProps = {
  registration: Registration | null;
  statusMessage: string;
  errorMessage: string;
  checkingIn: boolean;
  onCheckIn: () => void;
  onScanAnother: () => void;
};

export default function RegistrationCard({
  registration,
  statusMessage,
  errorMessage,
  checkingIn,
  onCheckIn,
  onScanAnother,
}: RegistrationCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-600">
          Registration Result
        </p>

        <h2 className="mt-1 text-2xl font-black text-green-900">
          Explorer Verification
        </h2>
      </div>

      {statusMessage && (
        <div className="mt-5 rounded-2xl bg-green-50 p-4 text-green-900">
          <p className="font-semibold">
            {statusMessage}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <FaExclamationTriangle className="mt-1 shrink-0" />

          <p>{errorMessage}</p>
        </div>
      )}

      {!registration && (
        <div className="mt-8 py-10 text-center text-gray-500">
          <FaUserCheck className="mx-auto text-6xl text-gray-300" />

          <p className="mt-4">
            Scan a QR Code or type the Explorer
            Number to verify the registration.
          </p>
        </div>
      )}

      {registration && (
        <div className="mt-7">
          <div
            className={`rounded-2xl border-2 p-6 ${
              registration.checked_in
                ? "border-yellow-400 bg-yellow-50"
                : "border-green-500 bg-green-50"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  Explorer Number
                </p>

                <h3 className="mt-1 break-words text-2xl font-black text-green-900">
                  {registration.explorer_no}
                </h3>
              </div>

              {registration.checked_in ? (
                <span className="w-fit rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-yellow-950">
                  ARRIVED
                </span>
              ) : (
                <span className="w-fit rounded-full bg-green-700 px-4 py-2 text-sm font-black text-white">
                  VERIFIED
                </span>
              )}
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4">
                <dt className="text-sm text-gray-500">
                  Child
                </dt>

                <dd className="mt-1 font-bold text-gray-900">
                  {registration.child_name}
                </dd>
              </div>

              <div className="rounded-xl bg-white p-4">
                <dt className="text-sm text-gray-500">
                  Age / Sex
                </dt>

                <dd className="mt-1 font-bold text-gray-900">
                  {registration.age ?? "—"} /{" "}
                  {registration.sex ?? "—"}
                </dd>
              </div>

              <div className="rounded-xl bg-white p-4">
                <dt className="text-sm text-gray-500">
                  Parent / Guardian
                </dt>

                <dd className="mt-1 font-bold text-gray-900">
                  {registration.parent_name ?? "—"}
                </dd>
              </div>

              <div className="rounded-xl bg-white p-4">
                <dt className="text-sm text-gray-500">
                  Contact Number
                </dt>

                <dd className="mt-1 font-bold text-gray-900">
                  {registration.contact_number ?? "—"}
                </dd>
              </div>
            </dl>

            {registration.checked_in && (
              <div className="mt-6 rounded-xl bg-white p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <FaCheckCircle />

                  <p className="font-black">
                    Successfully Checked In
                  </p>
                </div>

                <p className="mt-3">
                  <strong>Arrival:</strong>{" "}
                  {formatArrivalTime(
                    registration.arrival_time
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {!registration.checked_in && (
              <button
                type="button"
                onClick={onCheckIn}
                disabled={checkingIn}
                className="flex flex-1 items-center justify-center gap-3 rounded-full bg-green-700 px-7 py-4 text-lg font-black text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <FaCheckCircle />

                {checkingIn
                  ? "Checking In..."
                  : "CHECK IN"}
              </button>
            )}

            <button
              type="button"
              onClick={onScanAnother}
              disabled={checkingIn}
              className="flex flex-1 items-center justify-center gap-3 rounded-full bg-yellow-400 px-7 py-4 font-black text-green-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <FaRedo />
              Scan Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}