import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Search, ArrowLeft } from "lucide-react"; 

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb"; 
import OsCopyright from "../../components/copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";

// --- Definisi Kolom Tabel (SESUAI GAMBAR) ---
const sesiColumns = [
    { content: 'No', width: 'w-16', classes: 'justify-center items-center' },
    { content: 'Tanggal / Sesi', width: 'flex-1', classes: 'justify-start items-center px-4' },
    { content: 'Jumlah Mahasiswa', width: 'w-80', classes: 'justify-start items-center px-4' },
    { content: 'Action', width: 'w-48', classes: 'justify-center items-center px-4' },
];

// --- Mock Data (SESUAI GAMBAR) ---
const mockFilters = {
    search: "",
};

const mockSesi = {
    data: [
        { id: 1, tanggal: "Fri 01-01-2010 6:00", jumlah: "135 Mahasiswa" },
        { id: 2, tanggal: "Mon 03-01-2010 8:00", jumlah: "120 Mahasiswa" },
        { id: 3, tanggal: "Wed 05-01-2010 10:00", jumlah: "140 Mahasiswa" },
        { id: 4, tanggal: "Fri 07-01-2010 8:30", jumlah: "130 Mahasiswa" },
        { id: 5, tanggal: "Sun 09-01-2010 9:00", jumlah: "110 Mahasiswa" },
    ],
    from: 1, // Nomor awal untuk paginasi
    links: [
        // Data palsu untuk komponen OsPagination
        { url: null, label: "&laquo; Previous", active: false },
        { url: "#", label: "1", active: true },
        { url: "#", label: "2", active: false },
        { url: "#", label: "3", active: false },
        { url: null, label: "Next &raquo;", active: false },
    ]
};

// --- Komponen Utama ---
export default function RekapSesiPage() { 
    
    // Gunakan mock data sebagai default
    const { sesi = mockSesi, filters = mockFilters } = usePage().props;

    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = () => {
        // Logika pencarian Anda
        // router.get(...)
        console.log("Mencari:", search);
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                
                {/* BREADCRUMB: Disesuaikan kembali agar sesuai gambar 
                  (menggunakan title dan icon)
                */}
                <OsBreadCrumb 
                    className="fixed" 
                    title="OSCE \\ OSCE Radiologi 01-A"
                    icon={<ArrowLeft className="w-5 h-5" />}
                />

                <div className="flex-1 overflow-auto">

                    <h2 className="font-semibold text-lg mb-1">Menu Rekap Nilai</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                    </p>

                    {/* FILTER: Disesuaikan agar sesuai gambar
                      (HANYA search bar dan tombol)
                    */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">
                        <div className="relative w-full md:flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari data sesi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleSearch}
                                className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Cari
                            </button>
                        </div>
                    </div>

                    
                    {/* TABEL: Judul dan kolom disesuaikan */}
                    <h2 className="font-semibold text-lg mb-2 mt-os-8">Table Mahasiswa</h2>
                    <OsTableHeader columns={sesiColumns} />

                    {/* Data Rows (me-render dari mockSesi.data) */}
                    {sesi.data.map((item, index) => (
                        <div
                            key={item.id} 
                            className="flex items-center border-t border-gray-400"
                        >
                            <div className="w-16 px-4 py-3 text-center text-os-paragraft">
                                {sesi.from + index}
                            </div>

                            <div className="flex-1 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                {item.tanggal}
                            </div>

                            <div className="w-80 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                {item.jumlah}
                            </div>

                            {/* Kolom Tahun Akademik DIHAPUS */}

                            <div className="w-48 h-[70px] flex items-center justify-center">
                                <div className="border-l px-4 h-[50px] border-gray-400 flex w-full items-center justify-center">
                                    <button
                                        // Arahkan ke detail sesi (jika ada)
                                        onClick={() => router.visit('/admin/rekapmahasiswa')}
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

                    {/* Pagination */}
                    {sesi.links && sesi.links.length > 0 && (
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