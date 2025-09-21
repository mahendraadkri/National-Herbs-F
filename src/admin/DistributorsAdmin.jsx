import React, { useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const REGIONS = ["Bagmati", "Gandaki", "Koshi", "Madhesh", "Lumbini", "Karnali", "Sudurpashchim"];

// Demo data (replace with API later)
const initialRows = [
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
];

export default function DistributorsAdmin() {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm());
  const [errors, setErrors] = useState({});

  function blankForm() {
    return {
      id: null,
      name: "",
      city: "",
      region: "",
      address: "",
      phone: "",
      email: "",
      map: "",
    };
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const regionOk = region === "All" || r.region === region;
      const textOk =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q);
      return regionOk && textOk;
    });
  }, [rows, query, region]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.region.trim()) e.region = "Region is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (form.phone && !/^\+?[-\d\s()]{7,}$/.test(form.phone)) e.phone = "Invalid phone";
    return e;
  };

  const openAdd = () => {
    setForm(blankForm());
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (row) => {
    setForm(row);
    setErrors({});
    setShowForm(true);
  };

  const onDelete = (id) => {
    if (window.confirm("Delete this distributor?")) {
      setRows((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    if (form.id) {
      // update
      setRows((prev) => prev.map((r) => (r.id === form.id ? form : r)));
    } else {
      // create
      setRows((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header / Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-900">Manage Distributors</h1>
          <p className="text-gray-600 text-sm">Add, edit, and remove distributors across regions.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 grid place-items-center text-gray-400">
              <FaSearch />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, city, address…"
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="py-2 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="All">All Regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

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
              <th className="px-6 py-3">City</th>
              <th className="px-6 py-3">Region</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{r.name}</td>
                <td className="px-6 py-3">{r.city}</td>
                <td className="px-6 py-3">{r.region}</td>
                <td className="px-6 py-3">
                  {r.phone ? (
                    <a className="text-green-700 hover:underline" href={`tel:${r.phone.replace(/\s/g, "")}`}>
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
                <td className="px-6 py-3">{r.address}</td>
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
                <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
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
                label="City"
                value={form.city}
                onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                error={errors.city}
                required
              />
              <div>
                <label className="text-sm text-gray-700">Region</label>
                <select
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none ${
                    errors.region
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-200 focus:ring-2 focus:ring-green-600"
                  }`}
                >
                  <option value="">Select region</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.region && <p className="text-red-600 text-sm mt-1">{errors.region}</p>}
              </div>
              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                error={errors.phone}
                placeholder="+977-1-xxxxx"
              />
              <Field
                label="Email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                error={errors.email}
                placeholder="name@example.com"
              />
              <div className="md:col-span-2">
                <Field
                  label="Address"
                  value={form.address}
                  onChange={(v) => setForm((f) => ({ ...f, address: v }))}
                  error={errors.address}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Google Maps URL (optional)"
                  value={form.map}
                  onChange={(v) => setForm((f) => ({ ...f, map: v }))}
                  placeholder="https://maps.google.com/?q=..."
                />
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

/* ---------- small controlled input field ---------- */
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
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-500"
            : "border-gray-200 focus:ring-2 focus:ring-green-600"
        }`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
