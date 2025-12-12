// components/OsPagination.jsx
import { Link } from "@inertiajs/react";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Komponen Pagination Hybrid.
 * Bisa dipakai untuk Server-Side (Inertia) ataupun Client-Side (Instant).
 * * @param {Array} links - Array tautan pagination.
 * @param {Function} onPageChange - (Optional) Fungsi callback untuk Client-side pagination.
 */
const OsPagination = ({ links = [], onPageChange }) => {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            className="flex items-center justify-start space-x-2 my-4"
            aria-label="Pagination"
        >
            {links.map((link, index) => {
                const isArrow = index === 0 || index === links.length - 1;

                let icon = null;
                if (isArrow) {
                    // Cek label untuk menentukan ikon (biasanya 'Previous'/'Next' atau '&laquo;')
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

                // Styling logic
                if (link.active) {
                    combinedClasses =
                        "bg-os-primary text-white font-semibold cursor-default";
                } else if (link.url === null) {
                    combinedClasses =
                        "bg-white border border-gray-400 text-gray-400 cursor-not-allowed";
                } else if (isArrow) {
                    combinedClasses =
                        "bg-white border border-gray-400 text-gray-700 hover:bg-black hover:text-white cursor-pointer";
                } else {
                    combinedClasses =
                        "bg-white border border-gray-400 text-gray-700 hover:bg-gray-100 cursor-pointer";
                }

                // Tentukan Tag: Jika client-side (ada onPageChange), pakai 'button' atau 'div' biar gak reload
                // Jika server-side (URL asli), pakai Link
                const Tag =
                    link.url === null ? "span" : onPageChange ? "button" : Link;

                return (
                    <Tag
                        key={index}
                        href={onPageChange ? undefined : link.url || "#"} // Hapus href jika client-side
                        disabled={link.url === null}
                        className={`${baseClasses} ${combinedClasses}`}
                        onClick={(e) => {
                            if (link.url === null) {
                                e.preventDefault();
                                return;
                            }
                            // LOGIC BARU: Jika mode Client-Side
                            if (onPageChange) {
                                e.preventDefault();
                                // Kita sisipkan properti 'pageNumber' saat generate link di parent
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
