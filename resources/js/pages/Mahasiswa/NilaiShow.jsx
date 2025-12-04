import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Home, FileText, ChevronRight, ArrowLeft } from "lucide-react";

export default function NilaiShow() {
    // === DATA DUMMY (HARDCODED UNTUK TEST TAMPILAN) ===
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
        nilai: [
            { kompetensi: "Manajemen Halusinasi", nilai: 93.75, keterangan: "Sangat Baik" },
            { kompetensi: "Restrain", nilai: 82.50, keterangan: "Baik" },
            { kompetensi: "Pemasangan Infus", nilai: 86.35, keterangan: "Baik" },
            { kompetensi: "Guided Imagery", nilai: 85.75, keterangan: "Baik" },
        ],
        total: "87.00",
        status: "LULUS",
    };

    // Komponen kecil untuk baris info
    const InfoRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:items-start mb-2 last:mb-0">
            <span className="font-semibold w-40 shrink-0 text-white/90">{label}</span>
            <span className="font-medium text-white">: {value}</span>
        </div>
    );

    return (
        <div className="bg-[#F5F7FA] min-h-screen font-sans text-slate-800 p-6">
            <Head title="Hasil Penilaian OSCE" />

            <div className="max-w-6xl mx-auto">
                {/* 1. HEADER BREADCRUMB */}
                <div className="bg-white border border-gray-300 rounded-lg p-3 px-4 flex items-center shadow-sm mb-6">
                    <div className="bg-blue-600 p-1.5 rounded text-white mr-3">
                        <Home size={18} />
                    </div>
                    <span className="text-gray-500 text-sm font-medium">
                        Dashboard / Hasil Penilaian / Semester
                    </span>
                </div>

                {/* 2. JUDUL HALAMAN */}
                <div className="flex items-center gap-3 mb-6">
                    <FileText className="text-blue-600" size={32} />
                    <h1 className="text-2xl font-bold text-gray-900">Hasil Penilaian OSCE</h1>
                </div>

                {/* 3. CARD ORANYE (INFO MAHASISWA) */}
                <div className="bg-[#F97316] rounded-xl p-6 mb-8 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Kiri */}
                        <div>
                            <InfoRow label="Nama" value={data.mahasiswa.nama} />
                            <InfoRow label="NIM" value={data.mahasiswa.nim} />
                            <InfoRow label="Program Studi" value={data.mahasiswa.prodi} />
                            <InfoRow label="Stase" value={data.ujian.stase} />
                        </div>
                        {/* Kanan */}
                        <div>
                            <InfoRow label="Semester" value={data.mahasiswa.semester} />
                            <InfoRow label="Tahun Ujian" value={data.ujian.tahun} />
                            <InfoRow label="Dosen Penguji" value={data.ujian.dosen} />
                        </div>
                    </div>
                </div>

                {/* 4. TABEL NILAI */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-black">
                    {/* Header Tabel */}
                    <div className="grid grid-cols-[50px_1fr_150px_1fr] bg-white font-bold text-black border-b border-black text-sm">
                        <div className="p-4 border-r border-black/20 flex items-center justify-center">No</div>
                        <div className="p-4 border-r border-black/20 flex items-center">Stase / Keterampilan Klinik</div>
                        <div className="p-4 border-r border-black/20 flex items-center">Nilai</div>
                        <div className="p-4 flex items-center">Keterangan</div>
                    </div>

                    {/* Isi Tabel (Looping) */}
                    <div>
                        {data.nilai.map((item, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-[50px_1fr_150px_1fr] text-sm border-b border-gray-300 last:border-0 ${
                                    (index + 1) % 2 === 0 ? "bg-[#F3F4F6]" : "bg-white"
                                }`}
                            >
                                <div className="p-4 py-5 flex items-center justify-center font-medium border-r border-gray-300">
                                    {index + 1}
                                </div>
                                <div className="p-4 py-5 flex items-center font-bold text-gray-800 border-r border-gray-300">
                                    {item.kompetensi}
                                </div>
                                <div className="p-4 py-5 flex items-center text-gray-700 border-r border-gray-300">
                                    {item.nilai}
                                </div>
                                <div className="p-4 py-5 flex items-center text-gray-700">
                                    {item.keterangan}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. PAGINATION VISUAL */}
                <div className="flex items-center gap-2 mt-4 mb-4 text-sm">
                    <button className="p-1 rounded-full hover:bg-gray-200">
                        <ArrowLeft size={16} className="bg-black text-white rounded-full p-0.5" />
                    </button>
                    <span className="font-bold px-2">1</span>
                    <span className="text-gray-400 px-2">2</span>
                    <span className="text-gray-400 px-2">3</span>
                    <span className="text-gray-400 px-2">4</span>
                    <span className="text-gray-400 px-2">5</span>
                    <button className="p-1 rounded-full hover:bg-gray-200">
                        <ChevronRight size={16} className="bg-black text-white rounded-full p-0.5" />
                    </button>
                </div>

                {/* 6. FOOTER TOTAL & STATUS */}
                <div className="border border-black rounded-lg bg-white grid grid-cols-[1fr_200px_1fr] items-center text-sm shadow-sm">
                    <div className="p-4 font-bold text-center border-r border-black">
                        Total / Rata - rata
                    </div>
                    <div className="p-4 font-bold text-center border-r border-black text-lg">
                        {data.total}
                    </div>
                    <div className="p-4 font-extrabold text-center uppercase tracking-wide text-green-700">
                        {data.status}
                    </div>
                </div>

                {/* 7. COPYRIGHT */}
                <div className="mt-6 border border-black rounded-lg bg-white p-4 text-sm shadow-sm">
                    <p className="font-bold">© 2025 All rights reserved. | Polines</p>
                </div>
            </div>
        </div>
    );
}