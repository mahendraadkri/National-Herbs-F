import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export default function ProductDetails() {
  const { slug } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await axios.get(`${API_BASE}/products/${slug}`);
        if (!alive) return;
        setDetail(res?.data?.product || null);
        setActiveImg(0);
      } catch (e) {
        console.error(e);
        if (alive) setErr("Product not found.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  if (loading) {
    return (
      <section className="pt-24 md:pt-28 lg:pt-32 max-w-7xl mx-auto px-6 py-10">
        <div className="text-gray-500">Loading…</div>
      </section>
    );
  }

  if (err || !detail) {
    return (
      <section className="pt-24 md:pt-28 lg:pt-32 max-w-7xl mx-auto px-6 py-10">
        <p className="text-gray-600">{err || "Product not found."}</p>
        <Link to="/products" className="text-green-700 underline">
          Back to products
        </Link>
      </section>
    );
  }

  return (
    <section className="pt-24 md:pt-28 lg:pt-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-white shadow-sm aspect-square">
            <img
              src={
                Array.isArray(detail.images) && detail.images.length
                  ? detail.images[activeImg]
                  : "/placeholder.png"
              }
              alt={detail.name}
              className="w-full h-full object-cover"
            />
          </div>
          {Array.isArray(detail.images) && detail.images.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {detail.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-lg overflow-hidden border ${i === activeImg ? "ring-2 ring-green-600" : ""}`}
                >
                  <img src={src} alt={`${detail.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-green-900">{detail.name}</h1>
          {detail?.category?.name && (
            <div className="mt-1 text-sm text-gray-500">Category: {detail.category.name}</div>
          )}

          <div className="mt-4 text-2xl font-bold text-green-800">Rs. {detail.price ?? 0}</div>
          {detail.old_price && detail.old_price > (detail.price ?? 0) && (
            <div className="mt-1 text-sm text-gray-500 line-through">Rs. {detail.old_price}</div>
          )}

          <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">
            {detail.description || "No description available."}
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              to="/products"
              className="rounded-full bg-white border border-green-200 text-green-700 px-5 py-3 font-semibold hover:bg-green-50 transition"
            >
              ← Back to Products
            </Link>
            <button className="rounded-full bg-green-600 text-white px-6 py-3 font-semibold hover:bg-green-700">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
