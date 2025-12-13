import React from "react";
import { Search, X } from "lucide-react";

/**
 * Komponen Search Bar Minimalis & Modern dengan Varian.
 */
const OsSearchBar = ({ search, setSearch, placeholder = "Cari data...", variant = "admin" }) => {

    const isPenguji = variant === "penguji";

    // Tentukan kelas warna dinamis
    // Jika 'penguji', gunakan kelas oranye, jika tidak, gunakan kelas biru/default.

    // 1. Warna Fokus (Border dan Ring) + Warna Ikon Saat Fokus
    // Default: blue-500
    // Penguji: os-focus-orange (Ganti dengan kelas oranye Anda, contoh: focus:border-amber-500)
    const focusColorClass = isPenguji
        ? "border-orange-500 focus:ring-orange-500 group-focus-within:text-orange-500"
        : "border-blue-500 focus:ring-blue-500 group-focus-within:text-blue-500";

    // 2. Warna Border Default (Tambahkan jika Anda ingin border non-fokus juga oranye)
    // Default: border-gray-200
    // Penguji: border-os-border-orange-default (Ganti dengan kelas oranye border Anda)
    const defaultBorderClass = isPenguji
        ? "border-gray-200"
        : "border-gray-200";

    return (
        // Tambahkan class 'group' di container untuk efek hover/fokus gabungan
        <div className="relative w-full mb-2 h-[46px] group">
            {/* Ikon Kaca Pembesar (Kiri) */}
            {/* Menggunakan kelas dinamis untuk warna fokus ikon */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                    // Sisakan kelas warna default ikon (gray-400) dan tambahkan warna fokus kondisional
                    className={`h-5 w-5 text-gray-400 transition-colors duration-200 ${
                        isPenguji ? "group-focus-within:text-os-focus-orange" : "group-focus-within:text-blue-500"
                    }`}
                />
            </div>

            {/* Input Field */}
            <input
                type="text"
                className={`block w-full h-full pl-10 pr-10 rounded-lg border !bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 shadow-sm
                    ${defaultBorderClass}
                    ${focusColorClass}`}
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Tombol Clear 'X' (Kanan) - Tidak perlu perubahan warna, tetap abu-abu/hover abu-abu */}
            {search && (
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
