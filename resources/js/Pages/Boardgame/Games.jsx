import { useState, useMemo } from "react"
import { Link } from "@inertiajs/react"

export default function Games({ boardgames }) {
    const [search, setSearch] = useState('')
    const [sortField, setSortField] = useState('nama')
    const [sortDir, setSortDir] = useState('asc')
    const [filterLantai, setFilterLantai] = useState('')
    const [filterBox, setFilterBox] = useState('')
    const [penerbitList] = useState(() => [...new Set(boardgames.map(g => g.penerbit).filter(Boolean))])

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDir('asc')
        }
    }

    const sortArrow = (field) => {
        if (sortField !== field) return ''
        return sortDir === 'asc' ? ' ▲' : ' ▼'
    }

    const filtered = useMemo(() => {
        let items = [...boardgames]

        if (search.trim()) {
            const q = search.toLowerCase()
            items = items.filter(g =>
                g.nama.toLowerCase().includes(q) ||
                g.kode.toLowerCase().includes(q) ||
                (g.penerbit && g.penerbit.toLowerCase().includes(q))
            )
        }
        if (filterLantai) items = items.filter(g => g.lantai === Number(filterLantai))
        if (filterBox) items = items.filter(g => g.box === Number(filterBox))

        items.sort((a, b) => {
            let va = a[sortField]
            let vb = b[sortField]
            if (typeof va === 'string') va = va.toLowerCase()
            if (typeof vb === 'string') vb = vb.toLowerCase()
            if (va < vb) return sortDir === 'asc' ? -1 : 1
            if (va > vb) return sortDir === 'asc' ? 1 : -1
            return 0
        })

        return items
    }, [boardgames, search, sortField, sortDir, filterLantai, filterBox])

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-900">Board Games</h1>
                <Link href="/games/create" className="btn bg-blue-600 hover:bg-blue-700 text-white border-none btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Game
                </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama, kode, atau penerbit..."
                        className="input input-bordered input-sm pl-9 w-full"
                    />
                </div>

                <select value={filterLantai} onChange={(e) => setFilterLantai(e.target.value)} className="select select-bordered select-sm w-45">
                    <option value="">Semua Lantai</option>
                    <option value="1">Lt 1</option>
                    <option value="2">Lt 2</option>
                    <option value="3">Lt 3</option>
                </select>

                <select value={filterBox} onChange={(e) => setFilterBox(e.target.value)} className="select select-bordered select-sm w-32">
                    <option value="">Semua Box</option>
                    {[1,2,3,4,5,6,7].map(b => (
                        <option key={b} value={b}>Box {b}</option>
                    ))}
                </select>

                {(search || filterLantai || filterBox) && (
                    <button onClick={() => { setSearch(''); setFilterLantai(''); setFilterBox('') }} className="btn btn-ghost btn-xs text-red-500">
                        Reset
                    </button>
                )}
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className="bg-slate-800 text-slate-200 text-sm uppercase">
                            <th className="px-4 py-3 w-24 text-center">Actions</th>
                            <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => toggleSort('kode')}>Kode{sortArrow('kode')}</th>
                            <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => toggleSort('box')}>Box{sortArrow('box')}</th>
                            <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => toggleSort('nama')}>Nama{sortArrow('nama')}</th>
                            <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => toggleSort('penerbit')}>Penerbit{sortArrow('penerbit')}</th>
                            <th className="px-4 py-3 text-center cursor-pointer select-none hover:text-white" onClick={() => toggleSort('jumlah')}>Jumlah{sortArrow('jumlah')}</th>
                            <th className="px-4 py-3 text-center">Satuan</th>
                            <th className="px-4 py-3 text-center cursor-pointer select-none hover:text-white" onClick={() => toggleSort('lantai')}>Lantai{sortArrow('lantai')}</th>
                            <th className="px-4 py-3">Komponen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((game) => (
                            <tr key={game.id} className="hover:bg-slate-50 text-sm">
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <Link href={`/games/${game.id}/edit`} className="btn btn-ghost btn-xs btn-square text-blue-600 hover:text-blue-800 hover:bg-blue-50" title="Edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </Link>
                                        <Link href={`/games/${game.id}`} method="delete" as="button" className="btn btn-ghost btn-xs btn-square text-red-600 hover:text-red-800 hover:bg-red-50" title="Hapus"
                                            onClick={(e) => { if (!confirm('Yakin ingin menghapus board game ini?')) e.preventDefault() }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </Link>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs">{game.kode}</td>
                                <td className="px-4 py-3">{game.box}</td>
                                <td className="px-4 py-3 font-medium text-slate-900">{game.nama}</td>
                                <td className="px-4 py-3 text-slate-600">{game.penerbit}</td>
                                <td className="px-4 py-3 text-center">{game.jumlah}</td>
                                <td className="px-4 py-3 text-center">{game.satuan}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className="badge badge-ghost badge-sm">Lt {game.lantai}</span>
                                </td>
                                <td className="px-4 py-3 max-w-xs truncate text-slate-500" title={game.komponen}>{game.komponen}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <p className="text-lg">Tidak ada board game ditemukan.</p>
                </div>
            )}

            <p className="text-xs text-slate-400 mt-2">{filtered.length} dari {boardgames.length} board game</p>
        </div>
    )
}
