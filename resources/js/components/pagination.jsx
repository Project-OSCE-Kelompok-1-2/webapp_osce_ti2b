// components/OsPagination.jsx (Revisi: Panah Hover Hitam)
import { Link } from "@inertiajs/react";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Komponen Pagination yang reusable untuk data Inertia.
 *
 * @param {Array<Object>} links - Array tautan pagination dari Inertia (misalnya: stase.links).
 */
const OsPagination = ({ links = [] }) => {

    // Pastikan ada links untuk di render selain Prev dan Next
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex items-center justify-start space-x-2 my-4" aria-label="Pagination">
            {links.map((link, index) => {

                // Tentukan apakah ini tombol panah (Previous atau Next)
                const isArrow = index === 0 || index === links.length - 1;

                // Tentukan ikon untuk tombol panah
                let icon = null;
                if (isArrow) {
                    icon = index === 0 ? <ChevronLeft size={16} /> : <ChevronRight size={16} />;
                }

                // Class dasar untuk semua tombol (lingkaran w-10 h-10)
                const baseClasses = "flex items-center justify-center rounded-full transition duration-150 w-8 h-8 text-sm";

                let combinedClasses;

                // Menampilkan tombol "..." jika link tidak memiliki URL (break/ellipsis)
                if (link.label.includes('...')) {
                    return (
                        <span key={index} className="text-gray-500 mx-1">...</span>
                    );
                }

                // --- LOGIC STYLING BARU ---

                if (link.active) {
                    // Gaya untuk halaman AKTIF (Angka Aktif): Hitam Solid
                    combinedClasses = "bg-os-primary text-white font-semibold";
                } else if (link.url === null) {
                    // Gaya untuk tombol NON-AKTIF (Disabled Prev/Next): Berongga, kursor non-aktif
                    combinedClasses = "bg-white border border-gray-400 text-gray-400 cursor-not-allowed";
                } else if (isArrow) {
                    // Gaya untuk tombol PANAH yang AKTIF (Bisa diklik)
                    // Default: Berongga, Hover: Hitam Solid
                    combinedClasses = "bg-white border border-gray-400 text-gray-700 hover:bg-black hover:text-white";
                } else {
                    // Gaya untuk tombol ANGKA yang TIDAK AKTIF
                    // Default: Berongga, Hover: Abu-abu Muda
                    combinedClasses = "bg-white border border-gray-400 text-gray-700 hover:bg-gray-100";
                }

                // Gunakan <span> jika disabled, <Link> jika bisa diklik
                const Tag = link.url === null ? 'span' : Link;

                // Render tombol
                return (
                    <Tag
                        key={index}
                        href={link.url || '#'}
                        preserveScroll
                        className={`${baseClasses} ${combinedClasses}`}
                        aria-disabled={link.url === null}
                        tabIndex={link.url === null ? -1 : 0}
                        onClick={(e) => link.url === null && e.preventDefault()}
                    >
                        {/* Jika panah, tampilkan ikon. Jika angka, tampilkan label. */}
                        {isArrow
                            ? icon
                            : link.label}
                    </Tag>
                );
            })}
        </nav>
    );
};

export default OsPagination;
