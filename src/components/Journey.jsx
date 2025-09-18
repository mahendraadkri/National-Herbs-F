// src/pages/Journey.jsx
import React from "react";
import leafIcon from "../assets/logo-icon.png";
import chiaImg from "../assets/banner003.png";

export default function Journey() {
  return (
      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={leafIcon}
            alt="Leaf Icon"
            className="h-24 w-24 mx-auto mb-1 object-contain"
          />
          <h2 className="text-3xl md:text-4xl font-semibold text-green-900">
            Our Journey
          </h2>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-gray-700 leading-7 mb-6">
              From the foothills of Nepal,{" "}
              <span className="font-semibold text-green-800">
                National Herbs
              </span>{" "}
              began its journey blending age-old herbal wisdom with modern
              science. What started as a local remedy initiative has grown into
              a trusted wellness brand.
            </p>
            <p className="text-gray-700 leading-7">
              Each product is a reflection of our commitment to purity,
              sustainability, and skin-friendly innovation. With time, our
              belief in clean, chemical-free beauty has reached thousands across
              the country — and we’re just getting started.
            </p>
          </div>

          {/* Right: Image only */}
          <div>
            <img
              src={chiaImg}
              alt="Our Journey Image"
              className="w-full rounded-xl shadow-md object-cover"
            />
          </div>
        </div>
      </section>
  );
}
