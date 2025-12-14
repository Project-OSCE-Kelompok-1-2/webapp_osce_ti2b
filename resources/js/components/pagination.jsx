// components/OsPagination.jsx
import { Link } from "@inertiajs/react";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Komponen Pagination Hybrid.
 * Bisa dipakai untuk Server-Side (Inertia) ataupun Client-Side (Instant).
 * @param {Array} links - Array tautan pagination.
 * @param {Function} onPageChange - (Optional) Fungsi callback untuk Client-side pagination.
 * @param {string} variant - 'admin' (default), 'penguji' (oranye), atau 'mahasiswa' (hijau).
 */
const OsPagination = ({ links = [], onPageChange, variant = "admin" }) => {
    if (links.length <= 3) {
        return null;
    }

    const isPenguji = variant === "penguji";
    const isMahasiswa = variant === "mahasiswa"; // Tambahkan varian mahasiswa

    // --- Definisi Kelas Warna Kondisional ---

    // 1. Kelas untuk tombol aktif (Halaman saat ini)
    const activeBgClass = (() => {
        if (isMahasiswa) {
            // Mahasiswa: Hijau
            return "bg-[var(--os-primary-mhs)] text-white";
        }
        if (isPenguji) {
            // Penguji: Oranye
            return "bg-[var(--os-primary-pj)] text-white";
        }
        // Admin: Biru (Default)
        return "bg-[var(--os-primary)] text-white";
    })();

    // 2. Kelas untuk tombol Panah (Previous/Next) dan Angka saat aktif (berfungsi)
    const activeThemeClasses = (() => {
        if (isMahasiswa) {
            // Tema Mahasiswa (Hijau)
            return {
                // Panah: Border/Teks Hijau, Hover Background Hijau Penuh
                arrow: "border border-[var(--os-primary-mhs)] text-[var(--os-primary-mhs)] hover:bg-[var(--os-primary-mhs)] hover:text-white",
                // Angka: Border/Teks Hijau, Hover Background Hijau Tersier (pudar)
                number: "border border-[var(--os-primary-mhs)] text-[var(--os-primary-mhs)] hover:bg-[var(--os-tertiary-mhs)]",
            };
        }
        if (isPenguji) {
            // Tema Penguji (Oranye)
            return {
                // Panah: Border/Teks Oranye, Hover Background Oranye Penuh
                arrow: "border border-[var(--os-primary-pj)] text-[var(--os-primary-pj)] hover:bg-[var(--os-primary-pj)] hover:text-white",
                // Angka: Border/Teks Oranye, Hover Background Oranye Tersier (pudar)
                number: "border border-[var(--os-primary-pj)] text-[var(--os-primary-pj)] hover:bg-[var(--os-tertiary-pj)]",
            };
        }
        // Tema Admin (Biru/Default)
        return {
            // Panah: Border/Teks Abu-abu, Hover Background Hitam
            arrow: "border border-gray-400 text-gray-700 hover:bg-black hover:text-white",
            // Angka: Border/Teks Abu-abu, Hover Background Abu-abu Pudar
            number: "border border-gray-400 text-gray-700 hover:bg-gray-100",
        };
    })();

    // Kelas untuk panah (Prev/Next)
    const arrowActiveClass = activeThemeClasses.arrow;

    // Kelas untuk angka halaman (Page Numbers)
    const numberActiveClass = activeThemeClasses.number;

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
                    // KONDISI 1: Aktif (Gunakan warna primary sesuai varian)
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
                                // Mengambil nomor halaman secara heuristik jika label bukan hanya angka
                                const pageNumMatch = link.url ? link.url.match(/page=(\d+)/) : null;
                                const pageNumber = pageNumMatch ? parseInt(pageNumMatch[1], 10) : link.label;

                                onPageChange(pageNumber);
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
