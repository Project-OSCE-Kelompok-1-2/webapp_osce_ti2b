import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { ArrowLeft, User, FileText, Bookmark } from "lucide-react";
import OsCopyright from "../../components/Copyright";

// Pastikan path import ini sesuai dengan struktur project Anda
import Sidebar from "../../components/Sidebar";
import OsTableHeader from "../../components/tableheader";
import OsHeader from "../../components/Header";

// Header Tabel Rubrik (Tidak Berubah)
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

    // [FIX 1] STATE SIDEBAR DISATUKAN (Hapus duplikasi 'sidebarOpen')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    // KEY STORAGE UNTUK DRAFT
    const DRAFT_KEY = `osce_draft_${id_enrollment_osce}`;
    const TIMER_KEY = `osce_timer_end_${id_enrollment_osce}`;

    // --- STATE DEFINITIONS ---
    const [feedback, setFeedback] = useState("");
    const [nilaiMap, setNilaiMap] = useState({});
    const [waktu, setWaktu] = useState(sisa_waktu_detik);

    const dataRubrik = rubrik.length > 0 ? rubrik : [];

    let jumlahKompetensi = 0;
    for (const aspek of rubrik) jumlahKompetensi += aspek.kompetensi.length;
    const jumlahKompetensiDinilai = Object.keys(nilaiMap).length;

    // --- LOGIKA MUAT DRAFT & TIMER ---
    useEffect(() => {
        const savedDraft = localStorage.getItem(DRAFT_KEY);

        if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            setNilaiMap(draft.nilai || {});
            setFeedback(draft.feedback || "");
        } else {
            setNilaiMap(saved_scores || {});
            setFeedback(existing_feedback || "");
        }

        const savedEndTime = localStorage.getItem(TIMER_KEY);
        const now = Date.now();

        if (mode_edit) {
            setWaktu(0);
        } else if (savedEndTime) {
            const sisaInSeconds = Math.ceil(
                (parseInt(savedEndTime) - now) / 1000
            );
            setWaktu(sisaInSeconds > 0 ? sisaInSeconds : 0);
        } else {
            setWaktu(sisa_waktu_detik);
            if (sisa_waktu_detik > 0) {
                const targetTime = now + sisa_waktu_detik * 1000;
                localStorage.setItem(TIMER_KEY, targetTime.toString());
            }
        }
    }, [
        id_enrollment_osce,
        sisa_waktu_detik,
        saved_scores,
        existing_feedback,
        mode_edit,
    ]);

    // --- SIMPAN DRAFT ---
    useEffect(() => {
        if (mode_edit) return;
        const draftData = {
            nilai: nilaiMap,
            feedback: feedback,
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    }, [nilaiMap, feedback, mode_edit, DRAFT_KEY]);

    // --- INTERVAL TIMER ---
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

        localStorage.removeItem(TIMER_KEY);
        localStorage.removeItem(DRAFT_KEY);

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
            className="relative bg-orange-50 w-full p-os-12 min-h-screen flex justify-start font-sans overflow-hidden"
        >
            {/* KOTAK TIMER FIXED */}
            <div
                className={`fixed z-50 top-4 right-4 w-[150px] h-[70px] rounded-xl text-white  flex flex-col items-center justify-center px-2 text-center shadow-lg transition-colors
                    ${waktu > 0 ? "bg-red-600" : "bg-gray-500"}`}
            >
                <span className="text-[12px] whitespace-nowrap">
                    {mode_edit
                        ? "Mode Edit"
                        : waktu > 0
                        ? "Sisa Waktu"
                        : "Waktu Habis"}
                </span>
                <span className="text-lg font-bold tracking-wider">
                    {mode_edit ? "--:--:--" : formatWaktu()}
                </span>
            </div>

            {/* [FIX 2] PERBAIKAN SIDEBAR: Gunakan 'isSidebarOpen' dan 'onToggle' */}
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={handleSidebarToggle}
                type={"penguji"}
            />

            {/* [FIX 3] MAIN CONTENT: Tetap statis (lg:ml-20) sesuai request */}
            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                {/* HEADER */}
                <OsHeader
                    onMenuClick={handleSidebarToggle}
                    variant="goback"
                    role="penguji"
                    backLink="/penguji/osce"
                />

                <div className="flex-1 overflow-auto pb-8 p-1">
                    {/* INFO MAHASISWA */}
                    <div className="flex gap-1 items-center justify-start my-2 text-black">
                        <User size={18} />
                        <h2 className="font-semibold text-lg ">
                            Biodata Mahasiswa
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 border border-os-primary-pj rounded-xl px-6 py-5 bg-gray-50 mb-2">
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
                            <p className="text-sm text-orange-700">
                                NIM : {mahasiswa?.nim}
                            </p>
                            <p className="text-sm text-orange-700">
                                Prodi : {mahasiswa?.prodi}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-1 items-center justify-start my-2 text-black">
                        <FileText size={18} />
                        <h2 className="font-semibold text-lg ">
                            Rubrik Penilaian
                        </h2>
                    </div>

                    {/* ================= DESKTOP VIEW ================= */}
                    <div className="hidden bg-white lg:block border rounded-xl p-4 border-os-primary-pj">
                        <OsTableHeader
                            columns={rubrikColumns}
                            variant="penguji"
                        />

                        <div className="max-h-[450px] overflow-y-auto">
                            {dataRubrik.map((group, gIndex) => (
                                <React.Fragment key={gIndex}>
                                    <div className="bg-orange-50 border rounded-lg text-orange-900 border-os-primary-pj my-2 px-4 py-2 font-semibold border-t">
                                        {group.aspek}
                                    </div>

                                    {group.kompetensi.map((poin, index) => (
                                        <div
                                            key={poin.id_poin_aspek_penilaian}
                                            className="flex items-center min-h-[70px] border-t bg-white"
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
                                                            <div
                                                                className="border border-black rounded-full"
                                                                key={v}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleSkorChange(
                                                                            poin.id_poin_aspek_penilaian,
                                                                            v
                                                                        )
                                                                    }
                                                                    className={`w-5 h-5 p-[3px] rounded-full !border-2 !border-black bg-white flex items-center justify-center hover:bg-white
                                                                        ${
                                                                            nilaiMap[
                                                                                poin
                                                                                    .id_poin_aspek_penilaian
                                                                            ] ===
                                                                            v
                                                                                ? "border-black border-2 bg-white"
                                                                                : "border-black border-2 hover:border-black"
                                                                        }`}
                                                                >
                                                                    {nilaiMap[
                                                                        poin
                                                                            .id_poin_aspek_penilaian
                                                                    ] === v && (
                                                                        <span className="w-full h-full rounded-full bg-os-primary-pj" />
                                                                    )}
                                                                </button>
                                                            </div>
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

                        <div className="flex justify-between px-4 pr-8 py-3 border-t font-semibold bg-gray-50 rounded-b-xl">
                            <span>Total Nilai Sementara (Preview)</span>
                            <span>{totalNilai.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* ================= MOBILE / TABLET VIEW (PERBAIKAN) ================= */}
                    <div className="lg:hidden space-y-3">
                        {dataRubrik.map((group, gIndex) => (
                            <React.Fragment key={gIndex}>
                                {/* PERBAIKAN 1: Background Judul jadi Oranye (bukan abu-abu) */}
                                <div className="bg-orange-50 text-orange-900 border-os-primary-pj border px-4 py-2 font-semibold rounded-lg">
                                    {group.aspek}
                                </div>

                                {group.kompetensi.map((poin, index) => (
                                    <div
                                        key={poin.id_poin_aspek_penilaian}
                                        className="border rounded-xl p-4 bg-white space-y-3 shadow-sm"
                                    >
                                        <p className="text-sm text-gray-700 text-justify">
                                            {index + 1}. {poin.deskripsi}
                                        </p>

                                        {/* SKOR */}
                                        <div className="w-full">
                                            <p className="text-xs mb-2 font-medium text-gray-500 text-center">
                                                Skor:
                                            </p>
                                            <div className="flex gap-3 sm:gap-6 justify-center w-full">
                                                {[0, 1, 2, 3, 4].map((v) => {
                                                    const isSelected =
                                                        nilaiMap[
                                                            poin
                                                                .id_poin_aspek_penilaian
                                                        ] === v;
                                                    return (
                                                        <button
                                                            key={v}
                                                            type="button"
                                                            onClick={() =>
                                                                handleSkorChange(
                                                                    poin.id_poin_aspek_penilaian,
                                                                    v
                                                                )
                                                            }
                                                            /* PERBAIKAN 2: Lingkaran jadi Oranye saat dipilih */
                                                            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-200
                                            ${
                                                isSelected
                                                    ? "bg-orange-500 border-orange-600 text-white shadow-md transform scale-110" // Aktif: Oranye Solid
                                                    : "bg-white border-gray-300 text-gray-600 hover:border-orange-300 hover:bg-orange-50" // Tidak Aktif
                                            }`}
                                                        >
                                                            {v}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* BOBOT & NILAI */}
                                        <div className="flex justify-between items-center pt-2 border-t border-dashed">
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-500">
                                                    Bobot:
                                                </span>{" "}
                                                {poin.bobot}
                                            </div>

                                            <div className="text-sm font-bold text-orange-700">
                                                Nilai:{" "}
                                                {hitungNilai(
                                                    nilaiMap[
                                                        poin
                                                            .id_poin_aspek_penilaian
                                                    ],
                                                    poin.bobot
                                                ).toFixed(0)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}

                        {/* Total Nilai - Mobile */}
                        <div className="w-full px-4 py-3 border border-orange-200 rounded-xl font-semibold bg-orange-50 text-orange-900 flex justify-between items-center">
                            <span>Total Nilai Sementara:</span>
                            <span className="text-xl">
                                {totalNilai.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-1 items-center justify-start my-2 mt-4 text-black">
                        <Bookmark size={18} />
                        <h2 className="font-semibold text-lg ">Feedback</h2>
                    </div>
                    <textarea
                        className="w-full border border-os-primary-pj rounded-xl p-3 min-h-[120px] focus:ring-1 focus:ring-orange-500 outline-none"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Tuliskan catatan untuk mahasiswa..."
                    />

                    {/* FORM SUBMIT */}
                    <form onSubmit={handleSubmit} className="mt-2">
                        <div className="flex justify-start">
                            <button
                                type="submit"
                                className={`col-span-3 sm:col-span-2 md:w-[250px] w-full h-[46px] rounded-xl transition text-white font-semibold flex items-center justify-center text-sm
                                    ${
                                        jumlahKompetensiDinilai <
                                        jumlahKompetensi
                                            ? "bg-gray-500 hover:bg-gray-500/80 cursor-not-allowed"
                                            : "bg-orange-500 hover:bg-orange-600"
                                    }`}
                                disabled={
                                    jumlahKompetensiDinilai < jumlahKompetensi
                                }
                            >
                                Simpan Penilaian & Feedback
                            </button>
                        </div>
                    </form>
                </div>
                <div>
                    <OsCopyright variant="penguji" />
                </div>
            </main>
        </div>
    );
}
