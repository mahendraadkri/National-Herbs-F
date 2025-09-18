// src/components/Certificates.jsx
import React from "react";
import leafIcon from "../assets/logo-icon.png"; // your leaf mark

// Replace these with your actual certificate images
import c1 from "../assets/certificate1.jpg";
import c2 from "../assets/certificate2.jpg";
import c3 from "../assets/certificate3.jpg";
import c4 from "../assets/certificate4.jpg";

const CERTS = [c1, c2, c3, c4];

export default function Certificates() {
  return (
    <section className="w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <img
            src={leafIcon}
            alt="Leaf Icon"
            className="h-24 w-24 mx-auto object-contain"
          />
          <h2 className="text-3xl md:text-4xl font-semibold text-green-900">
            Certifications & Recognition
          </h2>
          <p className="text-gray-500 mt-2">
            Trusted, Approved, and Recognized by Leading Authorities
          </p>
        </div>

        {/* Certificates grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CERTS.map((img, i) => (
            <figure
              key={i}
              className="group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={img}
                  alt={`Certificate ${i + 1}`}
                  className="h-full w-full object-cover filter grayscale group-hover:grayscale-0 transition duration-300 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              {/* Optional caption area (hidden by default) */}
              {/* <figcaption className="px-4 py-3 text-center text-sm text-gray-500">
                Certificate Title
              </figcaption> */}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
