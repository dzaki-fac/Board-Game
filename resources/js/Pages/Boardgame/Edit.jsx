import { useState } from "react"
import { Link, useForm } from "@inertiajs/react"

function parseKomponen(text) {
    if (!text) return [{ jumlah: '1', nama: '' }]
    return text.split(',').map(item => {
        item = item.trim()
        const match = item.match(/^(\d+)\s+(.+)$/)
        if (match) return { jumlah: match[1], nama: match[2] }
        return { jumlah: '1', nama: item }
    })
}

function toKomponenString(items) {
    return items.map(item => `${item.jumlah} ${item.nama}`).join(', ')
}

export default function Edit({ boardgame }) {
    const { data, setData, put, processing, errors } = useForm({
        kode: boardgame.kode,
        box: boardgame.box,
        nama: boardgame.nama,
        penerbit: boardgame.penerbit ?? '',
        jumlah: boardgame.jumlah,
        satuan: boardgame.satuan,
        link_foto: boardgame.link_foto ?? [],
        lantai: boardgame.lantai,
        komponen: boardgame.komponen ?? '',
        barang_hilang: boardgame.barang_hilang ?? [],
    })

    const [komponenList, setKomponenList] = useState(parseKomponen(boardgame.komponen))
    const [linkFotoList, setLinkFotoList] = useState(boardgame.link_foto?.length ? boardgame.link_foto : [''])
    const [barangHilangList, setBarangHilangList] = useState(boardgame.barang_hilang?.length ? boardgame.barang_hilang.map(b => typeof b === 'string' ? { jumlah: '1', nama: b } : b) : [])

    const updateLinkFoto = (index, value) => {
        const updated = linkFotoList.map((item, i) => i === index ? value : item)
        setLinkFotoList(updated)
        setData('link_foto', updated.filter(u => u.trim()))
    }

    const addLinkFoto = () => {
        setLinkFotoList([...linkFotoList, ''])
    }

    const removeLinkFoto = (index) => {
        const updated = linkFotoList.filter((_, i) => i !== index)
        setLinkFotoList(updated)
        setData('link_foto', updated.filter(u => u.trim()))
    }

    const updateBarangHilang = (index, field, value) => {
        const updated = barangHilangList.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        )
        setBarangHilangList(updated)
        setData('barang_hilang', updated.filter(b => b.nama.trim()))
    }

    const addBarangHilang = () => {
        setBarangHilangList([...barangHilangList, { jumlah: '1', nama: '' }])
    }

    const removeBarangHilang = (index) => {
        const updated = barangHilangList.filter((_, i) => i !== index)
        setBarangHilangList(updated)
        setData('barang_hilang', updated.filter(b => b.nama.trim()))
    }

    const updateKomponen = (index, field, value) => {
        const updated = komponenList.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        )
        setKomponenList(updated)
        setData('komponen', toKomponenString(updated))
    }

    const addKomponen = () => {
        const updated = [...komponenList, { jumlah: '1', nama: '' }]
        setKomponenList(updated)
        setData('komponen', toKomponenString(updated))
    }

    const removeKomponen = (index) => {
        const updated = komponenList.filter((_, i) => i !== index)
        setKomponenList(updated)
        setData('komponen', toKomponenString(updated))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        put(`/admin/games/${boardgame.id}`)
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Edit Board Game</h1>
                <Link href="/admin/games" className="btn bg-blue-600 hover:bg-blue-700 text-white border-none btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Kembali
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-slate-800 text-slate-200 px-6 py-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider">Form Edit Board Game</h2>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kode</label>
                            <input type="text" value={data.kode} onChange={(e) => setData('kode', e.target.value)} className="input input-bordered w-full input-sm" />
                            {errors.kode && <p className="text-xs text-red-500 mt-1">{errors.kode}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Box</label>
                            <input type="number" value={data.box} onChange={(e) => setData('box', e.target.value)} className="input input-bordered w-full input-sm" />
                            {errors.box && <p className="text-xs text-red-500 mt-1">{errors.box}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                            <input type="text" value={data.nama} onChange={(e) => setData('nama', e.target.value)} className="input input-bordered w-full input-sm" />
                            {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Penerbit</label>
                            <input type="text" value={data.penerbit} onChange={(e) => setData('penerbit', e.target.value)} className="input input-bordered w-full input-sm" />
                            {errors.penerbit && <p className="text-xs text-red-500 mt-1">{errors.penerbit}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah</label>
                            <input type="number" value={data.jumlah} onChange={(e) => setData('jumlah', e.target.value)} className="input input-bordered w-full input-sm" />
                            {errors.jumlah && <p className="text-xs text-red-500 mt-1">{errors.jumlah}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Satuan</label>
                            <input type="text" value={data.satuan} onChange={(e) => setData('satuan', e.target.value)} className="input input-bordered w-full input-sm" />
                            {errors.satuan && <p className="text-xs text-red-500 mt-1">{errors.satuan}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lantai</label>
                            <input type="number" value={data.lantai} onChange={(e) => setData('lantai', e.target.value)} className="input input-bordered w-full input-sm" />
                            {errors.lantai && <p className="text-xs text-red-500 mt-1">{errors.lantai}</p>}
                        </div>
                    </div>

                    {/* Link Foto - mini editor */}
                    <div className="border-t border-slate-200 pt-5">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-slate-700">Link Foto</label>
                            <button type="button" onClick={addLinkFoto} className="btn bg-blue-600 hover:bg-blue-700 text-white border-none btn-xs">
                                + Tambah link foto
                            </button>
                        </div>
                        {errors.link_foto && <p className="text-xs text-red-500 mb-2">{errors.link_foto}</p>}
                        <div className="space-y-1.5">
                            {linkFotoList.map((url, index) => (
                                <div key={index} className="flex items-center gap-2 bg-slate-50 rounded-md px-2 py-1">
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => updateLinkFoto(index, e.target.value)}
                                        className="input input-bordered input-xs w-full"
                                        placeholder="https://example.com/foto.jpg"
                                    />
                                    <button type="button" onClick={() => removeLinkFoto(index)} className="btn btn-ghost btn-xs btn-square text-red-500 hover:bg-red-100" title="Hapus">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Previews */}
                    {linkFotoList.filter(u => u.trim()).length > 0 && (
                        <div className="border-t border-slate-200 pt-5">
                            <label className="block text-sm font-medium text-slate-700 mb-3">Preview Foto</label>
                            <div className="flex flex-wrap gap-3">
                                {linkFotoList.filter(u => u.trim()).map((url, i) => (
                                    <div key={i} className="relative group">
                                        <img
                                            src={url}
                                            alt={`Foto ${i + 1}`}
                                            className="w-24 h-24 object-cover rounded-lg border border-slate-200 shadow-sm"
                                            onError={(e) => { e.target.style.display = 'none' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Komponen */}
                    <div className="border-t border-slate-200 pt-5">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-slate-700">Komponen</label>
                            <button type="button" onClick={addKomponen} className="btn bg-blue-600 hover:bg-blue-700 text-white border-none btn-xs">
                                + Tambah komponen
                            </button>
                        </div>
                        {errors.komponen && <p className="text-xs text-red-500 mb-2">{errors.komponen}</p>}
                        <div className="space-y-2">
                            {komponenList.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                                    <input
                                        type="number"
                                        value={item.jumlah}
                                        onChange={(e) => updateKomponen(index, 'jumlah', e.target.value)}
                                        className="input input-bordered input-sm w-20 text-center"
                                        placeholder="Jml"
                                    />
                                    <input
                                        type="text"
                                        value={item.nama}
                                        onChange={(e) => updateKomponen(index, 'nama', e.target.value)}
                                        className="input input-bordered input-sm flex-1"
                                        placeholder="Nama komponen"
                                    />
                                    <button type="button" onClick={() => removeKomponen(index)} className="btn btn-ghost btn-xs btn-square text-red-500 hover:bg-red-100" title="Hapus">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Barang Hilang - mini editor */}
                    <div className="border-t border-slate-200 pt-5">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-slate-700">Barang Hilang</label>
                            <button type="button" onClick={addBarangHilang} className="btn bg-blue-600 hover:bg-blue-700 text-white border-none btn-xs">
                                + Tambah barang hilang
                            </button>
                        </div>
                        {errors.barang_hilang && <p className="text-xs text-red-500 mb-2">{errors.barang_hilang}</p>}
                        <div className="space-y-1.5">
                            {barangHilangList.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 bg-slate-50 rounded-md px-2 py-1">
                                    <input
                                        type="number"
                                        value={item.jumlah}
                                        onChange={(e) => updateBarangHilang(index, 'jumlah', e.target.value)}
                                        className="input input-bordered input-xs w-16 text-center"
                                        placeholder="Jml"
                                    />
                                    <input
                                        type="text"
                                        value={item.nama}
                                        onChange={(e) => updateBarangHilang(index, 'nama', e.target.value)}
                                        className="input input-bordered input-xs flex-1"
                                        placeholder="Nama barang hilang"
                                    />
                                    <button type="button" onClick={() => removeBarangHilang(index)} className="btn btn-ghost btn-xs btn-square text-red-500 hover:bg-red-100" title="Hapus">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                        <button type="submit" disabled={processing} className="btn bg-blue-600 hover:bg-blue-700 text-white border-none btn-sm">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <Link href="/admin/games" className="btn btn-ghost btn-sm">Batal</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
