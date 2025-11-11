import React, { useState } from "react";
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

// === MENU ASLI (TIDAK DIUBAH) ===
const menuItems = [
    {
        label: "Beranda",
        icon: <Home size={24} />,
        href: "/admin/dashboard",
        opacity: "100",
    },
    {
        label: "Stase",
        icon: <FileText size={24} />,
        href: "/admin/stase",
        opacity: "100",
    },
    {
        label: "Mahasiswa",
        icon: <Users size={24} />,
        href: "/admin/mahasiswa",
        opacity: "50",
    },
    {
        label: "Dosen",
        icon: <UserCheck size={24} />,
        href: "/admin/dosen",
        opacity: "50",
    },
    {
        label: "OSCE",
        icon: <FileText size={24} />,
        href: "/admin/osce",
        opacity: "50",
    },
    {
        label: "Rekap Nilai Mahasiswa",
        icon: <Bookmark size={24} />,
        href: "/admin/rekap-nilai",
        opacity: "50",
    },
];

const Sidebar = () => {
    // 🆕 TAMBAH: State untuk mengelola kondisi sidebar (buka/tutup)
    // Kita set default 'true' (terbuka) agar bisa dilihat
    const [isOpen, setIsOpen] = useState(false);

    return (
        <aside
            className={`fixed top-0 left-0 h-full bg-white text-gray-900 border-r border-gray-300 shadow-lg transition-all duration-300 z-50
      flex flex-col ${/* flex flex-col sudah benar */ ""}
      ${isOpen ? "w-64" : "w-20"}`}
        >
            {/* Tombol toggle (posisi absolute, tidak berubah) */}
            <button
                onClick={() => setIsOpen(!isOpen)} // 🆕 UBAH: Sekarang menggunakan setIsOpen dari state internal
                className="absolute -right-4 top-9 z-50 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-500 transition focus:outline-none"
            >
                {isOpen ? (
                    <ChevronsLeft size={16} />
                ) : (
                    <ChevronsRight size={16} />
                )}
            </button>

            {/* 🆕 UBAH: Struktur dirombak. 'div' dengan 'flex-grow' dihilangkan */}

            {/* === BAGIAN PROFIL (DI ATAS) === */}
            {/* 🆕 TAMBAH: flex-shrink-0 agar ukurannya tetap */}
            <div className="flex-shrink-0">
                <div className="flex items-center gap-3 p-4 border-b border-gray-500 h-[100px]">
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex-shrink-0"></div>
                    {isOpen && (
                        <div className="overflow-hidden">
                            <p className="font-semibold text-black truncate">
                                Admin1234
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                Admin1234@gmail.com
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* === MENU NAVIGASI (DI TENGAH) === */}
            {/* 🆕 UBAH:
        - 'flex-grow': Membuat <nav> mengisi semua ruang kosong yang tersedia.
        - 'flex flex-col': Diperlukan agar justify-center bekerja secara vertikal.
        - 'justify-center': Mendorong item menu ke tengah-tengah <nav>.
      */}
            <nav className="flex-grow flex flex-col justify-center overflow-y-auto">
                <div className="flex flex-col gap-2 p-3">
                    {menuItems.map((item, index) => (
                        // 🟢 PERUBAHAN KRUSIAL: Mengubah <button> menjadi <a>
                        <a
                            key={index}
                            href={item.href} // Menambahkan link ke elemen
                            className={`flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 opacity-${
                                item.opacity
                            }
                                ${!isOpen ? "justify-center" : "px-4"}
                                ${
                                    item.label === "Beranda"
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : ""
                                }
                            `}
                        >
                            <div className="flex-shrink-0 w-6 h-6">
                                {item.icon}
                            </div>
                            {isOpen && (
                                <span className="text-sm whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </a>
                    ))}
                </div>
            </nav>

            {/* === BAGIAN PENGATURAN (DI BAWAH) === */}
            {/* 🆕 TAMBAH: flex-shrink-0 agar ukurannya tetap */}
            <div className="flex-shrink-0 border-t border-gray-100 p-3">
                {/* 🟢 PERUBAHAN KRUSIAL: Mengubah <button> menjadi <a> */}
                <a
                    href="/admin/pengaturan-akun"
                    className={`flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 w-full
                        ${!isOpen ? "justify-center" : "px-4"}
                    `}
                >
                    <div className="flex-shrink-0 w-6 h-6">
                        <Settings size={24} />
                    </div>
                    {isOpen && (
                        <span className="whitespace-nowrap text-sm">
                            Pengaturan
                        </span>
                    )}
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
