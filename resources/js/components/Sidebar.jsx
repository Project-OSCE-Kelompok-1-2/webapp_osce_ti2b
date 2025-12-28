

import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import {
    Home,
    Users,
    UserCheck,
    FileText,
    Bookmark,
    Settings,
    ChevronsLeft,
    ChevronsRight,
    Calendar,
    ClipboardCheck,
} from "lucide-react";

const roleData = {
    admin: {
        name: "Admin Fakultas",
        imageBg: "bg-blue-600",
        menu: [
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
                opacity: "100",
            },
            {
                label: "Dosen",
                icon: <UserCheck size={24} />,
                href: "/admin/dosen",
                opacity: "100",
            },
            {
                label: "OSCE",
                icon: <FileText size={24} />,
                href: "/admin/osce",
                opacity: "100",
            },
            {
                label: "Rekap Nilai Mahasiswa",
                icon: <Bookmark size={24} />,
                href: "/admin/rekap-nilai",
                opacity: "100",
            },
        ],
    },
    penguji: {
        name: "Dosen Penguji",
        imageBg: "bg-orange-400",
        menu: [
            {
                label: "Beranda",
                icon: <Home size={24} />,
                href: "/penguji/dashboard",
                opacity: "100",
            },
            {
                label: "Verifikasi Nilai",
                icon: <FileText size={24} />,
                href: "/penguji/osce",
                opacity: "100",
            },
        ],
    },
    mahasiswa: {
        name: "Mahasiswa",
        imageBg: "bg-yellow-600",
        menu: [
            {
                label: "Beranda",
                icon: <Home size={24} />,
                href: "/mahasiswa/dashboard",
                opacity: "100",
            },
            {
                label: "Hasil Penilaian",
                icon: <ClipboardCheck size={24} />,
                href: "/mahasiswa/nilai",
                opacity: "100",
            },
            {
                label: "Jadwal OSCE",
                icon: <Calendar size={24} />,
                href: "/mahasiswa/jadwal",
                opacity: "100",
            },
        ],
    },
};

