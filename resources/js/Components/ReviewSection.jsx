import { useState } from "react";
import { router } from "@inertiajs/react";
import { StarRatingInput, StarRatingDisplay } from "./StarRating";
import RatingSummary from "./RatingSummary";
import RatingDetail from "./RatingDetail";

const FILTERS = [
    { label: "Semua", value: "all" },
    { label: "5", value: "5" },
    { label: "4", value: "4" },
    { label: "3", value: "3" },
    { label: "2", value: "2" },
    { label: "1", value: "1" },
];

export default function ReviewSection({ boardgameId, reviews = { data: [] }, avgRating, totalReviews, ratingDistribution = [], selectedReviewRating = "all" }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

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
        <div className="mt-8 rounded-3xl p-6 md:p-8" style={{ backgroundColor: "#FAF7F2" }}>
            <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: "#2F6F62" }} />
                <h2 className="text-xl font-bold text-slate-800">Review</h2>
            </div>

            {totalReviews > 0 && (
                <>
                    <div className="ml-3.5 mb-2">
                        <RatingSummary averageRating={avgRating} reviewsCount={totalReviews} size="lg" />
                    </div>
                    <div className="ml-3.5 mb-5 border-b border-slate-200">
                        <RatingDetail
                            averageRating={avgRating}
                            reviewsCount={totalReviews}
                            ratingDistribution={ratingDistribution}
                        />
                    </div>
                </>
            )}

            {/* Form Review */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Tulis Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Rating</label>
                        <StarRatingInput value={rating} onChange={setRating} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Komentar</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Bagaimana pendapat Anda tentang board game ini?"
                            rows={3}
                            maxLength={1000}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-colors resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting || !rating}
                        className="w-full rounded-full py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                        style={{ backgroundColor: submitting || !rating ? "#94a3b8" : "#2F6F62" }}
                        onMouseOver={(e) => {
                            if (!submitting && rating) e.currentTarget.style.backgroundColor = "#255A4F";
                        }}
                        onMouseOut={(e) => {
                            if (!submitting && rating) e.currentTarget.style.backgroundColor = "#2F6F62";
                        }}
                    >
                        {submitting ? "Mengirim..." : "Kirim Review"}
                    </button>
                </form>
            </div>

            {/* Filter Rating */}
            {totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => handleFilterClick(f.value)}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                                selectedReviewRating === f.value
                                    ? "bg-emerald-700 text-white border-emerald-700"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-emerald-50"
                            }`}
                        >
                            {f.label === "all" ? f.label : `${f.label} ★`}
                        </button>
                    ))}
                </div>
            )}

            {/* Daftar Review */}
            {reviewItems.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">Belum ada review untuk board game ini.</p>
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
                            <div key={review.id ?? i} className="bg-white rounded-2xl border border-slate-100 p-5">
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

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => handlePageClick(pagination.links?.[0]?.url)}
                        disabled={!pagination.links?.[0]?.url}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    {pagination.links?.slice(1, -1).map((link, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageClick(link.url)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                link.active
                                    ? "bg-emerald-700 text-white border-emerald-700"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-emerald-50"
                            }`}
                        >
                            {link.label}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageClick(pagination.links?.[pagination.links.length - 1]?.url)}
                        disabled={!pagination.links?.[pagination.links.length - 1]?.url}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}