import { createPortal } from "react-dom";
import { useMemo, useState, useRef, useEffect, useCallback, createContext, useContext } from "react";
import { Head, Link, router } from "@inertiajs/react";
import LanguageToggle from "../Components/LanguageToggle";
import Footer from "../Components/Footer";
import RatingSummary from "../Components/RatingSummary";
import { asset } from "../lib/asset";

/* Palet warna UPT Perpustakaan Undip */
const WARNA = {
    hijauTua: "#173C33",   // top bar paling gelap
    hijauUtama: "#2F6F62", // hero & tombol utama
    hijauHover: "#255A4F",
    emas: "#B98A4A",       // aksen tombol pencarian
    emasHover: "#A5763A",
    krem: "#FAF7F2",
};

const KATEGORI_COLORS = {
    "Strategy": ["#2F6F62", "#E8F3EF"],
    "Party": ["#E8A33D", "#FDF3E1"],
    "Family": ["#3F8F63", "#E9F5EE"],
    "Cooperative": ["#C0562F", "#FBEAE1"],
    "Card Game": ["#3D5A80", "#EAF0F7"],
    "Abstract": ["#8E5FB0", "#F1E9F7"],
    "Puzzle": ["#A13D5C", "#F8E7ED"],
    "Simulation / Economic": ["#5B5F66", "#EEEFF1"],
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
        pinjam: "Pinjam",
        lihatDetail: "Lihat Detail",
        tidakCocok: "Tidak ada board game yang cocok dengan filter ini.",
        rekomendasi: "Rekomendasi",
        produkPopuler: "Produk Paling Populer",
        informasi: "Informasi",
        tataCaraJudul: "Tata Cara Peminjaman",
        pemain: "Pemain",
        menit: "Menit",
        tataCaraPoin: [
            "Peminjam melakukan peminjaman langsung di meja layanan kepada petugas yang bertugas",
            "Peminjam memilih board game yang ingin dipinjam, lalu melengkapi form peminjaman sebelum mengambil barangnya",
            "Peminjam menyerahkan satu kartu identitas (KTM/KTP/Kartu Anggota Perpustakaan) kepada petugas sebagai jaminan",
            "Peminjam bersama petugas memeriksa kelengkapan komponen (kartu, dadu, pion, papan, dan lain-lain) sesuai lembar daftar isi pada kotak, sebelum board game dibawa ke meja permainan",
            "Peminjam hanya boleh memainkan board game di lantai tempat board game tersebut dipinjam, tidak membawanya ke lantai lain maupun membawanya pulang",
            "Peminjam menjaga kelengkapan komponen permainan selama masa peminjaman berlangsung, dan tidak memindahtangankan board game ke kelompok lain secara sepihak.",
            "Peminjam meminjam dan mengembalikan board game pada hari yang sama, paling lambat sebelum jam operasional perpustakaan berakhir",
            "Peminjam menerima kembali kartu identitasnya setelah board game diperiksa petugas dan dinyatakan lengkap",
        ],
        sanksiJudul: "Sanksi Kerusakan / Kehilangan",
        sanksiPoin: [
            "Komponen hilang: wajib ganti sesuai jenis komponen",
            "Board game rusak: wajib ganti unit yang sama",
            "Board game hilang: ganti unit baru atau denda sesuai ketentuan",
        ],
        carousel: [
            {
                title: "Selamat Datang di UPT Perpustakaan Universitas Diponegoro",
                description: "Temukan, pilih, dan pinjam board game favoritmu melalui katalog digital UPT Perpustakaan Universitas Diponegoro.",
                detailTitle: "Selamat Datang di Board Game UPT Perpustakaan Undip",
                detailDescription: "Katalog board game ini membantu pemustaka mencari informasi permainan, melihat detail board game, dan mengajukan peminjaman secara online.",
                points: [
                    "Cari board game berdasarkan nama, kategori, lantai, dan status.",
                    "Lihat detail board game sebelum mengajukan peminjaman.",
                    "Ajukan peminjaman melalui tombol Pinjam.",
                    "Gunakan board game hanya di area perpustakaan.",
                ],
                theme: "welcome",
            },
            {
                title: "Tata Cara Peminjaman",
                description: "Ikuti prosedur peminjaman sebelum mengambil board game.",
                detailTitle: "Tata Cara Peminjaman Board Game",
                detailDescription: "Pemustaka wajib mengikuti prosedur peminjaman board game di UPT Perpustakaan Universitas Diponegoro.",
                points: [
                    "Peminjam melakukan peminjaman langsung di meja layanan kepada petugas yang bertugas",
                    "Peminjam memilih board game yang ingin dipinjam, lalu melengkapi form peminjaman sebelum mengambil barangnya",
                    "Peminjam menyerahkan satu kartu identitas (KTM/KTP/Kartu Anggota Perpustakaan) kepada petugas sebagai jaminan",
                    "Peminjam bersama petugas memeriksa kelengkapan komponen (kartu, dadu, pion, papan, dan lain-lain) sesuai lembar daftar isi pada kotak, sebelum board game dibawa ke meja permainan",
                    "Peminjam hanya boleh memainkan board game di lantai tempat board game tersebut dipinjam, tidak membawanya ke lantai lain maupun membawanya pulang",
                    "Peminjam menjaga kelengkapan komponen permainan selama masa peminjaman berlangsung, dan tidak memindahtangankan board game ke kelompok lain secara sepihak.",
                    "Peminjam meminjam dan mengembalikan board game pada hari yang sama, paling lambat sebelum jam operasional perpustakaan berakhir",
                    "Peminjam menerima kembali kartu identitasnya setelah board game diperiksa petugas dan dinyatakan lengkap",
                ],
                theme: "procedure",
            },
            {
                title: "Ketentuan Penggunaan",
                description: "Jaga kelengkapan dan kondisi board game selama masa peminjaman.",
                detailTitle: "Ketentuan Penggunaan Board Game",
                detailDescription: "Peminjam bertanggung jawab menjaga kondisi dan kelengkapan board game selama digunakan.",
                points: [
                    "Peminjam bertanggung jawab penuh atas keutuhan fisik board game yang digunakannya selama masa peminjaman",
                    "Jika ada komponen yang hilang atau rusak, peminjam wajib menggantinya dengan board game yang judul dan penerbitnya sama persis",
                    "Kerusakan yang dimaksud mencakup antara lain kartu yang sobek, kotak yang penyok cukup parah, atau komponen permainan yang hilang sebagian, bukan hanya kehilangan seluruh set",
                    "Apabila board game tersebut sudah tidak beredar lagi di pasaran, peminjam dapat menggantinya dengan board game lain yang setara, baik dari segi jenis permainan maupun harga, bukan dalam bentuk uang tunai.",
                    "Peminjam diberi waktu paling lama empat belas hari kerja sejak kehilangan atau kerusakan dilaporkan untuk menyelesaikan penggantian",
                    "Selama proses penggantian belum diselesaikan, kartu identitas peminjam ditahan oleh petugas layanan",
                    "Selama kasus penggantian ini belum terselesaikan, peminjam belum diperkenankan meminjam board game lain",
                ],
                theme: "rules",
            },
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
        pinjam: "Borrow",
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
        carousel: [
            {
                title: "Welcome to UPT Library of Diponegoro University",
                description: "Discover, choose, and borrow your favorite board games through the digital catalog of UPT Library of Diponegoro University.",
                detailTitle: "Welcome to Board Game UPT Library Undip",
                detailDescription: "This board game catalog helps students find game information, view board game details, and submit borrowing requests online.",
                points: [
                    "Search board games by name, category, floor, and status.",
                    "View board game details before submitting a borrowing request.",
                    "Submit a borrowing request through the Borrow button.",
                    "Play board games only in the library area.",
                ],
                theme: "welcome",
            },
            {
                title: "How to Borrow",
                description: "Follow the borrowing procedure before taking a board game.",
                detailTitle: "How to Borrow Board Games",
                detailDescription: "Students must follow the board game borrowing procedure at UPT Library of Diponegoro University.",
                points: [
                    "Fill out the borrowing form through the system before picking up the board game.",
                    "Hand over your ID card as a deposit.",
                    "Board games may only be played in the library area.",
                    "Return on the same day according to the planned return time.",
                ],
                theme: "procedure",
            },
            {
                title: "Usage Rules",
                description: "Keep the board game components and condition during the borrowing period.",
                detailTitle: "Board Game Usage Rules",
                detailDescription: "Borrowers are responsible for maintaining the condition and completeness of the board game during use.",
                points: [
                    "Keep components such as cards, dice, pawns, boards, and rulebooks.",
                    "Report to staff if any components are damaged or missing.",
                    "ID cards are returned after the board game is checked.",
                    "Use board games properly in the library area.",
                ],
                theme: "rules",
            },
        ],
    },
};

