export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-neutral-700">{label}</label>}
      <input
        className={`w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm text-neutral-900
          placeholder:text-neutral-500
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
          ${error ? "border-error focus:ring-error" : ""}
          ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}
