import LanguageToggle from "./LanguageToggle";
import { WARNA } from "./theme";
import { useState } from "react";

/* Ikon media sosial — bentuk generik/monoline, bukan reproduksi logo resmi. */
function IkonYoutube(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <rect x="2.5" y="6" width="19" height="12" rx="4" />
            <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
        </svg>
    );
}
function IkonInstagram(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
        </svg>
    );
}
function IkonTiktok(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path d="M13 3v11.2a3 3 0 1 1-2.2-2.9" />
            <path d="M13 3c.4 2.2 2 3.8 4.2 4.1" />
        </svg>
    );
}
function IkonDigilib(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Lingkaran luar */}
      <circle cx="12" cy="12" r="8" />

      {/* Garis vertikal */}
      <path d="M12 4C10 6 9 9 9 12s1 6 3 8" />
      <path d="M12 4c2 2 3 5 3 8s-1 6-3 8" />

      {/* Garis horizontal */}
      <path d="M4 12h16" />
      <path d="M6 8h12" />
      <path d="M6 16h12" />
    </svg>
  );
}

export default function TopNavbar({ bahasa, setBahasa }) {
    const [openMenu, setOpenMenu] = useState(false);
    return (
        <div className="bg-white border-b border-slate-200">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                {/* Desktop (md+) */}
                <div className="hidden md:flex items-center justify-between py-2">
                    {/* Kiri: Logo + Nama Institusi */}
                    <a href="/katalog" className="flex items-center gap-4 shrink-0">
                        <img
                            src="/assets/logo_undip.png"
                            alt="Universitas Diponegoro"
                            className="h-11 w-auto object-contain"
                        />
                        {/* Jika logo UPT punya banyak whitespace bawaan, sesuaikan h-11 ini menjadi h-12 atau h-14 */}
                        <img
                            src="/images/logo-upt.png"
                            alt="UPT Perpustakaan Undip"
                            className="h-10 w-auto object-contain"
                        />
                    </a>

                    <div className="flex items-center gap-5 shrink-0">
                        <LanguageToggle bahasa={bahasa} setBahasa={setBahasa} />
                        <div className="flex items-center gap-3" style={{ color: WARNA.hijauUtama }}>
                            <a
                                href="https://digilib.undip.ac.id/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                            >
                                <IkonDigilib className="w-5 h-5" />
                                <span className="text-xs hidden xl:inline">Digilib</span>
                            </a>
                            <a
                                href="https://youtube.com/@perpustakaanundip?si=RgDQgwp-UlPD7ryq"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                            >
                                <IkonYoutube className="w-5 h-5" />
                                <span className="text-xs hidden xl:inline">Youtube</span>
                            </a>
                            <a
                                href="https://www.instagram.com/perpus.undip?igsh=MTh4bXFtd3AzbmRmdQ=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                            >
                                <IkonInstagram className="w-5 h-5" />
                                <span className="text-xs hidden xl:inline">Instagram</span>
                            </a>
                            <a
                                href="https://www.tiktok.com/@perpus.undip.press?_r=1&_t=ZS-97okoKr4q4S"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                            >
                                <IkonTiktok className="w-5 h-5" />
                                <span className="text-xs hidden xl:inline">TikTok</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Mobile (< md) */}
<div className="md:hidden py-2 relative">
    <div className="flex items-center justify-between">

        {/* Logo */}
        <a href="/katalog" className="flex items-center gap-3">
            <img
                src="/assets/logo_undip.png"
                alt="Universitas Diponegoro"
                className="h-9 w-auto object-contain"
            />
            <img
                src="/images/logo-upt.png"
                alt="UPT Perpustakaan Undip"
                className="h-8 w-auto object-contain"
            />
        </a>

        {/* Toggle + Menu */}
        <div className="flex items-center gap-2">

            <LanguageToggle
                bahasa={bahasa}
                setBahasa={setBahasa}
            />

            <button
                onClick={() => setOpenMenu(!openMenu)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <circle cx="12" cy="5" r="1.8" />
                    <circle cx="12" cy="12" r="1.8" />
                    <circle cx="12" cy="19" r="1.8" />
                </svg>
            </button>

        </div>
    </div>

    {openMenu && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 z-50">

            <a
                href="https://digilib.undip.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                style={{ color: WARNA.hijauUtama }}
            >
                <IkonDigilib className="w-5 h-5" />
                <span>Digilib</span>
            </a>

            <a
                href="https://youtube.com/@perpustakaanundip?si=RgDQgwp-UlPD7ryq"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                style={{ color: WARNA.hijauUtama }}
            >
                <IkonYoutube className="w-5 h-5" />
                <span>Youtube</span>
            </a>

            <a
                href="https://www.instagram.com/perpus.undip?igsh=MTh4bXFtd3AzbmRmdQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                style={{ color: WARNA.hijauUtama }}
            >
                <IkonInstagram className="w-5 h-5" />
                <span>Instagram</span>
            </a>

            <a
                href="https://www.tiktok.com/@perpus.undip.press?_r=1&_t=ZS-97okoKr4q4S"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                style={{ color: WARNA.hijauUtama }}
            >
                <IkonTiktok className="w-5 h-5" />
                <span>TikTok</span>
            </a>

        </div>
    )}
</div>
            </div>
        </div>
    );
}