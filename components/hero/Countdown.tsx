"use client";

import { useEffect, useState } from "react";
import { FaTree } from "react-icons/fa";

export default function Countdown() {
  const targetDate = new Date("September 5, 2026 13:00:00").getTime();

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    setMounted(true);

    const updateCountdown = () => {
      setTimeLeft(targetDate - Date.now());
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) return null;

  const days = Math.max(Math.floor(timeLeft / (1000 * 60 * 60 * 24)), 0);

  const hours = Math.max(
    Math.floor((timeLeft / (1000 * 60 * 60)) % 24),
    0
  );

  const minutes = Math.max(
    Math.floor((timeLeft / (1000 * 60)) % 60),
    0
  );

  const seconds = Math.max(
    Math.floor((timeLeft / 1000) % 60),
    0
  );

  const cards = [
    { label: "DAYS", value: days },
    { label: "HOURS", value: hours },
    { label: "MINUTES", value: minutes },
    { label: "SECONDS", value: seconds },
  ];

  return (
    <section
      id="countdown"
      className="bg-gradient-to-b from-yellow-50 to-green-100 py-24"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <FaTree
            className="mx-auto text-green-700 mb-3"
            size={45}
          />

          <h2 className="text-5xl font-bold text-green-800">
            Safari Countdown
          </h2>

          <p className="mt-4 text-xl text-gray-700">
            Until the Adventure Begins
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">

          {cards.map((item) => (
            <div
              key={item.label}
              className="bg-amber-700 text-white rounded-3xl shadow-2xl border-4 border-yellow-700 p-8 text-center"
            >
              <div className="text-6xl font-extrabold">
                {item.value}
              </div>

              <div className="mt-3 tracking-widest text-yellow-200 font-bold">
                {item.label}
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}