import { Head, Link, router } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"

export default function Index({ boardGames, summary, filters, periodLabel }) {
    const isInitialMount = useRef(true)
    const debounceRef = useRef(null)
    const [search, setSearch] = useState(filters?.search || "")
    const [period, setPeriod] = useState(filters?.period || "all")
    const [dateFrom, setDateFrom] = useState(filters?.date_from || "")
    const [dateTo, setDateTo] = useState(filters?.date_to || "")
    const [month, setMonth] = useState(filters?.month || "")
    const [year, setYear] = useState(filters?.year || "")
    const [perPage, setPerPage] = useState(String(filters?.per_page || 10))

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }

        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            const params = { period, per_page: perPage }
            if (search) params.search = search
            if (period === "custom") {
                if (dateFrom) params.date_from = dateFrom
                if (dateTo) params.date_to = dateTo
            } else if (period === "this_month") {
                if (month) params.month = month
                if (year) params.year = year
            } else if (period === "this_year") {
                if (year) params.year = year
            }

            router.get("/admin/statistics", params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            })
        }, 400)
        return () => clearTimeout(debounceRef.current)
    }, [search, period, dateFrom, dateTo, month, year, perPage])

    const exportParams = new URLSearchParams({ period })
    if (search) exportParams.set("search", search)
    if (period === "custom") {
        if (dateFrom) exportParams.set("date_from", dateFrom)
        if (dateTo) exportParams.set("date_to", dateTo)
    } else if (period === "this_month") {
        if (month) exportParams.set("month", month)
        if (year) exportParams.set("year", year)
    } else if (period === "this_year") {
        if (year) exportParams.set("year", year)
    }
    const exportUrl = `/admin/statistics/export?${exportParams.toString()}`

    const statCards = [
        {
            title: "Total Peminjaman",
            value: summary.total_peminjaman,
            desc: "Total peminjaman pada periode terpilih",
            color: "text-blue-600",
        },
        {
            title: "Board Game Terpopuler",
            value: summary.terpopuler ?? "-",
            desc: "Paling sering dipinjam",
            color: "text-emerald-600",
            small: true,
            span: true,
        },
        {
            title: "Total Board Game",
            value: summary.total_game,
            desc: "Jumlah board game tercatat",
            color: "text-amber-600",
        },
    ]

    return (
        <>
            <Head title="Statistik Peminjaman" />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Statistik Peminjaman</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Statistik peminjaman per board game · {periodLabel}
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <div
                            key={card.title}
                            className={`stats shadow border border-[#D6E8F5] bg-white rounded-xl ${card.span ? "lg:col-span-2" : ""}`}
                        >
                            <div className="stat">
                                <div className="stat-title text-[#0E4A73]/70 text-xs font-medium uppercase tracking-wider">
                                    {card.title}
                                </div>
                                <div className={`stat-value text-3xl font-bold ${card.color} ${card.small ? "text-xl lg:text-2xl" : ""}`}>
                                    {card.value}
                                </div>
                                <div className="stat-desc text-gray-400 text-xs">{card.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters Card */}
                <div className="card bg-white border border-[#D6E8F5] rounded-xl shadow-sm">
                    <div className="card-body p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
                            {/* Search */}
                            <div>
                                <label className="text-xs font-medium text-[#0E4A73]/70 uppercase tracking-wider block mb-1.5">
                                    Cari Board Game
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
                                        placeholder="Cari nama board game..."
                                        className="input input-bordered input-sm pl-9 w-full"
                                    />
                                </div>
                            </div>

                            {/* Period Filter */}
                            <div>
                                <label className="text-xs font-medium text-[#0E4A73]/70 uppercase tracking-wider block mb-1.5">
                                    Periode
                                </label>
                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="select select-bordered select-sm w-full"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Hari Ini</option>
                                    <option value="this_week">Minggu Ini</option>
                                    <option value="this_month">Bulan Ini</option>
                                    <option value="this_year">Tahun Ini</option>
                                    <option value="custom">Custom Date</option>
                                </select>
                            </div>

                            {/* Per Page Filter */}
                            <div>
                                <label className="text-xs font-medium text-[#0E4A73]/70 uppercase tracking-wider block mb-1.5">
                                    Tampil per Halaman
                                </label>
                                <select
                                    value={perPage}
                                    onChange={(e) => setPerPage(e.target.value)}
                                    className="select select-bordered select-sm w-full"
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="all">Semua</option>
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
                            <a
                                href={exportUrl}
                                className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-sm gap-2"
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
                                Ekspor CSV
                            </a>
                        </div>
                    </div>
                </div>

                {/* Stats Table Card */}
                <div className="card bg-white border border-[#D6E8F5] rounded-xl shadow-sm">
                    <div className="card-body p-0">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Statistik per Board Game
                            </h2>
                        </div>

                        {boardGames.data.length === 0 ? (
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
                                        d="M3 3v18h18M7 16l3-5 4 3 3-7"
                                    />
                                </svg>
                                <p className="text-gray-400 text-sm">
                                    Tidak ada data board game
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                                <th className="px-6 py-3 font-medium">No</th>
                                                <th className="px-6 py-3 font-medium">Nama Board Game</th>
                                                <th className="px-6 py-3 font-medium">Lantai</th>
                                                <th className="px-6 py-3 font-medium">Box</th>
                                                <th className="px-6 py-3 font-medium">Jumlah Peminjaman</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {boardGames.data.map((game, i) => (
                                                <tr
                                                    key={game.id}
                                                    className="hover:bg-[#FAF7F2] transition-colors border-b border-[#D6E8F5]"
                                                >
                                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                                        {(boardGames.current_page - 1) * boardGames.per_page + i + 1}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-[#071E30]">
                                                            {game.nama}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-[#0E4A73]/70 text-sm">
                                                        {game.lantai ?? "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                                        {game.box ?? "-"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-[#0E4A73]">
                                                            {game.peminjaman}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {boardGames.links && boardGames.links.length > 3 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#D6E8F5]">
                                        <span className="text-sm text-gray-500">
                                            Menampilkan {boardGames.from}–{boardGames.to} dari {boardGames.total} data
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {boardGames.links.map((link, i) =>
                                                link.url ? (
                                                    <Link
                                                        key={i}
                                                        href={link.url}
                                                        preserveScroll
                                                        className={`btn btn-sm min-w-9 ${
                                                            link.active
                                                                ? "bg-[#0E4A73] text-white border-none"
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
