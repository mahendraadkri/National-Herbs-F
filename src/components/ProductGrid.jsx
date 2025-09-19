import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <div className="py-10 text-center text-gray-500">
        No products match your filters.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const { id, name, price, rating, image, badge } = product;

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      <Link to={`/products/${id}`} className="block relative h-56 w-full overflow-hidden">
        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-green-600 text-white text-xs font-semibold px-3 py-1">
            {badge}
          </span>
        )}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover hover:scale-105 transition duration-300"
        />
      </Link>

      <div className="p-5">
        <Link to={`/products/${id}`}>
          <h3 className="text-green-900 font-semibold hover:text-green-700 transition">
            {name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-500">
            <FaStar /><span className="text-sm text-gray-700">{rating}</span>
          </div>
          <div className="text-lg font-semibold text-green-800">Rs. {price}</div>
        </div>

        {/* View Details button */}
        <Link
          to={`/products/${id}`}
          className="mt-4 w-full inline-flex justify-center rounded-full bg-green-600 text-white font-semibold py-2.5
                     hover:bg-green-700 transition"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
