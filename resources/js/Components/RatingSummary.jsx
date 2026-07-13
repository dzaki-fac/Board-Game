export default function RatingSummary({ averageRating = 0, reviewsCount = 0, size = "sm" }) {
    const starClass = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
    const textClass = size === "lg" ? "text-sm" : "text-[11px]";
    const rating = Number(averageRating);

    if (reviewsCount === 0) {
        return (
            <span className={`${textClass} text-slate-400`}>Belum ada rating</span>
        );
    }

    const bintang = [];
    for (let i = 1; i <= 5; i++) {
        const penuh = i <= Math.floor(rating);
        const setengah = !penuh && i === Math.ceil(rating) && rating % 1 !== 0;

        bintang.push(
            <span key={i} className="relative inline-block">
                <svg viewBox="0 0 24 24" className={`${starClass} text-slate-200`} fill="currentColor">
                    <path d="M12 2.5l2.9 6.1 6.6.8-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.8L12 2.5z" />
                </svg>
                {(penuh || setengah) && (
                    <svg
                        viewBox="0 0 24 24"
                        className={`absolute inset-0 ${starClass} text-yellow-400`}
                        fill="currentColor"
                        style={setengah && !penuh ? { clipPath: "inset(0 50% 0 0)" } : undefined}
                    >
                        <path d="M12 2.5l2.9 6.1 6.6.8-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.8L12 2.5z" />
                    </svg>
                )}
            </span>
        );
    }

    return (
        <div className="inline-flex items-center gap-1.5">
            <div className="inline-flex items-center gap-0.5">{bintang}</div>
            <span className={`${textClass} font-semibold text-slate-700`}>{rating.toFixed(1)}</span>
            <span className={`${textClass} text-slate-400`}>({reviewsCount.toLocaleString("id-ID")})</span>
        </div>
    );
}
