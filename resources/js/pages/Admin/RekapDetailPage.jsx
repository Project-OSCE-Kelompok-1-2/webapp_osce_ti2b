import React, { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import { Download, User, BookOpen, AlertCircle, Award } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";

// Import Table Components
import OsTableHeader from "../../components/tableheader";
import OsTableBody from "../../components/tablecontain";
import OsPagination from "../../components/pagination";

export default function RekapDetailPage() {
    // 1. Ambil Data dari Props
    const { detailNilai } = usePage().props;

    const {
        mahasiswa = {},
        osce = {},
        nilai_per_stase = [],
        nilai_total_osce = 0,
        id_sesi_kembali = "",
    } = detailNilai || {};

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // --- HELPER: FORMAT NILAI DINAMIS ---
    // Logika: Bulatkan ke 2 desimal string, lalu ubah balik ke Float agar .00 hilang
    const formatNilai = (val) => {
        const num = parseFloat(val || 0);
        return parseFloat(num.toFixed(2));
    };

    // --- PAGINATION LOGIC ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStaseData = nilai_per_stase.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math.ceil(nilai_per_stase.length / itemsPerPage);

    const generatePaginationLinks = () => {
        const links = [];
        links.push({
            label: "&laquo; Previous",
            url: currentPage > 1 ? "#prev" : null,
            active: false,
            pageNumber: currentPage - 1,
        });
        for (let i = 1; i <= totalPages; i++) {
            links.push({
                label: i.toString(),
                url: "#" + i,
                active: i === currentPage,
                pageNumber: i,
            });
        }
        links.push({
            label: "Next &raquo;",
            url: currentPage < totalPages ? "#next" : null,
            active: false,
            pageNumber: currentPage + 1,
        });
        return links;
    };

    const handlePageChange = (page) => {
        let targetPage = page;
        if (page === "&laquo; Previous") targetPage = currentPage - 1;
        if (page === "Next &raquo;") targetPage = currentPage + 1;
        if (targetPage >= 1 && targetPage <= totalPages) {
            setCurrentPage(Number(targetPage));
            window.scrollTo({ top: 100, behavior: "smooth" });
        }
    };

    // --- KONFIGURASI KOLOM ---
    const detailColumns = [
        {
            key: "no",
            content: "No",
            width: "w-14 shrink-0",
            classes: "justify-center items-center",
        },
        {
            key: "aspek_dinilai",
            content: "Aspek & Kompetensi",
            width: "flex-1",
            classes: "justify-start items-center px-6 text-left",
        },
        {
            key: "skor",
            content: "Skor (0-4)",
            width: "w-24 shrink-0",
            classes: "justify-center items-center",
        },
        {
            key: "bobot",
            content: "Bobot",
            width: "w-20 shrink-0",
            classes: "justify-center items-center",
        },
        {
            key: "nilai",
            content: "Nilai Akhir",
            width: "w-28 shrink-0",
            classes: "justify-center items-center h-full",
        },
    ];

    const handleDownload = () => {
        if (!osce.id_osce) return alert("ID OSCE tidak ditemukan.");
        const url = `/admin/rekap-nilai/mahasiswa/${mahasiswa.id_mahasiswa}/osce/${osce.id_osce}/download`;
        window.open(url, "_blank");
    };

    return (
        <div className="relative bg-gray-50/80 w-full min-h-screen flex justify-start font-sans">
            <Head title={`Detail Nilai - ${mahasiswa.nama || "Mahasiswa"}`} />
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <div className="px-4 pt-4 lg:px-8 lg:pt-6">
                        <OsHeader
                            variant="goback"
                            backLink={`/admin/rekap-nilai/${osce.id_osce}/sesi/${id_sesi_kembali}/mahasiswa`}
                            onMenuClick={handleSidebarToggle}
                        />
                    </div>

                    <div className="flex-1 px-4 lg:px-8 py-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                                Detail Penilaian Mahasiswa
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Rincian lengkap performa mahasiswa per stase dan
                                kompetensi.
                            </p>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-10">
                            <div className="lg:col-span-2 rounded-2xl max-w-[860px] w-full p-6 shadow-sm border border-gray-100 relative overflow-hidden group flex items-center">
                                <div className="absolute top-0 left-0 w-22 h-22 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 h-full flex justify-center "></div>
                                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-blue-200">
                                        {mahasiswa.nama
                                            ? mahasiswa.nama.charAt(0)
                                            : "M"}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-xl mb-1">
                                            {mahasiswa.nama ||
                                                "Nama Tidak Diketahui"}
                                        </h3>
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                <User
                                                    size={16}
                                                    className="text-blue-500"
                                                />
                                                <span className="font-medium">
                                                    {mahasiswa.nim || "-"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                <BookOpen
                                                    size={16}
                                                    className="text-blue-500"
                                                />
                                                <span>
                                                    {osce.nama_osce ||
                                                        "Ujian OSCE"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Award size={80} />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-xs font-semibold uppercase tracking-widest mb-2">
                                        Total Nilai Akhir
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        {/* PERUBAHAN: Gunakan formatNilai() */}
                                        <span className="text-5xl font-extrabold tracking-tight">
                                            {formatNilai(nilai_total_osce)}
                                        </span>
                                        <span className="text-lg text-gray-400 font-medium">
                                            / 100
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDownload}
                                    className="mt-4 w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all active:scale-95"
                                >
                                    <Download size={16} /> UNDUH LAPORAN PDF
                                </button>
                            </div>
                        </div>

                        {/* Navigasi Halaman */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-gray-200"></div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                Rincian Stase (Hal {currentPage} dari{" "}
                                {totalPages})
                            </span>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>

                        {/* Looping Stase */}
                        <div className="space-y-10 pb-4">
                            {currentStaseData.length > 0 ? (
                                currentStaseData.map((stase, index) => {
                                    const realIndex =
                                        (currentPage - 1) * itemsPerPage +
                                        index +
                                        1;
                                    const tableData = [];

                                    (stase.aspek_penilaian || []).forEach(
                                        (aspek) => {
                                            tableData.push({
                                                no: "",
                                                aspek_dinilai: (
                                                    <div className="py-2">
                                                        <span className="font-bold text-gray-800 ml-2 text-sm uppercase tracking-wide">
                                                            {aspek.aspek}
                                                        </span>
                                                    </div>
                                                ),
                                                skor: "",
                                                bobot: "",
                                                nilai: "",
                                            });
                                            (aspek.kompetensi || []).forEach(
                                                (komp, kIndex) => {
                                                    tableData.push({
                                                        no: (
                                                            <span className="text-gray-400 font-semibold text-xs">
                                                                {kIndex + 1}
                                                            </span>
                                                        ),
                                                        aspek_dinilai: (
                                                            <span className="text-gray-600 text-sm font-medium pl-2 block leading-snug">
                                                                {
                                                                    komp.kompetensi
                                                                }
                                                            </span>
                                                        ),
                                                        skor: (
                                                            <div
                                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shadow-sm ${
                                                                    parseInt(
                                                                        komp.skor
                                                                    ) === 0
                                                                        ? "bg-red-50 text-red-600 border border-red-100"
                                                                        : parseInt(
                                                                              komp.skor
                                                                          ) ===
                                                                          4
                                                                        ? "bg-green-50 text-green-600 border border-green-100"
                                                                        : "bg-white border border-gray-200 text-gray-700"
                                                                }`}
                                                            >
                                                                {komp.skor}
                                                            </div>
                                                        ),
                                                        bobot: (
                                                            <span className="text-gray-500 font-mono">
                                                                {komp.bobot}
                                                            </span>
                                                        ),
                                                        // PERUBAHAN: Gunakan formatNilai() untuk baris tabel
                                                        nilai: (
                                                            <span className="font-bold text-blue-700">
                                                                {formatNilai(
                                                                    komp.nilai
                                                                )}
                                                            </span>
                                                        ),
                                                    });
                                                }
                                            );
                                        }
                                    );

                                    return (
                                        <div
                                            key={index}
                                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden px-6 transition-all hover:shadow-md"
                                        >
                                            {/* Header Card Stase */}
                                            <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-blue-200 shadow-md">
                                                        {realIndex}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-lg">
                                                            {stase.nama_stase}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                            <User size={14} />
                                                            <span>
                                                                Penguji:{" "}
                                                                <span className="font-semibold text-gray-700">
                                                                    {stase.nama_penguji ||
                                                                        "-"}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                                                        Nilai Akhir Stase
                                                    </span>
                                                    {/* PERUBAHAN: Gunakan formatNilai() untuk header stase */}
                                                    <div className="text-2xl font-black text-gray-800">
                                                        {formatNilai(
                                                            stase.nilai_akhir_stase
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Table */}
                                            <div className="px-6 py-6 overflow-x-auto">
                                                <div className="min-w-[700px]">
                                                    <OsTableHeader
                                                        columns={detailColumns}
                                                        variant="admin"
                                                    />

                                                    {tableData.length > 0 ? (
                                                        <OsTableBody
                                                            data={tableData}
                                                            columns={
                                                                detailColumns
                                                            }
                                                        />
                                                    ) : (
                                                        <div className="py-12 text-center text-gray-400 text-sm italic bg-gray-50/50">
                                                            Data penilaian tidak
                                                            tersedia.
                                                        </div>
                                                    )}

                                                    <div className="flex text-sm border-t border-gray-200 bg-gray-50 text-gray-800">
                                                        <div className="flex-1 py-3 px-6 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider flex items-center justify-end">
                                                            Jumlah Nilai Bobot
                                                            Tahap Kerja
                                                        </div>
                                                        {/* PERUBAHAN: Gunakan formatNilai() untuk footer tabel */}
                                                        <div className="w-28 py-3 text-center border-l border-gray-200 font-bold text-blue-700 bg-blue-50/30 text-base">
                                                            {formatNilai(
                                                                stase.total_skor_bobot
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl py-20 bg-gray-50/50">
                                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                        <AlertCircle
                                            className="text-gray-400"
                                            size={40}
                                        />
                                    </div>
                                    <h3 className="text-gray-900 font-bold text-lg">
                                        Belum ada penilaian
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Data nilai mahasiswa belum tersedia saat
                                        ini.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {nilai_per_stase.length > itemsPerPage && (
                            <div className="mt-8 flex justify-center">
                                <OsPagination
                                    links={generatePaginationLinks()}
                                    onPageChange={handlePageChange}
                                    variant="admin"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-4 lg:px-8 pb-4">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
