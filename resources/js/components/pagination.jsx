import { Link } from "@inertiajs/react";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * @param {Array} links - Array tautan pagination.
 * @param {Function} onPageChange - (Optional) Fungsi callback untuk Client-side pagination.
 * @param {string} variant - 'admin' (default), 'penguji' (oranye), atau 'mahasiswa' (hijau).
 */
const OsPagination = ({ links = [], onPageChange, variant = "admin" }) => {
    if (links.length <= 3) {
        return null;
    }

    const isPenguji = variant === "penguji";
    const isMahasiswa = variant === "mahasiswa";

    const activeBgClass = (() => {
        if (isMahasiswa) return "bg-[var(--os-primary-mhs)] text-white";
        if (isPenguji) return "bg-[var(--os-primary-pj)] text-white";
        return "bg-[var(--os-primary)] text-white";
    })();

    const activeThemeClasses = (() => {
        if (isMahasiswa) {
            return {
                arrow: "border border-[var(--os-primary-mhs)] text-[var(--os-primary-mhs)] hover:bg-[var(--os-primary-mhs)] hover:text-white",
                number: "border border-[var(--os-primary-mhs)] text-[var(--os-primary-mhs)] hover:bg-[var(--os-tertiary-mhs)]",
            };
        }
        if (isPenguji) {
            return {
                arrow: "border border-[var(--os-primary-pj)] text-[var(--os-primary-pj)] hover:bg-[var(--os-primary-pj)] hover:text-white",
                number: "border border-[var(--os-primary-pj)] text-[var(--os-primary-pj)] hover:bg-[var(--os-tertiary-pj)]",
            };
        }
        return {
            arrow: "border border-gray-400 text-gray-700 hover:bg-black hover:text-white",
            number: "border border-gray-400 text-gray-700 hover:bg-gray-100",
        };
    })();

    const arrowActiveClass = activeThemeClasses.arrow;
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

                if (link.active) {
                    combinedClasses =
                        activeBgClass + " font-semibold cursor-default";
                } else if (link.url === null) {
                    combinedClasses =
                        "bg-white border border-gray-400 text-gray-400 cursor-not-allowed";
                } else if (isArrow) {
                    combinedClasses =
                        "bg-white " + arrowActiveClass + " cursor-pointer";
                } else {
                    combinedClasses =
                        "bg-white " + numberActiveClass + " cursor-pointer";
                }

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

                                let finalPageNumber;

                                if (
                                    link.pageNumber !== undefined &&
                                    link.pageNumber !== null
                                ) {
                                    finalPageNumber = link.pageNumber;
                                }
                                else {
                                    const pageNumMatch = link.url
                                        ? link.url.match(/page=(\d+)/)
                                        : null;

                                    if (pageNumMatch) {
                                        finalPageNumber = parseInt(
                                            pageNumMatch[1],
                                            10
                                        );
                                    } else {
                                        finalPageNumber = parseInt(
                                            link.label,
                                            10
                                        );
                                    }
                                }

                                onPageChange(finalPageNumber);
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
