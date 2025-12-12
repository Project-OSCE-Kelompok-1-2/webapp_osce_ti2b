import React, { useState } from "react";
// Import library dari Inertia untuk handling head dan link navigasi
import { Head, Link } from "@inertiajs/react";
// Import ikon dari library lucide-react
import { FileText } from "lucide-react";

// =========================================
// --- IMPORT KOMPONEN CUSTOM (MODULAR) ---
// =========================================
import Sidebar from "../../components/Sidebar.jsx"; // Sidebar navigasi utama
import OsHeader from "../../components/Header.jsx"; // Header atas (navbar)
import OsTableHeader from "../../components/tableheader.jsx"; // Komponen kepala tabel
import OsTableBody from "../../components/tablecontain.jsx"; // Komponen isi tabel
import OsCopyright from "../../components/Copyright.jsx"; // Footer hak cipta
import OsPagination from "../../components/pagination.jsx"; // Komponen navigasi halaman

// =========================================
// --- KOMPONEN UTAMA HALAMAN ---
// =========================================
export default function NilaiShow({ header_detail, daftar_nilai, footer }) {
    // --- 1. STATE MANAGEMENT ---
    // Mengatur status Sidebar (Buka/Tutup) agar responsif
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- 2. DATA REAL (DARI BACKEND) ---
    // Kita mapping props dari controller ke struktur yang dipakai UI
    const data = {
        // Data diri mahasiswa
        mahasiswa: {
            nama: header_detail?.mahasiswa?.nama || "-",
            nim: header_detail?.mahasiswa?.nim || "-",
            prodi: header_detail?.mahasiswa?.prodi || "-",
            semester: header_detail?.tahun_akademik?.semester || "-",
        },
        // Informasi ujian yang sedang dilihat
        ujian: {
            stase: header_detail?.mata_kuliah?.nama || "-",
            tahun: header_detail?.tahun_akademik?.tahun || "-",
            dosen: "-", // Backend belum mengirim data dosen spesifik (karena penguji banyak)
        },
        // Array daftar nilai per kompetensi
        daftarNilai: daftar_nilai || [],

        // Data ringkasan nilai
        totalNilai: footer?.total_nilai_akhir || "0",
        statusKelulusan: footer?.status_kelulusan || "-",
    };

    // --- 3. KONFIGURASI TABEL ---
    // Mengatur kolom apa saja yang akan ditampilkan, lebar, dan style-nya
    const tableColumns = [
        {
            key: "id",
            content: "No",
            width: "w-[80px]",
            classes: "justify-center font-bold",
        },
        {
            key: "kompetensi",
            content: "Stase / Keterampilan Klinik",
            width: "flex-1",
            classes: "justify-start px-6 font-bold text-left",
        },
        {
            key: "nilai",
            content: "Nilai",
            width: "w-[150px]",
            classes: "justify-center",
        },
        {
            key: "keterangan",
            content: "Keterangan",
            width: "w-[200px]",
            classes: "justify-start px-6",
        },
    ];

    // --- 4. HELPER COMPONENT (UI KECIL) ---
    // Komponen kecil untuk menampilkan baris label & value di dalam Card Biru
    // Tujuannya agar kodingan di bawah tidak berulang-ulang (DRY Principle)
    const InfoRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:items-start mb-1">
            <span className="font-semibold w-40 shrink-0 text-white/90 text-sm">
                {label}
            </span>
            <span className="font-medium text-white text-sm">: {value}</span>
        </div>
    );

    // =========================================
    // --- RENDER TAMPILAN (JSX) ---
    // =========================================
    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            <Head title="Hasil Penilaian OSCE" />

            {/* --- BAGIAN A: SIDEBAR --- */}
            <Sidebar
                type="mahasiswa"
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="grid w-full p-4 md:p-8 lg:p-12 flex-1 grid-cols-1 grid-rows-[auto_1fr_auto] gap-4 md:gap-8 transition-all duration-300 lg:ml-20">
                {/* 1. HEADER ATAS */}
                <OsHeader
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* 2. AREA KONTEN UTAMA */}
                <div className="flex flex-col gap-4 md:gap-6 pt-2 md:pt-4">
                    {/* --- KARTU 1: JUDUL HALAMAN --- */}
                    <div className="w-full flex items-center pl-1">
                        <div className="flex items-center gap-3">
                            <FileText className="text-blue-600" size={32} />
                            <h1 className="font-sans font-bold text-2xl text-black mt-1">
                                Hasil Penilaian OSCE
                            </h1>
                        </div>
                    </div>

                    {/* --- KARTU 2: DETAIL MAHASISWA (WARNA BIRU) --- */}
                    <div className="w-full bg-blue-600 rounded-xl border border-black p-6 shadow-sm">
                        {/* Grid layout: 1 kolom di HP, 2 kolom di Laptop */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-4">
                            {/* Kolom Kiri */}
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
                                    label="Stase"
                                    value={data.ujian.stase}
                                />
                            </div>
                            {/* Kolom Kanan */}
                            <div>
                                <InfoRow
                                    label="Semester"
                                    value={data.mahasiswa.semester}
                                />
                                <InfoRow
                                    label="Tahun Ujian"
                                    value={data.ujian.tahun}
                                />
                                <InfoRow
                                    label="Dosen Penguji"
                                    value={data.ujian.dosen}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- KARTU 3: TABEL NILAI --- */}
                    <div className="w-full bg-white rounded-xl shadow-sm border border-black overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <div className="min-w-[600px]">
                                {/* Bagian Header Tabel */}
                                <div className="bg-white">
                                    <OsTableHeader columns={tableColumns} />
                                </div>
                                {/* Bagian Isi/Body Tabel */}
                                <div className="w-full">
                                    <OsTableBody
                                        data={data.daftarNilai}
                                        columns={tableColumns}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BAGIAN FOOTER KONTEN --- */}
                    <div className="w-full flex flex-col gap-4">
                        {/* 1. PAGINATION (Dihilangkan karena detail nilai biasanya satu halaman) */}
                        {/* <div className="ml-1">
                            <OsPagination links={data.links} />
                        </div> */}

                        {/* 2. KOTAK TOTAL NILAI & STATUS */}
                        <div className="w-full flex flex-col sm:flex-row bg-white rounded-xl border border-black h-auto sm:h-[60px] overflow-hidden items-center shadow-sm">
                            {/* Label Total */}
                            <div className="w-full sm:flex-1 h-[50px] sm:h-full flex items-center justify-center font-bold text-black border-b sm:border-b-0 sm:border-r border-black bg-gray-50 sm:bg-white">
                                Total / Rata - rata
                            </div>
                            {/* Angka Nilai */}
                            <div className="w-full sm:w-[150px] h-[50px] sm:h-full flex items-center justify-center font-extrabold text-xl text-black border-b sm:border-b-0 sm:border-r border-black">
                                {data.totalNilai}
                            </div>
                            {/* Status LULUS/TIDAK */}
                            <div className="w-full sm:w-[200px] h-[50px] sm:h-full flex items-center justify-center font-extrabold text-black text-lg uppercase tracking-wide bg-gray-50">
                                {data.statusKelulusan}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COPYRIGHT FOOTER --- */}
                <div className="mt-12">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
