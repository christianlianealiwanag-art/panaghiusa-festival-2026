import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/hero/Hero";
import Countdown from "@/components/hero/Countdown";

import About from "@/components/sections/About";
import Statistics from "@/components/sections/Statistics";
import MayorSection from "@/components/sections/MayorSection";
import SafariCamps from "@/components/sections/SafariCamps";
import Freebies from "@/components/sections/Freebies";
import Sponsors from "@/components/sections/Sponsors";
import FestivalMap from "@/components/sections/FestivalMap";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />

      <Hero />

      <Countdown />

      <Statistics />

      <About />

      <MayorSection />

      <SafariCamps />

      <Freebies />

      <Sponsors />

      <FestivalMap />

      <FAQ />

      <Contact />

      <Footer />
    </main>
  );
}