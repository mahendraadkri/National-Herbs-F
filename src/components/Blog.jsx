import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserAlt } from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";
import { api } from "../api/client";

const fallbackImg =
  "https://via.placeholder.com/800x500?text=No+Image";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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
                <div className="h-52 w-full overflow-hidden">
                  <img
                    src={post.image_url || fallbackImg}
                    alt={post.title}
                    className="h-full w-full object-cover hover:scale-105 transition duration-300"
                    onError={(e) => (e.currentTarget.src = fallbackImg)}
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2 hover:text-green-700 transition">
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
                      {new Date(post.created_at).toLocaleDateString() || "—"}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUserAlt className="text-green-600" />{" "}
                      {post.blog_by || "National Herbs Team"}
                    </span>
                  </div>

                  <a
                    href={`/blog/${post.id}`}
                    className="mt-5 text-sm font-medium text-green-700 hover:underline self-start"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
