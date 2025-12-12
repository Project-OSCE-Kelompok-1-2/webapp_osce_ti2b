import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Search, Edit3, ExternalLink } from "lucide-react"; // [FIX] Tambah ExternalLink

import Sidebar from "../../components/Sidebar";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";
import SubmitConfirmationModal from "../../components/SubmitConfirmationModal";

export default function EditNilaiForm() {
    const { osce_detail, mahasiswa_list } = usePage().props;

    const safeOsceInfo = osce_detail || {
        nama_osce: "-",
        nama_stase: "-",
        durasi_per_mahasiswa: "-",
        total_mahasiswa: 0,
        nama_penguji: "-",
        waktu_per_rubrik: "-", // Tambahan default
    };

    const safeStudents = mahasiswa_list || [];

    const [search, setSearch] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredStudents = safeStudents.filter(
        (mhs) =>
            (mhs.nama || "").toLowerCase().includes(search.toLowerCase()) ||
            (mhs.nim || "").includes(search)
    );

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleConfirmSubmit = () => {
        setIsModalOpen(false);
        router.visit("/penguji/dashboard");
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                type="penguji"
                onToggle={toggleSidebar}
            />

            <main className="grid w-full p-4 md:p-8 h-fit grid-cols-1 gap-6 md:ml-20 transition-all duration-300">
                <OsHeader
                    variant="goback"
                    backLink="/penguji/dashboard"
                    onMenuClick={toggleSidebar}
                />

                {/* DETAIL OSCE */}
                <div className="w-full rounded-xl overflow-hidden border border-black mb-6 shadow-sm bg-white">
                    <div className="bg-[#3177C8] text-white text-center py-6">
                        <h1 className="text-2xl font-bold mb-1">Detail OSCE</h1>
                        <p className="text-sm opacity-90">
                            {safeOsceInfo.nama_osce}
                        </p>
                    </div>

                    {/* [FIX] Struktur Grid yang Benar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                        {/* Item 1: Nama Stase */}
                        <div className="flex flex-col justify-between p-2">
                            <div>
                                <span className="text-xs text-gray-600 block mb-1">
                                    Nama Stase
                                </span>
                                <span className="text-sm font-bold block">
                                    {safeOsceInfo.nama_stase}
                                </span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 mt-2" />
                        </div>

                        {/* Item 2: Durasi */}
                        <div className="flex flex-col justify-between p-2">
                            <div>
                                <span className="text-xs text-gray-600 block mb-1">
                                    Durasi per mahasiswa
                                </span>
                                <span className="text-sm font-bold block">
                                    {safeOsceInfo.durasi_per_mahasiswa} Menit
                                </span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 mt-2" />
                        </div>

                        {/* Item 3: Waktu Per Rubrik */}
                        <div className="p-2">
                            <span className="text-xs text-gray-600 block mb-1">
                                Waktu Per Rubrik
                            </span>
                            <div className="font-bold text-sm">
                                {safeOsceInfo.waktu_per_rubrik || "-"}
                            </div>
                        </div>

                        {/* Item 4: Enrollment */}
                        <div className="p-2">
                            <span className="text-xs text-gray-600 block mb-1">
                                Enrollment
                            </span>
                            <div className="font-bold text-sm">
                                {safeOsceInfo.total_mahasiswa} Mahasiswa
                            </div>
                        </div>
                    </div>

                    {/* Penguji Info (Footer Card) */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <span className="text-xs text-gray-600 block mb-1">
                            Penguji
                        </span>
                        <div className="font-bold text-gray-800">
                            {safeOsceInfo.nama_penguji}
                        </div>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Cari nama mahasiswa atau NIM..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-xl border border-black mb-8 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-black">
                                    <th className="py-4 px-6 text-center font-semibold text-gray-700 w-16">
                                        No
                                    </th>
                                    <th className="py-4 px-6 text-left font-semibold text-gray-700">
                                        Nama Mahasiswa
                                    </th>
                                    <th className="py-4 px-6 text-center font-semibold text-gray-700">
                                        NIM
                                    </th>
                                    <th className="py-4 px-6 text-center font-semibold text-gray-700">
                                        Nilai
                                    </th>
                                    <th className="py-4 px-6 text-center font-semibold text-gray-700">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((mhs, index) => (
                                        <tr
                                            key={
                                                mhs.id_enrollment_osce || index
                                            }
                                            className="hover:bg-blue-50 transition-colors"
                                        >
                                            <td className="py-4 px-6 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-gray-900">
                                                {mhs.nama}
                                            </td>
                                            <td className="py-4 px-6 text-center text-gray-600 font-mono text-sm">
                                                {mhs.nim}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {mhs.nilai_total ? (
                                                    <span className="font-bold text-blue-600">
                                                        {mhs.nilai_total}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <Link
                                                    href={`/penguji/penilaian/${mhs.id_enrollment_osce}/edit`}
                                                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                                                    title="Edit Nilai"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-12 text-center text-gray-500"
                                        >
                                            Data mahasiswa tidak ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="bg-white p-6 border-t border-black flex justify-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#1447E6] hover:bg-blue-800 text-white w-full md:w-1/2 py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95"
                        >
                            SELESAI EDIT
                        </button>
                    </div>
                </div>

                <div className="mt-4">
                    <OsCopyright />
                </div>
            </main>

            <SubmitConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSubmit}
            />
        </div>
    );
}
