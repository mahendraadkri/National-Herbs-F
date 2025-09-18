// src/components/ManufacturingProcess.jsx
import React from "react";
import { FaSeedling, FaSun, FaFlask, FaBox } from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";

const STEPS = [
  {
    number: "01",
    title: "Harvesting",
    desc: "We carefully collect raw herbs from clean and sustainable farms.",
    icon: <FaSeedling className="text-white text-xl" />,
    color: "bg-green-600",
  },
  {
    number: "02",
    title: "Drying",
    desc: "Herbs are dried naturally to maintain nutrients and quality.",
    icon: <FaSun className="text-white text-xl" />,
    color: "bg-amber-500",
  },
  {
    number: "03",
    title: "Formulation",
    desc: "Expert teams blend ingredients into clean, effective formulations.",
    icon: <FaFlask className="text-white text-xl" />,
    color: "bg-indigo-500",
  },
  {
    number: "04",
    title: "Packaging",
    desc: "Eco-friendly packaging ensures freshness and planet-conscious delivery.",
    icon: <FaBox className="text-white text-xl" />,
    color: "bg-pink-500",
  },
];

export default function ManufacturingProcess() {
  return (
    <section className="w-full bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src={leafIcon}
            alt="Leaf Icon"
            className="h-14 w-14 mx-auto mb-3 object-contain"
          />
          <h2 className="text-3xl md:text-4xl font-semibold text-green-900">
            Our Manufacturing Process
          </h2>
          <p className="text-gray-600 mt-2">
            From nature to packaging — every step matters.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-2xl shadow-sm p-8 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-200 hover:shadow-md transition"
            >
              {/* Number in colored circle */}
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-xl ${step.color}`}
              >
                {step.number}
              </div>

              {/* Content */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex justify-center sm:justify-start mb-3">
                  <div
                    className={`h-12 w-12 rounded-full ${step.color} flex items-center justify-center`}
                  >
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
