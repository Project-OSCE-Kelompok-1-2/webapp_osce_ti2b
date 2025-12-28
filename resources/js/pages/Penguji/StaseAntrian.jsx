import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import OsCopyright from "../../components/copyright";

export default function StaseAntrian() {
    const { osce_detail } = usePage().props;

    const safeOsce = osce_detail || {
        nama_osce: "-",
        nama_stase: "-",
        nomor_stasiun: "-",
        skenario: "Belum ada skenario.",
        durasi_per_mahasiswa: 0,
        total_mahasiswa: 0,
    };

    const handleBack = () => {
        router.visit("/penguji/dashboard");
    };

    const handleStart = () => {
        console.log("Navigasi ke antrian...");
    };

    return (
        <>
            <Head title={`Info Stase - ${safeOsce.nama_osce}`} />

            <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
                {/* HEADER */}
                <header className="border-b bg-white">
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
                            <span className="font-medium">Info Stase</span>
                        </div>
                    </div>
                </header>

                {/* KONTEN UTAMA */}
                <main className="w-full min-h-screen flex flex-col justify-between">
                    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 pb-16">
                        {/* CARD DETAIL STASE */}
                        <section className="overflow-hidden rounded-3xl bg-white shadow-md">
                            <div className="bg-blue-600 px-8 py-10 text-center text-white">
                                <h1 className="text-2xl font-semibold">
                                    {safeOsce.nama_osce}
                                </h1>
                                <p className="mt-2 text-sm">
                                    {safeOsce.nama_stase}
                                </p>
                            </div>

                            <div className="px-6 pb-8 pt-6 sm:px-8">
                                <h2 className="mb-4 text-sm font-semibold text-gray-700">
                                    Detail Informasi
                                </h2>

                                {/* Info Grid */}
                                <div className="grid gap-3 rounded-2xl border bg-gray-50 p-4 md:grid-cols-2">
                                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                                        <p className="text-xs text-gray-500">
                                            Stasiun
                                        </p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {safeOsce.nomor_stasiun}
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                                        <p className="text-xs text-gray-500">
                                            Durasi
                                        </p>
                                        <p className="text-xl font-medium text-gray-800">
                                            {safeOsce.durasi_per_mahasiswa}{" "}
                                            Menit
                                        </p>
                                    </div>
                                </div>

                                {/* SKENARIO */}
                                <div className="mt-6">
                                    <h2 className="mb-3 text-sm font-semibold text-gray-700">
                                        Skenario
                                    </h2>
                                    <div className="rounded-2xl border border-gray-300 bg-white px-5 py-4 text-sm leading-relaxed text-gray-800">
                                        {safeOsce.skenario ||
                                            "Tidak ada deskripsi skenario."}
                                    </div>
                                </div>

                                {/* Tombol Lanjut */}
                                <div className="mt-8">
                                    <button
                                        type="button"
                                        onClick={handleStart}
                                        className="w-full rounded-2xl bg-blue-600 py-4 text-white text-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                                    >
                                        <span>Lihat Antrian Mahasiswa</span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-4">
                        <OsCopyright />
                    </div>
                </main>
            </div>
        </>
    );
}
