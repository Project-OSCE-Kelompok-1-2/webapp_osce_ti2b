import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { useState } from "react";
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

// --- MENU DEFINITIONS ---
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

    // --- FIX: MENAMBAHKAN FUNGSI YANG HILANG (TANPA MENGUBAH TAMPILAN LAIN) ---
    const getLinkClass = (active) => {
        // Ambil style role agar warna background (bg) dan border sesuai role
        const styles = getRoleStyles(active);

        // Gabungkan class layout dasar dengan class warna dari role
        return `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group mb-1 ${
            !isOpen ? "justify-center" : ""
        } ${styles.bg} ${styles.border}`;
    };

    // Ambil style dasar untuk komponen statis (seperti tombol toggle)
    // Kita anggap jika sedang di menu apapun, style dasar mengikuti role
    const currentStyles = getRoleStyles(false);

    return (
        <aside
            // FIXED & Z-50: Agar sidebar mengambang di atas konten saat melebar
            className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-2xl z-50 transition-all duration-300 ease-in-out flex flex-col
            ${isOpen ? "w-72" : "w-20"}`}
        >
            {/* --- TOGGLE BUTTON --- */}
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

            {/* --- MENU LIST --- */}
            <nav className="flex-1 overflow-y-auto py-6 pr-3">
                <div className="flex flex-col">
                    {menuItems.map((item, index) => {
                        const active = isActive(item.href);
                        const styles = getRoleStyles(active);

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
                                        size: 26,
                                        className: styles.icon,
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
