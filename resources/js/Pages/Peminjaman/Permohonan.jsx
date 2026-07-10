import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import BadgeStatus from "../../Components/BadgeStatus";

const statusOptions = [
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

export default function Permohonan({ permohonan, total, total_pending, total_approved, total_rejected, filters }) {
  const { props } = usePage();
  const admin = props.auth?.admin;
  const flash = props.flash || {};
  const errors = props.errors || {};

  const isInitialMount = useRef(true);
  const debounceRef = useRef(null);
  const [search, setSearch] = useState(filters?.search || "");
  const [statusFilter, setStatusFilter] = useState(filters?.status || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.get("/admin/permohonan", { search, status: statusFilter }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      });
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search, statusFilter]);

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

      <div className="px-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NIM, atau board game"
              className="input input-bordered input-sm pl-9 w-full"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F6F62] transition-colors min-w-[130px]"
            >
              {statusFilter ? (
                <BadgeStatus status={statusFilter} />
              ) : (
                <span className="text-gray-500">Semua Status</span>
              )}
              <svg className={`w-4 h-4 ml-auto text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {open && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                <div className="absolute z-20 mt-1 bg-white border border-[#E8F3EF] rounded-xl shadow-lg py-1 min-w-[160px]">
                  <button
                    type="button"
                    onClick={() => { setStatusFilter(""); setOpen(false) }}
                    className={`flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-[#E8F3EF] transition-colors ${!statusFilter ? "bg-[#E8F3EF]" : ""}`}
                  >
                    <span className="text-gray-500">Semua Status</span>
                    {!statusFilter && (
                      <svg className="w-4 h-4 ml-auto text-[#2F6F62]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setStatusFilter(opt.value); setOpen(false) }}
                      className={`flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-[#E8F3EF] transition-colors ${statusFilter === opt.value ? "bg-[#E8F3EF]" : ""}`}
                    >
                      <BadgeStatus status={opt.value} />
                      {statusFilter === opt.value && (
                        <svg className="w-4 h-4 ml-auto text-[#2F6F62]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>NIM</th>
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
                <td colSpan={9} className="text-center text-slate-400 py-6">
                  Belum ada permohonan.
                </td>
              </tr>
            )}
            {permohonan.data.map((p) => (
              <tr key={p.id}>
                <td>{p.nama || p.user?.name}</td>
                <td>{p.nim}</td>
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
