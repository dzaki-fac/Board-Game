import { Head } from "@inertiajs/react"

export default function Index() {
    const rules = [
        {
            title: "Ketentuan Peminjaman",
            items: [
                "Peminjaman board game hanya diperuntukkan bagi mahasiswa/i aktif Universitas Diponegoro yang memiliki KTM valid.",
                "Setiap peminjam wajib menunjukkan KTM asli pada saat peminjaman.",
                "Maksimal peminjaman 1 (satu) box board game per orang per hari.",
                "Durasi peminjaman maksimal 2x24 jam dan harus dikembalikan tepat waktu.",
            ],
        },
        {
            title: "Ketentuan Pengembalian",
            items: [
                "Board game wajib dikembalikan dalam kondisi lengkap dan tidak rusak.",
                "Keterlambatan pengembalian akan dikenakan denda sebesar Rp5.000,- per hari.",
                "Kerusakan atau kehilangan komponen board game akan dikenakan biaya penggantian sesuai harga komponen.",
                "Pengembalian dilakukan di meja sirkulasi UPT Perpustakaan Undip.",
            ],
        },
        {
            title: "Larangan",
            items: [
                "Dilarang meminjamkan board game yang dipinjam kepada pihak lain.",
                "Dilarang membawa board game keluar area UPT Perpustakaan Undip tanpa prosedur yang sah.",
                "Dilarang merusak, mencoret-coret, atau memodifikasi komponen board game.",
                "Dilarang membawa makanan dan minuman di area peminjaman board game.",
            ],
        },
        {
            title: "Sanksi",
            items: [
                "Pelanggaran terhadap tata tertib akan dikenakan sanksi sesuai tingkat pelanggaran.",
                "Pelanggaran berat dapat menyebabkan pencabutan hak peminjaman board game.",
                "Peminjam yang tidak mengembalikan board game selama 7 hari setelah batas waktu akan dilaporkan ke pihak berwenang.",
            ],
        },
    ]

    return (
        <>
            <Head title="Tata Tertib Admin" />

            <div className="p-4 lg:p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tata Tertib</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Pedoman dan aturan peminjaman board game di UPT Perpustakaan Universitas Diponegoro
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {rules.map((section) => (
                        <div
                            key={section.title}
                            className="card bg-white border border-[#E8F3EF] rounded-xl shadow-sm"
                        >
                            <div className="card-body p-6">
                                <h2 className="text-lg font-semibold text-[#173C33] mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-[#2F6F62] rounded-full shrink-0" />
                                    {section.title}
                                </h2>
                                <ul className="space-y-3">
                                    {section.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                            <span className="mt-1 w-5 h-5 rounded-full bg-[#E8F3EF] flex items-center justify-center shrink-0">
                                                <span className="text-xs font-bold text-[#2F6F62]">{i + 1}</span>
                                            </span>
                                            <span>{item}</span>
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
            </div>
        </>
    )
}
