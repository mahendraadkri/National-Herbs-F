import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  FaTachometerAlt,
  FaList,
  FaBoxOpen,
  FaTruck,
  FaBlog,
  FaAddressBook,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const linkBase =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50";
  const linkActive = "text-green-700 bg-green-50";

  const handleLogout = async () => {
    try {
      await logout(); // clear auth
    } finally {
      navigate("/", { replace: true }); // redirect to home no matter what
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-12 bg-gray-50">
      {/* Sidebar */}
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r bg-white p-4">
        <h2 className="font-bold text-green-800 mb-4 text-lg">Admin</h2>
        <nav className="space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            <FaTachometerAlt /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            <FaList /> Categories
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            <FaBoxOpen /> Products
          </NavLink>
          <NavLink
            to="/admin/distributors"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            <FaTruck /> Distributors
          </NavLink>
          <NavLink
            to="/admin/blogs"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            <FaBlog /> Blogs
          </NavLink>
          <NavLink
            to="/admin/contactus"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            <FaAddressBook /> Contacts
          </NavLink>
          <NavLink
            to="/admin/ourteams"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-gray-700"}`
            }
          >
            <FaUsers /> Our Teams
          </NavLink>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-700 py-2 hover:bg-red-100"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Content */}
      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6">
        <Outlet />
      </main>
    </div>
  );
}
