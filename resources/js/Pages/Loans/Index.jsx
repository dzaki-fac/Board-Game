import { Link, Head } from "@inertiajs/react"
import { useMemo, useState } from "react"

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

function statusBadge() {
  return <span className="badge badge-sm capitalize badge-primary">borrowed</span>
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
        loan.game.name.toLowerCase().includes(q)
    )
  }, [loans.data, search])

  const statCards = [
    { title: "Pinjaman Aktif", value: stats.total, desc: "Currently borrowed", color: "text-indigo-600" },
  ]

  return (
    <>
      <Head title="Loan Dashboard" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all board game borrowing activity</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {statCards.map((card) => (
            <div key={card.title} className="stats shadow border border-gray-100 bg-white rounded-xl">
              <div className="stat">
                <div className="stat-title text-gray-500 text-xs font-medium uppercase tracking-wider">{card.title}</div>
                <div className={`stat-value text-3xl font-bold ${card.color}`}>{card.value}</div>
                <div className="stat-desc text-gray-400 text-xs">{card.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Loans Table */}
        <div className="card bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="card-body p-0">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Loans List</h2>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search game or borrower"
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
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-3 font-medium">Game</th>
                        <th className="px-6 py-3 font-medium">Borrower</th>
                        <th className="px-6 py-3 font-medium">NIM</th>
                        <th className="px-6 py-3 font-medium">Borrowed At</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((loan) => (
                        <tr key={loan.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{loan.game.name}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{loan.borrower_name}</td>
                          <td className="px-6 py-4 text-gray-500 font-mono text-sm">{loan.borrower_nim || "-"}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{formatDateTime(loan.borrowed_at)}</td>
                          <td className="px-6 py-4">{statusBadge()}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/admin/loans/${loan.id}`}
                                className="btn btn-ghost btn-xs btn-square text-gray-400 hover:text-blue-600"
                                title="Detail"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
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
                  <div className="flex items-center justify-center gap-1 px-6 py-4 border-t border-gray-100">
                    {loans.links.map((link, i) =>
                      link.url ? (
                        <Link
                          key={i}
                          href={link.url}
                          preserveScroll
                          className={`btn btn-sm min-w-9 ${
                            link.active
                              ? "btn-primary"
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
