import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Search, ArrowLeft, ArrowUpRight } from "lucide-react"; // Tambahkan ArrowUpRight

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";

// --- Definisi Kolom Tabel (SESUAI GAMBAR BARU) ---
const rubrikColumns = [
    { content: 'No', width: 'w-16', classes: 'justify-center items-center' },
    { content: 'Nama Rubrik', width: 'flex-1', classes: 'justify-start items-center px-4' },
    { content: 'Nama Penguji', width: 'w-80', classes: 'justify-start items-center px-4' },
    { content: 'Action', width: 'w-48', classes: 'justify-center items-center px-4' },
];

// --- Mock Data (SESUAI GAMBAR BARU) ---
const mockFilters = {
    search: "",
};

const mockAccount = {
    nama: "Riko Aditya Zaki Sir Raja",
    nim: "12345689012345",
    jurusan: "Teknologi per-ilmuan hitam"
};

const mockRubrik = {
    data: [
        { 
            id: 1, 
            nama_rubrik: "Packet Rubrik 1", 
            nama_penguji: "Dr. Pandu Setya Nugraha, I.H., M.M., (Ilmu Hitam & Mayor Magelang)" 
        },
        // Anda bisa tambahkan data lain di sini
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
// Ganti nama fungsi ini jika ini adalah file baru (misal: DetailNilaiMahasiswaPage)
export default function RekapDetailMahasiswaPage() { 
    
    // Gunakan mock data baru sebagai default
    const { 
        mahasiswa = mockAccount, 
        rubrik = mockRubrik, 
        filters = mockFilters 
    } = usePage().props;

    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = () => {
        // Logika pencarian Anda
        console.log("Mencari:", search);
        // router.get(...)
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                
                {/* BREADCRUMB: Disesuaikan dengan gambar baru */}
                <OsBreadCrumb 
                    className="fixed" 
                    title="Rekap Nilai / Nilai Enrollment Mahasiswa / Riko Aditya Zaki Sir Raja"
                    icon={<ArrowLeft className="w-5 h-5" />}
                />

                <div className="flex-1 overflow-auto">

                    {/* --- BAGIAN ACCOUNT (BARU) --- */}
                    {/* (Gambar Anda memiliki card, jadi saya tambahkan style card) */}
                    <div className="bg-white p-6 rounded-2xl shadow mb-6">
                        <h2 className="font-semibold text-lg mb-4">Account</h2>
                        <div className="flex items-center">
                            {/* Avatar Placeholder */}
                            <div className="w-20 h-20 rounded-full mr-6 bg-gray-700 flex-shrink-0"></div> 
                            <div>
                                <p className="text-sm text-gray-800"><span className="font-semibold">Nama :</span> {mahasiswa.nama}</p>
                                <p className="text-sm text-gray-800"><span className="font-semibold">NIM :</span> {mahasiswa.nim}</p>
                                <p className="text-sm text-gray-800"><span className="font-semibold">Jurusan :</span> {mahasiswa.jurusan}</p>
                            </div>
                        </div>
                    </div>


                    {/* --- BAGIAN FILTER (DIMODIFIKASI) --- */}
                    {/* (Saya bungkus dalam card agar konsisten dengan gambar) */}
                    <div className="bg-white p-6 rounded-2xl shadow mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari data rubrik..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                {/* Dropdown Tahun DIHAPUS */}
                                <button
                                    onClick={handleSearch}
                                    className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700"
                                >
                                    Cari
                                </button>
                            </div>
                        </div>
                    </div>
                    

                    {/* --- BAGIAN TABEL (DIMODIFIKASI) --- */}
                    {/* (Saya bungkus dalam card agar konsisten dengan gambar) */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="font-semibold text-lg mb-4">Table Rubrik</h2>
                        <OsTableHeader columns={rubrikColumns} />

                        {/* Data Rows (me-render dari mockRubrik.data) */}
                        {rubrik.data.map((item, index) => (
                            <div
                                key={item.id} 
                                // Hapus alternating row color
                                className="flex items-center border-t border-gray-400"
                            >
                                <div className="w-16 px-4 py-3 text-center text-os-paragraft">
                                    {rubrik.from + index}
                                </div>

                                <div className="flex-1 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                    <div className="flex items-center justify-between">
                                        <span>{item.nama_rubrik}</span>
                                        <ArrowUpRight className="w-4 h-4 text-gray-500" />
                                    </div>
                                </div>

                                <div className="w-80 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                    <div className="flex items-center justify-between">
                                        <span>{item.nama_penguji}</span>
                                        <ArrowUpRight className="w-4 h-4 text-gray-500" />
                                    </div>
                                </div>

                                <div className="w-48 h-[70px] flex items-center justify-center">
                                    <div className="border-l px-4 h-[50px] border-gray-400 flex w-full items-center justify-center">
                                        <Link
                                            href={`/admin/rekap-nilai/rubrik/${item.id}`} // Ganti URL
                                            className="bg-blue-600 h-[38px] w-full max-w-[100px] text-white text-os-small rounded-md text-center flex items-center justify-center hover:bg-blue-700"
                                        >
                                            Lihat Nilai
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pesan jika tidak ada data */}
                        {rubrik.data.length === 0 && (
                            <div className="flex items-center border-t border-gray-400">
                                <p className="w-full text-center text-sm py-4 text-gray-500">
                                    Data rubrik tidak ditemukan.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {rubrik.links && rubrik.links.length > 0 && (
                            <div className="mt-8">
                                <OsPagination links={rubrik.links} />
                            </div>
                        )}
                    </div>
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}