import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import LanguageToggle from "../Components/LanguageToggle";
import Footer from "../Components/Footer";
import ReviewSection from "../Components/ReviewSection";
import RatingSummary from "../Components/RatingSummary";

const WARNA = {
    hijauTua: "#173C33",
    hijauUtama: "#2F6F62",
    hijauHover: "#255A4F",
    emas: "#B98A4A",
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

const TEKS = {
    ID: {
        cariPlaceholder: "Cari nama board game...",
        masuk: "Masuk",
        favorit: "Favorit",
        riwayat: "Riwayat",
        kembali: "Kembali ke Katalog",
        kode: "Kode",
        box: "Box",
        penerbit: "Penerbit",
        lantai: "Lantai",
        pemain: "Pemain",
        menit: "Menit",
        tersedia: "Tersedia",
        dipinjam: "Dipinjam",
        deskripsiIsi: "Lihat Detail",
        umum: "Umum",
        pinjamSekarang: "Pinjam Sekarang",
        detailBoardGame: "Detail Board Game",
        informasiUmum: "Informasi Umum",
        usia: "Usia",
        kesulitan: "Kesulitan",
        ringan: "Ringan",
        sedang: "Sedang",
        berat: "Berat",
        gameSerupa: "Game Serupa Lainnya",
        gameSerupaSub: "Kategori sama dengan game ini",
        deskripsiGame: "Deskripsi",
        videoTutorial: "Video Tutorial",
        tontonTutorial: "Tonton Cara Bermain",
    },
    EN: {
        cariPlaceholder: "Search board game name...",
        masuk: "Sign In",
        favorit: "Favorites",
        riwayat: "History",
        kembali: "Back to Catalog",
        kode: "Code",
        box: "Box",
        penerbit: "Publisher",
        lantai: "Floor",
        pemain: "Players",
        menit: "Minutes",
        tersedia: "Available",
        dipinjam: "Borrowed",
        deskripsiIsi: "Components",
        umum: "General",
        pinjamSekarang: "Borrow Now",
        detailBoardGame: "Board Game Detail",
        informasiUmum: "General Information",
        usia: "Age",
        kesulitan: "Difficulty",
        ringan: "Light",
        sedang: "Medium",
        berat: "Heavy",
        gameSerupa: "More Similar Games",
        gameSerupaSub: "Same category as this game",
        deskripsiGame: "Description",
        videoTutorial: "Tutorial Video",
        tontonTutorial: "Watch How to Play",
    },
};

const BahasaContext = createContext(TEKS.ID);
function useTeks() {
    return useContext(BahasaContext);
}

function warnaKategori(kategori) {
    return KATEGORI_COLORS[kategori] ?? DEFAULT_COLOR;
}

function labelKesulitan(nilai, t) {
    if (nilai <= 2) return t.ringan;
    if (nilai <= 3.5) return t.sedang;
    return t.berat;
}

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

function IkonLabel(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M7 7h.01M20.59 13.41l-6.82 6.82a2 2 0 0 1-2.82 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        </svg>
    );
}

