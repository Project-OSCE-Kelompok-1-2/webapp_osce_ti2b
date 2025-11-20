import React from "react";
import { Head, router } from "@inertiajs/react";

export default function DetailOsce({ osce, students }) {
    // tombol back
    const handleBack = () => {
        router.get("/admin/liveantrian");
    };

    const handleStart = () => {
        router.get("/penguji/staseantrian"); // <<< MATCH dengan web.php
    };


    return (
        <>
            <Head title={osce.title} />

            <div className="min-h-screen bg-white flex flex-col">
                {/* Top breadcrumb bar */}
                <header className="border-b">
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

                        <div className="flex-1 truncate text-sm text-gray-700">
                            <span className="text-gray-500">
                                OSCE / OSCE Radiologi 01-A /
                            </span>{" "}
                            <span className="font-medium">Detail OSCE</span>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1">
                    <div className="mx-auto max-w-4xl px-4 py-8">
                        <div className="overflow-hidden rounded-3xl border shadow-sm">
                            {/* Header Biru */}
                            <div className="bg-blue-600 px-6 py-5 text-center text-white">
                                <h1 className="text-xl font-semibold">
                                    {osce.title}
                                </h1>
                                <p className="mt-1 text-sm text-blue-100">
                                    {osce.subtitle}
                                </p>
                            </div>

                            {/* Body */}
                            <div className="bg-white px-6 pb-6 pt-4">
                                <p className="mb-3 text-sm font-semibold text-gray-700">
                                    Detail
                                </p>

                                {/* Info Grid */}
                                <div className="grid gap-3 rounded-2xl border bg-gray-50 p-4 md:grid-cols-4">
                                    <div className="flex flex-col items-center rounded-2xl bg-white px-4 py-4 shadow-sm">
                                        <p className="text-xs text-gray-500">
                                            Stasiun
                                        </p>
                                        <div className="mt-1 rounded-xl border-2 border-blue-500 px-4 py-2">
                                            <span className="text-3xl font-semibold text-blue-600">
                                                {osce.station}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Rubrik
                                        </p>
                                        <p className="text-xs font-medium text-gray-800 text-center">
                                            {osce.rubric}
                                        </p>
                                    </div>

                                    <div className="flex flex-col rounded-2xl bg-white px-4 py-4 shadow-sm">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Rubrik
                                        </p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {osce.rubric}
                                        </p>
                                    </div>

                                    <div className="flex flex-col rounded-2xl bg-white px-4 py-4 shadow-sm">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Waktu per rubrik
                                        </p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {osce.time_per_rubric} Menit
                                        </p>
                                    </div>

                                    <div className="flex flex-col rounded-2xl bg-white px-4 py-4 shadow-sm">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Enrollment Mahasiswa
                                        </p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {osce.enrollment} Mahasiswa
                                        </p>
                                    </div>
                                </div>

                                {/* Tabel Mahasiswa */}
                                <div className="mt-5">
                                    <p className="text-sm text-gray-700">
                                        Mahasiswa | menampilkan{" "}
                                        <span className="font-semibold">
                                            {osce.enrollment} Mahasiswa
                                        </span>
                                    </p>

                                    <div className="mt-3 overflow-hidden rounded-2xl border">
                                        <div className="grid grid-cols-[2fr,3fr] border-b bg-gray-50 text-sm font-medium text-gray-700">
                                            <div className="px-4 py-2 border-r">
                                                NIM
                                            </div>
                                            <div className="px-4 py-2">
                                                Mahasiswa
                                            </div>
                                        </div>

                                        <div className="max-h-80 overflow-auto">
                                            {students.map((s, i) => (
                                                <div
                                                    key={i}
                                                    className={`grid grid-cols-[2fr,3fr] text-sm ${
                                                        i % 2 === 1
                                                            ? "bg-gray-100"
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    <div className="border-r px-4 py-2 text-gray-700">
                                                        {s.nim}
                                                    </div>
                                                    <div className="px-4 py-2 text-gray-700">
                                                        {s.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Mulai */}
                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={handleStart}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-white/20 text-xs">
                                            ▢
                                        </span>
                                        <span>Mulai</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="border-t py-3 text-center text-xs text-gray-500">
                    © 2025 OSCE
                </footer>
            </div>
        </>
    );
}
