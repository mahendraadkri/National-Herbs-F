import React from "react";
import { FaStar } from "react-icons/fa";

// Demo fallback data (replace with real)
const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Aloe Vera Facewash",
    price: 450,
    rating: 4.5,
    image: "/products/aloe-facewash.jpg", // put image in /public/products/
  },
  {
    id: 2,
    name: "Scar Shine Cream",
    price: 650,
    rating: 4,
    image: "/products/scar-shine.jpg",
  },
  {
    id: 3,
    name: "Herbal Shampoo",
    price: 350,
    rating: 4.2,
    image: "/products/shampoo.jpg",
  },
  {
    id: 4,
    name: "Tulsi Herbal Tea",
    price: 300,
    rating: 5,
    image: "/products/tulsi-tea.jpg",
  },
];

export default function TrendingProducts({ products }) {
  // fallback to demo if nothing passed
  const list = Array.isArray(products) && products.length > 0 ? products : DEMO_PRODUCTS;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-semibold text-green-900 mb-6 text-center">
        Trending Products
      </h2>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <article
            key={p.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md overflow-hidden transition"
          >
            {/* Image */}
            <div className="h-48 w-full overflow-hidden bg-gray-100">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-semibold text-green-900">{p.name}</h3>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-yellow-500">
                  <FaStar />
                  <span className="text-sm text-gray-700">
                    {p.rating ?? "—"}
                  </span>
                </div>
                {p.price != null && (
                  <div className="text-lg font-semibold text-green-800">
                    Rs. {p.price}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
