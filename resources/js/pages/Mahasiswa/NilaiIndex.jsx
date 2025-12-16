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
    // ... (LOGIC FILTERING & STATE TETAP SAMA) ...

    // --- HELPER FORMAT TANGGAL ---
    const formatTanggalIndo = (tanggal) => {
        if (!tanggal) return "-";
        const date = new Date(tanggal);
        if (isNaN(date.getTime())) return tanggal;
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    const formatJam = (tanggal) => {
        if (!tanggal) return "";
        const date = new Date(tanggal);
        if (isNaN(date.getTime())) return "";

        return new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
    };

    const allUjianData = Array.isArray(ujian) ? ujian : ujian?.data || [];
    const semesterOptions = filters?.semesters || [];
    const yearOptions = filters?.years || [];
    const [search, setSearch] = useState(queryParams?.search || "");
    const [filterSemester, setFilterSemester] = useState(
        queryParams?.semester || ""
    );
    const [filterTahun, setFilterTahun] = useState(queryParams?.tahun || "");
    const [currentPage, setCurrentPage] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const itemsPerPage = 10;

    const handleFilterChange = (key, value) => {
        if (key === "search") setSearch(value);
        if (key === "semester") setFilterSemester(value);
        if (key === "tahun") setFilterTahun(value);
        setCurrentPage(1);
        const newParams = {
            search: key === "search" ? value : search,
            semester: key === "semester" ? value : filterSemester,
            tahun: key === "tahun" ? value : filterTahun,
        };
        router.get("/mahasiswa/nilai", newParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ["ujian", "queryParams"],
        });
    };

    const totalItems = allUjianData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = allUjianData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- PERBAIKAN 1: Update Columns Definition ---
    // Menambahkan 'shrink-0' agar kolom tidak tergencet saat di mobile
    const columns = [
        { key: "no", content: "NO", width: "w-12 md:w-16 shrink-0" },
        {
            key: "nama_ujian",
            content: "NAMA UJIAN OSCE",
            // Ubah width: pastikan ada min-width yang cukup besar dan shrink-0
            width: "w-[250px] md:flex-1 shrink-0",
            classes: "justify-start items-center pl-2",
        },
        {
            key: "tahun_akademik",
            content: "TAHUN",
            width: "w-[100px] md:w-[140px] shrink-0",
        },
        {
            key: "semester",
            content: "SEMESTER",
            width: "w-[100px] md:w-[140px] shrink-0",
        },
        {
            key: "aksi",
            content: "AKSI",
            width: "w-[120px] md:w-[140px] shrink-0",
        },
        {
            key: "status",
            content: "STATUS",
            width: "w-[120px] md:w-[130px] shrink-0",
        },
    ];

    const tableData = paginatedData.map((item, index) => ({
        no: (currentPage - 1) * itemsPerPage + index + 1,
        nama_ujian: (
            <div className="flex flex-col items-start pl-2 md:pl-4 py-1">
                <span className="font-semibold text-sm md:text-base text-gray-800 line-clamp-2 text-wrap">
                    {item.nama_ujian?.split(" 20")[0]}
                </span>

                <div className="text-[10px] md:text-[11px] text-gray-500 font-medium mt-1 flex flex-wrap items-center gap-1.5">
                    <span>{formatTanggalIndo(item.tanggal_ujian)}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 font-semibold">
                        {formatJam(item.tanggal_ujian)} WIB
                    </span>
                    <span className="hidden md:inline text-gray-300">•</span>
                    <span className="text-gray-400">{item.tahun_ujian}</span>
                </div>
            </div>
        ),
        tahun_akademik: item.tahun_ujian || "-",
        semester: item.semester_label,
        aksi: (
            <Link
                href={`/mahasiswa/nilai/${item.id}`}
                className="inline-flex gap-1 md:gap-2 items-center justify-center rounded-lg min-h-[32px] md:min-h-[36px] bg-green-600 px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-bold text-white hover:bg-green-700 transition-all active:scale-95"
            >
                <Search size={14} className="md:w-4 md:h-4" />
                <span className="inline">Lihat Nilai</span>
            </Link>
        ),
        status: (
            <span
                className={`inline-flex items-center justify-center w-20 md:w-24 rounded-full px-2 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                    item.status_kelulusan === "LULUS"
                        ? "bg-green-100 text-green-700 ring-1 ring-green-600/20"
                        : "bg-red-100 text-red-700 ring-1 ring-red-600/20"
                }`}
            >
                {item.status_kelulusan}
            </span>
        ),
    }));

    const generatedLinks = useMemo(() => {
        if (totalPages <= 1) return [];
        return [];
        // (Pastikan logic pagination dikembalikan sesuai aslinya jika ada)
    }, [currentPage, totalPages]);

    return (
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-4 md:p-8 lg:p-os-12 font-sans overflow-hidden">
            <Sidebar
                type="mahasiswa"
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="w-full lg:ml-20 min-h-screen flex flex-col gap-6 md:gap-os-8 transition-all duration-300">
                <div className="flex flex-col gap-6 md:gap-os-8">
                    <OsHeader
                        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        variant="mahasiswa"
                    />

                    <div className="p-0 md:p-1">
                        {/* Judul Halaman */}
                        <div className="mb-4 flex flex-col items-start">
                            <div className="flex gap-2 items-center my-2">
                                <User size={18} />
                                <h2 className="font-semibold text-lg">
                                    Menu Mahasiswa
                                </h2>
                            </div>
                            <p className="text-sm text-gray-500">
                                Rekapitulasi nilai ujian mahasiswa.
                            </p>
                        </div>

                        {/* --- KARTU HIJAU (INFO & FILTER) --- */}
                        <div className="relative mb-6 overflow-hidden rounded-2xl bg-green-600 p-4 md:p-6 text-white shadow-xl shadow-blue-100">
                            {/* ... (BAGIAN INFO MAHASISWA & FILTER TIDAK PERLU DIUBAH, SAMA SEPERTI SEBELUMNYA) ... */}
                            {/* Biarkan bagian ini sesuai kode aslimu untuk menghemat tempat di jawaban ini */}
                            <div className="relative z-10 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12">
                                {/* Copy Paste isi Kartu Hijau dari kodemu sebelumnya di sini */}
                                <div className="lg:col-span-7 flex flex-col justify-center space-y-4 md:space-y-6">
                                    <div className="flex items-start gap-4 md:gap-5">
                                        <div className="hidden sm:flex h-12 w-12 md:h-14 md:w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                            <User className="h-6 w-6 md:h-7 md:w-7 text-white" />
                                        </div>
                                        <div className="w-full space-y-3 md:space-y-4">
                                            <div className="border-b border-blue-400/30 pb-3">
                                                <p className="text-xs md:text-sm font-medium text-blue-100 mb-1">
                                                    Nama Lengkap
                                                </p>
                                                <p className="text-lg md:text-xl font-bold tracking-wide break-words">
                                                    {mahasiswa?.nama || "-"}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs font-medium text-blue-100">
                                                        NIM
                                                    </p>
                                                    <p className="text-base md:text-lg font-semibold">
                                                        {mahasiswa?.nim || "-"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-blue-100">
                                                        Prodi
                                                    </p>
                                                    <p className="text-base md:text-lg font-semibold truncate">
                                                        {mahasiswa?.prodi ||
                                                            "-"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-blue-100">
                                                        Kelas
                                                    </p>
                                                    <p className="text-base md:text-lg font-semibold">
                                                        {mahasiswa?.kelas ||
                                                            "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-5 flex flex-col justify-center rounded-xl bg-green-800/40 p-4 md:p-5 border border-white/10">
                                    {/* Filter controls placeholder (sama seperti kodemu) */}
                                    <div className="space-y-3 md:space-y-4">
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
                                                className="w-full rounded-lg border-0 bg-white/10 px-3 py-2 text-sm text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 transition cursor-pointer hover:bg-white/20"
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
                                                className="w-full rounded-lg border-0 bg-white/10 px-3 py-2 text-sm text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 transition cursor-pointer hover:bg-white/20"
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
                                        <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 md:pt-4">
                                            <span className="text-sm font-medium text-blue-100">
                                                Status Akademik
                                            </span>
                                            <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                                                {mahasiswa?.status || "Aktif"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search & Header Table */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                            <div className="w-full md:w-auto">
                                <OsSearchBar
                                    search={search}
                                    setSearch={(val) =>
                                        handleFilterChange("search", val)
                                    }
                                    placeholder="Cari nama ujian"
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-1 items-center text-gray-600 mt-2 md:mt-0">
                                <Table2 size={16} />
                                <h2 className="font-semibold text-sm md:text-lg">
                                    Daftar Nilai
                                </h2>
                                <span className="text-xs text-gray-400">
                                    ({totalItems})
                                </span>
                            </div>
                        </div>

                        {/* --- PERBAIKAN 2: TABEL DATA --- */}
                        <div className="bg-white p-0 md:p-5 border border-os-primary-mhs overflow-hidden rounded-xl shadow-sm">
                            {/* Wrapper Table dengan overflow-x-auto */}
                            <div className="w-full overflow-x-auto pb-2">
                                {/* UBAH DI SINI:
                                    Ganti min-w-[900px] menjadi min-w-max.
                                    Ini akan membuat container menyesuaikan lebar sesuai isi (kolom),
                                    jadi tidak akan ada ruang kosong berlebih di kanan.
                                */}
                                <div className="min-w-max">
                                    <OsTableHeader
                                        columns={columns}
                                        variant="mahasiswa"
                                    />
                                    <div className="mt-2">
                                        {tableData.length > 0 ? (
                                            <OsTableBody
                                                data={tableData}
                                                columns={columns}
                                                variant="mahasiswa"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center text-gray-400">
                                                <FileText className="h-8 w-8 text-gray-300" />
                                                <p className="text-sm">
                                                    Data ujian tidak ditemukan.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex justify-center md:justify-end">
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

                <div className="hidden md:block">
                    <OsCopyright variant="mahasiswa" />
                </div>
            </main>
        </div>
    );
}
