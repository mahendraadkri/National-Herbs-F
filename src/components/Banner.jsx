// src/components/Banner.jsx
import React from "react";
import scarBanner from "../assets/promo-banner1.jpg";
import shampooBanner from "../assets/promo-banner2.jpg";
// import fullBanner from "../assets/full-banner.jpg";

function Banner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner 1 */}
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={scarBanner}
            alt="Scar Shine Cream Banner"
            className="w-full h-full object-cover"
          />
          {/* Optional overlay text */}
          {/* <div className="absolute inset-0 flex flex-col justify-center px-8">
            <p className="text-lg font-semibold text-red-600">20% off</p>
            <h3 className="text-2xl font-bold text-gray-900">
              Scar Shine Cream
            </h3>
            <p className="text-gray-700 mb-4">
              Get rid of black spots & get the skin you always desired.
            </p>
            <button className="bg-black text-white px-4 py-2 rounded-md w-fit hover:bg-gray-800 transition">
              Shop Now
            </button>
          </div> */}
        </div>

        {/* Banner 2 */}
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={shampooBanner}
            alt="Shampoo Banner"
            className="w-full h-full object-cover"
          />
          {/* Optional overlay text */}
          {/* <div className="absolute inset-0 flex flex-col justify-center px-8">
            <p className="text-lg font-semibold text-orange-600">10% off</p>
            <h3 className="text-2xl font-bold text-gray-900">
              Wide range of Shampoos
            </h3>
            <p className="text-gray-700 mb-4">
              Silky shiny hair with our products
            </p>
            <button className="bg-black text-white px-4 py-2 rounded-md w-fit hover:bg-gray-800 transition">
              Shop Now
            </button>
          </div> */}
        </div>
      </div>
      {/* <div className="relative rounded-xl overflow-hidden mt-5">
        <img
          src={fullBanner}
          alt="Full Banner"
          className="w-full h-full object-cover"
        />
      </div> */}
    </section>
  );
}

export default Banner;
