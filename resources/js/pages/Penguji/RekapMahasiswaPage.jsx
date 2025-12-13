import React, { useState, useMemo } from "react"; // Tambahkan useMemo
import { Link, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    Download,
    Search,
    ExternalLink,
    FileText,
    User,
    Clock,
    UserCheck,
    Table2,
    Info,
} from "lucide-react";

// --- Import Komponen ---
import SidebarUniversal from "../../components/SidebarUniversal";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";
import Sidebar from "../../components/Sidebar";
import OsButton from "../../components/button.jsx";
import OsSearchBar from "../../components/searchbar";
import OsTableHeader from "../../components/tableheader";
import OsTableBody from "../../components/tablecontain.jsx";
import OsPagination from "../../components/pagination.jsx"; // [V] Import Pagination

// 1. Definisikan Struktur Kolom
const columns = [
    {
        content: "No",
        width: "w-16 shrink-0",
        classes: "justify-center items-center",
        key: "no",
    },
    {
        content: "Nama Mahasiswa",
        width: "w-[500px] flex-1 shrink-0",
        classes: "justify-start items-center px-4",
        key: "nama",
    },
    {
        content: "NIM",
        width: "w-32 shrink-0",
        classes: "justify-center items-center",
        key: "nim",
    },
    {
        content: "Nilai",
        width: "w-32 shrink-0",
        classes: "justify-center items-center",
        key: "nilai",
    },
    {
        content: "Aksi",
        width: "shrink-0 min-w-[200px]",
        classes: "justify-center items-center",
        key: "action",
    },
];

// --- LOGIC PAGINATION UTILITY ---
// Fungsi bantuan untuk membuat tautan pagination ala Laravel
const generatePaginationLinks = (currentPage, totalPages, totalItems) => {
    if (totalPages <= 1) return [];

    const links = [];

    // Tombol Previous
    links.push({
        url: "#",
        label: "Previous",
        active: false,
        pageNumber: currentPage > 1 ? currentPage - 1 : null,
    });

    // Tautan Angka Halaman
    const maxVisiblePages = 5; // Jumlah maksimal tombol angka yang terlihat (misal: 1, 2, 3, 4, 5)
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
        links.push({ url: "#", label: "1", active: false, pageNumber: 1 });
        if (startPage > 2) {
            links.push({ url: null, label: "...", active: false });
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        links.push({
            url: "#",
            label: String(i),
            active: i === currentPage,
            pageNumber: i,
        });
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            links.push({ url: null, label: "...", active: false });
        }
        links.push({
            url: "#",
            label: String(totalPages),
            active: false,
            pageNumber: totalPages,
        });
    }

    // Tombol Next
    links.push({
        url: "#",
        label: "Next",
        active: false,
        pageNumber: currentPage < totalPages ? currentPage + 1 : null,
    });

    // Menyesuaikan url null untuk tombol panah
    links[0].url = links[0].pageNumber === null ? null : "#";
    links[links.length - 1].url =
        links[links.length - 1].pageNumber === null ? null : "#";

    return links;
};
// --- END LOGIC PAGINATION UTILITY ---

