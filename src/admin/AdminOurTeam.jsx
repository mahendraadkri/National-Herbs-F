// src/admin/AdminOurTeam.jsx
import React, { useEffect, useState } from "react";
// import axios from "axios";

export default function AdminOurTeam() {
  const [teams, setTeams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    description: "",
    image: null, // File object
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null); // image preview

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get("/api/our-teams");
      setTeams(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files?.[0] ?? null;

      // ✅ size < 1MB and image only
      if (file) {
        if (!file.type.startsWith("image/")) {
          setErrors((p) => ({ ...p, image: "Please select an image file" }));
        } else if (file.size > 1024 * 1024) {
          setErrors((p) => ({ ...p, image: "Image must be less than 1MB" }));
        } else {
          setErrors((p) => {
            const { image, ...rest } = p;
            return rest;
          });
        }
      }

      setForm((f) => ({ ...f, image: file }));
      if (preview) URL.revokeObjectURL(preview);
      setPreview(file ? URL.createObjectURL(file) : null);
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  // 🔎 Validation rules (as requested)
  // - Name > 3 characters
  // - Phone: numbers only, start with 9, exactly 10 digits
  // - Email must contain "@" (using standard email regex)
  // - Image required when creating; < 1MB (checked above too)
  const validateForm = () => {
    const v = {};

    // Name
    if (!form.name.trim()) v.name = "Name is required";
    else if (form.name.trim().length < 4)
      v.name = "Name must be at least 4 characters";

    // Position
    if (!form.position.trim()) v.position = "Position is required";

    // Phone
    if (!form.phone.trim()) v.phone = "Phone is required";
    else if (!/^9\d{9}$/.test(form.phone.trim()))
      v.phone = "Phone must start with 9 and be exactly 10 digits";

    // Email
    if (!form.email.trim()) v.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      v.email = "Email must contain @ and a valid domain";

    // Description
    if (!form.description.trim()) v.description = "Description is required";

    // Image (only when creating)
    if (!editingId) {
      if (!form.image) v.image = "Image is required";
      else if (form.image.size > 1024 * 1024)
        v.image = "Image must be less than 1MB";
      else if (!form.image.type.startsWith("image/"))
        v.image = "Please select an image file";
    }

    setErrors(v);
    return Object.keys(v).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("position", form.position);
      fd.append("phone", form.phone);
      fd.append("email", form.email);
      fd.append("description", form.description);
      if (form.image) fd.append("image", form.image);

      if (editingId) {
        await axios.post(`/api/our-teams/${editingId}?_method=PUT`, fd);
      } else {
        await axios.post("/api/our-teams", fd);
      }

      await fetchTeams();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Save failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (team) => {
    setEditingId(team.id);
    setForm({
      name: team.name || "",
      position: team.position || "",
      phone: team.phone || "",
      email: team.email || "",
      description: team.description || "",
      image: null, // keep null unless user selects a new file
    });
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await axios.delete(`/api/our-teams/${id}`);
      await fetchTeams();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      position: "",
      phone: "",
      email: "",
      description: "",
      image: null,
    });
    setErrors({});
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const imgSrc = (t) => {
    if (!t?.image) return null;
    if (t.image_url) return t.image_url; // if your API returns full URL
    return `/storage/${t.image}`; // fallback to storage path
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {editingId ? "Edit Team Member" : "Add Team Member"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        {/* Name */}
        <div>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className={`border p-2 rounded w-full ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Position */}
        <div>
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Position"
            className={`border p-2 rounded w-full ${
              errors.position ? "border-red-500" : ""
            }`}
          />
          {errors.position && (
            <p className="text-red-500 text-sm">{errors.position}</p>
          )}
        </div>

        {/* Image */}
        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className={`border p-2 rounded w-full ${
              errors.image ? "border-red-500" : ""
            }`}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-16 h-16 object-cover rounded-full"
            />
          )}
        </div>

        {/* Phone */}
        <div>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone (e.g., 98XXXXXXXX)"
            className={`border p-2 rounded w-full ${
              errors.phone ? "border-red-500" : ""
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className={`border p-2 rounded w-full ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className={`border p-2 rounded w-full ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {submitting ? "Saving..." : editingId ? "Update" : "Save"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Team table */}
      <h3 className="text-lg font-bold mb-2">Team Members</h3>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 && (
              <tr>
                <td className="border p-4 text-center" colSpan="7">
                  No members yet.
                </td>
              </tr>
            )}

            {teams.map((t) => (
              <tr key={t.id}>
                <td className="border p-2">
                  {imgSrc(t) ? (
                    <img
                      src={imgSrc(t)}
                      alt={t.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">No image</span>
                  )}
                </td>
                <td className="border p-2">{t.name}</td>
                <td className="border p-2">{t.position}</td>
                <td className="border p-2">{t.phone}</td>
                <td className="border p-2">{t.email}</td>
                <td className="border p-2">{t.description}</td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
