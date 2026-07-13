import { Head, Link, router } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"
import BadgeStatus from "../../Components/BadgeStatus"
import BadgeCondition from "../../Components/BadgeCondition"

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

export default function Index({ histories, stats, filters }) {
    const isInitialMount = useRef(true)
    const debounceRef = useRef(null)
    const [search, setSearch] = useState(filters?.search || "")
    const [statusFilter, setStatusFilter] = useState(filters?.status || "")
    const [open, setOpen] = useState(false)
    const [period, setPeriod] = useState(filters?.period || "all")
    const [dateFrom, setDateFrom] = useState(filters?.date_from || "")
    const [dateTo, setDateTo] = useState(filters?.date_to || "")
    const [month, setMonth] = useState(filters?.month || "")
    const [year, setYear] = useState(filters?.year || "")

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }

        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            const params = { search, status: statusFilter, period }

            if (period === "custom") {
                if (dateFrom) params.date_from = dateFrom
                if (dateTo) params.date_to = dateTo
            } else if (period === "this_month") {
                if (month) params.month = month
                if (year) params.year = year
            } else if (period === "this_year") {
                if (year) params.year = year
            }

            router.get("/admin/history", params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            })
        }, 400)
        return () => clearTimeout(debounceRef.current)
    }, [search, statusFilter, period, dateFrom, dateTo, month, year])

    const statCards = [
        {
            title: "Total Rekaman",
            value: stats.total,
            desc: "Semua riwayat peminjaman",
            color: "text-blue-600",
        },
        {
            title: "Dikembalikan",
            value: stats.returned,
            desc: "Sudah dikembalikan",
            color: "text-emerald-600",
        },
        {
            title: "Hilang",
            value: stats.lost,
            desc: "Ditandai hilang",
            color: "text-red-600",
        },
    ]

    function handleExport() {
        const csv = [
            [
                "ID Peminjaman",
                "Peminjam",
                "Jenis Jaminan",
                "Nomor Identitas",
                "Board Game",
                "Dipinjam",
                "Dikembalikan",
                "Status",
                "Kondisi",
                "Denda",
            ].join(","),
            ...(histories.data || []).map((loan) =>
                [
                    loan.id,
                    `"${(() => {
                        const list = Array.isArray(loan.list_peminjam) ? loan.list_peminjam : [];
                        return list.map(p => p.nama).join(", ");
                    })()}"`,
                    (() => {
                        const list = Array.isArray(loan.list_peminjam) ? loan.list_peminjam : [];
                        const first = list[0] || {};
                        return first.jenis_jaminan?.toUpperCase() || "-";
                    })(),
                    `"${(() => {
                        const list = Array.isArray(loan.list_peminjam) ? loan.list_peminjam : [];
                        return list.map(p => p.nomor_identitas).join(", ");
                    })()}"`,
                    `"${loan.game.nama}"`,
                    formatDateTime(loan.borrowed_at),
                    formatDateTime(loan.returned_at),
                    loan.status,
                    loan.return_condition || "-",
                    loan.fine_amount || "-",
                ].join(","),
            ),
        ].join("\n")

        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "riwayat-peminjaman.csv"
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <>
            <Head title="Riwayat Peminjaman" />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Riwayat Peminjaman</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Lihat dan kelola seluruh riwayat peminjaman board game
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {statCards.map((card) => (
                        <div
                            key={card.title}
                            className="stats shadow border border-[#E8F3EF] bg-white rounded-xl"
                        >
                            <div className="stat">
                                <div className="stat-title text-[#2F6F62]/70 text-xs font-medium uppercase tracking-wider">
                                    {card.title}
                                </div>
                                <div className={`stat-value text-3xl font-bold ${card.color}`}>
                                    {card.value}
                                </div>
                                <div className="stat-desc text-gray-400 text-xs">{card.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters Card */}
                <div className="card bg-white border border-[#E8F3EF] rounded-xl shadow-sm">
                    <div className="card-body p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            {/* Search */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                                    Cari
                                </label>
                                <div className="relative">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari riwayat berdasarkan game atau peminjam"
                                        className="input input-bordered input-sm pl-9 w-full"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="text-xs font-medium text-[#2F6F62]/70 uppercase tracking-wider block mb-1.5">
                                    Status
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setOpen((prev) => !prev)}
                                        className="flex items-center gap-2 w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F6F62] transition-colors"
                                    >
                                        {statusFilter ? (
                                            <BadgeStatus status={statusFilter} />
                                        ) : (
                                             <span className="text-gray-500">Semua</span>
                                        )}
                                        <svg
                                            className={`w-4 h-4 ml-auto text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>
                                    {open && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                                            <div className="absolute z-20 mt-1 w-full bg-white border border-[#E8F3EF] rounded-xl shadow-lg py-1">
                                                <button
                                                    type="button"
                                                    onClick={() => { setStatusFilter(""); setOpen(false) }}
                                                    className={`flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-[#E8F3EF] transition-colors ${!statusFilter ? "bg-[#E8F3EF]" : ""}`}
                                                >
                                                        <span className="text-gray-500">Semua</span>
                                                    {!statusFilter && (
                                                        <svg className="w-4 h-4 ml-auto text-[#2F6F62]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    )}
                                                </button>
                                                {["returned", "lost"].map((opt) => (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => { setStatusFilter(opt); setOpen(false) }}
                                                        className={`flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-[#E8F3EF] transition-colors ${statusFilter === opt ? "bg-[#E8F3EF]" : ""}`}
                                                    >
                                                        <BadgeStatus status={opt} />
                                                        {statusFilter === opt && (
                                                            <svg className="w-4 h-4 ml-auto text-[#2F6F62]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Period Filter */}
                            <div>
                                <label className="text-xs font-medium text-[#2F6F62]/70 uppercase tracking-wider block mb-1.5">
                                    Periode
                                </label>
                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="select select-bordered select-sm w-full"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Hari Ini</option>
                                    <option value="this_week">This Week</option>
                                    <option value="this_month">This Month</option>
                                    <option value="this_year">This Year</option>
                                    <option value="custom">Custom Date</option>
                                </select>
                            </div>
                        </div>

                        {/* Conditional date/period inputs */}
                        {period === "custom" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                                        Dari Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="input input-bordered input-sm w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                                        Sampai Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="input input-bordered input-sm w-full"
                                    />
                                </div>
                            </div>
                        )}

                        {period === "this_month" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                                        Bulan
                                    </label>
                                    <select
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="select select-bordered select-sm w-full"
                                    >
                                        <option value="">Bulan Ini</option>
                                        {[
                                            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                                            "Juli", "Agustus", "September", "Oktober", "November", "Desember",
                                        ].map((name, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                                        Tahun
                                    </label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="select select-bordered select-sm w-full"
                                    >
                                        <option value="">Tahun Ini</option>
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {period === "this_year" && (
                            <div className="mt-4">
                                <div className="max-w-xs">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                                        Tahun
                                    </label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="select select-bordered select-sm w-full"
                                    >
                                        <option value="">Tahun Ini</option>
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Export Button */}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleExport}
                                className="btn bg-[#2F6F62] hover:bg-[#255A4F] text-white border-none btn-sm gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Ekspor
                            </button>
                        </div>
                    </div>
                </div>

                {/* History Table Card */}
                <div className="card bg-white border border-[#E8F3EF] rounded-xl shadow-sm">
                    <div className="card-body p-0">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Riwayat Peminjaman
                            </h2>
                        </div>

                        {histories.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-gray-300 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d={search || statusFilter || period !== "all" ? "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z" : "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"}
                                    />
                                </svg>
                                <p className="text-gray-400 text-sm">
                                    {search || statusFilter || period !== "all" ? "Tidak ada riwayat yang sesuai filter" : "Belum ada riwayat peminjaman"}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                                <th className="px-6 py-3 font-medium">ID</th>
                                                <th className="px-6 py-3 font-medium">Peminjam</th>
                                                <th className="px-6 py-3 font-medium">Jenis Jaminan</th>
                                                <th className="px-6 py-3 font-medium">Nomor Identitas</th>
                                                <th className="px-6 py-3 font-medium">Board Game</th>
                                                <th className="px-6 py-3 font-medium">Lantai</th>
                                                <th className="px-6 py-3 font-medium">Dipinjam</th>
                                                <th className="px-6 py-3 font-medium">Disetujui Oleh</th>
                                                <th className="px-6 py-3 font-medium">Dikembalikan</th>
                                                <th className="px-6 py-3 font-medium">Diterima Oleh</th>
                                                <th className="px-6 py-3 font-medium">Status</th>
                                                <th className="px-6 py-3 font-medium">Kondisi</th>
                                                <th className="px-6 py-3 font-medium">Denda</th>
                                                <th className="px-6 py-3 font-medium text-right">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(histories.data || []).map((loan) => (
                                                <tr
                                                    key={loan.id}
                                                    className="hover:bg-[#FAF7F2] transition-colors border-b border-[#E8F3EF]"
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-mono text-[#2F6F62]/70">
                                                            #{loan.id}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-[#173C33]">
                                                            {(() => {
                                                                const list = Array.isArray(loan.list_peminjam) ? loan.list_peminjam : [];
                                                                return list[0]?.nama || "-";
                                                            })()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                                        {(() => {
                                                            const list = Array.isArray(loan.list_peminjam) ? loan.list_peminjam : [];
                                                            return list[0]?.jenis_jaminan?.toUpperCase() || "-";
                                                        })()}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">
                                                        {(() => {
                                                            const list = Array.isArray(loan.list_peminjam) ? loan.list_peminjam : [];
                                                            return list[0]?.nomor_identitas || "-";
                                                        })()}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {loan.game.nama}
                                                    </td>
                                                    <td className="px-6 py-4 text-[#2F6F62]/70 text-sm">
                                                        {loan.game.lantai ?? '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-[#2F6F62]/70 text-sm">
                                                        {formatDateTime(loan.borrowed_at)}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                                        {loan.approved_by || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-[#2F6F62]/70 text-sm">
                                                        {formatDateTime(loan.returned_at)}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                                        {loan.received_by || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <BadgeStatus status={loan.status} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <BadgeCondition value={loan.return_condition} />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-[#2F6F62]/70">
                                                        {loan.fine_amount
                                                            ? `Rp ${Number(loan.fine_amount).toLocaleString("id-ID")}`
                                                            : "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Link
                                                                href={`/admin/loans/${loan.id}`}
                                                                className="btn btn-ghost btn-xs btn-square text-gray-400 hover:text-[#2F6F62]"
                                                                title="Detail"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    />
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                    />
                                                                </svg>
                                                            </Link>
                                                            <Link
                                                                href={`/admin/loans/${loan.id}/print`}
                                                                className="btn btn-ghost btn-xs btn-square text-gray-400 hover:text-gray-700"
                                                                title="Cetak"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                                                    />
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {histories.links && histories.links.length > 3 && (
                                    <div className="flex items-center justify-center gap-1 px-6 py-4 border-t border-[#E8F3EF]">
                                        {histories.links.map((link, i) =>
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
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    key={i}
                                                    className="btn btn-sm btn-ghost min-w-9 text-gray-300 pointer-events-none"
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ),
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
