import React from "react";
import { Home, Menu, Undo2 } from "lucide-react";
// Tambahkan Link agar navigasi lebih cepat (SPA feel) tanpa reload
import { usePage, Link } from "@inertiajs/react";

export default function OsHeader({
    className = "",
    variant = "admin",
    role,
    backLink = "/",
    onMenuClick = () => {},
}) {
    const { url } = usePage() || {};
    const fullUrl =
        url ||
        (typeof window !== "undefined"
            ? window.location.pathname + window.location.search
            : "/");

    const pathname = fullUrl.split("?")[0];

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
    // THEME LOGIC
    // ===============================
    const effectiveTheme = role
        ? role
        : ["mahasiswa", "penguji"].includes(variant)
        ? variant
        : "admin";

    const isPenguji = effectiveTheme === "penguji";
    const isMahasiswa = effectiveTheme === "mahasiswa";

    const getThemeClass = () => {
        if (isMahasiswa) {
            return {
                bg: "bg-[var(--os-primary-mhs)]",
                hover: "hover:bg-[var(--os-primary-mhs-dark)]",
                border: "border-[var(--os-primary-mhs)]",
                text: "text-[var(--os-primary-mhs)]",
            };
        }

        if (isPenguji) {
            return {
                bg: "bg-[var(--os-primary-pj)]",
                hover: "hover:bg-[var(--os-primary-pj-dark)]",
                border: "border-[var(--os-primary-pj)]",
                text: "text-[var(--os-primary-pj)]",
            };
        }

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
                    // PERBAIKAN DI SINI:
                    // 1. Ganti <a> jadi <Link> (opsional, tapi disarankan agar tidak reload halaman)
                    // 2. Tambahkan 'shrink-0' agar tombol tidak tergencet judul panjang
                    // 3. Tambahkan 'relative z-10' agar tombol selalu di atas layer judul
                    <Link
                        href={backLink}
                        className={`relative z-10 shrink-0 flex w-[46px] h-[46px] items-center justify-center rounded-xl border transition
                            ${theme.border} ${theme.text}`}
                        aria-label="Go Back"
                    >
                        <Undo2 size={28} />
                    </Link>
                ) : (
                    <>
                        {/* HOME - Desktop */}
                        <Link
                            href={
                                isMahasiswa
                                    ? "/mahasiswa/dashboard"
                                    : "/admin/dashboard"
                            }
                            className={`hidden lg:flex shrink-0 w-[46px] h-[46px] items-center justify-center rounded-xl text-white border aspect-[1] transition
                                ${theme.bg} ${theme.hover}`}
                            aria-label="Home"
                        >
                            <Home size={26} />
                        </Link>

                        {/* MENU - Mobile */}
                        <button
                            onClick={onMenuClick}
                            className={`relative z-10 shrink-0 flex lg:hidden w-[46px] h-[46px] items-center justify-center rounded-xl text-white border aspect-[1] transition
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
                <div className="relative flex-1 h-[46px] min-w-0">
                    {" "}
                    {/* min-w-0 mencegah flex item meluap */}
                    <div
                        className={`w-full h-full flex items-center rounded-xl overflow-hidden border bg-white ${theme.border}`}
                    >
                        <h1
                            className={`ml-5 text-os-regular tracking-normal whitespace-nowrap overflow-hidden text-ellipsis px-2 ${theme.text}`}
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
