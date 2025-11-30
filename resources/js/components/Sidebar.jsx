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
    User,
    ClipboardCheck,
    Calendar,
    ListChecks,
} from "lucide-react";

// --- Data Konfigurasi Multi-Role ---
// Struktur data untuk setiap peran, termasuk profil placeholder dan daftar menu
const roleData = {
    admin: {
        name: "Admin Fakultas",
        email: "admin.fakultas@kampus.edu",
        imageBg: "bg-blue-600", // Warna untuk placeholder profil admin
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
        imageBg: "bg-green-600", // Warna untuk placeholder profil penguji
        menu: [
            { label: "Beranda", icon: <Home size={24} />, href: "/penguji/dashboard", opacity: "100" },
            { label: "Verifikasi Nilai", icon: <FileText size={24} />, href: "/penguji/osce", opacity: "100" },
            // { label: "Riwayat Penilaian", icon: <ListChecks size={24} />, href: "/penguji/riwayat", opacity: "100" },
        ],
    },
    mahasiswa: {
        name: "Alya Putri",
        email: "alya.putri@kampus.edu",
        imageBg: "bg-yellow-600", // Warna untuk placeholder profil mahasiswa
        menu: [
            { label: "Dashboard", icon: <Home size={24} />, href: "/mahasiswa/dashboard", opacity: "100" },
            { label: "Rencana Stase", icon: <FileText size={24} />, href: "/mahasiswa/stase-plan", opacity: "100" },
            { label: "Logbook", icon: <Bookmark size={24} />, href: "/mahasiswa/logbook", opacity: "100" },
            { label: "Hasil Nilai", icon: <Users size={24} />, href: "/mahasiswa/nilai", opacity: "100" },
        ],
    },
};

// Menerima prop 'type' untuk menentukan peran awal
const Sidebar = ({ type }) => {
    // Tentukan peran awal berdasarkan prop 'type'. Jika tidak ada atau tidak valid, default ke 'admin'.
    const initialRole = roleData[type] ? type : 'admin';
    const [currentRole, setCurrentRole] = useState(initialRole);
    const [isOpen, setIsOpen] = useState(false);
    const [activePath, setActivePath] = useState("");

    // Ambil data (profil & menu) berdasarkan peran aktif
    const { name, email, imageBg, menu } = roleData[currentRole];

    useEffect(() => {
        // Menggunakan window.location.pathname hanya untuk simulasi active state
        setActivePath(window.location.pathname);
    }, []);

    // Fungsi untuk mengubah peran (hanya untuk simulasi/demo)
    const handleRoleChange = (roleKey) => {
        setCurrentRole(roleKey);
        // Reset active path on role change to prevent highlighting irrelevant links
        setActivePath(roleData[roleKey].menu[0]?.href || "");
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full bg-white text-gray-900 border-r border-gray-300 transition-all duration-300 z-50 flex flex-col
          ${isOpen ? "w-64" : "w-20"}`}
        >
            {/* Tombol toggle sidebar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-4 top-9 z-50 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-500 transition focus:outline-none shadow-md"
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
                <div className="flex items-center gap-3 p-4 border-b border-gray-300 h-[100px]">
                    <div className={`w-12 h-12 rounded-full ${imageBg} flex-shrink-0 flex items-center justify-center text-white font-bold text-xl`}>
                        {/* Menampilkan inisial nama */}
                        {name.charAt(0)}
                    </div>
                    {isOpen && (
                        <div className="overflow-hidden">
                            <p className="font-semibold text-black truncate">
                                {name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {email}
                            </p>
                            <p className="text-xs font-medium text-blue-500 uppercase mt-1">
                                {currentRole}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Menu navigasi - Flex-grow memastikan menu memenuhi sisa ruang */}
            <nav className="flex-grow flex flex-col overflow-hidden items-center justify-center">
                <div className="flex flex-col gap-2 p-3  w-full">
                    {menu.map((item, index) => {
                        const isActive = activePath.startsWith(item.href);
                        return (
                            <a
                                key={index}
                                href={item.href}
                                // Menambahkan role="link" untuk aksesibilitas yang lebih baik
                                role="link"
                                aria-current={isActive ? "page" : undefined}
                                className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-200
                                  ${!isOpen ? "justify-center" : "px-4"}
                                  ${
                                      isActive
                                          ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                  }
                                  opacity-${item.opacity}
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
                        );
                    })}
                </div>
            </nav>

            {/* Role Switcher (Hanya untuk Demo, terlihat saat terbuka) */}
            {/* {isOpen && (
                <div className="flex-shrink-0 border-t border-b border-gray-100 p-3 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-gray-500 px-1">Ganti Peran (Demo):</p>
                    <div className="flex justify-between gap-1">
                        {Object.keys(roleData).map((roleKey) => (
                            <button
                                key={roleKey}
                                onClick={() => handleRoleChange(roleKey)}
                                className={`flex-1 text-xs py-1 px-2 rounded-full transition-all duration-200 uppercase font-medium
                                    ${currentRole === roleKey
                                        ? "bg-blue-500 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }
                                `}
                            >
                                {roleKey}
                            </button>
                        ))}
                    </div>
                </div>
            )} */}


            {/* Bagian pengaturan di bawah */}
            <div className="flex-shrink-0 border-t border-gray-300 p-3">
                <a
                    href={`/${currentRole}/pengaturan-akun`} // Menggunakan currentRole untuk href Pengaturan
                    role="link"
                    className={`flex items-center gap-4 p-3 rounded-lg w-full transition-colors duration-200
                      ${!isOpen ? "justify-center" : "px-4"}
                      ${
                          activePath.startsWith(`/${currentRole}/pengaturan-akun`) // Memeriksa path Pengaturan yang benar
                              ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }
                  `}
                >
                    <div className="flex-shrink-0 w-6 h-6">
                        <Settings size={24} />
                    </div>
                    {isOpen && (
                        <span className="whitespace-nowrap text-sm">
                            Pengaturan Akun
                        </span>
                    )}
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
