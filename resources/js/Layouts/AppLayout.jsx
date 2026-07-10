import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    House,
    Dice5,
    ClipboardList,
    PackageOpen,
    PackageCheck,
    History,
    UserRound,
    LogOut,
    PanelLeft,
} from "lucide-react";

const navItems = [
    { label: "Beranda", href: "/peminjaman/create", icon: House },
    { label: "Board Game", href: "/admin/games", icon: Dice5 },
    { label: "Permohonan", href: "/admin/permohonan", icon: ClipboardList },
    { label: "Peminjaman", href: "/admin/loans", icon: PackageOpen },
    { label: "Pengembalian", href: "/admin/returns", icon: PackageCheck },
    { label: "Riwayat", href: "/admin/history", icon: History },
    { label: "Akun", href: "/admin/accounts", icon: UserRound },
];

export default function Layout({ children }) {
    const admin = usePage().props.auth?.admin;
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const toggleSidebar = () => setSidebarExpanded((prev) => !prev);

    const iconClass = "w-5 h-5";

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 bg-[#173C33] flex flex-col transition-all duration-300 ease-in-out ${
                    sidebarExpanded ? "w-64" : "w-16"
                }`}
            >
                {/* Toggle button */}
                <button
                    onClick={toggleSidebar}
                    className={`absolute top-3 w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-[#255A4F] z-10 ${
                        sidebarExpanded ? 'right-3' : 'left-1/2 -translate-x-1/2'
                    }`}
                >
                    <PanelLeft className={iconClass} />
                </button>

                {/* Brand */}
                {sidebarExpanded && (
                    <div className="px-6 py-6 border-b border-[#255A4F] flex items-center gap-3 shrink-0">
                        <img
                            src="/assets/logo.png"
                            alt="Logo"
                            className="w-20 h-20 object-contain rounded shrink-0"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                                Sistem Peminjaman Board Game
                            </h2>
                            <p className="text-[10px] text-[#FAF7F2]/60 mt-0.5 leading-tight">
                                UPT Perpustakaan Universitas Diponegoro
                            </p>
                        </div>
                    </div>
                )}

                {/* Nav Items */}
                <ul className={`flex-1 px-3 space-y-1 overflow-y-auto ${sidebarExpanded ? 'py-4' : 'py-4 pt-14'}`}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
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
                                    className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                                        sidebarExpanded ? 'px-3 py-2.5' : 'justify-center py-2.5'
                                    } ${
                                        isActive
                                            ? "bg-[#2F6F62] text-white"
                                            : "text-[#FAF7F2]/70 hover:bg-[#255A4F] hover:text-white"
                                    }`}
                                >
                                    <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                                        <Icon className={iconClass} />
                                    </span>
                                    {sidebarExpanded && <span>{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-[#255A4F] shrink-0">
                    <Link
                        href="/admin/logout"
                        method="post"
                        as="button"
                        className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                            sidebarExpanded ? 'px-3 py-2.5' : 'justify-center py-2.5'
                        } text-[#FAF7F2]/70 hover:bg-[#255A4F] hover:text-white w-full`}
                    >
                        <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                            <LogOut className={iconClass} />
                        </span>
                        {sidebarExpanded && <span>Keluar</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
                    sidebarExpanded ? "ml-64" : "ml-16"
                }`}
            >
                {/* Topbar */}
                <div className="navbar bg-white shadow-sm border-b border-[#E8F3EF] px-4 lg:px-6 sticky top-0 z-30 h-16">
                    <div className="flex-1" />
                    <div className="flex-none gap-2 flex items-center">
                        <span className="text-sm font-medium text-[#173C33] hidden sm:block">
                            {admin?.name}
                        </span>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 bg-[#FAF7F2]">{children}</main>
            </div>
        </div>
    );
}
