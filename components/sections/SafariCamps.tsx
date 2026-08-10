"use client";

import Image from "next/image";
import { useState } from "react";

type Camp = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  details: string;
  preview: string;
  color: string;
};

const camps: Camp[] = [
  {
    id: "jungle-jump",
    emoji: "🦁",
    title: "Jungle Jump Camp",
    description:
      "Bounce, climb, slide and conquer exciting inflatable jungle adventures.",
    details:
      "Get ready for big jumps, bouncy slides, and safari-style inflatable fun designed for every explorer.",
    preview: "/images/camps/jungle-jump-camp.jpg",
    color: "from-green-600 to-green-800",
  },
  {
    id: "crafty-critters",
    emoji: "🎨",
    title: "Crafty Critters Camp",
    description:
      "Create colorful safari masks, animal crafts and creative masterpieces.",
    details:
      "Paint, decorate, and bring safari critters to life with creative crafts made for little artists.",
    preview: "/images/camps/crafty-critters-camp.jpg",
    color: "from-orange-500 to-yellow-600",
  },
  {
    id: "discovery",
    emoji: "🔍",
    title: "Explorer's Discovery Camp",
    description:
      "Solve wildlife puzzles, discover hidden clues and become a true explorer.",
    details:
      "Explore science, puzzles, and adventure challenges that spark curiosity and hands-on learning.",
    preview: "/images/camps/explorers-discovery-camp.jpg",
    color: "from-blue-600 to-cyan-700",
  },
  {
    id: "photobooth",
    emoji: "📸",
    title: "Wildlife Photobooth",
    description:
      "Capture unforgettable safari memories with exciting jungle backdrops.",
    details:
      "Strike a pose in safari-themed photo booths and take home a magical memory from the festival.",
    preview: "/images/camps/wildlife-photobooth-camp.jpg",
    color: "from-amber-600 to-orange-700",
  },
];

export default function SafariCamps() {
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);

  return (
    <section
      id="camps"
      className="py-28 bg-gradient-to-b from-yellow-50 via-green-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="uppercase tracking-[5px] text-green-700 font-bold">
            Safari Adventure
          </span>

          <h2 className="mt-4 text-5xl font-extrabold text-green-900">
            Explore Our Safari Camps
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
            Every young explorer will embark on four exciting adventures,
            collect passport stamps, and enjoy a day full of fun and discovery.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10 mt-20">
          {camps.map((camp) => (
            <div
              key={camp.id}
              className="group overflow-hidden rounded-3xl shadow-2xl bg-white hover:-translate-y-3 transition duration-500"
            >
              <div className={`bg-gradient-to-r ${camp.color} p-10 text-white`}>
                <div className="text-6xl">{camp.emoji}</div>
                <h3 className="mt-5 text-3xl font-bold">{camp.title}</h3>
                <p className="mt-4 leading-8 opacity-90">{camp.description}</p>
              </div>

              <div className="p-8">
                <button
                  type="button"
                  onClick={() => setSelectedCamp(camp)}
                  className="rounded-full bg-yellow-400 hover:bg-yellow-300 px-8 py-4 font-bold transition"
                >
                  Explore Camp →
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedCamp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl">
              <button
                type="button"
                onClick={() => setSelectedCamp(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-3 text-slate-700 shadow hover:bg-white"
              >
                ✕
              </button>
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-[16/9]">
                <Image
                  src={selectedCamp.preview}
                  alt={selectedCamp.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white drop-shadow-lg">
                  <span className="text-4xl">{selectedCamp.emoji}</span>
                  <h3 className="mt-1 text-2xl font-extrabold sm:text-3xl">{selectedCamp.title}</h3>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-lg leading-8 text-slate-700">{selectedCamp.details}</p>
                <button
                  type="button"
                  onClick={() => setSelectedCamp(null)}
                  className="mt-6 rounded-full bg-green-700 px-6 py-3 text-white font-semibold shadow hover:bg-green-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
