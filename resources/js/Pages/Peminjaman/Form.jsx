import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";

export default function Form({ boardgames = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: "",
        nim: "",
        boardgame_id: "",
        jam_pinjam: "",
        tanggal_pinjam: "",
        catatan: "",
    });

    useEffect(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const local = new Date(now - offset);
        setData("tanggal_pinjam", local.toISOString().slice(0, 10));
        setData("jam_pinjam", local.toISOString().slice(11, 19));

        const params = new URLSearchParams(window.location.search);
        const bgId = params.get("boardgame_id");
        if (bgId) {
            setData("boardgame_id", bgId);
        }
    }, []);

    const bgList = Array.isArray(boardgames) ? boardgames : [];

    const [search, setSearch] = useState("");

    useEffect(() => {
        if (data.boardgame_id && bgList.length > 0) {
            const bg = bgList.find((b) => b.id == data.boardgame_id);
            if (bg) {
                setSearch(bg.nama);
            }
        }
    }, [data.boardgame_id, bgList]);

    const filtered = useMemo(() => {
        if (!search) return bgList;
        const q = search.toLowerCase();
        return bgList.filter(
            (bg) =>
                bg.nama?.toLowerCase().includes(q) ||
                bg.kode?.toLowerCase().includes(q),
        );
    }, [search, bgList]);

    const selected = bgList.find((bg) => bg.id == data.boardgame_id);

    function handleSubmit(e) {
        e.preventDefault();
        post("/peminjaman");
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Link
                href="/katalog"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </svg>
                Kembali ke Katalog
            </Link>
            <h1 className="text-2xl font-bold mb-1">Form Peminjaman</h1>
            <p className="text-sm text-slate-500 mb-6">
                Isi data berikut untuk mengajukan peminjaman boardgame
            </p>

            {flash.success && (
                <div className="alert alert-success mb-4 shadow-sm">
                    <span>{flash.success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-5">
                        <h2 className="card-title text-base mb-3">
                            Data Peminjam
                        </h2>

                        <div className="form-control mb-3">
                            <label className="label">
                                <span className="label-text font-medium">
                                    Nama
                                </span>
                            </label>
                            <input
                                type="text"
                                className={`input input-bordered w-full ${errors.nama ? "input-error" : ""}`}
                                value={data.nama}
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.nama && (
                                <p className="text-error text-xs mt-1">
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">
                                    NIM
                                </span>
                            </label>
                            <input
                                type="text"
                                className={`input input-bordered w-full ${errors.nim ? "input-error" : ""}`}
                                value={data.nim}
                                onChange={(e) => setData("nim", e.target.value)}
                                placeholder="Masukkan NIM"
                            />
                            {errors.nim && (
                                <p className="text-error text-xs mt-1">
                                    {errors.nim}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-5">
                        <h2 className="card-title text-base mb-3">
                            Pilihan Board Game
                        </h2>

                        {errors.boardgame_id && (
                            <div className="alert alert-error py-2 text-sm mb-3">
                                <span>{errors.boardgame_id}</span>
                            </div>
                        )}

                        <div className="form-control mb-3">
                            <label className="label">
                                <span className="label-text font-medium">
                                    Cari board game
                                </span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Cari berdasarkan judul, kode, atau kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {search.trim() !== "" && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        Pilih board game
                                    </span>
                                </label>
                                <div className="max-h-48 overflow-y-auto border border-base-300 rounded-box">
                                    {filtered.length === 0 ? (
                                        <div className="p-4 text-center text-slate-400">
                                            Board game tidak ditemukan
                                        </div>
                                    ) : (
                                        filtered.map((bg) => {
                                            const isBorrowed =
                                                bg.availability_status ===
                                                "borrowed";
                                            return (
                                                <label
                                                    key={bg.id}
                                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-base-200 transition-colors ${
                                                        data.boardgame_id ==
                                                        bg.id
                                                            ? "bg-[#E8F3EF] border-l-4 border-[#2F6F62]"
                                                            : "border-l-4 border-transparent"
                                                    } ${isBorrowed ? "opacity-60" : ""}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="boardgame_id"
                                                        className="radio radio-primary radio-sm"
                                                        value={bg.id}
                                                        checked={
                                                            data.boardgame_id ==
                                                            bg.id
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "boardgame_id",
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={isBorrowed}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate">
                                                            {bg.nama}
                                                        </p>
                                                        <p className="text-xs text-slate-500 truncate">
                                                            {bg.kode}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`badge badge-sm ${
                                                            isBorrowed
                                                                ? "badge-warning"
                                                                : "badge-success"
                                                        }`}
                                                    >
                                                        {bg.availability_label}
                                                    </span>
                                                </label>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}

                        {selected && (
                            <div className="mt-3 p-3 bg-base-200 rounded-box text-sm">
                                <span className="font-medium">Dipilih:</span>{" "}
                                {selected.nama}
                                <span className="ml-2 text-slate-500">
                                    ({selected.kode})
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-5">
                        <h2 className="card-title text-base mb-3">
                            Waktu Peminjaman
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        Tanggal pinjam
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full bg-base-200"
                                    value={
                                        data.tanggal_pinjam
                                            ? new Date(
                                                  data.tanggal_pinjam +
                                                      "T00:00:00",
                                              ).toLocaleDateString("en-GB", {
                                                  day: "2-digit",
                                                  month: "long",
                                                  year: "2-digit",
                                              })
                                            : ""
                                    }
                                    disabled
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        Jam pinjam
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full bg-base-200 font-mono"
                                    value={data.jam_pinjam}
                                    disabled
                                />
                                {errors.jam_pinjam && (
                                    <p className="text-error text-xs mt-1">
                                        {errors.jam_pinjam}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-5">
                        <h2 className="card-title text-base mb-3">Catatan</h2>

                        <div className="form-control">
                            <textarea
                                className={`textarea textarea-bordered w-full ${errors.catatan ? "textarea-error" : ""}`}
                                rows={3}
                                placeholder="Tambah catatan jika diperlukan..."
                                value={data.catatan}
                                onChange={(e) =>
                                    setData("catatan", e.target.value)
                                }
                            />
                            {errors.catatan && (
                                <p className="text-error text-xs mt-1">
                                    {errors.catatan}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn bg-[#2F6F62] hover:bg-[#255A4F] text-white border-none flex-1"
                    >
                        {processing ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />
                                Mengirim...
                            </>
                        ) : (
                            "Kirim Permohonan"
                        )}
                    </button>
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => reset()}
                        disabled={processing}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

Form.layout = (page) => page;
