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
        link_foto: boardgame.link_foto ?? '',
        lantai: boardgame.lantai,
        komponen: boardgame.komponen ?? '',
    })

    const [komponenList, setKomponenList] = useState(parseKomponen(boardgame.komponen))

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
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Edit Board Game</h1>
                <Link href="/admin/games" className="btn btn-ghost btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Kembali
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Link Foto</label>
                        <input type="text" value={data.link_foto} onChange={(e) => setData('link_foto', e.target.value)} className="input input-bordered w-full input-sm" />
                        {errors.link_foto && <p className="text-xs text-red-500 mt-1">{errors.link_foto}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Lantai</label>
                        <input type="number" value={data.lantai} onChange={(e) => setData('lantai', e.target.value)} className="input input-bordered w-full input-sm" />
                        {errors.lantai && <p className="text-xs text-red-500 mt-1">{errors.lantai}</p>}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-slate-700">Komponen</label>
                        <button type="button" onClick={addKomponen} className="btn btn-ghost btn-xs text-blue-600">
                            + Tambah komponen
                        </button>
                    </div>
                    {errors.komponen && <p className="text-xs text-red-500 mb-2">{errors.komponen}</p>}
                    <div className="space-y-2">
                        {komponenList.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
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
                                <button type="button" onClick={() => removeKomponen(index)} className="btn btn-ghost btn-xs btn-square text-red-500 hover:bg-red-50" title="Hapus">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button type="submit" disabled={processing} className="btn btn-primary btn-sm">
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <Link href="/admin/games" className="btn btn-ghost btn-sm">Batal</Link>
                </div>
            </form>
        </div>
    )
}
