import { useEffect } from "react"
import { Head } from "@inertiajs/react"
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

function parseMissingComponents(value) {
    if (!value) return null
    try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {}
    if (typeof value === "string" && value.trim()) return [value]
    return null
}

Print.layout = (page) => page;

export default function Print({ loan }) {
    useEffect(() => {
        window.print()
    }, [])

    return (
        <>
            <Head title={`Cetak #${loan.id}`} />
            <div className="p-8 max-w-3xl mx-auto print:mx-0 print:p-0">
                <div className="text-center mb-8 print:hidden">
                    <button onClick={() => window.print()} className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-sm">
                        Cetak
                    </button>
                </div>

                <div className="border-b-2 border-gray-900 pb-4 mb-6">
                    <h1 className="text-xl font-bold text-gray-900">UPT Perpustakaan Undip</h1>
                    <p className="text-sm text-gray-600">Bukti Peminjaman Board Game</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">ID Peminjaman</p>
                        <p className="text-sm font-mono text-gray-900 mt-0.5">#{loan.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Status</p>
                        <div className="mt-0.5"><BadgeStatus status={loan.status} /></div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Board Game</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{loan.game.nama}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Kode Game</p>
                        <p className="text-sm font-mono text-gray-600 mt-0.5">{loan.game.kode}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Dipinjam</p>
                        <p className="text-sm text-gray-900 mt-0.5">{formatDateTime(loan.borrowed_at)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Disetujui Oleh</p>
                        <p className="text-sm text-gray-900 mt-0.5">{loan.approved_by || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Dikembalikan</p>
                        <p className="text-sm text-gray-900 mt-0.5">{formatDateTime(loan.returned_at)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Diterima Oleh</p>
                        <p className="text-sm text-gray-900 mt-0.5">{loan.received_by || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Denda</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">
                            {loan.fine_amount ? `Rp ${Number(loan.fine_amount).toLocaleString("id-ID")}` : "-"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Kondisi</p>
                        <div className="mt-0.5"><BadgeCondition value={loan.return_condition} /></div>
                    </div>
                </div>

                {Array.isArray(loan.list_peminjam) && loan.list_peminjam.length > 0 && (
                    <div className="mb-6">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Peminjam</p>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-400 uppercase border-b border-gray-300">
                                    <th className="text-left pb-1.5 pr-6 font-medium">Nama</th>
                                    <th className="text-left pb-1.5 pr-6 font-medium">Identitas</th>
                                    <th className="text-left pb-1.5 font-medium">Jaminan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loan.list_peminjam.map((p, i) => (
                                    <tr key={i} className="text-gray-900 border-b border-gray-200">
                                        <td className="py-1.5 pr-6 font-medium">{p.nama}</td>
                                        <td className="py-1.5 pr-6">{p.nomor_identitas || "-"}</td>
                                        <td className="py-1.5">{p.jenis_jaminan?.toUpperCase()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {loan.notes && (
                    <div className="mb-6">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Catatan</p>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{loan.notes}</p>
                    </div>
                )}

                {(() => {
                    const list = parseMissingComponents(loan.missing_components)
                    if (!list) return null
                    return (
                        <div className="mb-6">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Komponen Hilang</p>
                            <ul className="text-sm text-red-600 bg-red-50 rounded-lg p-3 space-y-1 list-disc list-inside">
                                {list.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )
                })()}

                <div className="border-t border-gray-300 pt-4 mt-8 text-center text-xs text-gray-400">
                    Dicetak pada {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
            </div>
        </>
    )
}
