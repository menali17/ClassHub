"use client";
import { Menu, GraduationCap, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function TopBar({ onMenuOpen }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white">
      <button
        type="button"
        onClick={onMenuOpen}
        className="p-1.5 rounded-md hover:bg-white/10"
        title="Abrir menu"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>
      <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
        <GraduationCap size={16} color="white" />
      </div>
      <span className="font-bold text-sm">ClassHub</span>
      <button
        type="button"
        onClick={toggleTheme}
        className="ml-auto p-1.5 rounded-md hover:bg-white/10"
        title={theme === "dark" ? "Usar modo claro" : "Usar modo escuro"}
        aria-label={theme === "dark" ? "Usar modo claro" : "Usar modo escuro"}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}
