const WARNA = {
    hijauTua: "#173C33",
};

export default function Footer() {
    return (
        <footer
            className="text-green-50"
            style={{ backgroundColor: WARNA.hijauTua }}
        >
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2">
                {/* Service Hours */}
                <div className="text-center md:text-left md:pl-10">
                    <h3 className="text-sm font-semibold tracking-wide text-emerald-300 uppercase mb-4">
                        Service Hours
                    </h3>
                    <div className="space-y-2 text-sm text-green-200/90 leading-relaxed">
                        <p>Monday – Thursday: 07.30 – 19.00</p>
                        <p>Friday: 07.30 – 19.00</p>
                        <p>Saturday: 08.00 – 14.00</p>
                        <p>Sunday and Public Holidays: CLOSED</p>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="text-center md:text-left">
                    <h3 className="text-sm font-semibold tracking-wide text-emerald-300 uppercase mb-4">
                        UPT Perpustakaan Dan Undip Press
                    </h3>
                    <div className="space-y-2 text-sm text-green-200/90 leading-relaxed">
                        <p>Jl. Prof Sudarto, SH Gedung Widya Puraya, Tembalang, Semarang</p>
                        <p>024 – 7460042</p>
                        <p>NPP : 3374102D1000001</p>
                        <p>Email: perpustakaanundip@gmail.com</p>
                        <p>WA: 0821-3587-6098</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10" />
            <p className="relative -left-10 text-center text-xs text-white/60 pb-6 pt-4 px-6">
                &copy; {new Date().getFullYear()} UPT Perpustakaan Universitas Diponegoro
            </p>
        </footer>
    );
}
