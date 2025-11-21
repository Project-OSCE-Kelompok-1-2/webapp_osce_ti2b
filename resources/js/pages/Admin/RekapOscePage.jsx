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
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsInput from "../../components/Input.jsx";

// --- Definisi Kolom Tabel (Sudah Benar) ---
const rekapColumns = [
    { key:"no",content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        key:"nama_osce",
        content: "Nama OSCE",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key:"rentang_tanggal",
        content: "Rentang Tanggal",
        width: "w-80",
        classes: "justify-start items-center px-4",
    },
    {
        key:"tahun_akademik",
        content: "Tahun Akademik",
        width: "w-48",
        classes: "justify-center items-center px-4",
    },
    {
        key:"action",
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

    //6. Siapkan data untuk isi data tabel
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
        rentang_tanggal: item.rentang_tanggal,
        tahun_akademik: item.tahun_akademik,
        action: (
            <button
                onClick={() => router.visit(`/admin/rekap-nilai/${item.id_osce}/sesi`)}
                className="bg-blue-800 text-white px-3 py-2 rounded-md hover:bg-gray-700"
            >
                Detail
            </button>
        ),
    }));
    
    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title="Rekap Nilai OSCE" />
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* Breadcrumb Statis */}
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium bg-white">
                        Rekap Nilai
                    </div>
                </div>

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

                    {/* 6. searchbar+dropdown */}
                    
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari data OSCE..."
                    >
                        {/* DROPDOWN DI TENGAH */}
                        <OsInput
                            type="select"
                            value={tahun}
                            onChange={(e) => setTahun(e.target.value)}
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
