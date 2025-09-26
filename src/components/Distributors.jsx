// Distributors.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaDirections,
} from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";
import { api } from "../api/client"; // axios instance -> baseURL to your Laravel app

// Build a Gmail compose URL (opens in new tab)
function gmailComposeLink(to, subject = "", body = "") {
  const base = "https://mail.google.com/mail/?view=cm&fs=1";
  const params = new URLSearchParams();
  if (to) params.set("to", to);
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `${base}&${params.toString()}`;
}

// Parse "City[ SPACE ZIP][ — Extra]" -> { city, zip, extra, displayLine, cityForBadge }
function parseLocation(raw = "") {
  const text = String(raw || "").trim();
  if (!text) return { city: "", zip: "", extra: "", displayLine: "", cityForBadge: "" };

  // Split by em dash first (—). If none is present, extra remains "".
  const dashSplit = text.split("—");
  const left = dashSplit[0].trim();                 // "City" or "City 44600"
  const extra = dashSplit.slice(1).join("—").trim(); // "Nayabazar, Sorakhutte" (optional)

  // Try "City" + optional 5-digit ZIP at the end of 'left'
  const m = left.match(/^(.+?)[\s,]*([0-9]{5})?$/);
  let city = left;
  let zip = "";
  if (m) {
    city = (m[1] || "").trim().replace(/[,\-]$/, "").trim();
    zip = (m[2] || "").trim();
  }

  // Build friendly display line under the name: "City, ZIP, Extra"
  const parts = [];
  if (city) parts.push(city);
  if (zip) parts.push(zip);
  if (extra) parts.push(extra);
  const displayLine = parts.join(", ");

  const cityForBadge = city || (extra ? extra.split(",")[0].trim() : "");

  return { city, zip, extra, displayLine, cityForBadge };
}

export default function Distributors() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [query, setQuery] = useState("");

  // Fetch from Laravel index: GET /api/distributors
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/distributors");
        const list = (Array.isArray(data) ? data : []).map((d) => {
          const parsed = parseLocation(d.location);
          return {
            id: d.id,
            name: d.name || "",
            location: d.location || "",
            phone: d.phone || "",
            email: d.email || "",
            cityForBadge: parsed.cityForBadge,
            displayLine: parsed.displayLine,
          };
        });
        if (alive) setRows(list);
      } catch (e) {
        if (alive) setErr(e?.response?.data?.message || e.message || "Failed to load distributors");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Search by name, location, phone, email
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((d) => {
      return (
        d.name.toLowerCase().includes(q) ||
        (d.location || "").toLowerCase().includes(q) ||
        (d.phone || "").toLowerCase().includes(q) ||
        (d.email || "").toLowerCase().includes(q)
      );
    });
  }, [rows, query]);

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 pb-12 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={leafIcon} alt="Leaf" className="h-24 w-24 mx-auto object-contain" />
          <h1 className="text-3xl md:text-4xl font-semibold text-green-900">Our Distributors</h1>
          <p className="mt-2 text-gray-600">
            Find an authorized National Herbs distributor near you.
          </p>
          {loading && <p className="text-sm text-gray-500 mt-2">Loading…</p>}
          {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          {/* Search */}
          <div className="w-full md:max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, location, phone, or email…"
              className="w-full rounded-full border border-green-200 bg-white/90
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                         px-5 py-3 text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <DistributorCard key={d.id} {...d} />
          ))}

          {!loading && !err && filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-16">
              No distributors found. Try a different search term.
            </div>
          )}
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl bg-white/70 ring-1 ring-green-100 p-6 md:p-8
                          flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-green-900">Become a Distributor</h3>
              <p className="text-gray-600 mt-1">
                Partner with National Herbs and bring natural wellness to your city.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/distributormailrequest"
                className="rounded-full bg-green-600 text-white font-semibold px-5 py-3 hover:bg-green-700 transition"
              >
                Email Us
              </a>

              <a
                href="/catalog.pdf"
                className="rounded-full bg-white text-green-700 border border-green-200 font-semibold px-5 py-3 hover:bg-green-50 transition"
              >
                Download Catalog
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------ Card --------------- */
function DistributorCard({ name, cityForBadge, displayLine, phone, email, location }) {
  const telHref = phone ? `tel:${String(phone).replace(/\s/g, "")}` : null;
  const mapsHref = location ? `https://maps.google.com/?q=${encodeURIComponent(location)}` : null;

  // Gmail compose instead of mailto:
  const emailHref = email
    ? gmailComposeLink(
        email,
        "Distributor inquiry from National Herbs",
        `Hello ${name || ""},\n\nI would like to inquire about your distribution services.\n\nThanks!`
      )
    : null;

  return (
    <article className="rounded-2xl bg-white shadow-sm hover:shadow-md transition ring-1 ring-gray-100 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-green-900">{name}</h3>
          {/* Under the name: "City, ZIP, Extra" */}
          {displayLine && <p className="text-sm text-gray-500">{displayLine}</p>}
        </div>

        {/* Top-right location badge shows City only */}
        {cityForBadge && (
          <span className="inline-flex items-center gap-1 text-green-700 text-sm">
            <FaMapMarkerAlt /> {cityForBadge}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1 text-sm text-gray-700">
        {location && (
          <p className="flex items-start gap-2">
            <FaMapMarkerAlt className="mt-0.5 text-green-600" />
            <span>{location}</span>
          </p>
        )}
        {phone && (
          <p className="flex items-center gap-2">
            <FaPhoneAlt className="text-green-600" />
            <a className="hover:text-green-700" href={telHref}>
              {phone}
            </a>
          </p>
        )}
        {email && (
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-green-600" />
            <a
              className="hover:text-green-700"
              href={emailHref}
              target="_blank"
              rel="noreferrer"
              title="Compose in Gmail"
            >
              {email}
            </a>
          </p>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        {telHref && (
          <a
            href={telHref}
            className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition"
          >
            <FaPhoneAlt /> Call
          </a>
        )}
        {emailHref && (
          <a
            href={emailHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white border border-green-200 text-green-700 px-4 py-2 text-sm font-medium hover:bg-green-50 transition"
            title="Compose in Gmail"
          >
            <FaEnvelope /> Email
          </a>
        )}
        {mapsHref && (
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white border border-green-200 text-green-700 px-4 py-2 text-sm font-medium hover:bg-green-50 transition"
          >
            <FaDirections /> Directions
          </a>
        )}
      </div>
    </article>
  );
}
