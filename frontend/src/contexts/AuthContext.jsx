"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout, getMe } from "@/lib/api";
import { normalizePerfil } from "@/utils/roles";

const AuthContext = createContext(null);

// Normaliza o usuário independente do formato que o backend retorne
function normalizeUser(u) {
  if (!u) return null;
  return {
    ...u,
    perfil: normalizePerfil(u.perfil),
    nome: u.nome || u.name || "Usuário",
    email: u.email || "",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("frequenta_token");
    if (!token) { setLoading(false); return; }
    getMe()
      .then(data => setUser(normalizeUser(data)))
      .catch(() => localStorage.removeItem("frequenta_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, senha) {
    const data = await apiLogin(email, senha);
    localStorage.setItem("frequenta_token", data.token);
    const u = normalizeUser(data.usuario || data.user || data);
    setUser(u);
    return u;
  }

  async function logout() {
    await apiLogout().catch(() => {});
    localStorage.removeItem("frequenta_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
