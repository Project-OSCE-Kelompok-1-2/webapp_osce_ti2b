import React, { useState } from "react";
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
    Calendar, // Icon baru untuk Jadwal
    ClipboardCheck, // Icon baru untuk Hasil Penilaian
} from "lucide-react";

// --- 1. DEFINISI MENU UNTUK SETIAP ROLE ---

// Menu untuk Admin
const adminMenus = [
    { label: "Beranda", icon: <Home />, href: "/admin/dashboard" },
    { label: "Stase", icon: <BookOpen />, href: "/admin/stase" },
    { label: "Mahasiswa", icon: <Users />, href: "/admin/mahasiswa" },
    { label: "Dosen", icon: <UserCheck />, href: "/admin/dosen" },
    { label: "OSCE", icon: <FileText />, href: "/admin/osce" },
    { label: "Rekap Nilai", icon: <Bookmark />, href: "/admin/rekap-nilai" },
];

// Menu untuk Penguji
const pengujiMenus = [
    { label: "Beranda", icon: <Home />, href: "/penguji/dashboard" },
    { label: "OSCE", icon: <FileText />, href: "/penguji/osce" },
];

// Menu untuk Mahasiswa (BARU)
const mahasiswaMenus = [
    { label: "Beranda", icon: <Home />, href: "/mahasiswa/dashboard" },
    {
        label: "Hasil Penilaian",
        icon: <ClipboardCheck />,
        href: "/mahasiswa/nilai",
    },
    {
        label: "Jadwal OSCE",
        icon: <Calendar />,
        href: "/mahasiswa/jadwal-osce",
    },
];

// ---------------------------------------------------

