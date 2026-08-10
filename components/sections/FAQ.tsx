"use client";

import { useState } from "react";
import {
  FaChild,
  FaTicket,
  FaShirt,
  FaTrophy,
  FaChevronDown,
  FaPeopleGroup,
} from "react-icons/fa6";

const faqs: Array<{
  emoji: React.ReactNode;
  question: string;
  answer: string;
}> = [
  {
    emoji: <FaChild className="text-3xl text-green-700" />,
    question: "Who can join the Safari Adventure?",
    answer:
      "Children ages 3 to 10 years old are welcome to join! They must either be living in Claver or currently attending a school located in Claver.",
  },
  {
    emoji: <FaTicket className="text-3xl text-green-700" />,
    question: "Is there an entrance fee?",
    answer:
      "None at all! The Children's Festival: Safari Adventure is 100% FREE. No entrance fee, no hidden charges, just fun for the whole family.",
  },
  {
    emoji: <FaShirt className="text-3xl text-green-700" />,
    question: "Is there a dress code?",
    answer:
      "Come as you are! Your little explorer can wear anything they're comfortable in. Feeling adventurous? Dress them in a safari-inspired outfit and they'll automatically be eligible for our Best Safari-Inspired Outfit Contest.",
  },
  {
    emoji: <FaTrophy className="text-3xl text-green-700" />,
    question: "What can we win in the outfit contest?",
    answer:
      "Kids who wear a safari-inspired outfit (think animal prints, khaki, explorer hats, binoculars, and more) will be entered into our Best Safari-Inspired Outfit Contest, with special prizes up for grabs!",
  },
  {
    emoji: <FaPeopleGroup className="text-3xl text-green-700" />,
    question: "Do parents or guardians need to stay with their child?",
    answer:
      "Yes, parents and guardians are highly encouraged to stay and supervise their child throughout the festival. While our team will be on hand to keep the fun safe and organized, having a trusted adult nearby helps ensure every young explorer has the best, safest experience possible.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faqs"
      className="py-24 bg-gradient-to-b from-yellow-50 via-white to-green-50"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center">
          <span className="text-green-700 font-bold uppercase tracking-[4px]">
            Got Questions?
          </span>

          <h2 className="mt-4 text-5xl font-extrabold text-green-900">
            Frequently Asked Questions 🦒
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-700 leading-9">
            Everything parents need to know before the big Safari Adventure
            day!
          </p>
        </div>

        <div className="mt-14 space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-3xl bg-white shadow-xl transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center gap-5 p-6 text-left md:p-8"
                >
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-green-50">
                    {faq.emoji}
                  </div>

                  <span className="flex-1 text-xl font-bold text-green-900">
                    {faq.question}
                  </span>

                  <FaChevronDown
                    className={`text-xl text-green-700 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-8 text-lg leading-8 text-gray-700 md:px-8 md:pl-[5.75rem]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-r from-green-700 to-green-800 p-8 text-center text-white shadow-xl md:p-10">
          <p className="text-2xl font-black">🎉 Free Entry • Ages 3-10 • Safari Outfit Contest 🦁</p>
          <p className="mt-2 text-green-50">
            Still have questions? Reach out through our{" "}
            <a href="#contact" className="font-bold text-yellow-300 underline">
              Contact
            </a>{" "}
            section, we&apos;d love to help!
          </p>
        </div>
      </div>
    </section>
  );
}
