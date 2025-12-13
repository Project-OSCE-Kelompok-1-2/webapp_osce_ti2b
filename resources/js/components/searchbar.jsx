import React from "react";
import { Search, X } from "lucide-react";

/**
 * Komponen Search Bar Minimalis & Modern.
 * - Menggunakan 'div' untuk tombol 'X' agar tidak konflik dengan style global.
 * - Styling input yang lebih bersih dengan efek fokus yang halus.
 */
const OsSearchBar = ({ search, setSearch, placeholder = "Cari data..." }) => {
    return (
        // Tambahkan class 'group' di container untuk efek hover/fokus gabungan
        <div className="relative w-full mb-2 h-[46px] group">
            {/* Ikon Kaca Pembesar (Kiri) */}
            {/* group-focus-within:text-blue-500 membuat ikon jadi biru saat input difokuskan */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            </div>

            {/* Input Field */}
            <input
                type="text"
                className="block w-full h-full pl-10 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 shadow-sm"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Tombol Clear 'X' (Kanan) - Hanya muncul jika ada teks */}
            {search && (
                // Menggunakan 'div' dengan role='button' untuk menghindari konflik style
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSearch("")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSearch("");
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200 z-10 outline-none"
                    title="Hapus pencarian"
                >
                    <X className="h-5 w-5" />
                </div>
            )}
        </div>
    );
};

export default OsSearchBar;
