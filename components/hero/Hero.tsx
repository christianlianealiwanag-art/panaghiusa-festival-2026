"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden text-white min-h-screen flex items-center">

      {/* Background Image */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero/hero-bg.png')",
        }}
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/55"></div>

      {/* Floating Glow */}

      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Main Content */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">

        {/* Logos */}

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          className="flex items-center gap-5 mb-10"
        >
          <Image
            src="/images/logos/municipality-logo.png"
            alt="Municipality of Claver"
            width={90}
            height={90}
          />

          <Image
            src="/images/logos/panaghiusa-logo.png"
            alt="Panaghiusa Festival"
            width={90}
            height={90}
          />

          <Image
            src="/images/logos/claver-logo.png"
            alt="Claver Children's Festival Logo"
            width={90}
            height={90}
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}

          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >

            <span className="bg-yellow-400 text-green-900 px-5 py-2 rounded-full font-bold uppercase tracking-wider shadow-lg">
              September 5, 2026
            </span>

            <h1 className="text-6xl lg:text-7xl font-black leading-tight mt-8 drop-shadow-xl">

              CHILDREN'S

              <br />

              FESTIVAL:

              <br />

              <span className="text-yellow-300">
                SAFARI ADVENTURE
              </span>

            </h1>

            <p className="mt-8 text-xl leading-9 text-gray-100 max-w-2xl">

              Experience Claver's biggest Safari-themed Children's Festival!

              Enjoy exciting adventure camps, performances, mascots,
              safari passport activities, games, prizes, food, and
              unforgettable memories for the whole family.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/register"
                className="bg-yellow-400 hover:bg-yellow-300 text-green-900 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition duration-300"
              >
                🦁 Register My Child
              </Link>

              <a
                href="#about"
                className="border-2 border-white hover:bg-white hover:text-green-900 px-8 py-4 rounded-full font-bold transition"
              >
                Learn More
              </a>

            </div>

          </motion.div>

          {/* RIGHT SIDE */}

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >

            <div className="bg-white/15 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 w-full max-w-lg">

              <h2 className="text-3xl font-black text-center mb-8">

                🌿 Safari Adventure Awaits!

              </h2>

              <div className="grid grid-cols-2 gap-5">

                <div className="bg-white/20 rounded-2xl p-6 text-center">

                  <div className="text-5xl">🦁</div>

                  <h3 className="text-4xl font-black mt-2">

                    800+

                  </h3>

                  <p>Explorer Kids</p>

                </div>

                <div className="bg-white/20 rounded-2xl p-6 text-center">

                  <div className="text-5xl">🏕️</div>

                  <h3 className="text-4xl font-black mt-2">

                    4

                  </h3>

                  <p>Safari Camps</p>

                </div>

                <div className="bg-white/20 rounded-2xl p-6 text-center">

                  <div className="text-5xl">👮</div>

                  <h3 className="text-4xl font-black mt-2">

                    120+

                  </h3>

                  <p>Volunteers</p>

                </div>

                <div className="bg-white/20 rounded-2xl p-6 text-center">

                  <div className="text-5xl">🎁</div>

                  <h3 className="text-4xl font-black mt-2">

                    Lots

                  </h3>

                  <p>Exciting Prizes</p>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

      {/* Bottom Wave */}

      <svg
        className="absolute bottom-0 left-0 w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 200"
      >
        <path
          fill="#FFFDF4"
          d="M0,96L80,112C160,128,320,160,480,170.7C640,181,800,171,960,149.3C1120,128,1280,96,1360,96L1440,96V320H0Z"
        />
      </svg>

    </section>
  );
}