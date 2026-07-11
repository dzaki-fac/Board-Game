export default function RatingDetail({ averageRating = 0, reviewsCount = 0, ratingDistribution = [] }) {
    if (reviewsCount === 0) return null;

    const rating = Number(averageRating);

    return (
        <div className="flex flex-col md:flex-row items-start gap-6 py-4">
            <div className="text-center md:text-left shrink-0">
                <div className="text-4xl md:text-5xl font-bold text-slate-800 leading-none">{rating.toFixed(1)}</div>
                <div className="inline-flex items-center gap-0.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map((i) => {
                        const penuh = i <= Math.floor(rating);
                        const setengah = !penuh && i === Math.ceil(rating) && rating % 1 !== 0;
                        return (
                            <span key={i} className="relative inline-block w-4 h-4 md:w-5 md:h-5">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 text-slate-200" fill="currentColor">
                                    <path d="M12 2.5l2.9 6.1 6.6.8-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.8L12 2.5z" />
                                </svg>
                                {(penuh || setengah) && (
                                    <svg viewBox="0 0 24 24" className="absolute inset-0 w-4 h-4 md:w-5 md:h-5 text-yellow-400" fill="currentColor"
                                        style={setengah && !penuh ? { clipPath: "inset(0 50% 0 0)" } : undefined}>
                                        <path d="M12 2.5l2.9 6.1 6.6.8-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.8L12 2.5z" />
                                    </svg>
                                )}
                            </span>
                        );
                    })}
                </div>
                <div className="text-sm text-slate-500 mt-1">{reviewsCount.toLocaleString("id-ID")} review</div>
            </div>

            <div className="flex-1 w-full space-y-1.5">
                {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-6 text-right text-slate-600 shrink-0 tabular-nums">{star}</span>
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-yellow-400 shrink-0" fill="currentColor">
                            <path d="M12 2.5l2.9 6.1 6.6.8-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.8L12 2.5z" />
                        </svg>
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <span className="w-10 text-right text-xs text-slate-500 tabular-nums">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}