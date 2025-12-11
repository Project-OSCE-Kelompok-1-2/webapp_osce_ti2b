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
export default function NilaiShow() {
    // --- 1. STATE MANAGEMENT ---
    // Mengatur status Sidebar (Buka/Tutup) agar responsif
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- 2. DATA DUMMY (SIMULASI DATABASE) ---
    // Objek ini meniru struktur data yang biasanya dikirim dari Backend (Laravel)
    const data = {
        // Data diri mahasiswa
        mahasiswa: {
            nama: "MI. AULIA KURNIA WIDYARANI",
            nim: "4.33.24.1.13",
            prodi: "Kedokteran Gigi",
            semester: "1",
        },
        // Informasi ujian yang sedang dilihat
        ujian: {
            stase: "OSCE Radiologi 01-A",
            tahun: "2025",
            dosen: "Prof. Dr. dr. Mahalul Azam, M.Kes",
        },
        // Array daftar nilai per kompetensi
        daftarNilai: [
            {
                id: 1,
                kompetensi: "Manajemen Halusinasi",
                nilai: 93.75,
                keterangan: "Sangat Baik",
            },
            { id: 2, kompetensi: "Restrain", nilai: 82.5, keterangan: "Baik" },
            {
                id: 3,
                kompetensi: "Pemasangan Infus",
                nilai: 86.35,
                keterangan: "Baik",
            },
            {
                id: 4,
                kompetensi: "Guided Imagery",
                nilai: 85.75,
                keterangan: "Baik",
            },
        ],
        // Array Links untuk Pagination (Biasanya digenerate otomatis oleh Laravel)
        links: [
            { url: null, label: "&laquo; Previous", active: false },
            { url: "http://localhost/page/1", label: "1", active: true }, // Halaman saat ini
            { url: "http://localhost/page/2", label: "2", active: false },
            { url: "http://localhost/page/3", label: "3", active: false },
            { url: "http://localhost/page/4", label: "4", active: false },
            { url: "http://localhost/page/5", label: "5", active: false },
            {
                url: "http://localhost/page/2",
                label: "Next &raquo;",
                active: false,
            },
        ],
        // Data ringkasan nilai
        totalNilai: "87.00",
        statusKelulusan: "LULUS",
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
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title="Hasil Penilaian OSCE" />

            {/* --- BAGIAN A: SIDEBAR --- */}
            <Sidebar
                type="mahasiswa"
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="grid w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                {/* 1. HEADER ATAS */}
                <OsHeader
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* 2. AREA KONTEN UTAMA */}
                <div className="flex flex-col gap-6">
                    {/* --- KARTU 1: JUDUL HALAMAN --- */}
                    <div className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center h-[70px]">
                        <div className="flex items-center gap-3 ml-2">
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

                    {/* --- BAGIAN FOOTER KONTEN --- */}
                    <div className="w-full flex flex-col gap-4">
                        {/* 1. PAGINATION */}
                        {/* Memanggil komponen pagination dan mengirim data links */}
                        <div className="ml-1">
                            <OsPagination links={data.links} />
                        </div>

                        {/* 2. KOTAK TOTAL NILAI & STATUS */}
                        <div className="w-full flex bg-white rounded-xl border border-black h-[60px] overflow-hidden items-center shadow-sm">
                            {/* Label Total */}
                            <div className="flex-1 h-full flex items-center justify-center font-bold text-black border-r border-black">
                                Total / Rata - rata
                            </div>
                            {/* Angka Nilai */}
                            <div className="w-[150px] h-full flex items-center justify-center font-extrabold text-xl text-black border-r border-black">
                                {data.totalNilai}
                            </div>
                            {/* Status LULUS/TIDAK */}
                            <div className="w-[200px] h-full flex items-center justify-center font-extrabold text-black text-lg uppercase tracking-wide bg-gray-50">
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
