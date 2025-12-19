import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { User, FileText, Bookmark } from "lucide-react";
import OsCopyright from "../../components/copyright";

import Sidebar from "../../components/Sidebar";
import OsTableHeader from "../../components/tableheader";
import OsHeader from "../../components/Header";

// Header Tabel Rubrik 
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
    const {
        mahasiswa,
        rubrik_terisi = [],
        total_nilai_aspek = 0,
        feedback = "",
        info_ujian,
    } = usePage().props;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    const hitungNilai = (skor, bobot) => {
        if (skor === undefined) return 0;
        return skor * bobot;
    };

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            {/* SIDEBAR */}
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={handleSidebarToggle}
                type="penguji"
            />

            {/* MAIN CONTENT */}
            <main className="w-full p-4 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                {/* HEADER */}
                <OsHeader
                    onMenuClick={handleSidebarToggle}
                    variant="goback"
                    role="penguji"
                    backLink={`/penguji/osce/${info_ujian?.id_osce}/stase/${info_ujian?.id_osce_stase}/rekap`}
                    title="Detail Penilaian"
                />

                <div className="flex-1 overflow-auto pb-8 p-1">
                    {/* INFO MAHASISWA */}
                    <div className="flex gap-1 items-center justify-start my-2 text-black">
                        <User size={18} />
                        <h2 className="font-semibold text-lg ">
                            Biodata Mahasiswa
                        </h2>
                    </div>
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
                                                                                : "border-gray-300 opacity-40"
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
                    {/* ================= MOBILE / TABLET VIEW (PERBAIKAN WARNA) ================= */}
                    <div className="lg:hidden space-y-3">
                        {rubrik_terisi.map((group, gIndex) => (
                            <React.Fragment key={gIndex}>
                                {/* PERBAIKAN 1: Header Aspek jadi Oranye (Sama seperti Edit Form) */}
                                <div className="bg-orange-50 text-orange-900 border-os-primary-pj border px-4 py-2 font-semibold rounded-lg">
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

                                        {/* SKOR MOBILE (READ ONLY TAPI STYLE SAMA) */}
                                        <div>
                                            <p className="text-xs mb-1 font-medium text-gray-500">
                                                Skor:
                                            </p>
                                            {/* Gunakan pointer-events-none agar tidak bisa diklik */}
                                            <div className="flex gap-2 sm:gap-3 justify-between sm:justify-start pointer-events-none">
                                                {[0, 1, 2, 3, 4].map((v) => {
                                                    const isSelected =
                                                        Math.round(
                                                            poin.skor
                                                        ) === v;
                                                    return (
                                                        <div
                                                            key={v}
                                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center text-sm sm:text-lg font-semibold transition-all duration-200
                                                            ${
                                                                isSelected
                                                                    ? "bg-orange-500 border-orange-600 text-white shadow-md transform scale-105" 
                                                                    : "bg-white border-gray-300 text-gray-600" 
                                                            }`}
                                                        >
                                                            {v}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-dashed">
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-500">
                                                    Bobot:{" "}
                                                </span>
                                                {poin.bobot}
                                            </div>

                                            <div className="text-sm font-bold text-orange-700">
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
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}

                        <div className="w-full px-4 py-3 border border-orange-200 rounded-xl font-semibold bg-orange-50 text-orange-900 flex justify-between items-center shadow-sm">
                            <span>Total Nilai Akhir:</span>
                            <span className="text-xl">
                                {Number(total_nilai_aspek).toFixed(2)}
                            </span>
                        </div>
                    </div>
                    {/* FEEDBACK SECTION */}
                    <div className="flex gap-1 items-center justify-start my-2 mt-8 text-black">
                        <Bookmark size={18} />
                        <h2 className="font-semibold text-lg ">
                            Feedback / Catatan Penguji
                        </h2>
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
            </main>
        </div>
    );
}
