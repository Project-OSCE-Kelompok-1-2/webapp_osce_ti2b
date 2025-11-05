import { Link, usePage, router } from "@inertiajs/react";
import React, { useState } from "react";
import { Search } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination"; 

// --- Definisi Kolom Tabel ---
const rekapColumns = [
    { content: 'No', width: 'w-16', classes: 'justify-center items-center' },
    { content: 'Nama Rubrik', width: 'flex-1', classes: 'justify-start items-center px-4' },
    { content: 'Rentang Tanggal', width: 'w-80', classes: 'justify-start items-center px-4' },
    { content: 'Tahun Akademik', width: 'w-48', classes: 'justify-center items-center px-4' },
    { content: 'Action', width: 'w-48', classes: 'justify-center items-center px-4' },
];

// ========================================================================
// ===== 1. TAMBAHKAN DATA PALSU (MOCK DATA) UNTUK TAMPILAN =====
// ========================================================================
const mockFilters = {
    search: "",
    year: "2025"
};

const mockOsce = {
    data: [
        { 
            id: 1, 
            nama_rubrik: "OSCE Radiologi 01-A (Mock)", 
            detail_rubrik: "135 Mahasiswa | 2 Sesi", 
            rentang_tanggal: "Fri 01-01-2010 6:00 - Fri 01-01-2010 6:00", 
            tahun_akademik: 2025 
        },
        { 
            id: 2, 
            nama_rubrik: "OSCE Bedah Minor 02-B (Mock)", 
            detail_rubrik: "120 Mahasiswa | 1 Sesi", 
            rentang_tanggal: "Sat 02-01-2010 8:00 - Sat 02-01-2010 9:00", 
            tahun_akademik: 2025 
        },
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
// ========================================================================
// ========================================================================


// Pastikan nama fungsi ini = 'RekapOscePage' jika nama file Anda 'RekapOscePage.jsx'
// atau sesuaikan 'export default' di bawah.
// Saya akan ganti nama fungsinya agar sesuai dengan nama file Anda.
export default function RekapOscePage() { 
    
    // ========================================================================
    // ===== 2. UBAH BARIS INI UNTUK MENGGUNAKAN MOCK DATA =====
    // ========================================================================
    // Kode Asli:
    // const { osce, filters } = usePage().props;
    
    // Kode Baru (dengan default value):
    const { osce = mockOsce, filters = mockFilters } = usePage().props;
    // ========================================================================
    // ========================================================================


    // 2. Siapkan state untuk filter
    // Kode ini sekarang aman karena 'filters' sudah ada nilainya
    const [search, setSearch] = useState(filters.search || "");
    const [year, setYear] = useState(filters.year || "2025"); 

    // 3. Fungsi untuk menjalankan pencarian
    const handleSearch = () => {
        // Fungsi ini tidak akan error, tapi hanya akan me-refresh halaman
        // karena data aslinya tidak difilter di backend.
        router.get(
            "/admin/rekapnilai", // URL route Anda
            { search, year },     
            { preserveState: true, replace: true }
        );
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">

                <OsBreadCrumb className="fixed" />

                <div className="flex-1 overflow-auto">

                    <h2 className="font-semibold text-lg mb-1">Menu Rekap Nilai</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                    </p>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="cari data OSCE..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3  w-full md:w-auto">
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className= "border border-gray-700 rounded-lg h-[46px] focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option>2025</option>
                                <option>2024</option>
                                <option>2023</option>
                            </select>
                            <button
                                onClick={handleSearch}
                                className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Cari
                            </button>
                        </div>
                    </div>


                    <h2 className="font-semibold text-lg mb-2 mt-os-8">Table OSCE</h2>
                    <OsTableHeader columns={rekapColumns} />

                    {/* Data Rows (Sekarang me-render dari mockOsce.data) */}
                    {osce.data.map((item, index) => (
                        <div
                            key={item.id} 
                            className="flex items-center border-t border-gray-400"
                        >
                            <div className="w-16 px-4 py-3 text-center text-os-paragraft">
                                {osce.from + index}
                            </div>

                            <div className="flex-1 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                <div className="font-medium text-gray-900">{item.nama_rubrik}</div>
                                <div className="text-sm text-gray-500">{item.detail_rubrik}</div>
                            </div>

                            <div className="w-80 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                {item.rentang_tanggal}
                            </div>

                            <div className="w-48 px-4 py-3 border-l border-gray-400 text-center text-os-paragraft">
                                {item.tahun_akademik}
                            </div>

                            <div className="w-48 h-[70px] flex items-center justify-center">
                                <div className="border-l px-4 h-[50px] border-gray-400 flex w-full items-center justify-center">
                                    <Link
                                        href={`/admin/rekap-nilai/${item.id}`} 
                                        className="bg-gray-800 h-[38px] w-full max-w-[100px] text-white text-os-small rounded-md text-center flex items-center justify-center hover:bg-gray-700"
                                    >
                                        Detail
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pesan jika tidak ada data */}
                    {osce.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data rekap nilai tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {/* Pagination (Sekarang me-render dari mockOsce.links) */}
                    {osce.links && osce.links.length > 0 && (
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

// Catatan: Jika nama fungsi Anda SEBELUMNYA adalah 'RekapNilai'
// dan Anda mendapat error 'reading 'default'',
// pastikan nama fungsi di atas (RekapOscePage) sama dengan nama file Anda,
// atau ubah 'export default' Anda.
// Saya sudah mengganti 'export default function RekapNilai()' menjadi 'export default function RekapOscePage()'
// agar cocok dengan pemanggilan route Anda 'Inertia::render('/Admin/RekapOscePage')'