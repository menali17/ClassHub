export function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

export function getAvatarColor(name = "") {
  const colors = ["#FFA500", "#A64CA6", "#16a34a", "#0ea5e9", "#d97706", "#dc2626"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function getFrequencyStatus(percent) {
  if (percent >= 85) return { label: "Regular", bg: "bg-green-100",  text: "text-green-700" };
  if (percent >= 75) return { label: "Atenção", bg: "bg-orange-100", text: "text-orange-600" };
  return                    { label: "Risco",   bg: "bg-red-100",    text: "text-red-600"   };
}
