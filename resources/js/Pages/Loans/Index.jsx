import { Link, Head } from "@inertiajs/react"
import { useMemo, useState } from "react"
import BadgeStatus from "../../Components/BadgeStatus"

function formatDateTime(date) {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export default function Index({ loans, stats }) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const data = loans.data || []
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter(
      (loan) =>
        loan.borrower_name.toLowerCase().includes(q) ||
        (loan.borrower_nim || "").includes(q) ||
        loan.game.nama.toLowerCase().includes(q) ||
        (loan.game.kode || "").toLowerCase().includes(q)
    )
  }, [loans.data, search])

  const statCards = [
    { title: "Pinjaman Aktif", value: stats.total, desc: "Sedang dipinjam", color: "text-indigo-600" },
  ]

  return (
    <>
      <Head title="Dashboard Peminjaman" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Peminjaman</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola seluruh aktivitas peminjaman board game</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {statCards.map((card) => (
            <div key={card.title} className="stats shadow border border-[#E8F3EF] bg-white rounded-xl">
              <div className="stat">
                <div className="stat-title text-[#2F6F62]/70 text-xs font-medium uppercase tracking-wider">{card.title}</div>
                <div className={`stat-value text-3xl font-bold ${card.color}`}>{card.value}</div>
                <div className="stat-desc text-gray-400 text-xs">{card.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Loans Table */}
        <div className="card bg-white border border-[#E8F3EF] rounded-xl shadow-sm">
          <div className="card-body p-0">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Daftar Peminjaman</h2>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari game atau peminjam"
                  className="input input-bordered input-sm pl-9 w-64"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="text-gray-400 text-sm">Belum ada data peminjaman</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr className="bg-[#FAF7F2] text-[#173C33]/60 text-xs uppercase tracking-wider">
                        <th className="px-6 py-3 font-medium">Game</th>
                        <th className="px-6 py-3 font-medium">Lantai</th>
                        <th className="px-6 py-3 font-medium">Peminjam</th>
                        <th className="px-6 py-3 font-medium">NIM</th>
                        <th className="px-6 py-3 font-medium">Dipinjam</th>
                        <th className="px-6 py-3 font-medium">Disetujui Oleh</th>
                        <th className="px-6 py-3 font-medium">Diterima Oleh</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((loan) => (
                        <tr key={loan.id} className="hover:bg-[#FAF7F2] transition-colors border-b border-[#E8F3EF]">
                          <td className="px-6 py-4">
                            <div className="font-medium text-[#173C33]">{loan.game.nama}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{loan.game.lantai ?? '-'}</td>
                          <td className="px-6 py-4 text-gray-700">{loan.borrower_name}</td>
                          <td className="px-6 py-4 text-gray-500 font-mono text-sm">{loan.borrower_nim || "-"}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{formatDateTime(loan.borrowed_at)}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{loan.approved_by || '-'}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{loan.received_by || '-'}</td>
                          <td className="px-6 py-4">
                            {["borrowed", "dipinjam", "disetujui", "approved"].includes(loan.status?.toLowerCase()) ? (
                              <span className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[13px] font-semibold whitespace-nowrap border bg-[#E8EEF8] text-[#1A56DB] border-[#A9CFF1]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1 0-5H20" />
                                </svg>
                                Dipinjam
                              </span>
                            ) : (
                              <BadgeStatus status={loan.status} />
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/admin/loans/${loan.id}`}
                                className="btn btn-ghost btn-xs btn-square text-gray-400 hover:text-[#2F6F62]"
                                title="Detail"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 5.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {loans.links && loans.links.length > 3 && (
                  <div className="flex items-center justify-center gap-1 px-6 py-4 border-t border-[#E8F3EF]">
                    {loans.links.map((link, i) =>
                      link.url ? (
                        <Link
                          key={i}
                          href={link.url}
                          preserveScroll
                          className={`btn btn-sm min-w-9 ${
                                                          link.active
                                                               ? "bg-[#2F6F62] text-white border-none"
                                                               : "btn-ghost text-gray-600"
                          }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      ) : (
                        <span
                          key={i}
                          className="btn btn-sm btn-ghost min-w-9 text-gray-300 pointer-events-none"
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
