import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Search, ArrowLeft } from "lucide-react"; 

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb"; 
import OsCopyright from "../../components/copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";

// --- Definisi Kolom Tabel (SESUAI GAMBAR BARU) ---
const mahasiswaColumns = [
    { content: 'No', width: 'w-16', classes: 'justify-center items-center' },
    { content: 'Nim Mahasiswa', width: 'w-80', classes: 'justify-start items-center px-4' },
    { content: 'Nama Mahasiswa', width: 'flex-1', classes: 'justify-start items-center px-4' },
    { content: 'Action', width: 'w-48', classes: 'justify-center items-center px-4' },
];

// --- Mock Data (SESUAI GAMBAR BARU) ---
const mockFilters = {
    search: "",
    year: "2025" // Tahun default dari dropdown
};

const mockMahasiswa = {
    data: [
        { id: 1, nim: "4.33.24.1.2301827492", nama: "Riko Aditya Zaki Sir Raja" },
        { id: 2, nim: "4.33.24.1.2301827492", nama: "Ray Egan Primodium Insya Allah tahun depan" },
        { id: 3, nim: "4.33.24.1.2301827492", nama: "Bang Ucup AKA Ifad Dahlih Zangetsu" },
    ],
    from: 1, // Nomor awal untuk paginasi (sesuai gambar)
    links: [
        { url: null, label: "&laquo; Previous", active: false },
        { url: "#", label: "1", active: true },
        { url: "#", label: "2", active: false },
        { url: "#", label: "3", active: false },
        { url: null, label: "Next &raquo;", active: false },
    ]
};

// --- Komponen Utama ---
// Anda mungkin ingin mengganti nama file dan fungsi ini menjadi 'NilaiMahasiswaPage'
export default function RekapMahasiwaPage() { 
    
    // Gunakan mock data baru sebagai default
    const { mahasiswa = mockMahasiswa, filters = mockFilters } = usePage().props;

    const [search, setSearch] = useState(filters.search || "");
    const [year, setYear] = useState(filters.year || "2025"); // Tambahkan state untuk tahun

    const handleSearch = () => {
        // Logika pencarian Anda
        console.log("Mencari:", { search, year });
        // router.get(...)
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                
                {/* BREADCRUMB: Disesuaikan dengan gambar baru */}
                <OsBreadCrumb 
                    className="fixed" 
                    title="Rekap Nilai \\ OSCE Radiologi 01-A \\ Nilai Mahasiswa"
                    icon={<ArrowLeft className="w-5 h-5" />}
                />

                <div className="flex-1 overflow-auto">

                    {/* JUDUL: Disesuaikan dengan gambar baru */}
                    <h2 className="font-semibold text-lg mb-1">Menu Nilai Mahasiswa</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman ini berisi setiap nilai rubrik mahasiswa yang telah mengikuti OSCE
                    </p>

                    {/* FILTER: Disesuaikan dengan gambar baru (Search + Tahun) */}
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-5">
                        <div className="relative w-full md:flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari data mahasiswa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* TAMBAHAN: Dropdown Tahun */}
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className= "border border-gray-700 rounded-lg h-[46px] flex-1 w-auto md:flex-none md:w-40 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option>2025</option>
                                <option>2024</option>
                                <option>2023</option>
                            </select>
                            <button
                                onClick={handleSearch}
                                className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 w-auto justify-center"
                            >
                                Cari
                            </button>
                        </div>
                    </div>

                    
                    {/* TABEL: Judul dan kolom disesuaikan */}
                    <h2 className="font-semibold text-lg mb-2 mt-os-8">Table Mahasiswa</h2>
                    <OsTableHeader columns={mahasiswaColumns} />

                    {/* Data Rows (me-render dari mockMahasiswa.data) */}
                    {mahasiswa.data.map((item, index) => (
                        <div
                            key={item.id} 
                            // Baris abu-abu genap (sesuai gambar)
                            className={`flex items-center border-t border-gray-400 ${index % 2 === 1 ? 'bg-gray-100' : ''}`}
                        >
                            <div className="w-16 px-4 py-3 text-center text-os-paragraft">
                                {mahasiswa.from + index}
                            </div>

                            <div className="w-80 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                {item.nim}
                            </div>

                            <div className="flex-1 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                {item.nama}
                            </div>

                            <div className="w-48 h-[70px] flex items-center justify-center">
                                <div className="border-l px-4 h-[50px] border-gray-400 flex w-full items-center justify-center">
                                    <button
                                        onClick={() => router.visit('/admin/rekapmahasiswa/mahasiswa')} // Ganti URL sesuai kebutuhan
                                        // Ganti style tombol menjadi BIRU
                                        className="bg-blue-600 h-[38px] w-full max-w-[100px] text-white text-os-small rounded-md text-center flex items-center justify-center hover:bg-blue-700"
                                    >
                                        Lihat Nilai
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pesan jika tidak ada data */}
                    {mahasiswa.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data mahasiswa tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {mahasiswa.links && mahasiswa.links.length > 0 && (
                        <div className="mt-8">
                            <OsPagination links={mahasiswa.links} />
                        </div>
                    )}
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}