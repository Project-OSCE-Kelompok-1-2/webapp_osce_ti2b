import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar"; 
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";

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
                            ? "bg-black border-black"
                            : "bg-white border-gray-400"
                    }
                `}
            >
                {selected && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
            </div>
        </div>
    );
};

export default function ViewNilaiDetail() {
    // 1. AMBIL DATA DARI PROPS BACKEND
    const {
        mahasiswa,
        rubrik_terisi = [],
        total_nilai_aspek = 0,
        feedback = "",
        info_ujian, // Data ID dari controller untuk navigasi
    } = usePage().props;

    console.log("DEBUG INFO UJIAN:", info_ujian);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    // 2. FUNGSI NAVIGASI KEMBALI (Dipanggil oleh Header)
    const handleBackToRekap = () => {
        if (info_ujian?.id_osce && info_ujian?.id_osce_stase) {
            // Arahkan ke URL halaman Rekap Mahasiswa
            router.get(`/penguji/osce/${info_ujian.id_osce}/stase/${info_ujian.id_osce_stase}/rekap`);
        } else {
            // Fallback aman
            window.history.back();
        }
    };

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar 
                isOpen={isSidebarOpen} 
                onToggle={handleSidebarToggle} 
                type="penguji" 
            />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* 1. Header dengan Tombol Back Custom */}
                <OsHeader
                    className="fixed"
                    variant="goback" 
                    title="OSCE / Detail OSCE / Penilaian Stase / Lihat Penilaian"
                    icon={<ArrowLeft className="w-5 h-5" />} 
                    backLink={`/penguji/osce/${info_ujian.id_osce}/stase/${info_ujian.id_osce_stase}/rekap`}
                    
                    // Hamburger menu tetap aktif
                    onMenuClick={handleSidebarToggle} 
                />

                <div className="flex-1 overflow-auto">
                    
                    {/* 2. Info Mahasiswa */}
                    <div className="flex items-center p-4 border border-black rounded-xl mb-6 bg-white shadow-sm">
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
                    <h2 className="text-xl font-bold text-black mb-4">
                        Penilaian Stase
                    </h2>

                    {/* 4. Tabel Penilaian */}
                    <div className="border border-black rounded-xl overflow-hidden mb-6 shadow-sm">
                        <div className="flex border-b border-black bg-gray-50 text-sm font-bold text-gray-900">
                            <div className="w-16 p-3 text-center border-r border-black">No</div>
                            <div className="flex-1 p-3 border-r border-black">Aspek Penilaian</div>
                            <div className="w-64 p-3 text-center border-r border-black">Skor</div>
                            <div className="w-32 p-3 text-center border-r border-black">Bobot</div>
                            <div className="w-32 p-3 text-center">Nilai</div>
                        </div>

                        {rubrik_terisi.map((kategori, index) => (
                            <div key={index}>
                                <div className="p-3 font-bold text-sm bg-blue-50 border-b border-black text-blue-900">
                                    {kategori.aspek}
                                </div>
                                {kategori.kompetensi.map((item, idx) => (
                                    <div
                                        key={item.id_poin_aspek_penilaian}
                                        className={`flex border-b border-black ${
                                            idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                                        }`}
                                    >
                                        <div className="w-16 p-3 text-center border-r border-black flex items-center justify-center font-medium">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 p-3 border-r border-black flex items-center text-sm leading-snug">
                                            {item.deskripsi}
                                        </div>
                                        <div className="w-64 p-3 border-r border-black flex items-center justify-center">
                                            {[0, 1, 2, 3, 4].map((score) => (
                                                <ScoreCircle
                                                    key={score}
                                                    value={score}
                                                    selected={Math.round(item.skor) === score}
                                                />
                                            ))}
                                        </div>
                                        <div className="w-32 p-3 border-r border-black flex items-center justify-center text-sm">
                                            {item.bobot}
                                        </div>
                                        <div className="w-32 p-3 flex items-center justify-center font-bold text-blue-800">
                                            {Number(item.nilai_kompetensi).toFixed(2).replace(/\.00$/, "")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div className="flex bg-gray-800 text-white font-bold">
                            <div className="flex-1 p-4 border-r border-gray-600 text-right pr-6">
                                TOTAL NILAI AKHIR
                            </div>
                            <div className="w-32 p-4 text-center text-lg">
                                {Number(total_nilai_aspek).toFixed(2)}
                            </div>
                        </div>
                    </div>

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
                <OsCopyright />
            </main>
        </div>
    );
}