import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { FileText, ArrowLeft, ChevronRight } from "lucide-react";

// --- IMPORT KOMPONEN CUSTOM ---
import SidebarUniversal from "../../components/SidebarUniversal.jsx"; 
import OsHeader from "../../components/Header.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsCopyright from "../../components/Copyright.jsx";

export default function NilaiShow() {
    // State untuk mengontrol Sidebar (Agar interaktif Buka/Tutup)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // --- DATA DUMMY ---
    const data = {
        mahasiswa: {
            nama: "MI. AULIA KURNIA WIDYARANI",
            nim: "4.33.24.1.13",
            prodi: "Kedokteran Gigi",
            semester: "1",
        },
        ujian: {
            stase: "OSCE Radiologi 01-A",
            tahun: "2025",
            dosen: "Prof. Dr. dr. Mahalul Azam, M.Kes",
        },
        daftarNilai: [
            { id: 1, kompetensi: "Manajemen Halusinasi", nilai: 93.75, keterangan: "Sangat Baik" },
            { id: 2, kompetensi: "Restrain", nilai: 82.50, keterangan: "Baik" },
            { id: 3, kompetensi: "Pemasangan Infus", nilai: 86.35, keterangan: "Baik" },
            { id: 4, kompetensi: "Guided Imagery", nilai: 85.75, keterangan: "Baik" },
        ],
        totalNilai: "87.00",
        statusKelulusan: "LULUS"
    };

    // --- CONFIG TABLE (Untuk Header & Body) ---
    const tableColumns = [
        { key: "id", content: "No", width: "w-[80px]", classes: "justify-center font-bold" },
        { key: "kompetensi", content: "Stase / Keterampilan Klinik", width: "flex-1", classes: "justify-start px-6 font-bold text-left" },
        { key: "nilai", content: "Nilai", width: "w-[150px]", classes: "justify-center" },
        { key: "keterangan", content: "Keterangan", width: "w-[200px]", classes: "justify-start px-6" },
    ];

    // Komponen Baris Info (Card Oranye)
    const InfoRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:items-start mb-1">
            <span className="font-semibold w-40 shrink-0 text-white/90 text-sm">{label}</span>
            <span className="font-medium text-white text-sm">: {value}</span>
        </div>
    );

    return (
        // WRAPPER UTAMA (Flex Row)
        <div className="min-h-screen bg-gray-100 font-sans text-slate-800 flex">
            
            {/* 1. SIDEBAR UNIVERSAL */}
            {/* Mengirim props isOpen dan setIsOpen agar tombol di sidebar berfungsi */}
            <SidebarUniversal isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* 2. MAIN CONTENT WRAPPER */}
            {/* Margin kiri (ml) berubah dinamis sesuai status sidebar */}
            <div 
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
                ${isSidebarOpen ? "ml-72" : "ml-20"}`}
            >
                
                {/* A. HEADER (Sticky Top) */}
                <div className="bg-white border-b border-black px-8 py-4 sticky top-0 z-40 shadow-sm w-full">
                     <OsHeader />
                </div>

                {/* B. KONTEN UTAMA */}
                <main className="w-full px-8 mt-8 flex flex-col gap-6 flex-1 pb-10">
                    <Head title="Hasil Penilaian OSCE" />

                    {/* 1. JUDUL HALAMAN (BOX PUTIH LURUS) */}
                    <div className="w-full bg-white p-4 rounded-xl border border-black shadow-sm flex items-center h-[70px]">
                        <div className="flex items-center gap-3 ml-2">
                            <FileText className="text-blue-600" size={32} />
                            <h1 className="font-sans font-bold text-2xl text-black mt-1">
                                Hasil Penilaian OSCE
                            </h1>
                        </div>
                    </div>

                    {/* 2. CARD INFO ORANYE */}
                    <div className="w-full bg-[#FA5E1B] rounded-xl border border-black p-6 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-4">
                            <div>
                                <InfoRow label="Nama" value={data.mahasiswa.nama} />
                                <InfoRow label="NIM" value={data.mahasiswa.nim} />
                                <InfoRow label="Program Studi" value={data.mahasiswa.prodi} />
                                <InfoRow label="Stase" value={data.ujian.stase} />
                            </div>
                            <div>
                                <InfoRow label="Semester" value={data.mahasiswa.semester} />
                                <InfoRow label="Tahun Ujian" value={data.ujian.tahun} />
                                <InfoRow label="Dosen Penguji" value={data.ujian.dosen} />
                            </div>
                        </div>
                    </div>

                    {/* 3. TABEL NILAI */}
                    <div className="w-full bg-white rounded-xl shadow-sm border border-black overflow-hidden flex flex-col">
                        <div className="bg-white">
                            <OsTableHeader columns={tableColumns} />
                        </div>
                        <div className="w-full">
                            <OsTableBody 
                                data={data.daftarNilai} 
                                columns={tableColumns} 
                            />
                        </div>
                    </div>

                    {/* 4. FOOTER AREA */}
                    <div className="w-full flex flex-col gap-4">
                        
                        {/* Pagination */}
                        <div className="flex items-center gap-3 text-sm ml-1">
                            <button className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition">
                                <ArrowLeft size={16} />
                            </button>
                            <span className="font-bold text-black px-1">1</span>
                            <span className="text-gray-400 px-1">2</span>
                            <span className="text-gray-400 px-1">3</span>
                            <span className="text-gray-400 px-1">4</span>
                            <span className="text-gray-400 px-1">5</span>
                            <button className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition">
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Total Score Box */}
                        <div className="w-full flex bg-white rounded-xl border border-black h-[60px] overflow-hidden items-center shadow-sm">
                            <div className="flex-1 h-full flex items-center justify-center font-bold text-black border-r border-black">
                                Total / Rata - rata
                            </div>
                            <div className="w-[150px] h-full flex items-center justify-center font-extrabold text-xl text-black border-r border-black">
                                {data.totalNilai}
                            </div>
                            <div className="w-[200px] h-full flex items-center justify-center font-extrabold text-black text-lg uppercase tracking-wide bg-gray-50">
                                {data.statusKelulusan}
                            </div>
                        </div>
                    </div>

                    {/* 5. COPYRIGHT */}
                    <div className="w-full mt-2">
                        <OsCopyright />
                    </div>

                </main>
            </div>
        </div>
    );
}