const Sidebar = ({ type, isOpen, onToggle, user: propUser }) => {
    const { auth } = usePage().props;

    const user = propUser || auth?.user;

    const initialRole = roleData[type] ? type : "admin";
    const [currentRole, setCurrentRole] = useState(initialRole);
    const [activePath, setActivePath] = useState("");

    const { imageBg, menu } = roleData[currentRole];

    let displayName = roleData[currentRole].name;
    let displayId = "";

    if (user) {
        if (currentRole === "mahasiswa" && user.mahasiswa) {
            displayName = user.mahasiswa.nama;
            displayId = user.mahasiswa.nim || "";
        } else if (currentRole === "penguji") {
            const pengujiData = user.penguji || user.dosen;
            if (pengujiData) {
                displayName = pengujiData.nama_gelar || pengujiData.nama;
                displayId = pengujiData.nip || "";
            }
        } else if (currentRole === "admin") {
            displayName = user.name || user.username;
            displayId = "";
        } else {
            displayName = user.name || user.username || displayName;
        }
    }

    let avatarBgColor;
    if (currentRole === "mahasiswa") {
        avatarBgColor = "16A34A"; 
    } else if (currentRole === "penguji") {
        avatarBgColor = "EA580C"; 
    } else {
        avatarBgColor = "2563EB"; // 
    }

    let profileImageUrl;
    if (user && user.path_gambar) {
        profileImageUrl = `/${user.path_gambar}`;
    } else {
        profileImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            displayName
        )}&background=${avatarBgColor}&color=fff&bold=true&size=128`;
    }

    useEffect(() => {
        setActivePath(window.location.pathname);
        const handleEscape = (event) => {
            if (isOpen && event.key === "Escape") {
                onToggle();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onToggle]);

    const handleOverlayClick = () => {
        if (isOpen) {
            onToggle();
        }
    };

    const sidebarColorClass =
        currentRole === "mahasiswa"
            ? "bg-green-700"
            : currentRole === "penguji"
            ? "bg-orange-600"
            : "bg-blue-900";

    const toggleColorClass =
        currentRole === "mahasiswa"
            ? "text-green-700"
            : currentRole === "penguji"
            ? "text-orange-600"
            : "text-blue-900";

    const menuHoverBgClass =
        currentRole === "mahasiswa"
            ? "hover:bg-green-600"
            : currentRole === "penguji"
            ? "hover:bg-orange-500"
            : "hover:bg-blue-700";

    const activeTextColorClass =
        currentRole === "mahasiswa"
            ? "text-green-800"
            : currentRole === "penguji"
            ? "text-orange-700"
            : "text-blue-700";

    const menuHoverTextClass = "hover:text-white";

    return (
        <>
            <div
                className={`fixed inset-0 bg-black z-40 transition-opacity duration-300
                    ${
                        isOpen
                            ? "bg-opacity-50 pointer-events-auto"
                            : "bg-opacity-0 pointer-events-none"
                    } lg:hidden`}
                onClick={handleOverlayClick}
                aria-hidden={!isOpen}
            ></div>

            <aside
                className={`fixed top-0 left-0 h-full ${sidebarColorClass} text-gray-900  transition-all duration-300 z-50 flex flex-col
                ${isOpen ? "w-64" : "w-0 lg:w-20"}`}
                onClick={(e) => e.stopPropagation()}
                role="complementary"
                aria-label="Menu Utama Navigasi"
            >
                <button
                    onClick={onToggle}
                    className={`hidden lg:block absolute -right-4 top-9 z-50 bg-white ${toggleColorClass} border border-ospr p-1 rounded-full hover:bg-white transition focus:outline-none shadow-md`}
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
                    <div
                        className={`flex items-center gap-3 p-4  ${
                            isOpen ? "border-b border-white/20" : "border-none"
                        } h-[100px]`}
                    >
                        {/* Avatar Image */}
                        <img
                            src={profileImageUrl}
                            alt="Profile"
                            className={`w-12 h-12 rounded-full object-cover border-2 border-white/20 bg-gray-300 ${
                                isOpen ? "block" : "hidden lg:block"
                            } flex-shrink-0`}
                        />

                        {/* Konten profil (Nama & ID) */}
                        <div
                            className={`overflow-hidden transition-opacity duration-300 flex flex-col justify-center
                            ${
                                isOpen
                                    ? "opacity-100 w-auto"
                                    : "opacity-0 w-0 sm:hidden"
                            }`}
                        >
                            <p className="font-semibold text-white truncate sm:max-w-28">
                                {displayName}
                            </p>

                            {/* Hanya tampilkan baris kedua jika displayId (NIM/NIP) ada.
                                Untuk Admin, displayId kosong, jadi baris ini tidak dirender. */}
                            {displayId && (
                                <p className="text-sm text-white truncate lg:max-w-28 opacity-90">
                                    {displayId}
                                </p>
                            )}

                            <p className="text-xs font-medium text-white uppercase mt-1 opacity-70">
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
                                            ? `bg-white ${activeTextColorClass} font-semibold shadow-sm`
                                            : `text-white ${menuHoverBgClass} ${menuHoverTextClass}`
                                    }
                                    opacity-${item.opacity}
                                `}
                                >
                                    <div className="flex-shrink-0 w-6 h-6">
                                        {item.icon}
                                    </div>
                                    <span
                                        className={`text-sm whitespace-nowrap transition-opacity duration-300
                                        ${
                                            isOpen
                                                ? "opacity-100"
                                                : "opacity-0 lg:hidden"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </nav>

                {/* Bagian pengaturan di bawah */}
                <div
                    className={`flex-shrink-0 ${
                        isOpen
                            ? "border-t border-white/20 block"
                            : "border-none lg:block hidden"
                    } p-3`}
                >
                    <a
                        href={`/${currentRole}/pengaturan-akun`}
                        role="link"
                        className={`flex items-center gap-4 p-3 rounded-lg w-full transition-colors duration-200
                        ${!isOpen ? "justify-center" : "px-4"}
                        ${
                            activePath.startsWith(
                                `/${currentRole}/pengaturan-akun`
                            )
                                ? `bg-white ${activeTextColorClass} font-semibold shadow-sm`
                                : `text-white ${menuHoverBgClass} ${menuHoverTextClass}`
                        }
                    `}
                    >
                        <div className="flex-shrink-0 w-6 h-6">
                            <Settings size={24} />
                        </div>
                        <span
                            className={`whitespace-nowrap text-sm transition-opacity duration-300
                            ${isOpen ? "opacity-100" : "opacity-0 lg:hidden"}`}
                        >
                            Pengaturan Akun
                        </span>
                    </a>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
