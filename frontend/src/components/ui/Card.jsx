export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-bg-card rounded-xl shadow-card border border-bg-border p-6 ${className}`}>
      {children}
    </div>
  );
}
