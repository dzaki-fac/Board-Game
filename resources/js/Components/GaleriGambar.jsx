import { useEffect, useMemo, useState } from "react";
import { WARNA } from "./theme";
import { IkonDadu, IkonChevron } from "./icons";
import { pipDariJumlahPemain } from "./format";

export default function GaleriGambar({ game, warna }) {
    const slides = useMemo(
        () => game.link_foto?.filter(Boolean) ?? [],
        [game.link_foto]
    );
    const [index, setIndex] = useState(0);
    const adaBanyak = slides.length > 1;

    useEffect(() => {
        setIndex(0);
    }, [game.id]);

    const geser = (arah) => setIndex((i) => (i + arah + slides.length) % slides.length);

    return (
        <div className="relative min-h-[320px] md:min-h-[540px] flex items-center justify-center p-10 overflow-hidden bg-white">
            {slides.length > 0 ? (
                slides.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt={game.nama}
                        className="absolute inset-0 m-auto max-w-[80%] max-h-[80%] object-contain transition-opacity duration-500"
                        style={{ opacity: i === index ? 1 : 0 }}
                    />
                ))
            ) : (
                <div className="flex items-center justify-center scale-[2.5]">
                    <IkonDadu pip={pipDariJumlahPemain(game.jumlah_pemain)} color={warna} />
                </div>
            )}

            {adaBanyak && (
                <>
                    <button
                        type="button"
                        onClick={() => geser(-1)}
                        aria-label="Sebelumnya"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md text-slate-700 flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <IkonChevron arah="kiri" className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => geser(1)}
                        aria-label="Selanjutnya"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md text-slate-700 flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <IkonChevron arah="kanan" className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIndex(i)}
                                aria-label={`Foto ${i + 1}`}
                                className="h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: i === index ? 22 : 8,
                                    backgroundColor: i === index ? WARNA.hijauUtama : "#CFE4DC",
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}