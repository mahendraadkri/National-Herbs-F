// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("adm_token"));
  const isAuthenticated = Boolean(token);

  const login = async ({ email, password }) => {
    // TODO: replace with real API call
    if (!email || !password) throw new Error("Email & password required");
    // DEMO: accept anything, create a dummy token
    const t = `demo-${Date.now()}`;
    localStorage.setItem("adm_token", t);
    setToken(t);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("adm_token");
    setToken(null);
  };

  useEffect(() => {
    // Could validate token on mount here if needed
  }, []);

  return (
    <AuthCtx.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
