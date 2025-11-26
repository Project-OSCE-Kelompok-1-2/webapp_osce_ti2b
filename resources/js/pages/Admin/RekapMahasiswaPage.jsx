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
import OsSearchBar from "../../components/searchbar.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsInput from "../../components/Input.jsx";

// --- Definisi Kolom Tabel (Sudah Benar) ---
const mahasiswaColumns = [
    { key : "no",content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        key : "nim_mahasiswa",
        content: "Nim Mahasiswa",
        width: "w-80",
        classes: "justify-start items-center px-4",
    },
    {
        key : "nama_mahasiswa",
        content: "Nama Mahasiswa",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key : "action",
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

    //6. Siapkan data untuk isi data tabel
    const tableData = mahasiswa_list.data.map((item, index) => ({
        no: mahasiswa_list.from + index,
        nim_mahasiswa: item.nim,
        nama_mahasiswa: item.nama,
        action: (
            <button
                onClick={() =>
                    router.visit(
                        `/admin/rekap-nilai/mahasiswa/${item.id_mahasiswa}/osce/${osce.id_osce}`
                    )
                }
                className="bg-blue-600 h-[38px] w-full max-w-[100px] text-white text-os-small rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
                Lihat Nilai
            </button>
        )
    }));

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

                    {/* 7. searchbar+dropdown */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari NIM atau Nama Mahasiswa..."
                    >
                        <OsInput
                            type="select"
                            value={angkatan}
                            onChange={(e) => setAngkatan(e.target.value)}
                            options={angkatanList}
                            className="w-[160px]"
                        />
                    </OsSearchBar>

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Mahasiswa
                    </h2>
                    <OsTableHeader columns={mahasiswaColumns} />

                    <OsTableBody data={tableData} columns={mahasiswaColumns} />

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
