import { Link } from "@inertiajs/react";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Board Games", href: "/games" },
    { label: "Peminjaman", href: "/loans" },
    { label: "Pengembalian", href: "/returns" },
    { label: "Riwayat Peminjaman", href: "/history" },
    { label: "Accounts", href: "/accounts" },
];

export default function Layout({ children }) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col min-h-screen">
                {/* Topbar */}
                <div className="navbar bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 sticky top-0 z-30 h-16">
                    <div className="flex-1 flex items-center gap-3">
                        <label htmlFor="drawer" className="btn btn-ghost lg:hidden btn-sm btn-square">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </label>
                    </div>
                    <div className="flex-none gap-2 flex items-center">
                        <div className="form-control hidden md:block">
                            <div className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input type="text" placeholder="Search game or borrower" className="input input-bordered input-sm pl-9 w-48 lg:w-64" />
                            </div>
                        </div>
                        {/* @route: create a GET route for /loans/create or /loans/borrow */}
                        <Link href="/loans/create" className="btn btn-primary btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Create Loan
                        </Link>
                        <button className="btn btn-ghost btn-sm btn-square relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span className="badge badge-error badge-xs absolute top-1 right-1 p-0.5 min-w-fit h-auto text-[10px] leading-none px-1">3</span>
                        </button>
                        <div className="avatar placeholder hidden sm:flex">
                            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-medium">
                                AD
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 bg-gray-50">
                    {children}
                </main>
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
                            onError={(e) => { e.target.style.display = "none" }}
                        />
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight leading-tight">Sistem Peminjaman Board Game</h2>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">UPT Perpustakaan Universitas Diponegoro</p>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <ul className="flex-1 px-3 py-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = typeof window !== "undefined" && (
                                item.href === "/"
                                    ? window.location.pathname === "/"
                                    : window.location.pathname.startsWith(item.href)
                            );
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
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}