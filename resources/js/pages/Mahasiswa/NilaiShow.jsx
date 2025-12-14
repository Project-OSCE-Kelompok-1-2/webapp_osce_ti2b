import React, { useState } from "react";
// Import library dari Inertia untuk handling head dan link navigasi
import { Head, Link } from "@inertiajs/react";
// Import ikon dari library lucide-react
import { FileText } from "lucide-react";

// =========================================
// --- IMPORT KOMPONEN CUSTOM (MODULAR) ---
// =========================================
import Sidebar from "../../components/Sidebar"; // Pastikan path import benar
import OsHeader from "../../components/Header";
import OsTableHeader from "../../components/tableheader";
import OsTableBody from "../../components/tablecontain";
import OsCopyright from "../../components/Copyright";

// =========================================
// --- KOMPONEN UTAMA HALAMAN ---
// =========================================
export default function NilaiShow({ header_detail, daftar_nilai, footer }) {
    // --- 1. STATE MANAGEMENT ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- 2. DATA MAPPING (BACKEND -> FRONTEND) ---
    const data = {
        mahasiswa: {
            nama: header_detail?.mahasiswa?.nama || "-",
            nim: header_detail?.mahasiswa?.nim || "-",
            prodi: header_detail?.mahasiswa?.prodi || "-",
            semester: header_detail?.tahun_akademik?.semester || "-",
        },
        ujian: {
            // Mengambil nama OSCE dari 'mata_kuliah.nama' sesuai controller
            nama_osce: header_detail?.mata_kuliah?.nama || "-",
            tahun: header_detail?.tahun_akademik?.tahun || "-",
        },
        // Array daftar nilai (Looping Stase)
        daftarNilai: daftar_nilai || [],

        // Footer Ringkasan
        totalNilai: footer?.total_nilai_akhir ?? "0", // Gunakan ?? agar nilai 0 tetap tampil
        statusKelulusan: footer?.status_kelulusan || "BELUM LENGKAP",
    };

    // --- 3. KONFIGURASI KOLOM TABEL ---
    const tableColumns = [
        {
            key: "id",
            content: "No",
            width: "w-[40px] md:w-[80px]",
            classes: "justify-center items-center font-bold text-gray-700",
        },
        {
            // PENTING: Key ini harus sama dengan key di Controller ('nama_stase')
            key: "nama_stase",
            content: (
                <>
                    <span className="hidden md:inline">Nama Stase</span>
                    <span className="md:hidden text-xs">Stase</span>
                </>
            ),
            width: "flex-1",
            classes:
                "justify-center md:justify-start items-center px-2 md:px-6 font-bold text-center md:text-left text-gray-800",
        },
        {
            key: "nilai",
            content: "Nilai",
            width: "w-[60px] md:w-[150px]",
            classes: "justify-center items-center font-semibold text-gray-900",
        },
        {
            key: "keterangan",
            content: (
                <>
                    <span className="hidden md:inline">Keterangan</span>
                    <span className="md:hidden">Ket.</span>
                </>
            ),
            width: "w-[100px] md:w-[200px]",
            classes:
                "justify-center items-center px-2 md:px-6 font-medium text-gray-600 uppercase text-xs tracking-wide",
        },
    ];

    // --- 4. HELPER COMPONENT (Untuk Baris Info) ---
    const InfoRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:items-start mb-1">
            <span className="font-semibold w-40 shrink-0 text-white/90 text-sm">
                {label}
            </span>
            <span className="font-medium text-white text-sm break-words flex-1">
                : {value}
            </span>
        </div>
    );

    // =========================================
    // --- RENDER TAMPILAN (JSX) ---
    // =========================================
    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            <Head title="Hasil Penilaian OSCE" />

            {/* SIDEBAR */}
            <Sidebar
                type="mahasiswa"
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="w-full p-4 md:p-8 lg:p-12 min-h-screen flex flex-col justify-between gap-2 md:gap-4 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-2 md:gap-4">
                    {/* HEADER */}
                    <OsHeader
                        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    />

                    {/* KONTEN UTAMA */}
                    <div className="flex flex-col gap-4 md:gap-6 pt-0">
                        {/* 1. JUDUL HALAMAN */}
                        <div className="w-full flex items-center pl-1">
                            <div className="flex items-center gap-3">
                                <FileText className="text-blue-600" size={32} />
                                <h1 className="font-sans font-bold text-2xl text-black mt-1">
                                    Hasil Penilaian OSCE
                                </h1>
                            </div>
                        </div>

                        {/* 2. KARTU INFORMASI (BIRU) */}
                        <div className="w-full bg-blue-600 rounded-xl border border-black p-6 shadow-sm">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-4">
                                {/* Kiri */}
                                <div>
                                    <InfoRow
                                        label="Nama"
                                        value={data.mahasiswa.nama}
                                    />
                                    <InfoRow
                                        label="NIM"
                                        value={data.mahasiswa.nim}
                                    />
                                    <InfoRow
                                        label="Program Studi"
                                        value={data.mahasiswa.prodi}
                                    />
                                    <InfoRow
                                        label="Nama OSCE"
                                        value={data.ujian.nama_osce}
                                    />
                                </div>
                                {/* Kanan */}
                                <div>
                                    <InfoRow
                                        label="Semester"
                                        value={data.mahasiswa.semester}
                                    />
                                    <InfoRow
                                        label="Tahun Ujian"
                                        value={data.ujian.tahun}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. TABEL NILAI */}
                        <div className="w-full bg-white rounded-xl shadow-sm border border-black overflow-hidden flex flex-col">
                            <div className="overflow-x-auto">
                                <div className="min-w-full">
                                    <div className="bg-white">
                                        <OsTableHeader columns={tableColumns} cl />
                                    </div>
                                    <div className="w-full">
                                        <OsTableBody
                                            data={data.daftarNilai}
                                            columns={tableColumns}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. FOOTER NILAI (TOTAL & STATUS) */}
                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col sm:flex-row bg-white rounded-xl border border-black h-auto sm:h-[60px] overflow-hidden items-center shadow-sm">
                                {/* Label */}
                                <div className="w-full sm:flex-1 h-[50px] sm:h-full flex items-center justify-center font-bold text-black border-b sm:border-b-0 sm:border-r border-black bg-gray-50 sm:bg-white">
                                    Total / Rata - rata
                                </div>
                                {/* Angka Nilai */}
                                <div className="w-full sm:w-[150px] h-[50px] sm:h-full flex items-center justify-center font-extrabold text-xl text-black border-b sm:border-b-0 sm:border-r border-black">
                                    {data.totalNilai}
                                </div>
                                {/* Status */}
                                <div className="w-full sm:w-[200px] h-[50px] sm:h-full flex items-center justify-center font-extrabold text-black text-lg uppercase tracking-wide bg-gray-50">
                                    {data.statusKelulusan}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="mt-12">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
