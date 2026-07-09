import { useState } from "react"
import { Link } from "@inertiajs/react"

export default function Show({ boardgame }) {
  const [fotoIndex, setFotoIndex] = useState(0)
  const fotos = boardgame.link_foto || []

  const prevFoto = () => setFotoIndex((i) => (i > 0 ? i - 1 : fotos.length - 1))
  const nextFoto = () => setFotoIndex((i) => (i < fotos.length - 1 ? i + 1 : 0))

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Detail Board Game</h1>
        <Link href="/admin/games" className="btn bg-blue-600 hover:bg-blue-700 text-white border-none btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-slate-800 text-slate-200 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider">{boardgame.nama}</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Images */}
          {fotos.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Foto</label>
              <div className="relative flex items-center justify-center gap-4">
                <button onClick={prevFoto} className="btn btn-circle btn-ghost btn-lg text-slate-600 hover:bg-slate-100 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="relative flex-1 max-w-lg">
                  <img
                    src={fotos[fotoIndex]}
                    alt={`Foto ${fotoIndex + 1}`}
                    className="w-full h-96 object-contain rounded-lg border border-slate-200 shadow-sm bg-slate-50"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <p className="text-center text-xs text-slate-400 mt-2">Foto {fotoIndex + 1} dari {fotos.length}</p>
                </div>
                <button onClick={nextFoto} className="btn btn-circle btn-ghost btn-lg text-slate-600 hover:bg-slate-100 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Kode</label>
              <p className="text-sm text-slate-900 font-mono">{boardgame.kode}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Box</label>
              <p className="text-sm text-slate-900">{boardgame.box}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Nama</label>
              <p className="text-sm text-slate-900 font-medium">{boardgame.nama}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Penerbit</label>
              <p className="text-sm text-slate-900">{boardgame.penerbit || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Jumlah</label>
              <p className="text-sm text-slate-900">{boardgame.jumlah} {boardgame.satuan}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Lantai</label>
              <p className="text-sm text-slate-900">Lt {boardgame.lantai}</p>
            </div>
          </div>

          {/* Komponen */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Komponen</label>
            {boardgame.komponen?.length > 0 ? (
              <div className="space-y-1">
                {boardgame.komponen.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-md px-3 py-1.5 text-sm text-slate-700">
                    <span className="font-medium">{item.jumlah}x</span>
                    <span>{item.nama}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Tidak ada komponen</p>
            )}
          </div>

          {/* Barang Hilang */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Barang Hilang</label>
            {boardgame.barang_hilang?.length > 0 ? (
              <div className="space-y-1">
                {boardgame.barang_hilang.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-red-50 rounded-md px-3 py-1.5 text-sm text-red-700">
                    <span className="font-medium">{item.jumlah}x</span>
                    <span>{item.nama}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Tidak ada barang hilang</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
            <Link href={`/admin/games/${boardgame.id}/edit`} className="btn bg-amber-500 hover:bg-amber-600 text-white border-none btn-sm">
              Edit
            </Link>
            <Link href="/admin/games" className="btn btn-ghost btn-sm">Kembali</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
