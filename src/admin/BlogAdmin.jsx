// BlogAdmin.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { api } from "../api/client";

function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function mapApiBlogToRow(b) {
  const created = b.created_at ? new Date(b.created_at) : null;
  const updated = b.updated_at ? new Date(b.updated_at) : created;
  return {
    id: b.id,
    title: b.title || "",
    slug: slugify(b.title || ""),
    author: b.blog_by || "—",
    cover: b.image_url || "",
    summary: (b.description || "").slice(0, 160),
    content: b.description || "",
    publishedAt: created ? created.toISOString().slice(0, 10) : "",
    updatedAt: updated ? updated.toISOString().slice(0, 10) : "",
  };
}

export default function BlogAdmin() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // local preview
  const [previewUrl, setPreviewUrl] = useState("");
  const previewUrlRef = useRef("");

  // FLASH message state
  const [flash, setFlash] = useState({ show: false, type: "success", message: "" });
  const flashTimer = useRef(null);

  function blankForm() {
    return {
      id: null,
      title: "",
      slug: "",
      author: "",
      cover: "",        // server URL of existing image (edit)
      imageFile: null,  // local File (add/edit)
      summary: "",
      content: "",
      publishedAt: "",
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  }

  // helper: show flash for ~3.5s
  const showFlash = (message, type = "success", durationMs = 3500) => {
    // clear previous
    if (flashTimer.current) {
      clearTimeout(flashTimer.current);
      flashTimer.current = null;
    }
    setFlash({ show: true, type, message });
    flashTimer.current = setTimeout(() => {
      setFlash((f) => ({ ...f, show: false }));
      flashTimer.current = null;
    }, durationMs);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/blogs");
        const list = (data?.data || []).map(mapApiBlogToRow);
        if (alive) setRows(list);
      } catch (e) {
        if (alive) {
          const msg = e?.response?.data?.message || e.message || "Failed to load blogs";
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.author || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.content.trim()) e.content = "Description is required";
    return e;
  };

  const openAdd = () => {
    cleanupPreview();
    setForm(blankForm());
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (row) => {
    cleanupPreview();
    setForm({
      ...row,
      imageFile: null, // no new file yet
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setErrors({});
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/api/blogs/${id}`);
      setRows((prev) => prev.filter((r) => r.id !== id));
      showFlash("Post deleted successfully.", "success");
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
        // EDIT: multipart (image optional)
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.content);
        if (form.imageFile) fd.append("image", form.imageFile); // adjust key if needed
        // If your backend uses PUT/PATCH, add: fd.append('_method','PUT')
        const { data } = await api.post(`/api/blogs/${form.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const updated = data?.data ? mapApiBlogToRow(data.data) : mapApiBlogToRow({
          ...form,
          image_url: form.cover,
          description: form.content,
          updated_at: new Date().toISOString(),
        });

        setRows((prev) => prev.map((r) => (r.id === form.id ? { ...r, ...updated } : r)));
        showFlash("Post updated successfully.", "success");
      } else {
        // ADD: multipart
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.content);
        if (form.imageFile) fd.append("image", form.imageFile); // adjust key if needed
        const { data } = await api.post(`/api/blogs`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newRow = mapApiBlogToRow(data?.data || {});
        setRows((prev) => [newRow, ...prev]);
        showFlash("Post created successfully.", "success");
      }

      setShowForm(false);
      cleanupPreview();
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Save failed";
      showFlash(msg, "error");
    }
  };

  // local preview handling
  const onPickImage = (file) => {
    setForm((f) => ({ ...f, imageFile: file }));
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      previewUrlRef.current = url;
    } else {
      cleanupPreview();
    }
  };

  const cleanupPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
    setPreviewUrl("");
  };

  const closeModal = () => {
    setShowForm(false);
    cleanupPreview();
  };

  return (
    <div className="space-y-6 relative">
      {/* Flash message (top of screen) */}
      <Flash show={flash.show} type={flash.type} onClose={() => setFlash((f) => ({ ...f, show: false }))}>
        {flash.message}
      </Flash>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-900">Manage Blog Posts</h1>
          <p className="text-gray-600 text-sm">Create, edit and publish articles.</p>
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
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
          >
            <FaPlus /> Add Blogs
          </button>
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-gray-600">Loading blogs…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {/* Table */}
      {!loading && !err && (
        <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-gray-600 font-semibold">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Image</th>
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
                    <div className="h-12 w-20 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200">
                      <img
                        src={r.cover || "https://via.placeholder.com/160x96?text=No+Image"}
                        alt={r.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
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
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              {form.id ? "Edit Post" : "New Post"}
            </h2>

            {/* Shared Add/Edit simplified UI */}
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
              {/* Title */}
              <Field
                label="Title"
                value={form.title}
                onChange={(v) => setForm((f) => ({ ...f, title: v }))}
                error={errors.title}
                required
              />

              {/* Image picker */}
              <div>
                <label className="text-sm text-gray-700">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickImage(e.target.files?.[0] || null)}
                  className="mt-1 block w-full rounded-lg border px-4 py-2"
                />

                {/* Existing image (edit) shown only if no new preview */}
                {!previewUrl && form.id && form.cover && (
                  <div className="mt-3">
                    <div className="h-28 w-28 aspect-square overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 grid place-items-center">
                      <img
                        src={form.cover}
                        alt="Current cover"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current image.</p>
                  </div>
                )}

                {/* New local preview */}
                {previewUrl && (
                  <div className="mt-3">
                    <div className="h-28 w-28 aspect-square overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 grid place-items-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Local preview only. Image uploads on Save.
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <Field
                label="Description"
                textarea
                rows={6}
                value={form.content}
                onChange={(v) => setForm((f) => ({ ...f, content: v }))}
                error={errors.content}
                required
              />

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
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

/* ---------- Flash component ---------- */
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
