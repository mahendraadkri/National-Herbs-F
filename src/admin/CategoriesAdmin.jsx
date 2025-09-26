import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { api } from "../api/client";

/* ---------------- helpers ---------------- */
function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function mapApiCategoryToRow(c) {
  const created = c.created_at ? new Date(c.created_at) : null;
  const updated = c.updated_at ? new Date(c.updated_at) : created;
  return {
    id: c.id,
    name: c.name || "",
    slug: c.slug || slugify(c.name || ""),
    description: c.description || "",
    createdAt: created ? created.toISOString().slice(0, 10) : "",
    updatedAt: updated ? updated.toISOString().slice(0, 10) : "",
  };
}

/* ---------------- main component ---------------- */
export default function CategoriesAdmin() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm());
  const [errors, setErrors] = useState({});

  // flash
  const [flash, setFlash] = useState({ show: false, type: "success", message: "" });
  const flashTimer = useRef(null);
  const showFlash = (message, type = "success", duration = 3000) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setFlash({ show: true, type, message });
    flashTimer.current = setTimeout(() => setFlash((f) => ({ ...f, show: false })), duration);
  };

  function blankForm() {
    return {
      id: null,
      name: "",
      slug: "",
      originalSlug: "", // used for update URL
      description: "",
    };
  }

  // load
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get("/api/categories"); // expecting { categories: [...] }
        const arr = data?.categories || [];
        const list = arr.map(mapApiCategoryToRow);
        if (alive) setRows(list);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || "Failed to load categories";
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

  // filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.slug || "").toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  // form validation
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    return e;
  };

  const openAdd = () => {
    setForm(blankForm());
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (row) => {
    setForm({
      id: row.id,
      name: row.name,
      slug: row.slug,            // display current slug
      originalSlug: row.slug,    // use this in URL for update
      description: row.description,
    });
    setErrors({});
    setShowForm(true);
  };

  const onDelete = async (row) => {
    if (!window.confirm(`Delete category "${row.name}"?`)) return;
    try {
      // DELETE by slug
      await api.delete(`/api/categories/${row.slug}`);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      showFlash("Category deleted successfully.", "success");
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

    try {
      if (form.id) {
        // UPDATE by originalSlug, let backend regenerate slug if needed
        const payload = {
          name: form.name,
          description: form.description,
          _method: "PUT",
        };
        const targetSlug = form.originalSlug || form.slug;
        const { data } = await api.post(`/api/categories/${targetSlug}`, payload);

        const updated = data?.category
          ? mapApiCategoryToRow(data.category)
          : mapApiCategoryToRow({
              id: form.id,
              name: form.name,
              slug: slugify(form.name),
              description: form.description,
              updated_at: new Date().toISOString(),
            });

        setRows((prev) => prev.map((r) => (r.id === form.id ? { ...r, ...updated } : r)));
        // refresh both slugs for any subsequent edits in the same modal session
        setForm((f) => ({ ...f, slug: updated.slug, originalSlug: updated.slug }));
        showFlash("Category updated successfully.", "success");
      } else {
        // CREATE
        const payload = { name: form.name, description: form.description };
        const { data } = await api.post(`/api/categories`, payload);
        const newRow = data?.category
          ? mapApiCategoryToRow(data.category)
          : mapApiCategoryToRow({
              id: Math.random(),
              name: form.name,
              slug: slugify(form.name),
              description: form.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

        setRows((prev) => [newRow, ...prev]);
        showFlash("Category created successfully.", "success");
      }

      setShowForm(false);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Save failed";
      showFlash(msg, "error");
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Flash */}
      <Flash show={flash.show} type={flash.type} onClose={() => setFlash((f) => ({ ...f, show: false }))}>
        {flash.message}
      </Flash>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-900">Manage Categories</h1>
          <p className="text-gray-600 text-sm">Create, edit and remove categories used by your products.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 grid place-items-center text-gray-400">
              <FaSearch />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, slug, description…"
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-gray-600">Loading categories…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {/* Table */}
      {!loading && !err && (
        <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-gray-600 font-semibold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Updated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{r.name}</td>
                  <td className="px-6 py-3">{r.slug}</td>
                  <td className="px-6 py-3 max-w-[440px] truncate" title={r.description}>
                    {r.description || "—"}
                  </td>
                  <td className="px-6 py-3">{r.updatedAt || "—"}</td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(r)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(r)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              {form.id ? "Edit Category" : "New Category"}
            </h2>

            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                error={errors.name}
                required
              />
              <Field
                label="Slug"
                value={form.id ? form.slug : slugify(form.name)} // show current or preview
                onChange={(v) => setForm((f) => ({ ...f, slug: v }))}
                disabled
                help="Slug is auto-generated by the backend and shown here for reference."
              />
              <Field
                label="Description"
                textarea
                rows={4}
                value={form.description}
                onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
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

/* ---------------- small UI bits ---------------- */
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

function Field({
  label,
  value,
  onChange = () => {},
  error,
  required = false,
  placeholder = "",
  textarea = false,
  rows = 3,
  disabled = false,
  help = "",
}) {
  const cls = `mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none ${
    error
      ? "border-red-500 focus:ring-2 focus:ring-red-500"
      : "border-gray-200 focus:ring-2 focus:ring-green-600"
  } ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`;

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
          rows={rows}
          className={cls}
          disabled={disabled}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
          disabled={disabled}
        />
      )}
      {help && <p className="text-gray-500 text-xs mt-1">{help}</p>}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
