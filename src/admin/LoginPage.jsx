import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [err, setErr] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate(from, { replace: true });
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-lg ring-1 ring-green-100 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Brand / Left panel */}
          <div className="relative hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-emerald-600 p-10 text-white">
            <img
              src={leafIcon}
              alt="National Herbs"
              className="h-16 w-16 mb-4 drop-shadow-md"
            />
            <h2 className="text-2xl font-semibold">National Herbs Admin</h2>
            <p className="mt-2 text-green-100 text-center max-w-xs">
              Secure access for authorized personnel. Manage products, blogs,
              distributors and more.
            </p>
          </div>

          {/* Form / Right panel */}
          <div className="p-8 md:p-10">
            <div className="md:hidden flex items-center gap-3 mb-4">
              <img src={leafIcon} alt="" className="h-10 w-10" />
              <h1 className="text-xl font-semibold text-green-900">
                National Herbs Admin
              </h1>
            </div>

            <h2 className="text-2xl font-semibold text-green-900">
              Admin Login
            </h2>
            <p className="text-gray-500 mt-1">
              Please sign in to continue to your dashboard.
            </p>

            {err && (
              <div className="mt-4 rounded-lg bg-red-50 text-red-700 px-4 py-3">
                {err}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 grid place-items-center text-gray-400">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-3 py-3
                               focus:outline-none focus:ring-2 focus:ring-green-600"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 grid place-items-center text-gray-400">
                    <FaLock />
                  </span>
                  <input
                    type={showPw ? "text" : "password"}
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-10 py-3
                               focus:outline-none focus:ring-2 focus:ring-green-600"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 grid place-items-center text-gray-400 hover:text-gray-600"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-green-600 text-white font-semibold py-3
                           hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Back to Home button */}
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-green-700 font-medium hover:underline"
              >
                <FaArrowLeft /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
