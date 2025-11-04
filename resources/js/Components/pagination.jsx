// components/OsPagination.jsx
import { Link } from "@inertiajs/react";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Komponen Pagination yang reusable untuk data Inertia.
 *
 * @param {Array<Object>} links - Array tautan pagination dari Inertia (misalnya: stase.links).
 */
const OsPagination = ({ links = [] }) => {

    // Filter link yang tidak perlu ditampilkan (seperti "..." jika Anda ingin)
    // Dalam kasus standar Laravel, kita bisa iterasi semua link

    // Pastikan ada links untuk di render, dan minimal ada 3 (Prev, 1, Next)
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex items-start justify-start space-x-2 my-4" aria-label="Pagination">
            {links.map((link, index) => {
                // Tentukan apakah ini tombol panah (Previous atau Next)
                const isArrow = index === 0 || index === links.length - 1;

                // Tentukan ikon untuk tombol panah
                let icon = null;
                if (isArrow) {
                    icon = index === 0 ? <ChevronLeft size={12} /> : <ChevronRight size={12} />;
                }

                // Tentukan class CSS
                const baseClasses = "flex items-center justify-center rounded-full transition duration-150";

                // Class untuk tombol yang aktif (halaman saat ini)
                const activeClasses = link.active
                    ? "bg-os-black text-os-white w-6 h-6 font-semibold text-sm"
                    : "bg-os-white text-os-regular border border-gray-300 hover:bg-gray-100 w-6 h-6 text-sm";

                // Class untuk tombol non-aktif (panah Prev/Next yang disabled)
                const disabledClasses = link.url === null
                    ? "bg-gray-200 text-gray-500 w-6 h-6 cursor-not-allowed"
                    : "";

                // Menampilkan tombol "..." jika link tidak memiliki URL (break/ellipsis)
                if (link.label.includes('...')) {
                     return (
                         <span key={index} className="text-gray-500 mx-1">...</span>
                     );
                }

                // Render tombol sebagai Link Inertia
                return (
                    <Link
                        key={index}
                        href={link.url || '#'} // Gunakan URL dari link
                        preserveScroll
                        className={`${baseClasses} ${activeClasses} ${disabledClasses} ${isArrow ? 'w-10 h-10 bg-os-black text-os-white' : ''}`}
                        // Non-aktifkan tombol jika URL null
                        aria-disabled={link.url === null}
                        tabIndex={link.url === null ? -1 : 0}
                        onClick={(e) => link.url === null && e.preventDefault()}
                    >
                        {/* Jika panah, tampilkan ikon. Jika angka, tampilkan label. */}
                        {isArrow
                            ? icon
                            : link.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default OsPagination;
