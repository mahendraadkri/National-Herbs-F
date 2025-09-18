// src/components/MissionVision.jsx
import React from "react";
import leafIcon from "../assets/logo-icon.png"; 
import bgLeaf from "../assets/herbo-icon.png"; 

export default function MissionVision() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 py-16">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <img
          src={bgLeaf}
          alt="Leaf Watermark"
          className="max-w-lg w-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
        {/* Mission */}
        <div>
          <img
            src={leafIcon}
            alt="Leaf Icon"
            className="h-24 w-24 mx-auto md:mx-0 object-contain"
          />
          <h2 className="text-2xl md:text-3xl font-semibold text-green-900 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-7">
            To empower individuals to feel confident in their skin using
            high-quality, affordable, and naturally inspired skincare products.
            We’re committed to clean beauty — no harsh chemicals, no false
            promises, just real results.
          </p>
        </div>

        {/* Vision */}
        <div>
          <img
            src={leafIcon}
            alt="Leaf Icon"
            className="h-24 w-24 mx-auto md:mx-0 object-contain"
          />
          <h2 className="text-2xl md:text-3xl font-semibold text-green-900 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-700 leading-7">
            To become Nepal’s most trusted beauty brand by creating products
            that not only transform skin but also uplift lives through ethical
            practices, innovation, and care.
          </p>
        </div>
      </div>
    </section>
  );
}
