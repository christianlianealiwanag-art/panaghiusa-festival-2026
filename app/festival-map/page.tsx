"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTimes,
  FaUsers,
} from "react-icons/fa";

type FestivalZone = {
  id: string;
  name: string;
  icon: string;
  description: string;
  location: string;
  activities: string[];
};

const festivalZones: FestivalZone[] = [
  {
    id: "showgrounds",
    name: "Safari Showgrounds",
    icon: "🎪",
    description:
      "The main entertainment stage of the Children’s Festival.",
    location: "Upper center of the Children’s Festival Area",
    activities: [
      "Magic Show",
      "Bubble Show",
      "Musical Performances",
      "Interactive Games",
      "Festival Announcements",
    ],
  },
  {
    id: "discovery",
    name: "Explorer’s Discovery Camp",
    icon: "🔍",
    description:
      "A fun learning area where young explorers can discover, play, and learn.",
    location: "Upper-left activity zone",
    activities: [
      "Learning Games",
      "Educational Activities",
      "Puzzles and Challenges",
      "Interactive Discovery Activities",
    ],
  },
  {
    id: "crafty",
    name: "Crafty Critters Camp",
    icon: "🎨",
    description:
      "A colorful arts-and-crafts station designed for creative young explorers.",
    location: "Upper-right activity zone",
    activities: [
      "Coloring Activities",
      "Arts and Crafts",
      "Creative Projects",
      "Safari-themed Art",
    ],
  },
  {
    id: "photobooth",
    name: "Wildlife Photobooth Camp",
    icon: "📸",
    description:
      "A safari-themed photo area where families can capture memorable moments.",
    location: "Lower-left activity zone",
    activities: [
      "Safari Photo Backdrops",
      "Animal Props",
      "Family Photos",
      "Souvenir Pictures",
    ],
  },
  {
    id: "jungle-jump",
    name: "Jungle Jump Camp",
    icon: "🏰",
    description:
      "An inflatable playground where children can jump, play, and enjoy.",
    location: "Lower-right activity zone",
    activities: [
      "Inflatable Playground",
      "Slides",
      "Bouncing Activities",
      "Supervised Free Play",
    ],
  },
  {
    id: "snack-shack",
    name: "Safari Snack Shack",
    icon: "🍿",
    description:
      "The festival’s food and refreshment station for children and guardians.",
    location: "Below Safari Village",
    activities: [
      "Snacks",
      "Drinks",
      "Water Station",
      "Sponsored Food Items",
    ],
  },
  {
    id: "safari-village",
    name: "Safari Village",
    icon: "🦁",
    description:
      "The central gathering area connecting the festival’s different activity zones.",
    location: "Center of the Children’s Festival Area",
    activities: [
      "Central Meeting Area",
      "Direction Point",
      "Activity Access",
      "Festival Assistance",
    ],
  },
  {
    id: "art-wall",
    name: "Giant Safari Art Wall",
    icon: "🖼️",
    description:
      "A large collaborative art wall where children can leave their creative mark.",
    location: "Between the festival entrance and Agri-Trade Fair Booths",
    activities: [
      "Community Artwork",
      "Safari Drawing",
      "Coloring",
      "Photo Opportunity",
    ],
  },
  {
    id: "ranger-station",
    name: "Safari Ranger Stations",
    icon: "🧭",
    description:
      "Festival assistance points where visitors may ask for directions and support.",
    location: "Near the entrance area",
    activities: [
      "Visitor Assistance",
      "Directions",
      "Lost-and-Found Assistance",
      "Festival Information",
    ],
  },
];

