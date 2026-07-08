import { Link } from "@inertiajs/react"

export default function Show({ boardgame }) {
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
          {boardgame.link_foto?.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Foto</label>
              <div className="flex flex-wrap gap-3">
                {boardgame.link_foto.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border border-slate-200 shadow-sm"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ))}
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
            <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-4 py-3 leading-relaxed">{boardgame.komponen}</p>
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
