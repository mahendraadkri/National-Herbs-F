import React, { useMemo, useState } from "react";
import {
  FaLeaf,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaDirections,
} from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png"; // your leaf mark

const RAW_DISTRIBUTORS = [
  {
    id: 1,
    name: "Green Valley Traders",
    city: "Kathmandu",
    region: "Bagmati",
    address: "Nayabazar, Sorakhutte, Kathmandu",
    phone: "+977-1-591457",
    email: "sales@greenvalley.com",
    map: "https://maps.google.com/?q=Nayabazar,Sorakhutte,Kathmandu",
  },
  {
    id: 2,
    name: "Herbal House Lalitpur",
    city: "Lalitpur",
    region: "Bagmati",
    address: "Kupondole-2, Lalitpur",
    phone: "+977-1-554-2211",
    email: "hello@herbalhouse.com",
    map: "https://maps.google.com/?q=Kupondole-2,Lalitpur",
  },
  {
    id: 3,
    name: "Everest Naturals",
    city: "Pokhara",
    region: "Gandaki",
    address: "Amarsingh Chowk, Pokhara",
    phone: "+977-61-520520",
    email: "contact@everestnaturals.com",
    map: "https://maps.google.com/?q=Amarsingh+Chowk,Pokhara",
  },
  {
    id: 4,
    name: "Birat Herbal Mart",
    city: "Biratnagar",
    region: "Koshi",
    address: "Main Rd, Biratnagar",
    phone: "+977-21-470470",
    email: "info@biratherbal.com",
    map: "https://maps.google.com/?q=Biratnagar",
  },
  {
    id: 5,
    name: "Janakpur Wellness",
    city: "Janakpur",
    region: "Madhesh",
    address: "Janak Chowk, Janakpur",
    phone: "+977-41-520520",
    email: "team@janakwellness.com",
    map: "https://maps.google.com/?q=Janak+Chowk,Janakpur",
  },
];

export default function Distributors() {
  const regions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(RAW_DISTRIBUTORS.map((d) => d.region))),
    ],
    []
  );

  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("All");

  const filtered = useMemo(() => {
    return RAW_DISTRIBUTORS.filter((d) => {
      const matchesRegion = activeRegion === "All" || d.region === activeRegion;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q);
      return matchesRegion && matchesQuery;
    });
  }, [query, activeRegion]);

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 pb-12">
        {/* Header */} 
        <div className="text-center mb-8">
          <img
            src={leafIcon}
            alt="Leaf"
            className="h-24 w-24 mx-auto object-contain"
          />
          <h1 className="text-3xl md:text-4xl font-semibold text-green-900">
            Our Distributors
          </h1>
          <p className="mt-2 text-gray-600">
            Find an authorized National Herbs distributor near you.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          {/* Search */}
          <div className="w-full md:max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, city, or address…"
              className="w-full rounded-full border border-green-200 bg-white/90
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                         px-5 py-3 text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Region chips */}
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                    activeRegion === r
                      ? "bg-green-600 text-white"
                      : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-100"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <DistributorCard key={d.id} {...d} />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-16">
              No distributors found. Try a different region or search term.
            </div>
          )}
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="rounded-2xl bg-white/70 ring-1 ring-green-100 p-6 md:p-8
                          flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-green-900">
                Become a Distributor
              </h3>
              <p className="text-gray-600 mt-1">
                Partner with National Herbs and bring natural wellness to your
                city.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="mailto:info@nationalherbs.com?subject=Distributor%20Inquiry"
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
function DistributorCard({ name, city, region, address, phone, email, map }) {
  return (
    <article className="rounded-2xl bg-white shadow-sm hover:shadow-md transition ring-1 ring-gray-100 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-green-900">{name}</h3>
          <p className="text-sm text-gray-500">
            {city}, {region}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-green-700 text-sm">
          <FaMapMarkerAlt /> {city}
        </span>
      </div>

      <div className="mt-4 space-y-1 text-sm text-gray-700">
        <p className="flex items-start gap-2">
          <FaMapMarkerAlt className="mt-0.5 text-green-600" />
          <span>{address}</span>
        </p>
        <p className="flex items-center gap-2">
          <FaPhoneAlt className="text-green-600" />
          <a
            className="hover:text-green-700"
            href={`tel:${phone.replace(/\s/g, "")}`}
          >
            {phone}
          </a>
        </p>
        <p className="flex items-center gap-2">
          <FaEnvelope className="text-green-600" />
          <a className="hover:text-green-700" href={`mailto:${email}`}>
            {email}
          </a>
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition"
        >
          <FaPhoneAlt /> Call
        </a>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 rounded-full bg-white border border-green-200 text-green-700 px-4 py-2 text-sm font-medium hover:bg-green-50 transition"
        >
          <FaEnvelope /> Email
        </a>
        <a
          href={map}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white border border-green-200 text-green-700 px-4 py-2 text-sm font-medium hover:bg-green-50 transition"
        >
          <FaDirections /> Directions
        </a>
      </div>
    </article>
  );
}
