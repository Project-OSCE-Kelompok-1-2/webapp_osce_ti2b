// components/OsPagination.jsx
import { Link } from "@inertiajs/react";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Komponen Pagination Hybrid.
 * Bisa dipakai untuk Server-Side (Inertia) ataupun Client-Side (Instant).
 * @param {Array} links - Array tautan pagination.
 * @param {Function} onPageChange - (Optional) Fungsi callback untuk Client-side pagination.
 * @param {string} variant - 'admin' (default) atau 'penguji' (oranye).
 */
const OsPagination = ({ links = [], onPageChange, variant = "admin" }) => {
    if (links.length <= 3) {
        return null;
    }

    const isPenguji = variant === "penguji";

    // --- Definisi Kelas Warna Kondisional ---

    // 1. Kelas untuk tombol aktif (Halaman saat ini)
    // Default: bg-os-primary text-white
    // Penguji: bg-os-primary-pj text-white
    const activeBgClass = isPenguji
        ? "bg-os-primary-pj text-white"
        : "bg-os-primary text-white";

    // 2. Kelas untuk tombol Panah (Previous/Next) dan Angka saat aktif (berfungsi)
    // Kelas default (Admin):
    //   - Panah: border-gray-400 text-gray-700 hover:bg-black hover:text-white
    //   - Angka: border-gray-400 text-gray-700 hover:bg-gray-100
    // Kelas Penguji (Oranye):
    //   Kita akan menggunakan border, teks, dan hover yang sesuai dengan skema oranye.

    // Asumsi: Kita menggunakan --os-primary-pj untuk warna teks/border yang lebih kuat,
    // dan --os-tertiary-pj untuk warna hover/bg yang lebih ringan.

    // Kelas untuk panah (Prev/Next)
    const arrowActiveClass = isPenguji
        ? "border border-os-primary-pj text-os-primary-pj hover:bg-os-primary-pj hover:text-white"
        : "border border-gray-400 text-gray-700 hover:bg-black hover:text-white";

    // Kelas untuk angka halaman (Page Numbers)
    const numberActiveClass = isPenguji
        ? "border border-os-primary-pj text-os-primary-pj hover:bg-os-tertiary-pj"
        : "border border-gray-400 text-gray-700 hover:bg-gray-100";

    return (
        <nav
            className="flex items-center justify-start space-x-2 my-4"
            aria-label="Pagination"
        >
            {links.map((link, index) => {
                const isArrow = index === 0 || index === links.length - 1;

                let icon = null;
                if (isArrow) {
                    const isPrev =
                        link.label.includes("Previous") ||
                        link.label.includes("&laquo;");
                    icon = isPrev ? (
                        <ChevronLeft size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    );
                }

                const baseClasses =
                    "flex items-center justify-center rounded-full transition duration-150 w-8 h-8 text-sm select-none";
                let combinedClasses;

                if (link.label.includes("...")) {
                    return (
                        <span key={index} className="text-gray-500 mx-1">
                            ...
                        </span>
                    );
                }

                // --- LOGIKA STYLING KONDISIONAL ---
                if (link.active) {
                    // KONDISI 1: Aktif (Gunakan warna primary oranye)
                    combinedClasses = activeBgClass + " font-semibold cursor-default";
                } else if (link.url === null) {
                    // KONDISI 2: Non-aktif / Disabled (Warna tetap abu-abu)
                    combinedClasses =
                        "bg-white border border-gray-400 text-gray-400 cursor-not-allowed";
                } else if (isArrow) {
                    // KONDISI 3: Panah Aktif (berfungsi)
                    combinedClasses = "bg-white " + arrowActiveClass + " cursor-pointer";
                } else {
                    // KONDISI 4: Angka Halaman Aktif (berfungsi)
                    combinedClasses = "bg-white " + numberActiveClass + " cursor-pointer";
                }

                // Tentukan Tag:
                const Tag =
                    link.url === null ? "span" : onPageChange ? "button" : Link;

                return (
                    <Tag
                        key={index}
                        href={onPageChange ? undefined : link.url || "#"}
                        disabled={link.url === null}
                        className={`${baseClasses} ${combinedClasses}`}
                        onClick={(e) => {
                            if (link.url === null) {
                                e.preventDefault();
                                return;
                            }
                            if (onPageChange) {
                                e.preventDefault();
                                onPageChange(link.pageNumber || link.label);
                            }
                        }}
                    >
                        {isArrow ? icon : link.label}
                    </Tag>
                );
            })}
        </nav>
    );
};

export default OsPagination;
