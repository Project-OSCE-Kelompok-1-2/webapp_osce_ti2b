import React, { useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header";
// [PERBAIKAN] Import usePage untuk mengambil props
import { Head, router, usePage, Link } from "@inertiajs/react";
import OsPagination from "../../components/pagination";
import {
    Home,
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Copyright,
} from "lucide-react";
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import Os_input from "../../components/Input.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsButton from "../../components/button.jsx";


//Definisi kolom tabel 
const columns = [
    { content: "No", width: "w-16", classes: "justify-center items-center", key: "no" },
    { content: "Nama OSCE", width: "flex-1", classes: "justify-start px-4", key: "nama" },
    { content: "Rentang Tanggal", width: "w-48", classes: "justify-center", key: "tanggal" },
    { content: "Tahun Akademik", width: "w-32", classes: "justify-center", key: "tahun" },
    { content: "Aksi", width: "w-[240px]", classes: "justify-center", key: "aksi" },
];

export default function OsceListPage({ osce, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [tahun, setTahun] = useState(filters.tahun || "2025"); // Asumsi default

    const handleSearch = (e) => {
        e.preventDefault();
        // [PERBAIKAN] Ganti route() dengan URL string
        router.get(
            "/admin/osce", // <-- Endpoint GET
            { search, tahun },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data OSCE ini?")) {
            // [PERBAIKAN] Gunakan router.delete dengan URL string
            router.delete(`/admin/osce/${id}`, {
                preserveScroll: true,
            });
        }
    };


    // 1. Siapin isi data tabel 
    const rows = osce.data.map((item, i) => ({
        no: osce.from + i,
        nama: (
            <div className="flex flex-col items-start leading-tight">
                <div className="font-semibold leading-tight">{item.nama_osce}</div>
                <div className="text-xs text-gray-500 leading-tight">
                    {item.detail_stase} | {item.detail_mahasiswa} | {item.detail_sesi}
                </div>
            </div>
        ),
                
        tanggal: (
            <div className="h-full flex items-center justify-center">
                {item.tanggal_mulai} - {item.tanggal_selesai}
            </div>
        ),
        tahun: (
            <div className="h-full flex items-center justify-center">
                {item.tahun_akademik_string}
            </div>
        ),
        
            aksi: (
                <div className="flex flex-wrap gap-2 justify-center items-center min-w-[220px]">
                    <OsButton
                        name="primary"
                        onClick={() => router.get(`/admin/osce/${item.id_osce}/stase`)}
                        className="min-w-[110px]"
                    >
                        Edit Property
                    </OsButton>
            
                    <OsButton
                        name="edit"
                        onClick={() => router.get(`/admin/osce/${item.id_osce}/edit`)}
                        className="p-1.5 text-black bg-white hover:bg-red-600 hover:text-white
                                   border border-black rounded-lg"
                    >
                        <Edit2 size={14} />
                    </OsButton>
            
                    <OsButton
                        name="warning"
                        onClick={() => handleDelete(item.id_osce)}
                        className="p-1.5 text-black bg-white hover:bg-red-600 hover:text-white
                                   border border-black rounded-lg"
                    >
                        <Trash2 size={14} />
                    </OsButton>
                </div>
            )
            
              
    }));

    return (
        <div className="min-h-screen flex bg-white">
            <Sidebar />
            <main className="flex-1 p-6 ml-[5rem]">
                <Head title="Admin OSCE" />
                <OsHeader/>

                <section className="mb-1 mt-2">
                    <h2 className="text-lg font-semibold mb-1">Menu OSCE</h2>
                    <p className="text-sm text-gray-500 mb-2 max-w-2xl">
                        {/* ... (Deskripsi) ... */}
                    </p>

                    <OsButton
                        name="primary"
                        onClick={() => router.get("/admin/osce/create")}
                        className="mb-4 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Tambah OSCE
                    </OsButton>
                </section>

                <section>
                    <h2 className="text-lg font-semibold mb-4">Table OSCE</h2>

                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari data OSCE..."
                    >
                        {/* Dropdown / filter di tengah (slot children) */}
                        <Os_input
                            type="select"
                            label=""
                            options={[
                                { label: "Semua Tahun", value: "" },
                                { label: "2025", value: "2025" },
                                { label: "2024", value: "2024" },
                                { label: "2023", value: "2023" },
                            ]}
                            value={tahun}
                            onChange={(e) => setTahun(e.target.value)}
                            className="w-[140px]"
                        />
                    </OsSearchBar>


                    {/* Table */}
                    <OsTableHeader columns={columns} />
                    <OsTableBody data={rows} columns={columns} />

                               
                    {/* Pesan jika data kosong */}
                    {osce.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-300">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data OSCE tidak ditemukan.
                            </p>
                        </div>
                    )}


                    {/* Pagination */}
                    {osce.links && osce.links.length > 0 && (
                    <div className="mt-8">
                        <OsPagination links={osce.links} />
                    </div>
                )}
       
                </section>

                {/* footer */}
                <footer className="mt-auto pt-6 border-t border-gray-200">
                    <OsCopyright />
                 </footer>
            </main>
        </div>
    );
}
