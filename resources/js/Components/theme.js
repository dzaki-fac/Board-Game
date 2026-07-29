export const WARNA = {
    hijauTua: "#071E30",   // top bar paling gelap (biru navy lebih gelap)
    hijauUtama: "#0E4A73", // hero & tombol utama (biru lebih gelap)
    hijauHover: "#0A3A5C", // hover state
    emas: "#2C7BAE",       // aksen (biru lebih gelap)
    emasHover: "#22638F",
    krem: "#FFFFFF",       // background utama, putih
};

export const KATEGORI_COLORS = {
    "Strategy": ["#2F6F62", "#E8F3EF"],
    "Party": ["#E8A33D", "#FDF3E1"],
    "Family": ["#3F8F63", "#E9F5EE"],
    "Cooperative": ["#C0562F", "#FBEAE1"],
    "Card Game": ["#3D5A80", "#EAF0F7"],
    "Abstract": ["#8E5FB0", "#F1E9F7"],
    "Puzzle": ["#A13D5C", "#F8E7ED"],
    "Simulation / Economic": ["#5B5F66", "#EEEFF1"],
};
export const DEFAULT_COLOR = ["#5B5F66", "#EEEFF1"];

export function warnaKategori(kategori) {
    if (Array.isArray(kategori)) {
        for (const k of kategori) {
            if (KATEGORI_COLORS[k]) return KATEGORI_COLORS[k];
        }
        return DEFAULT_COLOR;
    }
    return KATEGORI_COLORS[kategori] ?? DEFAULT_COLOR;
}