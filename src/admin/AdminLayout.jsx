// src/admin/AdminLayout.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/logo-icon.png";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const linkBase =
    "block px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50";
  const linkActive = "text-green-700 bg-green-50";

  const onLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-12 bg-gray-50">
      {/* Sidebar */}
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r bg-white p-4">
        {/* Logo & brand */}
        <div className="flex items-center gap-2 mb-6">
          <img src={logo} alt="National Herbs" className="w-8 h-8" />
          <span className="font-bold text-green-800">National Herbs Admin</span>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/admin/distributors"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            Distributors
          </NavLink>
          <NavLink
            to="/admin/blogs"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            Blogs
          </NavLink>
          <NavLink
            to="/admin/our-team"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            Our Team
          </NavLink>
        </nav>

        <button
          onClick={onLogout}
          className="mt-6 w-full rounded-lg bg-red-50 text-red-700 py-2 hover:bg-red-100"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6">
        <Outlet />
      </main>
    </div>
  );
}
