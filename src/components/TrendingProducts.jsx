// src/components/TrendingProducts.jsx
import { useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { CATEGORIES, PRODUCTS } from "../data/products";
import leafIcon from "../assets/logo-icon.png";

export default function TrendingProducts() {
  const [cat, setCat] = useState(CATEGORIES[0]);

  const items = useMemo(
    () => PRODUCTS.filter((p) => p.tags.includes(cat)),
    [cat]
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-2">
          <img
            src={leafIcon}
            alt="Leaf Icon"
            className="h-26 w-26 object-contain mx-auto"
          />
        </div>
        <h2 className="text-4xl md:text-3xl font-bold text-green-900">
          Trending Products
        </h2>
        <p className="text-gray-600 mt-2">Browse our most loved products</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex gap-2 p-1 bg-gray-200 rounded-full">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-s font-medium transition
                ${
                  c === cat
                    ? "bg-green-600 text-white shadow"
                    : "text-gray-700 hover:bg-white"
                }`}
              aria-pressed={c === cat}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <article
            key={p.id}
            className="bg-gray-100 rounded-2xl shadow-sm p-4 hover:shadow-md transition"
          >
            <div className="bg-white rounded-xl p-6">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-40 object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="mt-4 font-medium text-gray-800 text-center">
              {p.name}
            </h3>

            {/* rating */}
            <div className="mt-2 flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-sm ${
                    i < Math.round(p.rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
