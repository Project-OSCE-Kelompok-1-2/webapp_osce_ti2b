import React from "react";
import { Home, ArrowLeft, Menu } from "lucide-react";
import { usePage } from "@inertiajs/react";
import Sidebar from "./Sidebar";

export default function OsHeader({
    className = "",
    variant = "default", // 'default' | 'goback'
    backLink = "/",
    onMenuClick = () => {}
}) {
    // Ambil URL dari Inertia atau window
    const { url } = usePage() || {};

    const fullUrl =
        url ||
        (typeof window !== "undefined"
            ? window.location.pathname + window.location.search
            : "/");

    // ❗ Hilangkan query params → contoh: "?search=123"
    const pathname = fullUrl.split("?")[0];

    // Buat title → "Admin / Stase"
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

    return (
        <header
            className={`relative row-[1_/_2] col-[1_/_2] w-full flex flex-col items-start gap-os-12 ${className}`}
        >
            <div className="flex items-center justify-between relative self-stretch w-full gap-os-12">
                {/* 🔹 Tombol Home atau Go Back */}
                {variant === "goback" ? (
                    <a
                        href={backLink}
                        className="md:flex w-[46px] h-[46px] hidden items-center justify-center relative bg-gray-600 text-white rounded-xl border border-solid border-gray-700 aspect-[1] hover:bg-gray-700 transition"
                        aria-label="Go Back"
                    >
                        <ArrowLeft className="relative w-[28px] h-[24px]" />
                    </a>
                ) : (
                    <a
                        href="/admin/dashboard"
                        className="md:flex w-[46px] h-[46px] hidden items-center justify-center relative bg-blue-600 text-white rounded-xl border border-solid border-blue-700 aspect-[1] hover:bg-blue-700 transition"
                        aria-label="Home"
                    >
                        <Home className="relative w-[30px] h-[26px]" />
                    </a>
                )}

                <button
                    onClick={onMenuClick}
                    className="flex md:hidden w-[46px] h-[46px] items-center justify-center relative bg-blue-600 text-white rounded-xl border border-solid border-blue-700 aspect-[1] hover:bg-blue-700 transition"
                    aria-label="Home"
                >
                    <Menu className="relative w-[30px] h-[26px]" />
                </button>

                {/* 🔹 Kotak judul utama */}
                <div className="relative flex-1 h-[46px]">
                    <div className="w-full h-full flex items-center bg-white rounded-xl overflow-hidden border border-solid border-gray-300 ">
                        <h1 className="ml-5 text-os-regular text-black tracking-[0] leading-normal whitespace-nowrap">
                            {title}
                        </h1>
                    </div>
                </div>
            </div>

            <hr className="relative w-full border-os-black" />
        </header>
    );
}
