import { useState } from "react"
import { Link, useForm } from "@inertiajs/react"

const KATEGORI_OPTIONS = [
    'Strategy',
    'Party',
    'Family',
    'Cooperative',
    'Card Game',
    'Abstract',
    'Puzzle',
    'Simulation / Economic',
]

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        kode: '',
        box: '',
        nama: '',
        penerbit: '',
        kategori: [],
        jumlah: '',
        satuan: '',
        tingkat_kesulitan: '',
        usia_minimum: '',
        jumlah_pemain: '',
        durasi: '',
        link_foto: [],
        lantai: '',
        komponen: [],
        barang_hilang: [],
        deskripsi: '',
        link_tutorial: '',
        populer: false,
    })

    const [komponenList, setKomponenList] = useState([{ jumlah: '1', nama: '' }])
    const [linkFotoList, setLinkFotoList] = useState([''])
    const [barangHilangList, setBarangHilangList] = useState([])

    const toggleKategori = (value) => {
        const current = data.kategori ?? []
        const updated = current.includes(value)
            ? current.filter(k => k !== value)
            : [...current, value]
        setData('kategori', updated)
    }

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
        setData('komponen', updated.filter(item => item.nama.trim()))
    }

    const addKomponen = () => {
        const updated = [...komponenList, { jumlah: '1', nama: '' }]
        setKomponenList(updated)
        setData('komponen', updated.filter(item => item.nama.trim()))
    }

    const removeKomponen = (index) => {
        const updated = komponenList.filter((_, i) => i !== index)
        setKomponenList(updated)
        setData('komponen', updated.filter(item => item.nama.trim()))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('games.store'))
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Tambah Board Game</h1>
                <Link href={route("games.index")} className="btn bg-[#2F6F62] hover:bg-[#255A4F] text-white border-none btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Kembali
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-[#173C33] text-[#FAF7F2]/80 px-6 py-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider">Form Tambah Board Game</h2>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kode</label>
                            <input type="text" value={data.kode} onChange={(e) => setData('kode', e.target.value)} className="input input-bordered w-full input-sm" placeholder="cth: 18/Y/PK/1" />
                            {errors.kode && <p className="text-xs text-red-500 mt-1">{errors.kode}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Box</label>
                            <input type="number" value={data.box} onChange={(e) => setData('box', e.target.value)} className="input input-bordered w-full input-sm" placeholder="1" />
                            {errors.box && <p className="text-xs text-red-500 mt-1">{errors.box}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                            <input type="text" value={data.nama} onChange={(e) => setData('nama', e.target.value)} className="input input-bordered w-full input-sm" placeholder="Nama board game" />
                            {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Penerbit</label>
                            <input type="text" value={data.penerbit} onChange={(e) => setData('penerbit', e.target.value)} className="input input-bordered w-full input-sm" placeholder="Nama penerbit" />
                            {errors.penerbit && <p className="text-xs text-red-500 mt-1">{errors.penerbit}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Pemain</label>
                            <input type="text" value={data.jumlah_pemain} onChange={(e) => setData('jumlah_pemain', e.target.value)} className="input input-bordered w-full input-sm" placeholder="cth: 2-4 Pemain" />
                            {errors.jumlah_pemain && <p className="text-xs text-red-500 mt-1">{errors.jumlah_pemain}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Durasi</label>
                            <input type="text" value={data.durasi} onChange={(e) => setData('durasi', e.target.value)} className="input input-bordered w-full input-sm" placeholder="cth: 60-90 Menit" />
                            {errors.durasi && <p className="text-xs text-red-500 mt-1">{errors.durasi}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tingkat Kesulitan (1-5)</label>
                            <input type="number" step="0.1" min="1" max="5" value={data.tingkat_kesulitan} onChange={(e) => setData('tingkat_kesulitan', e.target.value)} className="input input-bordered w-full input-sm" placeholder="cth: 3.5" />
                            {errors.tingkat_kesulitan && <p className="text-xs text-red-500 mt-1">{errors.tingkat_kesulitan}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Usia Minimum</label>
                            <input type="text" value={data.usia_minimum} onChange={(e) => setData('usia_minimum', e.target.value)} className="input input-bordered w-full input-sm" placeholder="cth: 10+" />
                            {errors.usia_minimum && <p className="text-xs text-red-500 mt-1">{errors.usia_minimum}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah</label>
                            <input type="number" value={data.jumlah} onChange={(e) => setData('jumlah', e.target.value)} className="input input-bordered w-full input-sm" placeholder="1" />
                            {errors.jumlah && <p className="text-xs text-red-500 mt-1">{errors.jumlah}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Satuan</label>
                            <input type="text" value={data.satuan} onChange={(e) => setData('satuan', e.target.value)} className="input input-bordered w-full input-sm" placeholder="set" />
                            {errors.satuan && <p className="text-xs text-red-500 mt-1">{errors.satuan}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Lantai</label>
                            <input type="number" value={data.lantai} onChange={(e) => setData('lantai', e.target.value)} className="input input-bordered w-full input-sm" placeholder="1" />
                            {errors.lantai && <p className="text-xs text-red-500 mt-1">{errors.lantai}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Link Tutorial</label>
                            <input type="text" value={data.link_tutorial} onChange={(e) => setData('link_tutorial', e.target.value)} className="input input-bordered w-full input-sm" placeholder="cth: https://youtube.com/..." />
                            {errors.link_tutorial && <p className="text-xs text-red-500 mt-1">{errors.link_tutorial}</p>}
                        </div>
                        <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.populer} onChange={(e) => setData('populer', e.target.checked)} className="checkbox checkbox-sm border-slate-300" />
                                <span className="text-sm font-medium text-slate-700">Populer</span>
                            </label>
                        </div>
                    </div>

                    {/* Kategori - checkbox group */}
                    <div className="border-t border-slate-200 pt-5">
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Kategori
                            {data.kategori?.length > 0 && (
                                <span className="ml-2 text-xs font-normal text-[#2F6F62]">({data.kategori.length} dipilih)</span>
                            )}
                        </label>
                        {errors.kategori && <p className="text-xs text-red-500 mb-2">{errors.kategori}</p>}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {KATEGORI_OPTIONS.map((kat) => (
                                <label key={kat} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm
                                    ${data.kategori?.includes(kat)
                                        ? 'border-[#2F6F62] bg-[#2F6F62]/10 text-[#173C33] font-medium'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                                    }`}>
                                    <input
                                        type="checkbox"
                                        checked={data.kategori?.includes(kat) ?? false}
                                        onChange={() => toggleKategori(kat)}
                                        className="checkbox checkbox-xs"
                                        style={{ '--chkbg': '#2F6F62', '--chkfg': 'white' }}
                                    />
                                    {kat}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="border-t border-slate-200 pt-5">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            className="textarea textarea-bordered w-full text-sm"
                            rows={4}
                            placeholder="Deskripsi singkat tentang board game ini..."
                        />
                        {errors.deskripsi && <p className="text-xs text-red-500 mt-1">{errors.deskripsi}</p>}
                    </div>

                    {/* Link Foto - mini editor */}
                    <div className="border-t border-slate-200 pt-5">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-slate-700">Link Foto</label>
                            <button type="button" onClick={addLinkFoto} className="btn bg-[#2F6F62] hover:bg-[#255A4F] text-white border-none btn-xs">
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
                            <button type="button" onClick={addKomponen} className="btn bg-[#2F6F62] hover:bg-[#255A4F] text-white border-none btn-xs">
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
                            <button type="button" onClick={addBarangHilang} className="btn bg-[#2F6F62] hover:bg-[#255A4F] text-white border-none btn-xs">
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
                                    <select
                                        value={item.nama}
                                        onChange={(e) => updateBarangHilang(index, 'nama', e.target.value)}
                                        className="select select-bordered select-xs flex-1"
                                    >
                                        <option value="">Pilih komponen</option>
                                        {komponenList.filter(k => k.nama.trim()).map((k, i) => (
                                            <option key={i} value={k.nama}>{k.nama}</option>
                                        ))}
                                    </select>
                                    <button type="button" onClick={() => removeBarangHilang(index)} className="btn btn-ghost btn-xs btn-square text-red-500 hover:bg-red-100" title="Hapus">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                        <button type="submit" disabled={processing} className="btn bg-[#2F6F62] hover:bg-[#255A4F] text-white border-none btn-sm">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <Link href={route("games.index")} className="btn btn-ghost btn-sm">Batal</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
