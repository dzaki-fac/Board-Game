import { useState } from "react";

function Bintang({ terisi, setengah, setHover, hover, onClick }) {
    return (
        <span
            className="relative inline-block w-5 h-5 cursor-pointer"
            onClick={onClick}
            onMouseEnter={() => setHover?.(hover)}
            onMouseLeave={() => setHover?.(0)}
        >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-200" fill="currentColor">
                <path d="M12 2.5l2.9 6.1 6.6.8-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.8L12 2.5z" />
            </svg>
            {(terisi || (setengah && !terisi)) && (
                <svg
                    viewBox="0 0 24 24"
                    className="absolute inset-0 w-5 h-5 text-amber-400"
                    fill="currentColor"
                    style={{ clipPath: setengah && !terisi ? "inset(0 50% 0 0)" : undefined }}
                >
                    <path d="M12 2.5l2.9 6.1 6.6.8-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.8L12 2.5z" />
                </svg>
            )}
        </span>
    );
}

export function StarRatingDisplay({ rating = 0 }) {
    const bintang = [];
    for (let i = 1; i <= 5; i++) {
        const terisi = i <= Math.floor(rating);
        const setengah = !terisi && i === Math.ceil(rating) && rating % 1 !== 0;
        bintang.push(<Bintang key={i} terisi={terisi} setengah={setengah} />);
    }
    return <div className="inline-flex items-center gap-0.5">{bintang}</div>;
}

export function StarRatingInput({ value, onChange }) {
    const [hover, setHover] = useState(0);

    return (
        <div className="inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Bintang
                    key={i}
                    terisi={i <= (hover || value)}
                    hover={i}
                    setHover={setHover}
                    onClick={() => onChange(i)}
                />
            ))}
        </div>
    );
}
