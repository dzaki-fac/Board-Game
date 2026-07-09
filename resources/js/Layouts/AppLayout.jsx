import { Link } from "@inertiajs/react";

const navItems = [
    { label: "Beranda", href: "/peminjaman/create" },
    { label: "Board Game", href: "/admin/games" },
    { label: "Permohonan", href: "/admin/permohonan" },
    { label: "Peminjaman", href: "/admin/loans" },
    { label: "Pengembalian", href: "/admin/returns" },
    { label: "Riwayat", href: "/admin/history" },
    { label: "Akun", href: "/admin/accounts" },
];

export default function Layout({ children }) {
    return (
        <div className="drawer">
            <input id="drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col min-h-screen">
                {/* Topbar */}
                <div className="navbar bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 sticky top-0 z-30 h-16">
                    <div className="flex-1 flex items-center gap-3">
                        <label
                            htmlFor="drawer"
                            className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg hover:bg-gray-100"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mx-auto translate-y-1.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </label>
                    </div>
                    <div href='/peminjaman/create' className="flex-none gap-2 flex items-center">
                        <div className="avatar placeholder hidden sm:flex">
                            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-medium">
                                AD
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 bg-gray-50">{children}</main>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-40">
                <label htmlFor="drawer" className="drawer-overlay"></label>
                <div className="menu p-0 w-64 min-h-full bg-slate-900 flex flex-col">
                    {/* Brand */}
                    <div className="px-6 py-6 border-b border-slate-700 flex items-center gap-3">
                        <img
                            src="/assets/logo.png"
                            alt="Logo"
                            className="w-20 h-20 object-contain rounded"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                                Sistem Peminjaman Board Game
                            </h2>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                                UPT Perpustakaan Universitas Diponegoro
                            </p>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <ul className="flex-1 px-3 py-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive =
                                typeof window !== "undefined" &&
                                (item.href === "/admin"
                                    ? window.location.pathname === "/admin"
                                    : window.location.pathname.startsWith(
                                          item.href,
                                      ));
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                        /* @route: adjust href if the route name differs */
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Logout */}
                    <div className="px-3 py-4 border-t border-slate-700">
                        <Link
                            href="/admin/logout"
                            method="post"
                            as="button"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Keluar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
