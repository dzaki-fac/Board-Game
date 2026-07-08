import { Head, Link } from "@inertiajs/react"

export default function Index({ games }) {
    return (
        <>
            <Head title="Board Games" />

            <div className="p-4 lg:p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Board Games</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        All board games in the collection
                    </p>
                </div>

                <div className="card bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-3 font-medium">No</th>
                                        <th className="px-6 py-3 font-medium">Name</th>
                                        <th className="px-6 py-3 font-medium">Total Copies</th>
                                        <th className="px-6 py-3 font-medium">Available</th>
                                        <th className="px-6 py-3 font-medium">Floor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {games.data.map((game, index) => (
                                        <tr key={game.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {(games.current_page - 1) * games.per_page + index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900">{game.nama}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{game.jumlah}</td>
                                            <td className="px-6 py-4">
                                                <span className={`badge badge-sm ${game.available_copies > 0 ? 'badge-success' : 'badge-error'}`}>
                                                    {game.available_copies}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                Lt {game.lantai}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {games.links && games.links.length > 3 && (
                            <div className="flex items-center justify-center gap-1 px-6 py-4 border-t border-gray-100">
                                {games.links.map((link, i) =>
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveScroll
                                            className={`btn btn-sm min-w-9 ${link.active ? 'btn-primary' : 'btn-ghost text-gray-600'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="btn btn-sm btn-ghost min-w-9 text-gray-300 pointer-events-none"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
