import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft, Download, Search, ExternalLink } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/copyright";

// --- Mock Data (Untuk Tampilan) ---
const mockInfoOSCE = {
  stasiun: "01",
  rubrik: "Stase CT Scan",
  waktu: "30 Menit",
  enrollment: "135 Mahasiswa",
  penguji: "Prof. dr. Rudi Hartono, Sp.B, Ph.D"
};

const mockStudents = [
  { id: 1, nama: "Putri Levina Agatha", nim: "4.33.252.6.37", nilai: "100" },
  { id: 2, nama: "Riko Aditya", nim: "4.33.24.12.47", nilai: "100" },
  { id: 3, nama: "Nadja Kencana", nim: "4.33.24.12.48", nilai: "98" },
  { id: 4, nama: "Ray Egan", nim: "4.33.24.12.49", nilai: "Belum Dinilai" },
];

export default function RekapMahasiswaPage() {
  // Gunakan props jika ada data real, atau fallback ke mock
  const { osceInfo = mockInfoOSCE, students = mockStudents } = usePage().props;
  
  const [search, setSearch] = useState("");

  // Filter sederhana untuk demo
  const filteredStudents = students.filter(mhs => 
    mhs.nama.toLowerCase().includes(search.toLowerCase()) || 
    mhs.nim.includes(search)
  );

  return (
    <div className="relative bg-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
      <Sidebar />

      <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
        
        {/* 1. Header */}
        <OsHeader
          className="fixed" 
          title="OSCE / OSCE Radiologi 01-A/ Rekap Nilai"
          icon={<ArrowLeft className="w-5 h-5" />}
        />

        <div className="flex-1 overflow-auto">
          
            {/* 2. Header Biru Besar (Detail OSCE) */}
            <div className="w-full rounded-xl overflow-hidden border border-black mb-6 shadow-sm">
                {/* Header Biru */}
                <div className="bg-[#3177C8] text-white text-center py-6">
                    <h1 className="text-2xl font-bold mb-1">Detail OSCE</h1>
                    <p className="text-sm opacity-90">OSCE Radiologi 01-A</p>
                </div>

                {/* Info Grid */}
                <div className="bg-white p-6">
                    <div className="flex flex-col lg:flex-row border border-gray-400 rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-gray-400">
                        
                        {/* Kolom 1: Stasiun */}
                        <div className="p-4 flex flex-col w-full lg:w-auto min-w-[120px]">
                            <span className="text-xs text-gray-600 mb-2">Stasiun</span>
                            <div className="bg-[#3177C8] text-white w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-md">
                                {osceInfo.stasiun}
                            </div>
                        </div>

                        {/* Kolom 2: Rubrik */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <span className="text-xs text-gray-600 block mb-1">Rubrik</span>
                                <span className="text-sm font-bold block">{osceInfo.rubrik}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 mt-4" />
                        </div>

                        {/* Kolom 3: Waktu */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <span className="text-xs text-gray-600 block mb-1">Waktu per rubrik</span>
                                <span className="text-sm font-bold block">{osceInfo.waktu}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 mt-4" />
                        </div>

                        {/* Kolom 4: Enrollment */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <span className="text-xs text-gray-600 block mb-1">Enrollment Mahasiswa</span>
                                <span className="text-sm font-bold block">{osceInfo.enrollment}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 mt-4" />
                        </div>

                        {/* Kolom 5: Penguji */}
                        <div className="p-4 flex-[1.5] flex flex-col justify-between">
                            <div>
                                <span className="text-xs text-gray-600 block mb-1">Penguji</span>
                                <span className="text-sm font-bold block">{osceInfo.penguji}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 mt-4" />
                        </div>

                    </div>
                </div>
            </div>

            {/* 3. Navigasi Download */}
            <div className="mb-6">
                <p className="text-sm font-medium mb-2">Navigasi</p>
                <button className="flex items-center bg-[#1447E6] text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-medium shadow-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Unduh Rekap Nilai
                </button>
            </div>

            {/* 4. Search Bar */}
            <div className="flex gap-4 mb-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-900" />
                    </div>
                    <input
                        type="text"
                        placeholder="cari nama mahasiswa"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-400 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button className="bg-[#1447E6] text-white px-12 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                    Cari
                </button>
            </div>

            {/* 5. Info Count */}
            <div className="mb-2">
                <span className="text-sm font-medium">
                    Mahasiswa <span className="text-gray-400 mx-1">|</span> menampilkan {filteredStudents.length} Mahasiswa
                </span>
            </div>

            {/* Divider Line */}
            <div className="h-px w-full bg-gray-300 mb-4"></div>

            {/* 6. Tabel Mahasiswa */}
            <div className="overflow-x-auto rounded-xl border border-black mb-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-black">
                            <th className="py-4 px-6 text-center font-medium text-sm border-r border-gray-400 w-16">No</th>
                            <th className="py-4 px-6 font-medium text-sm border-r border-gray-400 w-[30%]">Nama Mahasiswa</th>
                            <th className="py-4 px-6 font-medium text-sm text-center border-r border-gray-400 w-[25%]">NIM</th>
                            <th className="py-4 px-6 font-medium text-sm text-center border-r border-gray-400 w-[15%]">Nilai</th>
                            <th className="py-4 px-6 font-medium text-sm text-center w-[20%]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((mhs, index) => (
                            <tr 
                                key={mhs.id} 
                                className={`border-b border-gray-300 last:border-b-0 ${index % 2 === 1 ? 'bg-gray-300' : 'bg-white'}`}
                            >
                                <td className="py-6 px-6 text-center text-xl border-r border-gray-400">
                                    {index + 1}
                                </td>
                                <td className="py-6 px-6 font-bold text-gray-900 border-r border-gray-400">
                                    {mhs.nama}
                                </td>
                                <td className="py-6 px-6 text-center text-gray-700 border-r border-gray-400">
                                    {mhs.nim}
                                </td>
                                <td className="py-6 px-6 text-center text-gray-700 border-r border-gray-400">
                                    {mhs.nilai}
                                </td>
                                <td className="py-6 px-6 text-center">
                                    <Link 
                                        href={`#`} 
                                        className="inline-block bg-[#1447E6] text-white text-xs font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Lihat Penilaian
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500 italic">
                                    Data mahasiswa tidak ditemukan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
        <OsCopyright />
      </main>
    </div>
  );
}