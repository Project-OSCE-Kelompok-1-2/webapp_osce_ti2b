import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { ChevronRight, FileText, User } from "lucide-react";

// --- IMPORT KOMPONEN ---
import SidebarUniversal from "@/Components/SidebarUniversal";
import Pagination from "@/Components/Pagination";
// Asumsikan OsSearchBar disimpan di path ini
import OsSearchBar from "@/Components/searchbar";

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
    {
        id: 3,
        nama_ujian: "OSCE Bedah Mulut Dasar",
        dosen_penguji: "drg. Budi Santoso, Sp.BM",
        tanggal_ujian: "20 / 05 / 2024",
        semester: "4",
        tahun_ujian: "2024",
        status_lulus: false,
    },
    {
        id: 4,
        nama_ujian: "OSCE Periodonsia Dasar",
        dosen_penguji: "drg. Ratna Sari, Sp.Perio",
        tanggal_ujian: "31 / 10 / 2025",
        semester: "5",
        tahun_ujian: "2025",
        status_lulus: true,
    },
    {
        id: 5,
        nama_ujian: "OSCE Ortodonsia I",
        dosen_penguji: "Prof. Dr. dr. Mahalul Azam, M.Kes",
        tanggal_ujian: "31 / 10 / 2025",
        semester: "5",
        tahun_ujian: "2025",
        status_lulus: true,
    },
];

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

    // State Filter & Search
    const [filterSemester, setFilterSemester] = useState("");
    const [filterTahun, setFilterTahun] = useState("");
    const [search, setSearch] = useState(""); // State baru untuk search
    const [filteredData, setFilteredData] = useState(MOCK_UJIAN_LIST);

    // Logic Filter & Search
    useEffect(() => {
        let result = MOCK_UJIAN_LIST;

        // 1. Filter berdasarkan Semester
        if (filterSemester)
            result = result.filter((item) => item.semester === filterSemester);

        // 2. Filter berdasarkan Tahun
        if (filterTahun)
            result = result.filter((item) => item.tahun_ujian === filterTahun);

        // 3. Filter berdasarkan Search (Nama Ujian atau Dosen)
        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (item) =>
                    item.nama_ujian.toLowerCase().includes(lowerSearch) ||
                    item.dosen_penguji.toLowerCase().includes(lowerSearch)
            );
        }

        setFilteredData(result);
    }, [filterSemester, filterTahun, search]);

    // Handler opsional jika tombol Cari diklik manual (biasanya untuk API call, tapi disini reaktif)
    const handleSearchClick = () => {
        console.log("Searching for:", search);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
            <Head title="Hasil Penilaian OSCE" />

            {/* --- SIDEBAR (Fixed & Overlay) --- */}
            <SidebarUniversal
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* --- MAIN CONTENT --- */}
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

                {/* --- SEARCH BAR --- */}
                {/* Ditempatkan di sini agar memisahkan Info Mahasiswa dan Data Tabel */}
                <div className="mb-2">
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearchClick}
                        placeholder="Cari nama ujian atau dosen..."
                    />
                </div>

                {/* Tabel Penilaian */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                            Daftar Nilai Ujian
                        </h3>
                        <span className="rounded-md bg-white px-3 py-1 text-xs font-medium text-gray-500 border border-gray-200 shadow-sm">
                            Total: {filteredData.length} Data
                        </span>
                    </div>
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 font-semibold uppercase text-gray-500 tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4 text-center w-16">
                                    No
                                </th>
                                <th className="px-6 py-4">Nama Ujian</th>
                                <th className="px-6 py-4">Dosen Penguji</th>
                                <th className="px-6 py-4 text-center">
                                    Tanggal
                                </th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                                <th className="px-6 py-4 text-center">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.length > 0 ? (
                                filteredData.map((ujian, index) => (
                                    <tr
                                        key={ujian.id}
                                        className="group hover:bg-blue-50/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-center font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">
                                            {ujian.nama_ujian}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {ujian.dosen_penguji}
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">
                                            {ujian.tanggal_ujian}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    alert(
                                                        `Detail ID: ${ujian.id}`
                                                    )
                                                }
                                                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                                            >
                                                Lihat Nilai
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center justify-center w-24 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                                                    ujian.status_lulus
                                                        ? "bg-green-100 text-green-700 ring-1 ring-green-600/20"
                                                        : "bg-red-100 text-red-700 ring-1 ring-red-600/20"
                                                }`}
                                            >
                                                {ujian.status_lulus
                                                    ? "LULUS"
                                                    : "TIDAK LULUS"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-16 text-center text-gray-400"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="rounded-full bg-gray-50 p-4 ring-1 ring-gray-100">
                                                <FileText className="h-10 w-10 text-gray-300" />
                                            </div>
                                            <p>
                                                Data ujian tidak ditemukan untuk
                                                filter atau kata kunci ini.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- PAGINATION --- */}
                {/* Menggunakan Mock Links untuk simulasi tampilan */}
                <Pagination links={MOCK_LINKS} />
            </main>
        </div>
    );
}
