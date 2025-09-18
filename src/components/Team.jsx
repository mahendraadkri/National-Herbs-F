// src/components/Team.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";

// Replace with your real images
import m1 from "../assets/team1.jpg";
import m2 from "../assets/team2.jpg";
import m3 from "../assets/team3.jpg";
import m4 from "../assets/team1.jpg";
import m5 from "../assets/team2.jpg";
import m6 from "../assets/team3.jpg";
import m7 from "../assets/team1.jpg";
import m8 from "../assets/team2.jpg";

const TEAM = [
  { id: 1, name: "Sita Sharma", role: "Herbal Product Expert", photo: m1 },
  { id: 2, name: "Ramesh Thapa", role: "Head of Research", photo: m2 },
  { id: 3, name: "Anjali Kunwar", role: "Co-Founder & Ayurvedic Advisor", photo: m3 },
  { id: 4, name: "Kiran Khadka", role: "Quality Assurance Lead", photo: m4 },
  { id: 5, name: "Asmita KC", role: "Formulation Scientist", photo: m5 },
  { id: 6, name: "Pawan Gurung", role: "Production Manager", photo: m6 },
  { id: 7, name: "Ritika Shrestha", role: "Regulatory Affairs", photo: m7 },
  { id: 8, name: "Bibek Bista", role: "Supply Chain", photo: m8 },
];

const PER_PAGE = 4;

// Alternating gradient backgrounds for cards
const CARD_BGS = [
  "bg-gradient-to-br from-emerald-50 to-green-100",
  "bg-gradient-to-br from-amber-50 to-yellow-100",
  "bg-gradient-to-br from-indigo-50 to-sky-100",
  "bg-gradient-to-br from-fuchsia-50 to-pink-100",
];

export default function Team() {
  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < TEAM.length; i += PER_PAGE) {
      chunks.push(TEAM.slice(i, i + PER_PAGE));
    }
    return chunks;
  }, []);

  const [page, setPage] = useState(0);
  const total = pages.length;

  const next = () => setPage((p) => (p + 1) % total);
  const prev = () => setPage((p) => (p - 1 + total) % total);

  // autoplay every 3s (pause on hover)
  const timer = useRef(null);
  const start = () => {
    stop();
    timer.current = setInterval(next, 3000);
  };
  const stop = () => timer.current && clearInterval(timer.current);

  // resume autoplay after manual click
  const clickWithPause = (fn) => {
    stop();
    fn();
    setTimeout(start, 1200);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <img
          src={leafIcon}
          alt="Leaf"
          className="h-14 w-14 mx-auto mb-3 object-contain"
        />
        <h2 className="text-3xl md:text-4xl font-semibold text-green-900">
          Meet Our Team
        </h2>
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={stop}
        onMouseLeave={start}
      >
        {/* Track */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((group, gi) => (
            <div key={gi} className="w-full shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {group.map((m, idx) => (
                  <article
                    key={m.id}
                    className={`${CARD_BGS[(gi * PER_PAGE + idx) % CARD_BGS.length]} 
                               rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition`}
                  >
                    <div className="mx-auto h-28 w-28 rounded-full bg-white shadow-inner ring-1 ring-gray-100 grid place-items-center mb-5">
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="h-24 w-24 rounded-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900">{m.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{m.role}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => clickWithPause(prev)}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                     w-10 h-10 rounded-full bg-white/90 text-green-700 shadow
                     grid place-items-center hover:bg-green-600 hover:text-white
                     focus:outline-none focus:ring-2 focus:ring-green-600 transition"
        >
          <FaChevronLeft className="text-lg" />
        </button>

        <button
          type="button"
          onClick={() => clickWithPause(next)}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                     w-10 h-10 rounded-full bg-white/90 text-green-700 shadow
                     grid place-items-center hover:bg-green-600 hover:text-white
                     focus:outline-none focus:ring-2 focus:ring-green-600 transition"
        >
          <FaChevronRight className="text-lg" />
        </button>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                page === i ? "w-6 bg-green-700" : "w-2.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
