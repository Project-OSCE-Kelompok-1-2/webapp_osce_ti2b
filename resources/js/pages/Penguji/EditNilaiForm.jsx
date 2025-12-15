import React, { useState, useMemo } from "react";
import { usePage, router } from "@inertiajs/react";
import { User, FileText, Bookmark, Save } from "lucide-react";
import OsCopyright from "../../components/Copyright";

// Import Komponen (Sesuaikan path jika perlu)
import Sidebar from "../../components/Sidebar";
import OsTableHeader from "../../components/tableheader";
import OsHeader from "../../components/Header";

// Header Tabel Rubrik (Sama persis dengan LivePenilaian)
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

export default function EditNilaiForm() {
    // =========================================================================
    // 1. BAGIAN LOGIC (KHUSUS EDIT)
    // =========================================================================

    // Ambil data dari Controller (EditNilaiController)
    const {
        osce_detail,
        mahasiswa,
        rubrik_terisi, // Data rubrik + nilai dari DB
        feedback_tersimpan,
        id_enrollment_osce,
    } = usePage().props;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    // --- INISIALISASI STATE DARI DATABASE ---
    // Kita buat nilaiMap langsung terisi berdasarkan data dari backend
    const [nilaiMap, setNilaiMap] = useState(() => {
        const initialMap = {};
        if (rubrik_terisi) {
            rubrik_terisi.forEach((aspek) => {
                aspek.kompetensi.forEach((poin) => {
                    // Masukkan nilai yang ada di DB ke state
                    initialMap[poin.id_poin_aspek_penilaian] = poin.skor;
                });
            });
        }
        return initialMap;
    });

    const [feedback, setFeedback] = useState(feedback_tersimpan || "");
    const [isSaving, setIsSaving] = useState(false);

    // Hitung total kompetensi untuk validasi
    let jumlahKompetensi = 0;
    if (rubrik_terisi) {
        for (const aspek of rubrik_terisi)
            jumlahKompetensi += aspek.kompetensi.length;
    }
    const jumlahKompetensiDinilai = Object.keys(nilaiMap).length;

    // --- LOGIKA HITUNG SKOR (SAMA) ---
    const handleSkorChange = (poinId, skor) => {
        setNilaiMap((prev) => ({ ...prev, [poinId]: skor }));
    };

    const hitungNilai = (skor, bobot) => {
        if (skor === undefined) return 0;
        return skor * bobot;
    };

    // Hitung Total Nilai Real-time
    const totalNilaiMentah = useMemo(() => {
        if (!rubrik_terisi) return 0;
        return rubrik_terisi.reduce((total, group) => {
            return (
                total +
                group.kompetensi.reduce((sum, p) => {
                    return (
                        sum +
                        hitungNilai(
                            nilaiMap[p.id_poin_aspek_penilaian],
                            p.bobot
                        )
                    );
                }, 0)
            );
        }, 0);
    }, [nilaiMap, rubrik_terisi]);

    const SKALA_MAKSIMAL = 4;
    const totalNilai = totalNilaiMentah / SKALA_MAKSIMAL;

    // --- SUBMIT (PUT REQUEST UNTUK EDIT) ---
    const handleSubmit = (e) => {
        e.preventDefault();

        if (jumlahKompetensiDinilai < jumlahKompetensi) {
            alert("Harap lengkapi semua penilaian sebelum menyimpan.");
            return;
        }

        setIsSaving(true);

        const nilaiPayload = Object.entries(nilaiMap).map(
            ([id_poin, skor]) => ({
                id_poin_aspek_penilaian: Number(id_poin),
                skor: Number(skor),
            })
        );

        router.put(
            `/penguji/penilaian/${id_enrollment_osce}`,
            {
                nilai: nilaiPayload,
                feedback: feedback,
                // TAMBAHKAN BARIS INI: Kirim ID stase yang sedang aktif dari props osce_detail
                id_osce_stase: osce_detail.id_osce_stase,
            },
            {
                onFinish: () => setIsSaving(false),
                onError: (errors) => {
                    setIsSaving(false);
                    console.error("Error dari Backend:", errors);
                    // ... error handling
                },
                onSuccess: () => {
                    console.log("Berhasil disimpan!");
                },
            }
        );
    };
    // =========================================================================
    // 2. BAGIAN TAMPILAN (VISUAL SAMA PERSIS DENGAN LIVE PENILAIAN)
    // =========================================================================
    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            {/* SIDEBAR */}
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={handleSidebarToggle}
                type={"penguji"}
            />

            {/* MAIN CONTENT */}
            <main className="w-full p-4 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                {/* HEADER: Arahkan tombol kembali ke list rekap */}
                <OsHeader
                    onMenuClick={handleSidebarToggle}
                    variant="goback" // Menggunakan varian back button
                    role="penguji"
                    backLink={`/penguji/osce/${osce_detail.id_osce}/stase/${osce_detail.id_osce_stase}/submitrubrik`}
                    title="Edit Penilaian"
                />

                <div className="flex-1 overflow-auto pb-8 p-1">
                    {/* INFO MAHASISWA (Style disamakan dengan LivePenilaian) */}
                    <div className="flex gap-1 items-center justify-start my-2 text-black">
                        <User size={18} />
                        <h2 className="font-semibold text-lg ">
                            Biodata Mahasiswa (Edit Mode)
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 border border-os-primary-pj rounded-xl px-6 py-5 bg-gray-50 mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-400 bg-gray-200">
                            {mahasiswa?.foto_url ? (
                                <img
                                    src={mahasiswa.foto_url}
                                    alt="Mhs"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                                    <User size={32} />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-lg text-gray-900">
                                Nama: {mahasiswa?.nama}
                            </p>
                            <p className="text-sm text-orange-700 font-mono">
                                NIM : {mahasiswa?.nim}
                            </p>
                            <p className="text-sm text-orange-700">
                                Prodi : {mahasiswa?.prodi || "-"}
                            </p>
                        </div>
                    </div>

                    {/* JUDUL RUBRIK */}
                    <div className="flex gap-1 items-center justify-start my-2 text-black">
                        <FileText size={18} />
                        <h2 className="font-semibold text-lg ">
                            Rubrik Penilaian
                        </h2>
                    </div>

                    {/* ================= DESKTOP VIEW (Style disamakan) ================= */}
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
                                            key={poin.id_poin_aspek_penilaian}
                                            className="flex items-center min-h-[70px] border-t bg-white"
                                        >
                                            <div className="w-16 text-center">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 px-4 border-l py-2">
                                                {poin.deskripsi}
                                            </div>

                                            {/* PILIHAN SKOR DESKTOP */}
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
                                                                    className={`w-5 h-5 p-[3px] rounded-full !border-2 !border-black bg-white flex items-center justify-center hover:bg-white transition-all
                                                                    ${
                                                                        nilaiMap[
                                                                            poin
                                                                                .id_poin_aspek_penilaian
                                                                        ] === v
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

                        <div className="flex justify-between px-4 pr-8 py-3 border-t font-semibold bg-gray-50 rounded-b-xl mt-4">
                            <span>Total Nilai Akhir</span>
                            <span>{totalNilai.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* ================= MOBILE / TABLET VIEW (Style disamakan) ================= */}
                    {/* ================= MOBILE / TABLET VIEW (PERBAIKAN) ================= */}
                    <div className="lg:hidden space-y-3">
                        {rubrik_terisi.map((group, gIndex) => (
                            <React.Fragment key={gIndex}>
                                {/* PERBAIKAN 1: Header Aspek jadi Oranye (bukan abu-abu) */}
                                <div className="bg-orange-50 text-orange-900 border-os-primary-pj border px-4 py-2 font-semibold rounded-lg">
                                    {group.aspek}
                                </div>

                                {group.kompetensi.map((poin, index) => (
                                    <div
                                        key={poin.id_poin_aspek_penilaian}
                                        className="border rounded-xl p-4 bg-white space-y-3 shadow-sm"
                                    >
                                        <p className="text-sm text-gray-700 text-justify">
                                            <span className="font-bold mr-1">
                                                {index + 1}.
                                            </span>{" "}
                                            {poin.deskripsi}
                                        </p>

                                        {/* SKOR MOBILE */}
                                        <div>
                                            <p className="text-xs mb-1 font-medium text-gray-500">
                                                Skor:
                                            </p>
                                            <div className="flex gap-2 sm:gap-3 justify-between sm:justify-start">
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
                                                            /* PERBAIKAN 2: Tombol jadi Oranye Solid saat aktif */
                                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center text-sm sm:text-lg font-semibold transition-all duration-200
                                            ${
                                                isSelected
                                                    ? "bg-orange-500 border-orange-600 text-white shadow-md transform scale-105" // Aktif
                                                    : "bg-white border-gray-300 text-gray-600 hover:border-orange-300" // Tidak Aktif
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
                                                    Bobot:{" "}
                                                </span>
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
                        <div className="w-full px-4 py-3 border border-orange-200 rounded-xl font-semibold bg-orange-50 text-orange-900 flex justify-between items-center shadow-sm">
                            <span>Total Nilai Akhir:</span>
                            <span className="text-xl">
                                {totalNilai.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* FEEDBACK SECTION (Style disamakan) */}
                    <div className="flex gap-1 items-center justify-start my-2 mt-8 text-black">
                        <Bookmark size={18} />
                        <h2 className="font-semibold text-lg ">
                            Feedback / Catatan
                        </h2>
                    </div>
                    <textarea
                        className="w-full border border-os-primary-pj rounded-xl p-3 min-h-[120px] focus:ring-1 focus:ring-orange-500 outline-none shadow-sm text-gray-700 bg-white"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Tuliskan catatan perbaikan atau feedback untuk mahasiswa ini..."
                    />

                    {/* FORM SUBMIT (Style disamakan) */}
                    <form onSubmit={handleSubmit} className="mt-6 mb-12">
                        <div className="flex justify-start">
                            <button
                                type="submit"
                                disabled={
                                    isSaving ||
                                    jumlahKompetensiDinilai < jumlahKompetensi
                                }
                                className={`col-span-3 sm:col-span-2 md:w-[250px] w-full h-[46px] rounded-xl transition text-white font-semibold flex items-center justify-center text-sm gap-2 shadow-md
                                    ${
                                        jumlahKompetensiDinilai <
                                        jumlahKompetensi
                                            ? "bg-gray-500 hover:bg-gray-500/80 cursor-not-allowed"
                                            : "bg-orange-500 hover:bg-orange-600 active:scale-95"
                                    }`}
                            >
                                <Save size={18} />
                                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
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
