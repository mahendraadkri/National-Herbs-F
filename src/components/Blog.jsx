// Blog.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaCalendarAlt, FaUserAlt, FaTimes } from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";
import { api } from "../api/client";

const fallbackImg = "https://via.placeholder.com/800x500?text=No+Image";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openPost, setOpenPost] = useState(null); // ← modal state

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/api/blogs");
        if (alive) setBlogs(data?.data ?? []);
      } catch (e) {
        if (alive) setErr(e.message || "Failed to load blogs");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (openPost) {
      const { overflow } = document.body.style;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = overflow;
      };
    }
  }, [openPost]);

  // Close on ESC
  const onKeyDown = useCallback((e) => {
    if (e.key === "Escape") setOpenPost(null);
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return "—";
    }
  };

  return (
    <section className="w-full bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <img
            src={leafIcon}
            alt="Leaf Icon"
            className="h-24 w-24 mx-auto object-contain"
          />
          <h1 className="text-3xl md:text-4xl font-semibold text-green-900">
            Our Blog
          </h1>
          <p className="mt-2 text-gray-600">
            Herbal wisdom, wellness tips, and product insights from National Herbs
          </p>
        </div>

        {/* States */}
        {loading && <p className="text-center text-gray-600">Loading blogs…</p>}
        {err && <p className="text-center text-red-600">{err}</p>}

        {/* Blog grid */}
        {!loading && !err && (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
              >
                {/* Image */}
                <button
                  type="button"
                  className="h-52 w-full overflow-hidden group focus:outline-none"
                  onClick={() => setOpenPost(post)}
                  aria-label={`Open blog: ${post.title}`}
                >
                  <img
                    src={post.image_url || fallbackImg}
                    alt={post.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => (e.currentTarget.src = fallbackImg)}
                  />
                </button>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-600 flex-1">
                    {post.description?.length > 150
                      ? post.description.slice(0, 150) + "…"
                      : post.description}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-green-600" />{" "}
                      {formatDate(post.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUserAlt className="text-green-600" />{" "}
                      {post.blog_by || "National Herbs Team"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenPost(post)}
                    className="mt-5 text-sm font-medium text-green-700 hover:underline self-start"
                  >
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {openPost && (
        <BlogModal post={openPost} onClose={() => setOpenPost(null)} />
      )}
    </section>
  );
}

/** Modal component */
function BlogModal({ post, onClose }) {
  const overlayRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return "—";
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="
        fixed inset-0 z-50
        bg-black/40
        backdrop-blur-sm
        flex items-center justify-center
        p-4
      "
      aria-modal="true"
      role="dialog"
      aria-labelledby="blog-modal-title"
    >
      <div className="relative w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header image */}
          <div className="h-64 w-full flex items-center justify-center bg-gray-100">
            <img
              src={post.image_url || fallbackImg}
              alt={post.title}
              className="max-h-full max-w-full object-contain"
              onError={(e) => (e.currentTarget.src = fallbackImg)}
            />
          </div>
          
          <div className="p-6">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 inline-flex items-center justify-center
                         rounded-full p-2 bg-white shadow hover:bg-gray-50 focus:outline-none"
              aria-label="Close"
            >
              <FaTimes className="text-gray-700" />
            </button>

            {/* Title */}
            <h2
              id="blog-modal-title"
              className="text-2xl md:text-3xl font-semibold text-green-900"
            >
              {post.title}
            </h2>

            {/* Meta */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <FaCalendarAlt className="text-green-600" />
                {formatDate(post.created_at)}
              </span>
              <span className="inline-flex items-center gap-1">
                <FaUserAlt className="text-green-600" />
                {post.blog_by || "National Herbs Team"}
              </span>
            </div>

            {/* Content */}
            <div className="prose prose-sm md:prose-base max-w-none mt-6 text-gray-700">
              {/* Prefer full content/body if available; otherwise show description */}
              {post.content_html ? (
                <div
                  // If your API returns sanitized HTML content, render it:
                  dangerouslySetInnerHTML={{ __html: post.content_html }}
                />
              ) : (
                <p>{post.content || post.description || ""}</p>
              )}
            </div>

            {/* Footer actions (optional) */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
