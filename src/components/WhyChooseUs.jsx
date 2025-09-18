// src/components/WhyChooseUs.jsx
import React from "react";
import { FaLeaf, FaFlask, FaMicroscope, FaCoins } from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";

const FEATURES = [
  {
    title: "Rooted in Nature",
    desc: "Ethically sourced herbs from sustainable farms.",
    icon: <FaLeaf className="text-3xl text-white" />,
    bg: "bg-gradient-to-r from-orange-400 to-pink-300",
  },
  {
    title: "Chemical Free",
    desc: "We say no to harsh chemicals. Just pure, natural care.",
    icon: <FaFlask className="text-3xl text-white" />,
    bg: "bg-gradient-to-r from-red-500 to-pink-500",
  },
  {
    title: "Science-Backed",
    desc: "We blend ancient herbal wisdom with modern formulation.",
    icon: <FaMicroscope className="text-3xl text-white" />,
    bg: "bg-gradient-to-r from-purple-700 to-teal-500",
  },
  {
    title: "Affordable & Honest",
    desc: "Transparent ingredients and pricing you can trust.",
    icon: <FaCoins className="text-3xl text-white" />,
    bg: "bg-gradient-to-r from-purple-500 to-pink-300",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <img
          src={leafIcon}
          alt="Leaf Icon"
          className="h-24 w-24 mx-auto object-contain"
        />
        <h2 className="text-3xl md:text-4xl font-semibold text-green-900">
          Why Choose Us
        </h2>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className={`${f.bg} rounded-xl shadow-md p-8 text-center text-white hover:shadow-lg transition`}
          >
            <div className="mb-4 flex justify-center">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-sm leading-6">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
