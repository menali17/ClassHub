"use client";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ProfessorDashboard from "@/components/dashboard/ProfessorDashboard";
import AlunoDashboard from "@/components/dashboard/AlunoDashboard";
import { normalizePerfil } from "@/utils/roles";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const perfil = normalizePerfil(user.perfil);

  if (perfil === "admin")     return <AdminDashboard />;
  if (perfil === "professor") return <ProfessorDashboard />;
  return <AlunoDashboard />;
}
