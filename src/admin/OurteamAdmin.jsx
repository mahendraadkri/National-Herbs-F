import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserTie } from "react-icons/fa";
import { api } from "../api/client";

/* ---------------- helpers ---------------- */
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

function toImageUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  // If it's already an absolute URL, keep it. Else, prefix storage.
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${API_BASE_URL}/storage/${pathOrUrl.replace(/^\/?storage\/?/, "")}`;
}

function mapApiTeamToRow(t) {
  const created = t.created_at ? new Date(t.created_at) : null;
  const updated = t.updated_at ? new Date(t.updated_at) : created;
  return {
    id: t.id,
    name: t.name || "",
    position: t.position || "",
    email: t.email || "",
    phone: t.phone || "",
    description: t.description || "",
    imagePath: t.image || "",               // raw storage path from API
    imageUrl: toImageUrl(t.image || ""),    // resolved image url
    createdAt: created ? created.toISOString().slice(0, 10) : "",
    updatedAt: updated ? updated.toISOString().slice(0, 10) : "",
  };
}

/* ---------------- tiny UI bits: Flash + Field ---------------- */
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
  type = "text",
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
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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

/* ---------------- main component ---------------- */
export default function OurteamAdmin() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // modal + form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm());
  const [errors, setErrors] = useState({});

  // image preview state (single image)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const previewUrlRef = useRef("");

  // flash
  const [flash, setFlash] = useState({ show: false, type: "success", message: "" });
  const flashTimer = useRef(null);
  const showFlash = (message, type = "success", durationMs = 3000) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setFlash({ show: true, type, message });
    flashTimer.current = setTimeout(
      () => setFlash((f) => ({ ...f, show: false })),
      durationMs
    );
  };

  function blankForm() {
    return {
      id: null,
      name: "",
      position: "",
      email: "",
      phone: "",
      description: "",
      imagePath: "", // existing (storage path)
      imageUrl: "",  // resolved url for display
    };
  }

  /* ---------- load list ---------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get("/api/ourteams");
        const listRaw = data?.data || [];
        const list = listRaw.map(mapApiTeamToRow);
        if (alive) setRows(list);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || "Failed to load team members";
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
      cleanupPreview();
    };
  }, []);

  /* ---------- filter ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.position || "").toLowerCase().includes(q) ||
        (r.email || "").toLowerCase().includes(q) ||
        (r.phone || "").toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  /* ---------- validators ---------- */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.position.trim()) e.position = "Position is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.phone && !/^(97|98)[0-9]{8}$/.test(form.phone)) e.phone = "Phone must start with 97/98 and be 10 digits";
    // image is optional on both add/edit (your API allows nullable)
    return e;
  };

  /* ---------- image picking ---------- */
  const onPickImage = (file) => {
    setImageFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      previewUrlRef.current = url;
    } else {
      cleanupPreview();
    }
  };

  const cleanupPreview = () => {
    if (previewUrlRef.current) {
      try { URL.revokeObjectURL(previewUrlRef.current); } catch {}
      previewUrlRef.current = "";
    }
    setImagePreview("");
  };

  /* ---------- add/edit open ---------- */
  const openAdd = () => {
    setForm(blankForm());
    setErrors({});
    setShowForm(true);
    setImageFile(null);
    cleanupPreview();
  };

  const openEdit = (row) => {
    setForm({
      id: row.id,
      name: row.name,
      position: row.position,
      email: row.email || "",
      phone: row.phone || "",
      description: row.description || "",
      imagePath: row.imagePath || "",
      imageUrl: row.imageUrl || "",
    });
    setErrors({});
    setShowForm(true);
    setImageFile(null);
    cleanupPreview();
  };

  const closeModal = () => {
    setShowForm(false);
    setImageFile(null);
    cleanupPreview();
  };

  /* ---------- delete ---------- */
  const onDelete = async (row) => {
    if (!window.confirm(`Delete team member "${row.name}"?`)) return;
    try {
      await api.delete(`/api/ourteams/${row.id}`);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      showFlash("Team member deleted successfully.", "success");
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Delete failed";
      showFlash(msg, "error");
    }
  };

  /* ---------- submit (add/edit) ---------- */
  const onSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    try {
      if (form.id) {
        // UPDATE (POST /api/ourteams/{id})
        const fd = new FormData();
        if (form.name) fd.append("name", form.name);
        if (form.position) fd.append("position", form.position);
        if (form.email) fd.append("email", form.email);
        if (form.phone) fd.append("phone", form.phone);
        if (form.description) fd.append("description", form.description);
        if (imageFile) fd.append("image", imageFile);

        const { data } = await api.post(`/api/ourteams/${form.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const updated = data?.data ? mapApiTeamToRow(data.data) : mapApiTeamToRow({
          ...form,
          image: form.imagePath,
          updated_at: new Date().toISOString(),
        });

        setRows((prev) => prev.map((r) => (r.id === form.id ? { ...r, ...updated } : r)));
        showFlash("Team member updated successfully.", "success");
      } else {
        // CREATE
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("position", form.position);
        if (form.email) fd.append("email", form.email);
        if (form.phone) fd.append("phone", form.phone);
        if (form.description) fd.append("description", form.description);
        if (imageFile) fd.append("image", imageFile);

        const { data } = await api.post(`/api/ourteams`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newRow = data?.data ? mapApiTeamToRow(data.data) : null;
        if (newRow) setRows((prev) => [newRow, ...prev]);
        showFlash("Team member created successfully.", "success");
      }

      closeModal();
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
          <h1 className="text-2xl font-bold text-green-900">Manage Team</h1>
          <p className="text-gray-600 text-sm">Add, edit and remove your team members.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 grid place-items-center text-gray-400">
              <FaSearch />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, position, email, phone…"
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
          >
            <FaPlus /> Add Team Member
          </button>
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-gray-600">Loading team…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {/* Table */}
      {!loading && !err && (
        <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-gray-600 font-semibold">
              <tr>
                <th className="px-6 py-3">Member</th>
                <th className="px-6 py-3">Position</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Updated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 ring-1 ring-gray-200 grid place-items-center">
                        {r.imageUrl ? (
                          <img src={r.imageUrl} alt={r.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-gray-400">
                            <FaUserTie />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-gray-500 max-w-[260px] truncate" title={r.description}>
                          {r.description || "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">{r.position || "—"}</td>
                  <td className="px-6 py-3">
                    {r.email ? (
                      <a className="text-green-700 hover:underline" href={`mailto:${r.email}`}>
                        {r.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {r.phone ? (
                      <a className="text-green-700 hover:underline" href={`tel:${r.phone}`}>
                        {r.phone}
                      </a>
                    ) : (
                      "—"
                    )}
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
                  <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                    No team members found.
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
              {form.id ? "Edit Team Member" : "New Team Member"}
            </h2>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* left */}
              <div className="space-y-4">
                <Field
                  label="Full Name"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  error={errors.name}
                  required
                />
                <Field
                  label="Position"
                  value={form.position}
                  onChange={(v) => setForm((f) => ({ ...f, position: v }))}
                  error={errors.position}
                  required
                />
                <Field
                  label="Email (optional)"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  error={errors.email}
                />
                <Field
                  label="Phone (optional)"
                  value={form.phone}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                  error={errors.phone}
                />
              </div>

              {/* right */}
              <div className="space-y-4">
                <Field
                  label="Description (optional)"
                  textarea
                  rows={6}
                  value={form.description}
                  onChange={(v) => setForm((f) => ({ ...f, description: v }))}
                />

                {/* image picker */}
                <div>
                  <label className="text-sm text-gray-700">Profile Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickImage(e.target.files?.[0] || null)}
                    className="mt-1 block w-full rounded-lg border px-4 py-2"
                  />

                  {/* existing image (edit), shown if no new preview */}
                  {!imagePreview && form.id && form.imageUrl && (
                    <div className="mt-3">
                      <div className="h-28 w-28 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
                        <img src={form.imageUrl} alt="Current" className="h-full w-full object-cover" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Current image. Choose a file above to replace.</p>
                    </div>
                  )}

                  {/* new preview */}
                  {imagePreview && (
                    <div className="mt-3">
                      <div className="h-28 w-28 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Local preview. Uploads on Save.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* actions */}
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
    </div>
  );
}
