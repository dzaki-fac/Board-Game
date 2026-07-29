import { Head, Link, useForm } from "@inertiajs/react"
import { useEffect, useMemo, useState } from "react"

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

export default function Create({ loans }) {
    const now = new Date()
    const today = now.toISOString().split("T")[0]
    const nowLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

    const { data, setData, post, processing, errors } = useForm({
        loan_id: "",
        returned_at: nowLocal,
        return_condition: "good",
        missing_components: [],
        fine_amount: null,
        return_notes: "",
        status: "returned",
    })

    const conditionDisabled = data.status === "lost"
    const componentsDisabled = data.status === "lost"

    const selectedLoan = useMemo(() => {
        if (!data.loan_id) return null
        return loans.find((l) => l.id === Number(data.loan_id)) || null
    }, [data.loan_id, loans])

    const components = useMemo(() => {
        if (!selectedLoan?.game?.komponen) return []
        const hilang = selectedLoan.game.barang_hilang ?? []
        return selectedLoan.game.komponen.map(k => {
            const sudahHilang = hilang.find(h => h.nama === k.nama)
            return {
                nama: k.nama,
                available: k.jumlah - (sudahHilang?.jumlah ?? 0),
            }
        })
    }, [selectedLoan])

    const [missingQty, setMissingQty] = useState([])
    const [loanSearch, setLoanSearch] = useState("")
    const [loanDropdownOpen, setLoanDropdownOpen] = useState(false)

    const filteredLoans = useMemo(() => {
        if (!loanSearch) return loans
        const q = loanSearch.toLowerCase()
        return loans.filter((loan) => {
            const gameName = loan.game?.nama?.toLowerCase() || ""
            const peminjamList = Array.isArray(loan.list_peminjam) ? loan.list_peminjam : []
            const peminjamName = peminjamList[0]?.nama?.toLowerCase() || ""
            return gameName.includes(q) || peminjamName.includes(q)
        })
    }, [loans, loanSearch])

    useEffect(() => {
        setMissingQty(components.map(() => null))
    }, [components])

    const missingComponents = useMemo(() => {
        return components
            .map((c, i) => (missingQty[i] ? { nama: c.nama, jumlah: missingQty[i] } : null))
            .filter(Boolean)
    }, [components, missingQty])

    useEffect(() => {
        setData("missing_components", missingComponents.length > 0 ? missingComponents : [])
        if (data.status === "returned") {
            if (missingComponents.length > 0 && data.return_condition !== "missing_parts") {
                setData("return_condition", "missing_parts")
            } else if (missingComponents.length === 0 && data.return_condition === "missing_parts") {
                setData("return_condition", "good")
            }
        }
    }, [missingComponents, data.status])

    function handleSubmit(e) {
        e.preventDefault()
        post("/admin/returns")
    }

    function isProcessing() {
        return processing
    }

    function getFinalStatus() {
        if (data.status === "lost") return "lost"
        return "returned"
    }

    const statusLabels = {
        returned: "Dikembalikan",
        lost: "Hilang",
    }

    const conditionLabel = {
        good: "Baik",
        minor_damage: "Rusak Ringan",
        damaged: "Rusak",
        missing_parts: "Bagian Hilang",
    }

    function setQty(index, qty) {
        setMissingQty((prev) => {
            const next = [...prev]
            next[index] = qty > 0 ? qty : null
            return next
        })
    }

    const totalCount = components.reduce((sum, c) => sum + c.available, 0)
    const returnedCount = totalCount - missingComponents.reduce((sum, m) => sum + m.jumlah, 0)
    const totalHilang = missingComponents.reduce((sum, m) => sum + m.jumlah, 0)

    return (
        <>
            <Head title="Form Pengembalian" />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Form Pengembalian</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Proses pengembalian board game yang dipinjam
                        </p>
                    </div>
                    <Link
                        href="/admin/loans"
                        className="btn btn-ghost btn-sm gap-2 text-gray-600"
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
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Kembali ke Peminjaman
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form Card */}
                    <div className="lg:col-span-2">
                        <div className="card bg-white border border-[#D6E8F5] rounded-xl shadow-sm">
                            <div className="card-body p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                    Informasi Pengembalian
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Loan Select */}
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend text-sm font-medium text-gray-700">
                                            Pinjaman
                                        </legend>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={loanSearch}
                                                onChange={(e) => {
                                                    setLoanSearch(e.target.value)
                                                    setLoanDropdownOpen(true)
                                                }}
                                                onFocus={() => setLoanDropdownOpen(true)}
                                                placeholder={selectedLoan ? `${selectedLoan.game.nama} — ${Array.isArray(selectedLoan.list_peminjam) ? selectedLoan.list_peminjam[0].nama : selectedLoan.list_peminjam?.nama}` : "Cari pinjaman aktif..."}
                                                className="input input-bordered w-full"
                                            />
                                            {data.loan_id && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setData("loan_id", "")
                                                        setLoanSearch("")
                                                        setLoanDropdownOpen(false)
                                                    }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                            {loanDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setLoanDropdownOpen(false)} />
                                                    <div className="absolute z-20 mt-1 w-full bg-white border border-[#D6E8F5] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                                        {filteredLoans.length === 0 ? (
                                                            <div className="px-3 py-4 text-sm text-gray-400 text-center">
                                                                Tidak ada pinjaman yang cocok
                                                            </div>
                                                        ) : (
                                                            filteredLoans.map((loan) => (
                                                                <button
                                                                    key={loan.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData("loan_id", loan.id)
                                                                        setLoanSearch("")
                                                                        setLoanDropdownOpen(false)
                                                                    }}
                                                                    className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-[#D6E8F5] transition-colors text-left ${data.loan_id === loan.id ? "bg-[#D6E8F5]" : ""}`}
                                                                >
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-900 truncate">{loan.game.nama}</p>
                                                                        <p className="text-xs text-gray-500 truncate">{Array.isArray(loan.list_peminjam) ? loan.list_peminjam[0].nama : loan.list_peminjam?.nama}</p>
                                                                    </div>
                                                                    {data.loan_id === loan.id && (
                                                                        <svg className="w-4 h-4 text-[#0E4A73] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                            <polyline points="20 6 9 17 4 12" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {errors.loan_id && (
                                            <p className="text-red-500 text-xs mt-1">{errors.loan_id}</p>
                                        )}
                                    </fieldset>

                                    {/* Board Game Components Checklist */}
                                    {components.length > 0 && (
                                        <fieldset className="fieldset">
                                            <legend className="fieldset-legend text-sm font-medium text-gray-700">
                                                Komponen Board Game
                                                {componentsDisabled ? (
                                                    <span className="text-gray-400 font-normal ml-1">(dinonaktifkan untuk status Hilang)</span>
                                                ) : (
                                                    <span className="text-gray-400 font-normal ml-1">(centang komponen yang hilang)</span>
                                                )}
                                            </legend>
                                            <div
                                                className={`border rounded-lg p-4 max-h-80 overflow-y-auto ${componentsDisabled ? "bg-[#FAF7F2] border-[#D6E8F5]" : "border-[#D6E8F5]"}`}
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                {components.map((component, index) => {
                                                    const isMissing = missingQty[index] > 0
                                                    return (
                                                        <div key={index} className={`p-2 rounded-lg transition-colors ${
                                                            componentsDisabled
                                                                ? "bg-[#FAF7F2] border border-[#D6E8F5] opacity-60"
                                                                : isMissing
                                                                    ? "bg-red-50 border border-red-200"
                                                                    : "bg-green-50 border border-green-200"
                                                        }`}>
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!isMissing}
                                                                    onChange={() => setQty(index, isMissing ? null : 1)}
                                                                    disabled={componentsDisabled}
                                                                    className="checkbox checkbox-sm"
                                                                />
                                                                <span className={`text-sm flex-1 ${
                                                                    componentsDisabled
                                                                        ? "text-gray-400"
                                                                        : isMissing
                                                                            ? "text-red-700 line-through"
                                                                            : "text-gray-700"
                                                                }`}>
                                                                    {component.available} {component.nama}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </fieldset>
                                    )}

                                    {/* Missing Components Summary Card */}
                                    {missingComponents.length > 0 && (
                                        <div className="card bg-red-50 border border-red-200 rounded-xl shadow-sm">
                                            <div className="card-body p-4">
                                                <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                                    Komponen Hilang
                                                </h3>
                                                <p className="text-xs text-red-600 mt-1">Atur jumlah masing-masing komponen yang hilang</p>
                                                <div className="mt-3 space-y-2">
                                                    {components.map((component, index) => {
                                                        if (!(missingQty[index] > 0)) return null
                                                        return (
                                                            <div key={index} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-red-100">
                                                                <span className="text-sm text-red-700">{component.nama}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs text-red-500">Jumlah:</span>
                                                                    <input
                                                                        type="number"
                                                                        value={missingQty[index]}
                                                                        min={1}
                                                                        max={component.available}
                                                                        onChange={(e) => setQty(index, Math.min(parseInt(e.target.value) || 1, component.available))}
                                                                        className="input input-bordered input-xs w-16 text-center"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Returned At */}
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend text-sm font-medium text-gray-700">
                                            Dikembalikan
                                        </legend>
                                        <input
                                            type="datetime-local"
                                            value={data.returned_at}
                                            onChange={(e) => setData("returned_at", e.target.value)}
                                            className="input input-bordered w-full"
                                        />
                                        {errors.returned_at && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.returned_at}
                                            </p>
                                        )}
                                    </fieldset>

                                    {/* Board Game Condition */}
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend text-sm font-medium text-gray-700">
                                            Kondisi Board Game
                                            {conditionDisabled && (
                                                <span className="text-gray-400 font-normal ml-1">(dinonaktifkan untuk status ini)</span>
                                            )}
                                        </legend>
                                        <select
                                            value={data.return_condition}
                                            onChange={(e) => setData("return_condition", e.target.value)}
                                            disabled={conditionDisabled}
                                            className={`select select-bordered w-full ${conditionDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <option value="good">Baik</option>
                                            <option value="minor_damage">Rusak Ringan</option>
                                            <option value="damaged">Rusak</option>
                                            {missingComponents.length > 0 && (
                                                <option value="missing_parts">Bagian Hilang</option>
                                            )}
                                        </select>
                                        {errors.return_condition && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.return_condition}
                                            </p>
                                        )}
                                    </fieldset>

                                    {/* Fine Amount */}
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend text-sm font-medium text-gray-700">
                                            Denda
                                            <span className="text-gray-400 font-normal ml-1">(opsional)</span>
                                        </legend>
                                        <input
                                            type="number"
                                            value={data.fine_amount ?? ""}
                                            onChange={(e) => setData("fine_amount", e.target.value === "" ? null : e.target.value)}
                                            className="input input-bordered w-full"
                                            placeholder="Masukkan denda jika ada"
                                            min="0"
                                            step="0.01"
                                        />
                                        {errors.fine_amount && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.fine_amount}
                                            </p>
                                        )}
                                    </fieldset>

                                    {/* Return Notes */}
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend text-sm font-medium text-gray-700">
                                            Catatan Pengembalian
                                            <span className="text-gray-400 font-normal ml-1">(opsional)</span>
                                        </legend>
                                        <textarea
                                            value={data.return_notes}
                                            onChange={(e) => setData("return_notes", e.target.value)}
                                            className="textarea textarea-bordered w-full"
                                            rows={3}
                                            placeholder="Tambah catatan, detail kondisi, atau keterangan admin"
                                        />
                                        {errors.return_notes && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.return_notes}
                                            </p>
                                        )}
                                    </fieldset>

                                    {/* Status */}
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend text-sm font-medium text-gray-700">
                                            Status
                                        </legend>
                                        <select
                                            value={data.status}
                                            onChange={(e) => {
                                                const newStatus = e.target.value
                                                setData("status", newStatus)
                                                if (newStatus === "lost") {
                                                    setData("return_condition", "")
                                                } else if (newStatus === "returned") {
                                                    setData("return_condition", "good")
                                                }
                                                if (newStatus === "lost") {
                                                    setMissingQty(components.map(() => null))
                                                }
                                            }}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="returned">Dikembalikan</option>
                                            <option value="lost">Hilang</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                                        )}
                                    </fieldset>

                                    {/* Form Buttons */}
                                    <div className="flex items-center gap-3 pt-2">
                                        <Link
                                            href="/admin/loans"
                                            className="btn btn-ghost"
                                        >
                                            Batal
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={isProcessing()}
                                            className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none"
                                        >
                                            {isProcessing() ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : null}
                                            {isProcessing() ? "Memproses..." : "Proses Pengembalian"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Cards */}
                    <div className="space-y-6">
                        {/* Riwayat Komponen Hilang */}
                        {selectedLoan && (
                            <div className="card bg-white border border-[#D6E8F5] rounded-xl shadow-sm">
                                <div className="card-body p-6">
                                    <h3 className="text-sm font-semibold text-[#071E30] uppercase tracking-wider mb-4">
                                        Riwayat Komponen Hilang
                                    </h3>
                                    {selectedLoan.game.barang_hilang?.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedLoan.game.barang_hilang.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                                                    <span className="text-sm text-red-700">{item.nama}</span>
                                                    <span className="text-sm font-semibold text-red-600">{item.jumlah} buah</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">Belum ada riwayat komponen hilang</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Selected Loan Details */}
                        <div className="card bg-white border border-[#D6E8F5] rounded-xl shadow-sm">
                            <div className="card-body p-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Detail Pinjaman Dipilih
                                </h3>

                                {selectedLoan ? (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Peminjam</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {Array.isArray(selectedLoan.list_peminjam) ? selectedLoan.list_peminjam[0].nama : selectedLoan.list_peminjam?.nama}
                                            </p>
                                            {Array.isArray(selectedLoan.list_peminjam) && selectedLoan.list_peminjam.length > 1 && (
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    +{selectedLoan.list_peminjam.length - 1} anggota lainnya
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#0E4A73]/70">Board Game</p>
                                            <p className="text-sm font-medium text-[#071E30]">
                                                {selectedLoan.game.nama}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Dipinjam</p>
                                            <p className="text-sm text-gray-700">
                                                {formatDateTime(selectedLoan.borrowed_at)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Status</p>
                                            <span
                                                className={`badge badge-sm capitalize ${
                                                    selectedLoan.status === "borrowed"
                                                        ? "badge-primary"
                                                        : "badge-ghost"
                                                }`}
                                            >
                                                {selectedLoan.status === "borrowed" ? "Dipinjam" : selectedLoan.status}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-10 w-10 text-gray-300 mb-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        <p className="text-gray-400 text-sm">
                                            Pilih pinjaman untuk melihat detail
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Return Summary */}
                        <div className="card bg-white border border-[#D6E8F5] rounded-xl shadow-sm">
                            <div className="card-body p-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Ringkasan Pengembalian
                                </h3>

                                {selectedLoan ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Peminjam</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {Array.isArray(selectedLoan.list_peminjam) ? selectedLoan.list_peminjam[0].nama : selectedLoan.list_peminjam?.nama}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-[#0E4A73]/70">Board Game</span>
                                            <span className="text-sm font-medium text-[#071E30]">
                                                {selectedLoan.game.nama}
                                            </span>
                                        </div>

                                        {totalCount > 0 && (
                                            <>
                                                <div className="border-t border-[#D6E8F5] my-1"></div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-500">Total Komponen</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {totalCount}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-500">Dikembalikan</span>
                                                    <span className="text-sm font-medium text-green-600">
                                                        {returnedCount}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-500">Hilang</span>
                                                    <span className={`text-sm font-medium ${
                                                        missingComponents.length > 0
                                                            ? "text-red-600"
                                                            : "text-[#0E4A73]/70"
                                                    }`}>
                                                        {totalHilang}
                                                    </span>
                                                </div>
                                                {missingComponents.length > 0 && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Item Hilang</p>
                                                        <ul className="text-xs text-red-600 list-disc list-inside space-y-0.5">
                                                            {missingComponents.map((item, i) => (
                                                                <li key={i} className="flex justify-between">
                                                                    <span>{item.nama}</span>
                                                                    <span className="font-medium">x{item.jumlah}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                <div className="border-t border-[#D6E8F5] my-1"></div>
                                            </>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Tanggal Dikembalikan</span>
                                            <span className="text-sm text-gray-700">
                                                {data.returned_at ? formatDateTime(data.returned_at) : "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Kondisi</span>
                                            <span className="text-sm capitalize text-gray-700">
                                                {conditionLabel[data.return_condition] || data.return_condition.replace(/_/g, " ")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Denda</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {data.fine_amount
                                                    ? `Rp ${Number(data.fine_amount).toLocaleString("id-ID")}`
                                                    : "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Status Akhir</span>
                                            <span
                                                className={`badge badge-sm capitalize ${
                                                    getFinalStatus() === "returned"
                                                        ? "badge-success"
                                                        : getFinalStatus() === "lost"
                                                                ? "badge-error"
                                                                : "badge-ghost"
                                                }`}
                                            >
                                                {statusLabels[getFinalStatus()] || getFinalStatus().replace(/_/g, " ")}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-10 w-10 text-gray-300 mb-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                        <p className="text-gray-400 text-sm">
                                            Pilih pinjaman untuk melihat ringkasan
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
