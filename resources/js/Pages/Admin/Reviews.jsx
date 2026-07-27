import { useCallback, useEffect, useState } from "react"
import { Link, router, usePage } from "@inertiajs/react"
import { StarRatingDisplay } from "../../Components/StarRating"

const RATING_OPTIONS = [
    { label: "All Ratings", value: "" },
    { label: "5 Stars", value: "5" },
    { label: "4 Stars", value: "4" },
    { label: "3 Stars", value: "3" },
    { label: "2 Stars", value: "2" },
    { label: "1 Star", value: "1" },
]

const DATE_OPTIONS = [
    { label: "All Dates", value: "" },
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "7_days" },
    { label: "Last 30 Days", value: "30_days" },
    { label: "Custom Range", value: "custom" },
]

const SORT_OPTIONS = [
    { label: "Newest first", value: "newest" },
    { label: "Oldest first", value: "oldest" },
    { label: "Highest rating first", value: "highest_rating" },
    { label: "Lowest rating first", value: "lowest_rating" },
    { label: "Game name A-Z", value: "name_asc" },
    { label: "Game name Z-A", value: "name_desc" },
]

export default function Reviews({ reviews, filters }) {
    const { data: items = [], links = [], from = null, to = null, total = 0 } = reviews ?? {}
    const { flash, error } = usePage().props
    const [selectedReview, setSelectedReview] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [confirmId, setConfirmId] = useState(null)

    const [search, setSearch] = useState(filters?.search || "")
    const [rating, setRating] = useState(filters?.rating || "")
    const [dateFilter, setDateFilter] = useState(filters?.date_filter || "")
    const [dateFrom, setDateFrom] = useState(filters?.date_from || "")
    const [dateTo, setDateTo] = useState(filters?.date_to || "")
    const [sort, setSort] = useState(filters?.sort || "newest")

    useEffect(() => {
        if (!selectedReview) return
        const handler = (e) => { if (e.key === "Escape") setSelectedReview(null) }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [selectedReview])

    useEffect(() => {
        if (selectedReview) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => { document.body.style.overflow = "" }
    }, [selectedReview])

    const go = useCallback((overrides = {}) => {
        const params = {
            search: overrides.search ?? (search || undefined),
            rating: overrides.rating ?? (rating || undefined),
            date_filter: overrides.date_filter ?? (dateFilter || undefined),
            date_from: overrides.date_from ?? (dateFrom || undefined),
            date_to: overrides.date_to ?? (dateTo || undefined),
            sort: overrides.sort ?? sort,
            page: overrides.page ?? undefined,
        }
        router.get("/admin/reviews", params, { preserveState: true, replace: true })
    }, [search, rating, dateFilter, dateFrom, dateTo, sort])

    const handleSearch = (e) => {
        const v = e.target.value
        setSearch(v)
        go({ search: v, page: 1 })
    }

    const handleDelete = (reviewId) => {
        if (deleting) return
        setDeleting(reviewId)
        router.delete(`/admin/reviews/${reviewId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleting(null)
                setConfirmId(null)
            },
            onError: () => setDeleting(null),
        })
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "-"
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const hasActiveFilters = search || rating || dateFilter || sort !== "newest"

    const resetFilters = () => {
        setSearch("")
        setRating("")
        setDateFilter("")
        setDateFrom("")
        setDateTo("")
        setSort("newest")
        go({ search: "", rating: "", date_filter: "", date_from: "", date_to: "", sort: "newest", page: 1 })
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-900">Review Management</h1>
            </div>

            {flash && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
                    {flash}
                </div>
            )}

            {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-50 max-w-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by board game name..."
                        className="input input-bordered input-sm pl-9 w-full"
                    />
                </div>

                <select value={rating} onChange={(e) => { setRating(e.target.value); go({ rating: e.target.value, page: 1 }) }} className="select select-bordered select-sm w-36">
                    {RATING_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); go({ date_filter: e.target.value, page: 1 }) }} className="select select-bordered select-sm w-40">
                    {DATE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                {dateFilter === "custom" && (
                    <>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => { setDateFrom(e.target.value); go({ date_from: e.target.value, page: 1 }) }}
                            className="input input-bordered input-sm w-40"
                            placeholder="From"
                        />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => { setDateTo(e.target.value); go({ date_to: e.target.value, page: 1 }) }}
                            className="input input-bordered input-sm w-40"
                            placeholder="To"
                        />
                    </>
                )}

                <select value={sort} onChange={(e) => { setSort(e.target.value); go({ sort: e.target.value, page: 1 }) }} className="select select-bordered select-sm w-44">
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                {hasActiveFilters && (
                    <button onClick={resetFilters} className="btn btn-ghost btn-xs text-red-500">
                        Reset
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <div className="rounded-xl bg-white shadow-sm">
                    <div className="text-center py-12 text-slate-400">
                        <p className="text-lg">No reviews found.</p>
                    </div>
                </div>
            ) : (
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-800 text-slate-200 text-sm uppercase">
                            <th className="px-4 py-3 w-28 text-center">Action</th>
                            <th className="px-4 py-3 text-left">Board Game</th>
                            <th className="px-4 py-3 text-center">Rating</th>
                            <th className="px-4 py-3 text-left">Review Comment</th>
                            <th className="px-4 py-3 text-left">Review Date</th>
                            <th className="px-4 py-3 text-left">Reviewer</th>
                            <th className="px-4 py-3 text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((review, idx) => (
                            <tr key={review.id} className={`text-sm ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100 transition-colors`}>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => setSelectedReview(review)}
                                            className="btn btn-ghost btn-xs btn-square text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                            title="View Details"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => setConfirmId(review.id)}
                                            className="btn btn-ghost btn-xs btn-square text-red-600 hover:text-red-800 hover:bg-red-50"
                                            title="Delete review"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-900">
                                    {review.board_game?.nama || "-"}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <StarRatingDisplay rating={review.rating} />
                                </td>
                                <td className="px-4 py-3 max-w-xs text-slate-600">
                                    <div className="truncate" title={review.comment || ""}>
                                        {review.comment || "-"}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                                    {formatDate(review.created_at)}
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                    {review.loan ? (
                                        <div>
                                            <div className="text-xs font-medium">{review.loan.borrower_name}</div>
                                            <div className="text-[10px] text-slate-400">{review.loan.borrower_nim}</div>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 text-xs">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                                    {formatDate(review.created_at)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {reviews?.meta?.last_page > 1 && (
                    <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between">
                        <p className="text-xs text-slate-400">Showing {from}-{to} of {total}</p>
                        <div className="flex items-center gap-1">
                            {links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || "#"}
                                    preserveState
                                    replace
                                    className={`btn btn-xs ${link.active ? "bg-[#0E4A73] text-white" : "btn-ghost"} ${!link.url ? "pointer-events-none opacity-40" : ""}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            )}

            {confirmId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirm Deletion</h3>
                        <p className="text-sm text-slate-600 mb-6">
                            Are you sure you want to delete this review? This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setConfirmId(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                                disabled={deleting !== null}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(confirmId)}
                                disabled={deleting !== null}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deleting === confirmId ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedReview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedReview(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="review-detail-title"
                >
                    <div
                        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h2 id="review-detail-title" className="text-lg font-semibold text-slate-900">
                                Review Details
                            </h2>
                            <button
                                onClick={() => setSelectedReview(null)}
                                className="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-slate-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                                <span className="text-slate-500 whitespace-nowrap">Review ID</span>
                                <span className="text-slate-900 font-medium">#{selectedReview.id}</span>

                                <span className="text-slate-500 whitespace-nowrap">Board Game</span>
                                <span className="text-slate-900">{selectedReview.board_game?.nama || "-"}</span>

                                <span className="text-slate-500 whitespace-nowrap">Rating (numeric)</span>
                                <span className="text-slate-900 font-medium">{selectedReview.rating}/5</span>

                                <span className="text-slate-500 whitespace-nowrap">Rating (stars)</span>
                                <span className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${star <= selectedReview.rating ? "text-amber-400" : "text-slate-300"}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                    ))}
                                </span>

                                {selectedReview.loan && (
                                    <>
                                        <span className="text-slate-500 whitespace-nowrap">Reviewer Name</span>
                                        <span className="text-slate-900">{selectedReview.loan.borrower_name}</span>

                                        <span className="text-slate-500 whitespace-nowrap">Reviewer NIM</span>
                                        <span className="text-slate-900">{selectedReview.loan.borrower_nim}</span>
                                    </>
                                )}

                                <span className="text-slate-500 whitespace-nowrap">Review Date</span>
                                <span className="text-slate-900">{formatDate(selectedReview.created_at)}</span>

                                <span className="text-slate-500 whitespace-nowrap">Created At</span>
                                <span className="text-slate-900">{formatDate(selectedReview.created_at)}</span>

                                <span className="text-slate-500 whitespace-nowrap">Updated At</span>
                                <span className="text-slate-900">{selectedReview.updated_at ? formatDate(selectedReview.updated_at) : "-"}</span>
                            </div>

                            <div>
                                <span className="text-sm text-slate-500 block mb-1">Review Comment</span>
                                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-800 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                                    {selectedReview.comment || "-"}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200">
                            <button
                                onClick={() => setSelectedReview(null)}
                                className="px-5 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
