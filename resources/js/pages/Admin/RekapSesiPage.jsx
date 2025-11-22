import React, { useState } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react"; // 1. Tambahkan Head
import { Search, ArrowLeft } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
// OsBreadCrumb dihapus, kita buat statis
import OsCopyright from "../../components/Copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsSearchBar from "../../components/searchbar";
import OsTableBody from "../../components/tablecontain";

// --- Definisi Kolom Tabel (Sudah Benar) ---
const sesiColumns = [
    { key: "no",content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        key: "tanggal_sesi",
        content: "Tanggal / Sesi",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key: "jumlah_mahasiswa",
        content: "Jumlah Mahasiswa",
        width: "w-80",
        classes: "justify-start items-center px-4",
    },
    {
        key:"action",
        content: "Action",
        width: "w-48",
        classes: "justify-center items-center px-4",
    },
];

// 2. [HAPUS] mockFilters dan mockSesi tidak diperlukan lagi

// --- Komponen Utama ---
export default function RekapSesiPage() {
    // 3. [PERBAIKAN] Ambil props dinamis dari controller
    //    'id_osce' tidak diperlukan lagi karena kita punya 'osce' object
    const { osce, sesi, filters, flash } = usePage().props;

    // 4. [PERBAIKAN] State filter (sudah benar)
    const [search, setSearch] = useState(filters.search || "");

    // 5. [PERBAIKAN] Fungsi search dinamis
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            `/admin/rekap-nilai/${osce.id_osce}/sesi`, // URL dinamis
            { search },
            { preserveState: true, replace: true }
        );
    };

    // 6. Siapkan untuk isi data tabel
    const sesiRows = sesi.data.map((item, index) => ({
        no: sesi.from + index,
        tanggal_sesi: item.tanggal_sesi,
        jumlah_mahasiswa: item.jumlah_mahasiswa + " Mahasiswa",
        action: (
            <button
                onClick={() =>
                    router.visit(
                        `/admin/rekap-nilai/${osce.id_osce}/sesi/${item.id_sesi}/mahasiswa`
                    )
                }
                className="bg-gray-800 h-[38px] w-full max-w-[100px] text-white text-os-small rounded-md hover:bg-gray-700"
            >
                Detail
            </button>
        ),
    }));
    
    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title={`Rekap Sesi - ${osce.nama_osce}`} />
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* 6. [PERBAIKAN] Breadcrumb dinamis */}
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <button
                        onClick={() => router.visit("/admin/rekap-nilai")}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 flex items-center justify-center"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium bg-white">
                        Rekap Nilai / {osce.nama_osce} / Sesi
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
                        Pilih salah satu sesi (berdasarkan tanggal) untuk
                        melihat daftar mahasiswa.
                    </p>

                    {/* searchbar*/}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari berdasarkan tanggal (YYYY-MM-DD)..."
                    />


                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Sesi
                    </h2>
                    <OsTableHeader columns={sesiColumns} />

                    <OsTableBody data={sesiRows} columns={sesiColumns} />


                    {/* Pesan jika tidak ada data */}
                    {sesi.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data sesi tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {/* 10. [PERBAIKAN] Paginasi Dinamis */}
                    {sesi.links && sesi.links.length > 3 && (
                        <div className="mt-8">
                            <OsPagination links={sesi.links} />
                        </div>
                    )}
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
