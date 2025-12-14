import React, { useState, useMemo } from "react";
import { router, usePage } from "@inertiajs/react";
import {
    Pencil,
    AlertTriangle,
    X, // Icon X sudah tidak dipakai di modal, tapi biarkan jika dipakai di tempat lain
    DoorOpen,
    FileText,
    User,
    Clock,
    Table2,
} from "lucide-react";

import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";
import Sidebar from "../../components/Sidebar";
import OsButton from "../../components/button.jsx";
import OsTableHeader from "../../components/tableheader";
import OsTableBody from "../../components/tablecontain.jsx";

export default function SubmitRubrik() {
    const [showModal, setShowModal] = useState(false);

    // 1. AMBIL DATA DINAMIS DARI CONTROLLER
    const { osce_detail, mahasiswa_list } = usePage().props;

    const handleBack = () => {
        router.get("/penguji/dashboard");
    };

    const handleEdit = (id_enrollment) => {
        // Kita tempelkan ID stase saat ini ke URL agar Controller tahu asalnya dari mana
        router.get(
            `/penguji/penilaian/${id_enrollment}/edit?id_osce_stase=${osce_detail.id_osce_stase}`
        );
    };

    const handleFinalSubmit = () => {
        router.post(
            `/penguji/osce/${osce_detail.id_osce}/stase/${osce_detail.id_osce_stase}/selesai`,
            {}, // Body kosong
            {
                // Tidak wajib, tapi bisa dikasih indikator loading jika mau
                onStart: () => {
                    // console.log("Menyelesaikan ujian...");
                },
                // Inertia otomatis akan redirect ke halaman List sesuai response backend
            }
        );
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // --- KONFIGURASI TABEL ---

    const tableColumns = [
        // 1. NIM
        {
            header: "NIM",
            key: "nim",
            width: "w-[150px]",
            content: "NIM",
        },

        // 2. Mahasiswa
        {
            header: "Mahasiswa",
            key: "nama",
            width: "flex-1",
            classes: "justify-start items-center pl-6 text-left",
            content: "Mahasiswa",
        },

        // 3. Total Nilai
        {
            header: "Total Nilai",
            key: "nilai_total",
            width: "w-[150px] text-center",
            content: "Total Nilai",
        },

        // 4. Aksi
        {
            header: "Aksi",
            key: "action",
            width: "w-[100px]",
            content: "Aksi",
        },
    ];

    // 2. Format Data Mahasiswa
    const formattedData = useMemo(() => {
        return mahasiswa_list.map((mhs) => ({
            ...mhs,
            action: (
                <div className="flex justify-center items-center w-full">
                    <button
                        onClick={() => handleEdit(mhs.id_enrollment_osce)}
                        className="bg-orange-400 text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-600 transition shadow-sm active:scale-95"
                        title="Edit Nilai"
                    >
                        <Pencil size={14} />
                    </button>
                </div>
            ),
        }));
    }, [mahasiswa_list]);

    return (
        <div className="relative bg-orange-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={handleSidebarToggle}
                type={"penguji"}
            />

            <div className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <main className="flex flex-col gap-os-8">
                    <OsHeader variant="goback" backLink="/penguji/dashboard" />
                    <div className="flex flex-col items-center gap-os-8 w-full">
                        {/* MAIN CARD */}
                        <div className="w-full bg-white rounded-xl overflow-hidden border border-orange-600 shadow-sm">
                            {/* CARD HEADER */}
                            <div className="bg-os-primary-pj-dark text-white text-center py-6">
                                <h1 className="text-2xl font-bold mb-1">
                                    Detail OSCE
                                </h1>
                                <p className="text-sm opacity-90">
                                    {osce_detail.nama_osce}
                                </p>
                            </div>

                            {/* CARD BODY (INFO GRID) */}
                            <div className="p-4">
                                <div className="flex flex-col lg:flex-row border border-gray-400 rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-gray-400">
                                    {/* 1. Stasiun */}
                                    <div className="p-4 flex flex-col w-full lg:w-auto min-w-[120px] items-start">
                                        <span className="text-xs text-gray-600 mb-2">
                                            Stasiun
                                        </span>
                                        <div className="bg-os-secondary-pj text-white w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-md">
                                            01
                                        </div>
                                    </div>

                                    {/* 2. Nama Stase */}
                                    <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                        <div>
                                            <span className="text-xs text-gray-600 block">
                                                Nama Stase
                                            </span>
                                            <span className="text-sm font-bold block">
                                                {osce_detail.nama_stase}
                                            </span>
                                        </div>
                                        <div className="p-2 bg-os-secondary-pj w-min rounded-full mb-2 lg:mb-0">
                                            <FileText
                                                size={18}
                                                className="text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* 3. Durasi */}
                                    <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                        <div>
                                            <span className="text-xs text-gray-600 block">
                                                Durasi per mahasiswa
                                            </span>
                                            <span className="text-sm font-bold block">
                                                {
                                                    osce_detail.durasi_per_mahasiswa
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                                <Clock
                                                    size={18}
                                                    className="text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Enrollment */}
                                    <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                        <div>
                                            <span className="text-xs text-gray-600 block">
                                                Enrollment Mahasiswa
                                            </span>
                                            <span className="text-sm font-bold block">
                                                {osce_detail.total_mahasiswa}{" "}
                                                Mahasiswa
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                                <User
                                                    size={18}
                                                    className="text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1 items-center justify-start my-2">
                        <Table2 size={18} />
                        <h2 className="font-semibold text-lg">
                            Tabel Mahasiswa{" "}
                        </h2>
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            (Total: {mahasiswa_list.length} mahasiswa)
                        </span>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-os-primary-pj">
                        <div className="mb-8">
                            <div className="w-full text-sm flex flex-col gap-2">
                                <OsTableHeader
                                    columns={tableColumns}
                                    variant="penguji"
                                />
                                <OsTableBody
                                    data={formattedData}
                                    columns={tableColumns}
                                    variant="penguji"
                                />
                            </div>
                        </div>

                        {/* TOMBOL SELESAI UTAMA */}
                        <div>
                            <OsButton
                                name="primary-pj"
                                onClick={() => setShowModal(true)}
                                className="w-full h-12 bg-orange-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-orange-700 transition-colors"
                            >
                                <DoorOpen size={18} />
                                Selesai
                            </OsButton>
                        </div>
                    </div>

                    <div className="mt-8 w-full">
                        <OsCopyright variant="penguji" />
                    </div>
                </main>

                {/* --- POPUP MODAL (DIPERBAIKI) --- */}
                {showModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
                            onClick={() => setShowModal(false)}
                        ></div>

                        <div className="relative bg-white w-full max-w-[500px] rounded-xl overflow-hidden shadow-2xl transform scale-100 transition-all">
                            {/* 1. HEADER: BERSIH (TANPA X) */}
                            <div className="bg-orange-600 py-4 px-4 relative flex items-center justify-center">
                                <h2 className="text-white text-xl font-bold tracking-wide">
                                    Konfirmasi Selesai
                                </h2>
                            </div>

                            <div className="p-8">
                                {/* 2. ALERT BOX */}
                                <div className="bg-orange-50 border border-orange-200 text-orange-900 p-5 rounded-xl flex gap-4 items-start shadow-sm">
                                    <div className="mt-1 shrink-0">
                                        <AlertTriangle
                                            className="w-6 h-6 text-orange-600 fill-transparent"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <div className="text-[15px] leading-relaxed">
                                        <strong className="block mb-2 font-bold text-lg text-orange-800">
                                            Perhatian!
                                        </strong>
                                        <p className="opacity-90">
                                            Apakah Anda yakin untuk menutup
                                            ujian ini? Pastikan semua mahasiswa
                                            dalam daftar telah dinilai.
                                        </p>
                                    </div>
                                </div>

                                {/* 3. TOMBOL AKSI: DUA KOLOM (BATAL & SELESAI) */}
                                <div className="flex gap-4 mt-8">
                                    {/* Tombol Batal */}
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 h-14 rounded-xl font-bold text-lg transition-colors"
                                    >
                                        Batal
                                    </button>

                                    {/* Tombol Selesai */}
                                    <button
                                        onClick={handleFinalSubmit}
                                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                                    >
                                        <DoorOpen size={22} />
                                        Ya, Selesai
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
