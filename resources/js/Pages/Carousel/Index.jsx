import { useEffect, useRef, useState } from "react"
import { Head, router, usePage } from "@inertiajs/react"

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' fill='%23E2E8F0'%3E%3Crect width='400' height='200' rx='8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394A3B8' font-size='14'%3ETidak ada gambar%3C/text%3E%3C/svg%3E"

function FormModal({ carousel, onClose, defaultSortOrder }) {
    const isEdit = !!carousel
    const [form, setForm] = useState({
        title: carousel?.title || "",
        description: carousel?.description || "",
        detail_title: carousel?.detail_title || "",
        detail_description: carousel?.detail_description || "",
        points: carousel?.points?.length ? [...carousel.points] : [""],
        theme: carousel?.theme || "",
        sort_order: carousel?.sort_order ?? defaultSortOrder,
        image: null,
    })
    const [imagePreview, setImagePreview] = useState(
        carousel?.bg_image_url || null
    )
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})
    const fileRef = useRef(null)

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview)
            }
        }
    }, [])

    function set(field, val) {
        setForm((prev) => ({ ...prev, [field]: val }))
    }

    function addPoint() {
        setForm((prev) => ({ ...prev, points: [...prev.points, ""] }))
    }

    function removePoint(idx) {
        setForm((prev) => ({
            ...prev,
            points: prev.points.filter((_, i) => i !== idx),
        }))
    }

    function updatePoint(idx, val) {
        setForm((prev) => ({
            ...prev,
            points: prev.points.map((p, i) => (i === idx ? val : p)),
        }))
    }

    function handleImageChange(e) {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, image: "Ukuran gambar maksimal 2 MB." }))
            e.target.value = ""
            return
        }

        const allowed = ["image/jpeg", "image/png", "image/webp"]
        if (!allowed.includes(file.type)) {
            setErrors((prev) => ({ ...prev, image: "Format harus JPG, PNG, atau WEBP." }))
            e.target.value = ""
            return
        }

        setErrors((prev) => ({ ...prev, image: null }))

        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview)
        }

        setForm((prev) => ({ ...prev, image: file }))
        setImagePreview(URL.createObjectURL(file))
    }

    function save() {
        if (saving) return
        setSaving(true)
        setErrors({})

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            detail_title: form.detail_title.trim(),
            detail_description: form.detail_description.trim(),
            points: form.points.map((p) => p.trim()).filter(Boolean),
            theme: form.theme.trim(),
            sort_order: form.sort_order,
        }

        if (form.image) {
            payload.image = form.image
        }

        if (isEdit) {
            router.post(`/admin/carousel/${carousel.id}`, {
                ...payload,
                _method: "PUT",
            }, {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setSaving(false),
                onSuccess: () => onClose(),
                onError: (err) => setErrors(err),
            })
        } else {
            router.post("/admin/carousel", payload, {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setSaving(false),
                onSuccess: () => onClose(),
                onError: (err) => setErrors(err),
            })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {isEdit ? "Edit Carousel" : "Tambah Carousel"}
                    </h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-square text-gray-400 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                        <textarea
                            value={form.title}
                            onChange={(e) => set("title", e.target.value)}
                            className="textarea textarea-bordered text-sm w-full"
                            rows={2}
                            maxLength={150}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => set("description", e.target.value)}
                            className="textarea textarea-bordered text-sm w-full"
                            rows={2}
                            maxLength={500}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Detail Judul</label>
                        <textarea
                            value={form.detail_title}
                            onChange={(e) => set("detail_title", e.target.value)}
                            className="textarea textarea-bordered text-sm w-full"
                            rows={2}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Detail Deskripsi</label>
                        <textarea
                            value={form.detail_description}
                            onChange={(e) => set("detail_description", e.target.value)}
                            className="textarea textarea-bordered text-sm w-full"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tema *</label>
                        <input
                            type="text"
                            value={form.theme}
                            onChange={(e) => set("theme", e.target.value)}
                            placeholder="Contoh: welcome, procedure, event, informasi"
                            maxLength={50}
                            className="input input-bordered input-sm w-full max-w-xs"
                        />
                        {errors.theme && <p className="text-red-500 text-xs mt-1">{errors.theme}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Urutan *</label>
                        <input
                            type="text"
                            value={form.sort_order}
                            onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, "")
                                set("sort_order", v === "" ? "" : parseInt(v))
                            }}
                            min={1}
                            className="input input-bordered input-sm w-24"
                        />
                        {errors.sort_order && <p className="text-red-500 text-xs mt-1">{errors.sort_order}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gambar Carousel {!isEdit && "*"}
                        </label>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                        />
                        <p className="text-xs text-gray-400 mt-1">Format JPG, PNG, atau WEBP. Maksimal 2 MB.</p>
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}

                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-2 w-full max-h-48 object-cover rounded-lg border"
                                onError={(e) => {
                                    e.target.src = PLACEHOLDER_IMAGE
                                }}
                            />
                        ) : (
                            <div className="mt-2 w-full max-h-48 rounded-lg border bg-slate-100 flex items-center justify-center" style={{ height: 144 }}>
                                <span className="text-sm text-gray-400">Belum ada gambar</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Poin-poin</label>
                        <div className="space-y-2">
                            {form.points.map((point, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="mt-2.5 text-xs font-bold text-[#0E4A73] shrink-0 w-5 text-center">{i + 1}</span>
                                    <textarea
                                        value={point}
                                        onChange={(e) => updatePoint(i, e.target.value)}
                                        className="textarea textarea-bordered text-sm w-full min-h-[56px]"
                                    />
                                    <button
                                        onClick={() => removePoint(i)}
                                        className="btn btn-ghost btn-xs btn-square text-red-400 hover:text-red-600 mt-1 shrink-0"
                                        title="Hapus poin"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            <button onClick={addPoint} className="btn btn-ghost btn-xs gap-1 mt-1 text-[#0E4A73]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah poin
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 shrink-0">
                    <button onClick={onClose} className="btn btn-ghost btn-sm">Batal</button>
                    <button onClick={save} disabled={saving} className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-sm">
                        {saving && <span className="loading loading-spinner loading-xs" />}
                        {isEdit ? "Simpan" : "Tambah"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function Index() {
    const { carousels, auth } = usePage().props
    const isSuperAdmin = auth?.admin?.role === "admin"
    const [editItem, setEditItem] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [deleting, setDeleting] = useState(null)

    function handleDelete(item) {
        if (!confirm(`Hapus carousel "${item.title}"?`)) return
        setDeleting(item.id)
        router.delete(`/admin/carousel/${item.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleting(null),
        })
    }

    return (
        <>
            <Head title="Carousel Admin" />
            <div className="p-4 lg:p-6 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Carousel</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Kelola slide carousel yang tampil di halaman utama
                        </p>
                    </div>
                    {isSuperAdmin && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-sm gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Carousel
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {carousels.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 space-y-2">
                                <h3 className="font-semibold text-gray-900 whitespace-pre-line line-clamp-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="badge badge-sm bg-[#D6E8F5] text-[#0E4A73] border-none">{item.theme}</span>
                                    {item.points && <span className="text-xs text-gray-400">{item.points.length} poin</span>}
                                    <span className="text-xs text-gray-400">#{item.sort_order}</span>
                                </div>
                                {isSuperAdmin && (
                                    <div className="pt-2 flex items-center gap-2">
                                        <button
                                            onClick={() => setEditItem(item)}
                                            className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-xs gap-1"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item)}
                                            disabled={deleting === item.id}
                                            className="btn btn-ghost btn-xs text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
                                        >
                                            {deleting === item.id ? (
                                                <span className="loading loading-spinner loading-xs" />
                                            ) : (
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                            Hapus
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showForm && <FormModal onClose={() => setShowForm(false)} defaultSortOrder={carousels.length + 1} />}
            {editItem && <FormModal carousel={editItem} onClose={() => setEditItem(null)} />}
        </>
    )
}
