import React, { useState } from "react";
import { Link } from "@inertiajs/react";
// 1. Hapus 'usePage', kita akan gunakan props
import { router } from "@inertiajs/react";
import { Search, ArrowLeft, Pencil, Trash2 } from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
// Hapus OsBreadCrumb jika tidak digunakan, atau sesuaikan
// import OsBreadCrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";


const jadwalColumns = [
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
        key: "action",
        content: "Action",
        width: "w-60",
        classes: "justify-center items-center",
    }
];

// 2. HAPUS 'mockFilters' dan 'mockSesi'
// const mockFilters = { ... };
// const mockSesi = { ... };

// 3. Terima PROPS dinamis dari controller
export default function OsceJadwalPage({ osce, sesi, filters }) {
    // 4. 'search' state mengambil dari prop 'filters'
    const [search, setSearch] = useState(filters.search || "");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault(); // Mencegah form submit
        router.get(
            `/admin/osce/${osce.id_osce}/jadwal`,
            { search }, // Data query
            { preserveState: true, replace: true }
        );
    };

    const handleEditEnrollment = (jadwal_id) => {
        router.visit(
            `/admin/osce/${osce.id_osce}/jadwal/${jadwal_id}/enrollment`
        );
    };

    const handleEditSesi = (item) => {
        const sesiId = `${item.tanggal}_${item.jam_mulai}`;

        router.visit(`/admin/osce/${osce.id_osce}/jadwal/${sesiId}/edit`);
    };

    // [PERBAIKAN] Fungsi untuk tombol TRASH (Delete Sesi)
    const handleDeleteSesi = (item) => {
        const sesiId = `${item.tanggal}_${item.jam_mulai}`;

        if (
            confirm(
                "Yakin hapus sesi ini? Ini akan meng-unset jadwal untuk semua stase di sesi ini."
            )
        ) {
            router.delete(`/admin/osce/${osce.id_osce}/jadwal/${sesiId}`, {
                preserveScroll: true, // Agar halaman tidak loncat
            });
        }
    };


    // siapin isi data tabel
    const rows = sesi.data.map((item, index) => ({
        no: sesi.from + index,
        "tanggal_sesi": `${item.tanggal_formatted} (Pukul ${item.jam_mulai_formatted})`,
        jumlah_mahasiswa: `${item.jumlah_mahasiswa} Mahasiswa`,
        action: (
            <div className="flex items-center justify-between w-full px-5">
    
                <button
                    onClick={() => handleEditEnrollment(item.id_osce_stase)}
                    className="h-[44px] px-5 bg-neutral-800 text-white text-sm rounded-xl hover:bg-neutral-700"
                >
                    Edit enrollment
                </button>
    
                <div className="h-8 w-px bg-gray-300 mx-3" />
    
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEditSesi(item)}
                        className="flex items-center justify-center w-[38px] h-[38px] rounded-xl bg-neutral-800 text-white hover:bg-neutral-700"
                    >
                        <Pencil size={17} />
                    </button>
    
                    <button
                        onClick={() => handleDeleteSesi(item)}
                        className="flex items-center justify-center w-[38px] h-[38px] rounded-xl border border-gray-400 text-gray-800 hover:bg-gray-100"
                    >
                        <Trash2 size={17} />
                    </button>
                </div>
            </div>
        )
    }));
    

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            <Sidebar onToggle={setSidebarOpen} />

            <main
                className={`grid w-full h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 ${
                    sidebarOpen ? "ml-0" : "ml-20"
                }`}
            >
                <div className="flex items-center gap-3 text-sm text-gray-700 px-5 py-[10px] border-b border-gray-300 bg-white">
                    <button
                        // Kembali ke halaman list OSCE
                        onClick={() => router.visit("/admin/osce")}
                        className="bg-blue-600 text-white p-[10px] rounded-full hover:bg-blue-700 flex items-center justify-center shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex-1 border border-gray-400 rounded-lg px-4 py-[9px] text-sm font-medium bg-white leading-none">
                        {/* Gunakan data 'osce' dari props */}
                        OSCE / {osce.nama_osce} / Jadwal Sesi
                    </div>
                </div>

                {/* 💻 Content */}
                <div className="flex-1 overflow-auto px-8 pb-8">
                    <h2 className="font-semibold text-lg mb-2">Navigasi</h2>
                    <div className="flex gap-2 mb-6">
                        <button
                            // Link ke Halaman Stase untuk OSCE ini
                            onClick={() =>
                                router.visit(
                                    `/admin/osce/${osce.id_osce}/stase`
                                )
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-medium rounded-lg"
                        >
                            Halaman Stase
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
                            Jadwal Sesi
                        </button>
                    </div>

                    <h2 className="font-semibold text-lg mb-1">
                        Menu Sesi OSCE
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nunc vulputate libero et velit interdum, ac aliquet odio
                        mattis.
                    </p>

                    <button
                        // Link ke Halaman Create Jadwal
                        onClick={() =>
                            router.visit(
                                `/admin/osce/${osce.id_osce}/jadwal/create`
                            )
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 mb-8"
                    >
                        Masukkan Sesi
                    </button>
                        
                    
                        <OsSearchBar
                            search={search}
                            setSearch={setSearch}
                            onSearchClick={handleSearch}
                            placeholder="Cari jadwal..."
                        />

                   

                    {/* === 📋 TABLE === */}
                    <h2 className="font-semibold text-lg mb-3">Table Sesi</h2>
                    <div className="border rounded-lg overflow-hidden">

                        {/* HEADER */}
                        <OsTableHeader columns={jadwalColumns} />

                        {/* BODY */}
                        <OsTableBody data={rows} columns={jadwalColumns} />

                    </div>

                    {/* Pesan Kosong */}
                    {sesi.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data sesi tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {sesi.links && sesi.links.length > 3 && (
                        <div className="mt-6 border-t-4 border-black pt-4 flex justify-start">
                            <OsPagination links={sesi.links} />
                        </div>
                    )}
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
