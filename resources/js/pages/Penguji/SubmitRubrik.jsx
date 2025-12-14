import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react"; // Tambah usePage
import {
    Pencil,
    AlertTriangle,
    X,
    DoorOpen,
    ExternalLink,
    ArrowLeft,
} from "lucide-react";

import OsButton from "../../components/button";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";

export default function SubmitRubrik() {
    const [showModal, setShowModal] = useState(false);

    // 1. AMBIL DATA DINAMIS DARI CONTROLLER
    const { osce_detail, mahasiswa_list } = usePage().props;

    const handleBack = () => {
        router.get("/penguji/dashboard");
    };

    // 2. FUNGSI EDIT NILAI (Redirect ke halaman edit)
    const handleEdit = (id_enrollment) => {
        router.get(`/penguji/penilaian/${id_enrollment}/edit`);
    };

    // 3. FUNGSI SUBMIT SELESAI (POST ke backend)
    const handleFinalSubmit = () => {
        router.post(
            `/penguji/osce/${osce_detail.id_osce}/stase/${osce_detail.id_osce_stase}/selesai`,
            {},
            {
                onSuccess: () => setShowModal(false),
            }
        );
    };

    return (
        <>
            <Head title={`Rekap - ${osce_detail.nama_stase}`} />

            {/* Container Utama */}
            <div className="min-h-screen w-screen  flex flex-col items-center font-sans p-os-12 text-gray-800">
                {/* WRAPPER KONTEN UTAMA */}
                <main className="w-full min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:p-4">
                    <div className="flex flex-col items-center gap-os-8 w-full">
                        <OsHeader
                            variant="goback"
                            backLink="/penguji/dashboard"
                        />

                        {/* MAIN CARD */}
                        <div className="w-full max-w-[800px] border border-os-primary rounded-2xl overflow-hidden shadow-sm bg-white mb-4">
                            {/* CARD HEADER */}
                            <div className="bg-[#2F6ECB] text-white text-center py-6">
                                <h1 className="text-xl font-bold">
                                    Detail OSCE
                                </h1>
                                <p className="text-xs opacity-90 mt-1">
                                    {osce_detail.nama_osce}
                                </p>
                            </div>

                            {/* CARD BODY */}
                            <div className="p-6">
                                {/* SECTION DETAIL */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-3">
                                        Detail
                                    </h3>

                                    <div className="border border-gray-400 rounded-xl p-3 flex flex-col md:flex-row gap-4 items-start relative">
                                        {/* Kotak Stasiun */}
                                        <div className="flex flex-col gap-1 pl-1">
                                            <span className="text-[10px] text-gray-500">
                                                Stasiun
                                            </span>
                                            {/* Angka Stasiun tetap 01 karena tidak ada data nomor stasiun di controller, bisa diganti jika ada */}
                                            <div className="bg-[#2F6ECB] text-white w-20 h-20 rounded-xl flex items-center justify-center text-3xl font-normal shadow-sm">
                                                01
                                            </div>
                                        </div>

                                        {/* Divider & Konten */}
                                        <div className="flex-1 flex w-full">
                                            {/* Kolom Rubrik - BISA DIKLIK */}
                                            <div className="flex-1 border-l border-gray-300 pl-4 flex flex-col justify-between h-20">
                                                <div>
                                                    <span className="text-[10px] text-gray-500 block">
                                                        Nama Stase
                                                    </span>
                                                    <span className="font-bold text-sm">
                                                        {osce_detail.nama_stase}
                                                    </span>
                                                </div>
                                                <a
                                                    href="#"
                                                    className="text-gray-400 hover:text-blue-600 self-start transition-colors p-1 -ml-1 rounded-md hover:bg-blue-50"
                                                    title="Lihat detail rubrik"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            </div>

                                            {/* Kolom Waktu - BISA DIKLIK */}
                                            <div className="flex-1 border-l border-gray-300 pl-4 flex flex-col justify-between h-20">
                                                <div>
                                                    <span className="text-[10px] text-gray-500 block">
                                                        Durasi per mahasiswa
                                                    </span>
                                                    <span className="font-bold text-sm">
                                                        {
                                                            osce_detail.durasi_per_mahasiswa
                                                        }
                                                    </span>
                                                </div>
                                                <a
                                                    href="#"
                                                    className="text-gray-400 hover:text-blue-600 self-start transition-colors p-1 -ml-1 rounded-md hover:bg-blue-50"
                                                    title="Atur waktu"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            </div>

                                            {/* Kolom Enrollment - BISA DIKLIK */}
                                            <div className="flex-1 border-l border-gray-300 pl-4 flex flex-col justify-between h-20">
                                                <div>
                                                    <span className="text-[10px] text-gray-500 block">
                                                        Enrollment Mahasiswa
                                                    </span>
                                                    <span className="font-bold text-sm">
                                                        {
                                                            osce_detail.total_mahasiswa
                                                        }{" "}
                                                        Mahasiswa
                                                    </span>
                                                </div>
                                                <a
                                                    href="#"
                                                    className="text-gray-400 hover:text-blue-600 self-start transition-colors p-1 -ml-1 rounded-md hover:bg-blue-50"
                                                    title="Lihat daftar mahasiswa"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION TABEL MAHASISWA */}
                                <div className="mb-8">
                                    <div className="flex items-end border-b border-gray-400 pb-1 mb-3">
                                        <h3 className="text-sm text-gray-800">
                                            Mahasiswa{" "}
                                            <span className="text-gray-400 mx-1">
                                                |
                                            </span>{" "}
                                            menampilkan{" "}
                                            <strong>
                                                {mahasiswa_list.length}{" "}
                                                Mahasiswa
                                            </strong>
                                        </h3>
                                    </div>

                                    <div className="w-full text-sm">
                                        <div className="flex border border-gray-400 rounded-lg overflow-hidden bg-white mb-2">
                                            <div className="py-2 px-4 w-1/4 border-r border-gray-300 font-medium">
                                                NIM
                                            </div>
                                            <div className="py-2 px-4 flex-1 border-r border-gray-300 font-medium">
                                                Mahasiswa
                                            </div>
                                            <div className="py-2 px-4 w-1/5 border-r border-gray-300 font-medium">
                                                Total Nilai
                                            </div>
                                            <div className="py-2 px-4 w-16 text-center font-medium">
                                                Aksi
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {mahasiswa_list.map(
                                                (mhs, index) => (
                                                    <div
                                                        key={
                                                            mhs.id_enrollment_osce ||
                                                            index
                                                        }
                                                        className={`flex items-center rounded-lg overflow-hidden border border-transparent ${
                                                            index % 2 !== 0
                                                                ? "bg-[#E5E7EB]"
                                                                : "bg-white"
                                                        }`}
                                                    >
                                                        <div className="py-3 px-4 w-1/4 border-r border-gray-300/50 h-full flex items-center text-gray-700">
                                                            {mhs.nim}
                                                        </div>
                                                        <div className="py-3 px-4 flex-1 border-r border-gray-300/50 h-full flex items-center text-gray-700">
                                                            {mhs.nama}
                                                        </div>
                                                        <div className="py-3 px-4 w-1/5 border-r border-gray-300/50 h-full flex items-center text-gray-700">
                                                            {mhs.nilai_total}
                                                        </div>
                                                        <div className="py-3 px-4 w-16 flex justify-center items-center">
                                                            {/* TOMBOL PENSIL BISA DIKLIK */}
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        mhs.id_enrollment_osce
                                                                    )
                                                                }
                                                                className="bg-[#1a46d4] text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-700 transition shadow-sm active:scale-95"
                                                                title="Edit Nilai"
                                                            >
                                                                <Pencil
                                                                    size={14}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* TOMBOL SELESAI */}
                                <div>
                                    <OsButton
                                        name="primary"
                                        onClick={() => setShowModal(true)}
                                        className="w-full h-12 bg-[#1a46d4] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-blue-800"
                                    >
                                        <DoorOpen size={18} />
                                        Selesai
                                    </OsButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 w-full">
                        <OsCopyright />
                    </div>
                </main>

                {/* POPUP MODAL */}
                {showModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
                            onClick={() => setShowModal(false)}
                        ></div>

                        <div className="relative bg-white w-full max-w-[500px] rounded-xl overflow-hidden shadow-2xl transform scale-100 transition-all">
                            <div className="bg-[#2F6ECB] py-4 px-4 relative flex items-center justify-center">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute left-4 text-white hover:opacity-80"
                                >
                                    <X size={28} strokeWidth={3} />
                                </button>
                                <h2 className="text-white text-xl font-bold tracking-wide">
                                    Anda ingin selesai?
                                </h2>
                            </div>

                            <div className="p-8">
                                <div className="bg-[#E59898] border border-black text-black p-5 rounded-xl flex gap-4 items-start">
                                    <div className="mt-1 shrink-0">
                                        <AlertTriangle
                                            className="w-6 h-6 text-black fill-transparent"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <div className="text-[15px] leading-relaxed">
                                        <strong className="block mb-3 font-bold text-lg">
                                            Perhatian!
                                        </strong>
                                        Apakah Anda yakin untuk menutup ujian
                                        ini ? Pastikan semua mahasiswa dalam
                                        daftar telah mengikuti ujian ini.
                                    </div>
                                </div>

                                <button
                                    // PANGGIL FUNGSI FINAL SUBMIT
                                    onClick={handleFinalSubmit}
                                    className="w-full bg-[#1a4CD8] hover:bg-[#153fb5] text-white h-14 mt-10 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <DoorOpen size={22} />
                                    Selesai
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
