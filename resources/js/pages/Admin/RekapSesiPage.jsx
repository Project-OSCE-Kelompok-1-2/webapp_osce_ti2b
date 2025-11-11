import React, { useState } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react"; // 1. Tambahkan Head
import { Search, ArrowLeft } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
// OsBreadCrumb dihapus, kita buat statis
import OsCopyright from "../../components/Copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";

// --- Definisi Kolom Tabel (Sudah Benar) ---
const sesiColumns = [
    { content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        content: "Tanggal / Sesi",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Jumlah Mahasiswa",
        width: "w-80",
        classes: "justify-start items-center px-4",
    },
    {
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

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title={`Rekap Sesi - ${osce.nama_osce}`} />
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* 6. [PERBAIKAN] Breadcrumb dinamis */}
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <button
                        onClick={() => router.visit("/admin/rekap-nilai")}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 flex items-center justify-center shadow-sm"
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

                    {/* 7. [PERBAIKAN] Filter bar dibungkus <form> */}
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5"
                    >
                        <div className="relative w-full md:flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari berdasarkan tanggal (YYYY-MM-DD)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                type="submit"
                                className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 w-full md:w-auto justify-center"
                            >
                                Cari
                            </button>
                        </div>
                    </form>

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Sesi
                    </h2>
                    <OsTableHeader columns={sesiColumns} />

                    {/* 8. [PERBAIKAN] Data Rows Dinamis */}
                    {sesi.data.map((item, index) => (
                        <div
                            key={item.id_sesi} // Gunakan id_sesi
                            className="flex items-center border-t border-gray-400"
                        >
                            <div className="w-16 px-4 py-3 text-center text-os-paragraft">
                                {sesi.from + index}
                            </div>

                            <div className="flex-1 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                {item.tanggal_sesi}
                            </div>

                            <div className="w-80 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                {item.jumlah_mahasiswa} Mahasiswa
                            </div>

                            <div className="w-48 h-[70px] flex items-center justify-center">
                                <div className="border-l px-4 h-[50px] border-gray-400 flex w-full items-center justify-center">
                                    {/* 9. [PERBAIKAN] Tombol Detail Dinamis */}
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                `/admin/rekap-nilai/${osce.id_osce}/sesi/${item.id_sesi}/mahasiswa`
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
