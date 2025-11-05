import React from "react";
import { usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react"; 

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";
// OsTableHeader dan OsPagination dihapus karena tidak dipakai di desain ini

// --- Mock Data (SESUAI GAMBAR BARU) ---
const mockAccount = {
    nama: "Riko Aditya Zaki Sir Raja",
    nim: "12345689012345",
    jurusan: "Teknologi per-ilmuan hitam"
};

// Data baru untuk tabel nilai
const mockNilai = [
    { id: 1, osce: 'Body', stase: 'Body', nilai: 'Body' },
    { id: 2, osce: 'Body', stase: 'Body', nilai: 'Body' },
    { id: 3, osce: 'Body', stase: 'Body', nilai: 'Body' },
    { id: 4, osce: 'Body', stase: 'Body', nilai: 'Body' },
    { id: 5, osce: 'Body', stase: 'Body', nilai: 'Body' },
    { id: 6, osce: 'Body', stase: 'Body', nilai: 'Body' },
];

// --- Komponen Utama ---
// Annnnggap ini adalah file 'RekapDetailNilaiPage.jsx'
export default function RekapDetailNilaiPage() { 
    
    // Gunakan mock data baru sebagai default
    const { mahasiswa = mockAccount } = usePage().props;
    // Hapus state search dan handleSearch

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                
                {/* BREADCRUMB: Sesuai gambar */}
                <OsBreadCrumb 
                    className="fixed" 
                    title="Rekap Nilai / Nilai Enrollment Mahasiswa / Riko Aditya Zaki Sir Raja"
                    icon={<ArrowLeft className="w-5 h-5" />}
                />

                <div className="flex-1 overflow-auto">

                    {/* --- BAGIAN ACCOUNT (Tetap Sama) --- */}
                    <div className="bg-white p-6 rounded-2xl shadow mb-6">
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

                    {/* --- BAGIAN FILTER (DIHAPUS) --- */}

                    {/* --- BAGIAN TABEL NILAI (BARU) --- */}
                    <h2 className="font-semibold text-lg mb-4 mt-6">Nilai (Nama Rubrik)</h2>
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium w-24">No</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Nama Osce</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Nama Stase</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Nilai</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mockNilai.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}.</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.osce}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stase}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nilai}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- TANGGAL UNDUH (BARU) --- */}
                    <p className="text-right text-sm text-gray-500 mt-4">
                        Diunduh pada Rabu, 5 November 2025
                    </p>

                </div>

                <OsCopyright />
            </main>
        </div>
    );
}