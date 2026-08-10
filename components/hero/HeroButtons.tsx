"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap gap-5 pt-2">

      {/* Register Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/register"
          className="inline-flex items-center rounded-full bg-yellow-400 px-8 py-4 text-lg font-bold text-green-900 shadow-xl transition hover:bg-yellow-300"
        >
          🦁 Register My Child
        </Link>
      </motion.div>

      {/* Safari Passport */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <a
          href="/Safari-Passport.pdf"
          target="_blank"
          className="inline-flex items-center rounded-full border-2 border-white bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-green-900"
        >
          📖 Download Safari Passport
        </a>
      </motion.div>

    </div>
  );
}
