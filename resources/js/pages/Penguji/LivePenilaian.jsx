import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

// Pastikan path import ini sesuai dengan struktur project Anda
import Sidebar from "../../components/Sidebar"; 
import OsTableHeader from "../../components/tableheader";

// Header Tabel Rubrik (Tidak Berubah)
const rubrikColumns = [
// ... (rubrikColumns definition)
];

export default function LivePenilaian() {
    // =========================================================================
    // 1. BAGIAN LOGIC
    // =========================================================================

    const {
        mahasiswa,
        rubrik = [],
        sisa_waktu_detik = 0,
        info_ujian,
        id_enrollment_osce,
        existing_feedback = "",
        saved_scores = {}, 
        mode_edit = false, 
    } = usePage().props;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // KEY STORAGE UNTUK DRAFT
    const DRAFT_KEY = `osce_draft_${id_enrollment_osce}`;
    const TIMER_KEY = `osce_timer_end_${id_enrollment_osce}`;
    
    // --- STATE DEFINITIONS ---
    // Diinisialisasi kosong (akan diisi di useEffect)
    const [feedback, setFeedback] = useState("");
    const [nilaiMap, setNilaiMap] = useState({});
    const [waktu, setWaktu] = useState(sisa_waktu_detik);

    const dataRubrik = rubrik.length > 0 ? rubrik : [];

    let jumlahKompetensi = 0;
    for (const aspek of rubrik) jumlahKompetensi += aspek.kompetensi.length;
    const jumlahKompetensiDinilai = Object.keys(nilaiMap).length;

    // --- FIX 1: LOGIKA MUAT DRAFT & TIMER (ANTI-RESET) ---
    useEffect(() => {
        // Cek apakah ada draft yang tersimpan untuk ID ini
        const savedDraft = localStorage.getItem(DRAFT_KEY);

        if (savedDraft) {
            // Jika ada draft (setelah refresh / navigasi balik)
            const draft = JSON.parse(savedDraft);
            setNilaiMap(draft.nilai || {});
            setFeedback(draft.feedback || "");
        } else {
            // Jika tidak ada draft, gunakan data dari Backend (nilai lama/kosong)
            setNilaiMap(saved_scores || {});
            setFeedback(existing_feedback || "");
        }

        // --- Logika Timer Pintar ---
        const savedEndTime = localStorage.getItem(TIMER_KEY);
        const now = Date.now();

        if (mode_edit) {
            setWaktu(0);
        } else if (savedEndTime) {
            // Lanjutkan hitungan
            const sisaInSeconds = Math.ceil((parseInt(savedEndTime) - now) / 1000);
            setWaktu(sisaInSeconds > 0 ? sisaInSeconds : 0);
        } else {
            // Mulai timer baru dan simpan target waktu
            setWaktu(sisa_waktu_detik);
            if (sisa_waktu_detik > 0) {
                const targetTime = now + (sisa_waktu_detik * 1000);
                localStorage.setItem(TIMER_KEY, targetTime.toString());
            }
        }

    }, [id_enrollment_osce, sisa_waktu_detik, saved_scores, existing_feedback, mode_edit]);


    // --- FIX 2: SIMPAN DRAFT SETIAP KALI NILAI BERUBAH ---
    useEffect(() => {
        if (mode_edit) return; // Tidak perlu simpan draft jika sedang edit nilai yang sudah final
        
        // Simpan state nilai dan feedback ke localStorage
        const draftData = {
            nilai: nilaiMap,
            feedback: feedback,
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));

    }, [nilaiMap, feedback, mode_edit, DRAFT_KEY]);


    // --- FIX 3: INTERVAL TIMER (Sama seperti sebelumnya) ---
    useEffect(() => {
        if (waktu <= 0) return;

        const timer = setInterval(() => {
            setWaktu((prev) => {
                if (prev <= 1) {
                    clearInterval(timer); 
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [waktu]); 

    // --- HELPER FORMAT WAKTU ---
    const formatWaktu = () => {
        const safeWaktu = waktu < 0 ? 0 : waktu;
        
        const h = Math.floor(safeWaktu / 3600);
        const m = Math.floor((safeWaktu % 3600) / 60);
        const s = safeWaktu % 60;

        return `${String(h).padStart(2, "0")}:${String(m).padStart(
            2,
            "0"
        )}:${String(s).padStart(2, "0")}`;
    };

    // --- LOGIKA HITUNG SKOR ---
    const handleSkorChange = (poinId, skor) => {
        setNilaiMap((prev) => ({ ...prev, [poinId]: skor }));
    };

    const hitungNilai = (skor, bobot) => {
        if (skor === undefined) return 0;
        return skor * bobot;
    };

    const totalNilaiMentah = dataRubrik.reduce((total, group) => {
        return (
            total +
            group.kompetensi.reduce((sum, p) => {
                return (
                    sum +
                    hitungNilai(nilaiMap[p.id_poin_aspek_penilaian], p.bobot)
                );
            }, 0)
        );
    }, 0);

    const SKALA_MAKSIMAL = 4;
    const totalNilai = totalNilaiMentah / SKALA_MAKSIMAL;

    // --- SUBMIT ---
    const handleSubmit = (e) => {
        e.preventDefault();
        const nilai = Object.entries(nilaiMap).map(([id_poin, skor]) => ({
            id_poin_aspek_penilaian: Number(id_poin),
            skor,
        }));

        if (jumlahKompetensiDinilai < jumlahKompetensi) {
            alert("Harap lengkapi semua penilaian sebelum menyimpan.");
            return;
        }

        // --- PENTING: Hapus Draft & Timer dari memori browser setelah submit ---
        localStorage.removeItem(TIMER_KEY);
        localStorage.removeItem(DRAFT_KEY);
        // ----------------------------------------------------------------------

        router.post(`/penguji/penilaian/${id_enrollment_osce}`, {
            nilai,
            feedback,
        });
    };

    // =========================================================================
    // 2. BAGIAN TAMPILAN (JSX)
    // =========================================================================
    return (
        <div 
            key={id_enrollment_osce}
            className="relative bg-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                type={"penguji"}
            />

            <main className="grid w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                {/* HEADER */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-300">
                    <button
                        onClick={() => router.visit("/penguji/dashboard")}
                        className="flex w-[46px] h-[46px] items-center justify-center relative bg-gray-600 text-white rounded-xl border border-solid border-gray-700 aspect-[1] hover:bg-gray-700 transition"
                    >
                        <ArrowLeft className="relative w-[28px] h-[24px]" />
                    </button>
                    <div className="flex-1 border rounded-lg px-4 py-2 text-sm">
                        OSCE / {info_ujian?.nama_osce} /{" "}
                        {info_ujian?.nama_stase}
                    </div>
                </div>

                <div className="flex-1 overflow-auto px-8 pb-8">
                    {/* INFO MAHASISWA */}
                    <div className="flex items-center gap-4 border border-gray-300 rounded-xl px-6 py-5 bg-gray-50 mt-4 mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-400 bg-gray-200">
                            {mahasiswa?.foto_url ? (
                                <img
                                    src={mahasiswa.foto_url}
                                    alt="Mhs"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-400" />
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-lg">
                                Nama : {mahasiswa?.nama}
                            </p>
                            <p className="text-sm text-gray-700">
                                NIM : {mahasiswa?.nim}
                            </p>
                            <p className="text-sm text-gray-700">
                                Prodi : {mahasiswa?.prodi}
                            </p>
                        </div>
                    </div>

                    <h2 className="font-semibold text-lg mb-3">
                        Rubrik Penilaian
                    </h2>

                    {/* ================= DESKTOP VIEW ================= */}
                    <div className="hidden lg:block border rounded-xl">
                        <OsTableHeader columns={rubrikColumns} />

                        <div className="max-h-[450px] overflow-y-auto">
                            {dataRubrik.map((group, gIndex) => (
                                <React.Fragment key={gIndex}>
                                    <div className="bg-gray-100 px-4 py-2 font-semibold border-t">
                                        {group.aspek}
                                    </div>

                                    {group.kompetensi.map((poin, index) => (
                                        <div
                                            key={poin.id_poin_aspek_penilaian}
                                            className={`flex items-center min-h-[70px] border-t ${
                                                nilaiMap[
                                                    poin.id_poin_aspek_penilaian
                                                ] !== undefined
                                                    ? "bg-blue-50/50"
                                                    : "bg-white"
                                            }`}
                                        >
                                            <div className="w-16 text-center">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 px-4 border-l">
                                                {poin.deskripsi}
                                            </div>

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
                                                        (v) => (
                                                            <button
                                                                key={v}
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSkorChange(
                                                                        poin.id_poin_aspek_penilaian,
                                                                        v
                                                                    )
                                                                }
                                                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                                    nilaiMap[
                                                                        poin
                                                                            .id_poin_aspek_penilaian
                                                                    ] === v
                                                                        ? "border-black bg-white"
                                                                        : "border-gray-400 hover:border-blue-500"
                                                                }`}
                                                            >
                                                                {nilaiMap[
                                                                    poin
                                                                        .id_poin_aspek_penilaian
                                                                ] === v && (
                                                                    <span className="w-3 h-3 rounded-full bg-black" />
                                                                )}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-20 text-center border-l">
                                                {poin.bobot}
                                            </div>
                                            <div className="w-20 text-center border-l font-bold">
                                                {hitungNilai(
                                                    nilaiMap[
                                                        poin
                                                            .id_poin_aspek_penilaian
                                                    ],
                                                    poin.bobot
                                                ).toFixed(0)}
                                            </div>
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="flex justify-between px-4 py-3 border-t font-semibold bg-gray-50 rounded-b-xl">
                            <span>Total Nilai Sementara (Preview)</span>
                            <span>{totalNilai.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* ================= MOBILE / TABLET VIEW ================= */}
                    <div className="lg:hidden space-y-3">
                        {dataRubrik.map((group, gIndex) => (
                            <React.Fragment key={gIndex}>
                                <div className="bg-gray-100 px-4 py-2 font-semibold border rounded-lg">
                                    {group.aspek}
                                </div>

                                {group.kompetensi.map((poin, index) => (
                                    <div
                                        key={poin.id_poin_aspek_penilaian}
                                        className="border rounded-xl p-4 bg-white space-y-3"
                                    >
                                        <p className="text-sm text-gray-700 text-justify">
                                            {index + 1}. {poin.deskripsi}
                                        </p>

                                        {/* SKOR */}
                                        <div>
                                            <p className="text-xs mb-1 font-medium">
                                                Skor:
                                            </p>
                                            <div className="flex gap-3">
                                                {[0, 1, 2, 3, 4].map((v) => (
                                                    <button
                                                        key={v}
                                                        type="button"
                                                        onClick={() =>
                                                            handleSkorChange(
                                                                poin.id_poin_aspek_penilaian,
                                                                v
                                                            )
                                                        }
                                                        className={`w-12 sm:w-14 aspect-square rounded-full border flex items-center justify-center text-lg ${
                                                            nilaiMap[
                                                                poin
                                                                    .id_poin_aspek_penilaian
                                                            ] === v
                                                                ? "border-black bg-white"
                                                                : "border-gray-400"
                                                        }`}
                                                    >
                                                        {v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* BOBOT */}
                                        <div className="text-sm">
                                            <span className="font-medium">
                                                Bobot:
                                            </span>{" "}
                                            {poin.bobot}
                                        </div>

                                        {/* NILAI */}
                                        <div className="text-sm font-semibold">
                                            Nilai:{" "}
                                            {hitungNilai(
                                                nilaiMap[
                                                    poin.id_poin_aspek_penilaian
                                                ],
                                                poin.bobot
                                            ).toFixed(0)}
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}

                        {/* Total Nilai - Mobile */}
                        <div className="w-full px-4 py-3 border rounded-xl font-semibold bg-gray-50">
                            Total Nilai Sementara: {totalNilai.toFixed(2)}
                        </div>
                    </div>

                    <h2 className="font-semibold text-lg mt-6 mb-2">
                        Feedback
                    </h2>
                    <textarea
                        className="w-full border rounded-xl p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Tuliskan catatan untuk mahasiswa..."
                    />

                    {/* FORM SUBMIT */}
                    <form onSubmit={handleSubmit} className="mt-6">
                        <div className="w-full rounded-2xl border border-black shadow-sm p-3 bg-white">
                            <div className="grid grid-cols-3 gap-4">
                                
                                {/* KOTAK TIMER (DIV, BUKAN TOMBOL) */}
                                <div
                                    className={`col-span-1 w-full h-[70px] rounded-xl text-white font-semibold flex flex-col items-center justify-center px-2 text-center cursor-default
                                        ${
                                            waktu > 0
                                                ? "bg-red-600"
                                                : "bg-gray-500"
                                        }`}
                                >
                                    <span className="text-sm whitespace-nowrap">
                                        {mode_edit
                                            ? "Mode Edit"
                                            : waktu > 0
                                            ? "Sisa Waktu"
                                            : "Waktu Habis"}
                                    </span>
                                    <span className="text-xl font-bold tracking-wider mt-1">
                                        {mode_edit
                                            ? "--:--:--"
                                            : formatWaktu()}
                                    </span>
                                </div>

                                {/* TOMBOL SIMPAN */}
                                <button
                                    type="submit"
                                    className={`col-span-2 w-full h-[70px] rounded-xl transition text-white font-semibold flex items-center justify-center text-lg 
                                    ${
                                        jumlahKompetensiDinilai <
                                        jumlahKompetensi
                                            ? "bg-gray-500 hover:bg-gray-500/80 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                    disabled={
                                        jumlahKompetensiDinilai <
                                        jumlahKompetensi
                                    }
                                >
                                    SIMPAN PENILAIAN
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="w-full border rounded-xl px-4 py-3 text-gray-700 bg-white mt-4 text-sm">
                        © {new Date().getFullYear()} All rights reserved. |
                        Polines
                    </div>
                </div>
            </main>
        </div>
    );
}