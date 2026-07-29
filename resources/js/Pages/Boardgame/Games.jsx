import { useState, useCallback } from "react"
import { Link, router, usePage } from "@inertiajs/react"
import { baseUrl } from '@/lib/path';

export default function Games({ boardgames }) {
    const { data: games, links, from, to, total } = boardgames
    const { query } = usePage().props
    const [search, setSearch] = useState(query.search || '')
    const [sortField, setSortField] = useState(query.sortField || 'nama')
    const [sortDir, setSortDir] = useState(query.sortDir || 'asc')
    const [filterLantai, setFilterLantai] = useState(query.filterLantai || '')
    const [filterBox, setFilterBox] = useState(query.filterBox || '')

    const go = useCallback((overrides = {}) => {
        const params = {
            search: overrides.search ?? (search || undefined),
            sortField: overrides.sortField ?? sortField,
            sortDir: overrides.sortDir ?? sortDir,
            filterLantai: overrides.filterLantai ?? (filterLantai || undefined),
            filterBox: overrides.filterBox ?? (filterBox || undefined),
            page: overrides.page ?? undefined,
        }
        router.get(baseUrl('/admin/games'), params, { preserveState: true, replace: true })
    }, [search, sortField, sortDir, filterLantai, filterBox])

    const toggleSort = (field) => {
        const newDir = sortField === field && sortDir === 'asc' ? 'desc' : 'asc'
        setSortField(field)
        setSortDir(newDir)
        go({ sortField: field, sortDir: newDir, page: 1 })
    }

    const sortArrow = (field) => {
        if (sortField !== field) return ''
        return sortDir === 'asc' ? ' ▲' : ' ▼'
    }

    const handleSearch = (e) => {
        const v = e.target.value
        setSearch(v)
        go({ search: v, page: 1 })
    }

    const setLantai = (e) => {
        const v = e.target.value
        setFilterLantai(v)
        go({ filterLantai: v, page: 1 })
    }

    const setBox = (e) => {
        const v = e.target.value
        setFilterBox(v)
        go({ filterBox: v, page: 1 })
    }

    const reset = () => {
        setSearch('')
        setFilterLantai('')
        setFilterBox('')
        go({ search: '', filterLantai: '', filterBox: '', page: 1 })
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-900">Board Games</h1>
                <Link href={baseUrl('/admin/games/create')} className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-sm gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Tambah Board Game
                </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-50 max-w-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Cari nama, kode, atau penerbit..."
                        className="input input-bordered input-sm pl-9 w-full"
                    />
                </div>

                <select value={filterLantai} onChange={setLantai} className="select select-bordered select-sm w-45">
                    <option value="">Semua Lantai</option>
                    <option value="1">Lt 1</option>
                    <option value="2">Lt 2</option>
                    <option value="3">Lt 3</option>
                </select>

                <select value={filterBox} onChange={setBox} className="select select-bordered select-sm w-32">
                    <option value="">Semua Box</option>
                    {[1,2,3,4,5,6,7].map(b => (
                        <option key={b} value={b}>Box {b}</option>
                    ))}
                </select>

                {(search || filterLantai || filterBox) && (
                    <button onClick={() => { setSearch(''); setFilterLantai(''); setFilterBox('') }} className="btn btn-ghost btn-xs text-red-500">
                        Atur Ulang
                    </button>
                )}
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className="bg-slate-800 text-slate-200 text-sm uppercase">
                            <th className="px-4 py-3 w-24 text-center">Aksi</th>
                            <th className="px-4 py-3 text-center">Foto</th>
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
                        {games.map((game) => (
                            <tr key={game.id} className="hover:bg-slate-50 text-sm">
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <Link href={baseUrl(`/admin/games/${game.id}`)} className="btn btn-ghost btn-xs btn-square text-slate-500 hover:text-slate-800 hover:bg-slate-100" title="Detail">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </Link>
                                        <Link href={baseUrl(`/admin/games/${game.id}/edit`)} className="btn btn-ghost btn-xs btn-square text-blue-600 hover:text-blue-800 hover:bg-blue-50" title="Ubah">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </Link>
                                        <Link href={baseUrl(`/admin/games/${game.id}`)} method="delete" as="button" className="btn btn-ghost btn-xs btn-square text-red-600 hover:text-red-800 hover:bg-red-50" title="Hapus"
                                            onClick={(e) => { if (!confirm('Yakin ingin menghapus board game ini?')) e.preventDefault() }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </Link>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {game.link_foto?.length > 0 ? (
                                        <div className="flex items-center justify-center">
                                            <img
                                                src={baseUrl(game.link_foto[0])}
                                                alt={game.nama}
                                                className="w-10 h-10 object-cover rounded-md border border-slate-200"
                                                onError={(e) => { e.target.style.display = 'none' }}
                                            />
                                            {game.link_foto.length > 1 && (
                                                <span className="text-[10px] text-slate-400 ml-1">+{game.link_foto.length - 1}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-slate-300 text-xs">-</span>
                                    )}
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
                                <td className="px-4 py-3 max-w-xs truncate text-slate-500" title={game.komponen?.map(k => `${k.jumlah} ${k.nama}`).join(', ')}>{game.komponen?.length ? game.komponen.map(k => `${k.jumlah} ${k.nama}`).join(', ') : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {games.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <p className="text-lg">Tidak ada board game ditemukan.</p>
                </div>
            )}

            {/* Pagination */}
            {links.length > 3 && (
                <div className="flex justify-center mt-6 mb-4">
                    <div className="flex items-center gap-1">
                        {links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                preserveState
                                replace
                                className={`btn btn-sm min-w-9 ${link.active ? 'bg-[#0E4A73] text-white border-none' : 'btn-ghost text-gray-600'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
