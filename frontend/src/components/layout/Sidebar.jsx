"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, BookOpen, ClipboardList, BarChart2,
  Users, UserCog, User, LogOut, GraduationCap, ChevronLeft, ChevronRight, X,
  Moon, Sun,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { normalizePerfil, getPerfilLabel } from "@/utils/roles";
import Avatar from "@/components/ui/Avatar";
import { useTheme } from "@/contexts/ThemeContext";

const menus = {
  admin: [
    { href: "/dashboard",             icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/turmas",      icon: BookOpen,        label: "Turmas" },
    { href: "/dashboard/alunos",      icon: Users,           label: "Alunos" },
    { href: "/dashboard/professores", icon: UserCog,         label: "Professores" },
    { href: "/dashboard/relatorios",  icon: BarChart2,       label: "Relatórios" },
    { href: "/dashboard/perfil",      icon: User,            label: "Perfil" },
  ],
  professor: [
    { href: "/dashboard",             icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/frequencia",  icon: ClipboardList,   label: "Frequência" },
    { href: "/dashboard/turmas",      icon: BookOpen,        label: "Minhas Turmas" },
    { href: "/dashboard/relatorios",  icon: BarChart2,       label: "Relatórios" },
    { href: "/dashboard/perfil",      icon: User,            label: "Perfil" },
  ],
  aluno: [
    { href: "/dashboard",             icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/turmas",      icon: BookOpen,        label: "Minhas Turmas" },
    { href: "/dashboard/relatorios",  icon: BarChart2,       label: "Meu Relatório" },
    { href: "/dashboard/perfil",      icon: User,            label: "Perfil" },
  ],
};

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const perfil   = normalizePerfil(user?.perfil);
  const navItems = menus[perfil] || menus.aluno;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  const isActive = (href) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const sidebarContent = (
    <aside
      className="flex flex-col bg-neutral-900 text-white h-full transition-all duration-300"
      style={{ width: collapsed ? "64px" : "240px" }}
    >
      {/* Logo + toggle */}
      <div
        className={`relative border-b border-white/10 flex-shrink-0 ${
          collapsed ? "flex flex-col items-center gap-2 py-4 px-2" : "flex items-center gap-3 px-3 py-5"
        }`}
      >
        <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={20} color="white" />
        </div>

        {!collapsed && (
          <span className="font-bold text-base tracking-tight whitespace-nowrap flex-1 min-w-0 truncate">
            ClassHub
          </span>
        )}

        {/* Toggle — visível expandido e recolhido (desktop) */}
        <button
          type="button"
          onClick={onToggle}
          className={`p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white flex-shrink-0 hidden lg:flex ${
            collapsed ? "w-full justify-center" : ""
          }`}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Fechar no mobile */}
        {mobileOpen && (
          <button
            type="button"
            onClick={onMobileClose}
            className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white flex-shrink-0 lg:hidden absolute top-4 right-2"
            aria-label="Fechar menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden min-h-0">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onMobileClose}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${active
                  ? "bg-orange-500 text-black"
                  : "text-white/70 hover:bg-white/10 hover:text-white"}
                ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-2 py-2 flex-shrink-0">
        <button
          type="button"
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white ${collapsed ? "justify-center" : ""}`}
          title={theme === "dark" ? "Usar modo claro" : "Usar modo escuro"}
          aria-label={theme === "dark" ? "Usar modo claro" : "Usar modo escuro"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && <span>{theme === "dark" ? "Modo claro" : "Modo escuro"}</span>}
        </button>
      </div>

      {/* Usuário + Logout */}
      <div className="border-t border-white/10 px-2 py-3 flex items-center gap-2 overflow-hidden flex-shrink-0">
        <Avatar name={user?.nome} fotoUrl={user?.fotoUrl} size="sm" />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.nome || "Usuário"}</p>
            <p className="text-caption text-white/50">{getPerfilLabel(perfil)}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white flex-shrink-0"
          title="Sair"
          aria-label="Sair"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop — altura fixa da viewport */}
      <div className="hidden lg:flex flex-shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile — drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="relative flex h-screen w-60">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
