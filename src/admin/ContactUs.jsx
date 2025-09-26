import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { api } from "../api/client";

/* ---------------- helpers ---------------- */
function mapApiContactToRow(c) {
  const created = c.created_at ? new Date(c.created_at) : null;
  return {
    id: c.id,
    name: c.name || "—",
    email: c.email || "—",
    phone: c.phone || "—",
    subject: c.subject || "—",
    message: c.message || "—",
    createdAt: created ? created.toISOString().slice(0, 16).replace("T", " ") : "",
  };
}

/* -------------- Flash (same pattern as other admin pages) -------------- */
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

/* ---------------- main component ---------------- */
export default function ContactUs() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // flash state
  const [flash, setFlash] = useState({ show: false, type: "success", message: "" });
  const flashTimer = useRef(null);
  const showFlash = (message, type = "success", durationMs = 3000) => {
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
        setErr("");
        const { data } = await api.get("/api/contact-us");
        // Accept multiple possible shapes (in case backend wrapper differs)
        const listRaw =
          data?.data ||
          data?.contacts ||
          data?.contact_us ||
          data?.categories || // older controller used 'categories' by mistake
          [];
        const list = listRaw.map(mapApiContactToRow);
        if (alive) setRows(list);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || "Failed to load contacts";
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.email || "").toLowerCase().includes(q) ||
        (r.phone || "").toLowerCase().includes(q) ||
        (r.subject || "").toLowerCase().includes(q) ||
        (r.message || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  const onDelete = async (row) => {
    if (!window.confirm(`Delete message from "${row.name}"?`)) return;
    try {
      await api.delete(`/api/contact-us/${row.id}`);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      showFlash("Contact message deleted successfully.", "success");
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Delete failed";
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
          <h1 className="text-2xl font-bold text-green-900">Contact Messages</h1>
          <p className="text-gray-600 text-sm">View and manage messages sent from the Contact page.</p>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 grid place-items-center text-gray-400">
            <FaSearch />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, subject, message…"
            className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-gray-600">Loading contacts…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {/* Table */}
      {!loading && !err && (
        <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-gray-600 font-semibold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Received</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{r.name}</td>
                  <td className="px-6 py-3">
                    {r.email !== "—" ? (
                      <a className="text-green-700 hover:underline" href={`mailto:${r.email}`}>
                        {r.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {r.phone !== "—" ? (
                      <a className="text-green-700 hover:underline" href={`tel:${r.phone}`}>
                        {r.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-3 max-w-[220px] truncate" title={r.subject}>
                    {r.subject}
                  </td>
                  <td className="px-6 py-3 max-w-[360px] truncate" title={r.message}>
                    {r.message}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{r.createdAt || "—"}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => onDelete(r)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                      title="Delete message"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                    No contact messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
