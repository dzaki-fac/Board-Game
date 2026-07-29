import { useState } from "react"
import { Head, router, usePage } from "@inertiajs/react"

function EditModal({ carousel, onClose }) {
    const [form, setForm] = useState({
        title: carousel.title,
        description: carousel.description || "",
        detail_title: carousel.detail_title || "",
        detail_description: carousel.detail_description || "",
        points: carousel.points && carousel.points.length ? [...carousel.points] : [""],
        theme: carousel.theme || "welcome",
        bg_image: carousel.bg_image || "",
    })
    const [saving, setSaving] = useState(false)

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

    function save() {
        if (saving) return
        setSaving(true)
        router.put(
            `/admin/carousel/${carousel.id}`,
            {
                title: form.title.trim(),
                description: form.description.trim(),
                detail_title: form.detail_title.trim(),
                detail_description: form.detail_description.trim(),
                points: form.points.map((p) => p.trim()).filter(Boolean),
                theme: form.theme,
                bg_image: form.bg_image.trim(),
            },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
                onSuccess: () => onClose(),
            },
        )
    }

    const themes = [
        { value: "welcome", label: "Welcome" },
        { value: "procedure", label: "Procedure" },
        { value: "rules", label: "Rules" },
        { value: "sanksi", label: "Sanksi" },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Carousel</h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-square text-gray-400 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                        <textarea
                            value={form.title}
                            onChange={(e) => set("title", e.target.value)}
                            className="textarea textarea-bordered text-sm w-full"
                            rows={2}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => set("description", e.target.value)}
                            className="textarea textarea-bordered text-sm w-full"
                            rows={2}
                        />
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                        <select
                            value={form.theme}
                            onChange={(e) => set("theme", e.target.value)}
                            className="select select-bordered select-sm w-full max-w-xs"
                        >
                            {themes.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar Latar</label>
                        <input
                            type="text"
                            value={form.bg_image}
                            onChange={(e) => set("bg_image", e.target.value)}
                            className="input input-bordered input-sm w-full"
                            placeholder="https://..."
                        />
                        {form.bg_image && (
                            <img
                                src={form.bg_image}
                                alt="preview"
                                className="mt-2 w-full max-h-40 object-cover rounded-lg"
                                onError={(e) => { e.target.style.display = "none" }}
                            />
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
                        Simpan
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

    return (
        <>
            <Head title="Carousel Admin" />
            <div className="p-4 lg:p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Carousel</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Kelola slide carousel yang tampil di halaman utama
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {carousels.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 space-y-2">
                                <h3 className="font-semibold text-gray-900 whitespace-pre-line">{item.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="badge badge-sm bg-[#D6E8F5] text-[#0E4A73] border-none">{item.theme}</span>
                                    {item.points && <span className="text-xs text-gray-400">{item.points.length} poin</span>}
                                </div>
                                {isSuperAdmin && (
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setEditItem(item)}
                                            className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-xs gap-1"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {editItem && <EditModal carousel={editItem} onClose={() => setEditItem(null)} />}
        </>
    )
}
