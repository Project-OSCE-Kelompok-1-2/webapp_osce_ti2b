import { Link, usePage, router, Head } from "@inertiajs/react";
import React, { useState } from "react";
import { Search } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
// import OsBreadCrumb from "../../components/breadcrumb"; // Breadcrumb statis lebih cocok di sini
import OsCopyright from "../../components/Copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsHeader from "../../components/Header";

// --- Definisi Kolom Tabel (Sudah Benar) ---
const rekapColumns = [
    { content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        content: "Nama OSCE",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Rentang Tanggal",
        width: "w-80",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Tahun Akademik",
        width: "w-48",
        classes: "justify-center items-center px-4",
    },
    {
        content: "Action",
        width: "w-48",
        classes: "justify-center items-center px-4",
    },
];

// 2. [HAPUS] Mock data (mockFilters dan mockOsce) tidak diperlukan lagi

export default function RekapOscePage() {
    // 3. [PERBAIKAN] Ambil props dinamis langsung dari usePage
    const { osce, filters, flash } = usePage().props;

    // 4. [PERBAIKAN] State filter disesuaikan dengan 'tahun' (dari contract)
    const [search, setSearch] = useState(filters.search || "");
    const [tahun, setTahun] = useState(filters.tahun || ""); // Ganti 'year' menjadi 'tahun'

    // 5. [PERBAIKAN] Fungsi untuk menjalankan pencarian
    const handleSearch = (e) => {
        e.preventDefault(); // Bungkus dalam form
        router.get(
            "/admin/rekap-nilai", // URL route yang benar (sesuai contract)
            { search, tahun }, // Kirim 'tahun', bukan 'year'
            { preserveState: true, replace: true }
        );
    };

    // Daftar tahun (bisa dibuat dinamis jika perlu)
    const tahunList = [
        { value: "", label: "Semua Tahun" },
        { value: "2025/2026", label: "2025/2026" },
        { value: "2024/2025", label: "2024/2025" },
        { value: "2023/2024", label: "2023/2024" },
    ];

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* Breadcrumb Statis */}
                <OsHeader/>

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

                    {/* 6. [PERBAIKAN] Filter bar dibungkus <form> */}
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row items-center gap-4 mb-5"
                    >
                        <div className="relative w-full md:flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari data OSCE..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex w-full md:w-auto items-center gap-3">
                            <select
                                value={tahun} // Gunakan state 'tahun'
                                onChange={(e) => setTahun(e.target.value)} // Set state 'tahun'
                                className="border border-gray-700 rounded-lg h-[46px] flex-1 w-auto md:flex-none md:w-40 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {tahunList.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit" // Tipe submit
                                className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 w-auto justify-center"
                            >
                                Cari
                            </button>
                        </div>
                    </form>

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table OSCE
                    </h2>
                    <OsTableHeader columns={rekapColumns} />

                    {/* 7. [PERBAIKAN] Data Rows Dinamis */}
                    {osce.data.map((item, index) => (
                        <div
                            key={item.id_osce} // Gunakan id_osce
                            className="flex items-center border-t border-gray-400"
                        >
                            <div className="w-16 px-4 py-3 text-center text-os-paragraft">
                                {osce.from + index}
                            </div>

                            <div className="flex-1 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                <div className="font-medium text-gray-900">
                                    {item.nama_rubrik}
                                </div>
                                {/* Gunakan detail_mahasiswa dan detail_sesi dari contract */}
                                <div className="text-sm text-gray-500">
                                    {item.detail_mahasiswa}
                                    {/* Tampilkan | hanya jika kedua data ada */}
                                    {item.detail_mahasiswa &&
                                        item.detail_sesi &&
                                        " | "}
                                    {item.detail_sesi}
                                </div>
                            </div>

                            <div className="w-80 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                {item.rentang_tanggal}
                            </div>

                            <div className="w-48 px-4 py-3 border-l border-gray-400 text-center text-os-paragraft">
                                {item.tahun_akademik}
                            </div>

                            <div className="w-48 h-[70px] flex items-center justify-center">
                                <div className="border-l px-4 h-[50px] border-gray-400 flex w-full items-center justify-center">
                                    {/* 8. [PERBAIKAN] Tombol Detail Dinamis */}
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                `/admin/rekap-nilai/${item.id_osce}/sesi`
                                            )
                                        }
                                        className="bg-gray-800 h-[38px] w-full max-w-[100px] text-white text-os-small rounded-md text-center flex items-center justify-center hover:bg-gray-700"
                                    >
                                        Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pesan jika tidak ada data */}
                    {osce.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data rekap nilai tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {/* 9. [PERBAIKAN] Paginasi Dinamis */}
                    {osce.links &&
                        osce.links.length > 3 && ( // Hanya tampilkan jika ada lebih dari 1 halaman
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
