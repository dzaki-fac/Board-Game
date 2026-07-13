import { Head, Link } from "@inertiajs/react";
import BadgeStatus from "../../Components/BadgeStatus";
import BadgeCondition from "../../Components/BadgeCondition";

function formatDateTime(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function parseMissingComponents(value) {
    if (!value) return null;
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    if (typeof value === "string" && value.trim()) return [value];
    return null;
}

export default function Show({ loan }) {
    return (
        <>
            <Head title="Detail Peminjaman" />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Detail Peminjaman
                        </h1>
                        <p className="text-sm text-[#2F6F62]/60 mt-1">
                            #{loan.id} — {loan.game.nama}
                        </p>
                    </div>
                    <Link
                        href={
                            loan.status === "borrowed"
                                ? "/admin/loans"
                                : "/admin/history"
                        }
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
                        Kembali
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info Card */}
                    <div className="lg:col-span-2">
                        <div className="card bg-white border border-[#E8F3EF] rounded-xl shadow-sm">
                            <div className="card-body p-6 space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Informasi Peminjaman
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs text-[#2F6F62]/70 uppercase tracking-wider font-medium">
                                            Board Game
                                        </p>
                                        <p className="text-sm font-medium text-[#173C33] mt-1">
                                            {loan.game.nama}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                            Kode Game
                                        </p>
                                        <p className="text-sm font-mono text-gray-500 mt-1">
                                            {loan.game.kode}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                            Dipinjam
                                        </p>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {formatDateTime(loan.borrowed_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                            Dikembalikan
                                        </p>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {formatDateTime(loan.returned_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#2F6F62]/70 uppercase tracking-wider font-medium">
                                            Status
                                        </p>
                                        <div className="mt-1">
                                            <BadgeStatus status={loan.status} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                            Kondisi
                                        </p>
                                        <div className="mt-1">
                                            <BadgeCondition
                                                value={loan.return_condition}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                            Denda
                                        </p>
                                        <p className="text-sm font-medium text-[#173C33] mt-1">
                                            {loan.fine_amount
                                                ? `Rp ${Number(loan.fine_amount).toLocaleString("id-ID")}`
                                                : "-"}
                                        </p>
                                    </div>

                                </div>

                                {Array.isArray(loan.list_peminjam) && loan.list_peminjam.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
                                            Peminjam
                                        </p>
                                        <table className="text-sm w-full">
                                                    <thead>
                                                        <tr className="text-xs text-gray-400 uppercase border-b border-gray-200">
                                                            <th className="text-left pb-1.5 pr-6 font-medium">Nama</th>
                                                            <th className="text-left pb-1.5 pr-6 font-medium">Identitas</th>
                                                            <th className="text-left pb-1.5 font-medium">Jaminan</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {loan.list_peminjam.map((p, i) => (
                                                            <tr key={i} className="text-[#173C33] border-b border-gray-100 last:border-0">
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
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                                            Catatan
                                        </p>
                                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                                            {loan.notes}
                                        </p>
                                    </div>
                                )}

                                {(() => {
                                    const list = parseMissingComponents(
                                        loan.missing_components,
                                    );
                                    if (!list) return null;
                                    return (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                                                Komponen Hilang
                                            </p>
                                            <ul className="text-sm text-red-600 bg-red-50 rounded-lg p-3 space-y-1 list-disc list-inside">
                                                {list.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Card */}
                    <div className="space-y-6">
                        <div className="card bg-white border border-[#E8F3EF] rounded-xl shadow-sm">
                            <div className="card-body p-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Aksi Cepat
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        href="/admin/history"
                                        className="btn btn-outline btn-sm w-full"
                                    >
                                        Kembali ke Riwayat
                                    </Link>
                                    <Link
                                        href="/admin/loans"
                                        className="btn btn-outline btn-sm w-full"
                                    >
                                        Kembali ke Peminjaman
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
