import React from "react";
import { Head, router } from "@inertiajs/react";

export default function LiveRotasi({
    osce = {
        name: "OSCE Radiologi 01-A",
    },
    student = {
        name: "Riko Aditya Zaki",
        nim: "12345689012345",
        jurusan: "Kedokteran",
    },
    remaining_time = "00:00:00",
    backUrl = "/penguji/osce", // halaman sebelumnya (penilaian stase)
    submitUrl = "/penguji/detail-osce", // tujuan setelah SUBMIT (Detail OSCE)
}) {
    const handleBack = () => {
        // kalau mau benar-benar back history bisa pakai: window.history.back();
        router.get(backUrl);
    };

    const handleSubmit = () => {
        router.get(submitUrl);
    };

    return (
        <>
            <Head title="Next Mahasiswa" />

            <div className="min-h-screen bg-white flex flex-col">
                {/* HEADER – sama seperti detail OSCE */}
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
                                OSCE / {osce.name} /
                            </span>{" "}
                            <span className="font-medium">
                                Detail OSCE/Detail Stase/ Next Mahasiswa
                            </span>
                        </div>
                    </div>
                </header>

                {/* MAIN – lebar halaman sama dengan LiveAntrian/DetailOsce */}
                <main className="flex-1">
                    <div className="mx-auto max-w-4xl px-4 py-8">
                        <div className="flex justify-center">
                            {/* Card rotasi */}
                            <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.15)] border border-black/10 py-10 px-10">
                                {/* Icon kotak centang */}
                                <div className="flex justify-center mb-8">
                                    <div className="flex items-center justify-center w-[116px] h-[116px] rounded-[22px] border-[6px] border-[#1E63D9]">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-12 h-12"
                                            fill="none"
                                            stroke="#1E63D9"
                                            strokeWidth="2.4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="5 13 9 17 19 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Judul kecil */}
                                <p className="text-sm text-black mb-3">
                                    Rotasi mahasiswa&nbsp; selanjutnya
                                </p>

                                {/* Box info mahasiswa */}
                                <div className="border border-black rounded-xl px-4 py-4 flex items-center gap-4 mb-4">
                                    {/* Avatar */}
                                    <div className="w-[70px] h-[70px] rounded-full bg-[#402525]" />

                                    {/* Data */}
                                    <div className="text-xs sm:text-sm leading-relaxed">
                                        <p className="font-semibold">
                                            Nama :{" "}
                                            <span className="font-normal">
                                                {student.name}
                                            </span>
                                        </p>
                                        <p className="font-semibold mt-1">
                                            NIM:{" "}
                                            <span className="font-normal">
                                                {student.nim}
                                            </span>
                                        </p>
                                        <p className="font-semibold mt-1">
                                            Jurusan :{" "}
                                            <span className="font-normal">
                                                {student.jurusan}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Tombol Sisa Waktu + Submit */}
                                <div className="mt-4 flex gap-3">
                                    <div className="flex-1 flex items-center justify-between rounded-xl border border-black bg-[#E53935] px-4 py-3">
                                        <span className="text-sm font-medium text-white">
                                            Sisa Waktu
                                        </span>
                                        <span className="text-sm font-bold text-white">
                                            {remaining_time}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="flex-1 rounded-xl border border-black bg-[#0052CC] px-4 py-3 text-sm font-bold text-white text-center"
                                    >
                                        SUBMIT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="border-t py-3 text-center text-xs text-gray-500">
                    © 2025 All rights reserved. | Polines
                </footer>
            </div>
        </>
    );
}
