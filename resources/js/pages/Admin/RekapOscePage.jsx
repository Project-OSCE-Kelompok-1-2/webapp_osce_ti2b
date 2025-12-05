import { Link, usePage, router, Head } from "@inertiajs/react";
import React, { useState } from "react";
import { Search } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsCopyright from "../../components/Copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsHeader from "../../components/Header";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsInput from "../../components/Input.jsx";

// --- Definisi Kolom Tabel ---
const rekapColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
    },
    {
        key: "nama_osce",
        content: "Nama OSCE",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key: "rentang_tanggal",
        content: "Rentang Tanggal",
        width: "w-80",
        classes: "justify-start items-center px-4",
    },
    {
        key: "tahun_akademik",
        content: "Tahun Akademik",
        width: "w-48",
        classes: "justify-center items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-48",
        classes: "justify-center items-center px-4",
    },
];

export default function RekapOscePage() {
    const { osce, filters, flash, tahunAkademikOptions } = usePage().props;

    const [search, setSearch] = useState(filters.search || "");
    const [tahun, setTahun] = useState(filters.tahun || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/admin/rekap-nilai",
            { search, tahun },
            { preserveState: true, replace: true }
        );
    };

    const tahunList = [
        { value: "", label: "Semua Tahun" },
        ...(Array.isArray(tahunAkademikOptions) ? tahunAkademikOptions : []),
    ];

    /**
     * 🔹 HELPER: Format Tanggal Indonesia (01 Januari 2024)
     */
    const formatDateIndo = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        // Cek validitas tanggal
        if (isNaN(date.getTime())) return dateStr; // Kembalikan asli jika error

        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long", // "long" = Januari, "short" = Jan
            year: "numeric",
        }).format(date);
    };

    /**
     * 🔹 HELPER: Format Rentang (Start - End)
     */
    const formatRentang = (rawString) => {
        if (!rawString) return "-";

        // Cek apakah string mengandung pemisah " - "
        if (typeof rawString === "string" && rawString.includes(" - ")) {
            const [start, end] = rawString.split(" - ");
            const formattedStart = formatDateIndo(start);
            const formattedEnd = formatDateIndo(end);
            return `${formattedStart} - ${formattedEnd}`;
        }

        // Fallback jika format tidak dikenali
        return rawString;
    };

    // --- Siapkan Data Tabel ---
    const tableData = osce.data.map((item, index) => ({
        no: osce.from + index,
        nama_osce: (
            <div className="text-left px-4">
                <div className="font-medium text-gray-900">
                    {item.nama_rubrik}
                </div>
                <div className="text-sm text-gray-500">
                    {item.detail_mahasiswa}
                    {item.detail_mahasiswa && item.detail_sesi && " | "}
                    {item.detail_sesi}
                </div>
            </div>
        ),
        // [PERUBAHAN] Menggunakan helper formatRentang
        rentang_tanggal: (
            <span className="text-sm text-gray-700 whitespace-nowrap">
                {formatRentang(item.rentang_tanggal)}
            </span>
        ),
        tahun_akademik: item.tahun_akademik,
        action: (
            <button
                onClick={() =>
                    router.visit(`/admin/rekap-nilai/${item.id_osce}/sesi`)
                }
                className="bg-blue-800 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
                Detail
            </button>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                <OsHeader />

                <div className="flex-1 overflow-auto">
                    {/* Notifikasi Sukses/Error */}
                    {flash.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    <h2 className="font-semibold text-lg mb-1">
                        Menu Rekap Nilai
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Pilih OSCE yang telah selesai untuk melihat rekapitulasi
                        nilai mahasiswa.
                    </p>

                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari data OSCE..."
                    >
                        <OsInput
                            type="select"
                            value={tahun}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                // Hanya set nilai jika bukan string yang dihasilkan dari konversi objek yang gagal
                                if (
                                    typeof newValue === "string" &&
                                    newValue.includes("[object")
                                ) {
                                    setTahun(""); // Default ke nilai kosong jika terjadi error
                                } else {
                                    setTahun(newValue);
                                }
                            }}
                            options={tahunList}
                            className="w-[180px]"
                        />
                    </OsSearchBar>

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table OSCE
                    </h2>
                    <OsTableHeader columns={rekapColumns} />

                    <OsTableBody data={tableData} columns={rekapColumns} />

                    {/* Pesan jika tidak ada data */}
                    {osce.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data rekap nilai tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {/* Paginasi Dinamis */}
                    {osce.links && osce.links.length > 3 && (
                        <div className="mt-8">
                            <OsPagination links={osce.links} />
                        </div>
                    )}
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