const SidebarUniversal = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { url } = usePage();

    // --- 2. LOGIKA DETEKSI ROLE OTOMATIS ---
    const isAdmin = url.startsWith("/admin");
    const isPenguji = url.startsWith("/penguji");
    const isMahasiswa = url.startsWith("/mahasiswa");

    // Helper untuk menentukan data berdasarkan role
    let menuItems = [];
    let settingsLink = "#";
    let userName = "User";
    let userEmail = "user@email.com";
    let themeColor = "gray"; // default

    if (isAdmin) {
        menuItems = adminMenus;
        settingsLink = "/admin/pengaturan-akun";
        userName = "Admin1234";
        userEmail = "admin@polines.ac.id";
    } else if (isPenguji) {
        menuItems = pengujiMenus;
        settingsLink = "/penguji/pengaturan-akun";
        userName = "Penguji1234";
        userEmail = "penguji1234@gmail.com";
    } else if (isMahasiswa) {
        menuItems = mahasiswaMenus;
        settingsLink = "/mahasiswa/pengaturan-akun";
        userName = "Mahasiswa001";
        userEmail = "mhs@polines.ac.id";
    }

    // Helper untuk cek link aktif
    const isActive = (href) => url.startsWith(href);

    // --- 3. LOGIKA WARNA (STYLE) BERDASARKAN ROLE ---
    const getRoleStyles = (active) => {
        if (isAdmin) {
            // --- ADMIN: HITAM/ABU ---
            return {
                icon: "text-blue-600",
                text: active
                    ? "text-blue-700 font-bold"
                    : "text-blue-600 font-medium",
                bg: active ? "bg-blue-50" : "hover:bg-blue-50",
                border: active ? "border-l-4 border-blue-600" : "",
                avatarBg: "bg-blue-100 text-blue-600",
                avatarFill: "bg-blue-200/50",
                toggleBtn: "bg-blue-600 hover:bg-blue-500",
            };
        } else if (isPenguji) {
            // --- PENGUJI: BIRU ---
            return {
                icon: "text-blue-600",
                text: active
                    ? "text-blue-700 font-bold"
                    : "text-blue-600 font-medium",
                bg: active ? "bg-blue-50" : "hover:bg-blue-50",
                border: active ? "border-l-4 border-blue-600" : "",
                avatarBg: "bg-blue-100 text-blue-600",
                avatarFill: "bg-blue-200/50",
                toggleBtn: "bg-blue-600 hover:bg-blue-500",
            };
        } else {
            // --- MAHASISWA: HIJAU (EMERALD) ---
            return {
                icon: "text-blue-600",
                text: active
                    ? "text-blue-700 font-bold"
                    : "text-blue-600 font-medium",
                bg: active ? "bg-blue-50" : "hover:bg-blue-50",
                border: active ? "border-l-4 border-blue-600" : "",
                avatarBg: "bg-blue-100 text-blue-600",
                avatarFill: "bg-blue-200/50",
                toggleBtn: "bg-blue-600 hover:bg-blue-500",
            };
        }
    };

    // Ambil style dasar untuk komponen statis (seperti tombol toggle)
    // Kita anggap jika sedang di menu apapun, style dasar mengikuti role
    const currentStyles = getRoleStyles(false);

    return (
        <aside
            className={`fixed top-0 left-0 h-full bg-white text-gray-900 border-r border-gray-300 shadow-lg transition-all duration-300 z-50 flex flex-col
            ${isOpen ? "w-64" : "w-20"}`}
        >
            {/* Tombol Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`absolute -right-3 top-9 z-50 text-white p-1 rounded-full transition focus:outline-none shadow-md border border-white ${currentStyles.toggleBtn}`}
            >
                {isOpen ? (
                    <ChevronsLeft size={16} />
                ) : (
                    <ChevronsRight size={16} />
                )}
            </button>

            {/* Profil User */}
            <div className="flex-shrink-0">
                <div
                    className={`flex items-center gap-3 p-4 border-b border-gray-200 h-[100px] transition-all duration-300 ${
                        !isOpen ? "justify-center" : ""
                    }`}
                >
                    {/* Avatar */}
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl overflow-hidden ${currentStyles.avatarBg}`}
                    >
                        <div
                            className={`w-full h-full ${currentStyles.avatarFill}`}
                        ></div>
                    </div>

                    {/* Info Teks */}
                    {isOpen && (
                        <div className="overflow-hidden">
                            <p className="font-bold text-gray-900 truncate text-sm">
                                {userName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {userEmail}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Menu Navigasi */}
            <nav className="flex-grow flex flex-col justify-center overflow-y-auto mt-2">
                <div className="flex flex-col gap-3 p-3">
                    {menuItems.map((item, index) => {
                        const active = isActive(item.href);
                        const styles = getRoleStyles(active);

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 group
                                    ${!isOpen ? "justify-center" : "px-4"}
                                    ${styles.bg} 
                                    ${styles.border}
                                `}
                            >
                                <div className="flex-shrink-0">
                                    {React.cloneElement(item.icon, {
                                        size: 26,
                                        className: styles.icon,
                                    })}
                                </div>

                                {isOpen && (
                                    <span
                                        className={`text-sm whitespace-nowrap ${styles.text}`}
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Menu Pengaturan */}
            <div className="flex-shrink-0 border-t border-gray-400 p-3 mb-4 mx-4">
                {(() => {
                    const active = isActive(settingsLink);
                    const styles = getRoleStyles(active);

                    return (
                        <Link
                            href={settingsLink}
                            className={`flex items-center gap-3 p-2 rounded-lg w-full transition-colors duration-200 group mt-2
                                ${!isOpen ? "justify-center" : ""}
                                ${styles.bg}
                            `}
                        >
                            <div className="flex-shrink-0">
                                <Settings size={28} className={styles.icon} />
                            </div>
                            {isOpen && (
                                <span
                                    className={`whitespace-nowrap text-sm ml-1 ${styles.text}`}
                                >
                                    Pengaturan
                                </span>
                            )}
                        </Link>
                    );
                })()}
            </div>
        </aside>
    );
};

export default SidebarUniversal;
