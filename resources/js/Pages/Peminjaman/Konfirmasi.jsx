import { Head, Link } from "@inertiajs/react";

export default function Konfirmasi({ permohonan, gagal, error, peminjams, boardgame_nama }) {
    if (gagal) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
                <Head title="Permohonan Gagal" />

                <div className="max-w-lg w-full bg-white rounded-3xl shadow-lg ring-1 ring-black/5 p-8 md:p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" className="w-8 h-8">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                        Permohonan Gagal
                    </h1>
                    <p className="text-sm text-slate-500 mb-8">
                        {boardgame_nama ? `Peminjaman ${boardgame_nama} tidak dapat diajukan.` : "Peminjaman tidak dapat diajukan."}
                    </p>

                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 text-sm text-red-800 text-left">
                        <div className="flex gap-3">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0 mt-0.5">
                                <path d="M12 3 2 20h20L12 3Z" />
                                <path d="M12 10v4" />
                                <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
                            </svg>
                            <span>{error || "Terjadi kesalahan."}</span>
                        </div>
                    </div>

                    <Link
                        href="/peminjaman/create"
                        className="inline-block w-full rounded-full py-3 text-base font-semibold text-white text-center transition-colors"
                        style={{ backgroundColor: "#0E4A73" }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0A3A5C")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0E4A73")}
                    >
                        Kembali ke Form
                    </Link>
                </div>
            </div>
        );
    }

    const bg = permohonan.boardgame;
    const listPeminjam = Array.isArray(permohonan.list_peminjam) ? permohonan.list_peminjam : [];
    const first = listPeminjam[0] || {};
    const namaPeminjam = first.nama || "-";
    const jenisJaminan = first.jenis_jaminan === "ktm" ? "KTM" : "KTP";
    const nomorIdentitas = first.nomor_identitas || "-";
    const jumlahAnggota = listPeminjam.length;

    return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
            <Head title="Permohonan Terkirim" />

            <div className="max-w-lg w-full bg-white rounded-3xl shadow-lg ring-1 ring-black/5 p-8 md:p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#0E4A73" strokeWidth="2.5" className="w-8 h-8">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Permohonan Terkirim
                </h1>
                <p className="text-sm text-slate-500 mb-8">
                    Permohonan peminjaman <span className="font-semibold text-slate-700">{bg?.nama}</span> telah diajukan.
                </p>

                <div className="bg-[#FAF7F2] rounded-2xl p-5 mb-8 text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Peminjam</span>
                        <span className="font-medium text-slate-800">{namaPeminjam}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Jenis Jaminan</span>
                        <span className="font-medium text-slate-800">{jenisJaminan}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">{jenisJaminan === "KTM" ? "NIM" : "NIK"}</span>
                        <span className="font-medium text-slate-800">{nomorIdentitas}</span>
                    </div>
                    {jumlahAnggota > 1 && (
                        <div className="flex justify-between">
                            <span className="text-slate-500">Jumlah Anggota</span>
                            <span className="font-medium text-slate-800">{jumlahAnggota} orang</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-slate-500">Board Game</span>
                        <span className="font-medium text-slate-800">{bg?.nama}</span>
                    </div>
                    {bg?.lantai && (
                        <div className="flex justify-between">
                            <span className="text-slate-500">Lokasi</span>
                            <span className="font-medium text-slate-800">Lantai {bg.lantai}</span>
                        </div>
                    )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 text-sm text-amber-800 text-left">
                    <div className="flex gap-3">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0 mt-0.5">
                            <path d="M12 3 2 20h20L12 3Z" />
                            <path d="M12 10v4" />
                            <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
                        </svg>
                        <span>
                            Silakan menemui petugas di <strong>Lantai {bg?.lantai}</strong> untuk memproses peminjaman. {namaPeminjam} sebagai pemberi jaminan wajib membawa {jenisJaminan} atas nama {namaPeminjam}.
                        </span>
                    </div>
                </div>

                <Link
                    href="/katalog"
                    className="inline-block w-full rounded-full py-3 text-base font-semibold text-white text-center transition-colors"
                    style={{ backgroundColor: "#0E4A73" }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0A3A5C")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0E4A73")}
                >
                    Kembali ke Katalog
                </Link>
            </div>
        </div>
    );
}

Konfirmasi.layout = (page) => page;
