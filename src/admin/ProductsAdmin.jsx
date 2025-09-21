import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Demo data (replace with API later)
const initialProducts = [
  { id: 1, name: "Aloe Vera Facewash", price: 450, category: "Skincare" },
  { id: 2, name: "Scar Shine Cream", price: 650, category: "Skincare" },
  { id: 3, name: "Tulsi Herbal Tea", price: 300, category: "Wellness" },
];

export default function ProductsAdmin() {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({ id: null, name: "", price: "", category: "" });
  const [showForm, setShowForm] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;

    if (form.id) {
      // edit existing
      setProducts((prev) =>
        prev.map((p) => (p.id === form.id ? { ...form, price: Number(form.price) } : p))
      );
    } else {
      // add new
      setProducts((prev) => [
        ...prev,
        { ...form, id: Date.now(), price: Number(form.price) },
      ]);
    }

    setForm({ id: null, name: "", price: "", category: "" });
    setShowForm(false);
  };

  const onEdit = (p) => {
    setForm(p);
    setShowForm(true);
  };

  const onDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-900">Manage Products</h1>
        <button
          onClick={() => {
            setForm({ id: null, name: "", price: "", category: "" });
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 font-semibold">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price (NPR)</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{p.id}</td>
                <td className="px-6 py-3 font-medium">{p.name}</td>
                <td className="px-6 py-3">{p.category}</td>
                <td className="px-6 py-3">Rs. {p.price}</td>
                <td className="px-6 py-3 text-right space-x-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              {form.id ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Price (NPR)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
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
