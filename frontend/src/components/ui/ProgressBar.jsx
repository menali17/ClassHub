export default function ProgressBar({ value, min = 75, showMin = true }) {
  const clamped = Math.min(100, Math.max(0, value));
  const color = value >= 85 ? "bg-success" : value >= min ? "bg-warning" : "bg-error";

  return (
    <div className="relative w-full">
      <div className="w-full bg-neutral-200 rounded-full h-2 overflow-visible">
        <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${clamped}%` }} />
      </div>
      {showMin && (
        <div className="relative mt-1">
          <span className="text-caption text-neutral-500 absolute left-0">0%</span>
          <span className="text-caption text-error absolute" style={{ left: `${min}%`, transform: "translateX(-50%)" }}>{min}% min.</span>
          <span className="text-caption text-neutral-500 absolute right-0">100%</span>
        </div>
      )}
    </div>
  );
}
