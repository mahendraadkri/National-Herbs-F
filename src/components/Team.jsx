// src/components/Team.jsx
import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";

// Demo images (replace with your real images or URLs)
import m1 from "../assets/team1.jpg";
import m2 from "../assets/team2.jpg";
import m3 from "../assets/team3.jpg";
import m4 from "../assets/team1.jpg";
import m5 from "../assets/team2.jpg";
import m6 from "../assets/team3.jpg";
import m7 from "../assets/team1.jpg";
import m8 from "../assets/team2.jpg";

/**
 * If you later fetch from API (our_teams table), use fields:
 * { id, name, position, image, phone, email, description }
 */
const TEAM = [
  { id: 1, name: "Sita Sharma", position: "Herbal Product Expert", image: m1, phone: "9812345678", email: "sita@company.com", description: "Specializes in Himalayan botanicals and product training." },
  { id: 2, name: "Ramesh Thapa", position: "Head of Research", image: m2, phone: "9822233344", email: "ramesh@company.com", description: "Leads R&D and clinical validation initiatives." },
  { id: 3, name: "Anjali Kunwar", position: "Co-Founder & Ayurvedic Advisor", image: m3, phone: "9845566778", email: "anjali@company.com", description: "Ayurvedic consultant with a decade of practice." },
  { id: 4, name: "Kiran Khadka", position: "Quality Assurance Lead", image: m4, phone: "9801112233", email: "kiran@company.com", description: "Ensures GMP and ISO compliance across facilities." },
  { id: 5, name: "Asmita KC", position: "Formulation Scientist", image: m5, phone: "9811998877", email: "asmita@company.com", description: "Focuses on stable, bioavailable formulations." },
  { id: 6, name: "Pawan Gurung", position: "Production Manager", image: m6, phone: "9801234567", email: "pawan@company.com", description: "Oversees production planning and execution." },
  { id: 7, name: "Ritika Shrestha", position: "Regulatory Affairs", image: m7, phone: "9822001100", email: "ritika@company.com", description: "Manages product registrations and compliance." },
  { id: 8, name: "Bibek Bista", position: "Supply Chain", image: m8, phone: "9841002003", email: "bibek@company.com", description: "Optimizes sourcing and distribution logistics." },
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

  const timer = useRef(null);
  const start = useCallback(() => {
    stop();
    timer.current = setInterval(() => {
      setPage((p) => (p + 1) % total);
    }, 3000);
  }, [total]);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  // Selected member for modal
  const [selected, setSelected] = useState(null);

  const next = () => setPage((p) => (p + 1) % total);
  const prev = () => setPage((p) => (p - 1 + total) % total);

  const clickWithPause = (fn) => {
    stop();
    fn();
    setTimeout(start, 1200);
  };

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  // Open modal: stop autoplay
  const openModal = (member) => {
    stop();
    setSelected(member);
  };

  // Close modal: resume autoplay
  const closeModal = () => {
    setSelected(null);
    start();
  };

  // Close modal on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (selected) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <img src={leafIcon} alt="Leaf" className="h-24 w-24 mx-auto object-contain" />
        <h2 className="text-3xl md:text-4xl font-semibold text-green-900">Meet Our Team</h2>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden" onMouseEnter={stop} onMouseLeave={() => !selected && start()}>
        {/* Track */}
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${page * 100}%)` }}>
          {pages.map((group, gi) => (
            <div key={gi} className="w-full shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {group.map((m, idx) => (
                  <article
                    key={m.id}
                    onClick={() => openModal(m)}
                    className={`${CARD_BGS[(gi * PER_PAGE + idx) % CARD_BGS.length]} rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition cursor-pointer`}
                  >
                    <div className="mx-auto h-28 w-28 rounded-full bg-white shadow-inner ring-1 ring-gray-100 grid place-items-center mb-5">
                      <img src={m.image} alt={m.name} className="h-24 w-24 rounded-full object-cover" loading="lazy" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{m.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{m.position}</p>
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
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 text-green-700 shadow grid place-items-center hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600 transition"
        >
          <FaChevronLeft className="text-lg" />
        </button>

        <button
          type="button"
          onClick={() => clickWithPause(next)}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 text-green-700 shadow grid place-items-center hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600 transition"
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
              className={`h-2.5 rounded-full transition-all ${page === i ? "w-6 bg-green-700" : "w-2.5 bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Profile Modal (no footer button) */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            // click outside to close
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl ring-1 ring-gray-100 w-full max-w-xl aspect-square overflow-hidden">
            {/* Close (X) */}
            <button
              onClick={closeModal}
              aria-label="Close"
              className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 w-9 h-9 rounded-full grid place-items-center shadow"
              title="Close"
            >
              <FaTimes />
            </button>

            {/* Content */}
            <div className="h-full w-full grid grid-rows-[auto,1fr]">
              {/* Header with image */}
              <div className="p-6 pb-0 flex items-center gap-4">
                <div className="h-20 w-20 rounded-xl overflow-hidden ring-1 ring-gray-200 bg-gray-100 shrink-0">
                  <img src={selected.image} alt={selected.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-green-900 truncate">{selected.name}</h3>
                  <p className="text-sm text-gray-600">{selected.position}</p>
                </div>
              </div>

              {/* Body (scroll if overflow) */}
              <div className="p-6 pt-4 overflow-auto">
                <div className="space-y-3 text-sm">
                  <InfoRow icon={<FaMapMarkerAlt />} label="Office">
                    National Herbs HQ
                  </InfoRow>

                  <InfoRow icon={<FaPhoneAlt />} label="Phone">
                    {selected.phone ? (
                      <a className="text-green-700 hover:underline" href={`tel:+977${selected.phone.replace(/[^\d]/g, "")}`}>
                        {selected.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </InfoRow>

                  <InfoRow icon={<FaEnvelope />} label="Email">
                    {selected.email ? (
                      <a className="text-green-700 hover:underline" href={`mailto:${selected.email}`} target="_blank" rel="noreferrer">
                        {selected.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </InfoRow>

                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">About</p>
                    <p className="mt-1 text-gray-700 leading-relaxed">
                      {selected.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
              {/* Footer removed */}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ----- Little row helper for icon + label/value ----- */
function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-green-600">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-gray-800">{children}</p>
      </div>
    </div>
  );
}
