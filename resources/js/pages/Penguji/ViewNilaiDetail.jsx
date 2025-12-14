import React, { useState, useMemo } from "react";
import { usePage, router } from "@inertiajs/react";
<<<<<<< HEAD
import { User, FileText, Bookmark, ArrowLeft } from "lucide-react";
=======
import { ArrowLeft, User, FileText, Bookmark } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsHeader from "../../components/Header";
>>>>>>> b99cbdf5119d6f6819250036891771487935335d
import OsCopyright from "../../components/Copyright";

// Import Komponen
import Sidebar from "../../components/Sidebar";
import OsTableHeader from "../../components/tableheader";
import OsHeader from "../../components/Header";

// Header Tabel Rubrik (Sama persis dengan EditNilaiForm)
const rubrikColumns = [
    { content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        content: "Aspek Penilaian",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Skor",
        width: "w-[260px]",
        classes: "justify-center items-center px-4",
    },
    {
        content: "Bobot",
        width: "w-20",
        classes: "justify-center items-center px-4",
    },
    {
        content: "Nilai",
        width: "w-24",
        classes: "justify-center items-center px-4",
    },
];

export default function ViewNilaiDetail() {
    // 1. AMBIL DATA DARI PROPS BACKEND
    const {
        mahasiswa,
        rubrik_terisi = [],
        total_nilai_aspek = 0,
        feedback = "",
        info_ujian,
    } = usePage().props;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

<<<<<<< HEAD
    // Helper untuk menghitung nilai per baris (Read Only)
    const hitungNilai = (skor, bobot) => {
        if (skor === undefined) return 0;
        return skor * bobot;
    };

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            {/* SIDEBAR */}
=======
    // 2. FUNGSI NAVIGASI KEMBALI (Dipanggil oleh Header)
    const handleBackToRekap = () => {
        if (info_ujian?.id_osce && info_ujian?.id_osce_stase) {
            // Arahkan ke URL halaman Rekap Mahasiswa
            router.get(
                `/penguji/osce/${info_ujian.id_osce}/stase/${info_ujian.id_osce_stase}/rekap`
            );
        } else {
            // Fallback aman
            window.history.back();
        }
    };

    return (
        <div className="relative bg-orange-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
>>>>>>> b99cbdf5119d6f6819250036891771487935335d
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={handleSidebarToggle}
                type="penguji"
            />

            {/* MAIN CONTENT */}
            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                {/* HEADER */}
                <OsHeader
                    onMenuClick={handleSidebarToggle}
                    variant="goback"
                    backLink={`/penguji/osce/${info_ujian?.id_osce}/stase/${info_ujian?.id_osce_stase}/rekap`}
                    title="Detail Penilaian"
                />

<<<<<<< HEAD
                <div className="flex-1 overflow-auto pb-8 p-1">
                    {/* INFO MAHASISWA */}
=======
                <div className="flex-1 overflow-auto">
>>>>>>> b99cbdf5119d6f6819250036891771487935335d
                    <div className="flex gap-1 items-center justify-start my-2 text-black">
                        <User size={18} />
                        <h2 className="font-semibold text-lg ">
                            Biodata Mahasiswa
                        </h2>
                    </div>
<<<<<<< HEAD
                    <div className="flex items-center gap-4 border border-os-primary-pj rounded-xl px-6 py-5 bg-gray-50 mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-400 bg-gray-200 flex items-center justify-center">
                            {/* Logic Foto / Inisial */}
                            {mahasiswa?.nama ? (
                                <span className="text-xl font-bold text-gray-600">
                                    {mahasiswa.nama.charAt(0)}
                                </span>
                            ) : (
                                <User size={32} className="text-gray-500" />
                            )}
=======
                    {/* 2. Info Mahasiswa */}
                    <div className="flex items-center p-4 border border-os-primary-pj rounded-xl mb-6 bg-white shadow-sm">
                        <div className="w-16 h-16 bg-gray-800 rounded-full mr-6 flex-shrink-0 flex items-center justify-center text-white font-bold text-xl">
                            {mahasiswa?.nama?.charAt(0) || "M"}
>>>>>>> b99cbdf5119d6f6819250036891771487935335d
                        </div>
                        <div>
                            <p className="font-semibold text-lg text-gray-900">
                                Nama: {mahasiswa?.nama || "-"}
                            </p>
                            <p className="text-sm text-orange-700 font-mono">
                                NIM : {mahasiswa?.nim || "-"}
                            </p>
                            <p className="text-sm text-orange-700">
                                Jurusan : {mahasiswa?.jurusan || "-"}
                            </p>
                        </div>
                    </div>
                    {/* JUDUL RUBRIK */}
                    <div className="flex gap-1 items-center justify-start my-2 text-black">
                        <FileText size={18} />
                        <h2 className="font-semibold text-lg ">
                            Hasil Penilaian Stase
                        </h2>
                    </div>
                    {/* ================= DESKTOP VIEW ================= */}
                    <div className="hidden bg-white lg:block border rounded-xl p-4 border-os-primary-pj shadow-sm">
                        <OsTableHeader
                            columns={rubrikColumns}
                            variant="penguji"
                        />

<<<<<<< HEAD
                        <div className="overflow-y-auto max-h-[450px]">
                            {rubrik_terisi.map((group, gIndex) => (
                                <React.Fragment key={gIndex}>
                                    <div className="bg-orange-50 border rounded-lg text-orange-900 border-os-primary-pj my-2 px-4 py-2 font-semibold border-t">
                                        {group.aspek}
                                    </div>

                                    {group.kompetensi.map((poin, index) => (
                                        <div
                                            key={
                                                poin.id_poin_aspek_penilaian ||
                                                index
                                            }
                                            className="flex items-center min-h-[70px] border-t bg-white"
                                        >
                                            <div className="w-16 text-center">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 px-4 border-l py-2">
                                                {poin.deskripsi}
                                            </div>

                                            {/* TAMPILAN SKOR (READ ONLY) */}
                                            <div className="w-[260px] border-l flex flex-col items-center py-2">
                                                <div className="flex justify-between w-full px-6 mb-1 text-[12px]">
                                                    {[0, 1, 2, 3, 4].map(
                                                        (v) => (
                                                            <span
                                                                key={v}
                                                                className="w-5 text-center"
                                                            >
                                                                {v}
                                                            </span>
                                                        )
                                                    )}
                                                </div>

                                                <div className="flex justify-between w-full px-6">
                                                    {[0, 1, 2, 3, 4].map(
                                                        (v) => {
                                                            // Cek apakah skor ini yang dipilih
                                                            // Karena struktur data props ViewNilaiDetail agak beda (langsung .skor di dalam poin),
                                                            // kita sesuaikan logic selected-nya:
                                                            const isSelected =
                                                                Math.round(
                                                                    poin.skor
                                                                ) === v;

                                                            return (
                                                                <div
                                                                    className="border border-black rounded-full"
                                                                    key={v}
                                                                >
                                                                    <div
                                                                        className={`w-5 h-5 p-[3px] rounded-full !border-2 !border-black bg-white flex items-center justify-center transition-all cursor-default
                                                                        ${
                                                                            isSelected
                                                                                ? "border-black border-2 bg-white"
                                                                                : "border-gray-300 opacity-40" // Opacity biar kelihatan disabled
                                                                        }`}
                                                                    >
                                                                        {isSelected && (
                                                                            <span className="w-full h-full rounded-full bg-os-primary-pj" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-20 text-center border-l">
                                                {poin.bobot}
                                            </div>
                                            <div className="w-20 text-center border-l font-bold">
                                                {Number(
                                                    poin.nilai_kompetensi ||
                                                        hitungNilai(
                                                            poin.skor,
                                                            poin.bobot
                                                        )
                                                ).toFixed(0)}
                                            </div>
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="flex justify-between px-4 pr-8 py-3 border-t font-semibold bg-gray-50 rounded-b-xl mt-4">
                            <span>Total Nilai Akhir</span>
                            <span>{Number(total_nilai_aspek).toFixed(2)}</span>
                        </div>
                    </div>
                    {/* ================= MOBILE / TABLET VIEW ================= */}
                    <div className="lg:hidden space-y-3">
                        {rubrik_terisi.map((group, gIndex) => (
                            <React.Fragment key={gIndex}>
                                <div className="bg-gray-100 px-4 py-2 font-semibold border rounded-lg">
                                    {group.aspek}
                                </div>

                                {group.kompetensi.map((poin, index) => (
                                    <div
                                        key={
                                            poin.id_poin_aspek_penilaian ||
                                            index
                                        }
                                        className="border rounded-xl p-4 bg-white space-y-3 shadow-sm"
                                    >
                                        <p className="text-sm text-gray-700 text-justify">
                                            <span className="font-bold mr-1">
                                                {index + 1}.
                                            </span>{" "}
                                            {poin.deskripsi}
                                        </p>

                                        {/* SKOR MOBILE (READ ONLY) */}
                                        <div>
                                            <p className="text-xs mb-1 font-medium">
                                                Skor:
                                            </p>
                                            <div className="flex gap-3 pointer-events-none">
                                                {" "}
                                                {/* pointer-events-none agar tidak bisa diklik */}
                                                {[0, 1, 2, 3, 4].map((v) => {
                                                    const isSelected =
                                                        Math.round(
                                                            poin.skor
                                                        ) === v;
                                                    return (
                                                        <div
                                                            key={v}
                                                            className={`w-12 sm:w-14 aspect-square rounded-full border flex items-center justify-center text-lg transition-all
                                                                ${
                                                                    isSelected
                                                                        ? "border-black border-2 bg-white text-black font-bold"
                                                                        : "border-gray-200 text-gray-400 bg-gray-50"
                                                                }`}
                                                        >
                                                            {v}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="text-sm">
                                            <span className="font-medium">
                                                Bobot:{" "}
                                            </span>
                                            {poin.bobot}
                                        </div>

                                        <div className="text-sm font-semibold">
                                            Nilai:{" "}
                                            {Number(
                                                poin.nilai_kompetensi ||
                                                    hitungNilai(
                                                        poin.skor,
                                                        poin.bobot
                                                    )
                                            ).toFixed(0)}
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}

                        <div className="w-full px-4 py-3 border rounded-xl font-semibold bg-gray-50 shadow-sm">
                            Total Nilai Akhir:{" "}
                            {Number(total_nilai_aspek).toFixed(2)}
                        </div>
                    </div>
                    {/* FEEDBACK SECTION */}
                    <div className="flex gap-1 items-center justify-start my-2 mt-8 text-black">
                        <Bookmark size={18} />
                        <h2 className="font-semibold text-lg ">
                            Feedback / Catatan Penguji
                        </h2>
=======
                    {/* 3. Judul Penilaian */}
                    {/* <h2 className="text-xl font-bold text-black mb-4">
                        Penilaian Stase
                    </h2> */}
                    <div className="flex gap-1 items-center justify-start my-2 text-black">
                        <FileText size={18} />
                        <h2 className="font-semibold text-lg ">
                            Penilaian Stase
                        </h2>
                    </div>

                    {/* 4. Tabel Penilaian */}
                    <div className="p-4 rounded-xl bg-white border border-os-primary-pj">
                        <div className="border border-black rounded-xl overflow-hidden mb-2 shadow-sm">
                            <div className="flex border-b border-black bg-gray-50 text-sm font-bold text-gray-900">
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
                                <div className="w-32 p-3 text-center">
                                    Nilai
                                </div>
                            </div>

                            {rubrik_terisi.map((kategori, index) => (
                                <div key={index}>
                                    <div className="p-3 font-bold text-sm bg-orange-50 border-b border-black text-orange-900">
                                        {kategori.aspek}
                                    </div>
                                    {kategori.kompetensi.map((item, idx) => (
                                        <div
                                            key={item.id_poin_aspek_penilaian}
                                            className={`flex border-b border-black ${
                                                idx % 2 === 0
                                                    ? "bg-gray-100"
                                                    : "bg-white"
                                            }`}
                                        >
                                            <div className="w-16 p-3 text-center border-r border-black flex items-center justify-center font-medium">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 p-3 border-r border-black flex items-center text-sm leading-snug">
                                                {item.deskripsi}
                                            </div>
                                            <div className="w-64 p-3 border-r border-black flex items-center justify-center">
                                                {[0, 1, 2, 3, 4].map(
                                                    (score) => (
                                                        <ScoreCircle
                                                            key={score}
                                                            value={score}
                                                            selected={
                                                                Math.round(
                                                                    item.skor
                                                                ) === score
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <div className="w-32 p-3 border-r border-black flex items-center justify-center text-sm">
                                                {item.bobot}
                                            </div>
                                            <div className="w-32 p-3 flex items-center justify-center font-bold text-orange-600">
                                                {Number(item.nilai_kompetensi)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
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
                    </div>

                    {/* 5. Feedback */}
                    <div className="mb-6">
                        {/* <h3 className="text-lg font-bold text-black mb-2">
                            Feedback Penguji
                        </h3> */}
                        <div className="flex gap-1 items-center justify-start my-2 mt-4 text-black">
                            <Bookmark size={18} />
                            <h2 className="font-semibold text-lg ">Feedback</h2>
                        </div>
                        <div className="border border-black rounded-xl p-4 bg-white text-gray-700 text-sm leading-relaxed min-h-[100px]">
                            {feedback ? (
                                feedback
                            ) : (
                                <span className="italic text-gray-400">
                                    Tidak ada catatan feedback.
                                </span>
                            )}
                        </div>
>>>>>>> b99cbdf5119d6f6819250036891771487935335d
                    </div>
                    <div className="w-full border border-os-primary-pj rounded-xl p-4 min-h-[100px] shadow-sm text-gray-700 bg-gray-50 italic">
                        {feedback ? (
                            feedback
                        ) : (
                            <span className="text-gray-400">
                                Tidak ada catatan feedback.
                            </span>
                        )}
                    </div>
                    <div className="h-12"></div> {/* Spacer bawah */}
                </div>

                <div>
                    <OsCopyright variant="penguji" />
                </div>
<<<<<<< HEAD
=======
                <OsCopyright variant="penguji" />
>>>>>>> b99cbdf5119d6f6819250036891771487935335d
            </main>
        </div>
    );
}
