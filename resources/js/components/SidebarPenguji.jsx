import React, { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import {
    Home,
    FileText, // Ikon untuk OSCE
    Settings,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

// [DIUBAH] Menu hanya ada 2 item sesuai gambar
const menuItems = [
    {
        label: "Beranda",
        icon: <Home size={24} />,
        href: "/penguji/dashboard", // Sesuaikan href dengan role penguji
        opacity: "100",
    },
    {
        label: "OSCE",
        icon: <FileText size={24} />, // Ikon buku/dokumen biru
        href: "/penguji/osce",      // Sesuaikan href dengan role penguji
        opacity: "100",
    },
];

const SidebarPenguji = () => {
    const [isOpen, setIsOpen] = useState(false); 
    
    const { url } = usePage();

    const isActive = (href) => url.startsWith(href);

    return (
        <aside
            className={`fixed top-0 left-0 h-full bg-white text-gray-900 border-r border-gray-300 shadow-lg transition-all duration-300 z-50 flex flex-col
            ${isOpen ? "w-64" : "w-20"}`}
        >
            {/* Tombol toggle sidebar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-9 z-50 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-500 transition focus:outline-none shadow-md border border-white"
            >
                {isOpen ? (
                    <ChevronsLeft size={16} />
                ) : (
                    <ChevronsRight size={16} />
                )}
            </button>

            {/* Bagian profil */}
            <div className="flex-shrink-0">
                <div className={flex items-center gap-3 p-4 border-b border-gray-400 h-[100px] transition-all duration-300 ${!isOpen ? "justify-center" : ""}}>
                    {/* Avatar Placeholder (Lingkaran Biru Muda) */}
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xl overflow-hidden">
                        {/* Anda bisa ganti dengan <img> jika ada foto profil */}
                        <div className="w-full h-full bg-blue-200"></div>
                    </div>
                    
                    {/* Info User */}
                    {isOpen && (
                        <div className="overflow-hidden">
                            <p className="font-bold text-gray-900 truncate text-sm">
                                Penguji1234
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                Penguji1234@gmail.com
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Menu navigasi (Tengah) */}
            <nav className="flex-grow flex flex-col justify-center overflow-y-auto">
                <div className="flex flex-col gap-2 p-3">
                    {menuItems.map((item, index) => {
                        const active = isActive(item.href);
                        
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 group
                                    ${!isOpen ? "justify-center" : "px-4"}
                                    ${active 
                                        ? "text-blue-600 font-semibold" 
                                        : "text-blue-600 hover:bg-blue-50" // Teks default biru
                                    }
                                `}
                            >
                                <div className={flex-shrink-0}>
                                    {/* Ikon selalu biru */}
                                    {React.cloneElement(item.icon, { 
                                        className: "w-8 h-8 text-blue-600" 
                                    })}
                                </div>
                                
                                {isOpen && (
                                    <span className="text-sm whitespace-nowrap font-medium">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Bagian Pengaturan (Bawah) */}
            <div className="flex-shrink-0 border-t border-gray-400 p-3 mb-4 mx-4"> {/* Garis pemisah di atas Pengaturan */}
                 <Link
                    href="/penguji/pengaturan"
                    className={`flex items-center gap-3 p-2 rounded-lg w-full transition-colors duration-200 group mt-2
                        ${!isOpen ? "justify-center" : ""}
                        ${isActive("/penguji/pengaturan")
                            ? "text-blue-600 font-semibold"
                            : "text-blue-600 hover:bg-blue-50" 
                        }
                    `}
                >
                    <div className="flex-shrink-0">
                        <Settings size={28} className="text-blue-600" />
                    </div>
                    {isOpen && (
                        <span className="whitespace-nowrap text-sm font-medium ml-1">
                            Pengaturan
                        </span>
                    )}
                </Link>
            </div>
        </aside>
    );
};

export default SidebarPenguji;