import React from "react";
import { Home, Menu, Undo2 } from "lucide-react";
import { usePage } from "@inertiajs/react";

export default function OsHeader({
    className = "",
    // Tambahkan 'mahasiswa' ke dalam varian
    variant = "admin", // 'admin' | 'penguji' | 'mahasiswa' | 'goback'
    backLink = "/",
    onMenuClick = () => {},
}) {
    // Ambil URL dari Inertia / window
    const { url } = usePage() || {};
    const fullUrl =
        url ||
        (typeof window !== "undefined"
            ? window.location.pathname + window.location.search
            : "/");

    // Hilangkan query params
    const pathname = fullUrl.split("?")[0];

    // Generate title dari URL
    const title =
        pathname
            .split("/")
            .filter(Boolean)
            .map((segment) =>
                segment
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())
            )
            .join(" / ") || "Dashboard";

    // ===============================
    // THEME VARIANT
    // ===============================
    const isPenguji = variant === "penguji";
    // Logika baru untuk varian Mahasiswa
    const isMahasiswa = variant === "mahasiswa";

    // Fungsi utilitas untuk mendapatkan kelas Tailwind dari variabel CSS
    const getThemeClass = () => {
        if (isMahasiswa) {
            return {
                // Menggunakan warna hijau dari variabel --os-primary-mhs
                // Catatan: Anda harus memastikan Tailwind CSS Anda dikonfigurasi untuk mengenal variabel ini.
                bg: "bg-[var(--os-primary-mhs)]",
                hover: "hover:bg-[var(--os-primary-mhs-dark)]",
                border: "border-[var(--os-primary-mhs)]",
                text: "text-[var(--os-primary-mhs)]",
            };
        }

        if (isPenguji) {
            // Varian Penguji (Oranye)
            return {
                bg: "bg-[var(--os-primary-pj)]", // Asumsi Anda punya variabel untuk pj
                hover: "hover:bg-[var(--os-primary-pj-dark)]",
                border: "border-[var(--os-primary-pj)]",
                text: "text-[var(--os-primary-pj)]",
            };
        }

        // Varian Admin (Default / Biru)
        return {
            bg: "bg-[var(--os-primary)]",
            hover: "hover:bg-[var(--os-primary-dark)]",
            border: "border-[var(--os-primary)]",
            text: "text-[var(--os-primary)]",
        };
    };

    const theme = getThemeClass();

    return (
        <header
            className={`relative row-[1_/_2] col-[1_/_2] w-full flex flex-col gap-os-12 ${className}`}
        >
            <div className="flex items-center justify-between w-full gap-os-12">
                {/* ===============================
                    BUTTON AREA
                =============================== */}
                {variant === "goback" ? (
                    <a
                        href={backLink}
                        className={`flex w-[46px] h-[46px] items-center justify-center rounded-xl border transition
                            ${theme.border} ${theme.text}`}
                        aria-label="Go Back"
                    >
                        <Undo2 size={28} />
                    </a>
                ) : (
                    <>
                        {/* HOME - Desktop */}
                        <a
                            href={isMahasiswa ? "/mhs/dashboard" : "/admin/dashboard"} // Mengarahkan ke dashboard mhs
                            className={`hidden lg:flex w-[46px] h-[46px] items-center justify-center rounded-xl text-white border aspect-[1] transition
                                ${theme.bg} ${theme.hover}`}
                            aria-label="Home"
                        >
                            <Home size={26} />
                        </a>

                        {/* MENU - Mobile */}
                        <button
                            onClick={onMenuClick}
                            className={`flex lg:hidden w-[46px] h-[46px] items-center justify-center rounded-xl text-white border aspect-[1] transition
                                ${theme.bg} ${theme.hover}`}
                            aria-label="Menu"
                        >
                            <Menu size={26} />
                        </button>
                    </>
                )}

                {/* ===============================
                    TITLE
                =============================== */}
                <div className="relative flex-1 h-[46px]">
                    <div
                        className={`w-full h-full flex items-center rounded-xl overflow-hidden border bg-white ${theme.border}`}
                    >
                        <h1
                            className={`ml-5 text-os-regular tracking-normal whitespace-nowrap ${theme.text}`}
                        >
                            {title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* ===============================
                DIVIDER
            =============================== */}
            <hr className={`w-full ${theme.border}`} />
        </header>
    );
}
