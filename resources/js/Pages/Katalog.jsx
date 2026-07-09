import { useMemo, useState, useRef, useEffect, createContext, useContext } from "react";
import { Head, Link } from "@inertiajs/react";

/* ================= Palet warna UPT Perpustakaan Undip ================= */
const WARNA = {
    hijauTua: "#173C33",   // top bar paling gelap
    hijauUtama: "#2F6F62", // hero & tombol utama
    hijauHover: "#255A4F",
    emas: "#B98A4A",       // aksen tombol pencarian
    emasHover: "#A5763A",
    krem: "#FAF7F2",
};

const KATEGORI_COLORS = {
    "Strategi": ["#2F6F62", "#E8F3EF"],
    "Strategi Ekonomi": ["#2F6F62", "#E8F3EF"],
    "Strategi Abstrak": ["#3D5A80", "#EAF0F7"],
    "Strategi & Keluarga": ["#2F6F62", "#E8F3EF"],
    "Puzzle": ["#8E5FB0", "#F1E9F7"],
    "Kooperatif": ["#C0562F", "#FBEAE1"],
    "Kooperatif & Escape Room": ["#C0562F", "#FBEAE1"],
    "Party": ["#E8A33D", "#FDF3E1"],
    "Party & Reaksi": ["#E8A33D", "#FDF3E1"],
    "Party & Dadu": ["#E8A33D", "#FDF3E1"],
    "Party & Kartu": ["#E8A33D", "#FDF3E1"],
    "Party & Fisik": ["#E8A33D", "#FDF3E1"],
    "Party & Kooperatif": ["#E8A33D", "#FDF3E1"],
    "Party & Kecepatan": ["#E8A33D", "#FDF3E1"],
    "Party & Deduksi": ["#E8A33D", "#FDF3E1"],
    "Deduksi": ["#A13D5C", "#F8E7ED"],
    "Deduksi & Party": ["#A13D5C", "#F8E7ED"],
    "Sosial Deduksi": ["#A13D5C", "#F8E7ED"],
    "Kartu": ["#3D5A80", "#EAF0F7"],
    "Kartu & Strategi": ["#3D5A80", "#EAF0F7"],
    "Keluarga": ["#3F8F63", "#E9F5EE"],
    "Anak & Keluarga": ["#3F8F63", "#E9F5EE"],
    "Anak-anak": ["#3F8F63", "#E9F5EE"],
    "Anak & Memori": ["#3F8F63", "#E9F5EE"],
    "Anak & Ketangkasan": ["#3F8F63", "#E9F5EE"],
    "Keluarga & Ketangkasan": ["#3F8F63", "#E9F5EE"],
    "Manajemen": ["#2F6F62", "#E8F3EF"],
    "Edukasi & Kartu": ["#3D5A80", "#EAF0F7"],
    "Strategi Ringan": ["#2F6F62", "#E8F3EF"],
};
const DEFAULT_COLOR = ["#5B5F66", "#EEEFF1"];

