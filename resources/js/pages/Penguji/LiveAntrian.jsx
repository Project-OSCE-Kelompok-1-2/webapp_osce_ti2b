import React from "react";
import { Head, router, Link } from "@inertiajs/react";

export default function DetailOsce({ osce_detail, antrian_mahasiswa }) {
    // Fallback data (biar gak crash kalau null)
    const safeOsce = osce_detail || {
        nama_osce: "-",
        nama_stase: "-",
        nomor_stasiun: "-",
        total_mahasiswa: 0,
        durasi_per_mahasiswa: 0,
    };

    const safeStudents = antrian_mahasiswa || [];

    const handleBack = () => {
        router.get("/penguji/dashboard");
    };

    return (
        <>
            <Head title={safeOsce.nama_osce} />

            <div className="min-h-screen bg-white flex flex-col font-sans">
                {/* Header */}
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
                            <span className="font-medium">Detail OSCE</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="mx-auto max-w-4xl px-4 py-8">
                        <div className="overflow-hidden rounded-3xl border shadow-sm">
                            {/* Header Biru */}
                            <div className="bg-blue-600 px-6 py-5 text-center text-white">
                                <h1 className="text-xl font-semibold">
                                    {safeOsce.nama_osce}
                                </h1>
                                <p className="mt-1 text-sm text-blue-100">
                                    {safeOsce.nama_stase}
                                </p>
                            </div>

                            {/* Body */}
                            <div className="bg-white px-6 pb-6 pt-4">
                                <p className="mb-3 text-sm font-semibold text-gray-700">
                                    Detail Stase
                                </p>

                                {/* Info Grid */}
                                <div className="grid gap-3 rounded-2xl border bg-gray-50 p-4 md:grid-cols-4">
                                    {/* Stasiun */}
                                    <div className="flex flex-col items-center rounded-2xl bg-white px-4 py-4 shadow-sm">
                                        <p className="text-xs text-gray-500">
                                            Stasiun
                                        </p>
                                        <div className="mt-1 rounded-xl border-2 border-blue-500 px-4 py-2">
                                            <span className="text-3xl font-semibold text-blue-600">
                                                {safeOsce.nomor_stasiun}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Durasi */}
                                    <div className="flex flex-col rounded-2xl bg-white px-4 py-4 shadow-sm justify-center">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Waktu per rubrik
                                        </p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {safeOsce.durasi_per_mahasiswa}{" "}
                                            Menit
                                        </p>
                                    </div>

                                    {/* Enrollment */}
                                    <div className="flex flex-col rounded-2xl bg-white px-4 py-4 shadow-sm justify-center">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Total Mahasiswa
                                        </p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {safeOsce.total_mahasiswa} Mahasiswa
                                        </p>
                                    </div>

                                    {/* Nama Stase */}
                                    <div className="flex flex-col rounded-2xl bg-white px-4 py-4 shadow-sm justify-center">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Nama Stase
                                        </p>
                                        <p className="text-xs font-medium text-gray-800">
                                            {safeOsce.nama_stase}
                                        </p>
                                    </div>
                                </div>

                                {/* Tabel Mahasiswa */}
                                <div className="mt-5">
                                    <p className="text-sm text-gray-700">
                                        Daftar Antrian Mahasiswa
                                    </p>

                                    <div className="mt-3 overflow-hidden rounded-2xl border">
                                        <div className="grid grid-cols-[1.5fr,2fr,1.5fr] border-b bg-gray-50 text-sm font-medium text-gray-700">
                                            <div className="px-4 py-2 border-r">
                                                NIM
                                            </div>
                                            <div className="px-4 py-2 border-r">
                                                Mahasiswa
                                            </div>
                                            <div className="px-4 py-2 text-center">
                                                Status / Aksi
                                            </div>
                                        </div>

                                        <div className="max-h-80 overflow-auto">
                                            {safeStudents.map((s, i) => (
                                                <div
                                                    key={
                                                        s.id_enrollment_osce ||
                                                        i
                                                    }
                                                    className={`grid grid-cols-[1.5fr,2fr,1.5fr] text-sm items-center border-b last:border-0 ${
                                                        i % 2 === 1
                                                            ? "bg-gray-50"
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    <div className="border-r px-4 py-3 text-gray-700">
                                                        {s.nim}
                                                    </div>
                                                    <div className="border-r px-4 py-3 text-gray-900 font-medium">
                                                        {s.nama}
                                                    </div>

                                                    {/* Kolom Aksi */}
                                                    <div className="px-4 py-2 flex justify-center items-center gap-2">
                                                        {s.status_penilaian ===
                                                        "Sudah Dinilai" ? (
                                                            <>
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Selesai
                                                                </span>
                                                                {/* Tombol Edit (Opsional, kalau mau kasih akses edit cepat) */}
                                                                <Link
                                                                    href={`/penguji/penilaian/${s.id_enrollment_osce}`}
                                                                    className="text-xs text-blue-600 hover:underline"
                                                                >
                                                                    Edit
                                                                </Link>
                                                            </>
                                                        ) : (
                                                            <Link
                                                                href={`/penguji/penilaian/${s.id_enrollment_osce}`}
                                                                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                                                            >
                                                                <span>
                                                                    Mulai Nilai
                                                                </span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {safeStudents.length === 0 && (
                                                <div className="p-4 text-center text-gray-500 text-sm">
                                                    Tidak ada mahasiswa dalam
                                                    antrian.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="border-t py-3 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} OSCE System
                </footer>
            </div>
        </>
    );
}
