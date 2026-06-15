"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-bg-card rounded-2xl shadow-panel w-full ${sizes[size]} p-6 z-10`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-200 text-neutral-700">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