/* Kamus dan Konteks bahasa */
const TEKS = {
    ID: {
        cariPlaceholder: "Cari nama board game...",
        masuk: "Masuk",
        favorit: "Favorit",
        riwayat: "Riwayat",
        filter: "Filter:",
        kategori: "Kategori",
        lantai: "Lantai",
        status: "Status",
        semua: "Semua",
        tersedia: "Tersedia",
        dipinjam: "Dipinjam",
        umum: "Umum",
        boardGame: "board game",
        tersediaDipinjam: "Tersedia untuk Dipinjam",
        sedangDipinjam: "Sedang Dipinjam",
        lihatDetail: "Lihat Detail",
        tidakCocok: "Tidak ada board game yang cocok dengan filter ini.",
        rekomendasi: "Rekomendasi",
        produkPopuler: "Produk Paling Populer",
        informasi: "Informasi",
        tataCaraJudul: "Tata Cara Peminjaman",
        pemain: "Pemain",
        menit: "Menit",
        tataCaraPoin: [
            "Isi form peminjaman melalui sistem sebelum mengambil board game",
            "Serahkan kartu identitas (KTM/KTP/kartu pelajar) ke petugas sebagai jaminan",
            "Board game hanya boleh dimainkan di area perpustakaan, tidak boleh dibawa pulang",
            "Kembalikan pada hari yang sama sesuai jam rencana kembali yang diisi saat pengajuan",
            "Jaga kelengkapan komponen (kartu, dadu, pion, papan, dll) selama masa peminjaman",
            "Kartu identitas dikembalikan setelah board game diperiksa dan dinyatakan lengkap",
        ],
        sanksiJudul: "Sanksi Kerusakan / Kehilangan",
        sanksiPoin: [
            "Komponen hilang: wajib ganti sesuai jenis komponen",
            "Board game rusak: wajib ganti unit yang sama",
            "Board game hilang: ganti unit baru atau denda sesuai ketentuan",
        ],
    },
    EN: {
        cariPlaceholder: "Search board game name...",
        masuk: "Sign In",
        favorit: "Favorites",
        riwayat: "History",
        filter: "Filter:",
        kategori: "Category",
        lantai: "Floor",
        status: "Status",
        semua: "All",
        tersedia: "Available",
        dipinjam: "Borrowed",
        umum: "General",
        boardGame: "board games",
        tersediaDipinjam: "Available to Borrow",
        sedangDipinjam: "Currently Borrowed",
        lihatDetail: "View Details",
        tidakCocok: "No board games match this filter.",
        rekomendasi: "Recommended",
        produkPopuler: "Most Popular Titles",
        informasi: "Information",
        tataCaraJudul: "How to Borrow",
        pemain: "Players",
        menit: "Minutes",
        tataCaraPoin: [
            "Fill out the borrowing form through the system before picking up the board game",
            "Hand over an ID card (student card/ID/KTP) to staff as a deposit",
            "Board games may only be played inside the library, not taken home",
            "Return it the same day, by the planned return time entered when borrowing",
            "Keep all components (cards, dice, pawns, board, etc.) intact during use",
            "Your ID card is returned once the board game is checked and confirmed complete",
        ],
        sanksiJudul: "Damage / Loss Penalty",
        sanksiPoin: [
            "Missing component: must be replaced with the matching piece",
            "Damaged game: must be replaced with the same unit",
            "Lost game: replace with a new unit or pay a fine per policy",
        ],
    },
};

const BahasaContext = createContext(TEKS.ID);
function useTeks() {
    return useContext(BahasaContext);
}

function warnaKategori(kategori) {
    return KATEGORI_COLORS[kategori] ?? DEFAULT_COLOR;
}

/* ========================= Ikon-ikon kecil ========================= */

function IkonDadu({ pip = 2, color }) {
    const layout = {
        1: [[50, 50]],
        2: [[28, 28], [72, 72]],
        3: [[28, 28], [50, 50], [72, 72]],
        4: [[28, 28], [72, 28], [28, 72], [72, 72]],
        5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
        6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
    }[Math.min(Math.max(pip, 1), 6)];

    return (
        <svg viewBox="0 0 100 100" className="w-14 h-14">
            <rect x="6" y="6" width="88" height="88" rx="18" fill="white" opacity="0.9" />
            {layout.map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="7" fill={color} />
            ))}
        </svg>
    );
}

function IkonCari(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </svg>
    );
}

function IkonAkun(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" />
        </svg>
    );
}

function IkonHati(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M12 20s-7-4.35-9.5-8.8C.9 8.1 2.4 4.8 5.6 4.1c2-.45 3.9.5 5 2.1 1.1-1.6 3-2.55 5-2.1 3.2.7 4.7 4 3.1 7.1C19 15.65 12 20 12 20Z" />
        </svg>
    );
}

