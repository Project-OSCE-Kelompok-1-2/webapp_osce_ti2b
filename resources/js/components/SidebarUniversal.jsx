import React from "react";
import { usePage, Link } from "@inertiajs/react";
import {
    Home,
    Users,
    UserCheck,
    FileText,
    Bookmark,
    Settings,
    ChevronsLeft,
    ChevronsRight,
    BookOpen,
    GraduationCap,
} from "lucide-react";

// --- MENU DEFINITIONS ---
const adminMenus = [
    { label: "Beranda", icon: <Home />, href: "/admin/dashboard" },
    { label: "Stase", icon: <BookOpen />, href: "/admin/stase" },
    { label: "Mahasiswa", icon: <Users />, href: "/admin/mahasiswa" },
    { label: "Dosen", icon: <UserCheck />, href: "/admin/dosen" },
    { label: "OSCE", icon: <FileText />, href: "/admin/osce" },
    { label: "Rekap Nilai", icon: <Bookmark />, href: "/admin/rekap-nilai" },
];

const userMenus = [
    { label: "Beranda", icon: <Home />, href: "/dashboard" },
    { label: "Ujian OSCE", icon: <FileText />, href: "/osce" },
    {
        label: "Hasil Penilaian",
        icon: <GraduationCap />,
        href: "/mahasiswa/nilai",
    },
];

const SidebarUniversal = ({ isOpen, setIsOpen }) => {
    const { url } = usePage();
    const currentUrl = url || "/mahasiswa/nilai";
    const isAdmin = currentUrl.startsWith("/admin");

    const menuItems = isAdmin ? adminMenus : userMenus;
    const settingsLink = isAdmin ? "/admin/pengaturan" : "/pengaturan";
    const userName = isAdmin ? "Admin Fakultas" : "Mahasiswa";
    const userEmail = isAdmin
        ? "admin.fakultas@kampus.ac.id"
        : "mahasiswa@polines.ac.id";

    // --- STYLE LOGIC ---
    const getLinkClass = (active) => {
        let base =
            "flex items-center gap-3 p-3 rounded-r-lg mb-1 transition-all duration-300 group relative overflow-hidden ";

        // Alignment: Center icon when closed, Start when open
        base += isOpen ? "justify-start px-4" : "justify-center px-0";

        if (active) {
            return (
                base + " bg-blue-50 text-blue-600 border-l-4 border-blue-600"
            );
        } else {
            return base + " text-gray-500 hover:bg-gray-50 hover:text-blue-600";
        }
    };

    return (
        <aside
            // FIXED & Z-50: Agar sidebar mengambang di atas konten saat melebar
            className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-2xl z-50 transition-all duration-300 ease-in-out flex flex-col
            ${isOpen ? "w-72" : "w-20"}`}
        >
            {/* --- TOGGLE BUTTON --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-10 bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700 transition-colors border-2 border-white focus:outline-none z-50"
            >
                {isOpen ? (
                    <ChevronsLeft size={16} />
                ) : (
                    <ChevronsRight size={16} />
                )}
            </button>

            {/* --- PROFILE HEADER --- */}
            <div
                className={`flex items-center gap-3 p-6 h-24 border-b border-gray-100 transition-all duration-300 ${
                    !isOpen && "justify-center p-0"
                }`}
            >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                    {userName.charAt(0)}
                </div>

                <div
                    className={`flex flex-col overflow-hidden transition-all duration-300 ${
                        isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                    }`}
                >
                    <span className="font-bold text-gray-800 text-sm whitespace-nowrap">
                        {userName}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                        {userEmail}
                    </span>
                </div>
            </div>

            {/* --- MENU LIST --- */}
            <nav className="flex-1 overflow-y-auto py-6 pr-3">
                <div className="flex flex-col">
                    {menuItems.map((item, index) => {
                        const active = currentUrl.startsWith(item.href);
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={getLinkClass(active)}
                                title={!isOpen ? item.label : ""}
                            >
                                <div
                                    className={`flex-shrink-0 transition-colors ${
                                        active
                                            ? "text-blue-600"
                                            : "text-gray-400 group-hover:text-blue-600"
                                    }`}
                                >
                                    {React.cloneElement(item.icon, {
                                        size: 22,
                                    })}
                                </div>

                                <span
                                    className={`whitespace-nowrap font-medium text-sm transition-all duration-300 origin-left 
                                    ${
                                        isOpen
                                            ? "opacity-100 ml-0 scale-100"
                                            : "opacity-0 ml-[-10px] scale-0 w-0 overflow-hidden"
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* --- FOOTER --- */}
            <div className="p-4 border-t border-gray-100">
                <Link
                    href={settingsLink}
                    className={`flex items-center gap-3 p-3 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-all duration-300 group
                    ${isOpen ? "justify-start" : "justify-center"}`}
                >
                    <Settings
                        size={22}
                        className="flex-shrink-0 text-gray-400 group-hover:text-blue-600"
                    />
                    <span
                        className={`whitespace-nowrap font-medium text-sm transition-all duration-300 ${
                            isOpen
                                ? "opacity-100 w-auto"
                                : "opacity-0 w-0 overflow-hidden"
                        }`}
                    >
                        Pengaturan
                    </span>
                </Link>
                {isOpen && (
                    <div className="mt-2 text-xs text-center text-gray-300 py-2">
                        v1.0.0 © Polines
                    </div>
                )}
            </div>
        </aside>
    );
};

export default SidebarUniversal;
