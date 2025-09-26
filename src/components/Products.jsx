import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import leafIcon from "../assets/logo-icon.png";
import CategoryPills from "./CategoryPills";
import FeaturedRow from "./FeaturedRow";
import ProductGrid from "./ProductGrid";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const COLLECTIONS = [
  { id: "c1", title: "Glow Essentials", subtitle: "Radiance-boosting skincare", image: "/assets/collections/glow.jpg", color: "from-amber-100 to-orange-50" },
  { id: "c2", title: "Clean Hair Care",   subtitle: "Nourishing, sulfate-free",    image: "/assets/collections/hair.jpg", color: "from-indigo-100 to-sky-50" },
  { id: "c3", title: "Morning Wellness",  subtitle: "Teas & seeds to start right", image: "/assets/collections/wellness.jpg", color: "from-emerald-100 to-green-50" },
];

export default function Products() {
  const [categories, setCategories] = useState(["All"]);
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular"); // popular | price-asc | price-desc
  const [rows, setRows] = useState([]); // products for grid
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ====== Fetch categories + products from API ======
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_BASE}/categories`), // { categories: [...] }
          axios.get(`${API_BASE}/products`),   // { success: true, data: [...] }
        ]);

        if (!mounted) return;

        // categories
        const catList = (catRes?.data?.categories || []).map((c) => c.name);
        setCategories(["All", ...Array.from(new Set(catList)).sort()]);

        // products
        const products = Array.isArray(prodRes?.data?.data) ? prodRes.data.data : [];
        const viewModels = products.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price ?? 0,
          rating: typeof p.rating === "number" ? p.rating : 4.8,
          image:
            Array.isArray(p.images) && p.images.length
              ? p.images[0]
              : "/placeholder.png",
          badge:
            p.old_price && p.price && Number(p.old_price) > Number(p.price)
              ? "Sale"
              : null,
          _cat: p?.category?.name || "",
          _desc: p?.description || "",
        }));
        setRows(viewModels);
      } catch (e) {
        console.error(e);
        setErr("Failed to load products. Please try again.");
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ====== Filtering & Sorting ======
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows.filter((p) => {
      const inCat = active === "All" || p._cat === active;
      const inQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p._cat.toLowerCase().includes(q) ||
        p._desc.toLowerCase().includes(q);
      return inCat && inQuery;
    });
    if (sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "popular") out = [...out].sort((a, b) => b.rating - a.rating);
    return out;
  }, [rows, active, query, sort]);

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
      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading…</div>
      ) : err ? (
        <div className="py-10 text-center text-red-600">{err}</div>
      ) : (
        <ProductGrid products={visible} />
      )}
    </section>
  );
}
