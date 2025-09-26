// src/components/Team.jsx
import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaMapMarkerAlt,
  FaUserTie,
} from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";

const API_ROOT = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

function toImageUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${API_ROOT}/storage/${String(pathOrUrl).replace(/^\/?storage\/?/, "")}`;
}

const PER_PAGE = 4;
const CARD_BGS = [
  "bg-gradient-to-br from-emerald-50 to-green-100",
  "bg-gradient-to-br from-amber-50 to-yellow-100",
  "bg-gradient-to-br from-indigo-50 to-sky-100",
  "bg-gradient-to-br from-fuchsia-50 to-pink-100",
];

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await axios.get(`${API_ROOT}/api/ourteams`);
        const list = (data?.data || []).map((m) => ({
          id: m.id,
          name: m.name || "",
          position: m.position || "",
          image: toImageUrl(m.image || ""),
          description: m.description || "",
        }));
        if (alive) setTeam(list);
      } catch (e) {
        if (alive) {
          setErr("Failed to load team.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < team.length; i += PER_PAGE) {
      chunks.push(team.slice(i, i + PER_PAGE));
    }
    return chunks;
  }, [team]);

  const [page, setPage] = useState(0);
  const total = pages.length || 1;

  const timer = useRef(null);
  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);
  const start = useCallback(() => {
    stop();
    if (total <= 1) return;
    timer.current = setInterval(() => {
      setPage((p) => ((p + 1) % total) || 0);
    }, 3000);
  }, [stop, total]);

  const next = () => setPage((p) => ((p + 1) % total) || 0);
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

  const [selected, setSelected] = useState(null);
  const openModal = (member) => {
    stop();
    setSelected(member);
  };
  const closeModal = () => {
    setSelected(null);
    start();
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeModal();
    if (selected) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <img
          src={leafIcon}
          alt="Leaf"
          className="h-24 w-24 mx-auto object-contain"
        />
        <h2 className="text-3xl md:text-4xl font-semibold text-green-900">
          Meet Our Team
        </h2>
      </div>

      {loading && <div className="text-center text-gray-600">Loading team…</div>}
      {err && <div className="text-center text-red-600">{err}</div>}
      {!loading && !err && team.length === 0 && (
        <div className="text-center text-gray-500">No team members yet.</div>
      )}

      {/* Carousel */}
      {!loading && !err && team.length > 0 && (
        <div
          className="relative overflow-hidden"
          onMouseEnter={stop}
          onMouseLeave={() => !selected && start()}
        >
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
                      onClick={() => openModal(m)}
                      className={`${
                        CARD_BGS[
                          (gi * PER_PAGE + idx) % CARD_BGS.length
                        ]
                      } rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition cursor-pointer`}
                    >
                      <div className="mx-auto h-28 w-28 rounded-full bg-white shadow-inner ring-1 ring-gray-100 grid place-items-center mb-5">
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.name}
                            className="h-24 w-24 rounded-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-full grid place-items-center text-gray-400">
                            <FaUserTie />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900">{m.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {m.position || "—"}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          {total > 1 && (
            <>
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
            </>
          )}
        </div>
      )}

      {/* Modal without phone/email */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl ring-1 ring-gray-100 w-full max-w-xl aspect-square overflow-hidden">
            <button
              onClick={closeModal}
              aria-label="Close"
              className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 w-9 h-9 rounded-full grid place-items-center shadow"
            >
              <FaTimes />
            </button>

            <div className="h-full w-full grid grid-rows-[auto,1fr]">
              <div className="p-6 pb-0 flex items-center gap-4">
                <div className="h-20 w-20 rounded-xl overflow-hidden ring-1 ring-gray-200 bg-gray-100 shrink-0">
                  {selected.image ? (
                    <img
                      src={selected.image}
                      alt={selected.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-gray-400">
                      <FaUserTie />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-green-900 truncate">
                    {selected.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selected.position || "—"}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-4 overflow-auto">
                <div className="space-y-3 text-sm">
                  <InfoRow icon={<FaMapMarkerAlt />} label="Office">
                    National Herbs HQ
                  </InfoRow>

                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      About
                    </p>
                    <p className="mt-1 text-gray-700 leading-relaxed">
                      {selected.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

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
