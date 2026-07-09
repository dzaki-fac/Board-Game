const icons = {
  returned: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  not_returned: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  lost: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
}

const config = {
  returned: {
    label: "Dikembalikan",
    bg: "bg-[#E8F6ED]",
    text: "text-[#15803D]",
    border: "border-[#86EFAC]",
  },
  not_returned: {
    label: "Belum Dikembalikan",
    bg: "bg-[#EEF1F5]",
    text: "text-[#475569]",
    border: "border-[#CBD5E1]",
  },
  lost: {
    label: "Hilang",
    bg: "bg-[#FDE8E8]",
    text: "text-[#DC2626]",
    border: "border-[#FCA5A5]",
  },
}

export default function BadgeStatus({ value }) {
  const c = config[value]
  if (!c) return <span className="text-sm text-gray-400">-</span>

  return (
    <span className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[13px] font-semibold whitespace-nowrap border ${c.bg} ${c.text} ${c.border}`}>
      {icons[value]}
      {c.label}
    </span>
  )
}
