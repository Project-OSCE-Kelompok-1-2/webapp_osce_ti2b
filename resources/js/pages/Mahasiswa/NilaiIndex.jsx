import React, { useState, useCallback } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { ChevronRight, FileText, User } from "lucide-react";

// --- IMPORT KOMPONEN ---
import Sidebar from "@/Components/Sidebar";
import OsPagination from "../../components/pagination";
import OsSearchBar from "@/Components/searchbar";
import OsHeader from "@/Components/Header";
import OsCopyright from "@/Components/Copyright";

// --- HELPER: DEBOUNCE MANUAL ---
const customDebounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export default function NilaiIndex() {
    // 1. AMBIL DATA DARI CONTROLLER (Safe Access)
    const {
        mahasiswa = {},
        ujian = {
            data: [],
            links: [],
            total: 0,
            current_page: 1,
            per_page: 10,
        },
        filters = {},
    } = usePage().props;

    // --- STATE UI ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- STATE FILTER (Server Side) ---
    const [search, setSearch] = useState(filters?.q || "");
    const [filterSemester, setFilterSemester] = useState(filters?.sem || "");
    const [filterTahun, setFilterTahun] = useState(filters?.tahun || "");

    // --- LOGIC 1: DROPDOWN CHANGE ---
    const handleFilterChange = (key, value) => {
        if (key === "sem") setFilterSemester(value);
        if (key === "tahun") setFilterTahun(value);

        router.get(
            "/mahasiswa/nilai",
            {
                q: search,
                sem: key === "sem" ? value : filterSemester,
                tahun: key === "tahun" ? value : filterTahun,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    // --- LOGIC 2: SEARCH ---
    const debouncedSearch = useCallback(
        customDebounce((query, currentSem, currentTahun) => {
            router.get(
                "/mahasiswa/nilai",
                {
                    q: query,
                    sem: currentSem,
                    tahun: currentTahun,
                },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 500),
        []
    );

    const handleSearchChange = (val) => {
        setSearch(val);
        debouncedSearch(val, filterSemester, filterTahun);
    };

    const handleSearchManual = () => {
        router.get(
            "/mahasiswa/nilai",
            { q: search, sem: filterSemester, tahun: filterTahun },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            <Head title="Hasil Penilaian OSCE" />

            {/* --- SIDEBAR --- */}
            <Sidebar
                type="mahasiswa"
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* --- MAIN CONTENT --- */}
            <main className="grid w-full p-4 md:p-8 lg:p-12 flex-1 grid-cols-1 grid-rows-[auto_1fr_auto] gap-2 md:gap-4 transition-all duration-300 lg:ml-20">
                <OsHeader
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <div className="pt-0">
                    {/* Judul Halaman */}
                    <div className="mb-6 md:mb-8 flex items-center gap-3">
                        <FileText className="text-blue-600" size={32} />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                Hasil Penilaian OSCE
                            </h1>
                            <p className="text-sm text-gray-500">
                                Rekapitulasi nilai ujian mahasiswa.
                            </p>
                        </div>
                    </div>

                    {/* Card Info Mahasiswa (DINAMIS DARI CONTROLLER) */}
                    <div className="relative mb-8 overflow-hidden rounded-2xl bg-blue-600 p-6 text-white shadow-xl shadow-blue-100">
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
                                                {mahasiswa?.nama || "-"}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-blue-100">
                                                    NIM
                                                </p>
                                                <p className="text-lg font-semibold">
                                                    {mahasiswa?.nim || "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-blue-100">
                                                    Program Studi
                                                </p>
                                                <p className="text-lg font-semibold">
                                                    {mahasiswa?.prodi || "-"}
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
                                                handleFilterChange(
                                                    "sem",
                                                    e.target.value
                                                )
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
                                                value="Ganjil"
                                                className="text-gray-800"
                                            >
                                                Ganjil
                                            </option>
                                            <option
                                                value="Genap"
                                                className="text-gray-800"
                                            >
                                                Genap
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
                                                handleFilterChange(
                                                    "tahun",
                                                    e.target.value
                                                )
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
                                                value="2024/2025"
                                                className="text-gray-800"
                                            >
                                                2024/2025
                                            </option>
                                            <option
                                                value="2025/2026"
                                                className="text-gray-800"
                                            >
                                                2025/2026
                                            </option>
                                            <option
                                                value="2026/2027"
                                                className="text-gray-800"
                                            >
                                                2026/2027
                                            </option>
                                        </select>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                                        <span className="text-sm font-medium text-blue-100">
                                            Status Akademik
                                        </span>
                                        <span className="rounded-full bg-green-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-green-900/20">
                                            {mahasiswa?.status || "Aktif"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- SEARCH BAR --- */}
                    <div className="mb-2">
                        <OsSearchBar
                            search={search}
                            setSearch={handleSearchChange}
                            onSearchClick={handleSearchManual}
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
                                Total: {ujian?.total || 0} Data
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 font-semibold uppercase text-gray-500 tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-4 text-center w-16">
                                            No
                                        </th>
                                        <th className="px-6 py-4">
                                            Nama Ujian
                                        </th>
                                        <th className="px-6 py-4">
                                            Dosen Penguji
                                        </th>
                                        <th className="px-6 py-4 text-center">
                                            Semester
                                        </th>
                                        <th className="px-6 py-4 text-center">
                                            Aksi
                                        </th>
                                        <th className="px-6 py-4 text-center">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {/* LOOP DATA DINAMIS DARI 'ujian.data' */}
                                    {ujian?.data && ujian.data.length > 0 ? (
                                        ujian.data.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className="group hover:bg-blue-50/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-center font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                                                    {(ujian.current_page - 1) *
                                                        ujian.per_page +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-800">
                                                    {item.nama_ujian}
                                                    <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                                                        {item.tanggal_ujian} •{" "}
                                                        {item.tahun_ujian}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {item.dosen_penguji || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-center font-medium">
                                                    {item.semester}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {/* --- PERBAIKAN: GANTI BUTTON JADI LINK --- */}
                                                    <Link
                                                        href={`/mahasiswa/nilai/${item.id}`}
                                                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                                                    >
                                                        Lihat Nilai
                                                    </Link>
                                                    {/* -------------------------------------- */}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center justify-center w-24 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                                                            item.status_lulus
                                                                ? "bg-green-100 text-green-700 ring-1 ring-green-600/20"
                                                                : "bg-red-100 text-red-700 ring-1 ring-red-600/20"
                                                        }`}
                                                    >
                                                        {item.status_lulus
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
                                                        Data ujian tidak
                                                        ditemukan untuk filter
                                                        atau kata kunci ini.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- PAGINATION (DINAMIS) --- */}
                    <div className="mt-6">
                        {ujian?.links && <OsPagination links={ujian.links} />}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
