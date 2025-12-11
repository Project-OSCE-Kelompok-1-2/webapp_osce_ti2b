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
            className={`relative row-[1_/_2] col-[1_/_2] w-full flex flex-col items-start gap-os-12 ${className} fixed`}
        >
            <div className="flex items-center justify-between relative self-stretch w-full gap-os-12">
                {/* 🔹 LOGIKA TOMBOL HOME / GO BACK / MENU */}
                {variant === "goback" ? (
                    // Tampilkan Tombol Go Back. Di mobile/default dia akan flex, di desktop dia juga flex
                    <a
                        href={backLink}
                        className="flex w-[46px] h-[46px] items-center justify-center relative bg-gray-600 text-white rounded-xl border border-solid border-gray-700 aspect-[1] hover:bg-gray-700 transition"
                        aria-label="Go Back"
                    >
                        <ArrowLeft className="relative w-[28px] h-[24px]" />
                    </a>
                ) : (
                    <>
                        {/* Tampilkan Tombol Home di desktop */}
                        <a
                            href="/admin/dashboard"
                            className="lg:flex w-[46px] h-[46px] hidden items-center justify-center relative bg-blue-600 text-white rounded-xl border border-solid border-blue-700 aspect-[1] hover:bg-blue-700 transition"
                            aria-label="Home"
                        >
                            <Home className="relative w-[30px] h-[26px]" />
                        </a>
                        {/* Tampilkan Tombol Menu di mobile */}
                        <button
                            onClick={onMenuClick}
                            className="flex lg:hidden w-[46px] h-[46px] items-center justify-center relative bg-blue-600 text-white rounded-xl border border-solid border-blue-700 aspect-[1] hover:bg-blue-700 transition"
                            aria-label="Menu"
                        >
                            <Menu className="relative w-[30px] h-[26px]" />
                        </button>
                    </>
                )}
                {/* 🔹 AKHIR LOGIKA TOMBOL */}

                {/* 🔹 Kotak judul utama */}
                <div className="relative flex-1 h-[46px]">
                    <div className="w-full bg-os-tertiary h-full flex items-center rounded-xl overflow-hidden border border-black ">
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