const BahasaContext = createContext(TEKS.ID);
function useTeks() {
    return useContext(BahasaContext);
}

function warnaKategori(kategori) {
    if (Array.isArray(kategori)) {
        for (const k of kategori) {
            if (KATEGORI_COLORS[k]) return KATEGORI_COLORS[k];
        }
        return DEFAULT_COLOR;
    }
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

function TopNavbar({ pencarian, setPencarian, bahasa, setBahasa }) {
    const t = useTeks();

    return (
        <div style={{ backgroundColor: WARNA.hijauTua }}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                {/* Desktop (md+) */}
                <div className="hidden md:flex items-center justify-between py-3">
                    {/* Kiri: Logo + Nama Institusi */}
                    <Link href={route("katalog")} className="flex items-center gap-3 shrink-0">
                        <img
                            src={asset("/assets/logo_undip.png")}
                            alt="Universitas Diponegoro"
                            className="h-14 w-14 object-contain"
                        />
                        <img
                            src={asset("/images/logo-upt.png")}
                            alt="UPT Perpustakaan Undip"
                            className="h-14 w-14 object-contain"
                        />
                        <div className="leading-tight text-white">
                            <span className="block text-[11px] text-emerald-100/90 tracking-wide">Universitas Diponegoro</span>
                            <span className="block text-sm font-semibold">UPT Perpustakaan</span>
                        </div>
                    </Link>

                    {/* Kanan: Bahasa + Sosial Media */}
                    <div className="flex items-center gap-5 shrink-0">
                        <LanguageToggle bahasa={bahasa} setBahasa={setBahasa} />
                        <div className="flex items-center gap-3 text-white/80">
                            <a
                                href="https://youtube.com/@perpustakaanundip?si=RgDQgwp-UlPD7ryq"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-white transition-colors"
                            >
                                <IkonYoutube className="w-5 h-5" />
                                <span className="text-xs hidden xl:inline">Youtube</span>
                            </a>
                            <a
                                href="https://www.instagram.com/perpus.undip?igsh=MTh4bXFtd3AzbmRmdQ=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-white transition-colors"
                            >
                                <IkonInstagram className="w-5 h-5" />
                                <span className="text-xs hidden xl:inline">Instagram</span>
                            </a>
                            <a
                                href="https://www.tiktok.com/@perpus.undip.press?_r=1&_t=ZS-97okoKr4q4S"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-white transition-colors"
                            >
                                <IkonTiktok className="w-5 h-5" />
                                <span className="text-xs hidden xl:inline">TikTok</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Mobile (< md) */}
                <div className="md:hidden">
                    <div className="flex items-center justify-between py-3">
                        <Link href={route("katalog")} className="flex items-center gap-2">
                            <img
                                src={asset("/assets/logo_undip.png")}
                                alt="Universitas Diponegoro"
                                className="h-16 w-16 object-contain"
                            />
                            <img
                                src={asset("/images/logo-upt.png")}
                                alt="UPT Perpustakaan Undip"
                                className="h-10 w-10 object-contain"
                            />
                            <div className="leading-tight text-white">
                                <span className="block text-[10px] text-emerald-100/90 tracking-wide">Universitas Diponegoro</span>
                                <span className="block text-xs font-semibold">UPT Perpustakaan</span>
                            </div>
                        </Link>
                        <LanguageToggle bahasa={bahasa} setBahasa={setBahasa} />
                    </div>
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
            role="button"
            tabIndex={0}
            onClick={() => router.visit(route("katalog.show", game.id))}
            onKeyDown={(e) => { if (e.key === 'Enter') router.visit(route("katalog.show", game.id)) }}
            className={`group h-full flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
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
                <div className="flex flex-wrap gap-1 mb-2">
                    {(Array.isArray(game.kategori) && game.kategori.length > 0
                        ? game.kategori
                        : [game.kategori ?? t.umum]
                    ).map((k, i) => {
                        const [kw, kb] = warnaKategori(k);
                        return (
                            <span
                                key={i}
                                className="inline-block self-start text-[11px] font-medium px-2.5 py-1 rounded-full"
                                style={{ backgroundColor: kb, color: kw }}
                            >
                                {k}
                            </span>
                        );
                    })}
                </div>

                <div className="mb-2">
                    <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                        {game.nama}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{game.penerbit ?? "\u00A0"}</p>
                    <div className="mt-1">
                        <RatingSummary
                            averageRating={game.reviews_avg_rating}
                            reviewsCount={game.reviews_count}
                        />
                    </div>
                </div>

                <div className="mt-auto">
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
                        <div onClick={(e) => e.stopPropagation()}>
                            <Link
                                href={route("katalog.show", game.id)}
                                className="block w-full rounded-full py-2 text-sm font-semibold text-white text-center transition-colors"
                                style={{ backgroundColor: WARNA.hijauUtama }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = WARNA.hijauHover)}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = WARNA.hijauUtama)}
                            >
                                {t.lihatDetail}
                            </Link>
                        </div>
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

/* ========================= Carousel ========================= */

function IkonChevron({ arah = "kiri", ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
            <path d={arah === "kiri" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
        </svg>
    );
}

const THEMES = {
    welcome: {
        bg: WARNA.krem,
        blob: [
            { path: "M60 60 Q180 -20 300 60 Q420 130 380 250 Q340 370 220 400 Q80 430 30 300 Q-20 170 60 60 Z", fill: WARNA.hijauUtama, opacity: "0.20" },
            { path: "M320 180 Q420 140 470 240 Q510 340 420 400 Q340 450 280 380 Q220 320 260 250 Q290 200 320 180 Z", fill: WARNA.emas, opacity: "0.16" },
            { cx: 90, cy: 380, r: 55, fill: WARNA.emas, opacity: "0.12" },
            { cx: 430, cy: 90, r: 40, fill: WARNA.hijauUtama, opacity: "0.12" },
        ],
    },
    procedure: {
        bg: WARNA.krem,
        blob: [
            { path: "M40 250 Q20 120 150 90 Q280 60 320 180 Q360 300 240 360 Q120 420 40 250 Z", fill: WARNA.emas, opacity: "0.20" },
            { path: "M300 40 Q420 20 460 120 Q500 220 420 280 Q340 340 280 260 Q220 180 260 100 Q280 60 300 40 Z", fill: WARNA.hijauUtama, opacity: "0.16" },
            { cx: 440, cy: 400, r: 50, fill: WARNA.hijauUtama, opacity: "0.12" },
            { cx: 60, cy: 60, r: 35, fill: WARNA.emas, opacity: "0.12" },
        ],
    },
    rules: {
        bg: WARNA.krem,
        blob: [
            { path: "M250 20 Q380 40 400 160 Q420 280 300 340 Q180 400 100 300 Q20 200 100 100 Q160 30 250 20 Z", fill: WARNA.hijauTua, opacity: "0.16" },
            { path: "M60 300 Q0 380 80 440 Q160 480 200 400 Q240 320 160 280 Q100 250 60 300 Z", fill: WARNA.emas, opacity: "0.14" },
            { cx: 460, cy: 80, r: 45, fill: WARNA.emas, opacity: "0.10" },
            { cx: 450, cy: 380, r: 30, fill: WARNA.hijauTua, opacity: "0.10" },
        ],
    },
};

function CarouselModal({ item, onClose }) {
    useEffect(() => {
        if (!item) return;
        const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [item, onClose]);

    if (!item) return null;

    const theme = THEMES[item.theme] || THEMES.welcome;

    return createPortal(
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative h-full overflow-y-auto p-4 py-8">
                <div className="flex min-h-full items-center justify-center">
                    <div
                        className="relative w-[92vw] max-w-7xl max-h-[88vh] rounded-[2rem] shadow-2xl overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative p-8 md:p-10 lg:p-12" style={{ backgroundColor: theme.bg }}>
                            <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full pointer-events-none">
                                <rect width="500" height="500" fill={theme.bg} />
                                {theme.blob.map((b, i) =>
                                    b.path ? (
                                        <path key={i} d={b.path} fill={b.fill} opacity={b.opacity} />
                                    ) : (
                                        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.fill} opacity={b.opacity} />
                                    )
                                )}
                            </svg>

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-500 hover:text-slate-700 shadow-sm transition-colors"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </button>

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: WARNA.hijauTua }}>
                                    {item.detailTitle}
                                </h2>
                                <p className="text-base md:text-lg text-slate-600 leading-8 mb-6 max-w-4xl">
                                    {item.detailDescription}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {item.points.map((point, i) => (
                                        <div key={i} className="flex items-start gap-4 p-5 md:p-6 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm">
                                            <span className="shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: WARNA.hijauUtama }}>
                                                {i + 1}
                                            </span>
                                            <p className="text-sm md:text-base text-slate-700 leading-relaxed">{point}</p>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="mt-8 w-full rounded-full py-3 text-base font-semibold text-white transition-colors"
                                    style={{ backgroundColor: WARNA.hijauUtama }}
                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = WARNA.hijauHover)}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = WARNA.hijauUtama)}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

function AnnouncementCarousel({ onModalChange }) {
    const t = useTeks();
    const items = t.carousel;
    const [index, setIndex] = useState(0);
    const [modalItem, setModalItem] = useState(null);
    const [paused, setPaused] = useState(false);
    const wrapperRef = useRef(null);
    const contentRef = useRef(null);
    const lastChangeRef = useRef(Date.now());
    const intervalRef = useRef(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        onModalChange?.(!!modalItem);
    }, [modalItem, onModalChange]);

    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }, [index]);

    const clearAutoplay = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startAutoplay = useCallback(() => {
        clearAutoplay();
        if (items.length <= 1) return;
        lastChangeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
            if (mountedRef.current) {
                setIndex((i) => (i + 1) % items.length);
            }
        }, 8000);
    }, [items.length, clearAutoplay]);

    const advanceImmediately = useCallback(() => {
        setIndex((i) => (i + 1) % items.length);
        lastChangeRef.current = Date.now();
    }, []);

    useEffect(() => {
        if (paused || modalItem || items.length <= 1) {
            clearAutoplay();
        } else {
            const elapsed = Date.now() - lastChangeRef.current;
            if (elapsed >= 8000) {
                advanceImmediately();
            }
            startAutoplay();
        }
        return clearAutoplay;
    }, [paused, modalItem, items.length, clearAutoplay, startAutoplay, advanceImmediately]);

    useEffect(() => {
        if (items.length <= 1) return;

        const handleVisibility = () => setPaused(document.hidden);
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [items.length]);

    useEffect(() => {
        if (items.length <= 1) return;
        const handleFocus = () => setPaused(false);
        const handleBlur = () => setPaused(true);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, [items.length]);

    useEffect(() => {
        if (items.length <= 1) return;
        const el = wrapperRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setPaused(!entry.isIntersecting || entry.intersectionRatio < 0.25),
            { threshold: [0, 0.25] }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [items.length]);

    const geser = useCallback((arah) => {
        setIndex((i) => (i + arah + items.length) % items.length);
        lastChangeRef.current = Date.now();
        startAutoplay();
    }, [items.length, startAutoplay]);

    const goToSlide = useCallback((slideIndex) => {
        setIndex(slideIndex);
        lastChangeRef.current = Date.now();
        startAutoplay();
    }, [startAutoplay]);

    const item = items[index];
    const theme = THEMES[item.theme] || THEMES.welcome;

    return (
        <>
            <div
                ref={wrapperRef}
                className="w-full relative z-10"
                style={{ height: 'calc(100dvh - 92px)', minHeight: 'calc(100dvh - 92px)' }}
            >
                <div
                    className="relative w-full h-full overflow-hidden shadow-sm ring-1 ring-black/5 cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => { clearAutoplay(); setModalItem(item); }}
                >
                    <div className="absolute inset-0" style={{ backgroundColor: theme.bg }}>
                        <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
                            <rect width="500" height="500" fill={theme.bg} />
                            {theme.blob.map((b, i) =>
                                b.path ? (
                                    <path key={i} d={b.path} fill={b.fill} opacity={b.opacity} />
                                ) : (
                                    <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.fill} opacity={b.opacity} />
                                )
                            )}
                        </svg>
                    </div>

                    <div ref={contentRef} className="relative flex flex-col h-full px-8 md:px-14 lg:px-20 py-10 md:py-14 pb-16 text-center overflow-y-auto">
                        {item.theme === "welcome" ? (
                            <div className="flex flex-col items-center justify-center flex-1">
                                <h3
                                    className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-4xl"
                                    style={{ color: WARNA.hijauTua }}
                                >
                                    {item.title}
                                </h3>
                                <p className="text-base md:text-lg lg:text-xl text-slate-600 max-w-3xl leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col items-center justify-center shrink-0">
                                    <h3
                                        className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 max-w-4xl"
                                        style={{ color: WARNA.hijauTua }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p className="text-base md:text-lg lg:text-xl text-slate-600 max-w-3xl leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                                {item.points?.length > 0 && (
                                    <>
                                        {/* Mobile: 3 poin */}
                                        <div className="mt-5 grid w-full max-w-4xl mx-auto gap-3 md:hidden">
                                            {item.points.slice(0, 3).map((point, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-start gap-3 rounded-2xl bg-white/85 p-4 text-left shadow-sm"
                                                >
                                                    <span
                                                        className="shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                                        style={{ backgroundColor: WARNA.hijauUtama }}
                                                    >
                                                        {i + 1}
                                                    </span>
                                                    <p className="text-sm leading-6 text-slate-700">{point}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Desktop: 4 poin */}
                                        <div className="mt-5 hidden md:grid w-full max-w-4xl mx-auto gap-4 md:grid-cols-2">
                                            {item.points.slice(0, 4).map((point, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-start gap-3 rounded-2xl bg-white/85 p-4 text-left shadow-sm"
                                                >
                                                    <span
                                                        className="shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                                        style={{ backgroundColor: WARNA.hijauUtama }}
                                                    >
                                                        {i + 1}
                                                    </span>
                                                    <p className="text-sm leading-6 text-slate-700">{point}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                        {item.theme === "welcome" ? (
                            <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-slate-400 flex items-center gap-1.5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                    <path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                                Klik untuk melihat detail
                            </span>
                        ) : (
                            <span className="mt-6 mb-2 mx-auto text-sm text-slate-400 flex items-center gap-1.5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                    <path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                                Klik untuk melihat detail
                            </span>
                        )}
                    </div>

                    {items.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); geser(-1); }}
                                aria-label="Sebelumnya"
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg text-slate-700 flex items-center justify-center hover:scale-105 transition-transform"
                            >
                                <IkonChevron arah="kiri" className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); geser(1); }}
                                aria-label="Selanjutnya"
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg text-slate-700 flex items-center justify-center hover:scale-105 transition-transform"
                            >
                                <IkonChevron arah="kanan" className="w-5 h-5" />
                            </button>

                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {items.map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); goToSlide(i); }}
                                        aria-label={`Slide ${i + 1}`}
                                        className="h-1.5 rounded-full transition-all duration-300"
                                        style={{
                                            width: i === index ? 24 : 6,
                                            backgroundColor: i === index ? WARNA.hijauUtama : "rgba(0,0,0,0.15)",
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <CarouselModal item={modalItem} onClose={() => setModalItem(null)} />
        </>
    );
}

/* ========================= Halaman Katalog ========================= */

function IsiKatalog({ games, bahasa, setBahasa }) {
    const t = useTeks();
    const [pencarian, setPencarian] = useState("");
    const [kategoriAktif, setKategoriAktif] = useState("Semua");
    const [lantaiAktif, setLantaiAktif] = useState("Semua");
    const [statusAktif, setStatusAktif] = useState("Semua");
    const [modalCarouselOpen, setModalCarouselOpen] = useState(false);

    const kategoriList = useMemo(() => {
        const set = new Set();
        games.forEach((g) => {
            if (Array.isArray(g.kategori)) {
                g.kategori.forEach((k) => { if (k) set.add(k); });
            } else if (g.kategori) {
                set.add(g.kategori);
            }
        });
        return ["Semua", ...Array.from(set).sort()];
    }, [games]);

    const filtered = useMemo(() => {
        return games.filter((g) => {
            const cocokNama = g.nama.toLowerCase().includes(pencarian.toLowerCase());
            const cocokKategori = kategoriAktif === "Semua" || (
                Array.isArray(g.kategori) ? g.kategori.includes(kategoriAktif) : g.kategori === kategoriAktif
            );
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
            <TopNavbar
                pencarian={pencarian}
                setPencarian={setPencarian}
                bahasa={bahasa}
                setBahasa={setBahasa}
            />

            <AnnouncementCarousel onModalChange={setModalCarouselOpen} />

            {/* Filter & sort, ala baris filter Amazon */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-3">
                    {/* Desktop (lg+) */}
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                value={pencarian}
                                onChange={(e) => setPencarian(e.target.value)}
                                placeholder={t.cariPlaceholder}
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-colors"
                            />
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
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

                            <span className="text-xs text-slate-500 shrink-0">{filtered.length} {t.boardGame}</span>
                        </div>
                    </div>

                    {/* Mobile (< lg) */}
                    <div className="lg:hidden space-y-3">
                        <input
                            type="text"
                            value={pencarian}
                            onChange={(e) => setPencarian(e.target.value)}
                            placeholder={t.cariPlaceholder}
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-colors"
                        />

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <span className="text-xs font-semibold text-slate-500">{t.filter}</span>

                            <div className="flex items-center gap-1">
                                <select value={kategoriAktif} onChange={(e) => setKategoriAktif(e.target.value)} className={kelasSelect}>
                                    {kategoriList.map((k) => (
                                        <option key={k} value={k}>{k === "Semua" ? t.semua : k}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-1">
                                <select value={lantaiAktif} onChange={(e) => setLantaiAktif(e.target.value)} className={kelasSelect}>
                                    <option value="Semua">{t.semua}</option>
                                    <option value="1">{t.lantai} 1</option>
                                    <option value="2">{t.lantai} 2</option>
                                    <option value="3">{t.lantai} 3</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-1">
                                <select value={statusAktif} onChange={(e) => setStatusAktif(e.target.value)} className={kelasSelect}>
                                    <option value="Semua">{t.semua}</option>
                                    <option value="Tersedia">{t.tersedia}</option>
                                    <option value="Dipinjam">{t.dipinjam}</option>
                                </select>
                            </div>

                            <span className="text-xs text-slate-500 ml-auto">{filtered.length} {t.boardGame}</span>
                        </div>
                    </div>
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

            <Footer />

            {/* Floating Pinjam button */}
            <Link
                href={modalCarouselOpen ? undefined : route("peminjaman.create")}
                className={`fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:w-auto z-50 inline-flex items-center justify-center gap-2 px-6 py-3.5 md:py-3 font-semibold text-white bg-emerald-700 rounded-2xl md:rounded-full shadow-xl shadow-emerald-900/25 transition-all duration-200 ${
                    modalCarouselOpen
                        ? "pointer-events-none opacity-60"
                        : "hover:bg-emerald-800 hover:-translate-y-0.5 hover:shadow-emerald-900/40"
                }`}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Pinjam
            </Link>
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