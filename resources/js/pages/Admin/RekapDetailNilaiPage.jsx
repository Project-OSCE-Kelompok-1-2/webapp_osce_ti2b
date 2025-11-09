import React from "react";
import { usePage } from "@inertiajs/react";
import { ArrowLeft, Download } from "lucide-react"; // Tambahkan Download

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";
import OsTableHeader from "../../components/tableheader"; // Di-import kembali

// --- Mock Data (SESUAI GAMBAR BARU) ---
const mockAccount = {
    nama: "Riko Aditya Zaki Sir Raja",
    nim: "12345689012345",
    jurusan: "Teknologi per-ilmuan hitam"
};

// --- Definisi Kolom Tabel (BARU) ---
const nilaiColumns = [
    { content: 'No', width: 'w-16', classes: 'justify-center items-center' },
    { content: 'Nama OSCE', width: 'flex-1', classes: 'justify-start items-center px-4' },
    { content: 'Nama Stase', width: 'flex-1', classes: 'justify-start items-center px-4' },
    { content: 'Nilai', width: 'w-24', classes: 'justify-center items-center' },
];

// --- Mock Data Tabel (BARU) ---
const mockNilai = [
    { id: 1, osce: 'Kesehatan Jantung', stase: 'Keterampilan Membedah Jantung', nilai: '96' },
    { id: 2, osce: 'Kerusakan Otak dan Pola Pikir', stase: 'Keterampilan Menjahit', nilai: '69' },
    { id: 3, osce: 'Kerusakan Otak dan Pola Pikir', stase: 'Keterampilan Membedah', nilai: '96' },
    { id: 4, osce: 'Kerusakan Otak dan Pola Pikir', stase: 'Analisis Penyelesaian', nilai: '69' },
    { id: 5, osce: 'Pertolongan Pertama Pada Kecelakaan', stase: 'Analisis Obat yang diberikan', nilai: '96' },
];

// --- Komponen Utama ---
// Anggap ini adalah file 'RekapDetailNilaiPage.jsx'
export default function RekapDetailNilaiPage() { 
    
    // Gunakan mock data baru sebagai default
    const { mahasiswa = mockAccount } = usePage().props;

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                
                {/* BREADCRUMB: Disesuaikan dengan gambar baru */}
                <OsBreadCrumb 
                    className="fixed" 
                    title="Rekap Nilai / Nilai Enrollment Mahasiswa / Riko Aditya Zaki Sir Raja / Detail Nilai"
                    icon={<ArrowLeft className="w-5 h-5" />}
                />

                <div className="flex-1 overflow-auto">

                    {/* --- BAGIAN ACCOUNT (Sesuai gambar, dengan border) --- */}
                    <div className="bg-white p-6 border border-black rounded-2xl shadow mb-6">
                        <h2 className="font-semibold text-lg mb-4">Account</h2>
                        <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full mr-6 bg-gray-700 flex-shrink-0"></div> 
                            <div>
                                <p className="text-sm text-gray-800"><span className="font-semibold">Nama :</span> {mahasiswa.nama}</p>
                                <p className="text-sm text-gray-800"><span className="font-semibold">NIM :</span> {mahasiswa.nim}</p>
                                <p className="text-sm text-gray-800"><span className="font-semibold">Jurusan :</span> {mahasiswa.jurusan}</p>
                            </div>
                        </div>
                    </div>

                    {/* --- BAGIAN TABEL NILAI (BARU, menggunakan OsTableHeader) --- */}
                    <h2 className="font-semibold text-lg mb-4 mt-6">Nilai (Nama Rubrik)</h2>
                    
                    {/* Header Tabel */}
                    <OsTableHeader columns={nilaiColumns} />

                    {/* Body Tabel (dibuat dengan flex agar matching) */}
                    {/* Wrapper ini untuk border luar */}
                    <div className="border-b border-l border-r border-black">
                        {mockNilai.map((item, index) => (
                            <div
                                key={item.id} 
                                // border-t untuk garis horizontal, bg-gray-100 untuk baris genap
                                className={`flex items-stretch border-t border-black ${index % 2 === 1 ? 'bg-gray-300' : 'bg-white'}`}
                            >
                                <div className="w-16 px-4 py-3 text-center text-sm text-gray-900 flex items-center justify-center">
                                    {item.id}.
                                </div>
                                
                                <div className="flex-1 px-4 py-3 border-l border-black text-sm text-gray-900 flex items-center">
                                    {item.osce}
                                </div>
                                
                                <div className="flex-1 px-4 py-3 border-l border-black text-sm text-gray-900 flex items-center">
                                    {item.stase}
                                </div>
                                
                                <div className="w-24 px-4 py-3 border-l border-black text-center text-sm text-gray-900 flex items-center justify-center">
                                    {item.nilai}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- Tombol Download (BARU) --- */}
                    <div className="flex justify-end mt-6">
                        <button
                            className="flex items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Hasil Nilai OSCE
                        </button>
                    </div>

                    {/* Teks "Diunduh pada..." DIHAPUS */}

                </div>

                <OsCopyright />
            </main>
        </div>
    );
}