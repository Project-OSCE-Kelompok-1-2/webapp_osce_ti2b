// resources/js/Pages/Penguji/StaseAntrian.jsx

import React from "react";
import { Head, router } from "@inertiajs/react";

export default function StaseAntrian() {
    // Tombol back ke halaman live antrian
    const handleBack = () => {
        router.get("/penguji/liveantrian");
    };

    // Tombol mulai (ganti rute sesuai kebutuhanmu)
    const handleStart = () => {
        router.get("/penguji/penilaian"); // ubah ke route yang kamu pakai
    };

    return (
        <>
            <Head title="Detail OSCE / Detail Stase" />

            {/* SELURUH HALAMAN BISA DI-SCROLL */}
            <div className="min-h-screen bg-gray-100 flex flex-col">
                {/* HEADER + BREADCRUMB */}
                <header className="border-b bg-white">
                    <div className="mx-auto max-w-6xl flex items-center gap-3 px-4 py-3">
                        {/* Tombol Back */}
                        <button
                            type="button"
                            onClick={handleBack}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-100"
                        >
                            <span className="sr-only">Kembali</span>
                            <span className="-ml-0.5 text-lg">&larr;</span>
                        </button>

                        {/* Breadcrumb */}
                        <div className="flex-1 truncate text-sm text-gray-700">
                            <span className="text-gray-500">
                                OSCE / OSCE Radiologi 01-A /
                            </span>{" "}
                            <span className="font-medium">
                                Detail OSCE/Detail Stase
                            </span>
                        </div>
                    </div>
                </header>

                {/* KONTEN UTAMA */}
                <main className="flex-1">
                    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 pb-16">
                        {/* CARD DETAIL STASE */}
                        <section className="overflow-hidden rounded-3xl bg-white shadow-md">
                            <div className="bg-blue-600 px-8 py-10 text-center text-white">
                                <h1 className="text-2xl font-semibold">
                                    Detail Stase
                                </h1>
                                <p className="mt-2 text-sm">Stase CT Scan</p>
                            </div>

                            <div className="px-6 pb-8 pt-6 sm:px-8">
                                <h2 className="mb-4 text-sm font-semibold text-gray-700">
                                    Deskripsi Aspek Penilaian
                                </h2>

                                {/* List Nilai */}
                                <div className="space-y-4">
                                    {[
                                        "Nilai 1",
                                        "Nilai 2",
                                        "Nilai 3",
                                        "Nilai 4",
                                    ].map((label, i) => (
                                        <div
                                            key={i}
                                            className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-xs sm:text-sm"
                                        >
                                            <p className="mb-1 font-semibold">
                                                {label}
                                            </p>
                                            <p className="leading-relaxed">
                                                Lorem ipsum dolor sit amet
                                                consectetur. Sapien porttitor
                                                urna nibh a urna. Sodales nam
                                                mollis iaculis diam viverra.
                                                Arcu a ligula morbi tristique
                                                suscipit amet. Nibh tincidunt
                                                eget aliquet vulputate tempus
                                                quisque magna.
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* JAM MULAI & JAM BERAKHIR */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    {/* Jam Mulai */}
                                    <div className="rounded-2xl border border-gray-300 bg-white p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xl">↗</span>
                                            <span className="text-sm text-gray-600">
                                                Jam Mulai
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            13.05
                                        </p>
                                    </div>

                                    {/* Jam Berakhir */}
                                    <div className="rounded-2xl border border-gray-300 bg-white p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xl">↗</span>
                                            <span className="text-sm text-gray-600">
                                                Jam Berakhir
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            13.35
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* CARD DETAIL UJIAN */}
                        <section className="overflow-hidden rounded-3xl bg-white shadow-md">
                            <div className="bg-blue-600 px-8 py-10 text-center text-white">
                                <h1 className="text-2xl font-semibold">
                                    Detail Ujian
                                </h1>
                                <p className="mt-2 text-sm">
                                    OSCE Radiologi 01-A
                                </p>
                            </div>

                            <div className="space-y-6 px-6 pb-8 pt-6 sm:px-8">
                                {/* Deskripsi Skenario */}
                                <div>
                                    <h2 className="mb-3 text-sm font-semibold text-gray-700">
                                        Deskripsi Skenario
                                    </h2>

                                    <div className="rounded-2xl border border-gray-300 bg-white px-4 py-4 text-xs sm:text-sm">
                                        <p className="mb-2 font-semibold">
                                            Skenario Stasiun 1
                                        </p>
                                        <p className="leading-relaxed">
                                            Lorem ipsum dolor sit amet
                                            consectetur. Sapien porttitor urna
                                            nibh a urna. Sodales nam mollis
                                            iaculis diam viverra. Arcu a ligula
                                            morbi tristique suscipit amet. Nibh
                                            tincidunt eget aliquet vulputate
                                            tempus quisque magna. Lorem ipsum
                                            dolor sit amet consectetur. Sapien
                                            porttitor urna nibh a urna.
                                        </p>
                                    </div>
                                </div>

                                {/* Deskripsi Mahasiswa */}
                                <div>
                                    <h2 className="mb-3 text-sm font-semibold text-gray-700">
                                        Deskripsi Mahasiswa
                                    </h2>

                                    <div className="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white px-5 py-4 sm:flex-row sm:items-center">
                                        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-neutral-800" />

                                        <div className="space-y-1 text-sm text-gray-800">
                                            <p>
                                                <span className="font-semibold">
                                                    Nama :
                                                </span>{" "}
                                                Putri Levina Agatha
                                            </p>
                                            <p>
                                                <span className="font-semibold">
                                                    NIM :
                                                </span>{" "}
                                                12345689012345
                                            </p>
                                            <p>
                                                <span className="font-semibold">
                                                    Jurusan :
                                                </span>{" "}
                                                Kedokteran
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Mulai */}
                                <button
                                    type="button"
                                    onClick={handleStart}
                                    className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-white text-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                                >
                                    <span>💾</span>
                                    <span>Mulai</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="border-t bg-white py-3 text-center text-xs text-gray-600">
                    Copyright © Porem ipsum dolor sit amet
                </footer>
            </div>
        </>
    );
}
