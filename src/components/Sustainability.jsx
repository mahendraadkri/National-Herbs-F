// src/components/Sustainability.jsx
import React from "react";
import { FaLeaf, FaRecycle, FaHandsHelping } from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";          
import bottlesImg from "../assets/sustainability.jpg";   

export default function Sustainability() {
  return (
    <section className="w-full bg-green-50/30">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left: Image card */}
        <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white">
          <img
            src={bottlesImg}
            alt="Sustainable packaging and herbal bottles"
            className="w-150 h-120 object-cover"
          />
        </div>

        {/* Right: Content */}
        <div className="text-center">
          {/* Centered header */}
          <img
            src={leafIcon}
            alt="Leaf icon"
            className="h-24 w-24 mx-auto object-contain"
          />
          <h2 className="text-3xl md:text-4xl font-semibold text-green-900">
            Caring for Nature & You
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Our approach to sustainability is simple — give back more than we take.
          </p>

          {/* Points */}
          <ul className="mt-8 space-y-6 text-left max-w-xl mx-auto">
            <li className="flex items-start gap-4">
              <span className="text-green-700 pt-1">
                <FaLeaf className="text-2xl" />
              </span>
              <div>
                <p className="font-semibold text-gray-900">Responsibly Sourced Herbs</p>
                <p className="text-gray-600">
                  We work with eco-conscious farmers across Nepal to ensure ethical harvesting.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="text-green-700 pt-1">
                <FaRecycle className="text-2xl" />
              </span>
              <div>
                <p className="font-semibold text-gray-900">Plastic-Free Packaging</p>
                <p className="text-gray-600">
                  Our packaging is recyclable, biodegradable, and designed to reduce waste.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="text-green-700 pt-1">
                <FaHandsHelping className="text-2xl" />
              </span>
              <div>
                <p className="font-semibold text-gray-900">Community Empowerment</p>
                <p className="text-gray-600">
                  We uplift women-led cooperatives through fair trade and local employment.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