function IkonRiwayat(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v4h4" />
            <path d="M12 7v5l3.5 2" />
        </svg>
    );
}

function IkonPemain(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="9" cy="7" r="3" />
            <path d="M2 21v-1a6 6 0 0 1 12 0v1" />
            <circle cx="17" cy="8" r="2.5" />
            <path d="M22 21v-1a5 5 0 0 0-6-4.9" />
        </svg>
    );
}

function IkonJam(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
        </svg>
    );
}

function IkonRak(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
        </svg>
    );
}

/* Ikon media sosial — bentuk generik/monoline, bukan reproduksi logo resmi. */
function IkonYoutube(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <rect x="2.5" y="6" width="19" height="12" rx="4" />
            <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
        </svg>
    );
}
function IkonInstagram(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
        </svg>
    );
}
function IkonTiktok(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path d="M13 3v11.2a3 3 0 1 1-2.2-2.9" />
            <path d="M13 3c.4 2.2 2 3.8 4.2 4.1" />
        </svg>
    );
}

function pipDariJumlahPemain(text) {
    const match = (text || "").match(/\d+/);
    return match ? parseInt(match[0], 10) : 2;
}

function formatPemain(text, t) {
    if (!text) return "-";
    const angka = text.replace(/pemain/i, "").trim();
    return `${angka} ${t.pemain}`;
}

function formatDurasi(text, t) {
    if (!text) return "-";
    const angka = text.replace(/menit/i, "").trim();
    return `${angka} ${t.menit}`;
}

/* ========================= Navbar utama ========================= */

function BarUtilitas({ bahasa, setBahasa }) {
    return (
        <div className="text-white text-xs" style={{ backgroundColor: WARNA.hijauTua }}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-2 grid grid-cols-3 items-center gap-4">
                <div className="flex items-center gap-1.5 font-medium tracking-wide">
                    <button
                        type="button"
                        onClick={() => setBahasa("EN")}
                        className={bahasa === "EN" ? "text-white" : "text-white/50 hover:text-white/80"}
                    >
                        EN
                    </button>
                    <span className="text-white/40">|</span>
                    <button
                        type="button"
                        onClick={() => setBahasa("ID")}
                        className={bahasa === "ID" ? "text-white" : "text-white/50 hover:text-white/80"}
                    >
                        ID
                    </button>
                </div>

                <div className="flex items-center justify-center gap-6 text-white/80">
                    <a
                        href="https://youtube.com/@perpustakaanundip?si=RgDQgwp-UlPD7ryq"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                        <IkonYoutube className="w-5 h-5" />
                        <span>Youtube</span>
                    </a>
                    <a
                        href="https://www.instagram.com/perpus.undip?igsh=MTh4bXFtd3AzbmRmdQ=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                        <IkonInstagram className="w-5 h-5" />
                        <span>Instagram</span>
                    </a>
                    <a
                        href="https://www.tiktok.com/@perpus.undip.press?_r=1&_t=ZS-97okoKr4q4S"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                        <IkonTiktok className="w-5 h-5" />
                        <span>TikTok</span>
                    </a>
                </div>

                <div />
            </div>
        </div>
    );
}

