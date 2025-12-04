import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Home, FileText, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import Sidebar from "../../components/Sidebar"; // Sesuaikan path jika berbeda
import OsHeader from "../../components/Header"; // Sesuaikan path jika berbeda
import OsCopyright from "../../components/Copyright"; // Sesuaikan path jika berbeda

export default function NilaiShow({ mahasiswa, ujian, daftarNilai, totalNilai, statusKelulusan }) {
    
    // --- KOMPONEN KECIL UNTUK LABEL DATA (Di dalam Card Oranye) ---
    const InfoRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:items-start mb-2 sm:mb-1 last:mb-0">
            <span className="font-semibold w-40 shrink-0 text-white/90">{label}</span>
            <span className="font-medium text-white">: {value}</span>
        </div>
    );

    return (
        <div className="bg-[#F5F7FA] w-full min-h-screen flex font-sans text-slate-800">
            {/* 1. SIDEBAR (Menggunakan komponen yang sudah ada) */}
            <Sidebar />

            <main className="flex-1 flex flex-col transition-all duration-300 md:ml-20">
                
                {/* 2. HEADER ATAS (Breadcrumb & User) */}
                <div className="p-6 pb-2">
                    <div className="bg-white border border-gray-300 rounded-lg p-3 px-4 flex items-center shadow-sm mb-6">
                         <Link href="/dashboard" className="bg-blue-600 p-1.5 rounded text-white mr-3 hover:bg-blue-700">
                            <Home size={18} />
                        </Link>
                        <span className="text-gray-500 text-sm">
                            Dashboard / Hasil Penilaian / Semester
                        </span>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="text-blue-600" size={32} />
                        <h1 className="text-2xl font-bold text-gray-900">Hasil Penilaian OSCE</h1>
                    </div>
                </div>

                <div className="px-6 flex-1 overflow-auto pb-10">
                    
                    {/* 3. CARD HEADER ORANYE (Info Mahasiswa & Dosen) */}
                    <div className="bg-[#F97316] rounded-xl p-6 mb-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {/* Kolom Kiri */}
                            <div className="space-y-2">
                                <InfoRow label="Nama" value={mahasiswa.nama} />
                                <InfoRow label="NIM" value={mahasiswa.nim} />
                                <InfoRow label="Program Studi" value={mahasiswa.prodi} />
                                <InfoRow label="Stase" value={ujian.stase} />
                            </div>

                            {/* Kolom Kanan */}
                            <div className="space-y-2">
                                <InfoRow label="Semester" value={mahasiswa.semester} />
                                <InfoRow label="Tahun Ujian" value={ujian.tahun} />
                                <InfoRow label="Dosen Penguji" value={ujian.dosen} />
                            </div>
                        </div>
                    </div>

                    {/* 4. TABEL NILAI (Custom Grid Styling agar mirip gambar) */}
                    <div className="w-full text-sm">
                        
                        {/* Table Header */}
                        <div className="grid grid-cols-[50px_1fr_150px_1fr] border border-black rounded-t-lg bg-white overflow-hidden font-bold text-black">
                            <div className="p-3 py-4 flex items-center justify-center border-r border-black/20">No</div>
                            <div className="p-3 py-4 flex items-center border-r border-black/20">Stase / Keterampilan Klinik</div>
                            <div className="p-3 py-4 flex items-center border-r border-black/20">Nilai</div>
                            <div className="p-3 py-4 flex items-center">Keterangan</div>
                        </div>

                        {/* Table Body (Looping Data) */}
                        <div className="border-x border-b border-black rounded-b-lg overflow-hidden bg-white">
                            {daftarNilai.map((item, index) => (
                                <div 
                                    key={index} 
                                    // ZEBRA STRIPING: Ganjil Putih, Genap Abu-abu (sesuai gambar)
                                    className={`grid grid-cols-[50px_1fr_150px_1fr] border-t border-gray-300 ${
                                        (index + 1) % 2 === 0 ? 'bg-[#F3F4F6]' : 'bg-white'
                                    }`}
                                >
                                    {/* No */}
                                    <div className="p-4 py-6 flex items-center justify-center font-medium border-r border-gray-300">
                                        {index + 1}
                                    </div>

                                    {/* Nama Kompetensi */}
                                    <div className="p-4 py-6 flex items-center font-bold text-gray-800 border-r border-gray-300">
                                        {item.kompetensi}
                                    </div>

                                    {/* Nilai (Angka) */}
                                    <div className="p-4 py-6 flex items-center text-gray-700 border-r border-gray-300">
                                        {item.nilai}
                                    </div>

                                    {/* Keterangan (Text) */}
                                    <div className="p-4 py-6 flex items-center text-gray-700">
                                        {item.keterangan}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination (Visual Saja sesuai gambar) */}
                        <div className="flex items-center gap-2 mt-4 mb-4">
                            <button className="p-1 rounded-full hover:bg-gray-200"><ArrowLeft size={16} className="bg-black text-white rounded-full p-0.5"/></button>
                            <span className="font-bold px-2">1</span>
                            <span className="text-gray-400 px-2">2</span>
                            <span className="text-gray-400 px-2">3</span>
                            <span className="text-gray-400 px-2">4</span>
                            <span className="text-gray-400 px-2">5</span>
                            <button className="p-1 rounded-full hover:bg-gray-200"><ChevronRight size={16} className="bg-black text-white rounded-full p-0.5" /></button>
                        </div>

                        {/* 5. FOOTER TOTAL NILAI (Bold Box) */}
                        <div className="mt-4 border border-black rounded-lg bg-white grid grid-cols-[1fr_200px_1fr] items-center">
                            <div className="p-4 py-4 font-bold text-center border-r border-black">
                                Total / Rata - rata
                            </div>
                            <div className="p-4 py-4 font-bold text-center border-r border-black">
                                {totalNilai}
                            </div>
                            <div className="p-4 py-4 font-extrabold text-center uppercase tracking-wide">
                                {statusKelulusan}
                            </div>
                        </div>

                        {/* Copyright Footer */}
                        <div className="mt-6 border border-black rounded-lg bg-white p-4">
                            <p className="text-sm font-bold">© 2025 All rights reserved. | Polines</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}