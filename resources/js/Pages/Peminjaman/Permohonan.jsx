import { Link, router } from "@inertiajs/react";

export default function Permohonan({ permohonan, total, total_menunggu, total_disetujui, total_ditolak }) {
  function setujui(id) {
    router.patch(`/permohonan/${id}/setujui`, {}, { preserveScroll: true });
  }

  function tolak(id) {
    router.patch(`/permohonan/${id}/tolak`, {}, { preserveScroll: true });
  }

  return (
    <>
      <h1 className="title">Daftar Permohonan</h1>
      <p className="text-sm text-slate-600 px-4 mb-4">Daftar seluruh permohonan peminjaman</p>

      <div className="px-4 grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
          <div className="stat-title text-sm">Total Permohonan</div>
          <div className="stat-value text-3xl">{total}</div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
          <div className="stat-title text-sm">Menunggu</div>
          <div className="stat-value text-3xl text-warning">{total_menunggu}</div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
          <div className="stat-title text-sm">Disetujui</div>
          <div className="stat-value text-3xl text-success">{total_disetujui}</div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
          <div className="stat-title text-sm">Ditolak</div>
          <div className="stat-value text-3xl text-error">{total_ditolak}</div>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>NIM</th>
              <th>Boardgame</th>
              <th>Tgl pinjam</th>
              <th>Jam pinjam</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {permohonan.data.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-slate-400 py-6">
                  Belum ada permohonan.
                </td>
              </tr>
            )}
            {permohonan.data.map((p) => (
              <tr key={p.id}>
                <td>{p.nama || p.user?.name}</td>
                <td>{p.nim}</td>
                <td>{p.boardgame?.judul}</td>
                <td>{new Date(p.tanggal_pinjam + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "2-digit" })}</td>
                <td>{p.jam_pinjam?.slice(0, 8)}</td>
                <td>
                  {p.status === 'menunggu' && <span className="badge badge-warning badge-sm">Menunggu</span>}
                  {p.status === 'dipinjam' && <span className="badge badge-success badge-sm">Disetujui</span>}
                  {p.status === 'ditolak' && <span className="badge badge-error badge-sm">Ditolak</span>}
                </td>
                <td className="flex gap-2">
                  {p.status === 'menunggu' && (
                    <>
                      <button className="btn btn-sm btn-primary" onClick={() => setujui(p.id)}>Setujui</button>
                      <button className="btn btn-sm btn-error" onClick={() => tolak(p.id)}>Tolak</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center m-4 gap-1">
        {permohonan.links.map((link) =>
          link.url ? (
            <Link
              key={link.label}
              href={link.url}
              dangerouslySetInnerHTML={{ __html: link.label }}
              className={`px-2 ${link.active ? "font-bold text-blue-600" : ""}`}
              preserveScroll
            />
          ) : (
            <span key={link.label} className="px-2 text-slate-300" dangerouslySetInnerHTML={{ __html: link.label }} />
          )
        )}
      </div>
    </>
  );
}
