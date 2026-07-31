import { Head } from "@inertiajs/react";
import Footer from "../Components/Footer";
import TopNavbar from "../Components/TopNavbar";
import { WARNA } from "../Components/theme";
import { BahasaContext, TEKS, useTeks, useBahasaState } from "../Components/BahasaContext";

function IsiAbout({ bahasa, setBahasa }) {
    const t = useTeks();

    return (
        <div className="min-h-screen bg-white text-[15px]">
            <div>
                <TopNavbar bahasa={bahasa} setBahasa={setBahasa} />
            </div>

            <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-6">
                <div className="p-6 md:p-8 rounded-2xl bg-slate-50 border border-slate-100">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: WARNA.hijauTua }}>
                        {t.aboutWebJudul}
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                        {t.aboutWebDesc}
                    </p>
                </div>

                <div className="p-6 md:p-8 rounded-2xl bg-slate-50 border border-slate-100">
                    <h2 className="text-lg md:text-xl font-bold mb-2" style={{ color: WARNA.hijauTua }}>
                        {t.aboutTimJudul}
                    </h2>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
                        {t.aboutTimDesc}
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
                        {[
                            "Dehar Zaidan Dzaki Amirullah",
                            "Dzaki Fathul'Alim Cahyo",
                            "Haikal Rafli Sembiring",
                            "Nadia Azura Nurhaniya",
                            "Olivia Oktaviani",
                        ].map((nama) => (
                            <li key={nama} className="flex items-center gap-2.5 text-sm md:text-base text-slate-700">
                                <span
                                    className="shrink-0 w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: WARNA.hijauUtama }}
                                />
                                {nama}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default function About() {
    const [bahasa, setBahasa] = useBahasaState();

    return (
        <BahasaContext.Provider value={TEKS[bahasa]}>
            <Head title="Tentang | Board Game" />
            <IsiAbout bahasa={bahasa} setBahasa={setBahasa} />
        </BahasaContext.Provider>
    );
}

About.layout = (page) => page;
