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
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="aspect-[4/5] max-w-md bg-gray-200 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-6 w-2/3 bg-gray-200 rounded" />
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-24 w-full bg-gray-200 rounded" />
              <div className="h-10 w-52 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (err || !detail) {
    return (
      <section className="pt-24 md:pt-28 lg:pt-32 max-w-7xl mx-auto px-6 py-10">
        <p className="text-gray-600 mb-4">{err || "Product not found."}</p>
        <Link to="/products" className="text-green-700 underline">
          Back to products
        </Link>
      </section>
    );
  }

  const imgs = Array.isArray(detail.images) ? detail.images : [];
  const hasDiscount =
    detail?.old_price && Number(detail.old_price) > Number(detail.price ?? 0);
  const discountPct = hasDiscount
    ? Math.round(((Number(detail.old_price) - Number(detail.price)) / Number(detail.old_price)) * 100)
    : 0;

  return (
    <section className="pt-24 md:pt-28 lg:pt-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="flex flex-col items-center sm:items-start">
            {/* Slightly smaller main image: narrower max width + 4:5 aspect */}
            <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100">
              <div className="aspect-[4/5]">
                <img
                  src={imgs.length ? imgs[activeImg] : "/placeholder.png"}
                  alt={detail.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Thumbnails */}
            {imgs.length > 1 && (
              <div className="mt-4 w-full max-w-md">
                <div className="grid grid-cols-5 gap-3">
                  {imgs.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`aspect-square rounded-xl overflow-hidden bg-white ring-1 transition 
                        ${i === activeImg ? "ring-2 ring-green-600" : "ring-gray-200 hover:ring-green-300"}`}
                      title={`View image ${i + 1}`}
                    >
                      <img
                        src={src}
                        alt={`${detail.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-semibold text-green-900 leading-tight">
              {detail.name}
            </h1>

            {detail?.category?.name && (
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-green-50 text-green-800 px-3 py-1 text-xs font-medium ring-1 ring-green-100">
                  {detail.category.name}
                </span>
              </div>
            )}

            {/* Price block */}
            <div className="mt-6 flex items-end gap-3">
              <div className="text-3xl font-bold text-green-800">
                Rs. {detail.price ?? 0}
              </div>
              {hasDiscount && (
                <>
                  <div className="text-sm text-gray-500 line-through">
                    Rs. {detail.old_price}
                  </div>
                  <span className="text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-red-100 px-2 py-1 rounded-full">
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">
              {detail.description || "No description available."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-full bg-white border border-green-200 text-green-700 px-5 py-3 font-semibold hover:bg-green-50 transition"
              >
                ← Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
