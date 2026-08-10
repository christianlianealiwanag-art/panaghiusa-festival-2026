"use client";

import Image from "next/image";

export default function HeroContent() {
  return (
    <div className="space-y-8">

      {/* Official Logos */}
      <div className="flex items-center gap-5">

        <Image
          src="/images/logos/municipality-logo.png"
          alt="Municipality of Claver"
          width={75}
          height={75}
          priority
        />

        <Image
          src="/images/logos/panaghiusa-logo.png"
          alt="Panaghiusa Festival"
          width={75}
          height={75}
          priority
        />

      </div>

      {/* Event Badge */}

      <div className="inline-flex items-center rounded-full bg-yellow-400 px-5 py-2 font-bold text-green-900 shadow-lg">

        🌿 September 5, 2026 • Claver Sports Complex

      </div>

      {/* Main Title */}

      <div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">

          CHILDRENS FESTIVAL:

          <br />

          <span className="text-yellow-300">
            SAFARI ADVENTURE
          </span>

        </h1>

      </div>

      {/* Tagline */}

      <p className="text-2xl md:text-3xl font-semibold text-yellow-100">

        Where Every Child Becomes a Safari Explorer!

      </p>

      {/* Description */}

      <p className="max-w-2xl text-lg leading-8 text-green-50">

        Join the Municipality of Claver for an unforgettable safari
        adventure filled with games, creativity, learning, exciting
        performances, delicious treats, and unforgettable memories
        for every child.

      </p>

    </div>
  );
}