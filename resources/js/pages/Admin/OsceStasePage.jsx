import React, { useState } from "react";
import Sidebar from "../../components/Sidebar"; // Pastikan path ini benar
import { Link, router, usePage } from "@inertiajs/react";
import {
    ClipboardList,
    CalendarClock,
    Plus,
    Search,
    Edit,
    Trash2,
} from "lucide-react";
import OsHeader from "../../components/Header"; // 1. Impor komponen breadcrumb

// 2. Pastikan nama file komponen pagination Anda benar
import OsPagination from "../../components/pagination";
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsButton from "../../components/button.jsx";



//Definisi kolom tabel
const tableColumns = [
    { content: "No", width: "w-16", classes: "justify-center" },
    { content: "Ruangan", width: "flex-1", classes: "justify-start px-4" },
    { content: "Stase", width: "flex-1", classes: "justify-start px-4" },
    { content: "Penguji", width: "flex-1", classes: "justify-start px-4" },
    { content: "Action", width: "w-32", classes: "justify-center" },
];

export default function OsceStasePage({ stase, osce, filters }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");

    function handleSearch(e) {
        e.preventDefault();
        router.get(
            `/admin/osce/${osce.id_osce}/stase`,
            { search: searchTerm },
            { preserveState: true, replace: true }
        );
    }

    function handleDelete(staseId) {
        if (confirm("Yakin ingin menghapus stase ini?")) {
            router.delete(`/admin/osce/${osce.id_osce}/stase/${staseId}`, {
                preserveScroll: true,
            });
        }
    }

    //Siapin isi data tabel 
    const tableData = stase.data.map((item, index) => ({
        no: stase.from + index,
        ruangan: `Ruang ${item.ruang.nomor_ruangan}`,
        stase: item.stase.nama_stase,
        penguji: item.penguji?.nama || "Belum diatur",
        action: (
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() =>
                        router.get(`/admin/osce/${osce.id_osce}/stase/${item.id_osce_stase}/edit`)
                    }
                    className="p-2 rounded-md border bg-black text-white hover:bg-gray-400"
                >
                    <Edit size={14} />
                </button>
    
                <button
                    onClick={() => handleDelete(item.id_osce_stase)}
                    className="p-2 rounded-md border text-red-600 hover:bg-red-50"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        )
    }));
    
    return (
        <div className="min-h-screen flex">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main
                className={`flex-1 flex p-6 flex-col transition-all duration-300 ${
                    isSidebarOpen ? "ml-64" : "ml-20"
                }`}
            >
                {/* 5. Pastikan backend mengirim prop 'osce' */}
                <OsHeader/>

                <div className="flex-1 p-2">
                    {/* Navigasi */}
                    <section className="mb-2">
                        <h2 className="text-lg font-semibold mb-3">Navigasi</h2>

                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                                <ClipboardList size={16} />
                                Halaman Stase
                            </button>

                            <button
                                onClick={() =>
                                    router.get(
                                        `/admin/osce/${osce.id_osce}/jadwal`
                                    )
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-white border text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                <CalendarClock size={16} />
                                Jadwal Sesi
                            </button>
                        </div>
                    </section>
                    

                    {/* Tambah Stase */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold mb-1">
                            Menu Halaman Stase
                        </h2>

                        <p className="text-sm text-gray-500 mb-4 max-w-lg">
                            Jorem ipsum dolor sit amet, consectetur adipiscing
                            elit.
                        </p>

                        <OsButton
                            name="primary"
                            onClick={() => router.get(`/admin/osce/${osce.id_osce}/stase/create`)}
                            className="flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Masukkan Stase
                        </OsButton>

                    </section>

                    {/* Search */}
                        <OsSearchBar
                            search={searchTerm}
                            setSearch={setSearchTerm}
                            onSearchClick={handleSearch}
                            placeholder="Cari data stase..."
                        />

                            <h2 className="text-lg font-semibold text-gray-800">
                                Tabel Stase
                            </h2>
                       

                        {/* Tabel */}
                        <div className="mt-4">
                            <OsTableHeader columns={tableColumns} />
                            <OsTableBody
                                columns={[
                                    { key: "no", width: "w-16", classes: "justify-center" },
                                    { key: "ruangan", classes: "justify-start px-4" },
                                    { key: "stase", classes: "justify-start px-4" },
                                    { key: "penguji", classes: "justify-start px-4" },
                                    { key: "action", width: "w-32", classes: "justify-center" },
                                ]}
                                data={tableData}
                            />
                        </div>
                    </div>
                        <OsPagination links={stase?.links} />
              
                 {/* footer */}
                <footer className="mt-auto pt-6 border-t border-gray-200">
                    <OsCopyright />
                 </footer>
            </main>
        </div>
   
    );
}
