// src/pages/Blog.jsx
import React from "react";
import { FaCalendarAlt, FaUserAlt } from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";

// Demo data (replace with CMS or API)
const POSTS = [
  {
    id: 1,
    title: "The Power of Aloe Vera in Skincare",
    excerpt:
      "Discover how Aloe Vera hydrates, soothes, and nourishes your skin naturally. A must-have for your daily glow.",
    date: "March 12, 2025",
    author: "National Herbs Team",
    image: "/assets/blog1.jpg",
  },
  {
    id: 2,
    title: "Herbal Teas: More Than Just a Drink",
    excerpt:
      "From stress relief to digestion, herbal teas offer a range of benefits rooted in centuries-old traditions.",
    date: "March 8, 2025",
    author: "National Herbs Team",
    image: "/assets/blog2.jpg",
  },
  {
    id: 3,
    title: "Why Go Chemical-Free in Beauty?",
    excerpt:
      "Learn why choosing clean, herbal-based products makes a difference for your health and the environment.",
    date: "Feb 28, 2025",
    author: "National Herbs Team",
    image: "/assets/blog3.jpg",
  },
];

export default function Blog() {
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
            Herbal wisdom, wellness tips, and product insights from National
            Herbs
          </p>
        </div>

        {/* Blog grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="h-52 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-2 hover:text-green-700 transition">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 flex-1">{post.excerpt}</p>

                {/* Meta */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-green-600" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUserAlt className="text-green-600" /> {post.author}
                  </span>
                </div>

                {/* Read more */}
                <button className="mt-5 text-sm font-medium text-green-700 hover:underline self-start">
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
