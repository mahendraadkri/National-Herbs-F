// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Rehydrate on first mount
  useEffect(() => {
    const raw = localStorage.getItem("nh_auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      } catch {}
    }
    setAuthLoading(false);
  }, []);

  // Example login that persists. Replace with your real API call.
  const login = async ({ email, password, remember }) => {
    // call API -> get { token, profile } etc.
    // const resp = await api.post('/login', { email, password });
    const resp = { token: "demo-token", profile: { email } }; // mock
    const session = { token: resp.token, profile: resp.profile, ts: Date.now() };

    // Persist. If "remember" is false, you can use sessionStorage instead.
    if (remember) {
      localStorage.setItem("nh_auth", JSON.stringify(session));
    } else {
      sessionStorage.setItem("nh_auth", JSON.stringify(session));
    }

    setUser(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem("nh_auth");
    sessionStorage.removeItem("nh_auth");
    setUser(null);
  };

  const value = { user, authLoading, login, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
