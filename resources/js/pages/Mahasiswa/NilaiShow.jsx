import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Home, FileText, ChevronRight, ArrowLeft } from "lucide-react";

// --- [PERBAIKAN] Import Mengarah ke folder components ---
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
// Jika Copyright ada di components, pakai ini. Jika tidak, bisa dihapus.
import OsCopyright from "../../components/Copyright.jsx"; 

export default function NilaiShow({ mahasiswa, ujian, daftarNilai, totalNilai, statusKelulusan }) {
    
    // Komponen Kecil untuk Baris Info (Label & Value) di Card Oranye
    const InfoRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:items-start mb-2 last:mb-0">
            <span className="font-semibold w-40 shrink-0 text-white/90">{label}</span>
            <span className="font-medium text-white">: {value}</span>
        </div>
    );

    return (
        // Wrapper Utama (Layout disamakan dengan halaman Admin agar Sidebar pas)
        <div className="relative bg-gray-50 w-full min-h-screen flex justify-start font-sans overflow-hidden">
            
            {/* 1. SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT WRAPPER */}
            {/* class 'md:ml-20' memberi ruang agar konten tidak tertutup sidebar */}
            <main className="grid w-full h-screen grid-cols-1 grid-rows-[auto_1fr_auto] transition-all duration-300 md:ml-20 overflow-y-auto">
                
                {/* 2. HEADER ATAS (Navbar) */}
                <div className="p-8 pb-0">
                     <OsHeader />
                </div>

                {/* 3. KONTEN UTAMA */}
                <div className="p-8 pt-6">
                    <Head title="Hasil Penilaian OSCE" />

                    {/* --- Breadcrumb & Judul --- */}
                    <div className="mb-6">
                        <div className="bg-white border border-gray-300 rounded-lg p-2 px-4 flex items-center shadow-sm mb-6 w-fit">
                            <Link href="/dashboard" className="bg-blue-600 p-1.5 rounded text-white mr-3 hover:bg-blue-700 transition">
                                <Home size={18} />
                            </Link>
                            <span className="text-gray-500 text-sm font-medium">
                                Dashboard / Hasil Penilaian / Semester
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Icon Dokumen Biru */}
                            <FileText className="text-blue-600" size={32} />
                            <h1 className="text-2xl font-bold text-gray-900">Hasil Penilaian OSCE</h1>
                        </div>
                    </div>

                    {/* --- CARD HEADER ORANYE (Info Mahasiswa) --- */}
                    {/* Warna hex #F97316 mirip dengan desain oranye di gambar */}
                    <div className="bg-[#F97316] rounded-xl p-6 mb-8 shadow-md text-sm sm:text-base">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {/* Kolom Kiri */}
                            <div>
                                <InfoRow label="Nama" value={mahasiswa.nama} />
                                <InfoRow label="NIM" value={mahasiswa.nim} />
                                <InfoRow label="Program Studi" value={mahasiswa.prodi} />
                                <InfoRow label="Stase" value={ujian.stase} />
                            </div>
                            {/* Kolom Kanan */}
                            <div>
                                <InfoRow label="Semester" value={mahasiswa.semester} />
                                <InfoRow label="Tahun Ujian" value={ujian.tahun} />
                                <InfoRow label="Dosen Penguji" value={ujian.dosen} />
                            </div>
                        </div>
                    </div>

                    {/* --- TABEL NILAI (Custom Grid Styling) --- */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-black mb-4">
                        
                        {/* Header Tabel */}
                        <div className="grid grid-cols-[50px_1fr_150px_1fr] bg-white font-bold text-black border-b border-black text-sm">
                            <div className="p-4 border-r border-black/30 flex items-center justify-center">No</div>
                            <div className="p-4 border-r border-black/30 flex items-center">Stase / Keterampilan Klinik</div>
                            <div className="p-4 border-r border-black/30 flex items-center">Nilai</div>
                            <div className="p-4 flex items-center">Keterangan</div>
                        </div>

                        {/* Isi Tabel (Looping Data) */}
                        <div>
                            {daftarNilai.map((item, index) => (
                                <div
                                    key={index}
                                    // Logic Zebra Striping: Jika index genap (0,2,4..) warna putih, ganjil abu-abu?
                                    // Sesuai gambar: Baris 1 Putih, Baris 2 Abu-abu.
                                    // Index 0 (+1=1 ganjil) -> Putih. Index 1 (+1=2 genap) -> Abu-abu.
                                    className={`grid grid-cols-[50px_1fr_150px_1fr] text-sm border-b border-gray-300 last:border-0 ${
                                        (index + 1) % 2 === 0 ? "bg-[#F3F4F6]" : "bg-white"
                                    }`}
                                >
                                    {/* Kolom No */}
                                    <div className="p-4 py-5 flex items-center justify-center font-medium border-r border-gray-300">
                                        {index + 1}
                                    </div>
                                    {/* Kolom Kompetensi (Bold) */}
                                    <div className="p-4 py-5 flex items-center font-bold text-gray-800 border-r border-gray-300">
                                        {item.kompetensi}
                                    </div>
                                    {/* Kolom Nilai */}
                                    <div className="p-4 py-5 flex items-center text-gray-700 border-r border-gray-300">
                                        {item.nilai}
                                    </div>
                                    {/* Kolom Keterangan */}
                                    <div className="p-4 py-5 flex items-center text-gray-700">
                                        {item.keterangan}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- PAGINATION (Visual Sesuai Gambar) --- */}
                    <div className="flex items-center gap-2 mb-6 text-sm pl-2">
                        {/* Tombol Panah Kiri Hitam */}
                        <button className="p-1 rounded-full hover:bg-gray-200">
                            <div className="bg-black text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                                <ArrowLeft size={14} />
                            </div>
                        </button>
                        
                        <span className="font-bold px-2 text-black">1</span>
                        <span className="text-gray-400 px-2">2</span>
                        <span className="text-gray-400 px-2">3</span>
                        <span className="text-gray-400 px-2">4</span>
                        <span className="text-gray-400 px-2">5</span>

                        {/* Tombol Panah Kanan Hitam */}
                        <button className="p-1 rounded-full hover:bg-gray-200">
                             <div className="bg-black text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                                <ChevronRight size={14} />
                            </div>
                        </button>
                    </div>

                    {/* --- FOOTER TOTAL (Kotak Border Tebal) --- */}
                    <div className="border border-black rounded-lg bg-white grid grid-cols-[1fr_200px_1fr] items-center text-sm shadow-sm mb-6 h-14">
                        <div className="h-full flex items-center justify-center font-bold border-r border-black">
                            Total / Rata - rata
                        </div>
                        <div className="h-full flex items-center justify-center font-extrabold border-r border-black text-lg">
                            {totalNilai}
                        </div>
                        <div className="h-full flex items-center justify-center font-extrabold uppercase tracking-wide text-black">
                            {statusKelulusan}
                        </div>
                    </div>

                    {/* --- COPYRIGHT --- */}
                    <div className="mt-6 border border-black rounded-lg bg-white p-4 text-sm shadow-sm mb-8 font-bold text-gray-800">
                        © 2025 All rights reserved. | Polines
                    </div>
                </div>
                
            </main>
        </div>
    );
}