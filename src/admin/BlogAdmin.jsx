import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCheckCircle,
} from "react-icons/fa";

const STATUSES = ["Draft", "Published"];

// Demo data
const initialPosts = [
  {
    id: 1,
    title: "Benefits of Aloe Vera for Skin",
    slug: "benefits-of-aloe-vera-for-skin",
    author: "Team National Herbs",
    status: "Published",
    tags: ["skincare", "aloe"],
    cover:
      "https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=1200&auto=format&fit=crop",
    summary: "Why aloe vera is a staple for hydration and calming the skin.",
    content: "Long form content here...",
    publishedAt: "2025-02-05",
    updatedAt: "2025-02-10",
  },
  {
    id: 2,
    title: "Guide: Chemical-Free Hair Care",
    slug: "guide-chemical-free-hair-care",
    author: "NH Editorial",
    status: "Draft",
    tags: ["hair care", "guide"],
    cover: "",
    summary: "How to pick shampoos and conditioners without harsh sulfates.",
    content: "",
    publishedAt: "",
    updatedAt: "2025-03-01",
  },
];

export default function BlogAdmin() {
  const [rows, setRows] = useState(initialPosts);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm());
  const [errors, setErrors] = useState({});

  function blankForm() {
    return {
      id: null,
      title: "",
      slug: "",
      author: "",
      status: "Draft",
      tags: "",
      cover: "",
      summary: "",
      content: "",
      publishedAt: "",
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const statusOk = status === "All" || r.status === status;
      const textOk =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.tags.join(",").toLowerCase().includes(q);
      return statusOk && textOk;
    });
  }, [rows, query, status]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (form.slug && !/^[a-z0-9-]+$/.test(form.slug))
      e.slug = "Use lowercase letters, numbers and hyphens only";
    return e;
  };

  const openAdd = () => {
    setForm(blankForm());
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (row) => {
    setForm({
      ...row,
      tags: row.tags?.join(", "),
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setErrors({});
    setShowForm(true);
  };

  const onDelete = (id) => {
    if (window.confirm("Delete this post?")) {
      setRows((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    const payload = {
      ...form,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    if (payload.id) {
      // update
      setRows((prev) => prev.map((r) => (r.id === payload.id ? payload : r)));
    } else {
      // create
      setRows((prev) => [
        ...prev,
        {
          ...payload,
          id: Date.now(),
          updatedAt: new Date().toISOString().slice(0, 10),
        },
      ]);
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header / Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-900">
            Manage Blog Posts
          </h1>
          <p className="text-gray-600 text-sm">
            Create, edit and publish articles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 grid place-items-center text-gray-400">
              <FaSearch />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, slug, author…"
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="py-2 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="All">All Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
          >
            <FaPlus /> New Post
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 font-semibold">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">Updated</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{r.title}</td>
                <td className="px-6 py-3">{r.slug}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      r.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <FaCheckCircle
                      className={
                        r.status === "Published" ? "opacity-100" : "opacity-50"
                      }
                    />
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-3">{r.author || "—"}</td>
                <td className="px-6 py-3">{r.updatedAt || "—"}</td>
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
                <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              {form.id ? "Edit Post" : "New Post"}
            </h2>
            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Field
                label="Title"
                value={form.title}
                onChange={(v) => setForm((f) => ({ ...f, title: v }))}
                error={errors.title}
                required
              />
              <Field
                label="Slug"
                value={form.slug}
                onChange={(v) => setForm((f) => ({ ...f, slug: v }))}
                error={errors.slug}
                placeholder="lowercase-with-hyphens"
                required
              />
              <Field
                label="Author"
                value={form.author}
                onChange={(v) => setForm((f) => ({ ...f, author: v }))}
              />
              <div>
                <label className="text-sm text-gray-700">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Tags (comma separated)"
                value={form.tags}
                onChange={(v) => setForm((f) => ({ ...f, tags: v }))}
                placeholder="skincare, aloe, wellness"
              />
              <Field
                label="Cover Image URL"
                value={form.cover}
                onChange={(v) => setForm((f) => ({ ...f, cover: v }))}
                placeholder="https://…"
              />
              <div className="md:col-span-2">
                <Field
                  label="Summary"
                  value={form.summary}
                  onChange={(v) => setForm((f) => ({ ...f, summary: v }))}
                  textarea
                  rows={2}
                  placeholder="Short description shown on listing cards"
                />
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Content"
                  value={form.content}
                  onChange={(v) => setForm((f) => ({ ...f, content: v }))}
                  textarea
                  rows={6}
                  placeholder="Write your article content here…"
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
function Field({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder = "",
  textarea = false,
  rows = 3,
}) {
  const cls = `mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none ${
    error
      ? "border-red-500 focus:ring-2 focus:ring-red-500"
      : "border-gray-200 focus:ring-2 focus:ring-green-600"
  }`;
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
        />
      ) : (
        <input
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
