import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import OsTableHeader from "../../components/tableheader";

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
        width: "w-20",
        classes: "justify-center items-center px-4",
    },
];

export default function LivePenilaian() {
    const { enrollment, rubrik = [], sisa_waktu_detik = 420 } = usePage().props;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [waktu, setWaktu] = useState(sisa_waktu_detik || 420); // 7 menit
    const [nilaiMap, setNilaiMap] = useState({});

    // Fallback rubrik kalau dari server belum ada
    const fallbackRubrik = [
        {
            nama_grup: "A. Persiapan",
            poin: [
                { id: 1, label: "Verifikasi", bobot: 3, highlight: false },
                { id: 2, label: "Menyiapkan Alat", bobot: 3, highlight: true },
                { id: 3, label: "Cuci Tangan 6 Langkah", bobot: 3, highlight: false },
            ],
        },
        {
            nama_grup: "B. Orientasi",
            poin: [{ id: 4, label: "Verifikasi", bobot: 3, highlight: false }],
        },
        {
            nama_grup: "C. Pelaksanaan",
            poin: [{ id: 5, label: "Cuci Tangan 6 Langkah", bobot: 3, highlight: false }],
        },
        {
            nama_grup: "D. Terminasi",
            poin: [{ id: 6, label: "Cuci Tangan 6 Langkah", bobot: 3, highlight: false }],
        },
        {
            nama_grup: "E. Dokumentasi",
            poin: [{ id: 7, label: "Cuci Tangan 6 Langkah", bobot: 3, highlight: false }],
        },
    ];

    const dataRubrik = rubrik.length ? rubrik : fallbackRubrik;

    // TIMER 7 MENIT
    useEffect(() => {
        if (waktu <= 0) return;
        const timer = setInterval(() => {
            setWaktu((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [waktu]);

    // Format waktu: HH:MM:SS
    const formatWaktu = () => {
        const h = Math.floor(waktu / 3600);
        const m = Math.floor((waktu % 3600) / 60);
        const s = waktu % 60;

        return `${String(h).padStart(2, "0")}:${String(m).padStart(
            2,
            "0"
        )}:${String(s).padStart(2, "0")}`;
    };

    const handleSkorChange = (poinId, skor) => {
        setNilaiMap((prev) => ({ ...prev, [poinId]: skor }));
    };

    // Nilai per poin = skor * bobot
    const hitungNilai = (skor, bobot) => {
        if (skor === undefined) return 0;
        return skor * bobot;
    };

    // Total semua nilai, dibagi 5 (A–E)
    const totalNilaiMentah = dataRubrik.reduce((total, group) => {
        return (
            total +
            group.poin.reduce((sum, p) => {
                return sum + hitungNilai(nilaiMap[p.id], p.bobot);
            }, 0)
        );
    }, 0);

    const totalNilai = totalNilaiMentah / 5;

    const handleSubmit = (e) => {
        e.preventDefault();

        const nilai = Object.entries(nilaiMap).map(([id_poin, skor]) => ({
            id_poin_aspek_penilaian: Number(id_poin),
            skor,
        }));

        router.post(`/penguji/penilaian/${enrollment?.id ?? 0}`, {
            nilai,
            feedback,
        });
    };

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            <Sidebar onToggle={setSidebarOpen} />

            <main
                className={`grid w-full grid-cols-1 grid-rows-[auto_1fr_auto] transition-all duration-300 ${
                    sidebarOpen ? "ml-0" : "ml-20"
                }`}
            >
                {/* HEADER */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-300">
                    <button
                        onClick={() => router.visit("/penguji/dashboard")}
                        className="bg-blue-600 text-white p-2 rounded-full"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1 border rounded-lg px-4 py-2 text-sm">
                        OSCE / {enrollment?.nama_osce ?? "Radiologi 01-A"} / Penilaian Stase
                    </div>
                </div>

                <div className="flex-1 overflow-auto px-8 pb-8">
                    {/* INFO MAHASISWA */}
                    <div className="flex items-center gap-4 border border-gray-300 rounded-xl px-6 py-5 bg-gray-50 mt-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gray-400" />
                        <div>
                            <p className="font-semibold text-lg">
                                Nama : {enrollment?.nama ?? "Sendi Prasetyo"}
                            </p>
                            <p className="text-sm text-gray-700">
                                NIM : {enrollment?.nim ?? "4.33.24.1.24"}
                            </p>
                            <p className="text-sm text-gray-700">
                                Jurusan : {enrollment?.jurusan ?? "Informatika Medis"}
                            </p>
                        </div>
                    </div>

                    <h2 className="font-semibold text-lg mb-3">Rubrik Penilaian</h2>

                    <div className="border rounded-xl">
                        <OsTableHeader columns={rubrikColumns} />

                        <div className="max-h-[450px] overflow-y-auto">
                            {dataRubrik.map((group, gIndex) => (
                                <React.Fragment key={gIndex}>
                                    <div className="bg-gray-100 px-4 py-2 font-semibold border-t">
                                        {group.nama_grup}
                                    </div>

                                    {group.poin.map((poin, index) => (
                                        <div
                                            key={poin.id}
                                            className={`flex items-center min-h-[70px] border-t ${
                                                poin.highlight ? "bg-gray-50" : "bg-white"
                                            }`}
                                        >
                                            <div className="w-16 text-center">
                                                {index + 1}
                                            </div>

                                            <div className="flex-1 px-4 border-l">
                                                {poin.label}
                                            </div>

                                            {/* KOLOM SKOR */}
                                            <div className="w-[260px] border-l border-gray-300 flex flex-col items-center justify-center">
                                                {/* Angka 0–4, sejajar */}
                                                <div className="flex justify-between w-full px-6 mb-1 text-[12px]">
                                                    {[0, 1, 2, 3, 4].map((v) => (
                                                        <span
                                                            key={`label-${v}`}
                                                            className="w-5 text-center"
                                                        >
                                                            {v}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Bulatan, sejajar dengan angka */}
                                                <div className="flex justify-between w-full px-6">
                                                    {[0, 1, 2, 3, 4].map((v) => (
                                                        <button
                                                            key={`btn-${v}`}
                                                            type="button"
                                                            onClick={() =>
                                                                handleSkorChange(poin.id, v)
                                                            }
                                                            className="w-5 h-5 rounded-full border border-black flex items-center justify-center"
                                                        >
                                                            {nilaiMap[poin.id] === v && (
                                                                <span className="w-3 h-3 rounded-full bg-black" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* KOLOM BOBOT */}
                                            <div className="w-20 text-center border-l">
                                                {poin.bobot}
                                            </div>

                                            {/* KOLOM NILAI */}
                                            <div className="w-20 text-center border-l font-bold">
                                                {hitungNilai(
                                                    nilaiMap[poin.id],
                                                    poin.bobot
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="flex justify-between px-4 py-3 border-t font-semibold">
                            <span>Total nilai aspek penilaian</span>
                            <span>{totalNilai.toFixed(2)}</span>
                        </div>
                    </div>

                    <h2 className="font-semibold text-lg mt-6 mb-2">Feedback</h2>
                    <textarea
                        className="w-full border rounded-xl p-3 min-h-[120px]"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />

                    {/* BAGIAN SISA WAKTU + SUBMIT */}
                    <form onSubmit={handleSubmit} className="mt-6">
                        {/* Container putih dengan border yang mengelilingi dua button */}
                        <div className="w-full rounded-2xl border border-black shadow-sm p-3">
                            <div className="grid grid-cols-3 gap-4">
                                {/* Button Sisa Waktu (merah) */}
                                <button
                                    type="button"
                                    className="col-span-1 w-full h-[70px] rounded-xl bg-red-600 text-white font-semibold flex items-center justify-between px-6"
                                >
                                    <span>Sisa Waktu</span>
                                    <span className="text-lg font-bold">
                                        {formatWaktu()}
                                    </span>
                                </button>

                                {/* Button Submit (biru) */}
                                <button
                                    type="submit"
                                    className="col-span-2 w-full h-[70px] rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center text-lg"
                                >
                                    SUBMIT
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* FOOTER COPYRIGHT */}
                    <div className="w-full border rounded-xl px-4 py-3 text-gray-700 bg-white mt-4">
                        © {new Date().getFullYear()} All rights reserved. | Polines
                    </div>
                </div>
            </main>
        </div>
    );
}
