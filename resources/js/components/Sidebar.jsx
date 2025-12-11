import React, { useState, useEffect } from "react";
import {
    Home,
    Users,
    UserCheck,
    FileText,
    Bookmark,
    Settings,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

// --- Data Konfigurasi Multi-Role ---
const roleData = {
    admin: {
        name: "Admin Fakultas",
        email: "admin.fakultas@kampus.edu",
        imageBg: "bg-blue-600",
        menu: [
            { label: "Beranda", icon: <Home size={24} />, href: "/admin/dashboard", opacity: "100" },
            { label: "Stase", icon: <FileText size={24} />, href: "/admin/stase", opacity: "100" },
            { label: "Mahasiswa", icon: <Users size={24} />, href: "/admin/mahasiswa", opacity: "100" },
            { label: "Dosen", icon: <UserCheck size={24} />, href: "/admin/dosen", opacity: "100" },
            { label: "OSCE", icon: <FileText size={24} />, href: "/admin/osce", opacity: "100" },
            { label: "Rekap Nilai Mahasiswa", icon: <Bookmark size={24} />, href: "/admin/rekap-nilai", opacity: "100" },
        ],
    },
    penguji: {
        name: "Dr. Budi Santoso",
        email: "budi.santoso@kampus.edu",
        imageBg: "bg-green-600",
        menu: [
            { label: "Beranda", icon: <Home size={24} />, href: "/penguji/dashboard", opacity: "100" },
            { label: "Verifikasi Nilai", icon: <FileText size={24} />, href: "/penguji/osce", opacity: "100" },
        ],
    },
    mahasiswa: {
        name: "Alya Putri",
        email: "alya.putri@kampus.edu",
        imageBg: "bg-yellow-600",
        menu: [
            { label: "Dashboard", icon: <Home size={24} />, href: "/mahasiswa/dashboard", opacity: "100" },
            { label: "Rencana Stase", icon: <FileText size={24} />, href: "/mahasiswa/stase-plan", opacity: "100" },
            { label: "Logbook", icon: <Bookmark size={24} />, href: "/mahasiswa/logbook", opacity: "100" },
            { label: "Hasil Nilai", icon: <Users size={24} />, href: "/mahasiswa/nilai", opacity: "100" },
        ],
    },
};

const Sidebar = ({ type, isOpen, onToggle }) => {
    const initialRole = roleData[type] ? type : "admin";
    const [currentRole, setCurrentRole] = useState(initialRole);
    const [activePath, setActivePath] = useState("");

    const { name, email, imageBg, menu } = roleData[currentRole];

    useEffect(() => {
        setActivePath(window.location.pathname);
        const handleEscape = (event) => {
            if (isOpen && event.key === 'Escape') {
                onToggle();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onToggle]);

    // Fungsi untuk menutup sidebar saat mengklik overlay (hanya di mode mobile)
    const handleOverlayClick = () => {
        if (isOpen) {
            onToggle();
        }
    };

    return (
        <>
            {/* PERBAIKAN 1: Div Overlay HANYA untuk Mode Mobile/Layar Kecil (sm:hidden) */}
            <div
                className={`fixed inset-0 bg-black z-40 transition-opacity duration-300
                    ${isOpen ? "bg-opacity-50 pointer-events-auto" : "bg-opacity-0 pointer-events-none"}`}
                onClick={handleOverlayClick}
                aria-hidden={!isOpen}
            ></div>

            <aside
                // Menentukan lebar untuk mobile dan desktop (sm:)
                className={`fixed top-0 left-0 h-full bg-os-secondary text-gray-900  transition-all duration-300 z-50 flex flex-col
                ${isOpen ? "w-64" : "w-0 lg:w-20"}`}
                // PERBAIKAN 2: Menghentikan Propagasi Klik di dalam Sidebar.
                // Ini mencegah klik di dalam sidebar menutupnya via Overlay div di mobile.
                onClick={(e) => e.stopPropagation()}
                role="complementary"
                aria-label="Menu Utama Navigasi"
            >
                {/* Tombol toggle sidebar (Hanya terlihat di desktop: sm:block) */}
                <button
                    onClick={onToggle}
                    className="hidden lg:block absolute -right-4 top-9 z-50 bg-white text-blue-700 border border-ospr p-1 rounded-full hover:bg-white transition focus:outline-none shadow-md"
                    aria-label={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
                >
                    {isOpen ? (
                        <ChevronsLeft size={16} />
                    ) : (
                        <ChevronsRight size={16} />
                    )}
                </button>

                {/* Bagian profil */}
                <div className="flex-shrink-0">
                    <div className={`flex items-center gap-3 p-4  ${isOpen ? "border-b" : "border-none"} h-[100px]`}>
                        <div
                            // PERBAIKAN 3: Menghapus 'sm:flex hidden' yang menyebabkan avatar hilang.
                            // Avatar harus selalu terlihat saat sidebar dilipat/dibuka.
                            className={`w-12 h-12 rounded-full ${imageBg} ${isOpen ? "flex" : "hidden lg:flex"} flex-shrink-0 items-center justify-center text-white font-bold text-xl`}
                        >
                            {name.charAt(0)}
                        </div>
                        {/* Konten profil hanya ditampilkan jika isOpen */}
                        <div className={`overflow-hidden transition-opacity duration-300
                            ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 sm:hidden"}`}>
                            <p className="font-semibold text-white truncate sm:max-w-28">
                                {name}
                            </p>
                            <p className="text-sm text-white truncate lg:max-w-28">
                                {email}
                            </p>
                            <p className="text-xs font-medium text-white uppercase mt-1">
                                {currentRole}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Menu navigasi */}
                <nav className="flex-grow justify-start lg:justify-center flex flex-col overflow-y-auto overflow-x-hidden">
                    <div className="flex flex-col gap-2 p-3 w-full">
                        {menu.map((item, index) => {
                            const isActive = activePath.startsWith(item.href);
                            return (
                                <a
                                    key={index}
                                    href={item.href}
                                    role="link"
                                    aria-current={isActive ? "page" : undefined}
                                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-200
                                    ${!isOpen ? "justify-center" : "px-4"}
                                    ${
                                        isActive
                                            ? "bg-white text-blue-700 font-semibold shadow-sm"
                                            : "text-white hover:bg-blue-700 hover:text-white"
                                    }
                                    opacity-${item.opacity}
                                `}
                                >
                                    <div className="flex-shrink-0 w-6 h-6">
                                        {item.icon}
                                    </div>
                                    {/* Label menu dikontrol visibility-nya */}
                                    <span className={`text-sm whitespace-nowrap transition-opacity duration-300
                                        ${isOpen ? "opacity-100" : "opacity-0 lg:hidden"}`}>
                                        {item.label}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </nav>

                {/* Bagian pengaturan di bawah */}
                <div className={`flex-shrink-0 ${isOpen ? "border-t block" : "border-none lg:block hidden"} p-3`}>
                    <a
                        href={`/${currentRole}/pengaturan-akun`}
                        role="link"
                        className={`flex items-center gap-4 p-3 rounded-lg w-full transition-colors duration-200
                        ${!isOpen ? "justify-center" : "px-4"}
                        ${
                            activePath.startsWith(
                                `/${currentRole}/pengaturan-akun`
                            )
                                ? "bg-white text-blue-700 font-semibold shadow-sm"
                                : "text-white hover:bg-blue-700 hover:text-white"
                        }
                    `}
                    >
                        <div className="flex-shrink-0 w-6 h-6">
                            <Settings size={24} />
                        </div>
                        {/* Label Pengaturan dikontrol visibility-nya */}
                        <span className={`whitespace-nowrap text-sm transition-opacity duration-300
                            ${isOpen ? "opacity-100" : "opacity-0 lg:hidden"}`}>
                            Pengaturan Akun
                        </span>
                    </a>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
