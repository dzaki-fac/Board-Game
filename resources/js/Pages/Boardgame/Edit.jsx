import { useState } from "react"
import { Link, useForm } from "@inertiajs/react"
import { baseUrl } from '@/lib/path';

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

export default function Edit({ boardgame }) {
    const { data, setData, put, processing, errors } = useForm({
        kode: boardgame.kode,
        box: boardgame.box,
        nama: boardgame.nama,
        penerbit: boardgame.penerbit ?? '',
        kategori: Array.isArray(boardgame.kategori) ? boardgame.kategori : (boardgame.kategori ? [boardgame.kategori] : []),
        jumlah: boardgame.jumlah,
        satuan: boardgame.satuan,
        tingkat_kesulitan: boardgame.tingkat_kesulitan ?? '',
        usia_minimum: boardgame.usia_minimum ?? '',
        jumlah_pemain: boardgame.jumlah_pemain ?? '',
        durasi: boardgame.durasi ?? '',
        existing_fotos: boardgame.link_foto?.filter(Boolean) ?? [],
        new_fotos: [],
        lantai: boardgame.lantai,
        komponen: boardgame.komponen ?? [],
        barang_hilang: boardgame.barang_hilang ?? [],
        deskripsi: boardgame.deskripsi ?? '',
        link_tutorial: boardgame.link_tutorial ?? '',
        populer: boardgame.populer ?? false,
        available_copies: boardgame.available_copies,
    })

    const [komponenList, setKomponenList] = useState(boardgame.komponen?.length ? boardgame.komponen : [{ jumlah: '1', nama: '' }])
    const [existingFotos, setExistingFotos] = useState(boardgame.link_foto?.filter(Boolean) ?? [])
    const [newFotoList, setNewFotoList] = useState([{ file: null, preview: null }])
    const [barangHilangList, setBarangHilangList] = useState(boardgame.barang_hilang?.length ? boardgame.barang_hilang.map(b => typeof b === 'string' ? { jumlah: '1', nama: b } : b) : [])

    const toggleKategori = (value) => {
        const current = data.kategori ?? []
        const updated = current.includes(value)
            ? current.filter(k => k !== value)
            : [...current, value]
        setData('kategori', updated)
    }

    const removeExistingFoto = (index) => {
        const updated = existingFotos.filter((_, i) => i !== index)
        setExistingFotos(updated)
        setData('existing_fotos', updated)
    }

    const updateNewFoto = (index, file) => {
        const updated = newFotoList.map((item, i) => {
            if (i === index) {
                if (item.preview) URL.revokeObjectURL(item.preview)
                return { file, preview: file ? URL.createObjectURL(file) : null }
            }
            return item
        })
        setNewFotoList(updated)
        const files = updated.filter(u => u.file).map(u => u.file)
        setData('new_fotos', files.length > 0 ? files : [])
    }

    const addNewFoto = () => {
        setNewFotoList([...newFotoList, { file: null, preview: null }])
    }

    const removeNewFoto = (index) => {
        const updated = newFotoList.filter((_, i) => i !== index)
        if (newFotoList[index]?.preview) URL.revokeObjectURL(newFotoList[index].preview)
        setNewFotoList(updated)
        const files = updated.filter(u => u.file).map(u => u.file)
        setData('new_fotos', files.length > 0 ? files : [])
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
        put(baseUrl(`/admin/games/${boardgame.id}`))
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Edit Board Game</h1>
                <Link href={baseUrl('/admin/games')} className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Kembali
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-[#071E30] text-[#FAF7F2]/80 px-6 py-4">
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
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Available Copies
                                <span className="ml-1 text-xs font-normal text-slate-400">(maks: {boardgame.jumlah})</span>
                            </label>
                            <input type="number" min="0" max={boardgame.jumlah} value={data.available_copies} onChange={(e) => setData('available_copies', e.target.value)} className="input input-bordered w-full input-sm" />
                            {errors.available_copies && <p className="text-xs text-red-500 mt-1">{errors.available_copies}</p>}
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
                                <span className="ml-2 text-xs font-normal text-[#0E4A73]">({data.kategori.length} dipilih)</span>
                            )}
                        </label>
                        {errors.kategori && <p className="text-xs text-red-500 mb-2">{errors.kategori}</p>}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {KATEGORI_OPTIONS.map((kat) => (
                                <label key={kat} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm
                                    ${data.kategori?.includes(kat)
                                        ? 'border-[#0E4A73] bg-[#0E4A73]/10 text-[#071E30] font-medium'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                                    }`}>
                                    <input
                                        type="checkbox"
                                        checked={data.kategori?.includes(kat) ?? false}
                                        onChange={() => toggleKategori(kat)}
                                        className="checkbox checkbox-xs"
                                        style={{ '--chkbg': '#0E4A73', '--chkfg': 'white' }}
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

                    {/* Foto */}
                    <div className="border-t border-slate-200 pt-5">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-slate-700">Foto</label>
                            <button type="button" onClick={addNewFoto} className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-xs">
                                + Tambah foto
                            </button>
                        </div>
                        {errors.link_foto && <p className="text-xs text-red-500 mb-2">{errors.link_foto}</p>}

                        {/* Existing photos */}
                        {existingFotos.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs text-slate-500 mb-2">Foto saat ini:</p>
                                <div className="flex flex-wrap gap-2">
                                    {existingFotos.map((url, i) => (
                                        <div key={`existing-${i}`} className="relative group">
                                            <img
                                                src={baseUrl(url)}
                                                alt={`Foto ${i + 1}`}
                                                className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm"
                                                onError={(e) => { e.target.style.display = 'none' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingFoto(i)}
                                                className="absolute -top-1.5 -right-1.5 btn btn-circle btn-xs bg-red-500 hover:bg-red-600 text-white border-none"
                                                title="Hapus foto"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New file uploads */}
                        <div className="space-y-1.5">
                            {newFotoList.map((item, index) => (
                                <div key={`new-${index}`} className="flex items-center gap-2 bg-slate-50 rounded-md px-2 py-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => updateNewFoto(index, e.target.files[0] || null)}
                                        className="file-input file-input-bordered file-input-sm w-full text-sm"
                                    />
                                    <button type="button" onClick={() => removeNewFoto(index)} className="btn btn-ghost btn-xs btn-square text-red-500 hover:bg-red-100 flex-shrink-0" title="Hapus">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Preview new uploads */}
                        {newFotoList.some(f => f.preview) && (
                            <div className="mt-3">
                                <p className="text-xs text-slate-500 mb-2">Preview foto baru:</p>
                                <div className="flex flex-wrap gap-2">
                                    {newFotoList.filter(f => f.preview).map((item, i) => (
                                        <img
                                            key={i}
                                            src={item.preview}
                                            alt={`Preview ${i + 1}`}
                                            className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {(errors['link_foto.0'] || errors['link_foto.1'] || errors['link_foto.2']) && (
                            <p className="text-xs text-red-500 mt-2">Setiap file harus berupa gambar (jpeg, png, jpg, gif, webp) maksimal 5MB.</p>
                        )}
                    </div>

                    {/* Komponen */}
                    <div className="border-t border-slate-200 pt-5">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-slate-700">Komponen</label>
                            <button type="button" onClick={addKomponen} className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-xs">
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
                            <button type="button" onClick={addBarangHilang} className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-xs">
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
                        <button type="submit" disabled={processing} className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-sm">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <Link href={baseUrl('/admin/games')} className="btn btn-ghost btn-sm">Batal</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
