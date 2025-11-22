import React, { useState } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react"; // 1. Tambahkan Head
import { Search, ArrowLeft } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
// import OsBreadCrumb from "../../components/breadcrumb"; // Buat breadcrumb statis/dinamis
import OsCopyright from "../../components/Copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsHeader from "../../components/Header";

// --- Definisi Kolom Tabel (Sudah Benar) ---
const mahasiswaColumns = [
    { content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        content: "Nim Mahasiswa",
        width: "w-80",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Nama Mahasiswa",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Action",
        width: "w-48",
        classes: "justify-center items-center px-4",
    },
];

// 2. [HAPUS] Mock data (mockFilters dan mockMahasiswa) tidak diperlukan lagi

// --- Komponen Utama ---
export default function RekapMahasiswaPage() {
    // 3. [PERBAIKAN] Ambil props dinamis dari controller
    const { osce, sesi, mahasiswa_list, filters, flash } = usePage().props;

    // 4. [PERBAIKAN] State filter disesuaikan (search dan angkatan)
    const [search, setSearch] = useState(filters.search || "");
    const [angkatan, setAngkatan] = useState(filters.angkatan || ""); // Ganti 'year' jadi 'angkatan'

    // Opsi untuk filter angkatan
    const angkatanList = [
        { value: "", label: "Semua Angkatan" },
        { value: "2025", label: "2025" },
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
    ];

    // 5. [PERBAIKAN] Fungsi search dinamis
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            window.location.pathname, // Tetap di halaman ini
            { search, angkatan }, // Kirim filter yang benar
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head
                title={`Mahasiswa Sesi ${sesi.tanggal_formatted} - ${osce.nama_osce}`}
            />
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* 6. [PERBAIKAN] Breadcrumb dinamis */}
                <OsHeader
                    variant="goback"
                    backLink=""
                />

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
                        Menu Nilai Mahasiswa
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Daftar mahasiswa yang ter-enroll di sesi tanggal{" "}
                        {sesi.tanggal_formatted}.
                    </p>

                    {/* 7. [PERBAIKAN] Filter bar <form> */}
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
                                placeholder="Cari NIM atau Nama Mahasiswa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <select
                                value={angkatan}
                                onChange={(e) => setAngkatan(e.target.value)}
                                className="border border-gray-700 rounded-lg h-[46px] flex-1 w-auto md:flex-none md:w-40 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {angkatanList.map((a) => (
                                    <option key={a.value} value={a.value}>
                                        {a.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 w-auto justify-center"
                            >
                                Cari
                            </button>
                        </div>
                    </form>

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Mahasiswa
                    </h2>
                    <OsTableHeader columns={mahasiswaColumns} />

                    {/* 8. [PERBAIKAN] Data Rows Dinamis (looping 'mahasiswa_list') */}
                    {mahasiswa_list.data.map((item, index) => (
                        <div
                            key={item.id_mahasiswa} // Gunakan id_mahasiswa
                            className={`flex items-center border-t border-gray-400 ${
                                index % 2 === 1 ? "bg-gray-100" : ""
                            }`}
                        >
                            <div className="w-16 px-4 py-3 text-center text-os-paragraft">
                                {mahasiswa_list.from + index}
                            </div>

                            <div className="w-80 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                {item.nim}
                            </div>

                            <div className="flex-1 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                {item.nama}
                            </div>

                            <div className="w-48 h-[70px] flex items-center justify-center">
                                <div className="border-l px-4 h-[50px] border-gray-400 flex w-full items-center justify-center">
                                    {/* 9. [PERBAIKAN] Tombol Lihat Nilai Dinamis */}
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                `/admin/rekap-nilai/mahasiswa/${item.id_mahasiswa}/osce/${osce.id_osce}`
                                            )
                                        }
                                        className="bg-blue-600 h-[38px] w-full max-w-[100px] text-white text-os-small rounded-md text-center flex items-center justify-center hover:bg-blue-700"
                                    >
                                        Lihat Nilai
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pesan jika tidak ada data */}
                    {mahasiswa_list.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data mahasiswa tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {/* 10. [PERBAIKAN] Paginasi Dinamis */}
                    {mahasiswa_list.links &&
                        mahasiswa_list.links.length > 3 && (
                            <div className="mt-8">
                                <OsPagination links={mahasiswa_list.links} />
                            </div>
                        )}
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
