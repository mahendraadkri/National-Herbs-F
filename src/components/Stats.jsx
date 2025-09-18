// src/components/Stats.jsx
import React from "react";
import { FaCalendarAlt, FaCapsules, FaUsers, FaIndustry } from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";

const STATS = [
  {
    number: "2,014",
    label: "We Are Since",
    icon: <FaCalendarAlt className="text-3xl" />,
    color: "bg-green-600",
  },
  {
    number: "500+",
    label: "Product We Offer",
    icon: <FaCapsules className="text-3xl" />, 
    color: "bg-yellow-400",
  },
  {
    number: "1,000+",
    label: "Happy Clients",
    icon: <FaUsers className="text-3xl" />,
    color: "bg-green-600",
  },
  {
    number: "20,000+",
    label: "Sq Feet Production Area",
    icon: <FaIndustry className="text-3xl" />,
    color: "bg-yellow-400",
  },
];

export default function Stats() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 text-center">
      {/* Header */}
      <div className="mb-10">
        <img
          src={leafIcon}
          alt="Leaf Icon"
          className="h-14 w-14 mx-auto mb-3 object-contain"
        />
        <h2 className="text-2xl md:text-3xl font-semibold text-green-900">
          National Herbs – Your Gateway to Natural Wellness
        </h2>
        <p className="text-gray-500 mt-2">
          Trusted Partner for Herbal Manufacturing
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className={`${stat.color} text-white rounded-xl p-8 shadow-md hover:shadow-lg transition`}
          >
            <div className="mb-4 flex justify-center">{stat.icon}</div>
            <p className="text-3xl font-bold">{stat.number}</p>
            <p className="mt-2 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
