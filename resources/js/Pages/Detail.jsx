import { useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Footer from "../Components/Footer";
import ReviewSection from "../Components/ReviewSection";
import RatingSummary from "../Components/RatingSummary";
import TopNavbar from "../Components/TopNavbar";
import GaleriGambar from "../Components/GaleriGambar";

import TautanEksternal from "../Components/TautanEksternal";
import SeksiGameSerupa from "../Components/SeksiGameSerupa";
import { WARNA, warnaKategori } from "../Components/theme";
import { BahasaContext, TEKS, useTeks, useBahasaState } from "../Components/BahasaContext";
import { IkonPemain, IkonJam, IkonRak, IkonLabel, IkonPanahBawah, IkonPlay, IkonBuku } from "../Components/icons";
import { DESKRIPSI_EN } from "../Components/deskripsiEn";
import { formatPemain, formatDurasi, parseKomponenNama } from "../Components/format";

function IsiDetail({ game, gameSerupa, reviews, avgRating, totalReviews, ratingDistribution, selectedReviewRating, bahasa, setBahasa }) {
    const t = useTeks();
    const [warna] = warnaKategori(game.kategori);
    const tersedia = game.available_copies > 0;
    const daftarKomponen = useMemo(() => game.komponen ?? [], [game.komponen]);
    const [tampilkanKomponen, setTampilkanKomponen] = useState(false);
    const deskripsiTampil = bahasa === "EN"
        ? (DESKRIPSI_EN[game.nama] ?? game.deskripsi)
        : game.deskripsi;

    return (
        <div className="min-h-screen bg-white text-[15px]">
            <TopNavbar bahasa={bahasa} setBahasa={setBahasa} />

            <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
                <Link
                    href="/katalog"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 rounded-full px-4 py-2 transition-colors mb-4"
                    style={{ color: WARNA.hijauUtama }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M19 12H5" />
                        <path d="m12 19-7-7 7-7" />
                    </svg>
                    {t.kembali}
                </Link>

                <div className="bg-white rounded-3xl overflow-hidden ring-1 ring-slate-100">
                    <div className="grid md:grid-cols-2 gap-0 md:items-start">
                        <GaleriGambar game={game} warna={warna} />

                        <div className="p-8 md:p-12 flex flex-col">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-1">
                                {game.nama}
                            </h1>
                            <p className="text-sm text-slate-500 mb-4">{game.penerbit}</p>

                            {(() => {
                                const kategoriArr = Array.isArray(game.kategori) && game.kategori.length > 0
                                    ? game.kategori
                                    : (game.kategori ? [game.kategori] : []);
                                if (kategoriArr.length === 0) return null;
                                return (
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {kategoriArr.map((k, i) => {
                                            const [kw, kb] = warnaKategori(k);
                                            return (
                                                <span
                                                    key={i}
                                                    className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-full"
                                                    style={{ backgroundColor: kb, color: kw }}
                                                >
                                                    {t.kategoriMap?.[k] || k}
                                                </span>
                                            );
                                        })}
                                    </div>
                                );
                            })()}

                            <div className="mb-4">
                                <RatingSummary
                                    averageRating={avgRating}
                                    reviewsCount={totalReviews}
                                    size="lg"
                                />
                            </div>

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

                            {deskripsiTampil && (
                                <div className="mb-5">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-1.5">
                                        {t.deskripsiGame}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                                        {deskripsiTampil}
                                    </p>
                                </div>
                            )}

                            {(game.link_tutorial || game.link_panduan) && (
                                <div className="flex flex-wrap gap-2 mb-5">
                                    <TautanEksternal link={game.link_tutorial} warna={warna} label={t.tontonTutorial} ikon={IkonPlay} />
                                    <TautanEksternal link={game.link_panduan} warna={warna} label={t.panduanBermain} ikon={IkonBuku} />
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
                                                    <span className="font-medium capitalize">{parseKomponenNama(item.nama, bahasa)}</span>
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
    const [bahasa, setBahasa] = useBahasaState();

    return (
        <BahasaContext.Provider value={TEKS[bahasa]}>
            <Head title={game ? game.nama : "Detail Board Game"} />
            <IsiDetail game={game} gameSerupa={gameSerupa} reviews={reviews} avgRating={avgRating} totalReviews={totalReviews} ratingDistribution={ratingDistribution} selectedReviewRating={selectedReviewRating} bahasa={bahasa} setBahasa={setBahasa} />
        </BahasaContext.Provider>
    );
}

Detail.layout = (page) => page;