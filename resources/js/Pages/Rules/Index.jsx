import { useState } from "react"
import { Head, router, usePage } from "@inertiajs/react"

function EditModal({ rules, onClose }) {
    const [sections, setSections] = useState(
        rules.map((r) => ({ id: r.id, title: r.title, items: [...r.items] })),
    )
    const [saving, setSaving] = useState(false)

    function addItem(sectionIdx) {
        const next = [...sections]
        next[sectionIdx] = { ...next[sectionIdx], items: [...next[sectionIdx].items, ""] }
        setSections(next)
    }

    function removeItem(sectionIdx, itemIdx) {
        const next = [...sections]
        next[sectionIdx] = {
            ...next[sectionIdx],
            items: next[sectionIdx].items.filter((_, i) => i !== itemIdx),
        }
        setSections(next)
    }

    function updateItem(sectionIdx, itemIdx, val) {
        const next = [...sections]
        next[sectionIdx] = {
            ...next[sectionIdx],
            items: next[sectionIdx].items.map((it, i) => (i === itemIdx ? val : it)),
        }
        setSections(next)
    }

    function updateTitle(sectionIdx, val) {
        const next = [...sections]
        next[sectionIdx] = { ...next[sectionIdx], title: val }
        setSections(next)
    }

    function save() {
        for (const s of sections) {
            if (!s.title.trim()) return
            if (s.items.some((it) => !it.trim())) return
        }
        setSaving(true)

        let done = 0
        for (const s of sections) {
            router.put(
                `/admin/rules/${s.id}`,
                { title: s.title.trim(), items: s.items.map((it) => it.trim()) },
                {
                    preserveScroll: true,
                    onFinish: () => {
                        done++
                        if (done === sections.length) {
                            onClose()
                            setSaving(false)
                        }
                    },
                },
            )
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Tata Tertib</h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-square text-gray-400 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
                    {sections.map((section, si) => (
                        <div key={section.id}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-1 h-6 bg-[#0E4A73] rounded-full shrink-0" />
                                <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => updateTitle(si, e.target.value)}
                                    className="input input-ghost text-lg font-semibold text-[#071E30] px-0 py-0 h-auto focus:ring-0 border-b border-transparent hover:border-gray-300 focus:border-[#0E4A73] rounded-none"
                                />
                            </div>
                            <div className="space-y-2 pl-3">
                                {section.items.map((item, ii) => (
                                    <div key={ii} className="flex items-start gap-2">
                                        <span className="mt-2.5 text-xs font-bold text-[#0E4A73] shrink-0 w-5 text-center">{ii + 1}</span>
                                        <textarea
                                            value={item}
                                            onChange={(e) => updateItem(si, ii, e.target.value)}
                                            className="textarea textarea-bordered text-sm w-full min-h-[56px]"
                                        />
                                        <button
                                            onClick={() => removeItem(si, ii)}
                                            className="btn btn-ghost btn-xs btn-square text-red-400 hover:text-red-600 mt-1 shrink-0"
                                            title="Hapus poin"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => addItem(si)} className="btn btn-ghost btn-xs gap-1 mt-1 text-[#0E4A73]">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Tambah poin
                                </button>
                            </div>
                            {si < sections.length - 1 && <hr className="mt-6 border-gray-200" />}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 shrink-0">
                    <button onClick={onClose} className="btn btn-ghost btn-sm">Batal</button>
                    <button onClick={save} disabled={saving} className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-sm">
                        {saving && <span className="loading loading-spinner loading-xs" />}
                        Simpan Semua
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function Index() {
    const { rules, auth } = usePage().props
    const isSuperAdmin = auth?.admin?.role === "admin"
    const [open, setOpen] = useState(false)

    return (
        <>
            <Head title="Tata Tertib Admin" />
            <div className="p-4 lg:p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tata Tertib</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Pedoman dan aturan peminjaman board game di UPT Perpustakaan Universitas Diponegoro
                        </p>
                    </div>
                    {isSuperAdmin && (
                        <button
                            onClick={() => setOpen(true)}
                            className="btn bg-[#0E4A73] hover:bg-[#0A3A5C] text-white border-none btn-sm gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {rules.map((section) => (
                        <div key={section.id} className="card bg-white border border-[#D6E8F5] rounded-xl shadow-sm">
                            <div className="card-body p-6">
                                <h2 className="text-lg font-semibold text-[#071E30] mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-[#0E4A73] rounded-full shrink-0" />
                                    {section.title}
                                </h2>
                                <ul className="space-y-3">
                                    {section.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                            <span className="mt-1 w-5 h-5 rounded-full bg-[#D6E8F5] flex items-center justify-center shrink-0">
                                                <span className="text-xs font-bold text-[#0E4A73]">{i + 1}</span>
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card bg-white border border-[#D6E8F5] rounded-xl shadow-sm">
                    <div className="card-body p-6">
                        <h2 className="text-lg font-semibold text-[#071E30] mb-2">Catatan</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Tata tertib ini dibuat untuk menjaga kenyamanan dan ketertiban bersama dalam
                            peminjaman board game. Admin diharapkan dapat menegakkan aturan ini secara
                            konsisten dan profesional.
                        </p>
                    </div>
                </div>
            </div>
            {open && <EditModal rules={rules} onClose={() => setOpen(false)} />}
        </>
    )
}