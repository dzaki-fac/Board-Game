import { usePage, useForm, router, Head } from "@inertiajs/react"
import { useState, useEffect } from "react"

export default function Index({ rules }) {
    const { flash } = usePage().props

    const create = useForm({
        section_title: "",
        items: [""],
    })

    const edit = useForm({
        section_title: "",
        items: [""],
    })

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingRule, setEditingRule] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [showFlash, setShowFlash] = useState(false)

    useEffect(() => {
        if (flash) { setShowFlash(true); const t = setTimeout(() => setShowFlash(false), 3000); return () => clearTimeout(t) }
    }, [flash])

    useEffect(() => {
        if (Object.keys(create.errors).length > 0) setShowCreateModal(true)
    }, [create.errors])

    useEffect(() => {
        if (Object.keys(edit.errors).length > 0 && editingRule) setEditingRule({ ...editingRule })
    }, [edit.errors, editingRule])

    function openCreateModal() {
        create.reset()
        create.setData({ section_title: "", items: [""] })
        setShowCreateModal(true)
    }

    function closeCreateModal() {
        setShowCreateModal(false)
        create.reset()
    }

    function openEditModal(rule) {
        setEditingRule(rule)
        edit.setData({
            section_title: rule.section_title,
            items: rule.items.map((i) => i.content),
        })
    }

    function closeEditModal() {
        setEditingRule(null)
        edit.reset()
    }

    function handleCreate(e) {
        e.preventDefault()
        create.post("/admin/rules", {
            preserveScroll: true,
            onSuccess: () => closeCreateModal(),
        })
    }

    function handleUpdate(e) {
        e.preventDefault()
        edit.put(`/admin/rules/${editingRule.id}`, {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
        })
    }

    function handleDelete() {
        if (!deleteTarget) return
        router.delete(`/admin/rules/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onError: () => setDeleteTarget(null),
        })
    }

    function addItem(form, setter) {
        setter("items", [...form.data.items, ""])
    }

    function removeItem(form, setter, index) {
        if (form.data.items.length <= 1) return
        const items = form.data.items.filter((_, i) => i !== index)
        setter("items", items)
    }

    function updateItem(form, setter, index, value) {
        const items = [...form.data.items]
        items[index] = value
        setter("items", items)
    }

    return (
        <>
            <Head title="Tata Tertib Admin" />
            <div className="p-4 lg:p-6 space-y-6">
                {flash && showFlash && (
                    <div className="alert alert-success text-sm shadow-sm">{flash}</div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tata Tertib</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Pedoman dan aturan peminjaman board game di UPT Perpustakaan Universitas Diponegoro
                        </p>
                    </div>
                    <button onClick={openCreateModal} className="btn bg-[#2F6F62] hover:bg-[#255A4F] text-white border-none rounded-full shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Tambah Peraturan
                    </button>
                </div>

                {rules.length === 0 && (
                    <div className="card bg-white border border-[#E8F3EF] rounded-xl shadow-sm">
                        <div className="card-body p-6 text-center text-slate-400">
                            Belum ada peraturan. Klik "Tambah Peraturan" untuk menambahkan.
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {rules.map((section) => (
                        <div
                            key={section.id}
                            className="card bg-white border border-[#E8F3EF] rounded-xl shadow-sm relative group"
                        >
                            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEditModal(section)}
                                    className="btn btn-xs btn-outline btn-warning"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(section)}
                                    className="btn btn-xs btn-outline btn-error"
                                >
                                    Hapus
                                </button>
                            </div>
                            <div className="card-body p-6">
                                <h2 className="text-lg font-semibold text-[#173C33] mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-[#2F6F62] rounded-full shrink-0" />
                                    {section.section_title}
                                </h2>
                                <ul className="space-y-3">
                                    {section.items.map((item, i) => (
                                        <li key={item.id} className="flex items-start gap-3 text-sm text-gray-700">
                                            <span className="mt-1 w-5 h-5 rounded-full bg-[#E8F3EF] flex items-center justify-center shrink-0">
                                                <span className="text-xs font-bold text-[#2F6F62]">{i + 1}</span>
                                            </span>
                                            <span>{item.content}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card bg-white border border-[#E8F3EF] rounded-xl shadow-sm">
                    <div className="card-body p-6">
                        <h2 className="text-lg font-semibold text-[#173C33] mb-2">Catatan</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Tata tertib ini dibuat untuk menjaga kenyamanan dan ketertiban bersama dalam
                            peminjaman board game. Admin diharapkan dapat menegakkan aturan ini secara
                            konsisten dan profesional. Segala perubahan pada tata tertib akan
                            diinformasikan lebih lanjut melalui pemberitahuan resmi.
                        </p>
                    </div>
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <dialog className="modal modal-open" onClick={closeCreateModal}>
                        <div className="modal-box max-w-2xl" onClick={(e) => e.stopPropagation()}>
                            <h3 className="font-bold text-lg mb-4">Tambah Peraturan Baru</h3>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="form-control">
                                    <label className="label" htmlFor="create-title">
                                        <span className="label-text">Judul Bagian</span>
                                    </label>
                                    <input
                                        id="create-title"
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={create.data.section_title}
                                        onChange={(e) => create.setData("section_title", e.target.value)}
                                        placeholder="Contoh: Ketentuan Peminjaman"
                                    />
                                    {create.errors.section_title && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{create.errors.section_title}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Butir Peraturan</span>
                                    </label>
                                    <div className="space-y-2">
                                        {create.data.items.map((item, i) => (
                                            <div key={i} className="flex gap-2">
                                                <span className="mt-3 w-6 h-6 rounded-full bg-[#E8F3EF] flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-[#2F6F62]">{i + 1}</span>
                                                </span>
                                                <div className="flex-1">
                                                    <textarea
                                                        className="textarea textarea-bordered w-full text-sm"
                                                        rows={2}
                                                        value={item}
                                                        onChange={(e) => updateItem(create, create.setData, i, e.target.value)}
                                                        placeholder="Tulis butir peraturan..."
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm mt-2 text-red-500"
                                                    onClick={() => removeItem(create, create.setData, i)}
                                                    disabled={create.data.items.length <= 1}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm mt-2 text-[#2F6F62] self-start"
                                        onClick={() => addItem(create, create.setData)}
                                    >
                                        + Tambah butir
                                    </button>
                                    {create.errors.items && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{create.errors.items}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="modal-action">
                                    <button type="button" className="btn btn-ghost" onClick={closeCreateModal}>
                                        Batal
                                    </button>
                                    <button type="submit" className="btn bg-[#2F6F62] hover:bg-[#255A4F] text-white border-none" disabled={create.processing}>
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
                {editingRule && (
                    <dialog className="modal modal-open" onClick={closeEditModal}>
                        <div className="modal-box max-w-2xl" onClick={(e) => e.stopPropagation()}>
                            <h3 className="font-bold text-lg mb-4">Edit Peraturan</h3>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="form-control">
                                    <label className="label" htmlFor="edit-title">
                                        <span className="label-text">Judul Bagian</span>
                                    </label>
                                    <input
                                        id="edit-title"
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={edit.data.section_title}
                                        onChange={(e) => edit.setData("section_title", e.target.value)}
                                    />
                                    {edit.errors.section_title && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{edit.errors.section_title}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Butir Peraturan</span>
                                    </label>
                                    <div className="space-y-2">
                                        {edit.data.items.map((item, i) => (
                                            <div key={i} className="flex gap-2">
                                                <span className="mt-3 w-6 h-6 rounded-full bg-[#E8F3EF] flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-[#2F6F62]">{i + 1}</span>
                                                </span>
                                                <div className="flex-1">
                                                    <textarea
                                                        className="textarea textarea-bordered w-full text-sm"
                                                        rows={2}
                                                        value={item}
                                                        onChange={(e) => updateItem(edit, edit.setData, i, e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm mt-2 text-red-500"
                                                    onClick={() => removeItem(edit, edit.setData, i)}
                                                    disabled={edit.data.items.length <= 1}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm mt-2 text-[#2F6F62] self-start"
                                        onClick={() => addItem(edit, edit.setData)}
                                    >
                                        + Tambah butir
                                    </button>
                                    {edit.errors.items && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{edit.errors.items}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="modal-action">
                                    <button type="button" className="btn btn-ghost" onClick={closeEditModal}>
                                        Batal
                                    </button>
                                    <button type="submit" className="btn bg-[#2F6F62] hover:bg-[#255A4F] text-white border-none" disabled={edit.processing}>
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
                                Apakah Anda yakin ingin menghapus bagian peraturan{" "}
                                <strong>{deleteTarget.section_title}</strong>?
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="modal-action">
                                <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>
                                    Batal
                                </button>
                                <button className="btn btn-error" onClick={handleDelete}>
                                    Hapus
                                </button>
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button onClick={() => setDeleteTarget(null)}>close</button>
                        </form>
                    </dialog>
                )}
            </div>
        </>
    )
}