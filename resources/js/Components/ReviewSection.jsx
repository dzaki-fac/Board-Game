import { useState } from "react";
import { router } from "@inertiajs/react";
import { StarRatingInput, StarRatingDisplay } from "./StarRating";
import RatingSummary from "./RatingSummary";
import RatingDetail from "./RatingDetail";
import { IkonBintang } from "./icons";
import { WARNA } from "./theme";
import { useTeks } from "./BahasaContext";

export default function ReviewSection({ boardgameId, reviews = { data: [] }, avgRating, totalReviews, ratingDistribution = [], selectedReviewRating = "all" }) {
    const t = useTeks();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const FILTERS = [
        { label: t.semua, value: "all" },
        { label: "5", value: "5" },
        { label: "4", value: "4" },
        { label: "3", value: "3" },
        { label: "2", value: "2" },
        { label: "1", value: "1" },
    ];

    const reviewItems = Array.isArray(reviews) ? reviews : (reviews?.data || []);
    const pagination = !Array.isArray(reviews) ? reviews : null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        router.post(
            `/katalog/${boardgameId}/reviews`,
            { rating, comment },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRating(0);
                    setComment("");
                    setSubmitting(false);
                },
                onError: () => setSubmitting(false),
            }
        );
    };

    const handleFilterClick = (value) => {
        router.get(
            `/katalog/${boardgameId}`,
            { review_rating: value, review_page: 1 },
            { preserveScroll: true }
        );
    };

    const handlePageClick = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true });
    };

    return (
        <div className="mt-8 rounded-3xl ring-1 ring-slate-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-5">{t.reviewHeading}</h2>

            {totalReviews > 0 && (
                <div className="mb-6 border-b border-slate-100">
                    <RatingSummary averageRating={avgRating} reviewsCount={totalReviews} size="lg" />
                    <RatingDetail
                        averageRating={avgRating}
                        reviewsCount={totalReviews}
                        ratingDistribution={ratingDistribution}
                    />
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">{t.tulisReview}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">{t.ratingLabel}</label>
                        <StarRatingInput value={rating} onChange={setRating} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">{t.komentarLabel}</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Bagaimana pendapat Anda tentang board game ini?"
                            rows={3}
                            maxLength={1000}
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white outline-none transition-all resize-none focus:border-[#0E4A73] focus:ring-2 focus:ring-[#0E4A73]/10"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting || !rating}
                        className="w-full rounded-full py-2.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: submitting || !rating ? "#CBD5E1" : WARNA.hijauUtama,
                        }}
                        onMouseOver={(e) => {
                            if (!submitting && rating) e.currentTarget.style.backgroundColor = WARNA.hijauHover;
                        }}
                        onMouseOut={(e) => {
                            if (!submitting && rating) e.currentTarget.style.backgroundColor = WARNA.hijauUtama;
                        }}
                    >
                        {submitting ? t.mengirim : t.kirimReview}
                    </button>
                </form>
            </div>

            {totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => handleFilterClick(f.value)}
                            className="px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors"
                            style={{
                                backgroundColor: selectedReviewRating === f.value ? WARNA.hijauUtama : "white",
                                color: selectedReviewRating === f.value ? "white" : "#475569",
                                border: `1.5px solid ${selectedReviewRating === f.value ? WARNA.hijauUtama : "#E2E8F0"}`,
                            }}
                            onMouseOver={(e) => {
                                if (selectedReviewRating !== f.value) {
                                    e.currentTarget.style.borderColor = WARNA.hijauUtama;
                                }
                            }}
                            onMouseOut={(e) => {
                                if (selectedReviewRating !== f.value) {
                                    e.currentTarget.style.borderColor = "#E2E8F0";
                                }
                            }}
                        >
                            {f.value === "all" ? f.label : `${f.label} ★`}
                        </button>
                    ))}
                </div>
            )}

            {reviewItems.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-sm text-slate-500">{t.belumAdaReview}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviewItems.map((review, i) => {
                        const tanggal = review.created_at
                            ? new Date(review.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "";
                        return (
                            <div key={review.id ?? i} className="rounded-2xl ring-1 ring-slate-100 p-5">
                                <div className="flex items-center justify-between">
                                    <StarRatingDisplay rating={review.rating} />
                                    {tanggal && (
                                        <span className="text-[11px] text-slate-400">{tanggal}</span>
                                    )}
                                </div>
                                {review.comment && (
                                    <p className="text-sm text-slate-700 mt-2 leading-relaxed">{review.comment}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => handlePageClick(pagination.links?.[0]?.url)}
                        disabled={!pagination.links?.[0]?.url}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg ring-1 ring-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    {pagination.links?.slice(1, -1).map((link, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageClick(link.url)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                            style={{
                                backgroundColor: link.active ? WARNA.hijauUtama : "white",
                                color: link.active ? "white" : "#475569",
                                border: `1px solid ${link.active ? WARNA.hijauUtama : "#E2E8F0"}`,
                            }}
                        >
                            {link.label}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageClick(pagination.links?.[pagination.links.length - 1]?.url)}
                        disabled={!pagination.links?.[pagination.links.length - 1]?.url}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg ring-1 ring-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