function IkonPanahBawah(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="m6 9 6 6 6-6" />
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

function IkonBintang({ terisi, ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill={terisi ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" {...props}>
            <path d="M12 2.5l2.9 6.1 6.6.8-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.8L12 2.5z" />
        </svg>
    );
}

function IkonUsia(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
        </svg>
    );
}

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

function IkonPlay(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" stroke="none" />
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

function TopNavbar({ bahasa, setBahasa }) {
    const t = useTeks();

    return (
        <div style={{ backgroundColor: WARNA.hijauTua }}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                {/* Desktop (md+) */}
                <div className="hidden md:flex items-center justify-between py-3">
                    {/* Kiri: Logo + Nama Institusi */}
                    <a href="/katalog" className="flex items-center gap-3 shrink-0">
                        <img
                            src="/assets/logo_undip.png"
                            alt="Universitas Diponegoro"
                            className="h-14 w-14 object-contain"
                        />
                        <img
                            src="/images/logo-upt.png"
                            alt="UPT Perpustakaan Undip"
                            className="h-14 w-14 object-contain"
                        />
                        <div className="leading-tight text-white">
                            <span className="block text-[11px] text-emerald-100/90 tracking-wide">Universitas Diponegoro</span>
                            <span className="block text-sm font-semibold">UPT Perpustakaan</span>
                        </div>
                    </a>

                    {/* Kanan: Bahasa + Sosial Media */}
                    <div className="flex items-center gap-5 shrink-0">
                        <LanguageToggle bahasa={bahasa} setBahasa={setBahasa} />
                        <div className="flex items-center gap-3 text-white/80">
                            <a href="https://youtube.com/@perpustakaanundip?si=RgDQgwp-UlPD7ryq" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                                <IkonYoutube className="w-5 h-5" />
                                <span className="text-xs hidden xl:inline">Youtube</span>
                            </a>
                            <a href="https://www.instagram.com/perpus.undip?igsh=MTh4bXFtd3AzbmRmdQ==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                                <IkonInstagram className="w-5 h-5" />
                                <span className="text-xs hidden xl:inline">Instagram</span>
                            </a>
                            <a href="https://www.tiktok.com/@perpus.undip.press?_r=1&_t=ZS-97okoKr4q4S" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                                <IkonTiktok className="w-5 h-5" />
                                <span className="text-xs hidden xl:inline">TikTok</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Mobile (< md) */}
                <div className="md:hidden">
                    <div className="flex items-center justify-between py-3">
                        <a href="/katalog" className="flex items-center gap-2">
                            <img
                                src="/assets/logo_undip.png"
                                alt="Universitas Diponegoro"
                                className="h-16 w-16 object-contain"
                            />
                            <img
                                src="/images/logo-upt.png"
                                alt="UPT Perpustakaan Undip"
                                className="h-10 w-10 object-contain"
                            />
                            <div className="leading-tight text-white">
                                <span className="block text-[10px] text-emerald-100/90 tracking-wide">Universitas Diponegoro</span>
                                <span className="block text-xs font-semibold">UPT Perpustakaan</span>
                            </div>
                        </a>
                        <LanguageToggle bahasa={bahasa} setBahasa={setBahasa} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Slider foto: gambar utama + gambar_hover, dengan panah & dot (mirip AnnouncementCarousel di Katalog)
function GaleriGambar({ game, warna }) {
    const slides = useMemo(
        () => game.link_foto?.filter(Boolean) ?? [],
        [game.link_foto]
    );
    const [index, setIndex] = useState(0);
    const adaBanyak = slides.length > 1;

    useEffect(() => {
        setIndex(0);
    }, [game.id]);

    const geser = (arah) => setIndex((i) => (i + arah + slides.length) % slides.length);

    return (
        <div className="relative min-h-[320px] md:min-h-[540px] flex items-center justify-center p-10 overflow-hidden bg-white">
            {slides.length > 0 ? (
                slides.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt={game.nama}
                        className="absolute inset-0 m-auto max-w-[80%] max-h-[80%] object-contain transition-opacity duration-500"
                        style={{ opacity: i === index ? 1 : 0 }}
                    />
                ))
            ) : (
                <div className="flex items-center justify-center scale-[2.5]">
                    <IkonDadu pip={pipDariJumlahPemain(game.jumlah_pemain)} color={warna} />
                </div>
            )}

            {adaBanyak && (
                <>
                    <button
                        type="button"
                        onClick={() => geser(-1)}
                        aria-label="Sebelumnya"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md text-slate-700 flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <IkonChevron arah="kiri" className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => geser(1)}
                        aria-label="Selanjutnya"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md text-slate-700 flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <IkonChevron arah="kanan" className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIndex(i)}
                                aria-label={`Foto ${i + 1}`}
                                className="h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: i === index ? 22 : 8,
                                    backgroundColor: i === index ? WARNA.hijauUtama : "#CFE4DC",
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// Badge kesulitan - eye catching, pill dengan bintang
function BadgeKesulitan({ nilai, warna, t }) {
    if (!nilai) return null;
    const bintangPenuh = Math.round(nilai);

    return (
        <div
            className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${warna}15`, border: `1.5px solid ${warna}40` }}
        >
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <IkonBintang
                        key={i}
                        terisi={i <= bintangPenuh}
                        className="w-3.5 h-3.5"
                        style={{ color: i <= bintangPenuh ? warna : "#D1D5DB" }}
                    />
                ))}
            </div>
            <span className="text-xs font-semibold" style={{ color: warna }}>
                {labelKesulitan(nilai, t)}
            </span>
        </div>
    );
}

// Badge usia - eye catching, pill kontras
function BadgeUsia({ usia, t }) {
    if (!usia) return null;
    return (
        <div className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-800 text-white">
            <IkonUsia className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{usia} {t.usia}</span>
        </div>
    );
}

// Tombol/link menuju video tutorial (buka tab baru)
function TautanTutorial({ link, warna, t }) {
    if (!link) return null;
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-4 py-2 border transition-colors"
            style={{ color: warna, borderColor: `${warna}40`, backgroundColor: `${warna}0D` }}
        >
            <IkonPlay className="w-4 h-4" />
            {t.tontonTutorial}
        </a>
    );
}

function KartuGameSerupa({ item }) {
    const [warnaKartu] = warnaKategori(item.kategori);
    return (
        <Link href={`/katalog/${item.id}`} className="shrink-0 w-44 group">
            <div className="w-44 h-44 rounded-2xl overflow-hidden flex items-center justify-center mb-2.5 border border-slate-100 p-4 bg-white">
                {item.link_foto?.[0] ? (
                    <img src={item.link_foto[0]} alt={item.nama} className="max-w-full max-h-full object-contain" />
                ) : (
                    <IkonDadu pip={2} color={warnaKartu} />
                )}
            </div>
            <p className="text-sm font-semibold text-slate-700 leading-snug line-clamp-2 group-hover:underline">
                {item.nama}
            </p>
            <p className="text-xs mt-1 font-medium" style={{ color: warnaKartu }}>
                {item.kategori}
            </p>
        </Link>
    );
}

function SeksiGameSerupa({ gameSerupa, t }) {
    if (!Array.isArray(gameSerupa) || gameSerupa.length === 0) return null;

    return (
        <div className="mt-8 rounded-3xl p-6 md:p-8" style={{ backgroundColor: WARNA.krem }}>
            <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: WARNA.hijauUtama }} />
                <h2 className="text-xl font-bold text-slate-800">{t.gameSerupa}</h2>
            </div>
            <p className="text-sm text-slate-500 mb-5 ml-3.5">{t.gameSerupaSub}</p>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {gameSerupa.map((item) => (
                    <KartuGameSerupa key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

function IsiDetail({ game, gameSerupa, reviews, avgRating, totalReviews, ratingDistribution, selectedReviewRating, bahasa, setBahasa }) {
    const t = useTeks();
    const [warna, bg] = warnaKategori(game.kategori);
    const tersedia = game.available_copies > 0;
    const daftarKomponen = useMemo(() => game.komponen ?? [], [game.komponen]);
    const [tampilkanKomponen, setTampilkanKomponen] = useState(false);
    const adaBadge = game.tingkat_kesulitan || game.usia_minimum;

    return (
        <div className="min-h-screen bg-white text-[15px]">
            <TopNavbar
                bahasa={bahasa}
                setBahasa={setBahasa}
            />

            <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
                <Link
                    href="/katalog"
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-full px-4 py-2 transition-colors mb-4"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M19 12H5" />
                        <path d="m12 19-7-7 7-7" />
                    </svg>
                    {t.kembali}
                </Link>

                <div className="bg-white rounded-3xl overflow-hidden ring-1 ring-slate-100">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Galeri foto: gambar + gambar_hover, geser pakai panah/dot */}
                        <GaleriGambar game={game} warna={warna} bg={bg} />

                        {/* Info */}
                        <div className="p-8 md:p-12 flex flex-col">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-1">
                                {game.nama}
                            </h1>
                            <p className="text-sm text-slate-500 mb-4">{game.penerbit}</p>

                            <div className="mb-4">
                                <RatingSummary
                                    averageRating={avgRating}
                                    reviewsCount={totalReviews}
                                    size="lg"
                                />
                            </div>

                            {/* Badge kesulitan & usia - eye catching, tepat di bawah judul */}
                            {adaBadge && (
                                <div className="flex flex-wrap items-center gap-2 mb-5">
                                    <BadgeKesulitan nilai={game.tingkat_kesulitan} warna={warna} t={t} />
                                    <BadgeUsia usia={game.usia_minimum} t={t} />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <IkonPemain className="w-4 h-4 shrink-0" style={{ color: warna }} />
                                    <span className="font-medium">{formatPemain(game.jumlah_pemain, t)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <IkonRak className="w-4 h-4 shrink-0" style={{ color: warna }} />
                                    <span className="font-medium">{t.lantai} {game.lantai}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <IkonJam className="w-4 h-4 shrink-0" style={{ color: warna }} />
                                    <span className="font-medium">{formatDurasi(game.durasi, t)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <IkonLabel className="w-4 h-4 shrink-0" style={{ color: warna }} />
                                    <span className="font-medium">{t.kode}: {game.kode}</span>
                                </div>
                            </div>

                            {/* Deskripsi game */}
                            {game.deskripsi && (
                                <div className="mb-5">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-1.5">
                                        {t.deskripsiGame}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                        {game.deskripsi}
                                    </p>
                                </div>
                            )}

                            {/* Link video tutorial */}
                            {game.link_tutorial && (
                                <div className="mb-5">
                                    <TautanTutorial link={game.link_tutorial} warna={warna} t={t} />
                                </div>
                            )}

                            {daftarKomponen.length > 0 && (
                                <div className="mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setTampilkanKomponen((prev) => !prev)}
                                        className="w-full flex items-center justify-between text-sm font-semibold text-slate-800 py-2 border-b border-slate-100"
                                    >
                                        <span>{t.deskripsiIsi}</span>
                                        <IkonPanahBawah
                                            className={`w-4 h-4 transition-transform duration-200 ${
                                                tampilkanKomponen ? "rotate-180" : ""
                                            }`}
                                            style={{ color: warna }}
                                        />
                                    </button>

                                    {tampilkanKomponen && (
                                        <ul className="space-y-1.5 mt-3">
                                            {daftarKomponen.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-snug">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: warna }} />
                                                    <span className="font-medium capitalize">{item.nama}</span>
                                                    <span className="text-slate-400 ml-auto">x{item.jumlah}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            <div className={daftarKomponen.length > 0 ? "" : "mt-auto"}>
                                {tersedia ? (
                                    <Link
                                        href={`/peminjaman/create?boardgame_id=${game.id}`}
                                        className="block w-full rounded-full py-3 text-base font-semibold text-white text-center transition-colors"
                                        style={{ backgroundColor: WARNA.hijauUtama }}
                                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = WARNA.hijauHover)}
                                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = WARNA.hijauUtama)}
                                    >
                                        {t.pinjamSekarang}
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full rounded-full py-3 text-base font-semibold bg-slate-200 text-slate-400 cursor-not-allowed"
                                    >
                                        {t.dipinjam}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Game Serupa - section lebar, background beda biar mencolok */}
                <SeksiGameSerupa gameSerupa={gameSerupa} t={t} />

                <ReviewSection
                    boardgameId={game.id}
                    reviews={reviews}
                    avgRating={avgRating}
                    totalReviews={totalReviews}
                    ratingDistribution={ratingDistribution}
                    selectedReviewRating={selectedReviewRating}
                />
            </div>

            <Footer />
        </div>
    );
}

export default function Detail({ game, gameSerupa = [], reviews = [], avgRating = null, totalReviews = 0, ratingDistribution = [], selectedReviewRating = 'all' }) {
    const [bahasa, setBahasa] = useState("ID");

    return (
        <BahasaContext.Provider value={TEKS[bahasa]}>
            <Head title={game ? game.nama : "Detail Board Game"} />
            <IsiDetail game={game} gameSerupa={gameSerupa} reviews={reviews} avgRating={avgRating} totalReviews={totalReviews} ratingDistribution={ratingDistribution} selectedReviewRating={selectedReviewRating} bahasa={bahasa} setBahasa={setBahasa} />
        </BahasaContext.Provider>
    );
}

Detail.layout = (page) => page;