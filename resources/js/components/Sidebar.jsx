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
    const [isOpen, setIsOpen] = useState(false);
    const [activePath, setActivePath] = useState("");

    useEffect(() => {
        setActivePath(window.location.pathname);
    }, []);

    return (
        <aside
            className={`fixed top-0 left-0 h-full bg-white text-gray-900 border-r border-gray-300 shadow-lg transition-all duration-300 z-50 flex flex-col
      ${isOpen ? "w-64" : "w-20"}`}
        >
            {/* Tombol toggle sidebar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-4 top-9 z-50 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-500 transition focus:outline-none"
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

            {/* Menu navigasi */}
            <nav className="flex-grow flex flex-col justify-center overflow-y-auto">
                <div className="flex flex-col gap-2 p-3">
                    {menuItems.map((item, index) => {
                        const isActive = activePath.startsWith(item.href);
                        return (
                            <a
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-200
                  ${!isOpen ? "justify-center" : "px-4"}
                  ${
                      isActive
                          ? "bg-blue-100 text-blue-700 font-semibold"
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

            {/* Bagian pengaturan di bawah */}
            <div className="flex-shrink-0 border-t border-gray-100 p-3">
                <a
                    href="/admin/pengaturan-akun"
                    className={`flex items-center gap-4 p-3 rounded-lg w-full transition-colors duration-200
            ${!isOpen ? "justify-center" : "px-4"}
            ${
                activePath.startsWith("/admin/pengaturan-akun")
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }
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
