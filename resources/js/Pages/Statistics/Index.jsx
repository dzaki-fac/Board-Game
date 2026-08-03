import { Head, router } from "@inertiajs/react"
import { baseUrl } from "@/lib/path"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { useMemo, useState } from "react"

export default function Index({ summary, topGames, trend, statusDistribution, filters }) {
    const [period, setPeriod] = useState(filters?.period || "all")
    const [range, setRange] = useState(filters?.range || "year")
    const [dateFrom, setDateFrom] = useState(filters?.date_from || "")
    const [dateTo, setDateTo] = useState(filters?.date_to || "")

    const periodOptions = [
        { value: "all", label: "Semua" },
        { value: "today", label: "Hari Ini" },
        { value: "7_days", label: "7 Hari" },
        { value: "30_days", label: "30 Hari" },
    ]

    const rangeOptions = [
        { value: "year", label: "1 Tahun" },
        { value: "6m", label: "6 Bulan" },
        { value: "3m", label: "3 Bulan" },
        { value: "month", label: "1 Bulan" },
        { value: "week", label: "1 Minggu" },
    ]

    function applyFilter(next) {
        const params = {}
        if (next.period && next.period !== "all") params.period = next.period
        if (next.range) params.range = next.range
        if (next.date_from) params.date_from = next.date_from
        if (next.date_to) params.date_to = next.date_to
        router.get(baseUrl("/admin/statistics"), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        })
    }

    function handleRange(value) {
        setRange(value)
        applyFilter({ period, range: value, date_from: dateFrom, date_to: dateTo })
    }

    function handlePeriod(value) {
        setPeriod(value)
        if (value === "all") {
            setDateFrom("")
            setDateTo("")
        }
        applyFilter({ period: value, range, date_from: "", date_to: "" })
    }

    function handleFrom(e) {
        const value = e.target.value
        setDateFrom(value)
        setPeriod("all")
        const next = { period: "all", range, date_from: value, date_to }
        if (dateTo && value && value > dateTo) next.date_to = ""
        applyFilter(next)
    }

    function handleTo(e) {
        const value = e.target.value
        setDateTo(value)
        setPeriod("all")
        const next = { period: "all", range, date_from: dateFrom, date_to: value }
        if (dateFrom && value && value < dateFrom) next.date_from = ""
        applyFilter(next)
    }

    function resetFilters() {
        setPeriod("all")
        setDateFrom("")
        setDateTo("")
        applyFilter({ period: "all", range, date_from: "", date_to: "" })
    }

    function periodLabel() {
        return periodOptions.find((o) => o.value === period)?.label || "Semua"
    }

    function handleExportCsv() {
        const lines = []

        lines.push("LAPORAN STATISTIK BOARD GAME")
        lines.push(`Periode: ${periodLabel()}${dateFrom ? ` (${dateFrom} s.d. ${dateTo})` : ""}`)
        lines.push(`Diekspor: ${new Date().toLocaleString("id-ID")}`)
        lines.push("")

        lines.push("RINGKASAN")
        lines.push("Indikator,Nilai")
        summaryCards.forEach((card) => {
            lines.push(`"${card.title}","${card.value}"`)
        })
        lines.push("")

        lines.push("TREN PEMINJAMAN")
        lines.push("Periode,Jumlah")
        trend.forEach((t) => {
            lines.push(`"${t.label}","${t.total}"`)
        })
        lines.push("")

        lines.push("BOARD GAME PALING SERING DIPINJAM")
        lines.push("Peringkat,Kode,Nama Board Game,Jumlah Pinjaman")
        topGameData.forEach((g) => {
            lines.push(`"${g.index}","${g.kode}","${g.nama}","${g.total}"`)
        })

        const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `statistik-board-game-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }
    const summaryCards = useMemo(
        () => [
            { title: "Total Board Game", value: summary.total_games, desc: "Jenis game tersedia", color: "text-[#0E4A73]", sub: `${summary.available_copies} siap pinjam` },
            { title: "Total Pinjaman", value: summary.total_loans, desc: "Seluruh peminjaman", color: "text-indigo-600", sub: "Rekaman peminjaman" },
            { title: "Pinjaman Aktif", value: summary.active, desc: "Sedang dipinjam", color: "text-[#0E4A73]", sub: "Belum dikembalikan" },
            { title: "Dikembalikan", value: summary.returned, desc: "Sudah dikembalikan", color: "text-emerald-600", sub: "Proses selesai" },
            { title: "Hilang", value: summary.lost, desc: "Ditandai hilang", color: "text-red-600", sub: "Perlu tindak lanjut" },
            { title: "Total Denda", value: `Rp ${Number(summary.total_fine || 0).toLocaleString("id-ID")}`, desc: "Akumulasi denda", color: "text-red-600", sub: "Dari game hilang" },
            { title: "Total Review", value: summary.total_reviews, desc: "Ulasan pengunjung", color: "text-amber-500", sub: "Kumpulan feedback" },
            { title: "Permohonan Pending", value: summary.pending_requests, desc: "Menunggu persetujuan", color: "text-orange-500", sub: "Perlu ditinjau" },
        ],
        [summary],
    )

    const topGameData = topGames.map((g, i) => ({ ...g, index: i + 1 }))
    const maxTop = Math.max(1, ...topGames.map((g) => g.total))

    return (
        <>
            <Head title="Statistik" />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Page Header + Filters */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Statistik</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Ringkasan dan analisis aktivitas peminjaman board game
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex flex-wrap items-center rounded-lg border border-[#D6E8F5] bg-white p-0.5">
                            {periodOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handlePeriod(opt.value)}
                                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
                                        period === opt.value
                                            ? "bg-[#0E4A73] text-white shadow-sm"
                                            : "text-gray-600 hover:bg-[#E8EEF8] hover:text-gray-900"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 py-1">
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={handleFrom}
                                className="border-0 bg-transparent text-xs text-gray-700 outline-none"
                            />
                            <span className="hidden text-xs text-gray-400 sm:inline">–</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={handleTo}
                                className="border-0 bg-transparent text-xs text-gray-700 outline-none"
                            />
                            {(period !== "all" || dateFrom || dateTo) && (
                                <button
                                    onClick={resetFilters}
                                    className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleExportCsv}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E4A73] px-3 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#0A3A5C]"
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
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {summaryCards.map((card) => (
                        <div
                            key={card.title}
                            className="stats shadow border border-[#D6E8F5] bg-white rounded-xl"
                        >
                            <div className="stat">
                                <div className="stat-title text-[#0E4A73]/70 text-xs font-medium uppercase tracking-wider">
                                    {card.title}
                                </div>
                                <div className={`stat-value text-2xl lg:text-3xl font-bold ${card.color}`}>
                                    {card.value}
                                </div>
                                <div className="stat-desc text-gray-400 text-xs">{card.desc} · {card.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Trend */}
                    <div className="lg:col-span-2 card bg-white border border-[#D6E8F5] rounded-xl shadow-sm">
                        <div className="card-body p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Tren Peminjaman</h2>
                                    <p className="text-sm text-gray-500">Jumlah peminjaman per periode</p>
                                </div>
                                <div className="flex flex-wrap items-center rounded-lg border border-[#D6E8F5] bg-white p-0.5">
                                    {rangeOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleRange(opt.value)}
                                            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
                                                range === opt.value
                                                    ? "bg-[#0E4A73] text-white shadow-sm"
                                                    : "text-gray-600 hover:bg-[#E8EEF8] hover:text-gray-900"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4 h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={trend} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6B7280" }} interval={range === "week" ? 0 : 1} />
                                        <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 12,
                                                border: "1px solid #D6E8F5",
                                                fontSize: 13,
                                            }}
                                            formatter={(value) => [value, "Pinjaman"]}
                                        />
                                        <Bar dataKey="total" fill="#0E4A73" radius={[4, 4, 0, 0]} maxBarSize={32} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Status Distribution */}
                    <div className="card bg-white border border-[#D6E8F5] rounded-xl shadow-sm">
                        <div className="card-body p-6">
                            <h2 className="text-lg font-semibold text-gray-900">Distribusi Status Pinjaman</h2>
                            <p className="text-sm text-gray-500">Seluruh riwayat peminjaman</p>
                            <div className="mt-4 h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusDistribution}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={3}
                                        >
                                            {statusDistribution.map((entry) => (
                                                <Cell key={`cell-${entry.name}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {statusDistribution.map((entry) => (
                                    <div key={entry.name} className="flex items-center gap-3">
                                        <span
                                        className="h-3 w-3 rounded-full shrink-0"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                        <span className="text-sm text-gray-600">{entry.name}</span>
                                        <span className="ml-auto text-sm font-semibold text-gray-900">{entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Games */}
                <div className="card bg-white border border-[#D6E8F5] rounded-xl shadow-sm">
                    <div className="card-body p-6">
                        <h2 className="text-lg font-semibold text-gray-900">Board Game Paling Sering Dipinjam</h2>
                        <p className="text-sm text-gray-500">Berdasarkan jumlah rekaman peminjaman</p>

                        {topGames.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-400 text-sm">Belum ada data peminjaman</p>
                            </div>
                        ) : (
                            <div className="space-y-4 mt-4">
                                {topGameData.map((game) => (
                                    <div key={game.id} className="flex items-center gap-4">
                                        <span className="w-8 text-right text-sm font-semibold text-[#0E4A73]/60">
                                            {game.index}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-900 truncate">{game.nama}</span>
                                                <span className="text-sm font-semibold text-[#0E4A73]">{game.total}×</span>
                                            </div>
                                            <div className="w-full bg-[#D6E8F5] rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{
                                                        width: `${(game.total / maxTop) * 100}%`,
                                                        backgroundColor: "#0E4A73",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}