function NavbarUtama({ pencarian, setPencarian }) {
    const t = useTeks();

    return (
        <div style={{ backgroundColor: WARNA.hijauUtama }}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-3 flex items-center gap-4">
                {/* Logo */}
                <a href="/katalog" className="flex items-center gap-2 shrink-0">
                    <img src="/images/logo-upt.png" alt="Logo UPT Perpustakaan Undip" className="h-10 w-10 rounded-full bg-white p-1 object-contain" />
                    <span className="hidden md:block leading-tight text-white">
                        <span className="block text-[11px] text-emerald-100/90 tracking-wide">UPT Perpustakaan</span>
                        <span className="block text-sm font-semibold">Universitas Diponegoro</span>
                    </span>
                </a>

                {/* Pencarian, sekarang ngisi seluruh sisa ruang navbar */}
                <div className="flex-1 flex rounded-md overflow-hidden ring-1 ring-black/10">
                    <input
                        type="text"
                        value={pencarian}
                        onChange={(e) => setPencarian(e.target.value)}
                        placeholder={t.cariPlaceholder}
                        className="flex-1 min-w-0 px-4 py-2 text-sm text-slate-800 bg-white focus:outline-none"
                    />
                    <button
                        type="button"
                        aria-label="Cari"
                        className="px-4 flex items-center justify-center text-white transition-colors"
                        style={{ backgroundColor: WARNA.emas }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = WARNA.emasHover)}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = WARNA.emas)}
                    >
                        <IkonCari className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ========================= Kartu board game ========================= */

