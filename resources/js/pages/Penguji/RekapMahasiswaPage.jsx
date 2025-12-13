import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft, Download, Search, ExternalLink } from "lucide-react";

// --- Import Komponen ---
import SidebarUniversal from "../../components/SidebarUniversal";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";
import Sidebar from "../../components/Sidebar";

export default function RekapMahasiswaPage() {
    // 1. AMBIL PROPS DARI BACKEND (Bintang)
    // Backend mengirim: 'osce_detail' dan 'mahasiswa_list'
    const { osce_detail, mahasiswa_list } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fallback agar tidak crash jika data kosong
    const safeOsceInfo = osce_detail || {
        nama_osce: "-",
        nama_stase: "-",
        durasi_per_mahasiswa: "-",
        total_mahasiswa: 0,
        nama_penguji: "-",
    };

    const safeStudents = mahasiswa_list || [];

    const [search, setSearch] = useState("");

    // 2. FILTER CLIENT-SIDE
    const filteredStudents = safeStudents.filter(
        (mhs) =>
            (mhs.nama || "").toLowerCase().includes(search.toLowerCase()) ||
            (mhs.nim || "").includes(search)
    );

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* <SidebarUniversal /> */}
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                type={"penguji"}
            />

            <main className="w-full p-os-8 min-h-screen flex flex-col justify-between gap-os-14 transition-all duration-300 md:ml-20">
                <div className="flex flex-col gap-os-14">
                    {/* 1. Header */}
                    <OsHeader
                        className="fixed"
                        title={`OSCE / ${safeOsceInfo.nama_osce} / Rekap Nilai`}
                        icon={<ArrowLeft className="w-5 h-5" />}
                        // Opsional: onBack={() => window.history.back()}
                    />

                    <div className="flex-1 overflow-auto">
                        {/* 2. Header Biru Besar (Detail OSCE) */}
                        <div className="w-full rounded-xl overflow-hidden border border-black mb-6 shadow-sm">
                            {/* Header Biru */}
                            <div className="bg-[#3177C8] text-white text-center py-6">
                                <h1 className="text-2xl font-bold mb-1">
                                    Detail OSCE
                                </h1>
                                <p className="text-sm opacity-90">
                                    {safeOsceInfo.nama_osce}
                                </p>
                            </div>

                            {/* Info Grid */}
                            <div className="bg-white p-6">
                                <div className="flex flex-col lg:flex-row border border-gray-400 rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-gray-400">
                                    {/* Stasiun (Dummy static karena backend belum kirim) */}
                                    <div className="p-4 flex flex-col w-full lg:w-auto min-w-[120px]">
                                        <span className="text-xs text-gray-600 mb-2">
                                            Stasiun
                                        </span>
                                        <div className="bg-[#3177C8] text-white w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-md">
                                            01
                                        </div>
                                    </div>

                                    {/* Rubrik */}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className="text-xs text-gray-600 block mb-1">
                                                Nama Stase
                                            </span>
                                            <span className="text-sm font-bold block">
                                                {safeOsceInfo.nama_stase}
                                            </span>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 mt-4" />
                                    </div>

                                    {/* Waktu */}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className="text-xs text-gray-600 block mb-1">
                                                Durasi per mahasiswa
                                            </span>
                                            <span className="text-sm font-bold block">
                                                {
                                                    safeOsceInfo.durasi_per_mahasiswa
                                                }
                                            </span>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 mt-4" />
                                    </div>

                                    {/* Enrollment */}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className="text-xs text-gray-600 block mb-1">
                                                Enrollment Mahasiswa
                                            </span>
                                            <span className="text-sm font-bold block">
                                                {safeOsceInfo.total_mahasiswa}{" "}
                                                Mahasiswa
                                            </span>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 mt-4" />
                                    </div>

                                    {/* Penguji */}
                                    <div className="p-4 flex-[1.5] flex flex-col justify-between">
                                        <div>
                                            <span className="text-xs text-gray-600 block mb-1">
                                                Penguji
                                            </span>
                                            <span className="text-sm font-bold block">
                                                {safeOsceInfo.nama_penguji}
                                            </span>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 mt-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Navigasi Download */}
                        <div className="mb-6">
                            <p className="text-sm font-medium mb-2">Navigasi</p>
                            <button className="flex items-center bg-[#1447E6] text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-medium shadow-sm">
                                <Download className="w-4 h-4 mr-2" />
                                Unduh Rekap Nilai
                            </button>
                        </div>

                        {/* 4. Search Bar */}
                        <div className="flex gap-4 mb-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-900" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari nama mahasiswa"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-400 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button className="bg-[#1447E6] text-white px-12 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                                Cari
                            </button>
                        </div>

                        {/* 5. Info Count */}
                        <div className="mb-2">
                            <span className="text-sm font-medium">
                                Mahasiswa{" "}
                                <span className="text-gray-400 mx-1">|</span>{" "}
                                menampilkan {filteredStudents.length} Mahasiswa
                            </span>
                        </div>

                        {/* Divider Line */}
                        <div className="h-px w-full bg-gray-300 mb-4"></div>

                        {/* 6. Tabel Mahasiswa */}
                        <div className="overflow-x-auto rounded-xl border border-black mb-10">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-black">
                                        <th className="py-4 px-6 text-center font-medium text-sm border-r border-gray-400 w-16">
                                            No
                                        </th>
                                        <th className="py-4 px-6 font-medium text-sm border-r border-gray-400 w-[30%]">
                                            Nama Mahasiswa
                                        </th>
                                        <th className="py-4 px-6 font-medium text-sm text-center border-r border-gray-400 w-[25%]">
                                            NIM
                                        </th>
                                        <th className="py-4 px-6 font-medium text-sm text-center border-r border-gray-400 w-[15%]">
                                            Nilai
                                        </th>
                                        <th className="py-4 px-6 font-medium text-sm text-center w-[20%]">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((mhs, index) => (
                                        <tr
                                            key={
                                                mhs.id_enrollment_osce || index
                                            }
                                            className={`border-b border-gray-300 last:border-b-0 ${
                                                index % 2 === 1
                                                    ? "bg-gray-300"
                                                    : "bg-white"
                                            }`}
                                        >
                                            <td className="py-6 px-6 text-center text-xl border-r border-gray-400">
                                                {index + 1}
                                            </td>
                                            <td className="py-6 px-6 font-bold text-gray-900 border-r border-gray-400">
                                                {mhs.nama}
                                            </td>
                                            <td className="py-6 px-6 text-center text-gray-700 border-r border-gray-400">
                                                {mhs.nim}
                                            </td>
                                            <td className="py-6 px-6 text-center text-gray-700 border-r border-gray-400">
                                                {/* Jika nilai null, tampilkan pesan Belum Dinilai */}
                                                {mhs.nilai_total !== null ? (
                                                    mhs.nilai_total
                                                ) : (
                                                    <span className="text-red-500 italic text-xs">
                                                        Belum Dinilai
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-6 px-6 text-center">
                                                <Link
                                                    href={`/penguji/penilaian/${mhs.id_enrollment_osce}/view`}
                                                    className="inline-block bg-[#1447E6] text-white text-xs font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    Lihat Penilaian
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="py-8 text-center text-gray-500 italic"
                                            >
                                                Data mahasiswa tidak ditemukan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
