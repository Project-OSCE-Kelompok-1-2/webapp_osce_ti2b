import React from "react";
import { Home, Menu, Undo2 } from "lucide-react";
import { usePage } from "@inertiajs/react";

export default function OsHeader({
    className = "",
    variant = "admin", // 'admin' | 'penguji' | 'goback'
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

    const theme = {
        bg: isPenguji ? "bg-orange-600" : "bg-blue-900",
        hover: isPenguji ? "hover:bg-orange-500" : "hover:bg-blue-700",
        border: isPenguji ? "border-orange-600" : "border-blue-900",
        text: isPenguji ? "text-orange-600" : "text-blue-900",
    };

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
                            href="/admin/dashboard"
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
