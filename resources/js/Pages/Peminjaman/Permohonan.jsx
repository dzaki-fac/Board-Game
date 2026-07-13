import { Link, router, usePage } from "@inertiajs/react";
import BadgeStatus from "../../Components/BadgeStatus";

export default function Permohonan({ permohonan, total, total_pending, total_approved, total_rejected }) {
  const { props } = usePage();
  const admin = props.auth?.admin;
  const flash = props.flash || {};
  const errors = props.errors || {};

  function canApproveReject(p) {
    if (!admin) return false;
    if (admin.role === 'superadmin') return true;
    return String(p.boardgame?.lantai) === String(admin.lantai);
  }

  function approve(id) {
    router.patch(`/admin/permohonan/${id}/approve`, {}, { preserveScroll: true });
  }

  function reject(id) {
    router.patch(`/admin/permohonan/${id}/reject`, {}, { preserveScroll: true });
  }

  return (
    <>
      <h1 className="title">Daftar Permohonan</h1>
      <p className="text-sm text-slate-600 px-4 mb-4">Daftar seluruh permohonan peminjaman</p>

      <div className="px-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
          <div className="stat-title text-sm">Total Permohonan</div>
          <div className="stat-value text-3xl text-gray-900">{total}</div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
          <div className="stat-title text-sm">Disetujui</div>
          <div className="stat-value text-3xl text-green-500">{total_approved}</div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
          <div className="stat-title text-sm">Menunggu</div>
          <div className="stat-value text-3xl text-yellow-500">{total_pending}</div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
          <div className="stat-title text-sm">Ditolak</div>
          <div className="stat-value text-3xl text-pink-500">{total_rejected}</div>
        </div>
      </div>

      {flash.success && (
        <div className="px-4 mb-4">
          <div className="alert alert-success shadow-sm">
            <span>{flash.success}</span>
          </div>
        </div>
      )}

      {errors.error && (
        <div className="px-4 mb-4">
          <div className="alert alert-error shadow-sm">
            <span>{errors.error}</span>
          </div>
        </div>
      )}

      <div className="p-4 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jenis Jaminan</th>
              <th>Nomor Identitas</th>
              <th>Boardgame</th>
              <th>Lantai</th>
              <th>Tgl pinjam</th>
              <th>Jam pinjam</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {permohonan.data.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center text-slate-400 py-6">
                  Belum ada permohonan.
                </td>
              </tr>
            )}
            {permohonan.data.map((p) => {
              const listPeminjam = Array.isArray(p.list_peminjam) ? p.list_peminjam : [];
              const first = listPeminjam[0] || {};
              return (
              <tr key={p.id}>
                <td>{first.nama || p.user?.name}</td>
                <td>
                    {first.jenis_jaminan
                        ? first.jenis_jaminan === "kartu_anggota"
                            ? "Kartu Anggota"
                            : first.jenis_jaminan.toUpperCase()
                        : "-"}
                </td>
                <td>
                    {first.nomor_identitas || "-"}
                </td>
                <td>{p.boardgame?.nama}</td>
                <td>{p.boardgame?.lantai}</td>
                <td>{new Date(p.tanggal_pinjam + "T00:00:00").toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "2-digit" })}</td>
                <td>{p.jam_pinjam?.slice(0, 8)}</td>
                <td>
                  <BadgeStatus status={p.status} />
                </td>
                <td className="flex gap-2">
                  {p.status === 'pending' && canApproveReject(p) && (
                    <>
                      <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => approve(p.id)}>Setujui</button>
                      <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition bg-rose-500 hover:bg-rose-600 text-white" onClick={() => reject(p.id)}>Tolak</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
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
              className={`px-2 ${link.active ? "font-bold text-[#2F6F62]" : ""}`}
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