export default function RekapMahasiswaPage() {
    // 1. AMBIL PROPS DARI BACKEND
    const { osce_detail, mahasiswa_list } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Fallback agar tidak crash jika data kosong
    const safeOsceInfo = osce_detail || {
        nama_osce: "-",
        nama_stase: "-",
        durasi_per_mahasiswa: "-",
        total_mahasiswa: 0,
        nama_penguji: "-",
    };

    const safeStudents = mahasiswa_list || [];

    // --- LOGIC CLIENT-SIDE PAGINATION ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Definisikan jumlah data per halaman

    // 2. FILTER CLIENT-SIDE (Menggunakan useMemo agar filtering hanya berjalan saat search/safeStudents berubah)
    const filteredStudents = useMemo(() => {
        // Reset halaman ke 1 setiap kali filter berubah
        setCurrentPage(1);
        return safeStudents.filter(
            (mhs) =>
                (mhs.nama || "").toLowerCase().includes(search.toLowerCase()) ||
                (mhs.nim || "").includes(search)
        );
    }, [safeStudents, search]);

    // 3. HITUNG NILAI PAGINATION
    const totalItems = filteredStudents.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // 4. DATA YANG AKAN DITAMPILKAN
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    // 5. GENERATE LINKS UNTUK KOMPONEN PAGINATION
    const paginationLinks = generatePaginationLinks(
        currentPage,
        totalPages,
        totalItems
    );

    // 6. HANDLER PERPINDAHAN HALAMAN
    const handlePageChange = (pageNumber) => {
        // Pastikan pageNumber adalah angka valid
        if (
            typeof pageNumber === "number" &&
            pageNumber >= 1 &&
            pageNumber <= totalPages
        ) {
            setCurrentPage(pageNumber);
        } else if (pageNumber === "Previous" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (pageNumber === "Next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // --- END LOGIC CLIENT-SIDE PAGINATION ---

    // --- BARU: Logic Handle Download ---
    const handleDownload = (type) => {
        const osceId = safeOsceInfo.id_osce;
        const osceStaseId = safeOsceInfo.id_osce_stase; // Ambil ID Stase

        if (!osceId || !osceStaseId) {
            alert("ID OSCE atau ID OSCE Stase tidak ditemukan.");
            return;
        }

        const queryParams = new URLSearchParams({
            search: search,
        }).toString();

        // UBAH URL INI AGAR SESUAI DENGAN ROUTE LARAVEL:
        // Route Laravel: /osce/{id_osce}/stase/{id_osce_stase}/export/{type}
        const downloadUrl = `/penguji/osce/${osceId}/stase/${osceStaseId}/export/${type}?${queryParams}`;

        // Redirect window location untuk memicu download browser
        window.location.href = downloadUrl;
    };
    // 7. MAPPING DATA UNTUK OsTableBody (Menggunakan data yang sudah dipaginasi)
    const tableData = paginatedStudents.map((mhs, index) => ({
        // Index dihitung berdasarkan urutan global, bukan hanya di halaman ini
        no: startIndex + index + 1,
        nama: mhs.nama,
        nim: mhs.nim,
        nilai:
            mhs.nilai_total !== null ? (
                mhs.nilai_total
            ) : (
                <span className="text-red-500 italic text-xs">
                    Belum Dinilai
                </span>
            ),
        action: (
            <OsButton
                name="primary-pj"
                // Mengganti 'router.get' dengan Link atau memastikan 'router' diimpor
                onClick={() =>
                    // Mengganti router.get karena 'router' belum didefinisikan di sini.
                    // Idealnya, Anda menggunakan Inertia.get atau link Inertia.
                    // Untuk sementara, kita pakai window.location (hanya jika memang harus ada aksi)
                    (window.location.href = `/penguji/penilaian/${mhs.id_enrollment_osce}/view`)
                }
                className="flex items-center justify-center gap-2 bg-[#1447E6] text-white text-xs font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition "
            >
                <Info size={18} />
                Lihat Penilaian
            </OsButton>
        ),
    }));

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="relative bg-orange-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={handleSidebarToggle}
                type={"penguji"}
            />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 lg:ml-20">
                {/* 1. Header */}
                <OsHeader
                    className="fixed"
                    title={`OSCE / ${safeOsceInfo.nama_osce} / Rekap Nilai`}
                    icon={<ArrowLeft className="w-5 h-5" />}
                    variant="penguji"
                    onMenuClick={handleSidebarToggle}
                />

                <div className="flex-1 overflow-auto">
                    {/* 2. Header Biru Besar (Detail OSCE) - KODE TETAP SAMA */}
                    <div className="w-full rounded-xl overflow-hidden border border-orange-600 mb-4 shadow-sm">
                        {/* Header Biru */}
                        <div className="bg-os-primary-pj-dark text-white text-center py-6">
                            <h1 className="text-2xl font-bold mb-1">
                                Detail OSCE
                            </h1>
                            <p className="text-sm opacity-90">
                                {safeOsceInfo.nama_osce}
                            </p>
                        </div>

                        {/* Info Grid */}
                        <div className="bg-white p-4">
                            <div className="flex flex-col lg:flex-row border border-gray-400 rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-gray-400">
                                {/* Stasiun */}
                                <div className="p-4 flex flex-col w-full lg:w-auto min-w-[120px]">
                                    <span className="text-xs text-gray-600 mb-2">
                                        Stasiun
                                    </span>
                                    <div className="bg-os-secondary-pj text-white w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-md">
                                        01
                                    </div>
                                </div>

                                {/* Rubrik */}
                                <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                    <div>
                                        <span className="text-xs text-gray-600 block">
                                            Nama Stase
                                        </span>
                                        <span className="text-sm font-bold block">
                                            {safeOsceInfo.nama_stase}
                                        </span>
                                    </div>
                                    <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                        <FileText
                                            size={18}
                                            className="text-white"
                                        />
                                    </div>
                                </div>

                                {/* Waktu */}
                                <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                    <div>
                                        <span className="text-xs text-gray-600 block">
                                            Durasi per mahasiswa
                                        </span>
                                        <span className="text-sm font-bold block">
                                            {safeOsceInfo.durasi_per_mahasiswa}
                                        </span>
                                    </div>
                                    <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                        <Clock
                                            size={18}
                                            className="text-white"
                                        />
                                    </div>
                                </div>

                                {/* Enrollment */}
                                <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                    <div>
                                        <span className="text-xs text-gray-600 block">
                                            Enrollment Mahasiswa
                                        </span>
                                        <span className="text-sm font-bold block">
                                            {safeOsceInfo.total_mahasiswa}{" "}
                                            Mahasiswa
                                        </span>
                                    </div>
                                    <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                        <User
                                            size={18}
                                            className="text-white"
                                        />
                                    </div>
                                </div>

                                {/* Penguji */}
                                <div className="p-4 flex-[1.5] flex flex-col-reverse justify-between">
                                    <div>
                                        <span className="text-xs text-gray-600 block">
                                            Penguji
                                        </span>
                                        <span className="text-sm font-bold block">
                                            {safeOsceInfo.nama_penguji}
                                        </span>
                                    </div>
                                    <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                        <UserCheck
                                            size={18}
                                            className="text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Navigasi Download */}
                    <div className="mb-4 flex gap-4">
                        <OsButton
                            name="primary-pj"
                            onClick={() => handleDownload("excel")}
                            className="text-sm font-medium shadow-sm px-4 py-2.5 flex items-center justify-start cursor-pointer hover:bg-green-600 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Unduh Rekap Nilai (Excel)
                        </OsButton>
                        <OsButton
                            name="primary-pj"
                            onClick={() => handleDownload("pdf")}
                            className="text-sm font-medium shadow-sm px-4 py-2.5 flex items-center justify-start cursor-pointer hover:bg-red-600 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Unduh Rekap Nilai (PDF)
                        </OsButton>
                    </div>

                    {/* 4. Search Bar */}
                    <div className="flex gap-4 mb-2">
                        <div className="relative flex-1">
                            <OsSearchBar
                                search={search}
                                setSearch={setSearch}
                                placeholder="Cari nama atau NIM mahasiswa secara instan..."
                                variant="penguji"
                            />
                        </div>
                    </div>

                    {/* 5. Info Count */}
                    <div className="flex gap-1 items-center justify-start my-2">
                        <Table2 size={18} />
                        <h2 className="font-semibold text-lg">
                            Tabel Mahasiswa{" "}
                        </h2>
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            {/* Menampilkan total dari data yang sudah difilter */}
                            (Total: {filteredStudents.length} data)
                        </span>
                    </div>

                    {/* Divider Line */}

                    {/* 6. Tabel Mahasiswa (Menggunakan Komponen Reusable) */}
                    <section className="bg-white p-5 border border-os-primary-pj overflow-x-auto rounded-xl shadow-sm">
                        <table className="min-w-full text-left border-collapse bg-white">
                            <OsTableHeader
                                variant="penguji"
                                columns={columns}
                                headerClass="py-4 px-6 text-sm font-medium text-gray-700 border-r border-gray-400"
                            />

                            {tableData.length > 0 ? (
                                <OsTableBody
                                    variant="penguji"
                                    data={tableData}
                                    columns={columns}
                                    rowClass={(index) =>
                                        `border-b border-gray-300 last:border-b-0 ${
                                            index % 2 === 1
                                                ? "bg-gray-200"
                                                : "bg-white"
                                        }`
                                    }
                                    cellClass={(key) =>
                                        `py-6 px-6 text-gray-700 text-sm ${
                                            key === "nama"
                                                ? "font-bold text-gray-900"
                                                : ""
                                        } ${
                                            key !== "action"
                                                ? "border-r border-gray-400"
                                                : ""
                                        }`
                                    }
                                />
                            ) : (
                                <tbody>
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="py-8 text-center text-gray-500 italic"
                                        >
                                            Data mahasiswa tidak ditemukan
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </section>

                    {/* 7. Pagination Component */}
                    {totalItems > itemsPerPage && (
                        <OsPagination
                            links={paginationLinks}
                            onPageChange={handlePageChange}
                            variant="penguji"
                        />
                    )}
                </div>
                <OsCopyright variant="penguji" />
            </main>
        </div>
    );
}
