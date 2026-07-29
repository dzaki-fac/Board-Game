const WARNA = {
   hijauHover: "#0A3A5C",
};

export default function Footer() {
    return (
        <footer
            className="text-white"
            style={{ backgroundColor: WARNA.hijauHover }}
        >
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:gap-10 px-4 md:px-6 py-6 md:py-12">
                {/* Service Hours */}
                <div className="text-left md:pl-10">
                    <h3 className="text-[9px] md:text-sm font-semibold tracking-normal md:tracking-wide text-slate-400 uppercase mb-1.5 md:mb-4 whitespace-nowrap">
                        Service Hours
                    </h3>
                    <div className="space-y-1 md:space-y-2 text-[9px] md:text-sm text-white leading-snug md:leading-relaxed">
                        <p className="whitespace-nowrap">Monday – Thursday: 07.30 – 19.00</p>
                        <p className="whitespace-nowrap">Friday: 07.30 – 19.00</p>
                        <p className="whitespace-nowrap">Saturday: 08.00 – 14.00</p>
                        <p className="whitespace-nowrap">Sunday and Public Holidays: CLOSED</p>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="text-left">
                    <h3 className="text-[9px] md:text-sm font-semibold tracking-normal md:tracking-wide text-slate-400 uppercase mb-1.5 md:mb-4">
                        UPT Perpustakaan Dan Undip Press
                    </h3>
                    <div className="space-y-1 md:space-y-2 text-[9px] md:text-sm text-white leading-snug md:leading-relaxed">
                        <p>Jl. Prof Sudarto, SH Gedung Widya Puraya, Tembalang, Semarang</p>
                        <p className="whitespace-nowrap">024 – 7460042</p>
                        <p className="whitespace-nowrap">NPP : 3374102D1000001</p>
                        <p className="whitespace-nowrap">Email: perpustakaanundip@gmail.com</p>
                        <p className="whitespace-nowrap">WA: 0821-3587-6098</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10" />
            <p className="text-center text-[10px] md:text-xs text-white/60 pb-6 pt-4 px-6">
                &copy; {new Date().getFullYear()} UPT Perpustakaan Universitas Diponegoro
            </p>
        </footer>
    );
}