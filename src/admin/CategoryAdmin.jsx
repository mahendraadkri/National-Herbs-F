import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useCategories } from "./categoriesStore";

export default function CategoryAdmin() {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useCategories();
  const [form, setForm] = useState({ id: null, name: "", description: "" });
  const [showForm, setShowForm] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (form.id) updateCategory(form);
    else addCategory(form);

    setForm({ id: null, name: "", description: "" });
    setShowForm(false);
  };

  const onEdit = (c) => {
    setForm(c);
    setShowForm(true);
  };

  const onDelete = (id) => {
    if (window.confirm("Delete this category?")) deleteCategory(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-900">Manage Categories</h1>
        <button
          onClick={() => {
            setForm({ id: null, name: "", description: "" });
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 font-semibold">
            <tr>
              <th className="px-6 py-3">S.N.</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((c, idx) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{idx + 1}</td>
                <td className="px-6 py-3 font-medium">{c.name}</td>
                <td className="px-6 py-3">{c.description}</td>
                <td className="px-6 py-3 text-right space-x-2">
                  <button
                    onClick={() => onEdit(c)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              {form.id ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
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
