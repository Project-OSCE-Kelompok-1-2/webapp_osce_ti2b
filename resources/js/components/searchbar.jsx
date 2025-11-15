// components/OsSearchBar.jsx
import React from "react";
import { Search } from "lucide-react";
import OsButton from "./button";

/**
 * Komponen Search Bar yang reusable dengan tombol Cari.
 * * @param {string} search - Nilai input pencarian saat ini.
 * @param {function} setSearch - Fungsi state setter untuk mengupdate nilai search.
 * @param {function} onSearchClick - Fungsi yang dipanggil ketika tombol 'Cari' diklik.
 * @param {string} placeholder - Teks placeholder untuk input.
 */
const OsSearchBar = ({ search, setSearch, onSearchClick, placeholder = "Cari data..." }) => {

    // Opsional: Handle submit form (tekan Enter)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearchClick();
        }
    };

    return (
        <div className="flex h-[46px] items-center space-x-3 mb-5"> {/* Menambahkan margin bottom yang lebih jelas */}
            <div className="relative h-full w-full ">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-lg py-2 pl-10 pr-4 h-full text-os-paragraft focus:outline-none border-os-1 border-os-black"
                />
            </div>
            <OsButton
                name="os-primary"
                onClick={onSearchClick}
                className="bg-blue-600 min-w-[120px] text-white h-full text-os-paragraft px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
            >
                Cari
            </OsButton>
        </div>
    );
};

export default OsSearchBar;
