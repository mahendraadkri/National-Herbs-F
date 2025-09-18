// src/components/Newsletter.jsx
import React, { useState } from "react";
import { FaLeaf } from "react-icons/fa";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return;
    // TODO: call your API here
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 bg-grey-100">
        <div
          className="relative overflow-hidden rounded-2xl p-8 md:p-10
                        bg-gradient-to-br from-green-50 via-emerald-50 to-white
                        ring-1 ring-green-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
          {/* Decorative leaf badge */}
          <div
            className="absolute -left-10 -top-10 h-40 w-40 rounded-full
                          bg-green-100/40 blur-2xl pointer-events-none"
          />
          <div
            className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full
                          bg-emerald-100/40 blur-xl pointer-events-none"
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Text block */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-green-700 mb-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                  <FaLeaf />
                </span>
                <span className="text-sm font-medium tracking-wide">
                  Natural goodness in your inbox
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-green-900">
                Join the National Herbs Circle
              </h3>
              <p className="mt-2 text-gray-600">
                Tips, rituals, and product drops—curated for clean, plant-based
                care. No spam.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={onSubmit}
              className="w-full lg:w-auto flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1 min-w-[260px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-full border border-green-200 bg-white/90
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                             px-5 py-3 text-gray-800 placeholder:text-gray-400"
                  aria-label="Email address"
                  required
                />
                {/* tiny accent line */}
                <span className="pointer-events-none absolute inset-y-0 right-4 top-[52%] h-5 w-px bg-green-200 hidden sm:block" />
              </div>

              <button
                type="submit"
                className="rounded-full bg-green-600 text-white font-semibold px-6 py-3
                           hover:bg-green-700 active:scale-[0.99] transition shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Trust line */}
          <p className="mt-4 text-xs text-gray-500">
            We respect your privacy. Unsubscribe any time.
          </p>
        </div>
      </div>
    </section>
  );
}
