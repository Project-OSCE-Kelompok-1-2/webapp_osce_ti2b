import React from "react";
import { Search, X } from "lucide-react";

/**
 * Komponen Search Bar Minimalis & Modern dengan Varian.
 */
const OsSearchBar = ({ search, setSearch, placeholder = "Cari data...", variant = "admin" }) => {

    const isPenguji = variant === "penguji";
    const isMahasiswa = variant === "mahasiswa"; // Tambahkan varian mahasiswa (Hijau)

    // Tentukan warna fokus (Hijau/Oranye/Biru)
    const focusColor = (() => {
        if (isMahasiswa) {
            // Hijau Mahasiswa
            return "var(--os-primary-mhs)";
        }
        if (isPenguji) {
            // Oranye Penguji
            return "var(--os-primary-pj)";
        }
        // Biru Admin (Default)
        return "var(--os-primary)";
    })();

    // 1. Kelas Fokus (Border dan Ring) + Warna Ikon Saat Fokus
    // Menggunakan sintaks arbitrary values untuk variabel CSS
    const focusColorClass = `focus:border-[${focusColor}] focus:ring-[${focusColor}] group-focus-within:text-[${focusColor}]`;

    // 2. Warna Border Default (Tetap abu-abu agar terlihat bersih)
    const defaultBorderClass = "border-gray-200";

    return (
        // Tambahkan class 'group' di container untuk efek hover/fokus gabungan
        <div className="relative w-full mb-2 h-[46px] group">
            {/* Ikon Kaca Pembesar (Kiri) */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                    // Sisakan kelas warna default ikon (gray-400) dan tambahkan warna fokus kondisional
                    // Menggunakan fokus color yang sudah didefinisikan
                    className={`h-5 w-5 text-gray-400 transition-colors duration-200 ${
                        `group-focus-within:text-[${focusColor}]`
                    }`}
                />
            </div>

            {/* Input Field */}
            <input
                type="text"
                className={`block w-full h-full pl-10 pr-10 rounded-lg border !bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 shadow-sm
                    ${defaultBorderClass}
                    ${focusColorClass}`} // Menggunakan kelas fokus yang dinamis
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Tombol Clear 'X' (Kanan) */}
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

export default OsSearchBar
