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
  { src: "/images/sponsors/eatzone.jpg", alt: "Eatzone" },
];

export default function Sponsors() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">

        {/* SECTION TITLE */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black text-green-800">
            Our Valued Sponsors
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Thank you for making the Panaghiusa Festival 2026
            Children&apos;s Safari Festival possible.
          </p>
        </div>

        {/* SPONSOR LOGOS + INDIVIDUAL SPONSOR */}
        <div className="grid grid-cols-2 items-center gap-10 md:grid-cols-3 lg:grid-cols-4">

          {sponsors.map((sponsor) => (
            <div
              key={sponsor.src}
              className="flex min-h-[130px] items-center justify-center"
            >
              <Image
                src={sponsor.src}
                alt={sponsor.alt}
                width={180}
                height={100}
                className="max-h-[100px] w-auto object-contain transition duration-300 hover:scale-110"
              />
            </div>
          ))}

          {/* INDIVIDUAL SPONSOR */}
          <div className="flex min-h-[130px] items-center justify-center">
            <div className="flex min-h-[110px] w-full max-w-[230px] flex-col items-center justify-center rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-center shadow-sm transition duration-300 hover:scale-105">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700">
                Festival Partner
              </p>

              <p className="mt-2 text-lg font-black leading-tight text-green-800">
                KARISHMA
                <br />
                GOKIANGKEE-GOCOTANO
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}