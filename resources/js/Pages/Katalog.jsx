import { createPortal } from "react-dom";
import { useMemo, useState, useRef, useEffect, useCallback, memo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import Footer from "../Components/Footer";
import RatingSummary from "../Components/RatingSummary";
import TopNavbar from "../Components/TopNavbar";
import { WARNA, warnaKategori } from "../Components/theme";
import { BahasaContext, TEKS, useTeks, useBahasaState } from "../Components/BahasaContext";
import { AnimatedSection, Reveal, StaggerGrid, MotionButton, MotionLink } from "../Components/animations";

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

/* ========================= Kartu board game ========================= */

function KartuGame({ game, tersedia }) {
    const t = useTeks();
    const [warna, bg] = warnaKategori(game.kategori);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => router.visit(`/katalog/${game.id}`)}
            onKeyDown={(e) => { if (e.key === 'Enter') router.visit(`/katalog/${game.id}`) }}
            className={`group h-full flex flex-col rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                tersedia
                    ? "bg-white border-slate-100 shadow-sm"
                    : "bg-white border-slate-200"
            }`}
        >
            <div className="relative overflow-hidden">
                <span
                    className={`absolute top-3 right-3 z-10 text-[11px] font-semibold px-3 py-1 rounded-full ${
                        tersedia ? "bg-sky-800 text-white" : "bg-slate-500 text-white"
                    }`}
                >
                    {tersedia ? t.tersedia : t.dipinjam}
                </span>

                <div
                    className={`relative aspect-square flex items-center justify-center overflow-hidden ${!tersedia ? "grayscale" : ""}`}
                    style={{ backgroundColor: bg }}
                >
                {game.link_foto?.[0] ? (
                    <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
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
                    </div>
                ) : (
                    <IkonDadu pip={pipDariJumlahPemain(game.jumlah_pemain)} color={warna} />
                )}
            </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                {(() => {
                    const kategoriArr = Array.isArray(game.kategori) && game.kategori.length > 0
                        ? game.kategori
                        : [game.kategori ?? t.umum];
                    const MAKS = 3;
                    const sisa = kategoriArr.length - MAKS;
                    const hiddenTooltip = sisa > 0
                        ? kategoriArr.slice(MAKS).join(', ')
                        : '';

                    return (
                        <>
                            <div className="flex sm:hidden flex-wrap gap-1 mb-2">
                                {kategoriArr.slice(0, MAKS).map((k, i) => {
                                    const [kw, kb] = warnaKategori(k);
                                    return (
                                        <span
                                            key={i}
                                            className="inline-block self-start truncate max-w-[45%] text-[9px] font-medium px-2 py-0.5 rounded-full"
                                            style={{ backgroundColor: kb, color: kw }}
                                        >
                                            {k}
                                        </span>
                                    );
                                })}
                                {sisa > 0 && (
                                    <span className="inline-block shrink-0 self-start whitespace-nowrap text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                        +{sisa}
                                    </span>
                                )}
                            </div>

                            <div className="hidden sm:flex flex-wrap gap-1 mb-2">
                                {kategoriArr.slice(0, MAKS).map((k, i) => {
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
                                {sisa > 0 && (
                                    <span
                                        className="inline-block shrink-0 self-start whitespace-nowrap text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600"
                                        title={hiddenTooltip}
                                        aria-label={hiddenTooltip}
                                    >
                                        +{sisa}
                                    </span>
                                )}
                            </div>
                        </>
                    );
                })()}

                <div className="mb-2">
                    <p className="text-xs font-medium text-slate-700 mt-2 line-clamp-2">
                        {game.nama}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{game.penerbit ?? "\u00A0"}</p>
                    <div className="mt-1">
                        <RatingSummary
                            averageRating={game.reviews_avg_rating}
                            reviewsCount={game.reviews_count}
                        />
                    </div>
                </div>

                <div className="text-[11px] text-slate-500 mb-3 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
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

                <div className="mt-auto">
                    <div className="flex justify-end mb-1.5">
                        <span className="whitespace-nowrap text-[11px] font-medium leading-4 text-gray-700">
                            {game.loans_count >= 1000
                                ? '999+ Peminjaman'
                                : `${game.loans_count} Peminjaman`}
                        </span>
                    </div>
                    {tersedia ? (
                        <div onClick={(e) => e.stopPropagation()}>
                            <Link
                                href={`/katalog/${game.id}`}
                                className="block w-full rounded-full py-2 text-sm font-semibold text-white text-center transition-all duration-200 active:scale-95 hover:scale-[1.02]"
                                style={{ backgroundColor: WARNA.hijauUtama }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = WARNA.hijauHover)}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = WARNA.hijauUtama)}
                            >
                                {t.lihatDetail}
                            </Link>
                        </div>
                    ) : (
                        <div className="w-full rounded-full py-2 text-sm font-semibold text-center"
                            style={{ backgroundColor: "#F1F5F9", color: "#94A3B8" }}
                        >
                            {t.dipinjam}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ========================= Parallax Background (lightweight) ========================= */
/* Single reveal on scroll, no continuous scroll-linked update */

function ParallaxBg({ children }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute inset-0"
                initial={{ y: 15 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                {children}
            </motion.div>
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
    sanksi: {
        bg: WARNA.krem,
        blob: [
            { path: "M80 60 Q220 10 340 100 Q440 180 380 300 Q320 400 180 380 Q40 360 20 220 Q0 100 80 60 Z", fill: WARNA.emas, opacity: "0.18" },
            { cx: 420, cy: 350, r: 55, fill: WARNA.hijauUtama, opacity: "0.14" },
            { cx: 60, cy: 400, r: 35, fill: WARNA.hijauTua, opacity: "0.10" },
        ],
    },
    populer: {
        bg: WARNA.krem,
        blob: [
            { path: "M100 30 Q240 0 320 100 Q400 200 320 300 Q240 400 120 380 Q0 360 20 220 Q40 80 100 30 Z", fill: WARNA.hijauUtama, opacity: "0.18" },
            { cx: 420, cy: 340, r: 50, fill: WARNA.emas, opacity: "0.14" },
            { cx: 60, cy: 400, r: 30, fill: WARNA.hijauTua, opacity: "0.10" },
        ],
    },
};

function CarouselModal({ item, onClose }) {
    const [entered, setEntered] = useState(false);
    const t = useTeks();

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

    useEffect(() => {
        if (!item) {
            setEntered(false);
            return;
        }
        setEntered(false);
        const raf = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(raf);
    }, [item]);

    if (!item) return null;

    const theme = THEMES[item.theme] || THEMES.welcome;

    return createPortal(
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
                    entered ? "opacity-100" : "opacity-0"
                }`}
            />

            <div className="relative h-full overflow-y-auto p-3 py-6 md:p-4 md:py-8">
                <div className="flex min-h-full items-center justify-center">
                    <div
                        className={`relative w-full max-w-md md:w-[92vw] md:max-w-7xl max-h-[85vh] md:max-h-[88vh] rounded-2xl md:rounded-[2rem] shadow-2xl overflow-y-auto ring-1 ring-white/50 transition-all duration-300 ease-out ${
                            entered ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-3"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="relative p-5 md:p-10 lg:p-12 backdrop-blur-2xl"
                            style={{ backgroundColor: item.bgImage ? undefined : `${theme.bg}CC` }}
                        >
                            {item.bgImage && (
                                <>
                                    <img
                                        src={item.bgImage}
                                        alt=""
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div
                                        className="absolute inset-0"
                                        style={{ backgroundColor: "rgba(255,255,255,0.45)" }}
                                    />
                                </>
                            )}
                            {!item.bgImage && (
                                <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full pointer-events-none">
                                    {theme.blob.map((b, i) =>
                                        b.path ? (
                                            <path key={i} d={b.path} fill={b.fill} opacity={b.opacity} />
                                        ) : (
                                            <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.fill} opacity={b.opacity} />
                                        )
                                    )}
                                </svg>
                            )}

                            <MotionButton
                                onClick={onClose}
                                className="absolute top-3 right-3 md:top-6 md:right-6 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-500 hover:text-slate-700 shadow-sm transition-colors touch-manipulation"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 md:w-5 md:h-5">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </MotionButton>

                            <div className="relative z-10">
                                <h2
                                    className="text-xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-center pr-8 md:pr-0"
                                    style={{ color: WARNA.hijauTua, whiteSpace: "pre-line" }}
                                >
                                    {item.detailTitle}
                                </h2>
                                <p
                                    className="text-sm md:text-lg leading-6 md:leading-8 mb-4 md:mb-6 max-w-5xl font-medium"
                                    style={{ color: WARNA.hijauTua }}
                                >
                                    {item.detailDescription}
                                </p>
                                <div className="max-h-[260px] md:max-h-[280px] overflow-y-auto pr-1 -mr-1">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
        {item.points.map((point, i) => (
            <div key={i} className="flex items-start gap-3 md:gap-4 p-3 md:p-6 rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm">
                <span className="shrink-0 mt-0.5 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold" style={{ backgroundColor: WARNA.hijauUtama }}>
                    {i + 1}
                </span>
                <p className="text-xs md:text-base text-slate-700 leading-relaxed">{point}</p>
            </div>
        ))}
    </div>
</div>
                                <MotionButton
                                    onClick={onClose}
                                    className="mt-5 md:mt-8 w-full rounded-full py-2.5 md:py-3 text-sm md:text-base font-semibold text-white touch-manipulation"
                                    style={{ backgroundColor: WARNA.hijauUtama }}
                                    whileHover={{ scale: 1.02, backgroundColor: WARNA.hijauHover }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {t.tutup}
                                </MotionButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

function ProdukPopuler({ games }) {
    const trackRef = useRef(null);
    const posRef = useRef(0);
    const rafRef = useRef(null);
    const pausedRef = useRef(false);
    const t = useTeks();

    const populer = useMemo(() => {
        return [...games]
            .sort((a, b) => {
                const diff = (b.loans_count ?? 0) - (a.loans_count ?? 0);
                if (diff !== 0) return diff;
                return (a.nama ?? '').localeCompare(b.nama ?? '');
            })
            .slice(0, 10);
    }, [games]);

    // Digandakan 2x supaya loop-nya mulus tanpa jeda/loncat
    const loopedPopuler = useMemo(() => [...populer, ...populer], [populer]);

    useEffect(() => {
        if (populer.length === 0) return;
        const track = trackRef.current;
        if (!track) return;

        const KECEPATAN = 0.6; // px per frame, kecil = pelan

        function step() {
            if (!pausedRef.current && track) {
                posRef.current += KECEPATAN;
                const setengah = track.scrollWidth / 2;
                if (posRef.current >= setengah) {
                    posRef.current -= setengah;
                }
                track.style.transform = `translateX(-${posRef.current}px)`;
            }
            rafRef.current = requestAnimationFrame(step);
        }

        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [populer.length]);

    if (populer.length === 0) return null;

    return (
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-8 relative">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-5 text-center md:text-left">
                {t.produkPopuler}
            </h2>

            <div
                onMouseEnter={() => { pausedRef.current = true; }}
                onMouseLeave={() => { pausedRef.current = false; }}
                onTouchStart={() => { pausedRef.current = true; }}
                onTouchEnd={() => { pausedRef.current = false; }}
                className="overflow-hidden pb-2"
            >
                <div ref={trackRef} className="flex gap-4 w-max will-change-transform">
                    {loopedPopuler.map((game, i) => {
                        const rank = (i % populer.length) + 1;
                        const rankColor =
                            rank === 1 ? '#FFD700' :
                            rank === 2 ? '#C0C0C0' :
                            rank === 3 ? '#CD7F32' :
                            '#0E4A73';
                        const rankTextColor = rank <= 3 ? '#1a1a1a' : '#ffffff';
                        return (
                        <div
                            key={`${game.id}-${i}`}
                            onClick={() => router.visit(`/katalog/${game.id}`)}
                            className="shrink-0 w-40 cursor-pointer"
                        >
                            <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 relative">
                                <span
                                    className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full text-[11px] font-bold flex items-center justify-center"
                                    style={{
                                        backgroundColor: rankColor,
                                        color: rankTextColor,
                                    }}
                                >
                                    {rank}
                                </span>
                                {game.link_foto?.[0] && (
                                    <img src={game.link_foto[0]} alt={game.nama} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <p className="text-xs font-medium text-slate-700 mt-2 line-clamp-2 text-center">
                                {game.nama}
                            </p>
                            <p className="text-[10px] font-medium text-slate-500 mt-0.5 text-center">
                                {game.loans_count >= 1000
                                    ? '999+ Peminjaman'
                                    : `${game.loans_count} Peminjaman`}
                            </p>
                        </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const AnnouncementCarousel = memo(function AnnouncementCarousel({ carousels, onModalChange }) {
    const t = useTeks();
    const items = carousels;

    // `index`   = target slide terbaru (dipakai untuk highlight dot & klik modal)
    // `current` = slide yang sedang full-opacity di layer bawah
    // `incoming`= slide yang sedang fade-in di layer atas (null kalau tidak ada transisi)
    const [index, setIndex] = useState(0);
    const [current, setCurrent] = useState(0);
    const [incoming, setIncoming] = useState(null);
    const [incomingShown, setIncomingShown] = useState(false);

    const [modalItem, setModalItem] = useState(null);
    const [paused, setPaused] = useState(false);
    const [grabbing, setGrabbing] = useState(false);
    const wrapperRef = useRef(null);
    const bottomScrollRef = useRef(null);
    const lastChangeRef = useRef(Date.now());
    const intervalRef = useRef(null);
    const mountedRef = useRef(true);
    const transitionTimeoutRef = useRef(null);
    const rafRef = useRef(null);
    const dragOccurredRef = useRef(false);

    const TRANSITION_MS = 700;

    useEffect(() => {
        onModalChange?.(!!modalItem);
    }, [modalItem, onModalChange]);

    // Crossfade tanpa celah putih: slide baru dipasang DI ATAS slide lama
    // (yang tetap full opacity di bawah) lalu perlahan fade-in. Karena selalu
    // ada layer solid penuh di belakang, tidak pernah ada momen kosong/putih.
    useEffect(() => {
        if (index === current) return;

        setIncoming(index);
        setIncomingShown(false);

        cancelAnimationFrame(rafRef.current);
        // double rAF supaya browser sempat paint opacity:0 dulu sebelum transisi ke 1
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = requestAnimationFrame(() => setIncomingShown(true));
        });

        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = setTimeout(() => {
            setCurrent(index);
            setIncoming(null);
            setIncomingShown(false);
        }, TRANSITION_MS);

        return () => {
            clearTimeout(transitionTimeoutRef.current);
            cancelAnimationFrame(rafRef.current);
        };
    }, [index, current]);

    useEffect(() => {
        bottomScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }, [current]);

    // FIX (jank di HP): preload gambar slide berikutnya & sebelumnya supaya
    // saat crossfade jalan, <img> sudah ter-decode di cache browser dan
    // tidak nge-block main thread pas fade-in dimulai.
    useEffect(() => {
        if (items.length <= 1) return;
        const next = items[(index + 1) % items.length];
        const prev = items[(index - 1 + items.length) % items.length];
        [next, prev].forEach((it) => {
            if (it?.bgImage) {
                const img = new Image();
                img.src = it.bgImage;
            }
        });
    }, [index, items]);

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
    }, [items.length]);

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

    const handleDragStart = useCallback(() => {
        setGrabbing(true);
        dragOccurredRef.current = false;
        clearAutoplay();
    }, [clearAutoplay]);

    const handleDrag = useCallback((_, info) => {
        if (Math.abs(info.offset.x) > 5) {
            dragOccurredRef.current = true;
        }
    }, []);

    const handleDragEnd = useCallback((_, info) => {
        setGrabbing(false);
        const threshold = 80;
        const offsetX = info.offset.x;
        const velocityX = info.velocity.x;
        if (offsetX > threshold || velocityX > 500) {
            geser(-1);
        } else if (offsetX < -threshold || velocityX < -500) {
            geser(1);
        } else {
            startAutoplay();
        }
        dragOccurredRef.current = false;
    }, [geser, startAutoplay]);

    // Render isi satu slide (background + teks). Dipakai untuk layer bawah
    // (current) maupun layer atas (incoming) supaya tidak duplikasi JSX.
    function renderSlide(slideItem, scrollRef) {
        const theme = THEMES[slideItem.theme] || THEMES.welcome;
        const punyaFoto = !!slideItem.bgImage;

        if (slideItem.theme === "populer") {
            const punyaFotoPopuler = !!slideItem.bgImage;

            return (
                <div className="absolute inset-0">
                    {punyaFotoPopuler ? (
                        <ParallaxBg>
                            <img
                                src={slideItem.bgImage}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                            />
                            <div
                                className="absolute inset-0"
                                style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
                            />
                        </ParallaxBg>
                    ) : (
                        <ParallaxBg>
                            <div className="absolute inset-0" style={{ backgroundColor: theme.bg }} />
                        </ParallaxBg>
                    )}

                    <div
                        ref={scrollRef}
                        className="relative flex flex-col h-full justify-center px-4 md:px-14 lg:px-20 py-6 md:py-10 text-center overflow-y-auto"
                    >
                        <p
                            className="text-xs md:text-lg lg:text-xl mb-4 md:mb-6 font-medium"
                            style={{ color: WARNA.hijauTua }}
                        >
                            {slideItem.description}
                        </p>

                        <div className="flex justify-center gap-3 md:gap-6 flex-wrap">
                            {slideItem.gamesPopuler.map((game) => (
                                <div
                                    key={game.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.visit(`/katalog/${game.id}`);
                                    }}
                                    className="cursor-pointer w-20 md:w-32 shrink-0"
                                >
                                    <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
                                        {game.link_foto?.[0] && (
                                            <img
                                                src={game.link_foto[0]}
                                                alt={game.nama}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <p className="text-[10px] md:text-xs font-medium text-slate-700 mt-1.5 line-clamp-2">
                                        {game.nama}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="absolute inset-0">
                {punyaFoto ? (
                    <ParallaxBg>
                        <img
                            src={slideItem.bgImage}
                            alt=""
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(90deg, ${WARNA.hijauTua}CC 0%, ${WARNA.hijauTua}80 35%, ${WARNA.hijauTua}33 65%, transparent 100%)`,
                            }}
                        />
                    </ParallaxBg>
                ) : (
                    <ParallaxBg>
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
                    </ParallaxBg>
                )}

                <div
                    ref={scrollRef}
                    className="relative flex flex-col h-full justify-center px-4 md:px-14 lg:px-20 py-3 md:py-14 pb-7 md:pb-16 text-center overflow-y-auto"
                >
                    {slideItem.theme === "welcome" ? (
                        <div className="flex flex-col items-center text-center">
    <h3
        className="whitespace-pre-line text-balance text-lg md:text-3xl lg:text-4xl font-bold leading-snug md:leading-tight mb-3 md:mb-4 max-w-[95%] md:max-w-3xl mx-auto"
        style={{ color: punyaFoto ? "#FFFFFF" : WARNA.hijauTua }}
    >
        {slideItem.title}
    </h3>
                            <p
                                className={`text-xs md:text-lg lg:text-xl leading-snug md:leading-relaxed max-w-[92%] md:max-w-none ${punyaFoto ? "md:max-w-md" : "max-w-3xl"}`}
                                style={{ color: punyaFoto ? "rgba(255,255,255,0.92)" : "#475569" }}
                            >
                                {slideItem.description}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center justify-center shrink-0">
                                <h3
                                    className="text-lg md:text-3xl lg:text-4xl font-bold leading-tight mb-1.5 md:mb-2 max-w-4xl"
                                    style={{ color: punyaFoto ? "#FFFFFF" : WARNA.hijauTua }}
                                >
                                    {slideItem.title}
                                </h3>
                                <p
                                    className="text-xs md:text-base lg:text-lg max-w-3xl leading-snug md:leading-relaxed"
                                    style={{ color: punyaFoto ? "rgba(255,255,255,0.92)" : "#475569" }}
                                >
                                    {slideItem.description}
                                </p>
                            </div>
                            {slideItem.points?.length > 0 && (
                                <div className="mt-2 mb-5 md:mt-5 md:mb-0 grid w-full max-w-4xl mx-auto gap-1.5 md:gap-3 md:grid-cols-2">
                                    {slideItem.points.slice(0, 2).map((point, i) => (
                                        <div key={i} className="flex items-start gap-2 rounded-lg md:rounded-2xl bg-white/85 p-2 md:p-4 text-left shadow-sm md:hidden">
                                            <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: WARNA.hijauUtama }}>
                                                {i + 1}
                                            </span>
                                            <p className="text-[10px] leading-snug text-slate-700 line-clamp-2">{point}</p>
                                        </div>
                                    ))}
                                    {slideItem.points.slice(0, 4).map((point, i) => (
                                        <div key={i} className="hidden md:flex items-start gap-3 rounded-2xl bg-white/85 p-4 text-left shadow-sm">
                                            <span className="shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: WARNA.hijauUtama }}>
                                                {i + 1}
                                            </span>
                                            <p className="text-sm leading-6 text-slate-700 line-clamp-2">{point}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    <span
                        className={`absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] flex items-center gap-1.5 md:static md:translate-x-0 md:text-sm md:mx-auto ${
                            slideItem.theme === "welcome" ? "md:absolute md:bottom- md:left-1/2 md:-translate-x-1/2" : "md:mt-6 md:mb-2"
                        }`}
                        style={{ color: punyaFoto ? "rgba(255,255,255,0.85)" : "#94a3b8" }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 md:w-3.5 md:h-3.5">
                            <path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                        {t.klikDetail}
                    </span>
                </div>
            </div>
        );
    }

    const activeItem = items[index];
    const incomingItem = incoming !== null ? items[incoming] : null;
    const punyaFotoAktif = !!items[current]?.bgImage;

    return (
        <>
            <div
                ref={wrapperRef}
                className="w-full relative z-10 h-[36vh] min-h-[270px] md:h-[60vh] md:min-h-[420px]"
            >
                <motion.div
                    className={`relative w-full h-full overflow-hidden shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md select-none touch-pan-y ${
                        items.length > 1
                            ? grabbing ? 'cursor-grabbing' : 'cursor-grab'
                            : 'cursor-pointer'
                    }`}
                    style={{ touchAction: "pan-y" }}
                    drag={items.length > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragStart={handleDragStart}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                        if (dragOccurredRef.current) return;
                        clearAutoplay();
                        setModalItem(activeItem);
                    }}
                >
                    {renderSlide(items[current], bottomScrollRef)}

                    {incomingItem && (
                        <div
                            className="absolute inset-0 transition-opacity ease-in-out will-change-[opacity]"
                            style={{
                                opacity: incomingShown ? 1 : 0,
                                transitionDuration: `${TRANSITION_MS}ms`,
                                transform: "translateZ(0)",
                                backfaceVisibility: "hidden",
                            }}
                        >
                            {renderSlide(incomingItem)}
                        </div>
                    )}

                    {items.length > 1 && (
                        <div className="absolute bottom-2 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-1 md:gap-1.5">
                            {items.map((_, i) => (
                                <MotionButton
                                    key={i}
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); goToSlide(i); }}
                                    aria-label={`Slide ${i + 1}`}
                                    className="h-1 md:h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: i === index ? 18 : 5,
                                        backgroundColor: i === index
                                            ? (punyaFotoAktif ? "#FFFFFF" : WARNA.hijauUtama)
                                            : (punyaFotoAktif ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.15)"),
                                    }}
                                    whileHover={{ scale: 1.3 }}
                                    whileTap={{ scale: 0.9 }}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            <CarouselModal item={modalItem} onClose={() => setModalItem(null)} />
        </>
    );
});



/* ========================= Halaman Katalog ========================= */

function IsiKatalog({ games, carousels, bahasa, setBahasa, initialSort }) {
    const t = useTeks();
    const [pencarian, setPencarian] = useState("");
    const [kategoriAktif, setKategoriAktif] = useState("Semua");
    const [lantaiAktif, setLantaiAktif] = useState("Semua");
    const [statusAktif, setStatusAktif] = useState("Semua");
    const [sort, setSort] = useState(initialSort || "popular");
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

    const gamePalingPopuler = useMemo(() => {
        return [...games]
            .sort((a, b) => (b.loans_count ?? 0) - (a.loans_count ?? 0))
            .slice(0, 4);
    }, [games]);

    const slidePopuler = useMemo(() => ({
        theme: "populer",
        bgImage: "https://images.unsplash.com/photo-1719494206741-79831f9f4d51?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Board Game Paling Populer",
        description: "Board game yang paling sering dipinjam di perpustakaan.",
        gamesPopuler: gamePalingPopuler, // <- data game asli, bukan cuma nama
    }), [gamePalingPopuler]);

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
        "rounded-md border border-slate-200 text-xs sm:text-sm px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B6FA8]/30";

    return (
        <motion.div
            className="min-h-screen bg-white text-[15px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div>
                <TopNavbar bahasa={bahasa} setBahasa={setBahasa} />
            </div>

            <div>
                <AnnouncementCarousel carousels={carousels} onModalChange={setModalCarouselOpen}/>
            </div>
            <div>
                <ProdukPopuler games={games} />
            </div>

            {/* Filter & sort, ala baris filter Amazon */}
            <AnimatedSection delay={0.2}>
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
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-colors"
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

                            <div className="w-px h-5 bg-slate-300" />

                            <div className="flex items-center gap-1">
                                <label className="text-xs text-slate-500 hidden sm:inline">Urutkan</label>
                                <select
                                    value={sort}
                                    onChange={(e) => {
                                        const newSort = e.target.value
                                        setSort(newSort)
                                        router.get('/katalog', { sort: newSort }, {
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true,
                                        })
                                    }}
                                    className={kelasSelect}
                                >
                                    <option value="popular">Terpopuler</option>
                                    <option value="rating">Rating Tertinggi</option>
                                    <option value="name_asc">Nama A–Z</option>
                                    <option value="name_desc">Nama Z–A</option>
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
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-colors"
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

                            <div className="flex items-center gap-1">
                                <select
                                    value={sort}
                                    onChange={(e) => {
                                        const newSort = e.target.value
                                        setSort(newSort)
                                        router.get('/katalog', { sort: newSort }, {
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true,
                                        })
                                    }}
                                    className={kelasSelect}
                                >
                                    <option value="popular">Terpopuler</option>
                                    <option value="rating">Rating Tertinggi</option>
                                    <option value="name_asc">Nama A–Z</option>
                                    <option value="name_desc">Nama Z–A</option>
                                </select>
                            </div>

                            <span className="text-xs text-slate-500 ml-auto">{filtered.length} {t.boardGame}</span>
                        </div>
                </div>
            </div>
            </div>
            </AnimatedSection>

            <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10">
                {statusAktif !== "Dipinjam" && (
                    <>
                        <Reveal>
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                {t.tersediaDipinjam} ({tersedia.length})
                            </h2>
                        </Reveal>
                        {tersedia.length > 0 ? (
                            <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr gap-5 mb-12">
                                {tersedia.map((game) => (
                                    <KartuGame key={game.id} game={game} tersedia />
                                ))}
                            </StaggerGrid>
                        ) : (
                            <Reveal>
                                <p className="text-sm text-slate-500 mb-12">
                                    {t.tidakCocok}
                                </p>
                            </Reveal>
                        )}
                    </>
                )}

                {dipinjam.length > 0 && (
                    <>
                        <Reveal>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-lg font-semibold text-slate-500">
                                    {t.sedangDipinjam} ({dipinjam.length})
                                </h2>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>
                        </Reveal>
                        <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr gap-5">
                            {dipinjam.map((game) => (
                                <KartuGame key={game.id} game={game} tersedia={false} />
                            ))}
                        </StaggerGrid>
                    </>
                )}
            </div>

            <Reveal>
                <Footer />
            </Reveal>

            {/* Floating Pinjam button */}
            <MotionLink
                href={modalCarouselOpen ? undefined : "/peminjaman/create"}
                className={`fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:w-auto z-50 inline-flex items-center justify-center gap-2 px-6 py-3.5 md:py-3 font-semibold text-white bg-sky-900 rounded-2xl md:rounded-full shadow-xl shadow-sky-900/25 ${
                    modalCarouselOpen
                        ? "pointer-events-none opacity-60"
                        : ""
                }`}
                whileHover={modalCarouselOpen ? {} : { scale: 1.04, boxShadow: "0 10px 30px -5px rgba(8, 47, 73, 0.5)" }}
                whileTap={modalCarouselOpen ? {} : { scale: 0.97 }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {t.pinjam}
            </MotionLink>
        </motion.div>
    );
}

export default function Katalog({ games, carousels, filters }) {
    const [bahasa, setBahasa] = useBahasaState();

    return (
        <BahasaContext.Provider value={TEKS[bahasa]}>
            <Head title="Katalog Board Game" />
            <IsiKatalog games={games} carousels={carousels} bahasa={bahasa} setBahasa={setBahasa} initialSort={filters?.sort} />
        </BahasaContext.Provider>
    );
}

Katalog.layout = (page) => page;