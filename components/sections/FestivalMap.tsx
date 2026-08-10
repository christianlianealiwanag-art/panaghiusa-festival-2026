import Link from "next/link";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

export default function FestivalMapPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-yellow-500 px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-green-900 shadow-lg transition hover:-translate-y-1 hover:bg-yellow-300"
        >
          <FaArrowLeft />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mx-auto mt-10 max-w-4xl text-center text-white">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
            Plan Your Safari Adventure
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            Children&apos;s Festival Map
          </h1>

          <p className="mt-5 text-base leading-7 text-green-100 md:text-lg">
            Familiarize yourself with the festival grounds and locate
            the activity camps, showgrounds, snack stations, toilets,
            first-aid stations, entrance, exit, and other facilities.
          </p>
        </div>

        {/* Event information */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl text-green-700">
              <FaCalendarAlt />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Date
              </p>

              <p className="font-black text-green-950">
                September 5, 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-xl text-yellow-700">
              <FaMapMarkerAlt />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Venue
              </p>

              <p className="font-black text-green-950">
                Claver Sports Complex Grounds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-xl text-purple-700">
              <FaClock />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Festival Hours
              </p>

              <p className="font-black text-green-950">
                1:00 PM – 6:30 PM
              </p>
            </div>
          </div>
        </div>

        {/* Full festival map */}
        <section className="mt-8 overflow-hidden rounded-3xl border-4 border-yellow-300 bg-white p-2 shadow-2xl md:p-4">
          <img
            src="/images/festival-map.png"
            alt="Claver Children's Festival 2026 official festival map"
            className="h-auto w-full rounded-2xl object-contain"
          />
        </section>

        {/* Guide */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-2xl md:p-10">
          <h2 className="text-2xl font-black text-green-950 md:text-3xl">
            🗺️ Festival Map Guide
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Follow the designated entrance and exit routes and take
            note of the nearest toilets and first-aid stations.
            Children must remain under the supervision of their
            parents or guardians throughout the event.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-green-50 p-5">
              <p className="font-black text-green-900">
                🎪 Safari Showgrounds
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Main stage for the magic, clown, and musical variety
                shows.
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-5">
              <p className="font-black text-green-900">
                🛝 Activity Camps
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Jungle Jump, Crafty Critters, Explorer&apos;s Discovery,
                and Wildlife Photobooth camps.
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-5">
              <p className="font-black text-green-900">
                🍿 Safari Snack Shack
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Distribution area for available snacks and
                refreshments.
              </p>
            </div>

            <div className="rounded-2xl bg-red-50 p-5">
              <p className="font-black text-green-900">
                ➕ Safety Facilities
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Clearly marked toilets, resting areas, and first-aid
                stations.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}