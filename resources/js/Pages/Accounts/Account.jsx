import { usePage, useForm, router, Link } from "@inertiajs/react";
import { baseUrl } from '@/lib/path';
import { useState, useEffect } from "react";

export default function Account({ admins: { data: admins, links, from, to, total } }) {
    const { auth, flash, error } = usePage().props;
    const currentAdmin = auth?.admin;
    const isSuperAdmin = currentAdmin?.role === "admin";
    const currentAdminId = currentAdmin?.id;

    const create = useForm({
        name: "",
        email: "",
        nip: "",
        password: "",
        password_confirmation: "",
        role: "admin",
    });

    const edit = useForm({
        name: "",
        email: "",
        nip: "",
        password: "",
        password_confirmation: "",
        role: "admin",
    });

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showFlash, setShowFlash] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (flash) { setShowFlash(true); const t = setTimeout(() => setShowFlash(false), 3000); return () => clearTimeout(t); }
    }, [flash]);

    useEffect(() => {
        if (error) { setShowError(true); const t = setTimeout(() => setShowError(false), 3000); return () => clearTimeout(t); }
    }, [error]);

    useEffect(() => {
        if (Object.keys(create.errors).length > 0) {
            setShowCreateModal(true);
        }
    }, [create.errors]);

    useEffect(() => {
        if (Object.keys(edit.errors).length > 0 && editingAdmin) {
            document.getElementById("edit-modal")?.showModal();
        }
    }, [edit.errors, editingAdmin]);

    useEffect(() => {
        if (window.location.search.includes("edit=me") && currentAdmin) {
            const path = window.location.pathname;
            const base = import.meta.env.VITE_BASE_PATH || '';
            const relativePath = path.startsWith(base) ? path.slice(base.length) || '/' : path;
            window.history.replaceState({}, "", relativePath);
            openEditModal(currentAdmin);
        }
    }, []);

    function openCreateModal() {
        create.reset();
        setShowCreateModal(true);
    }

    function closeCreateModal() {
        setShowCreateModal(false);
        create.reset();
    }

    function openEditModal(admin) {
        setEditingAdmin(admin);
        edit.setData({
            name: admin.name,
            email: admin.email,
            nip: admin.nip,
            password: "",
            password_confirmation: "",
            role: admin.role,
        });
    }

    function closeEditModal() {
        setEditingAdmin(null);
        edit.reset();
    }

    function handleCreate(e) {
        e.preventDefault();
        create.post(baseUrl("/admin/accounts"), {
            preserveScroll: true,
            onSuccess: () => closeCreateModal(),
        });
    }

    function handleUpdate(e) {
        e.preventDefault();
        edit.put(baseUrl(`/admin/accounts/${editingAdmin.id}`), {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
        });
    }

    function handleDelete() {
        if (!deleteTarget) return;
        router.delete(baseUrl(`/admin/accounts/${deleteTarget.id}`), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onError: () => setDeleteTarget(null),
        });
    }

    return (
        <div className="p-6">
            {flash && showFlash && (
                <div className="mb-4">
                    <div className="alert alert-success text-sm shadow-sm">{flash}</div>
                </div>
            )}
            {error && showError && (
                <div className="mb-4">
                    <div className="alert alert-error text-sm shadow-sm">{error}</div>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Daftar Akun Admin</h1>
                {isSuperAdmin && (
                    <button onClick={openCreateModal} className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-sm gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Tambah Admin
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>NIP</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Tanggal Dibuat</th>
                            {isSuperAdmin && <th>Aksi</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {admins.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-slate-400 py-6">
                                    Belum ada akun admin.
                                </td>
                            </tr>
                        )}
                        {admins.map((admin, i) => (
                            <tr key={admin.id}>
                                <td>{from + i}</td>
                                <td>
                                    {admin.name}
                                    {admin.id === currentAdminId && (
                                        <span className="badge badge-xs ml-2 bg-[#D6E8F5] text-[#0E4A73] border-[#B8D5C8] rounded">Anda</span>
                                    )}
                                </td>
                                <td className="font-mono text-sm">{admin.nip}</td>
                                <td>{admin.email}</td>
                                <td>
                                    <span className={`badge badge-sm rounded ${admin.role === "admin" ? "bg-[#FDF3E1] text-[#B98A4A] border-[#E8D5B0]" : "bg-[#D6E8F5] text-[#0E4A73] border-[#B8D5C8]"}`}>
                                        {admin.role === "admin" ? "Admin" : "Petugas"}
                                    </span>
                                </td>
                                <td>
                                    {new Date(admin.created_at).toLocaleDateString(
                                        "id-ID",
                                        { year: "numeric", month: "long", day: "numeric" }
                                    )}
                                </td>
                                {isSuperAdmin && (
                                    <td>
                                        {admin.role === "admin" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(admin)}
                                                    className="btn btn-sm btn-outline btn-warning"
                                                >
                                                    Edit
                                                </button>
                                                {admin.id !== currentAdminId && (
                                                    <button
                                                        onClick={() => setDeleteTarget(admin)}
                                                        className="btn btn-sm btn-outline btn-error"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <dialog className="modal modal-open" onClick={closeCreateModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-4">Tambah Admin Baru</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="form-control">
                                <label className="label" htmlFor="create-name">
                                    <span className="label-text">Nama</span>
                                </label>
                                <input
                                    id="create-name"
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={create.data.name}
                                    onChange={(e) => create.setData("name", e.target.value)}
                                />
                                {create.errors.name && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{create.errors.name}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="create-nip">
                                    <span className="label-text">NIP</span>
                                </label>
                                <input
                                    id="create-nip"
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={create.data.nip}
                                    onChange={(e) => create.setData("nip", e.target.value)}
                                />
                                {create.errors.nip && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{create.errors.nip}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="create-email">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    id="create-email"
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={create.data.email}
                                    onChange={(e) => create.setData("email", e.target.value)}
                                />
                                {create.errors.email && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{create.errors.email}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="create-password">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    id="create-password"
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={create.data.password}
                                    onChange={(e) => create.setData("password", e.target.value)}
                                />
                                {create.errors.password && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{create.errors.password}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="create-password_confirmation">
                                    <span className="label-text">Konfirmasi Password</span>
                                </label>
                                <input
                                    id="create-password_confirmation"
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={create.data.password_confirmation}
                                    onChange={(e) => create.setData("password_confirmation", e.target.value)}
                                />
                                {create.errors.password_confirmation && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{create.errors.password_confirmation}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="create-role">
                                    <span className="label-text">Role</span>
                                </label>
                                <select
                                    id="create-role"
                                    className="select select-bordered w-full"
                                    value={create.data.role}
                                    onChange={(e) => create.setData("role", e.target.value)}
                                >
                                    <option value="petugas">Petugas</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {create.errors.role && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{create.errors.role}</span>
                                    </label>
                                )}
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={closeCreateModal}>
                                    Batal
                                </button>
                                <button type="submit" className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none" disabled={create.processing}>
                                    {create.processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={closeCreateModal}>close</button>
                    </form>
                </dialog>
            )}

            {/* Edit Modal */}
            {editingAdmin && (
                <dialog className="modal modal-open" onClick={closeEditModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-4">Edit Akun</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="form-control">
                                <label className="label" htmlFor="edit-name">
                                    <span className="label-text">Nama</span>
                                </label>
                                <input
                                    id="edit-name"
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={edit.data.name}
                                    onChange={(e) => edit.setData("name", e.target.value)}
                                />
                                {edit.errors.name && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{edit.errors.name}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="edit-nip">
                                    <span className="label-text">NIP</span>
                                </label>
                                <input
                                    id="edit-nip"
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={edit.data.nip}
                                    onChange={(e) => edit.setData("nip", e.target.value)}
                                />
                                {edit.errors.nip && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{edit.errors.nip}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="edit-email">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    id="edit-email"
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={edit.data.email}
                                    onChange={(e) => edit.setData("email", e.target.value)}
                                />
                                {edit.errors.email && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{edit.errors.email}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="edit-password">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    id="edit-password"
                                    type="password"
                                    className="input input-bordered w-full"
                                    placeholder="Kosongkan jika tidak diubah"
                                    value={edit.data.password}
                                    onChange={(e) => edit.setData("password", e.target.value)}
                                />
                                {edit.errors.password && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{edit.errors.password}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="edit-password_confirmation">
                                    <span className="label-text">Konfirmasi Password</span>
                                </label>
                                <input
                                    id="edit-password_confirmation"
                                    type="password"
                                    className="input input-bordered w-full"
                                    placeholder="Kosongkan jika tidak diubah"
                                    value={edit.data.password_confirmation}
                                    onChange={(e) => edit.setData("password_confirmation", e.target.value)}
                                />
                                {edit.errors.password_confirmation && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{edit.errors.password_confirmation}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="edit-role">
                                    <span className="label-text">Role</span>
                                </label>
                                <select
                                    id="edit-role"
                                    className="select select-bordered w-full"
                                    value={edit.data.role}
                                    onChange={(e) => edit.setData("role", e.target.value)}
                                    disabled={editingAdmin?.id === currentAdminId}
                                >
                                    <option value="petugas">Petugas</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {editingAdmin?.id === currentAdminId && (
                                    <label className="label">
                                        <span className="label-text-alt text-[#0E4A73]/70">Tidak dapat mengubah role sendiri</span>
                                    </label>
                                )}
                                {edit.errors.role && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{edit.errors.role}</span>
                                    </label>
                                )}
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={closeEditModal}>
                                    Batal
                                </button>
                                <button type="submit" className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none" disabled={edit.processing}>
                                    {edit.processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={closeEditModal}>close</button>
                    </form>
                </dialog>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <dialog className="modal modal-open" onClick={() => setDeleteTarget(null)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-2">Konfirmasi Hapus</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus admin{" "}
                            <strong>{deleteTarget.name}</strong> ({deleteTarget.email})?
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Batal
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={handleDelete}
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setDeleteTarget(null)}>close</button>
                    </form>
                </dialog>
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
    );
}
