"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { normalizePerfil } from "@/utils/roles";

/**
 * Restringe o acesso à rota conforme os perfis permitidos.
 * Redireciona para /dashboard quando o perfil não é autorizado.
 */
export default function RoleGuard({ allowed = [], redirectTo = "/dashboard", children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const perfil = normalizePerfil(user?.perfil);
  const authorized = allowed.includes(perfil);

  useEffect(() => {
    if (!loading && user && !authorized) {
      router.replace(redirectTo);
    }
  }, [loading, user, authorized, router, redirectTo]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !authorized) return null;

  return children;
}
