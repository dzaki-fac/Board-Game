import { useState, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";

function Svg({ className, children }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {children}
        </svg>
    );
}

function Dice5Icon({ className }) {
    return (
        <Svg className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
        </Svg>
    );
}

function StarIcon({ className }) {
    return (
        <Svg className={className}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </Svg>
    );
}

function ClipboardListIcon({ className }) {
    return (
        <Svg className={className}>
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M12 11h4" />
            <path d="M12 16h4" />
            <circle cx="8" cy="11" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
        </Svg>
    );
}

function HandHelpingIcon({ className }) {
    return (
        <Svg className={className}>
            <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" />
            <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
            <path d="m2 13 6 6" />
        </Svg>
    );
}

function RotateCwIcon({ className }) {
    return (
        <Svg className={className}>
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </Svg>
    );
}

function HistoryIcon({ className }) {
    return (
        <Svg className={className}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </Svg>
    );
}

function UserIcon({ className }) {
    return (
        <Svg className={className}>
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
        </Svg>
    );
}

function UsersIcon({ className }) {
    return (
        <Svg className={className}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </Svg>
    );
}

function LogOutIcon({ className }) {
    return (
        <Svg className={className}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </Svg>
    );
}

function PanelLeftIcon({ className }) {
    return (
        <Svg className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
        </Svg>
    );
}

function FileTextIcon({ className }) {
    return (
        <Svg className={className}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </Svg>
    );
}

const navItems = [
    { label: "Tata Tertib", href: "/admin/rules", icon: FileTextIcon },
    { label: "Board Game", href: "/admin/games", icon: Dice5Icon },
    { label: "Review", href: "/admin/reviews", icon: StarIcon },
    { label: "Permohonan", href: "/admin/permohonan", icon: ClipboardListIcon },
    { label: "Peminjaman", href: "/admin/loans", icon: HandHelpingIcon },
    { label: "Pengembalian", href: "/admin/returns", icon: RotateCwIcon },
    { label: "Riwayat", href: "/admin/history", icon: HistoryIcon },
    { label: "Akun", href: "/admin/accounts", icon: UsersIcon },
];

export default function Layout({ children }) {
    const admin = usePage().props.auth?.admin;
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [tooltip, setTooltip] = useState({ show: false, label: "", top: 0 });
    const [accountDropdown, setAccountDropdown] = useState(false);
    const itemRefs = useRef({});
    const dropdownRef = useRef(null);

    const toggleSidebar = () => setSidebarExpanded((prev) => !prev);

    const iconClass = "w-5 h-5";

    function showTooltip(key, label) {
        const el = itemRefs.current[key];
        if (el) {
            const rect = el.getBoundingClientRect();
            setTooltip({ show: true, label, top: rect.top + rect.height / 2 });
        }
    }

    function hideTooltip() {
        setTooltip({ show: false, label: "", top: 0 });
    }

    return (
        <div className="min-h-screen">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 bg-[#071E30] flex flex-col transition-all duration-300 ease-in-out ${
                    sidebarExpanded ? "w-64" : "w-16"
                }`}
            >
                {/* Toggle button */}
                <button
                    onClick={toggleSidebar}
                    className={`absolute top-3 w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-[#0A3A5C] z-10 ${
                        sidebarExpanded ? 'right-3' : 'left-1/2 -translate-x-1/2'
                    }`}
                >
                    <PanelLeftIcon className={iconClass} />
                </button>

                {/* Brand */}
                {sidebarExpanded && (
                    <div className="px-6 py-6 border-b border-[#0A3A5C] flex items-center gap-3 shrink-0">
                        <img
                            src="/images/logo-upt.png"
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
                            <li
                                key={item.href}
                                ref={(el) => { itemRefs.current[item.href] = el; }}
                                onMouseEnter={() => showTooltip(item.href, item.label)}
                                onMouseLeave={hideTooltip}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                                        sidebarExpanded ? 'px-3 py-2.5' : 'justify-center py-2.5'
                                    } ${
                                        isActive
                                            ? "bg-[#0E4A73] text-white"
                                            : "text-[#FAF7F2]/70 hover:bg-[#0A3A5C] hover:text-white"
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

                {/* Account Dropdown */}
                <div className="relative px-3 py-4 border-t border-[#0A3A5C] shrink-0">
                    <button
                        onClick={() => setAccountDropdown(!accountDropdown)}
                        className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors w-full ${
                            sidebarExpanded ? 'px-3 py-2.5' : 'justify-center py-2.5'
                        } text-[#FAF7F2]/70 hover:bg-[#0A3A5C] hover:text-white`}
                        ref={(el) => { itemRefs.current["account"] = el; }}
                        onMouseEnter={() => showTooltip("account", admin?.name || "Akun")}
                        onMouseLeave={hideTooltip}
                    >
                        <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                            <UserIcon className={iconClass} />
                        </span>
                        {sidebarExpanded && (
                            <span className="truncate">{admin?.name || "Akun"}</span>
                        )}
                    </button>

                    {accountDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setAccountDropdown(false)}
                            />
                            <div
                                ref={dropdownRef}
                                className={`absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 ${
                                    !sidebarExpanded && 'left-1/2 -translate-x-1/2 w-48'
                                }`}
                            >
                                <button
                                    onClick={() => {
                                        setAccountDropdown(false);
                                        router.visit('/admin/accounts', { data: { edit: 'me' } });
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Akun
                                </button>
                                <hr className="mx-3 my-1 border-gray-100" />
                                <Link
                                    href="/admin/logout"
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOutIcon className="w-4 h-4" />
                                    Keluar
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Floating Tooltip */}
                {!sidebarExpanded && tooltip.show && (
                    <span
                        className="fixed px-3 py-1.5 rounded-lg bg-[#1f1f1f] text-white text-xs font-medium shadow-lg whitespace-nowrap pointer-events-none z-50"
                        style={{
                            left: "calc(4rem + 0.75rem)",
                            top: tooltip.top,
                            transform: "translateY(-50%)",
                        }}
                    >
                        {tooltip.label}
                    </span>
                )}
            </aside>

            {/* Main Content */}
            <div
                className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
                    sidebarExpanded ? "ml-64" : "ml-16"
                }`}
            >
                {/* Topbar */}
                <div className="navbar bg-white shadow-sm border-b border-[#D6E8F5] px-4 lg:px-6 sticky top-0 z-30 h-16">
                    <div className="flex-1" />
                    <div className="flex-none gap-2 flex items-center" />
                </div>

                {/* Page Content */}
                <main className="flex-1 bg-[#FAF7F2]">{children}</main>
            </div>
        </div>
    );
}