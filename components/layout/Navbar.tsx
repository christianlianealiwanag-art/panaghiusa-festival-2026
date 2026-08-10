"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* LEFT LOGOS */}
        <div className="flex items-center gap-3">

          <Image
            src="/images/logos/municipality-logo.png"
            alt="Municipality Logo"
            width={60}
            height={60}
          />

          <Image
            src="/images/logos/panaghiusa-logo.png"
            alt="Panaghiusa Logo"
            width={60}
            height={60}
          />

          <Image
            src="/images/logos/claver-logo.png"
            alt="Claver Children's Festival Logo"
            width={60}
            height={60}
          />

          <div className="hidden lg:block leading-tight ml-2">
            <h1 className="font-bold text-green-800 text-lg">
              Panaghiusa Festival 2026
            </h1>

            <p className="text-sm text-gray-600">
              Children's Safari Festival
            </p>
          </div>
        </div>

        {/* MENU */}

        <nav className="hidden md:flex gap-8 text-gray-800 font-semibold">

          <Link href="#about">About</Link>

          <Link href="#mayor">Mayor</Link>

          <Link href="#camps">Safari Camps</Link>

          <Link href="/festival-map">Map</Link>

          <Link href="#sponsors">Sponsors</Link>

          <Link href="#faqs">FAQs</Link>

          <Link href="#contact">Contact</Link>

        </nav>
      </div>
    </header>
  );
}