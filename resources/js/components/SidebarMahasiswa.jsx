import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    Home,
    Star,       // Icon Bintang untuk Hasil Penilaian
    Book,       // Icon Buku untuk Jadwal
    Settings,
    ChevronsLeft,
    ChevronsRight,
    User
} from "lucide-react";

const SidebarMahasiswa = () => {
    // Default terbuka (true) agar terlihat lebar seperti desain
    const [isOpen, setIsOpen] = useState(true);
    const [activePath, setActivePath] = useState("");

    useEffect(() => {
        setActivePath(window.location.pathname);
    }, []);

    // Menu sesuai gambar design
    const menuItems = [
        {
            label: "Beranda",
            icon: <Home size={28} />,
            href: "/dashboard",
        },
        {
            label: "Hasil Penilaian",
            icon: <Star size={28} />, // Menggunakan icon Bintang/Star sesuai gambar
            href: "/mahasiswa/nilaishow",
        },
        {
            label: "Jadwal OSCE",
            icon: <Book size={28} />,
            href: "/mahasiswa/jadwal",
        },
    ];

    return (
        <aside
            // Warna Background Biru Gelap (#111827 / rgb(17 24 39)) sesuai gambar design
            className={`fixed top-0 left-0 h-full bg-[#111827] text-white transition-all duration-300 z-50 flex flex-col shadow-xl
            ${isOpen ? "w-72" : "w-24"}`} // Lebar sedikit diperbesar agar proporsional
        >
            {/* --- 1. HEADER PROFIL (Lingkaran) --- */}
            <div className="relative flex flex-col items-center pt-8 pb-4">
                {/* Tombol Toggle Bulat Kecil di pojok kanan header */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute top-8 -right-3 bg-white text-[#111827] rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-100 transition z-50"
                >
                    {isOpen ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
                </button>

                {/* Avatar Lingkaran Besar */}
                <div className={`transition-all duration-300 bg-blue-100 rounded-full flex items-center justify-center text-[#111827]
                    ${isOpen ? "w-20 h-20 mb-3" : "w-12 h-12 mb-2"}
                `}>
                    <User size={isOpen ? 40 : 24} />
                </div>

                {/* Teks Nama & Email (Hanya muncul jika sidebar terbuka) */}
                <div className={`text-center overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 h-auto" : "opacity-0 h-0"}`}>
                    <h3 className="font-bold text-lg text-white whitespace-nowrap">Porem ipsum dolor</h3>
                    <p className="text-xs text-gray-400 whitespace-nowrap">Poremipsumdolor@Lorem.ipsum</p>
                </div>

                {/* Garis Pemisah Putih Tipis */}
                <div className="w-10/12 h-px bg-gray-600 mt-6 mb-2"></div>
            </div>

            {/* --- 2. MENU NAVIGASI --- */}
            <nav className="flex-grow flex flex-col px-4 gap-2 overflow-y-auto mt-2">
                {menuItems.map((item, index) => {
                    const isActive = activePath === item.href;
                    
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 group
                            ${!isOpen ? "justify-center" : ""}
                            ${isActive 
                                ? "bg-white/10 text-white font-semibold" // Style Aktif (background transparan putih)
                                : "text-gray-400 hover:text-white hover:bg-white/5" // Style Tidak Aktif
                            }
                            `}
                        >
                            {/* Icon */}
                            <div className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                                {item.icon}
                            </div>

                            {/* Label Text */}
                            {isOpen && (
                                <span className="text-base whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* --- 3. SETTINGS (Footer) --- */}
            <div className="px-4 pb-8 pt-2">
                {/* Garis Pemisah Footer */}
                <div className="w-full h-px bg-gray-600 mb-4"></div>
                
                <Link
                    href="/settings"
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5
                    ${!isOpen ? "justify-center" : ""}
                    `}
                >
                    <Settings size={28} />
                    {isOpen && (
                        <span className="text-base font-medium">Setting</span>
                    )}
                </Link>
            </div>
        </aside>
    );
};

export default SidebarMahasiswa;