export default function FestivalMapPage() {
  const [selectedZone, setSelectedZone] =
    useState<FestivalZone | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-green-600">
      <header className="border-b border-white/10 bg-green-950/90 px-4 py-4 text-white backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/20"
          >
            <FaArrowLeft />
            Home
          </Link>

          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-300">
              Panaghiusa Festival 2026
            </p>

            <h1 className="text-xl font-black md:text-2xl">
              Children&apos;s Festival Map
            </h1>
          </div>
        </div>
      </header>

      <section className="px-4 py-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center text-white">
            <p className="text-5xl">🗺️</p>

            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Explore the Safari Adventure
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-green-100">
              Familiarize yourself with the activity zones,
              facilities, entrance, exit, and festival assistance
              stations before your adventure begins.
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/95 p-5 text-center shadow-xl">
              <FaCalendarAlt className="mx-auto text-3xl text-green-700" />

              <p className="mt-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                Date
              </p>

              <p className="mt-1 font-black text-green-900">
                September 5, 2026
              </p>

              <p className="text-sm text-gray-600">
                Saturday
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-5 text-center shadow-xl">
              <FaMapMarkerAlt className="mx-auto text-3xl text-red-600" />

              <p className="mt-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                Venue
              </p>

              <p className="mt-1 font-black text-green-900">
                Claver Sports Complex
              </p>

              <p className="text-sm text-gray-600">
                Claver, Surigao del Norte
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-5 text-center shadow-xl">
              <FaUsers className="mx-auto text-3xl text-orange-600" />

              <p className="mt-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                Expected Participants
              </p>

              <p className="mt-1 font-black text-green-900">
                Approximately 1,000 Children
              </p>

              <p className="text-sm text-gray-600">
                Plus parents and guardians
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border-4 border-yellow-300 bg-white shadow-2xl">
            <div className="relative aspect-[16/10] w-full bg-green-100">
              <Image
                src="/images/festival-map.png"
                alt="Panaghiusa Festival 2026 Children's Festival Map"
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-green-100">
            Tap any activity below to view its description and
            location.
          </p>

          <section className="mt-10">
            <div className="mb-5 text-center text-white">
              <h3 className="text-2xl font-black md:text-3xl">
                Festival Zones
              </h3>

              <p className="mt-2 text-green-100">
                Choose an area to learn more.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {festivalZones.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  className="group rounded-2xl bg-white p-5 text-left shadow-xl transition hover:-translate-y-1 hover:bg-yellow-50 hover:shadow-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-3xl transition group-hover:bg-yellow-200">
                      {zone.icon}
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-green-900">
                        {zone.name}
                      </h4>

                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {zone.description}
                      </p>

                      <p className="mt-3 text-sm font-bold text-green-700">
                        View details →
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h3 className="text-xl font-black text-green-900">
                🚻 Facilities
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-2xl">🚻</p>
                  <p className="mt-2 font-bold">Toilets</p>
                </div>

                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-2xl">➕</p>
                  <p className="mt-2 font-bold">
                    First Aid Stations
                  </p>
                </div>

                <div className="rounded-xl bg-cyan-50 p-4">
                  <p className="text-2xl">💧</p>
                  <p className="mt-2 font-bold">
                    Drinking Water
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-2xl">🧭</p>
                  <p className="mt-2 font-bold">
                    Ranger Stations
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-yellow-300 p-6 shadow-xl">
              <h3 className="text-xl font-black text-green-950">
                🦁 Visitor Reminder
              </h3>

              <p className="mt-4 leading-7 text-green-950">
                Children must remain under the supervision of a
                parent, guardian, or responsible adult while inside
                the festival grounds. Please observe the designated
                entrance, exit, activity areas, and safety stations.
              </p>

              <Link
                href="/register"
                className="mt-6 inline-flex rounded-full bg-green-800 px-6 py-3 font-black text-white transition hover:bg-green-900"
              >
                Register an Explorer
              </Link>
            </div>
          </section>
        </div>
      </section>

      {selectedZone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedZone(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="zone-title"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="relative bg-gradient-to-r from-green-800 to-green-600 p-6 text-white">
              <button
                type="button"
                onClick={() => setSelectedZone(null)}
                aria-label="Close activity details"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
              >
                <FaTimes />
              </button>

              <div className="text-5xl">
                {selectedZone.icon}
              </div>

              <h2
                id="zone-title"
                className="mt-3 pr-10 text-2xl font-black"
              >
                {selectedZone.name}
              </h2>
            </div>

            <div className="p-6">
              <p className="leading-7 text-gray-700">
                {selectedZone.description}
              </p>

              <div className="mt-6 rounded-2xl bg-green-50 p-4">
                <p className="text-sm font-bold uppercase tracking-wide text-green-700">
                  Location
                </p>

                <p className="mt-1 font-semibold text-green-950">
                  {selectedZone.location}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-black text-green-900">
                  Activities and Features
                </h3>

                <ul className="mt-3 space-y-3">
                  {selectedZone.activities.map((activity) => (
                    <li
                      key={activity}
                      className="flex items-start gap-3 rounded-xl bg-gray-50 p-3"
                    >
                      <span className="mt-0.5 text-green-600">
                        ✓
                      </span>

                      <span className="text-gray-700">
                        {activity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setSelectedZone(null)}
                className="mt-7 w-full rounded-full bg-green-700 px-6 py-3 font-black text-white transition hover:bg-green-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}