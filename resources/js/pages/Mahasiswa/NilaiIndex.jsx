import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { ChevronRight, FileText, User } from "lucide-react";

// --- IMPORT KOMPONEN ---
// Pastikan path ini sesuai dengan struktur folder Anda
import SidebarUniversal from "@/Components/SidebarUniversal";
import Pagination from "@/Components/Pagination";

// --- MOCK DATA (Simulasi Database) ---
const MOCK_MAHASISWA = {
    nama: "MI. AULIA KURNIA WIDYARANI",
    nim: "4.33.24.1.13",
    prodi: "Kedokteran Gigi",
    status: "Aktif",
};

const MOCK_UJIAN_LIST = [
  {
    id: 1,
    nama_ujian: "OSCE Radiologi 01-A",
    dosen_penguji: "Prof. Dr. dr. Mahalul Azam, M.Kes",
    tanggal_ujian: "31 / 10 / 2025",
    semester: "5",
    tahun_ujian: "2025",
    status_lulus: true,
  },
  {
    id: 2,
    nama_ujian: "OSCE Konservasi Gigi 02-B",
    dosen_penguji: "Dr. drg. Siti Aminah, Sp.KG",
    tanggal_ujian: "01 / 11 / 2025",
    semester: "5",
    tahun_ujian: "2025",
    status_lulus: true,
  },
];


const { ujian, filters } = usePage().props;

// --- MOCK LINKS (Simulasi Pagination Laravel) ---
const MOCK_LINKS = [
    { url: null, label: "Previous", active: false },
    { url: "#", label: "1", active: true },
    { url: "#", label: "2", active: false },
    { url: "#", label: "3", active: false },
    { url: "#", label: "Next", active: false },
];

export default function NilaiIndex() {
    // State Sidebar (Default True = Terbuka)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // State Filter
    const [filterSemester, setFilterSemester] = useState("");
    const [filterTahun, setFilterTahun] = useState("");
    const [filteredData, setFilteredData] = useState(MOCK_UJIAN_LIST);

    // Logic Filter Sederhana
    useEffect(() => {
        let result = MOCK_UJIAN_LIST;
        if (filterSemester)
            result = result.filter((item) => item.semester === filterSemester);
        if (filterTahun)
            result = result.filter((item) => item.tahun_ujian === filterTahun);
        setFilteredData(result);
    }, [filterSemester, filterTahun]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
            <Head title="Hasil Penilaian OSCE" />

            {/* --- SIDEBAR (Fixed & Overlay) --- */}
            <SidebarUniversal
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* --- MAIN CONTENT --- */}
            {/* NOTE PENTING: Class 'ml-20' dibuat statis.
                Ini membuat konten selalu memberi ruang untuk sidebar mode mini (closed).
                Saat sidebar dibuka (width membesar), ia akan menutupi (overlay) konten ini 
                karena sidebar memiliki z-index yang lebih tinggi.
            */}
            <main className="transition-all duration-300 ease-in-out p-6 pt-8 ml-20">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center text-sm text-gray-500">
                    <Link
                        href="#"
                        className="hover:text-blue-600 transition-colors"
                    >
                        Dashboard
                    </Link>
                    <ChevronRight className="mx-2 h-4 w-4" />
                    <span className="font-semibold text-blue-600">
                        Hasil Penilaian
                    </span>
                </div>

                {/* Judul Halaman */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                            Hasil Penilaian OSCE
                        </h1>
                        <p className="text-sm text-gray-500">
                            Rekapitulasi nilai ujian mahasiswa.
                        </p>
                    </div>
                </div>

                {/* Card Info Mahasiswa */}
                <div className="relative mb-8 overflow-hidden rounded-2xl bg-blue-600 p-2 text-white shadow-xl shadow-blue-100">
                    <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute left-0 bottom-0 h-40 w-40 -translate-x-10 translate-y-10 rounded-full bg-blue-400/30 blur-2xl"></div>

                    <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Kiri: Profil */}
                        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                            <div className="flex items-start gap-5">
                                <div className="mt-1 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                    <User className="h-7 w-7 text-white" />
                                </div>
                                <div className="w-full space-y-4">
                                    <div className="border-b border-blue-400/30 pb-3">
                                        <p className="text-sm font-medium text-blue-100">
                                            Nama Lengkap
                                        </p>
                                        <p className="text-xl font-bold tracking-wide">
                                            {MOCK_MAHASISWA.nama}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-blue-100">
                                                NIM
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {MOCK_MAHASISWA.nim}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-100">
                                                Program Studi
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {MOCK_MAHASISWA.prodi}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Filter Panel */}
                        <div className="lg:col-span-5 flex flex-col justify-center rounded-xl bg-blue-700/40 p-5 backdrop-blur-md border border-white/10">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
                                        Semester
                                    </label>
                                    <select
                                        value={filterSemester}
                                        onChange={(e) =>
                                            setFilterSemester(e.target.value)
                                        }
                                        className="w-full rounded-lg border-0 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 transition cursor-pointer hover:bg-white/20"
                                    >
                                        <option
                                            value=""
                                            className="text-gray-800"
                                        >
                                            Semua Semester
                                        </option>
                                        <option
                                            value="4"
                                            className="text-gray-800"
                                        >
                                            Semester 4
                                        </option>
                                        <option
                                            value="5"
                                            className="text-gray-800"
                                        >
                                            Semester 5
                                        </option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
                                        Tahun Ujian
                                    </label>
                                    <select
                                        value={filterTahun}
                                        onChange={(e) =>
                                            setFilterTahun(e.target.value)
                                        }
                                        className="w-full rounded-lg border-0 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 transition cursor-pointer hover:bg-white/20"
                                    >
                                        <option
                                            value=""
                                            className="text-gray-800"
                                        >
                                            Semua Tahun
                                        </option>
                                        <option
                                            value="2024"
                                            className="text-gray-800"
                                        >
                                            2024
                                        </option>
                                        <option
                                            value="2025"
                                            className="text-gray-800"
                                        >
                                            2025
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                                <span className="text-sm font-medium text-blue-100">
                                    Status Akademik
                                </span>
                                <span className="rounded-full bg-green-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-green-900/20">
                                    {MOCK_MAHASISWA.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                