import { getFrequencyStatus } from "@/utils/formatters";

export default function Badge({ percent, label, variant }) {
  let bg, text, displayLabel;

  if (percent !== undefined) {
    const status = getFrequencyStatus(percent);
    bg = status.bg; text = status.text; displayLabel = `${Math.round(percent)}% ${status.label}`;
  } else {
    const map = {
      regular:  { bg: "bg-green-100",  text: "text-green-700"  },
      atencao:  { bg: "bg-orange-100", text: "text-orange-600" },
      risco:    { bg: "bg-red-100",    text: "text-red-600"    },
    };
    const s = map[variant] || map.regular;
    bg = s.bg; text = s.text; displayLabel = label;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}>
      {displayLabel}
    </span>
  );
}
