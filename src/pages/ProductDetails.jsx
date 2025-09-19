import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { PRODUCTS } from "../data/products";

export default function ProductDetails() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <section className="pt-24 md:pt-28 lg:pt-32 max-w-7xl mx-auto px-6 py-10">
        <p className="text-gray-600">Product not found.</p>
        <Link to="/products" className="text-green-700 underline">
          Back to products
        </Link>
      </section>
    );
  }

  const { name, price, rating, description, image, images = [] } = product;

  return (
    <section className="pt-24 md:pt-28 lg:pt-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
            <img
              src={image}
              alt={name}
              className="w-full h-[420px] object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1).map((src, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  <img
                    src={src}
                    alt={`${name} ${i + 2}`}
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-green-900">
            {name}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <FaStar />
              <span className="text-sm text-gray-700">{rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-lg font-semibold text-green-800">
              Rs. {price}
            </span>
          </div>

          <p className="mt-5 text-gray-700 leading-7">{description}</p>

          <div className="mt-8 flex gap-3">
            <Link
              to="/products"
              className="rounded-full bg-white border border-green-200 text-green-700 px-5 py-3 font-semibold hover:bg-green-50 transition"
            >
              ← Back to Products
            </Link>
            {/* You can add a "Where to Buy" or "Contact" button here later */}
          </div>
        </div>
      </div>
    </section>
  );
}
