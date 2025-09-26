import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaImages } from "react-icons/fa";
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

function mapApiProductToRow(p) {
  const created = p.created_at ? new Date(p.created_at) : null;
  const updated = p.updated_at ? new Date(p.updated_at) : created;
  return {
    id: p.id,
    slug: p.slug || slugify(p.name || ""),
    name: p.name || "",
    categoryId: p.category_id || p?.category?.id || "",
    categoryName: p?.category?.name || "—",
    price: Number(p.price ?? 0),
    oldPrice: p.old_price != null ? Number(p.old_price) : "",
    description: p.description || "",
    images: Array.isArray(p.images) ? p.images : [], // array of URLs from API
    cover: Array.isArray(p.images) && p.images.length ? p.images[0] : "",
    createdAt: created ? created.toISOString().slice(0, 10) : "",
    updatedAt: updated ? updated.toISOString().slice(0, 10) : "",
  };
}

/* ----------- small UI bits shared (Flash + Field + Pill) ----------- */
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
  type = "text",
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

function Pill({ children }) {
  return (
    <span className="text-xs rounded-full bg-green-100 text-green-800 px-2 py-0.5">
      {children}
    </span>
  );
}

/* ---------------- NEW: Image Gallery Modal ---------------- */
function GalleryModal({ title, images, onClose }) {
  // lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-label={`${title || "Product"} image gallery`}
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-green-900 truncate">
              {title || "Images"}
            </h3>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
            >
              ← Go Back
            </button>
          </div>

          {/* Images grid */}
          {Array.isArray(images) && images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((src, idx) => (
                <a
                  key={src + idx}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="group block aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200 hover:ring-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                  title="Open original"
                >
                  <img
                    src={src}
                    alt={`image ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No images.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- main component ---------------- */
export default function ProductsAdmin() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]); // {id, name}
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Modal form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm());
  const [errors, setErrors] = useState({});

  // image previews (local)
  const [newFiles, setNewFiles] = useState([]); // File[]
  const [newPreviews, setNewPreviews] = useState([]); // object URLs
  const previewUrlsRef = useRef([]);

  // removing old images (by URL string, as backend normalizes)
  const [removeList, setRemoveList] = useState([]);

  // Flash message
  const [flash, setFlash] = useState({ show: false, type: "success", message: "" });
  const flashTimer = useRef(null);
  const showFlash = (message, type = "success", durationMs = 3500) => {
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

  function blankForm() {
    return {
      id: null,
      slug: "",
      name: "",
      categoryId: "",
      price: "",
      oldPrice: "",
      description: "",
      images: [], // existing URLs
    };
  }

  // Load products + categories
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const [prodRes, catRes] = await Promise.all([
          api.get("/api/products"),
          api.get("/api/categories"),
        ]);

        const arr = Array.isArray(prodRes?.data?.data) ? prodRes.data.data : [];
        const list = arr.map(mapApiProductToRow);
        const cats = (catRes?.data?.categories || []).map((c) => ({
          id: c.id,
          name: c.name,
        }));

        if (!alive) return;
        setRows(list);
        setCategories(cats);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || "Failed to load products";
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
      cleanupPreviews();
    };
  }, []);

  // Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.slug || "").toLowerCase().includes(q) ||
        (r.categoryName || "").toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  // Validation
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.categoryId) e.categoryId = "Select a category";
    if (form.price === "" || isNaN(Number(form.price))) e.price = "Valid price required";
    // images are required only on ADD (server expects at least one)
    if (!form.id && newFiles.length === 0) e.images = "At least one image is required";
    return e;
  };

  /* ------------- Modal open/close ------------- */
  const openAdd = () => {
    cleanupPreviews();
    setForm(blankForm());
    setErrors({});
    setRemoveList([]);
    setNewFiles([]);
    setNewPreviews([]);
    setShowForm(true);
  };

  const openEdit = (row) => {
    cleanupPreviews();
    setForm({
      id: row.id,
      slug: row.slug,
      name: row.name,
      categoryId: row.categoryId,
      price: String(row.price ?? ""),
      oldPrice: row.oldPrice === "" ? "" : String(row.oldPrice),
      description: row.description || "",
      images: Array.isArray(row.images) ? row.images : [],
    });
    setErrors({});
    setRemoveList([]);
    setNewFiles([]);
    setNewPreviews([]);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    cleanupPreviews();
  };

  /* ------------- Image picking / previews ------------- */
  const onPickImages = (fileList) => {
    const files = Array.from(fileList || []);
    setNewFiles(files);
    // previews
    const urls = files.map((f) => URL.createObjectURL(f));
    // cleanup previous
    cleanupPreviews();
    previewUrlsRef.current = urls;
    setNewPreviews(urls);
  };

  const cleanupPreviews = () => {
    if (previewUrlsRef.current?.length) {
      previewUrlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
      previewUrlsRef.current = [];
    }
    setNewPreviews([]);
  };

  const toggleRemoveExisting = (url) => {
    setRemoveList((prev) =>
      prev.includes(url) ? prev.filter((x) => x !== url) : [...prev, url]
    );
  };

  /* ------------- DELETE ------------- */
  const onDelete = async (row) => {
    if (!window.confirm(`Delete product "${row.name}"?`)) return;
    try {
      await api.delete(`/api/products/${row.id}`); // we pass id; your controller handles id or slug
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      showFlash("Product deleted successfully.", "success");
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Delete failed";
      showFlash(msg, "error");
    }
  };

  /* ------------- SUBMIT (ADD/EDIT) ------------- */
  const onSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    try {
      if (form.id) {
        // EDIT: your API uses POST /api/products/{id} (not PUT)
        const fd = new FormData();
        if (form.categoryId) fd.append("category_id", String(form.categoryId));
        if (form.name) fd.append("name", form.name);
        if (form.oldPrice !== "") fd.append("old_price", String(form.oldPrice));
        if (form.price !== "") fd.append("price", String(form.price));
        fd.append("description", form.description || "");

        // new uploads (images[])
        newFiles.forEach((f) => fd.append("images[]", f));

        // removals (remove_images[])
        removeList.forEach((url) => fd.append("remove_images[]", url));

        const { data } = await api.post(`/api/products/${form.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const updated = data?.product ? mapApiProductToRow(data.product) : mapApiProductToRow({
          ...form,
          images: form.images.filter((u) => !removeList.includes(u)),
          price: Number(form.price || 0),
          old_price: form.oldPrice === "" ? null : Number(form.oldPrice),
          category: { id: form.categoryId, name: categories.find(c => c.id === Number(form.categoryId))?.name || "" },
          updated_at: new Date().toISOString(),
        });

        setRows((prev) => prev.map((r) => (r.id === form.id ? { ...r, ...updated } : r)));
        showFlash("Product updated successfully.", "success");
      } else {
        // ADD
        const fd = new FormData();
        fd.append("category_id", String(form.categoryId));
        fd.append("name", form.name);
        if (form.oldPrice !== "") fd.append("old_price", String(form.oldPrice));
        fd.append("price", String(form.price));
        fd.append("description", form.description || "");
        newFiles.forEach((f) => fd.append("images[]", f));

        const { data } = await api.post(`/api/products`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newRow = data?.product ? mapApiProductToRow(data.product) : null;
        if (newRow) setRows((prev) => [newRow, ...prev]);
        showFlash("Product created successfully.", "success");
      }

      closeModal();
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Save failed";
      showFlash(msg, "error");
    }
  };

  /* ---------------- NEW: Gallery state + handlers ---------------- */
  const [galleryOpen, setGalleryOpen] = useState(false);       // NEW
  const [galleryImages, setGalleryImages] = useState([]);      // NEW
  const [galleryTitle, setGalleryTitle] = useState("");        // NEW

  const openGallery = (row) => {                               // NEW
    const imgs = Array.isArray(row.images) && row.images.length
      ? row.images
      : row.cover ? [row.cover] : [];
    setGalleryImages(imgs);
    setGalleryTitle(row.name || "Images");
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);            // NEW

  return (
    <div className="space-y-6 relative">
      {/* Flash */}
      <Flash show={flash.show} type={flash.type} onClose={() => setFlash((f) => ({ ...f, show: false }))}>
        {flash.message}
      </Flash>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-900">Manage Products</h1>
          <p className="text-gray-600 text-sm">Create, edit and remove product listings.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 grid place-items-center text-gray-400">
              <FaSearch />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, slug, category…"
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
          >
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-gray-600">Loading products…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {/* Table */}
      {!loading && !err && (
        <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-gray-600 font-semibold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Images</th>
                <th className="px-6 py-3">Updated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium max-w-[260px] truncate" title={r.name}>{r.name}</td>
                  <td className="px-6 py-3">{r.slug}</td>
                  <td className="px-6 py-3">
                    {r.categoryName ? <Pill>{r.categoryName}</Pill> : "—"}
                  </td>
                  <td className="px-6 py-3">
                    {r.oldPrice && r.oldPrice > r.price ? (
                      <div className="space-x-2">
                        <span className="line-through text-gray-400">Rs. {r.oldPrice}</span>
                        <span className="font-semibold text-green-800">Rs. {r.price}</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-green-800">Rs. {r.price}</span>
                    )}
                  </td>

                  {/* CHANGED: Images cell opens gallery on click */}
                  <td className="px-6 py-3">
                    <button
                      type="button"
                      onClick={() => openGallery(r)} // NEW
                      className="h-12 w-20 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200 grid place-items-center hover:ring-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                      title="Open image gallery"
                    >
                      {r.cover ? (
                        <img src={r.cover} alt={r.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <FaImages /> none
                        </span>
                      )}
                    </button>
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
                  <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                    No products found.
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
              {form.id ? "Edit Product" : "New Product"}
            </h2>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left */}
              <div className="space-y-4">
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  error={errors.name}
                  required
                />
                {/* Category select */}
                <div>
                  <label className="text-sm text-gray-700">Category <span className="text-red-500">*</span></label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className={`mt-1 w-full rounded-lg border bg-white px-4 py-2 focus:outline-none ${
                      errors.categoryId
                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                        : "border-gray-200 focus:ring-2 focus:ring-green-600"
                    }`}
                  >
                    <option value="">Select category…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>
                  )}
                </div>
                <Field
                  label="Price (Rs.)"
                  type="number"
                  value={form.price}
                  onChange={(v) => setForm((f) => ({ ...f, price: v }))}
                  error={errors.price}
                  required
                />
                <Field
                  label="Old Price (Rs., optional)"
                  type="number"
                  value={form.oldPrice}
                  onChange={(v) => setForm((f) => ({ ...f, oldPrice: v }))}
                />
              </div>

              {/* Right */}
              <div className="space-y-4">
                <Field
                  label="Description"
                  textarea
                  rows={7}
                  value={form.description}
                  onChange={(v) => setForm((f) => ({ ...f, description: v }))}
                />

                {/* Images: new upload */}
                <div>
                  <label className="text-sm text-gray-700">Upload Images {form.id ? "(optional)" : <span className="text-red-500">*</span>}</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => onPickImages(e.target.files)}
                    className="mt-1 block w-full rounded-lg border px-4 py-2"
                  />
                  {errors.images && <p className="text-red-600 text-sm mt-1">{errors.images}</p>}

                  {/* new previews */}
                  {newPreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {newPreviews.map((src, i) => (
                        <div key={i} className="aspect-square rounded-lg overflow-hidden ring-1 ring-gray-200">
                          <img src={src} alt={`new ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Existing images (edit) with remove toggles */}
                {form.id && Array.isArray(form.images) && form.images.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-700 mb-1">Existing Images</div>
                    <div className="grid grid-cols-5 gap-2">
                      {form.images.map((url) => {
                        const checked = removeList.includes(url);
                        return (
                          <label
                            key={url}
                            className={`relative aspect-square rounded-lg overflow-hidden ring-2 ${
                              checked ? "ring-red-500" : "ring-gray-200"
                            } cursor-pointer`}
                            title={url}
                          >
                            <img src={url} alt="existing" className="w-full h-full object-cover" />
                            <input
                              type="checkbox"
                              className="absolute top-1 left-1 h-4 w-4"
                              checked={checked}
                              onChange={() => toggleRemoveExisting(url)}
                            />
                            {checked && (
                              <span className="absolute bottom-1 left-1 right-1 text-center text-[10px] bg-red-600 text-white rounded">
                                Remove on Save
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Tick the images you want to delete. They will be removed after you press <b>Save</b>.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions (full width) */}
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
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

      {/* NEW: Fullscreen Image Gallery */}
      {galleryOpen && (
        <GalleryModal
          title={galleryTitle}
          images={galleryImages}
          onClose={closeGallery}
        />
      )}
    </div>
  );
}
