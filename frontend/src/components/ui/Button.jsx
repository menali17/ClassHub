export default function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:   "bg-orange-500 hover:bg-orange-400 text-black focus:ring-orange-500",
    secondary: "bg-transparent border border-neutral-200 text-neutral-700 hover:bg-neutral-200",
    ghost:     "bg-transparent text-orange-500 hover:bg-orange-100",
    danger:    "bg-error hover:bg-red-700 text-white focus:ring-error",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2.5",
    lg: "text-sm px-6 py-3",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
