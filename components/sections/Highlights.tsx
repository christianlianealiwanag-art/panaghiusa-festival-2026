"use client";

import { motion } from "framer-motion";
import {
  FaPaw,
  FaPaintBrush,
  FaUsers,
  FaAward,
} from "react-icons/fa";

export default function Highlights() {
  const cards = [
    {
      icon: <FaPaw size={40} />,
      title: "Discover",
      text: "Experience exciting safari-themed games and adventures.",
    },
    {
      icon: <FaPaintBrush size={40} />,
      title: "Create",
      text: "Enjoy arts, crafts, and creative activities for every child.",
    },
    {
      icon: <FaUsers size={40} />,
      title: "Connect",
      text: "Build friendships while celebrating Panaghiusa together.",
    },
    {
      icon: <FaAward size={40} />,
      title: "Celebrate",
      text: "Bring home unforgettable memories and achievements.",
    },
  ];

  return (
    <section
      className="bg-gradient-to-b from-green-50 to-yellow-50 py-24 px-6"
      id="highlights"
    >
      <div className="max-w-7xl mx-auto">

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold text-center text-green-800"
        >
          🌿 Welcome to Safari Explorer Hub
        </motion.h2>

        <p className="text-center text-gray-600 text-xl mt-6 max-w-3xl mx-auto">
          Where every child becomes an explorer for a day!
          Experience fun, friendship, creativity, and adventure
          in the biggest Children's Festival of Panaghiusa 2026.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

          {cards.map((card, index) => (

            <motion.div
              key={index}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center"
            >

              <div className="text-yellow-500 flex justify-center mb-5">
                {card.icon}
              </div>

              <h3 className="text-2xl font-bold text-green-800">
                {card.title}
              </h3>

              <p className="text-gray-600 mt-4">
                {card.text}
              </p>

            </motion.div>

          ))}

        </div>

      </div>
    </section>
  );
}