import React, { useEffect, useMemo, useState, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { api } from "../api/client"; // <-- must send Sanctum token/cookies

export default function DistributorsAdmin() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // flash message (3.5s)
  const [flash, setFlash] = useState({ show: false, type: "success", message: "" });
  const flashTimer = useRef(null);
  const showFlash = (message, type = "success", duration = 3500) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setFlash({ show: true, type, message });
    flashTimer.current = setTimeout(() => setFlash((f) => ({ ...f, show: false })), duration);
  };

  function blankForm() {
    return {
      id: null,
      name: "",
      phone: "",
      email: "",
      // location builder fields
      city: "",
      zip: "",
      location: "", // extra detail (street/area/landmark). We'll compose the final location sent to API.
    };
  }

  // helper: compose final location string that we save to backend
  const composeLocation = (city, zip, extra) => {
    const c = (city || "").trim();
    const z = (zip || "").trim();
    const e = (extra || "").trim();
    if (!c && !z && !e) return "";
    const left = `${c}${z ? ` ${z}` : ""}`.trim();
    return left && e ? `${left} — ${e}` : left || e; // "City 44600 — Extra"
  };

  // Load from Laravel
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/distributors");
        if (alive) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || "Failed to load distributors";
        if (alive) {
          setErr(msg);
          showFlash(msg, "error");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  // Search filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const name = (r.name || "").toLowerCase();
      const loc = (r.location || "").toLowerCase();
      const phone = (r.phone || "").toLowerCase();
      const email = (r.email || "").toLowerCase();
      return !q || name.includes(q) || loc.includes(q) || phone.includes(q) || email.includes(q);
    });
  }, [rows, query]);

  // FE validation consistent with backend (+ city/zip rules)
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.city.trim()) e.city = "City is required";
    if (form.zip && !/^\d{5}$/.test(form.zip.trim())) e.zip = "ZIP should be 5 digits";
    // Compose final location for validation against backend requirement
    const finalLocation = composeLocation(form.city, form.zip, form.location);
    if (!finalLocation) e.location = "Location is required (City is mandatory)";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!/^(98|97)[0-9]{8}$/.test(form.phone.trim()))
      e.phone = "Phone must be a 10-digit Nepali mobile starting with 98 or 97";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Invalid email";
    return e;
  };

  const openAdd = () => {
    setForm(blankForm());
    setErrors({});
    setShowForm(true);
  };

  // Attempt to parse existing "location" into { city, zip, extra }
  const parseExistingLocation = (loc = "") => {
    const out = { city: "", zip: "", extra: "" };
    if (!loc) return out;
    // Format we expect to support: "City 44600 — Extra", "City-Extra", "City, Extra", or just "City"
    const parts = String(loc).split("—");
    const left = parts[0].trim(); // "City 44600" or "City, Extra-left"
    const extra = parts.slice(1).join("—").trim(); // everything after em dash
    // extract city + zip from left. City may contain commas/spaces.
    const m = left.match(/^(.+?)[,\s-]*(\d{5})?$/); // capture city + optional 5-digit zip
    if (m) {
      out.city = (m[1] || "").trim().replace(/[,-]$/, "").trim();
      out.zip = (m[2] || "").trim();
    } else {
      out.city = left;
    }
    // if no explicit em-dash, try to split by comma for extra details
    if (!extra && left.includes(",")) {
      const [c, ...rest] = left.split(",");
      out.city = (c || "").trim();
      out.extra = rest.join(",").trim();
    } else {
      out.extra = extra;
    }
    return out;
  };

  const openEdit = (row) => {
    const parsed = parseExistingLocation(row.location || "");
    setForm({
      id: row.id,
      name: row.name || "",
      phone: row.phone || "",
      email: row.email || "",
      city: parsed.city || "",
      zip: parsed.zip || "",
      location: parsed.extra || "",
    });
    setErrors({});
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this distributor?")) return;
    try {
      await api.delete(`/api/distributors/${id}`);
      setRows((prev) => prev.filter((r) => r.id !== id));
      showFlash("Distributor deleted successfully.", "success");
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Delete failed";
      showFlash(msg, "error");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    const finalLocation = composeLocation(form.city, form.zip, form.location);

    try {
      if (form.id) {
        // UPDATE (auth required) — using POST + _method=PUT
        const payload = {
          _method: "PUT",
          name: form.name.trim(),
          location: finalLocation,
          phone: form.phone.trim(),
          email: form.email.trim(),
        };
        const { data } = await api.post(`/api/distributors/${form.id}`, payload);
        const updated = data?.data ?? { ...payload, id: form.id };
        setRows((prev) => prev.map((r) => (r.id === form.id ? { ...r, ...updated } : r)));
        showFlash("Distributor updated successfully.", "success");
      } else {
        // CREATE (auth required)
        const payload = {
          name: form.name.trim(),
          location: finalLocation,
          phone: form.phone.trim(),
          email: form.email.trim(),
        };
        const { data } = await api.post(`/api/distributors`, payload);
        const created = data?.data ?? payload;
        setRows((prev) => [...prev, created]);
        showFlash("Distributor created successfully.", "success");
      }
      setShowForm(false);
    } catch (e) {
      const resp = e?.response?.data;
      if (resp?.errors) {
        const fieldErrors = {};
        Object.entries(resp.errors).forEach(([k, v]) => (fieldErrors[k] = Array.isArray(v) ? v[0] : String(v)));
        setErrors(fieldErrors);
      }
      const msg = resp?.message || e.message || "Save failed";
      showFlash(msg, "error");
    }
  };

  // live preview string for final location
  const locationPreview = composeLocation(form.city, form.zip, form.location);

  return (
    <div className="space-y-6 relative">
      {/* Flash */}
      <Flash show={flash.show} type={flash.type} onClose={() => setFlash((f) => ({ ...f, show: false }))}>
        {flash.message}
      </Flash>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-900">Manage Distributors</h1>
          <p className="text-gray-600 text-sm">Add, edit, and remove distributors.</p>
          {loading && <p className="text-xs text-gray-500 mt-1">Loading…</p>}
          {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 grid place-items-center text-gray-400">
              <FaSearch />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, location, phone, email…"
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
          >
            <FaPlus /> Add Distributor
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 font-semibold">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{r.name}</td>
                <td className="px-6 py-3">
                  {r.phone ? (
                    <a className="text-green-700 hover:underline" href={`tel:${r.phone}`}>
                      {r.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-6 py-3">
                  {r.email ? (
                    <a className="text-green-700 hover:underline" href={`mailto:${r.email}`}>
                      {r.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-6 py-3">{r.location || "—"}</td>
                <td className="px-6 py-3 text-right space-x-2">
                  <button
                    onClick={() => openEdit(r)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
                  No distributors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              {form.id ? "Edit Distributor" : "Add Distributor"}
            </h2>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                error={errors.name}
                required
              />
              <Field
                label="Phone (e.g., 9812345678)"
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                error={errors.phone}
                required
              />
              <Field
                label="Email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                error={errors.email}
                required
              />

              {/* City + ZIP */}
              <Field
                label="City"
                value={form.city}
                onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                error={errors.city}
                placeholder="e.g., Kathmandu"
                required
              />
              <Field
                label="ZIP (optional)"
                value={form.zip}
                onChange={(v) => setForm((f) => ({ ...f, zip: v }))}
                error={errors.zip}
                placeholder="e.g., 44600"
              />

              {/* Extra location details */}
              <div className="md:col-span-2">
                <Field
                  label="Extra location details (street/area/landmark)"
                  value={form.location}
                  onChange={(v) => setForm((f) => ({ ...f, location: v }))}
                  error={errors.location}
                  placeholder="e.g., Nayabazar, Sorakhutte"
                />
                {/* Live preview of final location format */}
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-medium">Final location to be saved: </span>
                  <span className="font-mono">
                    {locationPreview || "— (enter city and optional ZIP/extra details)"}
                  </span>
                </p>
                <p className="text-[11px] text-gray-500">
                  Format: <span className="font-mono">City[ SPACE ZIP][ — Extra]</span> (example:{" "}
                  <span className="font-mono">Kathmandu 44600 — Nayabazar, Sorakhutte</span>)
                </p>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Flash (top) ---------- */
function Flash({ show, type = "success", children, onClose }) {
  if (!show) return null;
  const isSuccess = type === "success";
  const wrap =
    "fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-xl shadow-lg rounded-xl border px-4 py-3 flex items-start gap-3";
  const cls = isSuccess
    ? "bg-green-50 border-green-200 text-green-800"
    : "bg-red-50 border-red-200 text-red-800";

  return (
    <div
      className={`${wrap} ${cls}`}
      role={isSuccess ? "status" : "alert"}
      aria-live={isSuccess ? "polite" : "assertive"}
    >
      <div className="text-sm flex-1">{children}</div>
      <button
        onClick={onClose}
        className="text-xs font-medium underline decoration-dotted hover:opacity-80"
        aria-label="Dismiss notification"
      >
        X
      </button>
    </div>
  );
}

/* ---------- Field ---------- */
function Field({ label, value, onChange, error, required = false, placeholder = "" }) {
  return (
    <div>
      <label className="text-sm text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none ${
          error ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:ring-2 focus:ring-green-600"
        }`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
