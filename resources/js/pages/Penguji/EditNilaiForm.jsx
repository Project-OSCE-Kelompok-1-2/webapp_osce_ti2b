import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { ArrowLeft, Search, Edit3, ExternalLink } from "lucide-react";

// --- Import Komponen ---
import SidebarUniversal from "../../components/SidebarUniversal";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";
import SubmitConfirmationModal from "../../components/SubmitConfirmationModal";
import Sidebar from "../../components/Sidebar";

export default function EditNilaiForm() {
    // 1. AMBIL DATA DARI PROPS (Backend Bintang)
    // Backend mengirim props: 'osce_detail' dan 'mahasiswa_list'
    const { osce_detail, mahasiswa_list } = usePage().props;

    // Fallback jika data kosong (biar tidak crash)
    const safeOsceInfo = osce_detail || {
        nama_osce: "-",
        nama_stase: "-",
        waktu_per_rubrik: "-",
        total_mahasiswa: 0,
        nama_penguji: "-",
    };

    const safeStudents = mahasiswa_list || [];

    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 2. FILTER CLIENT-SIDE (Opsional, bisa juga server-side)
    const filteredStudents = safeStudents.filter(
        (mhs) =>
            (mhs.nama || "").toLowerCase().includes(search.toLowerCase()) ||
            (mhs.nim || "").includes(search)
    );

    // --- HANDLERS ---
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleConfirmSubmit = () => {
        // Logic Submit Final Rekap (Jika ada)
        // Untuk saat ini hanya tutup modal dan redirect ke dashboard
        setIsModalOpen(false);
        router.visit("/penguji/dashboard");
    };

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* <SidebarUniversal /> */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} type={'penguji'}/>

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* Header */}
                <OsHeader
                    className="fixed"
                    title={`OSCE / ${safeOsceInfo.nama_osce} / Edit Nilai`}
                    icon={<ArrowLeft className="w-5 h-5" />}
                    // Opsional: onBack={() => window.history.back()}
                />

                <div className="flex-1 overflow-auto">
                    {/* 2. Header Biru Besar (Detail OSCE) */}
                    <div className="w-full rounded-xl overflow-hidden border border-black mb-6 shadow-sm">
                        <div className="bg-[#3177C8] text-white text-center py-6">
                            <h1 className="text-2xl font-bold mb-1">
                                Detail OSCE
                            </h1>
                            <p className="text-sm opacity-90">
                                {safeOsceInfo.nama_osce}
                            </p>
                        </div>
                        <div className="bg-white p-6">
                            <div className="flex flex-col lg:flex-row border border-gray-400 rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-gray-400">
                                {/* Stasiun (Static/Dummy karena backend belum kirim nomor stasiun, bisa request backend nanti) */}
                                <div className="p-4 flex flex-col w-full lg:w-auto min-w-[120px]">
                                    <span className="text-xs text-gray-600 mb-2">
                                        Stasiun
                                    </span>
                                    <div className="bg-[#3177C8] text-white w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-md">
                                        01
                                    </div>
                                </div>

                                {/* Rubrik / Stase */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <span className="text-xs text-gray-600 block mb-1">
                                            Rubrik
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
                                            Waktu per rubrik
                                        </span>
                                        <span className="text-sm font-bold block">
                                            {safeOsceInfo.waktu_per_rubrik}
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

                    {/* 3. Navigasi & Search */}
                    <div className="mb-4">
                        <p className="text-sm font-medium">Navigasi</p>
                    </div>

                    <div className="flex gap-4 mb-4">
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

                    <div className="mb-2">
                        <span className="text-sm font-medium">
                            Mahasiswa{" "}
                            <span className="text-gray-400 mx-1">|</span>{" "}
                            menampilkan {filteredStudents.length} Mahasiswa
                        </span>
                    </div>

                    <div className="h-px w-full bg-gray-300 mb-4"></div>

                    {/* 6. Tabel Mahasiswa */}
                    <div className="overflow-x-auto rounded-xl border border-black mb-8">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-black">
                                    <th className="py-4 px-6 text-center font-medium text-sm border-r border-gray-400 w-16">
                                        No
                                    </th>
                                    <th className="py-4 px-6 font-medium text-sm border-r border-gray-400 w-[30%] text-center">
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
                                        key={mhs.id_enrollment_osce || index}
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
                                            {/* Jika nilai null, tampilkan strip */}
                                            {mhs.nilai_total !== null
                                                ? mhs.nilai_total
                                                : "-"}
                                        </td>
                                        <td className="py-6 px-6 text-center">
                                            <div className="flex justify-center">
                                                {/* Tombol Edit mengarah ke form edit (Najwa) */}
                                                <Link
                                                    href={`/penguji/penilaian/${mhs.id_enrollment_osce}/edit`}
                                                    className="bg-[#1447E6] text-white p-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                                                    title="Edit Nilai"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </Link>
                                            </div>
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

                        {/* --- TOMBOL SUBMIT BESAR (MODAL TRIGGER) --- */}
                        <div className="bg-white p-4 border-t border-black flex justify-center">
                            <button
                                onClick={handleOpenModal}
                                className="bg-[#1447E6] text-white w-1/2 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-md"
                            >
                                SELESAI EDIT
                            </button>
                        </div>
                    </div>
                </div>
                <OsCopyright />
            </main>

            {/* --- KOMPONEN MODAL --- */}
            <SubmitConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSubmit}
            />
        </div>
    );
}
