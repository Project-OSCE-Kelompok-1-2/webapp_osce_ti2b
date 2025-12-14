import React, { useState, useEffect, useMemo } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { FileText, User } from "lucide-react";

// --- IMPORT KOMPONEN ---
import Sidebar from "../../components/Sidebar";
import OsPagination from "../../components/pagination";
import OsSearchBar from "../../components/searchbar";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";
import OsTableBody from "../../components/tablecontain"; // Asumsi ada OsTableBody, jika tidak pakai table biasa

export default function NilaiIndex() {
    // 1. Ambil Data Full termasuk filters dari backend
    const { mahasiswa, ujian, filters } = usePage().props;
    const allUjianData = Array.isArray(ujian) ? ujian : ujian?.data || [];

    // Ambil opsi filter dari props (fallback ke array kosong jika undefined)
    const semesterOptions = filters?.semesters || [];
    const yearOptions = filters?.years || [];

    // 2. State Filter & Pagination
    const [search, setSearch] = useState("");
    const [filterSemester, setFilterSemester] = useState("");
    const [filterTahun, setFilterTahun] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- INSTANT FILTER LOGIC ---
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterSemester, filterTahun]);

    const filteredData = useMemo(() => {
        return allUjianData.filter((item) => {
            const term = search.toLowerCase();

            // Filter Search
            const matchSearch =
                item.nama_ujian?.toLowerCase().includes(term) ||
                item.dosen_penguji?.toLowerCase().includes(term);

            // Filter Semester (String Match)
            let matchSemester = true;
            if (filterSemester) {
                matchSemester = item.semester_label === filterSemester;
            }

            // Filter Tahun (String Match)
            let matchTahun = true;
            if (filterTahun) {
                matchTahun = item.tahun_ujian === filterTahun;
            }

            return matchSearch && matchSemester && matchTahun;
        });
    }, [search, filterSemester, filterTahun, allUjianData]);

    // Pagination Logic
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Generate Pagination Links
    const generatedLinks = useMemo(() => {
        if (totalPages <= 1) return [];
        const links = [];
        links.push({
            url: currentPage > 1 ? "#" : null,
            label: "&laquo; Previous",
            active: false,
            pageNumber: currentPage - 1,
        });
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                links.push({
                    url: "#",
                    label: i.toString(),
                    active: i === currentPage,
                    pageNumber: i,
                });
            } else if (
                (i === currentPage - 2 && i > 1) ||
                (i === currentPage + 2 && i < totalPages)
            ) {
                links.push({ url: null, label: "...", active: false });
            }
        }
        links.push({
            url: currentPage < totalPages ? "#" : null,
            label: "Next &raquo;",
            active: false,
            pageNumber: currentPage + 1,
        });
        return links;
    }, [currentPage, totalPages]);

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            <Head title="Hasil Penilaian OSCE" />

            <Sidebar
                type="mahasiswa"
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="w-full p-4 md:p-8 lg:p-12 min-h-screen flex flex-col justify-between gap-2 md:gap-4 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-2 md:gap-4">
                    <OsHeader
                        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    />

                    <div className="pt-0">
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

                        {/* Card Info Mahasiswa (SAMA) */}
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
                                                        {mahasiswa?.prodi ||
                                                            "-"}
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
                                                    setFilterSemester(
                                                        e.target.value
                                                    )
                                                } // Update state langsung
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
                                                    setFilterTahun(
                                                        e.target.value
                                                    )
                                                } // Update state langsung
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

                        {/* SEARCH BAR */}
                        <div className="mb-2">
                            <OsSearchBar
                                search={search}
                                setSearch={setSearch} // Instant Update
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
                                    Total: {totalItems} Data
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
                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((item, index) => (
                                                <tr
                                                    key={item.id}
                                                    className="group hover:bg-blue-50/30 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-center font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                                                        {(currentPage - 1) *
                                                            itemsPerPage +
                                                            index +
                                                            1}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                                        {item.nama_ujian}
                                                        <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                                                            {item.tanggal_ujian}{" "}
                                                            • {item.tahun_ujian}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {item.dosen_penguji ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-medium">
                                                        {item.semester}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Link
                                                            href={`/mahasiswa/nilai/${item.id}`}
                                                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                                                        >
                                                            Lihat Nilai
                                                        </Link>
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
                                                            ditemukan untuk
                                                            filter atau kata
                                                            kunci ini.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* PAGINATION */}
                        <div className="mt-6">
                            {totalPages > 1 && (
                                <OsPagination
                                    links={generatedLinks}
                                    onPageChange={(page) =>
                                        setCurrentPage(page)
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
