import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { WARNA } from "./theme";
import { IkonDadu, IkonChevron } from "./icons";
import { pipDariJumlahPemain } from "./format";

export default function GaleriGambar({ game, warna }) {
    const slides = useMemo(
        () => game.link_foto?.filter(Boolean) ?? [],
        [game.link_foto]
    );
    const [index, setIndex] = useState(0);
    const [grabbing, setGrabbing] = useState(false);
    const dragOccurredRef = useRef(false);
    const adaBanyak = slides.length > 1;

    useEffect(() => {
        setIndex(0);
    }, [game.id]);

    const geser = useCallback((arah) => setIndex((i) => (i + arah + slides.length) % slides.length), [slides.length]);

    const handleDragStart = useCallback(() => {
        setGrabbing(true);
        dragOccurredRef.current = false;
    }, []);

    const handleDrag = useCallback((_, info) => {
        if (Math.abs(info.offset.x) > 5) {
            dragOccurredRef.current = true;
        }
    }, []);

    const handleDragEnd = useCallback((_, info) => {
        setGrabbing(false);
        const threshold = 80;
        const offsetX = info.offset.x;
        const velocityX = info.velocity.x;
        if (offsetX > threshold || velocityX > 500) {
            geser(-1);
        } else if (offsetX < -threshold || velocityX < -500) {
            geser(1);
        }
    }, [geser]);

    return (
        <motion.div
            className={`relative min-h-[320px] md:min-h-[540px] flex items-center justify-center p-10 overflow-hidden bg-white ${
                adaBanyak ? (grabbing ? 'cursor-grabbing' : 'cursor-grab') : ''
            }`}
            drag={adaBanyak ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
        >
            {slides.length > 0 ? (
                slides.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt={game.nama}
                        className="absolute inset-0 m-auto max-w-[80%] max-h-[80%] object-contain transition-opacity duration-500 pointer-events-none"
                        style={{ opacity: i === index ? 1 : 0 }}
                        draggable={false}
                    />
                ))
            ) : (
                <div className="flex items-center justify-center scale-[2.5] pointer-events-none">
                    <IkonDadu pip={pipDariJumlahPemain(game.jumlah_pemain)} color={warna} />
                </div>
            )}

            {adaBanyak && (
                <>
                    <button
                        type="button"
                        onClick={() => geser(-1)}
                        aria-label="Sebelumnya"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md text-slate-700 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    >
                        <IkonChevron arah="kiri" className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => geser(1)}
                        aria-label="Selanjutnya"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md text-slate-700 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    >
                        <IkonChevron arah="kanan" className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
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
        </motion.div>
    );
}