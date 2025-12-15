import React, { useState, useEffect, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { FileText, Search, Table2, User } from "lucide-react";

// --- IMPORT KOMPONEN ---
import Sidebar from "../../components/Sidebar";
import OsPagination from "../../components/pagination";
import OsSearchBar from "../../components/searchbar";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";
import OsTableHeader from "../../components/tableheader";
import OsTableBody from "../../components/tablecontain";

export default function NilaiIndex({ mahasiswa, ujian, filters, queryParams }) {
    // ========================================
    // 1. LOGIC FILTERING (TRIGGER KE BACKEND)
    // ========================================

    // Ambil data dari props yang dikirim backend (Sudah difilter di server)
    const allUjianData = Array.isArray(ujian) ? ujian : ujian?.data || [];

    // Opsi Filter dari Backend
    const semesterOptions = filters?.semesters || [];
    const yearOptions = filters?.years || [];

    // State Filter: Ambil default dari URL (queryParams) agar tidak reset saat refresh
    const [search, setSearch] = useState(queryParams?.search || "");
    const [filterSemester, setFilterSemester] = useState(
        queryParams?.semester || ""
    );
    const [filterTahun, setFilterTahun] = useState(queryParams?.tahun || "");

    // State Pagination & UI
    const [currentPage, setCurrentPage] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const itemsPerPage = 10;

    // HANDLER FILTER: Mengirim request ke Laravel
    const handleFilterChange = (key, value) => {
        // Update State Lokal untuk UI
        if (key === "search") setSearch(value);
        if (key === "semester") setFilterSemester(value);
        if (key === "tahun") setFilterTahun(value);

        setCurrentPage(1); // Reset ke halaman 1

        // Siapkan parameter baru
        const newParams = {
            search: key === "search" ? value : search,
            semester: key === "semester" ? value : filterSemester,
            tahun: key === "tahun" ? value : filterTahun,
        };

        // REQUEST KE BACKEND (Server-side Filtering)
        router.get("/mahasiswa/nilai", newParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ["ujian", "queryParams"], // Hanya update data ujian agar performa cepat
        });
    };

    // ==========================================
    // 2. PAGINATION (SLICING DATA YANG SUDAH DIFILTER)
    // ==========================================
    const totalItems = allUjianData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Slice data untuk halaman aktif
    const paginatedData = allUjianData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Definisi Kolom untuk OsTableHeader & OsTableBody
    const columns = [
        { key: "no", content: "NO", width: "w-16 shrink-0" },
        {
            key: "nama_ujian",
            content: "NAMA UJIAN OSCE",
            width: "flex-[2]",
            classes: "justify-start items-center pl-2",
        },
        {
            key: "tahun_akademik",
            content: "TAHUN AKADEMIK",
            width: "min-w-52 shrink-0",
        },
        { key: "semester", content: "SEMESTER", width: "min-w-52 shrink-0" },
        { key: "aksi", content: "AKSI", width: " min-w-[150px] shrink-0" },
        { key: "status", content: "STATUS", width: " min-w-[150px] shrink-0" },
    ];

    // Transform data untuk OsTableBody
    const tableData = paginatedData.map((item, index) => ({
        no: (currentPage - 1) * itemsPerPage + index + 1,
        nama_ujian: (
            <div className="flex flex-col items-start pl-4">
                <span className="font-semibold text-gray-800">
                    {item.nama_ujian?.split(" 20")[0]}
                </span>
                <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                    {item.tanggal_ujian} • {item.tahun_ujian}
                </div>
            </div>
        ),
        tahun_akademik: item.tahun_ujian || "-",
        semester: `${item.semester_label} (Smtr ${item.semester_angka})`,
        aksi: (
            <Link
                href={`/mahasiswa/nilai/${item.id}`}
                className="inline-flex gap-2 items-center rounded-lg min-h-[36px] bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
            >
                <Search size={16} />
                Lihat Nilai
            </Link>
        ),
        status: (
            <span
                className={`inline-flex items-center justify-center w-24 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                    item.status_lulus
                        ? "bg-green-100 text-green-700 ring-1 ring-green-600/20"
                        : "bg-red-100 text-red-700 ring-1 ring-red-600/20"
                }`}
            >
                {item.status_lulus ? "LULUS" : "TIDAK LULUS"}
            </span>
        ),
    }));

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
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* <Head title="Hasil Penilaian OSCE" /> */}

            <Sidebar
                type="mahasiswa"
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader
                        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        variant="mahasiswa"
                    />

                    <div className="p-1">
                        <div className="mb-2 md:mb-4 flex flex-col items-start justify-start">
                            {/* <FileText className="text-blue-600" size={32} /> */}
                            <div className="flex gap-2 items-center justify-start my-2">
                                <User size={18} />
                                <h2 className="font-semibold text-lg">
                                    Menu Mahasiswa
                                </h2>
                            </div>
                            <p className="text-sm text-gray-500">
                                Rekapitulasi nilai ujian mahasiswa.
                            </p>
                            {/* <div>
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                    Hasil Penilaian OSCE
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Rekapitulasi nilai ujian mahasiswa.
                                </p>
                            </div> */}
                        </div>

                        {/* INFO MAHASISWA & FILTER PANELL */}
                        <div className="relative mb-4 overflow-hidden rounded-2xl bg-green-600 p-6 text-white shadow-xl shadow-blue-100">
                            {/* Background decoration */}
                            {/* <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/10 blur-3xl"></div>
                            <div className="absolute left-0 bottom-0 h-40 w-40 -translate-x-10 translate-y-10 rounded-full bg-blue-400/30 blur-2xl"></div> */}

                            <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
                                {/* Kiri: Profil Mahasiswa */}
                                <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                                    <div className="mt-1 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                        <User className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="w-full space-y-4">
                                            <div className="border-b border-blue-400/30 pb-3">
                                                <p className="text-sm font-medium text-blue-100">
                                                    Nama Lengkap
                                                </p>
                                                <p className="text-xl font-bold tracking-wide">
                                                    {mahasiswa?.nama || "-"}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
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
                                                <div>
                                                    <p className="text-sm font-medium text-blue-100">
                                                        Kelas
                                                    </p>
                                                    <p className="text-lg font-semibold">
                                                        {mahasiswa?.kelas || "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Kanan: Filter Panel (Menggunakan handleFilterChange) */}
                                <div className="lg:col-span-5 flex flex-col justify-center rounded-xl bg-green-800/40 p-5 border border-white/10">
                                    <div className="space-y-4">
                                        {/* Filter Semester */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
                                                Semester
                                            </label>
                                            <select
                                                value={filterSemester}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "semester",
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
                                                {semesterOptions.map(
                                                    (sem, idx) => (
                                                        <option
                                                            key={idx}
                                                            value={sem}
                                                            className="text-gray-800"
                                                        >
                                                            {sem}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                        {/* Filter Tahun */}
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
                                                {yearOptions.map(
                                                    (year, idx) => (
                                                        <option
                                                            key={idx}
                                                            value={year}
                                                            className="text-gray-800"
                                                        >
                                                            {year}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                        <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                                            <span className="text-sm font-medium text-blue-100">
                                                Status Akademik
                                            </span>
                                            <span className="rounded-full bg-green-500 px-4 py-1 text-xs font-bold text-white ">
                                                {mahasiswa?.status || "Aktif"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-2">
                            <OsSearchBar
                                search={search}
                                setSearch={(val) =>
                                    handleFilterChange("search", val)
                                }
                                placeholder="Cari nama ujian"
                            />
                        </div>

                        <div className="flex gap-1 items-center justify-start my-2">
                            <Table2 size={18} />
                            <h2 className="font-semibold text-lg">
                                Daftar Nilai Ujian
                            </h2>
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Total: {totalItems} data)
                            </span>
                        </div>

                        {/* Tabel Data - Bagian yang Dimodifikasi */}
                        <div className="bg-white p-5 border border-os-primary-mhs overflow-x-auto rounded-xl shadow-sm">
                            {/* Tambahkan min-w-max pada div di bawah ini untuk memastikan tabel memiliki lebar minimum yang mencakup semua kolom,
                                sehingga scrollbar akan muncul di parent div dengan overflow-x-auto */}
                            <div className="w-full min-w-max pb-2">
                                <OsTableHeader columns={columns} variant="mahasiswa" />
                                <div className="mt-2">
                                    {tableData.length > 0 ? (
                                        <OsTableBody
                                            data={tableData}
                                            columns={columns}
                                            variant="mahasiswa"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <div className="rounded-full bg-white p-4 ring-1 ring-gray-100">
                                                <FileText className="h-10 w-10 text-gray-300" />
                                            </div>
                                            <p>Data ujian tidak ditemukan.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Akhir Bagian yang Dimodifikasi */}

                        <div className="mt-2">
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

                <div className="">
                    <OsCopyright variant="mahasiswa" />
                </div>
            </main>
        </div>
    );
}