function KartuGame({ game, tersedia }) {
    const t = useTeks();
    const [warna, bg] = warnaKategori(game.kategori);

    return (
        <div
            className={`group h-full flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${
                tersedia
                    ? "bg-white border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                    : "bg-slate-50 border-slate-100 opacity-75"
            }`}
        >
            <div className="relative">
                <span
                    className={`absolute top-3 right-3 z-10 text-[11px] font-semibold px-3 py-1 rounded-full ${
                        tersedia ? "bg-emerald-600 text-white" : "bg-slate-500 text-white"
                    }`}
                >
                    {tersedia ? t.tersedia : t.dipinjam}
                </span>

                <div
                className={`relative aspect-square flex items-center justify-center ${!tersedia ? "grayscale" : ""}`}
                style={{ backgroundColor: bg }}
            >
                {game.link_foto?.[0] ? (
                    <>
                        <img
                            src={game.link_foto[0]}
                            alt={game.nama}
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                                game.link_foto?.[1] ? "group-hover:opacity-0" : ""
                            }`}
                        />
                        {game.link_foto?.[1] && (
                            <img
                                src={game.link_foto[1]}
                                alt={`${game.nama} - tampilan lain`}
                                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            />
                        )}
                    </>
                ) : (
                    <IkonDadu pip={pipDariJumlahPemain(game.jumlah_pemain)} color={warna} />
                )}
            </div>
            </div>

            {/* supaya semua kartu dalam satu baris tingginya sama */}
            <div className="p-4 flex flex-col flex-1">
                <span
                    className="inline-block self-start text-[11px] font-medium px-2.5 py-1 rounded-full mb-2"
                    style={{ backgroundColor: bg, color: warna }}
                >
                    {game.kategori ?? t.umum}
                </span>

                <div className="h-16 mb-2">
                    <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                        {game.nama}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{game.penerbit ?? "\u00A0"}</p>
                </div>

                <div className="mt-2">
                    <div className="text-[11px] text-slate-500 mb-3 space-y-0.5">
                        <div className="flex items-center gap-x-1.5">
                            <span className="flex items-center gap-1 whitespace-nowrap">
                                <IkonPemain className="w-3.5 h-3.5 shrink-0" />
                                {formatPemain(game.jumlah_pemain, t)}
                            </span>
                            <span className="flex items-center gap-1 whitespace-nowrap">
                                <IkonJam className="w-3.5 h-3.5 shrink-0" />
                                {formatDurasi(game.durasi, t)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                            <IkonRak className="w-3.5 h-3.5 shrink-0" />
                            {t.lantai} {game.lantai}
                        </div>
                    </div>

                    {tersedia ? (
                        <Link
                            href={`/katalog/${game.id}`}
                            className="block w-full rounded-full py-2 text-sm font-semibold text-white text-center transition-colors"
                            style={{ backgroundColor: WARNA.hijauUtama }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = WARNA.hijauHover)}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = WARNA.hijauUtama)}
                        >
                            {t.lihatDetail}
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="w-full rounded-full py-2 text-sm font-semibold bg-slate-200 text-slate-400 cursor-not-allowed"
                        >
                            {t.dipinjam}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ========================= Carousel pengumuman ========================= */

function IkonCentangBesar(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12.5 2.5 2.5L16 9.5" />
        </svg>
    );
}

function IkonPeringatanBesar(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
            <path d="M12 3 2 20h20L12 3Z" />
            <path d="M12 10v4" />
            <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
        </svg>
    );
}

function IkonChevron({ arah = "kiri", ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
            <path d={arah === "kiri" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
        </svg>
    );
}

function BlobPanel({ variant = "populer" }) {
    const skema = {
        populer: {
            warna: { a: WARNA.hijauUtama, b: WARNA.emas },
            path1: "M60 60 Q180 -20 300 60 Q420 130 380 250 Q340 370 220 400 Q80 430 30 300 Q-20 170 60 60 Z",
            path2: "M320 180 Q420 140 470 240 Q510 340 420 400 Q340 450 280 380 Q220 320 260 250 Q290 200 320 180 Z",
            lingkaran: [{ cx: 90, cy: 380, r: 55 }, { cx: 430, cy: 90, r: 40 }],
        },
        info: {
            warna: { a: WARNA.emas, b: WARNA.hijauUtama },
            path1: "M40 250 Q20 120 150 90 Q280 60 320 180 Q360 300 240 360 Q120 420 40 250 Z",
            path2: "M300 40 Q420 20 460 120 Q500 220 420 280 Q340 340 280 260 Q220 180 260 100 Q280 60 300 40 Z",
            lingkaran: [{ cx: 440, cy: 400, r: 50 }, { cx: 60, cy: 60, r: 35 }],
        },
        sanksi: {
            warna: { a: "#B04A3D", b: WARNA.emas },
            path1: "M250 20 Q380 40 400 160 Q420 280 300 340 Q180 400 100 300 Q20 200 100 100 Q160 30 250 20 Z",
            path2: "M60 300 Q0 380 80 440 Q160 480 200 400 Q240 320 160 280 Q100 250 60 300 Z",
            lingkaran: [{ cx: 460, cy: 80, r: 45 }, { cx: 450, cy: 380, r: 30 }],
        },
    }[variant];

    return (
        <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <rect width="500" height="500" fill={WARNA.krem} />
            <path d={skema.path1} fill={skema.warna.a} opacity="0.22" />
            <path d={skema.path2} fill={skema.warna.b} opacity="0.18" />
            {skema.lingkaran.map((l, i) => (
                <circle key={i} cx={l.cx} cy={l.cy} r={l.r} fill={i === 0 ? skema.warna.b : skema.warna.a} opacity="0.14" />
            ))}
        </svg>
    );
}

function SlidePopuler({ games, nomor }) {
    const t = useTeks();
    return (
        <div className="relative h-full w-full flex overflow-hidden">
            <BlobPanel variant="populer" />
            <div className="relative flex flex-col h-full w-full px-6 md:px-12 py-6">
                <h3 className="shrink-0 text-2xl md:text-[32px] font-bold mb-4 md:mb-6 leading-tight text-center" style={{ color: WARNA.hijauTua }}>
                    {t.produkPopuler}
                </h3>
                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                    {games.slice(0, 5).map((game) => {
                        const [warna, bg] = warnaKategori(game.kategori);
                        return (
                            <div
                                key={game.id}
                                className="shrink-0 w-[calc(50%-8px)] md:w-[calc(20%-19.2px)] rounded-md bg-white overflow-hidden shadow-md transition-transform hover:-translate-y-1"
                            >
                                <div className="aspect-square flex items-center justify-center bg-white p-3">
                                    {game.link_foto?.[0] ? (
                                        <img src={game.link_foto[0]} alt={game.nama} className="h-full w-full object-contain" />
                                    ) : (
                                        <IkonDadu pip={pipDariJumlahPemain(game.jumlah_pemain)} color={warna} />
                                    )}
                                </div>
                                <p className="text-[11px] font-semibold text-slate-800 px-2 py-2 line-clamp-2 text-center">
                                    {game.nama}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function SlideInfo({ slide, nomor }) {
    const t = useTeks();

    return (
        <div className="relative h-full w-full flex overflow-hidden">
            <BlobPanel variant={slide.ikon === "peringatan" ? "sanksi" : "info"} />

            <div className="relative flex flex-col h-full w-full max-w-4xl mx-auto px-6 md:px-12 py-6">
                <h3
                    className="shrink-0 text-2xl md:text-[32px] font-bold mb-4 md:mb-6 leading-tight text-center"
                    style={{ color: WARNA.hijauTua }}
                >
                    {slide.judul}
                </h3>

                <ul
                    className="flex-1 min-h-0 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 content-start pr-1"
                    style={{ WebkitOverflowScrolling: "touch" }}
                >
                    {slide.poin.map((p, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm"
                        >
                            <span
                                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                                style={{ backgroundColor: slide.aksen }}
                            >
                                {i + 1}
        </span>
                            <span className="text-sm md:text-[15px] text-slate-700 leading-snug pt-0.5">{p}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function AnnouncementCarousel({ games }) {
    const t = useTeks();

    const infoSlides = useMemo(() => ([
        { judul: t.tataCaraJudul, aksen: WARNA.emas, ikon: "centang", poin: t.tataCaraPoin },
        { judul: t.sanksiJudul, aksen: "#B04A3D", ikon: "peringatan", poin: t.sanksiPoin },
    ]), [t]);

    const slides = useMemo(() => {
        const arr = games.length > 0 ? [{ tipe: "populer" }] : [];
        return [...arr, ...infoSlides.map((s) => ({ tipe: "info", ...s }))];
    }, [games, infoSlides]);

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setTimeout(() => {
            setIndex((i) => (i + 1) % slides.length);
        }, 6000);
        return () => clearTimeout(timer);
    }, [index, slides.length]);

    if (slides.length === 0) return null;

    const geser = (arah) => setIndex((i) => (i + arah + slides.length) % slides.length);

    return (
        <div
            className="max-w-[1300px] mx-auto px-4 md:px-6 relative z-10"
            style={{ marginTop: -87, marginBottom: 25 }}
        >
            <div
                className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5"
                style={{ height: 300 }}
            >
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
                    >
                        {slide.tipe === "populer" ? (
                            <SlidePopuler games={games} nomor={String(i + 1).padStart(2, "0")} />
                        ) : (
                            <SlideInfo slide={slide} nomor={String(i + 1).padStart(2, "0")} />
                        )}
                    </div>
                ))}

                {slides.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => geser(-1)}
                            aria-label="Sebelumnya"
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg text-slate-700 flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            <IkonChevron arah="kiri" className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => geser(1)}
                            aria-label="Selanjutnya"
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg text-slate-700 flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            <IkonChevron arah="kanan" className="w-5 h-5" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setIndex(i)}
                                    aria-label={`Slide ${i + 1}`}
                                    className="h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: i === index ? 24 : 6,
                                        backgroundColor: i === index ? "white" : "rgba(255,255,255,0.5)",
                                        boxShadow: i === index ? "0 0 0 1px rgba(0,0,0,0.15)" : "none",
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* ========================= Halaman Katalog ========================= */

function IsiKatalog({ games, bahasa, setBahasa }) {
    const t = useTeks();
    const [pencarian, setPencarian] = useState("");
    const [kategoriAktif, setKategoriAktif] = useState("Semua");
    const [lantaiAktif, setLantaiAktif] = useState("Semua");
    const [statusAktif, setStatusAktif] = useState("Semua");

    const kategoriList = useMemo(() => {
        const set = new Set(games.map((g) => g.kategori).filter(Boolean));
        return ["Semua", ...Array.from(set).sort()];
    }, [games]);

    const filtered = useMemo(() => {
        return games.filter((g) => {
            const cocokNama = g.nama.toLowerCase().includes(pencarian.toLowerCase());
            const cocokKategori = kategoriAktif === "Semua" || g.kategori === kategoriAktif;
            const cocokLantai = lantaiAktif === "Semua" || String(g.lantai) === lantaiAktif;
            const cocokStatus =
                statusAktif === "Semua" ||
                (statusAktif === "Tersedia" ? g.available_copies > 0 : g.available_copies <= 0);
            return cocokNama && cocokKategori && cocokLantai && cocokStatus;
        });
    }, [games, pencarian, kategoriAktif, lantaiAktif, statusAktif]);

    const tersedia = filtered.filter((g) => g.available_copies > 0);
    const dipinjam = filtered.filter((g) => g.available_copies <= 0);

    const kelasSelect =
        "rounded-md border border-slate-200 text-xs sm:text-sm px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2F6F62]/30";

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[15px]">
            <BarUtilitas bahasa={bahasa} setBahasa={setBahasa} />
            <NavbarUtama
                pencarian={pencarian}
                setPencarian={setPencarian}
            />

            {/* Hero */}
            <div style={{ backgroundColor: WARNA.hijauUtama, height: 100 }} />

            <AnnouncementCarousel games={games.filter((g) => g.populer)} />

            {/* Filter & sort, ala baris filter Amazon */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="text-xs font-semibold text-slate-500 shrink-0">{t.filter}</span>

                    <div className="flex items-center gap-1">
                        <label className="text-xs text-slate-500 hidden sm:inline">{t.kategori}</label>
                        <select value={kategoriAktif} onChange={(e) => setKategoriAktif(e.target.value)} className={kelasSelect}>
                            {kategoriList.map((k) => (
                                <option key={k} value={k}>{k === "Semua" ? t.semua : k}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-1">
                        <label className="text-xs text-slate-500 hidden sm:inline">{t.lantai}</label>
                        <select value={lantaiAktif} onChange={(e) => setLantaiAktif(e.target.value)} className={kelasSelect}>
                            <option value="Semua">{t.semua}</option>
                            <option value="1">{t.lantai} 1</option>
                            <option value="2">{t.lantai} 2</option>
                            <option value="3">{t.lantai} 3</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1">
                        <label className="text-xs text-slate-500 hidden sm:inline">{t.status}</label>
                        <select value={statusAktif} onChange={(e) => setStatusAktif(e.target.value)} className={kelasSelect}>
                            <option value="Semua">{t.semua}</option>
                            <option value="Tersedia">{t.tersedia}</option>
                            <option value="Dipinjam">{t.dipinjam}</option>
                        </select>
                    </div>

                    <div className="flex-1" />

                    <span className="text-xs text-slate-500 shrink-0">{filtered.length} {t.boardGame}</span>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                    {t.tersediaDipinjam} ({tersedia.length})
                </h2>
                {tersedia.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr gap-5 mb-12">
                        {tersedia.map((game) => (
                            <KartuGame key={game.id} game={game} tersedia />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 mb-12">
                        {t.tidakCocok}
                    </p>
                )}

                {dipinjam.length > 0 && (
                    <>
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-lg font-semibold text-slate-500">
                                {t.sedangDipinjam} ({dipinjam.length})
                            </h2>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr gap-5">
                            {dipinjam.map((game) => (
                                <KartuGame key={game.id} game={game} tersedia={false} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function Katalog({ games }) {
    const [bahasa, setBahasa] = useState("ID");

    return (
        <BahasaContext.Provider value={TEKS[bahasa]}>
            <Head title="Katalog Board Game" />
            <IsiKatalog games={games} bahasa={bahasa} setBahasa={setBahasa} />
        </BahasaContext.Provider>
    );
}

Katalog.layout = (page) => page;