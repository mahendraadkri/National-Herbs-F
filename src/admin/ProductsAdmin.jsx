import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import { useCategories } from "./categoriesStore";

// Demo data (swap with API later)
const initialProducts = [
  {
    id: 1,
    name: "Aloe Vera Facewash",
    category: "Skincare",
    oldPrice: 500,
    newPrice: 450,
    description: "Hydrating facewash with pure aloe for daily use.",
    image: "/products/aloe-facewash.jpg",
  },
  {
    id: 2,
    name: "Scar Shine Cream",
    category: "Skincare",
    oldPrice: 700,
    newPrice: 650,
    description: "Targets spots and scars for even skin tone.",
    image: "/products/scar-shine.jpg",
  },
  {
    id: 3,
    name: "Tulsi Herbal Tea",
    category: "Wellness",
    oldPrice: 350,
    newPrice: 300,
    description: "Calming antioxidant-rich tulsi tea.",
    image: "/products/tulsi-tea.jpg",
  },
];

export default function ProductsAdmin() {
  const { categories } = useCategories();
  const [rows, setRows] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm());
  const [errors, setErrors] = useState({});

  function blankForm() {
    return {
      id: null,
      name: "",
      category: "",
      oldPrice: "",
      newPrice: "",
      description: "",
      image: "",
    };
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (form.oldPrice !== "" && Number(form.oldPrice) < 0) e.oldPrice = "Must be ≥ 0";
    if (form.newPrice === "" || Number(form.newPrice) < 0)
      e.newPrice = "New price is required";
    if (form.image && !isLikelyUrl(form.image))
      e.image = "Provide a valid image URL or leave blank";
    return e;
  };

  const isLikelyUrl = (s) => /^(https?:\/\/|\/)/i.test(s); // http(s)://... or /path.jpg

  const openAdd = () => {
    setForm(blankForm());
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (row) => {
    setForm({
      id: row.id,
      name: row.name,
      category: row.category,
      oldPrice: row.oldPrice ?? "",
      newPrice: row.newPrice ?? "",
      description: row.description ?? "",
      image: row.image ?? "",
    });
    setErrors({});
    setShowForm(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    const payload = {
      ...form,
      oldPrice: form.oldPrice === "" ? null : Number(form.oldPrice),
      newPrice: Number(form.newPrice),
    };

    if (payload.id) {
      setRows((prev) => prev.map((r) => (r.id === payload.id ? payload : r)));
    } else {
      setRows((prev) => [...prev, { ...payload, id: Date.now() }]);
    }

    setShowForm(false);
  };

  const onDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      setRows((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const cellPrice = (v) =>
    v == null || v === "" ? "—" : `Rs. ${Number(v).toLocaleString()}`;

  const truncate = (txt, n = 80) =>
    !txt ? "—" : txt.length > n ? txt.slice(0, n) + "…" : txt;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-900">Manage Products</h1>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100 bg-white">
        <table className="min-w-[1080px] w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3">S.N.</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Old Price</th>
              <th className="px-4 py-3">New Price</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Picture</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, idx) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3">{r.category || "—"}</td>
                <td className="px-4 py-3">{cellPrice(r.oldPrice)}</td>
                <td className="px-4 py-3 font-semibold text-green-800">
                  {cellPrice(r.newPrice)}
                </td>
                <td className="px-4 py-3">{truncate(r.description)}</td>
                <td className="px-4 py-3">
                  {r.image ? (
                    <div className="h-12 w-12 rounded-lg overflow-hidden ring-1 ring-gray-200 bg-gray-50">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-400">
                      <FaImage /> No image
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
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
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-6 text-center text-gray-500">
                  No products found.
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
              {form.id ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                error={errors.name}
                required
              />

              {/* Category dropdown from shared store */}
              <div>
                <label className="text-sm text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                {categories.length ? (
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none ${
                      errors.category
                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                        : "border-gray-200 focus:ring-2 focus:ring-green-600"
                    }`}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-1 text-sm">
                    <span className="text-gray-600">No categories yet. </span>
                    <a href="/admin/categories" className="text-green-700 hover:underline">
                      Create one first
                    </a>
                  </div>
                )}
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <Field
                label="Old Price (NPR)"
                type="number"
                value={form.oldPrice}
                onChange={(v) => setForm((f) => ({ ...f, oldPrice: v }))}
                error={errors.oldPrice}
                placeholder="Optional"
              />
              <Field
                label="New Price (NPR)"
                type="number"
                value={form.newPrice}
                onChange={(v) => setForm((f) => ({ ...f, newPrice: v }))}
                error={errors.newPrice}
                required
              />
              <div className="md:col-span-2">
                <Field
                  label="Description"
                  textarea
                  rows={3}
                  value={form.description}
                  onChange={(v) => setForm((f) => ({ ...f, description: v }))}
                  placeholder="Short description…"
                />
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Picture URL"
                  value={form.image}
                  onChange={(v) => setForm((f) => ({ ...f, image: v }))}
                  error={errors.image}
                  placeholder="https://… or /products/your-image.jpg"
                />
                {form.image ? (
                  <div className="mt-2 inline-flex items-center gap-3">
                    <div className="h-16 w-16 rounded-lg overflow-hidden ring-1 ring-gray-200 bg-gray-50">
                      <img
                        src={form.image}
                        alt="preview"
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </div>
                    <span className="text-xs text-gray-500">Preview</span>
                  </div>
                ) : null}
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

/* ---------- small reusable field ---------- */
function Field({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder = "",
  type = "text",
  textarea = false,
  rows = 2,
}) {
  const cls =
    `mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none ` +
    (error
      ? "border-red-500 focus:ring-2 focus:ring-red-500"
      : "border-gray-200 focus:ring-2 focus:ring-green-600");

  return (
    <div>
      <label className="text-sm text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
