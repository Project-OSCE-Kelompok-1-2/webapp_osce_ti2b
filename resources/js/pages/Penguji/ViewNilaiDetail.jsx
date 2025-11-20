import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

// --- Import Komponen ---
import SidebarUniversal from "../../components/SidebarUniversal";
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
                className={`w-5 h-5 rounded-full border border-black flex items-center justify-center
                    ${selected ? "bg-black" : "bg-white"}
                `}
            >
                {/* Indikator titik putih jika terpilih */}
                {selected && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
            </div>
        </div>
    );
};

export default function ViewNilaiDetail() {
    // 1. AMBIL DATA DARI PROPS BACKEND (ViewNilaiController)
    const {
        mahasiswa,
        rubrik_terisi = [],
        total_nilai_aspek = 0,
        feedback = "",
    } = usePage().props;

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <SidebarUniversal />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* 1. Header */}
                <OsHeader
                    className="fixed"
                    title="OSCE / Detail OSCE / Penilaian Stase / Lihat Penilaian"
                    icon={<ArrowLeft className="w-5 h-5" />}
                    // Opsional: Tambahkan fungsi back jika diperlukan
                    // onBack={() => window.history.back()}
                />

                <div className="flex-1 overflow-auto">
                    {/* 2. Info Mahasiswa */}
                    <div className="flex items-center p-4 border border-black rounded-xl mb-6">
                        <div className="w-16 h-16 bg-[#3C2F2F] rounded-full mr-6 flex-shrink-0"></div>
                        <div className="flex flex-col space-y-1 text-sm">
                            <div>
                                <span className="font-bold">Nama :</span>{" "}
                                {mahasiswa?.nama || "-"}
                            </div>
                            <div>
                                <span className="font-bold">NIM:</span>{" "}
                                {mahasiswa?.nim || "-"}
                            </div>
                            <div>
                                <span className="font-bold">Jurusan :</span>{" "}
                                {mahasiswa?.jurusan || "-"}
                            </div>
                        </div>
                    </div>

                    {/* 3. Judul Penilaian */}
                    <h2 className="text-xl text-black mb-4">Penilaian Stase</h2>

                    {/* 4. Tabel Penilaian */}
                    <div className="border border-black rounded-xl overflow-hidden mb-6">
                        {/* Header Tabel */}
                        <div className="flex border-b border-black bg-white text-sm font-medium">
                            <div className="w-16 p-3 text-center border-r border-black">
                                No
                            </div>
                            <div className="flex-1 p-3 border-r border-black">
                                Aspek Penilaian
                            </div>
                            <div className="w-64 p-3 text-center border-r border-black">
                                Skor
                            </div>
                            <div className="w-32 p-3 text-center border-r border-black">
                                Bobot
                            </div>
                            <div className="w-32 p-3 text-center">Nilai</div>
                        </div>

                        {/* Body Tabel (Looping Kategori/Aspek) */}
                        {rubrik_terisi.map((kategori, index) => (
                            <div key={index}>
                                {/* Judul Kategori (Backend: 'aspek') */}
                                <div className="p-3 font-bold text-sm bg-white border-b border-black">
                                    {kategori.aspek}
                                </div>

                                {/* Looping Items (Backend: 'kompetensi') */}
                                {kategori.kompetensi.map((item, idx) => (
                                    <div
                                        key={item.id_poin_aspek_penilaian}
                                        className={`flex border-b border-black bg-${
                                            idx % 2 === 0 ? "gray-200" : "white"
                                        }`}
                                    >
                                        <div className="w-16 p-3 text-center border-r border-black flex items-center justify-center text-lg">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 p-3 border-r border-black flex items-center">
                                            {/* Backend: 'deskripsi' */}
                                            {item.deskripsi}
                                        </div>
                                        <div className="w-64 p-3 border-r border-black flex items-center justify-center">
                                            {/* Render 5 Lingkaran Skor (0-4) */}
                                            {[0, 1, 2, 3, 4].map((score) => (
                                                <ScoreCircle
                                                    key={score}
                                                    value={score}
                                                    // Pastikan perbandingan aman (Int vs String)
                                                    selected={
                                                        parseInt(item.skor) ===
                                                        score
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <div className="w-32 p-3 border-r border-black flex items-center justify-center">
                                            {item.bobot}
                                        </div>
                                        <div className="w-32 p-3 flex items-center justify-center font-bold">
                                            {/* Backend: 'nilai_kompetensi' */}
                                            {item.nilai_kompetensi}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* Footer Total Nilai */}
                        <div className="flex bg-white font-bold">
                            <div className="flex-1 p-3 border-r border-black">
                                Total nilai aspek penilaian
                            </div>
                            <div className="w-32 p-3 text-center">
                                {typeof total_nilai_aspek === "number"
                                    ? total_nilai_aspek.toFixed(2)
                                    : total_nilai_aspek}
                            </div>
                        </div>
                    </div>

                    {/* 5. Feedback */}
                    <div className="mb-6">
                        <h3 className="text-lg text-black mb-2">Feedback</h3>
                        <div className="border border-black rounded-xl p-4 text-gray-600 text-sm leading-relaxed min-h-[150px]">
                            {feedback || (
                                <span className="italic text-gray-400">
                                    Tidak ada feedback yang diberikan.
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
