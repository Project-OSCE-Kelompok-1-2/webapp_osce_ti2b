import React, { useState, useEffect } from "react";
// Impor ikon-ikon yang kita butuhkan
import { Home, ChevronLeft, Search, Plus, BarChart2, Trash2 } from "lucide-react";
// Impor Link dari Inertia
import { Link } from '@inertiajs/react';

// Data palsu untuk mengisi tabel
const mockSesiData = [
    {
        id: 1,
        tanggal: "Fri 01-01-2010 6:00",
        jumlah: 135,
    },
    // Kamu bisa tambahkan data sesi lain di sini
];

export default function JadwalSesi() {
    // State untuk data (diisi dengan data palsu)
    const [sesiList, setSesiList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Efek untuk memuat data palsu
    useEffect(() => {
        setIsLoading(true);
        // Simulasi loading data
        setTimeout(() => {
            setSesiList(mockSesiData);
            setIsLoading(false);
        }, 500);
    }, []);

    return (
        // Konten utama, flex-1 agar mengisi sisa ruang, bg-white
        <div className="flex-1 flex flex-col h-screen bg-white overflow-hidden">
            
            {/* ===== 1. Header (Breadcrumb) ===== */}
            <header className="flex items-center gap-3 text-sm text-gray-700 p-4 border-b border-gray-300">
                <Link 
                    href="/admin/rekapnilai" // Ganti dengan URL kembali-mu
                    className="bg-blue-600 text-white p-2 rounded-full flex items-center justify-center hover:bg-blue-700"
                >
                    <ChevronLeft size={20} />
                </Link>
                {/* Kotak input "Rekap Nilai" */}
                <div className="flex-1 border border-gray-400 rounded-lg px-4 py-2 text-sm font-medium bg-white">
                    OSCE \ OSCE Radiologi 01-A \ Jadwal Sesi
                </div>
            </header>

            {/* ===== 2. Konten Halaman (Bisa di-scroll) ===== */}
            <main className="flex-1 p-8 overflow-y-auto">
                
                {/* Navigasi Internal */}
                <div className="mb-4">
                    <h3 className="text-gray-600 font-semibold mb-2">Navigasi</h3>
                    <div className="flex gap-2">
                        <Link href="#" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
                            Halaman Stase
                        </Link>
                        <Link href="#" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
                            Jadwal Sesi
                        </Link>
                    </div>
                </div>

                {/* Judul & Deskripsi */}
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Menu Sesi OSCE</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                    </p>
                </div>

                {/* Tombol Tambah Sesi */}
                <div className="mb-4">
                    <button
                        // onClick={...} // Ganti dengan fungsi tambah sesi
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow font-medium"
                    >
                        <Plus size={20} className="mr-1" /> Masukkan Sesi
                    </button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center w-full gap-3 mb-4">
                    {/* Input Search dengan Ikon */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="cari data sesi..."
                            className="w-full border-2 border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                        />
                    </div>
                    {/* Tombol Cari */}
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg shadow font-medium">
                        Cari
                    </button>
                </div>

                {/* Judul Tabel */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Table Mahasiswa</h2>
                
                {/* Kontainer Tabel */}
                <div className="bg-white shadow rounded-lg overflow-x-auto border border-gray-300">
                    <table className="w-full min-w-max">
                        
                        {/* Header Tabel */}
                        <thead>
                            <tr className="text-gray-700 text-sm font-medium border-b-2 border-gray-300">
                                <th className="py-3 px-3 text-center w-[5%]">No</th>
                                <th className="py-3 px-4 text-left w-[45%] border-l border-gray-300">Tanggal / Sesi</th>
                                <th className="py-3 px-3 text-left w-[20%] border-l border-gray-300">Jumlah Mahasiswa</th>
                                <th className="py-3 px-3 text-center w-[30%] border-l border-gray-300">Action</th>
                            </tr>
                        </thead>
                        
                        {/* Body Tabel */}
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : (
                                sesiList.map((item, index) => (
                                    <tr key={item.id} className="text-gray-800 text-sm"> 
                                        <td className="py-4 px-3 text-center"> 
                                            {index + 1}
                                        </td>
                                        <td className="py-4 px-4 border-l border-gray-300">
                                            {item.tanggal}
                                        </td>
                                        <td className="py-4 px-3 border-l border-gray-300">
                                            {item.jumlah} Mahasiswa
                                        </td>
                                        <td className="py-4 px-3 text-center border-l border-gray-300">
                                            <div className="flex justify-center gap-2">
                                                <button className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700">
                                                    Edit enrollment
                                                </button>
                                                <button 
                                                    className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700" 
                                                    title="Lihat Detail"
                                                >
                                                    <BarChart2 size={16} />
                                                </button>
                                                <button 
                                                    className="p-2 bg-white text-black border border-black rounded-lg hover:bg-gray-100" 
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination (di dalam kontainer tabel) */}
                    <div className="flex justify-start items-center gap-4 text-sm p-4 border-t border-gray-200">
                        <button className="w-8 h-8 rounded-full bg-gray-800 text-white font-semibold flex items-center justify-center hover:bg-gray-700">◄</button>
                        <span className="text-gray-900 font-bold px-1">1</span>
                        <span className="text-gray-600 px-1">2</span>
                        <span className="text-gray-600 px-1">3</span>
                        <span className="text-gray-600 px-1">4</span>
                        <span className="text-gray-600 px-1">5</span>
                        <button className="w-8 h-8 rounded-full bg-gray-800 text-white font-semibold flex items-center justify-center hover:bg-gray-700">►</button>
                    </div>
                </div>
            </main>

            {/* ===== 3. Footer (Copyright) ===== */}
            <footer className="text-center text-gray-400 text-sm p-4 mt-auto">
                 <div className="border-t border-gray-300 py-4">
                    Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit amet
                 </div>
            </footer>
        </div>
    );
};