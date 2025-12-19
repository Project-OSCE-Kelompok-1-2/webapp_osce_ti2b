import React, { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import {
    Download,
    User,
    BookOpen,
    AlertCircle,
    Award,
    FileText,
} from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/copyright.jsx";
import OsTableHeader from "../../components/tableheader";
import OsTableBody from "../../components/tablecontain";
import OsPagination from "../../components/pagination";

export default function RekapDetailPage() {
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
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* <Head title={`Detail Nilai - ${mahasiswa.nama || "Mahasiswa"}`} /> */}
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader
                        variant="goback"
                        backLink={`/admin/rekap-nilai/${osce.id_osce}/sesi/${id_sesi_kembali}/mahasiswa`}
                        onMenuClick={handleSidebarToggle}
                    />

                    <div className="flex-1 overflow-auto p-1">
                        {/* <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                                Detail Penilaian Mahasiswa
                            </h2> */}
                        <div className="flex gap-1 items-center justify-start my-2">
                            <FileText size={18} />
                            <h2 className="font-semibold text-lg">
                                Detail Penilaian Mahasiswa
                            </h2>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 mb-4">
                            Rincian lengkap performa mahasiswa per stase dan{" "}
                            <br />
                            kompetensi.
                        </p>

                        {/* Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 border border-os-primary gap-2 mb-4 p-4 bg-white rounded-xl">
                            <div className="lg:col-span-2 rounded-2xl max-w-[860px] w-full shadow-sm border-gray-100 relative overflow-hidden group flex items-center p-6">
                                {/* PERUBAHAN: Gunakan items-center untuk mobile agar di tengah, sm:items-center (row) untuk desktop */}
                                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center justify-center gap-4 sm:gap-6 w-full">
                                    {/* Avatar: Tetap di tengah */}
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-blue-200 shrink-0">
                                        {mahasiswa.nama
                                            ? mahasiswa.nama.charAt(0)
                                            : "M"}
                                    </div>

                                    {/* Info Text: Mobile Rata Tengah, Desktop Rata Kiri */}
                                    <div className="flex-1 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
                                        <h3 className="font-bold text-blue-950 text-xl mb-2 sm:mb-1 break-words">
                                            {mahasiswa.nama ||
                                                "Nama Tidak Diketahui"}
                                        </h3>

                                        {/* Badges Container: Mobile Justify Center, Desktop Justify Start */}
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-sm text-gray-600 w-full">
                                            {/* Badge NIM */}
                                            <div className="flex items-center gap-2 bg-blue-50 border-os-primary px-3 py-1.5 rounded-lg border border-gray-100">
                                                <User
                                                    size={16}
                                                    className="text-blue-500 shrink-0"
                                                />
                                                <span className="font-medium text-os-primary-dark">
                                                    {mahasiswa.nim || "-"}
                                                </span>
                                            </div>

                                            {/* Badge Nama OSCE */}
                                            <div className="flex items-center gap-2 bg-blue-50 border-os-primary px-2 py-1.5 rounded-lg border border-gray-100 max-w-full">
                                                <BookOpen
                                                    size={16}
                                                    className="text-blue-500 shrink-0"
                                                />
                                                {/* Text tetap rata kiri agar enak dibaca bersanding dengan icon */}
                                                <span className="font-medium text-os-primary-dark whitespace-normal text-left leading-tight break-words">
                                                    {osce.nama_osce ||
                                                        "Ujian OSCE"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className=" bg-blue-950 rounded-2xl p-6 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
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
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px flex-1 bg-gray-200"></div>
                            <div className="text-xs font-semibold text-blue-700 uppercase tracking-widest">
                                Rincian Stase (Hal {currentPage} dari{" "}
                                {totalPages})
                            </div>
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
                                            className="bg-white rounded-2xl shadow-sm border border-os-primary border-gray-200 overflow-hidden p-4 transition-all hover:shadow-md"
                                        >
                                            {/* Header Card Stase */}
                                            <div className=" border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-blue-600 text-white w-14 h-14 rounded-lg flex items-center justify-center font-bold text-[30px] shrink-0 shadow-blue-200 shadow-md">
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
                                            <div className="mt-4 overflow-x-auto">
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

                                                    <div className="flex text-sm justify-end border-t mt-2 border-gray-200 bg-gray-50 text-gray-800">
                                                        <div className="py-3 px-6 text-right font-semibold text-blue-950 text-xs uppercase tracking-wider flex items-center justify-end">
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
                            <div className=" flex justify-center">
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
