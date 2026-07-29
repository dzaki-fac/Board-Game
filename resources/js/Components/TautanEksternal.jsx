export default function TautanEksternal({ link, warna, label, ikon: Ikon }) {
    if (!link) return null;
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-4 py-2 border transition-colors"
            style={{ color: warna, borderColor: `${warna}40`, backgroundColor: `${warna}0D` }}
        >
            <Ikon className="w-4 h-4" />
            {label}
        </a>
    );
}