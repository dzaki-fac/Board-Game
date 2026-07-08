const icons = {
  good: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  minor_damage: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  damaged: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  missing_parts: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
}

const config = {
  good: {
    label: "Good",
    bg: "bg-[#E8F6ED]",
    text: "text-[#15803D]",
    border: "border-[#86EFAC]",
  },
  minor_damage: {
    label: "Minor Damage",
    bg: "bg-[#FFF4CC]",
    text: "text-[#A16207]",
    border: "border-[#FACC15]",
  },
  damaged: {
    label: "Damaged",
    bg: "bg-[#FFF3E1]",
    text: "text-[#C2410C]",
    border: "border-[#FDBA74]",
  },
  missing_parts: {
    label: "Missing Parts",
    bg: "bg-[#FFE9D6]",
    text: "text-[#C2410C]",
    border: "border-[#FDBA74]",
  },
}

export default function BadgeCondition({ value }) {
  const c = config[value]
  if (!c) return <span className="text-sm text-gray-400">-</span>

  return (
    <span className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[13px] font-semibold whitespace-nowrap border ${c.bg} ${c.text} ${c.border}`}>
      {icons[value]}
      {c.label}
    </span>
  )
}
