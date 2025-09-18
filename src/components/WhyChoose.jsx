// src/components/WhyChoose.jsx
import React from "react";
import {
  FaFlask,
  FaLeaf,
  FaBoxOpen,
  FaHeart,
  FaArrowRightLong,
} from "react-icons/fa6";
// If you have a leaf logo image, uncomment and point to it correctly:
import leafIcon from "../assets/logo-icon.png";

const ITEMS = [
  {
    title: "Premium Quality",
    desc: "Our products use the highest quality ingredients and undergo rigorous testing.",
    icon: <FaLeaf className="text-3xl text-green-700" />,
  },
  {
    title: "Scientifically Formulated",
    desc: "Developed by health experts with research-backed formulations.",
    icon: <FaFlask className="text-3xl text-green-700" />,
  },
  {
    title: "Eco Packaging",
    desc: "We care about the Earth — our packaging is sustainable and eco-friendly.",
    icon: <FaBoxOpen className="text-3xl text-green-700" />,
  },
  {
    title: "Customer-Centric",
    desc: "We prioritize your wellness journey and satisfaction in everything we do.",
    icon: <FaHeart className="text-3xl text-green-700" />,
  },
];

export default function WhyChoose() {
  return (
    <section className="w-full">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-6 text-center">
        {/* Use image if available; otherwise keep the icon */}
        <img
          src={leafIcon}
          alt="Leaf"
          className="h-24 w-24 mx-auto mb-1 object-contain"
        />
        {/* <FaLeaf className="text-green-700 text-4xl mx-auto mb-3" /> */}
        <h2 className="text-3xl md:text-4xl font-semibold text-green-800">
          Why Choose National Herbo?
        </h2>
        <p className="mt-2 text-gray-500">
          What sets us apart in delivering natural wellness
        </p>
      </div>

      {/* Green band */}
      <div className="border-t-2 border-green-600">
        <div className="bg-green-900">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ITEMS.map((item, i) => (
                <article
                  key={i}
                  className="rounded-2xl bg-white shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition"
                >
                  <div className="-mt-10 mb-2 h-16 w-16 rounded-full bg-green-100 grid place-items-center shadow-sm">
                    {item.icon}
                  </div>

                  <h3 className="text-lg font-semibold text-yellow-500">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-gray-600 leading-7">{item.desc}</p>

                  <button
                    type="button"
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-yellow-500 font-semibold border border-yellow-500 rounded-full transition-all duration-300 hover:bg-yellow-500 hover:text-white hover:shadow-lg"
                  >
                    Read More
                    <FaArrowRightLong className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
