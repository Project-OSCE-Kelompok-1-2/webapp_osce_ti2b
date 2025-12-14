import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft, User, Bookmark } from "lucide-react";

// --- Import Komponen ---
import SidebarUniversal from "../../components/Sidebar";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";
import Sidebar from "../../components/Sidebar";

// --- Komponen Internal: Lingkaran Skor (0-4) ---
const ScoreCircle = ({ value, selected }) => {
    return (
        <div className="flex flex-col items-center mx-1">
            <span className="text-xs font-medium text-gray-600 mb-1">
                {value}
            </span>
            <div
                className={`w-5 h-5 rounded-full border border-black flex items-center justify-center transition-all
                    ${
                        selected
                            ? "bg-white border-black"
                            : "bg-white border-gray-400"
                    }
                `}
            >
                {/* Indikator titik putih jika terpilih */}
                {selected && (
                    <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                )}
            </div>
        </div>
    );
};

export default function ViewNilaiDetail() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };
    // 1. AMBIL DATA DARI PROPS BACKEND
    const {
        mahasiswa,
        rubrik_terisi = [],
        total_nilai_aspek = 0,
        feedback = "",
    } = usePage().props;

    return (
        <div className="relative bg-orange-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* <SidebarUniversal /> */}
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={handleSidebarToggle}
                type={"penguji"}
            />

            <main className="w-full p-os-8 min-h-screen flex flex-col justify-between gap-os-14 transition-all duration-300 md:ml-20">
                <div className="flex flex-col gap-os-8">
                    {/* 1. Header */}
                    <OsHeader
                        className="fixed"
                        title="OSCE / Detail OSCE / Penilaian Stase / Lihat Penilaian"
                        icon={<ArrowLeft className="w-5 h-5" />}
                        // Gunakan window.history.back() atau Link ke route sebelumnya
                        variant="goback"
                        backLink="#"
                        onBack={() => window.history.back()}
                    />

                    <div className="flex gap-1 items-center justify-start text-orange-800">
                        <User size={18} />
                        <h2 className="font-semibold text-lg ">
                            Biodata Mahasiswa
                        </h2>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {/* 2. Info Mahasiswa */}
                        <div className="flex items-center p-4 border border-os-primary-pj rounded-xl mb-6 bg-white shadow-sm">
                            {/* Placeholder Foto */}
                            <div className="w-16 h-16 bg-gray-800 rounded-full mr-6 flex-shrink-0 flex items-center justify-center text-white font-bold text-xl">
                                {mahasiswa?.nama?.charAt(0) || "M"}
                            </div>
                            <div className="flex flex-col space-y-1 text-sm text-gray-800">
                                <div>
                                    <span className="font-bold">Nama :</span>{" "}
                                    {mahasiswa?.nama || "-"}
                                </div>
                                <div>
                                    <span className="font-bold">NIM :</span>{" "}
                                    {mahasiswa?.nim || "-"}
                                </div>
                                <div>
                                    <span className="font-bold">Jurusan :</span>{" "}
                                    {mahasiswa?.jurusan || "-"}
                                </div>
                            </div>
                        </div>

                        {/* 3. Judul Penilaian */}
                        {/* <h2 className="text-xl font-bold text-black mb-4">
                            Penilaian Stase
                        </h2> */}
                        <div className="flex gap-1 my-2 items-center justify-start text-orange-800">
                            <Bookmark size={18} />
                            <h2 className="font-semibold text-lg ">
                                Penilaian Stase
                            </h2>
                        </div>

                        <section className="bg-white p-5 border clip border-os-primary-pj overflow-x-auto rounded-xl shadow-sm">
                            <div className="border border-black overflow-clip rounded-xl mb-6 shadow-sm">
                                {/* Header Tabel */}
                                <div className="flex border-b border-black bg-gray-50 text-sm font-bold text-gray-900">
                                    <div className="w-16 shrink-0 p-3 text-center border-r border-black">
                                        No
                                    </div>
                                    <div className="flex-1 shrink-0 p-3 border-r border-black">
                                        Aspek Penilaian
                                    </div>
                                    <div className="w-64 p-3 shrink-0 text-center border-r border-black">
                                        Skor
                                    </div>
                                    <div className="w-32 p-3 shrink-0 text-center border-r border-black">
                                        Bobot
                                    </div>
                                    <div className="w-32 p-3 shrink-0 text-center">
                                        Nilai
                                    </div>
                                </div>

                                {/* Body Tabel (Looping Kategori/Aspek) */}
                                {rubrik_terisi.map((kategori, index) => (
                                    <div key={index}>
                                        {/* Judul Kategori */}
                                        <div className="p-3 font-bold shrink-0 text-sm bg-orange-50 border-b border-black text-orange-900">
                                            {kategori.aspek}
                                        </div>

                                        {/* Looping Items (Kompetensi) */}
                                        {kategori.kompetensi.map(
                                            (item, idx) => (
                                                <div
                                                    key={
                                                        item.id_poin_aspek_penilaian
                                                    }
                                                    // FIX: Tailwind Class Logic (Gunakan string penuh)
                                                    className={`flex border-b border-black ${
                                                        idx % 2 === 0
                                                            ? "bg-gray-100"
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    <div className="w-16 p-3 shrink-0 text-center border-r border-black flex items-center justify-center font-medium">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 p-3  shrink-0 border-r border-black flex items-center text-sm leading-snug">
                                                        {item.deskripsi}
                                                    </div>

                                                    {/* Bagian Skor (Lingkaran) */}
                                                    <div className="w-64 p-3 border-r shrink-0 border-black flex items-center justify-center">
                                                        {[0, 1, 2, 3, 4].map(
                                                            (score) => (
                                                                <ScoreCircle
                                                                    key={score}
                                                                    value={
                                                                        score
                                                                    }
                                                                    // Pastikan parsing aman (int comparison)
                                                                    selected={
                                                                        Math.round(
                                                                            item.skor
                                                                        ) ===
                                                                        score
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>

                                                    <div className="w-32 p-3 border-r shrink-0 border-black flex items-center justify-center text-sm">
                                                        {item.bobot}
                                                    </div>
                                                    <div className="w-32 p-3 shrink-0 flex items-center justify-center font-bold text-orange-800">
                                                        {/* Format angka desimal jika perlu */}
                                                        {Number(
                                                            item.nilai_kompetensi
                                                        )
                                                            .toFixed(2)
                                                            .replace(
                                                                /\.00$/,
                                                                ""
                                                            )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ))}

                                {/* Footer Total Nilai */}
                                <div className="flex bg-gray-800 text-white font-bold">
                                    <div className="flex-1 p-4 border-r border-gray-600 text-right pr-6">
                                        TOTAL NILAI AKHIR
                                    </div>
                                    <div className="w-32 p-4 text-center text-lg">
                                        {Number(total_nilai_aspek).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* 4. Tabel Penilaian */}

                        {/* 5. Feedback */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-black mb-2">
                                Feedback Penguji
                            </h3>
                            <div className="border border-black rounded-xl p-4 bg-white text-gray-700 text-sm leading-relaxed min-h-[100px]">
                                {feedback ? (
                                    feedback
                                ) : (
                                    <span className="italic text-gray-400">
                                        Tidak ada catatan feedback.
                                    </span>
                                )}
                            </div>
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
