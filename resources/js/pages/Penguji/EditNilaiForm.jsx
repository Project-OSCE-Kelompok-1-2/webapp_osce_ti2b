import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Search, Edit3 } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";
import SubmitConfirmationModal from "../../components/SubmitConfirmationModal";

export default function EditNilaiForm() {
    const { osce_detail, mahasiswa_list } = usePage().props;

    // Fallback jika data kosong (biar tidak crash)
    const safeOsceInfo = osce_detail || {
        nama_osce: "-",
        nama_stase: "-",
        durasi_per_mahasiswa: "-",
        total_mahasiswa: 0,
        nama_penguji: "-",
    };

    const safeStudents = mahasiswa_list || [];

    const [search, setSearch] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredStudents = safeStudents.filter((mhs) =>
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
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12">
            <Sidebar isOpen={isSidebarOpen} type="penguji" onToggle={toggleSidebar} />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 gap-os-8 md:ml-20">
                <OsHeader variant="goback" backLink="#" onMenuClick={toggleSidebar} />

                {/* DETAIL OSCE */}
                <div className="w-full rounded-xl overflow-hidden border border-black mb-6 shadow-sm">
                    <div className="bg-[#3177C8] text-white text-center py-6">
                        <h1 className="text-2xl font-bold mb-1">Detail OSCE</h1>
                        <p className="text-sm opacity-90">{safeOsceInfo.nama_osce}</p>
                    </div>

                                {/* Rubrik / Stase */}
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
                                            {safeOsceInfo.durasi_per_mahasiswa}
                                        </span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 mt-4" />
                                </div>
                            </div>

                            <div className="p-4 flex-1">
                                <span className="text-xs text-gray-600">Rubrik</span>
                                <div className="font-bold">{safeOsceInfo.nama_stase}</div>
                            </div>

                            <div className="p-4 flex-1">
                                <span className="text-xs text-gray-600">Waktu Per Rubrik</span>
                                <div className="font-bold">{safeOsceInfo.waktu_per_rubrik}</div>
                            </div>

                            <div className="p-4 flex-1">
                                <span className="text-xs text-gray-600">Enrollment</span>
                                <div className="font-bold">
                                    {safeOsceInfo.total_mahasiswa} Mahasiswa
                                </div>
                            </div>

                            <div className="p-4 flex-1">
                                <span className="text-xs text-gray-600">Penguji</span>
                                <div className="font-bold">{safeOsceInfo.nama_penguji}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Cari nama mahasiswa"
                            className="w-full pl-10 pr-3 py-3 border border-gray-400 rounded-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto rounded-xl border border-black mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-black">
                                <th className="py-4 px-6 text-center">No</th>
                                <th className="py-4 px-6 text-center">Nama</th>
                                <th className="py-4 px-6 text-center">NIM</th>
                                <th className="py-4 px-6 text-center">Nilai</th>
                                <th className="py-4 px-6 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredStudents.map((mhs, index) => (
                                <tr key={mhs.id_enrollment_osce} className={index % 2 ? "bg-gray-200" : "bg-white"}>
                                    <td className="py-4 px-6 text-center">{index + 1}</td>
                                    <td className="py-4 px-6 text-center">{mhs.nama}</td>
                                    <td className="py-4 px-6 text-center">{mhs.nim}</td>
                                    <td className="py-4 px-6 text-center">{mhs.nilai_total ?? "-"}</td>
                                    <td className="py-4 px-6 text-center">
                                        <Link
                                            href={`/penguji/penilaian/${mhs.id_enrollment_osce}/edit`}
                                            className="bg-[#1447E6] text-white p-2 rounded-lg flex justify-center"
                                        >
                                            <Edit3 className="w-5 h-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">
                                        Data mahasiswa tidak ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* SUBMIT */}
                    <div className="bg-white p-4 border-t border-black flex justify-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#1447E6] text-white w-1/2 py-3 rounded-xl font-bold text-lg"
                        >
                            SELESAI EDIT
                        </button>
                    </div>
                </div>

                <OsCopyright />
            </main>

            <SubmitConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSubmit}
            />
        </div>
    );
}
