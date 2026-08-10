"use client";

import Image from "next/image";

const sponsors = [
  { src: "/images/sponsors/thpal.png", alt: "THPAL" },
  { src: "/images/sponsors/nac.png", alt: "NAC" },
  { src: "/images/sponsors/tmc.png", alt: "TMC" },
  { src: "/images/sponsors/pgmc.png", alt: "PGMC" },
  { src: "/images/sponsors/bugar.jpg", alt: "BUGAR" },
  { src: "/images/sponsors/vicegeed.jpg", alt: "Vicegeed" },
  { src: "/images/sponsors/virginia.png", alt: "Virginia" },
];

export default function Sponsors() {
  return (
    <section
      id="sponsors"
      className="bg-white py-20"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">

          <h2 className="text-4xl font-black text-green-800">
            Our Valued Sponsors
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Thank you for making the Panaghiusa Festival 2026
            Children's Safari Festival possible.
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center">
          {sponsors.map((sponsor) => (
            <div key={sponsor.src} className="flex justify-center">
              <Image
                src={sponsor.src}
                alt={sponsor.alt}
                width={180}
                height={100}
                className="object-contain hover:scale-110 transition duration-300"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}