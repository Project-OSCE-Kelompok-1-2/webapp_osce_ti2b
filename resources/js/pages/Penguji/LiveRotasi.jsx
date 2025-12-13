import React from "react";
import { Head, router, usePage } from "@inertiajs/react";

export default function LiveRotasi() {
    // 1. AMBIL PROPS DARI BACKEND (Septia)
    const {
        osce_detail,
        mahasiswa_selanjutnya, // Bisa null jika habis
        sisa_waktu_rotasi_detik = 60,
    } = usePage().props;

    // Fallback
    const safeOsce = osce_detail || { nama_osce: "-", nama_stase: "-" };

    // Cek apakah ini mahasiswa terakhir (habis)
    const isFinished = !mahasiswa_selanjutnya;

    const handleBack = () => {
        // Kembali ke dashboard
        router.get("/penguji/dashboard");
    };

    const handleSubmit = () => {
        if (isFinished) {
            // Jika habis, tutup sesi
            router.get(
                `/penguji/osce/${safeOsce.id_osce}/stase/${safeOsce.id_osce_stase}/submitrubrik`
            );
        } else {
            // Jika ada, lanjut nilai
            router.get(
                `/penguji/penilaian/${mahasiswa_selanjutnya.id_enrollment_osce}`
            );
        }
    };

    // Format Waktu (Opsional, bisa pakai timer countdown jika mau)
    const formatWaktu = (detik) => {
        const m = Math.floor(detik / 60)
            .toString()
            .padStart(2, "0");
        const s = (detik % 60).toString().padStart(2, "0");
        return `00:${m}:${s}`;
    };

    return (
        < >
            <Head title="Rotasi Mahasiswa" />

            <div className="min-h-screen bg-white flex flex-col font-sans">
                {/* HEADER */}
                <header className="border-b">
                    <div className="mx-auto max-w-6xl flex items-center gap-3 px-4 py-3">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-100"
                        >
                            <span className="sr-only">Kembali</span>
                            <span className="-ml-0.5 text-lg">&larr;</span>
                        </button>

                        <div className="flex-1 truncate text-sm text-gray-700">
                            <span className="text-gray-500">
                                OSCE / {safeOsce.nama_osce} /
                            </span>{" "}
                            <span className="font-medium">Rotasi</span>
                        </div>
                    </div>
                </header>

                {/* MAIN */}
                <main className="flex-1 h-[200px]">
                    <div className="mx-auto max-w-4xl px-4 py-8">
                        <div className="flex justify-center items-center">
                            {/* Card Rotasi */}
                            <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.15)] border border-black/10 py-10 px-10 text-center">
                                {/* Icon Check / Finish */}
                                <div className="flex justify-center mb-8">
                                    <div
                                        className={`flex items-center justify-center w-[116px] h-[116px] rounded-[22px] border-[6px] ${
                                            isFinished
                                                ? "border-green-500"
                                                : "border-[#1E63D9]"
                                        }`}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-12 h-12"
                                            fill="none"
                                            stroke={
                                                isFinished
                                                    ? "#22c55e"
                                                    : "#1E63D9"
                                            }
                                            strokeWidth="2.4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="5 13 9 17 19 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Konten Dinamis */}
                                {isFinished ? (
                                    // TAMPILAN JIKA SUDAH SELESAI SEMUA
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            Seluruh Mahasiswa Telah Dinilai!
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Anda dapat menyelesaikan sesi ini
                                            sekarang.
                                        </p>
                                    </div>
                                ) : (
                                    // TAMPILAN MAHASISWA SELANJUTNYA
                                    <div>
                                        <p className="text-sm text-black mb-3">
                                            Rotasi mahasiswa selanjutnya
                                        </p>
                                        <div className="border border-black rounded-xl px-4 py-4 flex items-center gap-4 mb-4 text-left">
                                            <div className="w-[70px] h-[70px] rounded-full bg-[#402525]" />
                                            <div className="text-xs sm:text-sm leading-relaxed">
                                                <p className="font-semibold">
                                                    Nama :{" "}
                                                    <span className="font-normal">
                                                        {
                                                            mahasiswa_selanjutnya.nama
                                                        }
                                                    </span>
                                                </p>
                                                <p className="font-semibold mt-1">
                                                    NIM :{" "}
                                                    <span className="font-normal">
                                                        {
                                                            mahasiswa_selanjutnya.nim
                                                        }
                                                    </span>
                                                </p>
                                                <p className="font-semibold mt-1">
                                                    Jurusan :{" "}
                                                    <span className="font-normal">
                                                        {
                                                            mahasiswa_selanjutnya.prodi
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tombol Sisa Waktu + Action */}
                                <div className="mt-4 flex gap-3">
                                    {!isFinished && (
                                        <div className="flex-1 flex items-center justify-between rounded-xl border border-black bg-[#E53935] px-4 py-3">
                                            <span className="text-sm font-medium text-white">
                                                Istirahat
                                            </span>
                                            <span className="text-sm font-bold text-white">
                                                {formatWaktu(
                                                    sisa_waktu_rotasi_detik
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className={`flex-1 rounded-xl border border-black px-4 py-3 text-sm font-bold text-white text-center ${
                                            isFinished
                                                ? "bg-green-600 hover:bg-green-700"
                                                : "bg-[#0052CC] hover:bg-blue-700"
                                        }`}
                                    >
                                        {isFinished
                                            ? "SELESAI SESI"
                                            : "LANJUT NILAI"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="border-t py-3 text-center text-xs text-gray-500">
                    © 2025 OSCE System
                </footer>
            </div>
        </>
    );
}
