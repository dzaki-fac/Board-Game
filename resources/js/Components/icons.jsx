export function IkonDadu({ pip = 2, color }) {
    const layout = {
        1: [[50, 50]],
        2: [[28, 28], [72, 72]],
        3: [[28, 28], [50, 50], [72, 72]],
        4: [[28, 28], [72, 28], [28, 72], [72, 72]],
        5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
        6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
    }[Math.min(Math.max(pip, 1), 6)];

    return (
        <svg viewBox="0 0 100 100" className="w-14 h-14">
            <rect x="6" y="6" width="88" height="88" rx="18" fill="white" opacity="0.9" />
            {layout.map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="7" fill={color} />
            ))}
        </svg>
    );
}

export function IkonCari(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </svg>
    );
}

export function IkonPemain(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="9" cy="7" r="3" />
            <path d="M2 21v-1a6 6 0 0 1 12 0v1" />
            <circle cx="17" cy="8" r="2.5" />
            <path d="M22 21v-1a5 5 0 0 0-6-4.9" />
        </svg>
    );
}

export function IkonJam(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
        </svg>
    );
}

export function IkonRak(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
        </svg>
    );
}

export function IkonLabel(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M7 7h.01M20.59 13.41l-6.82 6.82a2 2 0 0 1-2.82 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        </svg>
    );
}

export function IkonPanahBawah(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

export function IkonChevron({ arah = "kiri", ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
            <path d={arah === "kiri" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
        </svg>
    );
}

export function IkonBintang({ terisi, ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill={terisi ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" {...props}>
            <path d="M12 2.5l2.9 6.1 6.6.8-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.8L12 2.5z" />
        </svg>
    );
}

export function IkonUsia(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
        </svg>
    );
}

export function IkonPlay(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function IkonBuku(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
        </svg>
    );
}