export default function StatCard({ title, value, subtitle, icon: Icon, iconBg = "bg-orange-100", iconColor = "text-orange-500", valueColor = "" }) {
  return (
    <div className="bg-bg-card rounded-xl border border-bg-border shadow-card p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div>
        <p className="text-caption text-neutral-500 mb-1">{title}</p>
        <p className={`text-2xl font-bold leading-none ${valueColor}`}>{value}</p>
        {subtitle && <p className="text-caption text-neutral-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
