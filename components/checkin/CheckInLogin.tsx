"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckInLogin() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!password.trim()) {
      setErrorMessage(
        "Please enter the Check-In Access Code."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result?.message ||
            "Incorrect Check-In Access Code."
        );
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Check-in login error:", error);

      setErrorMessage(
        "Unable to verify the Check-In Access Code."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-900 via-green-700 to-yellow-500 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl md:p-10">

        <div className="text-6xl">
          🦁
        </div>

        <h1 className="mt-4 text-3xl font-black text-green-900">
          Check-In Access
        </h1>

        <p className="mt-3 text-gray-600">
          Panaghiusa Children&apos;s Festival 2026
        </p>

        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="font-bold text-green-900">
            🔒 Authorized Event Personnel Only
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Please enter the Check-In Access Code provided
            by the organizing committee.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-7"
        >
          <label
            htmlFor="checkin-password"
            className="mb-2 block text-left font-bold text-gray-700"
          >
            Check-In Access Code
          </label>

          <input
            id="checkin-password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrorMessage("");
            }}
            placeholder="Enter access code"
            autoComplete="current-password"
            className="w-full rounded-xl border border-gray-300 p-4 text-lg outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />

          {errorMessage && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-green-700 px-7 py-4 text-lg font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Verifying..."
              : "🔒 Enter Check-In System"}
          </button>
        </form>

        <p className="mt-6 text-xs leading-5 text-gray-500">
          Access to the check-in system is restricted to
          authorized Children&apos;s Festival personnel.
        </p>

      </section>
    </main>
  );
}