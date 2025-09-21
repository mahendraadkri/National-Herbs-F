import React, { useMemo, useState } from "react";
import leafIcon from "../assets/logo-icon.png";
import CategoryPills from "./CategoryPills";
import FeaturedRow from "./FeaturedRow";
import ProductGrid from "./ProductGrid";

// ------- demo data from products.js
import { PRODUCTS } from "../data/products";

const COLLECTIONS = [
  {
    id: "c1",
    title: "Glow Essentials",
    subtitle: "Radiance-boosting skincare",
    image: "/assets/collections/glow.jpg",
    color: "from-amber-100 to-orange-50",
  },
  {
    id: "c2",
    title: "Clean Hair Care",
    subtitle: "Nourishing, sulfate-free",
    image: "/assets/collections/hair.jpg",
    color: "from-indigo-100 to-sky-50",
  },
  {
    id: "c3",
    title: "Morning Wellness",
    subtitle: "Teas & seeds to start right",
    image: "/assets/collections/wellness.jpg",
    color: "from-emerald-100 to-green-50",
  },
];

export default function Products() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))],
    []
  );

  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular"); // popular | price-asc | price-desc

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = PRODUCTS.filter(
      (p) =>
        (active === "All" || p.category === active) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q))
    );
    if (sort === "price-asc") out = out.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out = out.sort((a, b) => b.price - a.price);
    if (sort === "popular") out = out.sort((a, b) => b.rating - a.rating);
    return out;
  }, [active, query, sort]);

  return (
    <section className="bg-gray-50 max-w-7xl mx-auto px-6 pb-12 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <img src={leafIcon} className="h-20 w-24 mx-auto" alt="" />
        <h1 className="text-3xl md:text-4xl font-semibold text-green-900">
          Shop Products
        </h1>
        <p className="text-gray-600 mt-1">
          Clean, herbal, and science-backed care—crafted for everyday wellness.
        </p>
      </div>

      {/* Categories + Search + Sort */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <CategoryPills list={categories} value={active} onChange={setActive} />

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full md:w-64 rounded-full border border-green-200 bg-white/90 px-5 py-3
                         focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-green-200 bg-white/90 px-4 py-3
                         text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Featured Collections Row */}
      <FeaturedRow items={COLLECTIONS} />

      {/* Product Grid */}
      <ProductGrid products={visible} />
    </section>
  );
}
