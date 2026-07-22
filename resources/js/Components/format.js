export function pipDariJumlahPemain(text) {
    const match = (text || "").match(/\d+/);
    return match ? parseInt(match[0], 10) : 2;
}

export function formatPemain(text, t) {
    if (!text) return "-";
    const angka = text.replace(/pemain/i, "").trim();
    return `${angka} ${t.pemain}`;
}

export function formatDurasi(text, t) {
    if (!text) return "-";
    const angka = text.replace(/menit/i, "").trim();
    return `${angka} ${t.menit}`;
}

export function labelKesulitan(nilai, t) {
    if (nilai <= 2) return t.ringan;
    if (nilai <= 3.5) return t.sedang;
    return t.berat;
}