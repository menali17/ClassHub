"use client";
import { Menu, GraduationCap } from "lucide-react";

export default function TopBar({ onMenuOpen }) {
  return (
    <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white">
      <button onClick={onMenuOpen} className="p-1.5 rounded-md hover:bg-white/10">
        <Menu size={20} />
      </button>
      <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
        <GraduationCap size={16} color="white" />
      </div>
      <span className="font-bold text-sm">Frequenta</span>
    </div>
  );
}
