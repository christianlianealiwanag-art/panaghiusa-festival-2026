"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaCommentDots, FaStar, FaXmark } from "react-icons/fa6";

import { supabase } from "@/lib/supabase";

export default function FeedbackButton() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [parentName, setParentName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Don't show the public feedback widget on admin pages.
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  function resetForm() {
    setRating(0);
    setHoverRating(0);
    setMessage("");
    setParentName("");
    setSubmitError("");
    setSubmitted(false);
  }

  function closeModal() {
    setIsOpen(false);
    // Give the close animation a moment before resetting the form.
    setTimeout(resetForm, 300);
  }

  async function submitFeedback() {
    if (rating < 1) {
      setSubmitError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const { error } = await supabase.from("feedback").insert({
      rating,
      message: message.trim() || null,
      parent_name: parentName.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      console.error("feedback submit error", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      if (error.code === "PGRST205" || error.code === "42P01") {
        setSubmitError(
          "Feedback isn't set up yet. Please ask an admin to run the feedback database migration."
        );
      } else {
        setSubmitError(
          "Something went wrong sending your feedback. Please try again."
        );
      }

      return;
    }

    setSubmitted(true);
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-green-700 px-5 py-4 font-bold text-white shadow-2xl transition hover:bg-green-800 hover:scale-105"
        aria-label="Give feedback"
      >
        <FaCommentDots className="text-xl" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-green-900">
                  {submitted ? "Thank you!" : "Share Your Feedback"}
                </h3>

                {!submitted && (
                  <p className="mt-1 text-sm text-gray-500">
                    Here&apos;s to making the Children&apos;s Festival even better!
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close feedback form"
              >
                <FaXmark />
              </button>
            </div>

            {submitted ? (
              <div className="mt-6 text-center">
                <p className="text-5xl">🦁🎉</p>
                <p className="mt-4 text-gray-700">
                  We really appreciate you taking the time to rate us.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-6 w-full rounded-full bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-800"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mt-6 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-4xl transition"
                      aria-label={`Rate ${star} out of 5 stars`}
                    >
                      <FaStar
                        className={
                          (hoverRating || rating) >= star
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <label className="text-sm font-semibold text-gray-700">
                    Your Name (optional)
                  </label>

                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-green-600 focus:outline-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-sm font-semibold text-gray-700">
                    Comments (optional)
                  </label>

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Tell us what you loved or what we can improve..."
                    className="mt-1 w-full resize-none rounded-xl border border-gray-300 px-4 py-2 focus:border-green-600 focus:outline-none"
                  />
                </div>

                {submitError && (
                  <p className="mt-3 text-sm text-red-600">{submitError}</p>
                )}

                <button
                  type="button"
                  onClick={() => void submitFeedback()}
                  disabled={submitting}
                  className="mt-6 w-full rounded-full bg-yellow-400 px-6 py-3 font-black text-green-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {submitting ? "Sending..." : "Send Feedback"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
