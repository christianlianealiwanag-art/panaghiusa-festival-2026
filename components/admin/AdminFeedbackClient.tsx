"use client";

import { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa6";

type Feedback = {
  id: number;
  rating: number;
  message: string | null;
  parent_name: string | null;
  contact_number: string | null;
  created_at: string;
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={star <= rating ? "text-yellow-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

export default function AdminFeedbackClient() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minRating, setMinRating] = useState(0);

  async function fetchFeedback() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/feedback");
      const json = await res.json();

      if (!res.ok) {
        setError(json?.error || "Failed to load feedback.");
        setFeedback([]);
        return;
      }

      setFeedback(json.feedback as Feedback[]);
    } catch (err) {
      console.error("fetch feedback error", err);
      setError("Failed to load feedback.");
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchFeedback();
  }, []);

  const filtered = feedback.filter((f) => f.rating >= minRating);

  const averageRating = useMemo(() => {
    if (feedback.length === 0) return 0;
    const total = feedback.reduce((sum, f) => sum + f.rating, 0);
    return total / feedback.length;
  }, [feedback]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-green-50 p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-green-600">
            Total Feedback
          </p>
          <p className="mt-2 text-3xl font-black text-green-900">
            {feedback.length}
          </p>
        </div>

        <div className="rounded-2xl bg-yellow-50 p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-600">
            Average Rating
          </p>
          <p className="mt-2 text-3xl font-black text-yellow-600">
            {averageRating ? averageRating.toFixed(1) : "—"}
          </p>
        </div>

        <div className="col-span-2 rounded-2xl bg-gray-50 p-5 sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Filter by minimum rating
          </p>
          <div className="mt-2 flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setMinRating(star)}
                className={`rounded-full px-3 py-1 text-sm font-bold transition ${
                  minRating === star
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {star === 0 ? "All" : `${star}+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading feedback...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No feedback yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((f) => (
              <div
                key={f.id}
                className="rounded-2xl border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <StarRow rating={f.rating} />
                    <p className="mt-2 font-semibold text-gray-800">
                      {f.parent_name || "Anonymous"}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-xs text-gray-400">
                    {new Date(f.created_at).toLocaleString()}
                  </p>
                </div>

                {f.message && (
                  <p className="mt-3 leading-6 text-gray-700">{f.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
