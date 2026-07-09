import { Head, Link, useForm } from "@inertiajs/react"
import { useEffect, useMemo, useState } from "react"
import { parseKomponen } from "../../utils/parseKomponen"

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

    const conditionDisabled = data.status === "not_returned" || data.status === "lost"
    const componentsDisabled = data.status === "lost"

    const selectedLoan = useMemo(() => {
        if (!data.loan_id) return null
        return loans.find((l) => l.id === Number(data.loan_id)) || null
    }, [data.loan_id, loans])

    const components = useMemo(() => {
        if (!selectedLoan?.game?.komponen) return []
        return parseKomponen(selectedLoan.game.komponen)
    }, [selectedLoan])

    const [checked, setChecked] = useState([])

    useEffect(() => {
        setChecked(components.map(() => true))
    }, [components])

    const missingComponents = useMemo(() => {
        return components.filter((_, i) => !checked[i])
    }, [components, checked])

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
        if (data.status === "not_returned") return "not_returned"
        if (data.status === "lost") return "lost"
        return "returned"
    }

    const statusLabel = {
        returned: "Dikembalikan",
        not_returned: "Belum Dikembalikan",
        lost: "Hilang",
    }

    const conditionLabel = {
        good: "Baik",
        minor_damage: "Rusak Ringan",
        damaged: "Rusak",
        missing_parts: "Kekurangan Bagian",
    }

    function toggleComponent(index) {
        setChecked((prev) => {
            const next = [...prev]
            next[index] = !next[index]
            return next
        })
    }

    const returnedCount = checked.filter(Boolean).length
    const totalCount = components.length

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
                        <div className="card bg-white border border-gray-200 rounded-xl shadow-sm">
                            <div className="card-body p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                    Informasi Pengembalian
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Loan Select */}
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend text-sm font-medium text-gray-700">
                                            Peminjaman
                                        </legend>
                                        <select
                                            value={data.loan_id}
                                            onChange={(e) => setData("loan_id", e.target.value)}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="">Pilih peminjaman aktif</option>
                                            {loans.map((loan) => (
                                                <option key={loan.id} value={loan.id}>
                                                    {loan.game.nama} — {loan.borrower_name}
                                                </option>
                                            ))}
                                        </select>
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
                                                    <span className="text-gray-400 font-normal ml-1">(uncheck item yang hilang)</span>
                                                )}
                                            </legend>
                                            <div
                                                className={`border rounded-lg p-4 max-h-80 overflow-y-auto ${componentsDisabled ? "bg-gray-100 border-gray-200" : "border-gray-200"}`}
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                {components.map((component, index) => (
                                                    <label
                                                        key={index}
                                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                                            componentsDisabled
                                                                ? "bg-gray-50 border border-gray-200 opacity-60"
                                                                : checked[index]
                                                                    ? "bg-green-50 border border-green-200"
                                                                    : "bg-red-50 border border-red-200"
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={checked[index] ?? false}
                                                            onChange={() => componentsDisabled ? null : toggleComponent(index)}
                                                            disabled={componentsDisabled}
                                                            className="checkbox checkbox-sm"
                                                        />
                                                        <span
                                                            className={`text-sm ${
                                                                componentsDisabled
                                                                    ? "text-gray-400"
                                                                    : checked[index]
                                                                        ? "text-gray-700"
                                                                        : "text-red-700 line-through"
                                                            }`}
                                                        >
                                                            {component}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
                                    )}

                                    {/* Returned At */}
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend text-sm font-medium text-gray-700">
                                            Dikembalikan Pada
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
                                                <option value="missing_parts">Kekurangan Bagian</option>
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
                                            placeholder="Masukkan jumlah denda jika ada"
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
                                            placeholder="Tambahkan catatan pengembalian, detail kondisi, atau keterangan admin"
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
                                                if (newStatus === "not_returned" || newStatus === "lost") {
                                                    setData("return_condition", "")
                                                } else if (newStatus === "returned") {
                                                    setData("return_condition", "good")
                                                }
                                                if (newStatus === "lost") {
                                                    setChecked(components.map(() => true))
                                                }
                                            }}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="returned">Dikembalikan</option>
                                            <option value="not_returned">Belum Dikembalikan</option>
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
                                            className="btn btn-primary"
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
                        {/* Selected Loan Details */}
                        <div className="card bg-white border border-gray-200 rounded-xl shadow-sm">
                            <div className="card-body p-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Detail Peminjaman
                                </h3>

                                {selectedLoan ? (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Peminjam</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedLoan.borrower_name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Board Game</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedLoan.game.nama}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Dipinjam Pada</p>
                                            <p className="text-sm text-gray-700">
                                                {formatDateTime(selectedLoan.borrowed_at)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Status Saat Ini</p>
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
                                            Pilih peminjaman untuk melihat detail
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Return Summary */}
                        <div className="card bg-white border border-gray-200 rounded-xl shadow-sm">
                            <div className="card-body p-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Ringkasan Pengembalian
                                </h3>

                                {selectedLoan ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Peminjam</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {selectedLoan.borrower_name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Board Game</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {selectedLoan.game.nama}
                                            </span>
                                        </div>

                                        {totalCount > 0 && (
                                            <>
                                                <div className="border-t border-gray-100 my-1"></div>
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
                                                            : "text-gray-500"
                                                    }`}>
                                                        {missingComponents.length}
                                                    </span>
                                                </div>
                                                {missingComponents.length > 0 && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Item Hilang</p>
                                                        <ul className="text-xs text-red-600 list-disc list-inside space-y-0.5">
                                                            {missingComponents.map((item, i) => (
                                                                <li key={i}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                <div className="border-t border-gray-100 my-1"></div>
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
                                                        : getFinalStatus() === "not_returned"
                                                            ? "badge-warning"
                                                            : getFinalStatus() === "lost"
                                                                ? "badge-error"
                                                                : "badge-ghost"
                                                }`}
                                            >
                                                {statusLabel[getFinalStatus()] || getFinalStatus().replace(/_/g, " ")}
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
                                            Pilih peminjaman untuk melihat ringkasan
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
