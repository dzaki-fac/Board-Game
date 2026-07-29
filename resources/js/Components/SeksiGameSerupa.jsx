import { Link } from "@inertiajs/react";
import { WARNA, warnaKategori } from "./theme";
import { IkonDadu } from "./icons";

function KartuGameSerupa({ item }) {
    const [warnaKartu] = warnaKategori(item.kategori);
    const kategoriLabel = Array.isArray(item.kategori) ? item.kategori[0] : item.kategori;

    return (
        <Link href={`/katalog/${item.id}`} className="shrink-0 w-44 group">
            <div className="w-44 h-44 rounded-2xl overflow-hidden flex items-center justify-center mb-2.5 border border-slate-100 p-4 bg-white">
                {item.link_foto?.[0] ? (
                    <img src={item.link_foto[0]} alt={item.nama} className="max-w-full max-h-full object-contain" />
                ) : (
                    <IkonDadu pip={2} color={warnaKartu} />
                )}
            </div>
            <p className="text-sm font-semibold text-slate-700 leading-snug line-clamp-2 group-hover:underline">
                {item.nama}
            </p>
            <p className="text-xs mt-1 font-medium" style={{ color: warnaKartu }}>
                {kategoriLabel}
            </p>
        </Link>
    );
}

export default function SeksiGameSerupa({ gameSerupa, t }) {
    if (!Array.isArray(gameSerupa) || gameSerupa.length === 0) return null;

    return (
        <div className="mt-8 rounded-3xl p-6 md:p-8" style={{ backgroundColor: WARNA.krem }}>
            <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: WARNA.hijauUtama }} />
                <h2 className="text-xl font-bold text-slate-800">{t.gameSerupa}</h2>
            </div>
            <p className="text-sm text-slate-500 mb-5 ml-3.5">{t.gameSerupaSub}</p>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {gameSerupa.map((item) => (
                    <KartuGameSerupa key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}