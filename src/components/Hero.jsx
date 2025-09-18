// src/components/Hero.jsx
import React from "react";
import banner1 from "../assets/banner001.png";
import banner2 from "../assets/banner002.png";
import banner3 from "../assets/banner003.png";

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left big image (66%) */}
        <div className="md:col-span-2">
          <img
            src={banner1}
            alt="Banner 1"
            className="rounded-lg w-full h-full object-cover"
          />
        </div>

        {/* Right small stacked images (33%) */}
        <div className="grid grid-rows-2 gap-6">
          <img
            src={banner2}
            alt="Banner 2"
            className="rounded-lg w-full h-full object-cover"
          />
          <img
            src={banner3}
            alt="Banner 3"
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
