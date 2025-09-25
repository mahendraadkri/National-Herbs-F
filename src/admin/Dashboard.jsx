import React from "react";
import { FaBox, FaUsers, FaBlog, FaChartLine, FaUserFriends } from "react-icons/fa";

export default function Dashboard() {
  // These numbers would normally come from your backend API
  const stats = [
    { id: 1, label: "Products", value: 128, icon: <FaBox /> },
    { id: 2, label: "Distributors", value: 42, icon: <FaUsers /> },
    { id: 3, label: "Blog Posts", value: 16, icon: <FaBlog /> },
    { id: 4, label: "Monthly Sales", value: "NPR 3.2M", icon: <FaChartLine /> },
    { id: 5, label: "Team Members", value: 8, icon: <FaUserFriends /> }, // 👈 New
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here’s an overview of your admin panel.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition"
          >
            <div className="h-12 w-12 rounded-xl bg-green-100 text-green-700 grid place-items-center text-xl">
              {s.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">{s.value}</div>
              <div className="text-gray-600 text-sm">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links / shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ShortcutCard
          title="Manage Products"
          desc="Add, edit or remove product listings."
          href="/admin/products"
        />
        <ShortcutCard
          title="Distributors"
          desc="View and manage distributors."
          href="/admin/distributors"
        />
        <ShortcutCard
          title="Blog"
          desc="Publish and manage blog posts."
          href="/admin/blogs"
        />
        <ShortcutCard
          title="Our Team"
          desc="Add or edit team members."
          href="/admin/our-team"
        />
      </div>
    </div>
  );
}

function ShortcutCard({ title, desc, href }) {
  return (
    <a
      href={href}
      className="rounded-2xl bg-gradient-to-br from-green-50 to-white ring-1 ring-green-100 shadow-sm p-6 block hover:shadow-md hover:bg-green-50 transition"
    >
      <h3 className="font-semibold text-green-900">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{desc}</p>
    </a>
  );
}
