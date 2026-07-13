import { usePage, useForm, router, Head } from "@inertiajs/react"
import { useState, useEffect } from "react"

export default function Index({ slides }) {
    const { flash } = usePage().props

    const create = useForm({
        title: "",
        description: "",
        detail_title: "",
        detail_description: "",
        points: [""],
        theme: "welcome",
    })

    const edit = useForm({
        title: "",
        description: "",
        detail_title: "",
        detail_description: "",
        points: [""],
        theme: "welcome",
    })

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingSlide, setEditingSlide] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [showFlash, setShowFlash] = useState(false)
    const [previewIndex, setPreviewIndex] = useState(null)

    useEffect(() => {
        if (flash) { setShowFlash(true); const t = setTimeout(() => setShowFlash(false), 3000); return () => clearTimeout(t) }
    }, [flash])

    useEffect(() => {
        if (Object.keys(create.errors).length > 0) setShowCreateModal(true)
    }, [create.errors])

    useEffect(() => {
        if (Object.keys(edit.errors).length > 0 && editingSlide) setEditingSlide({ ...editingSlide })
    }, [edit.errors, editingSlide])

    function openCreateModal() {
        create.reset()
        create.setData({ title: "", description: "", detail_title: "", detail_description: "", points: [""], theme: "welcome" })
        setShowCreateModal(true)
    }

    function closeCreateModal() {
        setShowCreateModal(false)
        create.reset()
    }

    function openEditModal(slide) {
        setEditingSlide(slide)
        edit.setData({
            title: slide.title,
            description: slide.description,
            detail_title: slide.detail_title,
            detail_description: slide.detail_description,
            points: slide.points,
            theme: slide.theme,
        })
    }

    function closeEditModal() {
        setEditingSlide(null)
        edit.reset()
    }

    function handleCreate(e) {
        e.preventDefault()
        create.post("/admin/carousel", {
            preserveScroll: true,
            onSuccess: () => closeCreateModal(),
        })
    }

    function handleUpdate(e) {
        e.preventDefault()
        edit.put(`/admin/carousel/${editingSlide.id}`, {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
        })
    }

    function handleDelete() {
        if (!deleteTarget) return
        router.delete(`/admin/carousel/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onError: () => setDeleteTarget(null),
        })
    }

    function moveSlideUp(index) {
        if (index === 0) return
        const arr = slides.map((s) => ({ id: s.id, sort_order: s.sort_order }))
        const temp = arr[index - 1].sort_order
        arr[index - 1].sort_order = arr[index].sort_order
        arr[index].sort_order = temp
        router.put("/admin/carousel/reorder", { slides: arr }, { preserveScroll: true })
    }

    function moveSlideDown(index) {
        if (index >= slides.length - 1) return
        const arr = slides.map((s) => ({ id: s.id, sort_order: s.sort_order }))
        const temp = arr[index + 1].sort_order
        arr[index + 1].sort_order = arr[index].sort_order
        arr[index].sort_order = temp
        router.put("/admin/carousel/reorder", { slides: arr }, { preserveScroll: true })
    }

    function addPoint(form, setter) {
        setter("points", [...form.data.points, ""])
    }

    function removePoint(form, setter, index) {
        if (form.data.points.length <= 1) return
        const items = form.data.points.filter((_, i) => i !== index)
        setter("points", items)
    }

    function updatePoint(form, setter, index, value) {
        const items = [...form.data.points]
        items[index] = value
        setter("points", items)
    }

    const themeLabels = { welcome: "Selamat Datang", procedure: "Tata Cara", rules: "Ketentuan" }

    return (
        <>
            <Head title="Carousel Admin" />
            <div className="p-4 lg:p-6 space-y-6">
                {flash && showFlash && (
                    <div className="alert alert-success text-sm shadow-sm">{flash}</div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Carousel</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Kelola slide carousel yang tampil di halaman katalog
                        </p>
                    </div>
                    <button onClick={openCreateModal} className="btn bg-[#2F6F62] hover:bg-[#255A4F] text-white border-none rounded-full shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Tambah Slide
                    </button>
                </div>

                {slides.length === 0 && (
                    <div className="card bg-white border border-[#E8F3EF] rounded-xl shadow-sm">
                        <div className="card-body p-6 text-center text-slate-400">
                            Belum ada slide. Klik "Tambah Slide" untuk menambahkan.
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {slides.map((slide, i) => (
                        <div key={slide.id} className="card bg-white border border-[#E8F3EF] rounded-xl shadow-sm">
                            <div className="card-body p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="w-7 h-7 rounded-full bg-[#2F6F62] text-white flex items-center justify-center text-sm font-bold shrink-0">
                                                {i + 1}
                                            </span>
                                            <h2 className="text-lg font-semibold text-[#173C33] truncate">
                                                {slide.title}
                                            </h2>
                                            <span className="badge badge-sm rounded bg-[#E8F3EF] text-[#2F6F62] border-[#B8D5C8]">
                                                {themeLabels[slide.theme] || slide.theme}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                            {slide.description}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {slide.points.length} poin &middot; {slide.detail_title}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <button
                                            onClick={() => moveSlideUp(i)}
                                            disabled={i === 0}
                                            className="btn btn-xs btn-ghost btn-square disabled:opacity-30"
                                            title="Naik"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button
                                            onClick={() => moveSlideDown(i)}
                                            disabled={i >= slides.length - 1}
                                            className="btn btn-xs btn-ghost btn-square disabled:opacity-30"
                                            title="Turun"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                        <button
                                            onClick={() => openEditModal(slide)}
                                            className="btn btn-xs btn-outline btn-warning"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(slide)}
                                            className="btn btn-xs btn-outline btn-error"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <dialog className="modal modal-open" onClick={closeCreateModal}>
                        <div className="modal-box max-w-3xl" onClick={(e) => e.stopPropagation()}>
                            <h3 className="font-bold text-lg mb-4">Tambah Slide Baru</h3>
                            <form onSubmit={handleCreate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label" htmlFor="create-title">
                                            <span className="label-text">Judul</span>
                                        </label>
                                        <input
                                            id="create-title"
                                            type="text"
                                            className="input input-bordered w-full"
                                            value={create.data.title}
                                            onChange={(e) => create.setData("title", e.target.value)}
                                            placeholder="Contoh: Selamat Datang"
                                        />
                                        {create.errors.title && <label className="label"><span className="label-text-alt text-error">{create.errors.title}</span></label>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label" htmlFor="create-theme">
                                            <span className="label-text">Tema</span>
                                        </label>
                                        <select
                                            id="create-theme"
                                            className="select select-bordered w-full"
                                            value={create.data.theme}
                                            onChange={(e) => create.setData("theme", e.target.value)}
                                        >
                                            <option value="welcome">Selamat Datang</option>
                                            <option value="procedure">Tata Cara</option>
                                            <option value="rules">Ketentuan</option>
                                        </select>
                                        {create.errors.theme && <label className="label"><span className="label-text-alt text-error">{create.errors.theme}</span></label>}
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label" htmlFor="create-description">
                                        <span className="label-text">Deskripsi (tampilan carousel)</span>
                                    </label>
                                    <input
                                        id="create-description"
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={create.data.description}
                                        onChange={(e) => create.setData("description", e.target.value)}
                                        placeholder="Teks pendek di slide carousel"
                                    />
                                    {create.errors.description && <label className="label"><span className="label-text-alt text-error">{create.errors.description}</span></label>}
                                </div>

                                <div className="form-control">
                                    <label className="label" htmlFor="create-detail_title">
                                        <span className="label-text">Judul Detail (modal)</span>
                                    </label>
                                    <input
                                        id="create-detail_title"
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={create.data.detail_title}
                                        onChange={(e) => create.setData("detail_title", e.target.value)}
                                        placeholder="Judul saat diklik"
                                    />
                                    {create.errors.detail_title && <label className="label"><span className="label-text-alt text-error">{create.errors.detail_title}</span></label>}
                                </div>

                                <div className="form-control">
                                    <label className="label" htmlFor="create-detail_description">
                                        <span className="label-text">Deskripsi Detail (modal)</span>
                                    </label>
                                    <textarea
                                        id="create-detail_description"
                                        className="textarea textarea-bordered w-full"
                                        rows={2}
                                        value={create.data.detail_description}
                                        onChange={(e) => create.setData("detail_description", e.target.value)}
                                        placeholder="Deskripsi panjang di modal detail"
                                    />
                                    {create.errors.detail_description && <label className="label"><span className="label-text-alt text-error">{create.errors.detail_description}</span></label>}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Poin Detail</span>
                                    </label>
                                    <div className="space-y-2">
                                        {create.data.points.map((point, i) => (
                                            <div key={i} className="flex gap-2">
                                                <span className="mt-3 w-6 h-6 rounded-full bg-[#E8F3EF] flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-[#2F6F62]">{i + 1}</span>
                                                </span>
                                                <div className="flex-1">
                                                    <textarea
                                                        className="textarea textarea-bordered w-full text-sm"
                                                        rows={2}
                                                        value={point}
                                                        onChange={(e) => updatePoint(create, create.setData, i, e.target.value)}
                                                        placeholder="Tulis poin..."
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm mt-2 text-red-500"
                                                    onClick={() => removePoint(create, create.setData, i)}
                                                    disabled={create.data.points.length <= 1}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm mt-2 text-[#2F6F62] self-start"
                                        onClick={() => addPoint(create, create.setData)}
                                    >
                                        + Tambah poin
                                    </button>
                                    {create.errors.points && <label className="label"><span className="label-text-alt text-error">{create.errors.points}</span></label>}
                                </div>

                                <div className="modal-action">
                                    <button type="button" className="btn btn-ghost" onClick={closeCreateModal}>Batal</button>
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
                {editingSlide && (
                    <dialog className="modal modal-open" onClick={closeEditModal}>
                        <div className="modal-box max-w-3xl" onClick={(e) => e.stopPropagation()}>
                            <h3 className="font-bold text-lg mb-4">Edit Slide</h3>
                            <form onSubmit={handleUpdate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label" htmlFor="edit-title">
                                            <span className="label-text">Judul</span>
                                        </label>
                                        <input
                                            id="edit-title"
                                            type="text"
                                            className="input input-bordered w-full"
                                            value={edit.data.title}
                                            onChange={(e) => edit.setData("title", e.target.value)}
                                        />
                                        {edit.errors.title && <label className="label"><span className="label-text-alt text-error">{edit.errors.title}</span></label>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label" htmlFor="edit-theme">
                                            <span className="label-text">Tema</span>
                                        </label>
                                        <select
                                            id="edit-theme"
                                            className="select select-bordered w-full"
                                            value={edit.data.theme}
                                            onChange={(e) => edit.setData("theme", e.target.value)}
                                        >
                                            <option value="welcome">Selamat Datang</option>
                                            <option value="procedure">Tata Cara</option>
                                            <option value="rules">Ketentuan</option>
                                        </select>
                                        {edit.errors.theme && <label className="label"><span className="label-text-alt text-error">{edit.errors.theme}</span></label>}
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label" htmlFor="edit-description">
                                        <span className="label-text">Deskripsi (tampilan carousel)</span>
                                    </label>
                                    <input
                                        id="edit-description"
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={edit.data.description}
                                        onChange={(e) => edit.setData("description", e.target.value)}
                                    />
                                    {edit.errors.description && <label className="label"><span className="label-text-alt text-error">{edit.errors.description}</span></label>}
                                </div>

                                <div className="form-control">
                                    <label className="label" htmlFor="edit-detail_title">
                                        <span className="label-text">Judul Detail (modal)</span>
                                    </label>
                                    <input
                                        id="edit-detail_title"
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={edit.data.detail_title}
                                        onChange={(e) => edit.setData("detail_title", e.target.value)}
                                    />
                                    {edit.errors.detail_title && <label className="label"><span className="label-text-alt text-error">{edit.errors.detail_title}</span></label>}
                                </div>

                                <div className="form-control">
                                    <label className="label" htmlFor="edit-detail_description">
                                        <span className="label-text">Deskripsi Detail (modal)</span>
                                    </label>
                                    <textarea
                                        id="edit-detail_description"
                                        className="textarea textarea-bordered w-full"
                                        rows={2}
                                        value={edit.data.detail_description}
                                        onChange={(e) => edit.setData("detail_description", e.target.value)}
                                    />
                                    {edit.errors.detail_description && <label className="label"><span className="label-text-alt text-error">{edit.errors.detail_description}</span></label>}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Poin Detail</span>
                                    </label>
                                    <div className="space-y-2">
                                        {edit.data.points.map((point, i) => (
                                            <div key={i} className="flex gap-2">
                                                <span className="mt-3 w-6 h-6 rounded-full bg-[#E8F3EF] flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-[#2F6F62]">{i + 1}</span>
                                                </span>
                                                <div className="flex-1">
                                                    <textarea
                                                        className="textarea textarea-bordered w-full text-sm"
                                                        rows={2}
                                                        value={point}
                                                        onChange={(e) => updatePoint(edit, edit.setData, i, e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm mt-2 text-red-500"
                                                    onClick={() => removePoint(edit, edit.setData, i)}
                                                    disabled={edit.data.points.length <= 1}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm mt-2 text-[#2F6F62] self-start"
                                        onClick={() => addPoint(edit, edit.setData)}
                                    >
                                        + Tambah poin
                                    </button>
                                    {edit.errors.points && <label className="label"><span className="label-text-alt text-error">{edit.errors.points}</span></label>}
                                </div>

                                <div className="modal-action">
                                    <button type="button" className="btn btn-ghost" onClick={closeEditModal}>Batal</button>
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
                                Apakah Anda yakin ingin menghapus slide <strong>{deleteTarget.title}</strong>?
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="modal-action">
                                <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Batal</button>
                                <button className="btn btn-error" onClick={handleDelete}>Hapus</button>
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