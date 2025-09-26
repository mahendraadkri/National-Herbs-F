import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaUsers,
  FaBlog,
  FaThList,
  FaUserFriends,
} from "react-icons/fa";
import { api } from "../api/client";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    categories: null,
    products: null,
    distributors: null,
    blogs: null,
    teams: null,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const [
          categoriesRes,
          productsRes,
          distributorsRes,
          blogsRes,
          teamsRes,
        ] = await Promise.all([
          api.get("/api/totalcategories"),
          api.get("/api/totalproducts"),
          api.get("/api/totaldistributors"),
          api.get("/api/totalblogs"),
          api.get("/api/totalteams"),
        ]);

        const getTotal = (res) =>
          // prefer { total }, fallback to { data: { total } }, fallback to 0
          res?.data?.total ??
          res?.data?.data?.total ??
          (typeof res?.data?.success !== "undefined" && typeof res?.data?.total !== "undefined"
            ? res.data.total
            : 0);

        if (alive) {
          setCounts({
            categories: getTotal(categoriesRes),
            products: getTotal(productsRes),
            distributors: getTotal(distributorsRes),
            blogs: getTotal(blogsRes),
            teams: getTotal(teamsRes),
          });
        }
      } catch (e) {
        if (alive) {
          const msg =
            e?.response?.data?.message || e.message || "Failed to load counts";
          setErr(msg);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        id: 1,
        label: "Categories",
        value:
          counts.categories === null ? "—" : String(counts.categories),
        icon: <FaThList aria-hidden="true" />,
        href: "/admin/categories",
      },
      {
        id: 2,
        label: "Products",
        value: counts.products === null ? "—" : String(counts.products),
        icon: <FaBox aria-hidden="true" />,
        href: "/admin/products",
      },
      {
        id: 3,
        label: "Distributors",
        value:
          counts.distributors === null ? "—" : String(counts.distributors),
        icon: <FaUsers aria-hidden="true" />,
        href: "/admin/distributors",
      },
      {
        id: 4,
        label: "Blog Posts",
        value: counts.blogs === null ? "—" : String(counts.blogs),
        icon: <FaBlog aria-hidden="true" />,
        href: "/admin/blogs",
      },
      {
        id: 5,
        label: "Our Team",
        value: counts.teams === null ? "—" : String(counts.teams),
        icon: <FaUserFriends aria-hidden="true" />,
        href: "/admin/our-team",
      },
    ],
    [counts]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here’s an overview of your admin panel.
        </p>
      </div>

      {/* Error / Loading */}
      {err && <p className="text-red-600">{err}</p>}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((s) => (
          <Link
            key={s.id}
            to={s.href}
            className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition cursor-pointer"
            aria-label={s.label}
            title={`Go to ${s.label}`}
          >
            <div className="h-12 w-12 rounded-xl bg-green-100 text-green-700 grid place-items-center text-xl">
              {s.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {loading ? "…" : s.value}
              </div>
              <div className="text-gray-600 text-sm">{s.label}</div>
            </div>
          </Link>
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
          desc="Manage team members and their roles."
          href="/admin/our-team"
        />
      </div>
    </div>
  );
}

function ShortcutCard({ title, desc, href }) {
  return (
    <Link
      to={href}
      className="rounded-2xl bg-gradient-to-br from-green-50 to-white ring-1 ring-green-100 shadow-sm p-6 block hover:shadow-md hover:bg-green-50 transition focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
      aria-label={title}
      title={title}
    >
      <h3 className="font-semibold text-green-900">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{desc}</p>
    </Link>
  );
}
