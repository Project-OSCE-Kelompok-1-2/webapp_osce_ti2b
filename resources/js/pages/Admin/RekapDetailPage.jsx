import React, { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import {
    Download,
    User,
    BookOpen,
    AlertCircle,
    Award,
    Calendar,
} from "lucide-react";

// --- Import Komponen (Sesuai Path Project Anda) ---
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsTableHeader from "../../components/tableheader";
import OsTableBody from "../../components/tablecontain";

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

    // 2. State Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // 3. Konfigurasi Kolom Tabel
    const detailColumns = [
        {
            key: "no",
            content: "No",
            width: "w-14 shrink-0",
            classes:
                "justify-center items-center font-semibold text-gray-400 text-xs",
        },
        {
            key: "aspek_dinilai",
            content: "Aspek & Kompetensi",
            width: "flex-1",
            classes:
                "justify-start items-center px-6 text-left leading-relaxed",
        },
        {
            key: "skor",
            content: "Skor (0-4)",
            width: "w-24 shrink-0",
            classes: "justify-center items-center font-medium",
        },
        {
            key: "bobot",
            content: "Bobot",
            width: "w-20 shrink-0",
            classes: "justify-center items-center text-gray-500",
        },
        {
            key: "nilai",
            content: "Nilai Akhir",
            width: "w-28 shrink-0",
            classes:
                "justify-center items-center font-bold text-blue-700 bg-blue-50/50 h-full",
        },
    ];

    // 4. Helper & Handler
    const handleDownload = () => {
        if (!osce.id_osce) return alert("ID OSCE tidak ditemukan.");
        const url = `/admin/rekap-nilai/mahasiswa/${mahasiswa.id_mahasiswa}/osce/${osce.id_osce}/download`;
        window.open(url, "_blank");
    };

    const getLetter = (index) => String.fromCharCode(65 + index);

    return (
        // PERUBAHAN 1: Hapus 'overflow-hidden' agar scroll browser muncul
        <div className="relative bg-gray-50/80 w-full min-h-screen flex justify-start font-sans">
            <Head title={`Detail Nilai - ${mahasiswa.nama || "Mahasiswa"}`} />

            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            {/* PERUBAHAN 2: 
                - Hapus 'h-screen' (ganti min-h-screen)
                - Hapus 'grid' layout yang fix
                - Gunakan 'flex flex-col' agar footer terdorong ke bawah
            */}
            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    {/* Header */}
                    <div className="px-4 pt-4 lg:px-8 lg:pt-6">
                        <OsHeader
                            variant="goback"
                            backLink={`/admin/rekap-nilai/${osce.id_osce}/sesi/${id_sesi_kembali}/mahasiswa`}
                            onMenuClick={handleSidebarToggle}
                        />
                    </div>

                    {/* PERUBAHAN 3: Hapus 'overflow-y-auto' agar konten memanjang ke bawah */}
                    <div className="flex-1 px-4 lg:px-8 py-6">
                        {/* Judul & Deskripsi Page */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                                Detail Penilaian Mahasiswa
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Rincian lengkap performa mahasiswa per stase dan
                                kompetensi.
                            </p>
                        </div>

                        {/* --- INFO CARDS SECTION --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-10">
                            {/* Card Kiri: Identitas Mahasiswa */}
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

                            {/* Card Kanan: Total Score */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Award size={80} />
                                </div>

                                <div>
                                    <p className="text-gray-300 text-xs font-semibold uppercase tracking-widest mb-2">
                                        Total Nilai Akhir
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-extrabold tracking-tight">
                                            {parseFloat(nilai_total_osce || 0) *
                                                1}
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
                                    <Download size={16} />
                                    UNDUH LAPORAN PDF
                                </button>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-gray-200"></div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                Rincian Stase
                            </span>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>

                        {/* --- LOOPING STASE --- */}
                        <div className="space-y-10 pb-10">
                            {nilai_per_stase.length > 0 ? (
                                nilai_per_stase.map((stase, index) => {
                                    // Logic Flattening Data (Sama seperti sebelumnya)
                                    const tableData = [];
                                    const aspekList =
                                        stase.aspek_penilaian || [];

                                    aspekList.forEach((aspek, aIndex) => {
                                        // Header Aspek
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

                                        // Kompetensi
                                        (aspek.kompetensi || []).forEach(
                                            (komp, kIndex) => {
                                                tableData.push({
                                                    no: kIndex + 1,
                                                    aspek_dinilai: (
                                                        <span className="text-gray-600 text-sm font-medium pl-2 block leading-snug">
                                                            {komp.kompetensi}
                                                        </span>
                                                    ),
                                                    skor: (
                                                        <div
                                                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shadow-sm
                                                    ${
                                                        parseInt(komp.skor) ===
                                                        0
                                                            ? "bg-red-50 text-red-600 border border-red-100"
                                                            : parseInt(
                                                                  komp.skor
                                                              ) === 4
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
                                                        <span className="font-bold text-gray-900">
                                                            {parseFloat(
                                                                komp.nilai || 0
                                                            ).toFixed(0)}
                                                        </span>
                                                    ),
                                                });
                                            }
                                        );
                                    });

                                    return (
                                        <div
                                            key={index}
                                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden px-6"
                                        >
                                            {/* Header Card Stase */}
                                            <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-blue-200 shadow-md">
                                                        {index + 1}
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
                                                    <div className="text-2xl font-black text-gray-800">
                                                        {
                                                            +parseFloat(
                                                                stase.nilai_akhir_stase ||
                                                                    0
                                                            ).toFixed(2)
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Kontainer Tabel */}
                                            <div className="px-6 pyb-6">
                                                <div className="overflow-x-auto">
                                                    <div className="min-w-[700px]">
                                                        {/* Menggunakan Komponen Asli Anda */}
                                                        <OsTableHeader
                                                            columns={
                                                                detailColumns
                                                            }
                                                        />

                                                        {tableData.length >
                                                        0 ? (
                                                            <OsTableBody
                                                                data={tableData}
                                                                columns={
                                                                    detailColumns
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="py-12 text-center text-gray-400 text-sm italic bg-gray-50/50">
                                                                Data penilaian
                                                                tidak tersedia
                                                                untuk stase ini.
                                                            </div>
                                                        )}

                                                        {/* Footer Manual (Total Bobot) - Didesain menyatu */}
                                                        <div className="flex text-sm border-t border-gray-200 bg-gray-50 text-gray-800">
                                                            <div className="flex-1 py-3 px-6 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider flex items-center justify-end">
                                                                Jumlah Nilai
                                                                Bobot Tahap
                                                                Kerja
                                                            </div>
                                                            <div className="w-28 py-3 text-center border-l border-gray-200 font-bold text-blue-700 bg-blue-50/30 text-base">
                                                                {parseFloat(
                                                                    stase.total_skor_bobot ||
                                                                        0
                                                                ).toFixed(0)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                // Empty State
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
                    </div>
                </div>

                <div className="px-4 lg:px-8 pb-4">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
