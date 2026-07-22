import { useMemo } from "react"

const icons = {
  pending: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  approved: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  rejected: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  borrowed: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <polyline points="16 8 11 15 8 12" />
    </svg>
  ),
  returned: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
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
  pending: {
    label: "Menunggu",
    bg: "bg-[#FFF4CC]",
    text: "text-[#A16207]",
    border: "border-[#FACC15]",
  },
  approved: {
    label: "Disetujui",
    bg: "bg-[#E8F6ED]",
    text: "text-[#15803D]",
    border: "border-[#86EFAC]",
  },
  rejected: {
    label: "Ditolak",
    bg: "bg-[#FDE8E8]",
    text: "text-[#DC2626]",
    border: "border-[#FCA5A5]",
  },
  borrowed: {
    label: "Disetujui",
    bg: "bg-[#D6E8F5]",
    text: "text-[#0E4A73]",
    border: "border-[#A0C4E8]",
  },
  returned: {
    label: "Dikembalikan",
    bg: "bg-[#E8F6ED]",
    text: "text-[#15803D]",
    border: "border-[#86EFAC]",
  },
  lost: {
    label: "Hilang",
    bg: "bg-[#FDE8E8]",
    text: "text-[#DC2626]",
    border: "border-[#FCA5A5]",
  },
}

const normalizeMap = {
  menunggu: "pending",
  disetujui: "approved",
  ditolak: "rejected",
  dipinjam: "borrowed",
  dikembalikan: "returned",
  hilang: "lost",
}

export default function BadgeStatus({ status }) {
  const normalized = useMemo(() => {
    const key = status?.toLowerCase?.()
    return normalizeMap[key] || key
  }, [status])

  const c = config[normalized]
  if (!c) return <span className="text-sm text-gray-400">-</span>

  return (
    <span className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[13px] font-semibold whitespace-nowrap border ${c.bg} ${c.text} ${c.border}`}>
      {icons[normalized]}
      {c.label}
    </span>
  )
}
