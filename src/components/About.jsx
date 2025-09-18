// src/components/About.jsx
import React from "react";
import { FaLeaf, FaTint } from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";
import aboutImg from "../assets/banner001.png";

export default function About() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left image */}
        <div className="flex justify-center">
          <img
            src={aboutImg}
            alt="Aloe Vera Facewash"
            className="w-full md:w-4/5 rounded-xl object-cover"
          />
        </div>

        {/* Right content */}
        <div className="flex flex-col items-center text-center md:items-center md:text-center">
          {/* Header */}
          <div className="mb-6">
            <img
              src={leafIcon}
              alt="Leaf Icon"
              className="h-16 w-16 mb-3 object-contain mx-auto"
            />
            <h2 className="text-3xl md:text-4xl font-semibold text-green-800">
              About National Herbs
            </h2>
          </div>

          {/* Paragraph */}
          <p className="text-gray-600 leading-7 max-w-xl">
            National Herbs, by highlighting the power of nature, believes in
            providing pure, effective, and sustainable herbal products that
            support your health and well-being. We promote natural health by
            utilizing our traditional herbal knowledge, which is backed by
            science, and aim to fulfill the needs of people who are looking for
            a natural solution. From our various products such as Scar Shine
            Combo Set, Hair Care products, and Facial creams we have it all. Our
            quality as well as chemical-free products is all about assuring good
            health along with beauty for people.
          </p>

          {/* Feature points */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <FaLeaf className="text-green-600 text-3xl shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Rooted in Nature
                </h3>
                <p className="text-gray-600 leading-7">
                  We use ethically sourced herbs and sustainable farming methods
                  to bring nature’s best to you.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <FaTint className="text-green-600 text-3xl shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Chemical Free
                </h3>
                <p className="text-gray-600 leading-7">
                  Your skin deserves better—go chemical free because less is
                  more when it’s chemical free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
