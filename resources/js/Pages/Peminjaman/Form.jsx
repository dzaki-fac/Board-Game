import { Link, router, useForm, usePage } from "@inertiajs/react";
import { baseUrl } from '@/lib/path';
import { useEffect, useMemo, useState } from "react";
import { Reveal } from "../../Components/animations";

export default function Form({ boardgames = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const { data, setData, post, processing, errors, reset } = useForm({
        boardgame_id: "",
        jam_pinjam: "",
        tanggal_pinjam: "",
        catatan: "",
    });

    const [anggota, setAnggota] = useState([{ nama: "", jenis_jaminan: "ktm", nim: "", nik: "" }]);
    const [localErrors, setLocalErrors] = useState({});

    function addAnggota() {
        setAnggota([...anggota, { nama: "", jenis_jaminan: "ktm", nim: "", nik: "" }]);
    }

    function removeAnggota(index) {
        setAnggota(anggota.filter((_, i) => i !== index));
    }

    function updateAnggota(index, field, value) {
        const updated = anggota.map((a, i) =>
            i === index ? { ...a, [field]: value } : a,
        );
        setAnggota(updated);
        setLocalErrors((prev) => {
            const next = { ...prev };
            if (next[index]) {
                const errField = field === "jenis_jaminan" ? "identitas" : (field === "nim" || field === "nik" ? "identitas" : field);
                delete next[index][errField];
                if (!Object.keys(next[index]).length) delete next[index];
            }
            return next;
        });
    }

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

    function getAnggotaNomorIdentitas(a) {
        if (a.jenis_jaminan === "ktm") return a.nim;
        return a.nik;
    }

    function scrollToError() {
        const el = document.querySelector("[data-error]:not([data-error='']), .input-error, .textarea-error, .select-error");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    useEffect(() => {
        if (Object.keys(errors).length) {
            setTimeout(scrollToError, 100);
        }
    }, [errors]);

    function handleSubmit(e) {
        e.preventDefault();

        const newErrors = {};
        anggota.forEach((a, i) => {
            const err = {};
            if (!a.nama.trim()) err.nama = "Nama wajib diisi.";
            const id = getAnggotaNomorIdentitas(a);
            const expectedLen = a.jenis_jaminan === "ktm" ? 14 : 16;
            if (!id) err.identitas = a.jenis_jaminan === "ktm" ? "NIM wajib diisi." : "NIK wajib diisi.";
            else if (id.length !== expectedLen) err.identitas = a.jenis_jaminan === "ktm" ? "NIM harus 14 digit." : "NIK harus 16 digit.";
            if (Object.keys(err).length) newErrors[i] = err;
        });
        if (!data.boardgame_id) {
            newErrors.boardgame_id = "Pilih board game terlebih dahulu.";
        }
        setLocalErrors(newErrors);
        if (Object.keys(newErrors).length) {
            setTimeout(scrollToError, 100);
            return;
        }

        const peminjams = anggota.map((a) => ({
            nama: a.nama,
            jenis_jaminan: a.jenis_jaminan,
            nomor_identitas: getAnggotaNomorIdentitas(a),
        }));

        router.post(baseUrl("/peminjaman"), {
            boardgame_id: data.boardgame_id,
            tanggal_pinjam: data.tanggal_pinjam,
            jam_pinjam: data.jam_pinjam,
            catatan: data.catatan,
            peminjams,
        });
    }

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: "#EFF6FF" }}
        >
        <div className="max-w-xl mx-auto p-4">
            <Link
                href={baseUrl('/katalog')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-sky-800 hover:bg-sky-900 mb-4 px-3 py-1.5 rounded-full transition-transform active:scale-95 hover:scale-[1.03]"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </svg>
                Kembali ke Katalog
            </Link>
            <div>
                <h1 className="text-2xl font-bold mb-1">Form Peminjaman</h1>
                <p className="text-sm text-slate-500 mb-6">
                    Isi data berikut untuk mengajukan peminjaman boardgame
                </p>
            </div>

            {flash.success && (
                <div className="alert alert-success mb-4 shadow-sm">
                    <span>{flash.success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <Reveal>
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-5">
                        <h2 className="card-title text-base !mb-0">
                            Data Peminjam
                        </h2>

                        <div className="form-control">
                                <label className="label !pt-0 !pb-1">
                                    <span className="label-text font-medium">
                                        Daftar Peminjam
                                    </span>
                                </label>
                                <p className="text-xs text-error mb-3 ml-1">
                                    *Anggota pertama sebagai pemberi jaminan
                                </p>

                                {anggota.length > 0 && (
                                    <div className="space-y-3 mb-3">
                                        {anggota.map((a, index) => (
                                            <div
                                                key={index}
                                                data-row={index}
                                                className="flex gap-2 items-start p-3 bg-base-200 rounded-lg"
                                            >
                                                <div className="flex-1 space-y-2">
                                                    <input
                                                         type="text"
                                                         className={`input input-bordered input-sm w-full ${localErrors[index]?.nama ? "input-error" : ""}`}
                                                         value={a.nama}
                                                         onChange={(e) =>
                                                             updateAnggota(
                                                                 index,
                                                                 "nama",
                                                                 e.target.value,
                                                             )
                                                         }
                                                         placeholder="Nama peminjam"
                                                     />
                                                     {localErrors[index]?.nama && (
                                                         <p className="text-error text-xs mt-0.5">{localErrors[index].nama}</p>
                                                     )}
                                                     <div className="flex gap-2">
                                                         <select
                                                             className="select select-bordered select-sm w-36"
                                                             value={a.jenis_jaminan}
                                                             onChange={(e) =>
                                                                 updateAnggota(index, "jenis_jaminan", e.target.value)
                                                             }
                                                         >
                                                             <option value="ktm">KTM</option>
                                                             <option value="ktp">KTP</option>
                                                         </select>
                                                         <input
                                                             type="text"
                                                             className={`input input-bordered input-sm flex-1 ${localErrors[index]?.identitas ? "input-error" : ""}`}
                                                             value={a.jenis_jaminan === "ktm" ? a.nim : a.nik}
                                                             onChange={(e) => {
                                                                 const val = e.target.value.replace(/\D/g, "");
                                                                 updateAnggota(
                                                                     index,
                                                                     a.jenis_jaminan === "ktm" ? "nim" : "nik",
                                                                     val,
                                                                 );
                                                             }}
                                                             maxLength={a.jenis_jaminan === "ktm" ? 14 : 16}
                                                             placeholder={a.jenis_jaminan === "ktm" ? "NIM (14 digit)" : "NIK (16 digit)"}
                                                         />
                                                     </div>
                                                     {localErrors[index]?.identitas && (
                                                         <p className="text-error text-xs mt-0.5">{localErrors[index].identitas}</p>
                                                     )}
                                                 </div>
                                                <button
                                                    type="button"
                                                    className={`btn btn-ghost btn-sm btn-square mt-0.5 ${anggota.length === 1 ? "text-slate-300 cursor-not-allowed" : "text-error"}`}
                                                    disabled={anggota.length === 1}
                                                    onClick={() =>
                                                        removeAnggota(index)
                                                    }
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm border-dashed border-base-300 hover:border-sky-600 hover:text-sky-800 hover:bg-sky-50 transition-transform active:scale-95 hover:scale-[1.02]"
                                    onClick={addAnggota}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Tambah Peminjam
                                </button>
                            </div>
                    </div>
                </div>
                </Reveal>

                <Reveal>
                <div data-error={errors.boardgame_id || localErrors.boardgame_id ? "boardgame_id" : ""} className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-5">
                        <h2 className="card-title text-base !mb-0">
                            Pilihan Board Game
                        </h2>

                        <div className="form-control mb-3">
                            <label className="label !pt-0 !pb-1">
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
                                            return (
                                                <label
                                                    key={bg.id}
                                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-base-200 transition-colors ${
                                                        data.boardgame_id ==
                                                        bg.id
                                                            ? "bg-sky-50 border-l-4 border-sky-600"
                                                            : "border-l-4 border-transparent"
                                                    } ${!bg.is_available ? "opacity-60" : ""}`}
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
                                                        onChange={(e) => {
                                                            setData("boardgame_id", e.target.value);
                                                            setLocalErrors((prev) => {
                                                                const next = { ...prev };
                                                                delete next.boardgame_id;
                                                                return next;
                                                            });
                                                        }}
                                                        disabled={!bg.is_available}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate">
                                                            {bg.nama}
                                                        </p>
                                                        <p className="text-xs text-slate-500 truncate">
                                                            {bg.kode}
                                                        </p>
                                                        {bg.is_available ? (
                                                            <span className="inline-block rounded-full bg-sky-800 px-3 py-1 text-xs font-semibold text-white mt-1">
                                                                Tersedia
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block rounded-full bg-yellow-300 px-3 py-1 text-xs font-semibold text-yellow-900 mt-1">
                                                                Sedang dipinjam
                                                            </span>
                                                        )}
                                                    </div>
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
                        {(errors.boardgame_id || localErrors.boardgame_id) && (
                            <p className="text-error text-xs mt-1">{errors.boardgame_id || localErrors.boardgame_id}</p>
                        )}
                    </div>
                </div>
                </Reveal>

                <Reveal>
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-5">
                        <h2 className="card-title text-base !mb-0">
                            Waktu Peminjaman
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label !pt-0 !pb-1">
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
                                              ).toLocaleDateString("id-ID", {
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
                                <label className="label !pt-0 !pb-1">
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
                </Reveal>

                <Reveal>
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-5">
                        <h2 className="card-title text-base !mb-0">Catatan</h2>

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
                </Reveal>

                <div className="flex gap-3 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn bg-sky-900 hover:bg-sky-950 text-white border-none flex-1 transition-transform active:scale-95 hover:scale-[1.02]"
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
                        className="btn btn-ghost transition-transform active:scale-95 hover:scale-[1.02]"
                        onClick={() => {
                            reset();
                            setAnggota([{ nama: "", jenis_jaminan: "ktm", nim: "", nik: "" }]);
                        }}
                        disabled={processing}
                    >
                        Atur Ulang
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
}

Form.layout = (page) => page;