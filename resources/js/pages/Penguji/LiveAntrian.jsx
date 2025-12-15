import React, { useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import {
    Clock,
    User,
    FileText,
    CheckCircle,
    AlertCircle,
    Play,
    MapPin,
    ArrowLeft,
    Download,
    Search,
    ExternalLink,
    UserCheck,
    Table2,
    Info,
} from "lucide-react";
import OsStepModal from "../../components/StepModal.jsx";
import OsHeader from "../../components/Header.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsButton from "../../components/button.jsx";

export default function DetailOsce({ osce_detail, antrian_mahasiswa }) {
    console.log(osce_detail);
    // --- 1. State Management ---
    const [showModal, setShowModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Fallback data dari backend
    const safeOsce = osce_detail || {
        nama_osce: "-",
        nama_stase: "-",
        nomor_stasiun: "-",
        total_mahasiswa: 0,
        durasi_per_mahasiswa: 0,
        jam_mulai: "08:00", // Default fallback jam
        skenario: "Lorem ipsum dolor sit amet. Skenario belum diisi.",
    };

    const safeStudents = antrian_mahasiswa || [];

    // --- 2. Handlers ---
    const handleBack = () => router.get("/penguji/osce");
    const handleOpenModal = () => {
        setCurrentStep(0);
        setShowModal(true);
    };
    const handleCloseModal = () => setShowModal(false);
    const handleSubmitExam = () => {
        if (safeStudents.length > 0) {
            router.get(
                `/penguji/penilaian/${safeStudents[0].id_enrollment_osce}`
            );
        } else {
            alert("Tidak ada mahasiswa untuk dinilai.");
        }
    };

    // --- 3. Modal Steps Content ---
    const steps = [
        {
            title: "Detail Ujian",
            content: (
                <div className="space-y-3">
                    <div>
                        <h3 className="text-xs font-bold text-gray-700 mb-1.5">
                            Deskripsi Skenario
                        </h3>
                        <div className="border rounded-lg p-3 bg-gray-50 text-xs text-gray-600 leading-relaxed text-justify h-40 overflow-y-auto">
                            {safeOsce.skenario}
                        </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                        <AlertCircle
                            className="text-blue-600 mt-0.5 shrink-0"
                            size={18}
                        />
                        <div>
                            <p className="text-xs font-bold text-blue-800">
                                Ujian Serentak
                            </p>
                            <p className="text-[10px] text-blue-600 mt-0.5 leading-tight">
                                Ujian dimulai serentak untuk{" "}
                                <b>{safeStudents.length} mahasiswa</b>.
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Detail Stase",
            content: (
                <div className="space-y-3">
                    <div>
                        <h3 className=" font-bold text-gray-700 mb-1.5">
                            Tujuan Pembelajaran
                        </h3>
                        <div className="border rounded-lg bg-white overflow-hidden">
                            {osce_detail.tujuan_pembelajaran.map(
                                (item, idx) => (
                                    <div
                                        key={item.id_tujuan_pembelajaran}
                                        className="p-2.5 border-b last:border-0 hover:bg-gray-50"
                                    >
                                        <p className="font-medium text-base">
                                            Tujuan {idx + 1}
                                        </p>
                                        <p className=" text-gray-800 ">
                                            {item.tujuan}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {/* Box Durasi */}
                        <div className="border rounded-lg p-2.5 flex flex-col justify-between">
                            <Clock size={18} className="text-gray-400 mb-1" />
                            <div>
                                <p className=" text-gray-500">
                                    Durasi
                                </p>
                                <p className=" font-bold text-gray-800">
                                    {safeOsce.durasi_per_mahasiswa} Menit
                                </p>
                            </div>
                        </div>

                        {/* Box Jam Mulai (Diganti dari Tipe) */}
                        <div className="border rounded-lg p-2.5 flex flex-col justify-between">
                            <Clock size={18} className="text-gray-400 mb-1" />
                            <div>
                                <p className=" text-gray-500">
                                    Jam Mulai
                                </p>
                                <p className="font-bold text-gray-800">
                                    {safeOsce.jam_mulai || "08:00"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Mulai",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center py-6">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                        Siap Memulai?
                    </h3>
                    <p className="text-xs text-gray-500 max-w-xs mt-1">
                        Waktu berjalan otomatis untuk <b>semua mahasiswa</b>{" "}
                        setelah Submit.
                    </p>
                </div>
            ),
        },
    ];

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    return (
        <>
            <div className="relative bg-orange-50 w-full min-h-screen flex justify-start lg:p-os-12 p-2 font-sans overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onToggle={handleSidebarToggle}
                    type={"penguji"}
                />
                {/* Compact Header */}
                {/* <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
                    <div className="mx-auto max-w-5xl flex items-center gap-3 px-4 py-2">
                        <button
                            onClick={handleBack}
                            className="h-8 w-8 flex items-center justify-center rounded-full border bg-white hover:bg-gray-100 text-gray-600"
                        >
                            &larr;
                        </button>
                        <div className="flex-1 truncate text-xs">
                            <span className="text-gray-500">
                                OSCE / {safeOsce.nama_osce} /{" "}
                            </span>
                            <span className="font-bold text-gray-900">
                                Detail
                            </span>
                        </div>
                    </div>
                </header> */}
                <main className="grid w-full lg:p-os-8 p-0 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 lg:ml-20">
                    <OsHeader
                        className="fixed"
                        title={`OSCE / ${safeOsce.nama_osce} / Rekap Nilai`}
                        icon={<ArrowLeft className="w-5 h-5" />}
                        variant="goback"
                        onMenuClick={handleSidebarToggle}
                    />

                    <main className="flex-1 py-5 px-3 flex flex-col justify-between">
                        <div className="mx-auto w-full ">
                            <div className="overflow-hidden  rounded-xl bg-white shadow border border-gray-200">
                                {/* Compact Blue Banner */}
                                {/* <div className="bg-blue-600 px-4 py-5 text-center text-white relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 transform -skew-y-6 scale-150 origin-top-left pointer-events-none"></div>
                                    <h1 className="text-lg font-bold relative z-10">
                                        {safeOsce.nama_osce}
                                    </h1>
                                    <p className="text-xs text-blue-100 relative z-10 font-medium opacity-90 mt-0.5">
                                        {safeOsce.nama_stase}
                                    </p>
                                </div> */}

                                <div className="bg-os-primary-pj-dark text-white text-center py-6 ">
                                    <h1 className="text-2xl font-bold mb-1">
                                        Detail OSCE
                                    </h1>
                                    <p className="text-sm opacity-90 px-2">
                                        {safeOsce.nama_osce}{" "}
                                        {safeOsce.nama_stase}
                                    </p>
                                </div>

                                <div className="px-4 py-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="md:text-sm text-lg font-bold text-gray-800">
                                            Detail Informasi
                                        </h2>
                                        <span className="md:text-[10px] text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-blue-100 font-medium">
                                            Semester Genap 2024
                                        </span>
                                    </div>

                                    {/* Compact Stats Grid */}

                                    <div className="bg-white">
                                        <div className="flex flex-col lg:flex-row border border-gray-400 rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-gray-400">
                                            {/* Stasiun */}
                                            <div className="p-4 flex flex-col w-full lg:w-auto min-w-[120px]">
                                                <span className="md:text-xs text-sm text-gray-600 mb-2">
                                                    Nomor Stasiun
                                                </span>
                                                <div className="bg-os-secondary-pj text-white w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-md">
                                                    {safeOsce.nomor_stasiun}
                                                </div>
                                            </div>

                                            {/* Rubrik */}
                                            <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                                <div>
                                                    <span className="md:text-xs text-sm text-gray-600 block">
                                                        Stasiun
                                                    </span>
                                                    <p
                                                        className="md:text-sm font-bold"
                                                        title={
                                                            safeOsce.nama_stase
                                                        }
                                                    >
                                                        {safeOsce.nama_stase}
                                                    </p>
                                                </div>
                                                <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                                    <FileText
                                                        size={18}
                                                        className="text-white"
                                                    />
                                                </div>
                                            </div>

                                            {/* Waktu */}
                                            <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                                <div>
                                                    <span className="md:text-xs text-sm text-gray-600 block">
                                                        Waktu per Stase
                                                    </span>
                                                    <p className="md:text-sm font-bold text-gray-900">
                                                        {
                                                            safeOsce.durasi_per_mahasiswa
                                                        }{" "}
                                                        Menit
                                                    </p>
                                                </div>
                                                <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                                    <Clock
                                                        size={18}
                                                        className="text-white"
                                                    />
                                                </div>
                                            </div>

                                            {/* Enrollment */}
                                            <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                                <div>
                                                    <span className="md:text-xs text-sm text-gray-600 block">
                                                        Enrollment Mahasiswa
                                                    </span>
                                                    <span className="md:text-sm font-bold block">
                                                        {
                                                            safeOsce.total_mahasiswa
                                                        }{" "}
                                                        Mahasiswa
                                                    </span>
                                                </div>
                                                <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                                    <User
                                                        size={18}
                                                        className="text-white"
                                                    />
                                                </div>
                                            </div>

                                            {/* Penguji */}
                                            <div className="p-4 flex-[1.5] flex flex-col-reverse justify-between">
                                                <div>
                                                    <span className="text-xs text-gray-600 block">
                                                        Status
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                                        <p className="md:text-sm font-bold text-green-600">
                                                            Aktif
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                                    <UserCheck
                                                        size={18}
                                                        className="text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* List Mahasiswa - Compact Table */}
                        </div>
                        <div className="mt-5 bg-white rounded-xl border border-os-primary-pj shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b flex flex-row justify-between items-center bg-orange-100 gap-3">
                                <div className="flex gap-1 items-center justify-start my-2 text-orange-800">
                                    <User size={18} />
                                    <h2 className="font-semibold md:text-lg ">
                                        Antrian Mahasiswa
                                    </h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="md:text-[10px] md:text-base text-sm font-medium bg-orange-50 text-orange-700 border px-2 py-1 rounded">
                                        Total: {safeStudents.length}
                                    </div>
                                    <OsButton
                                        name="primary-pj"
                                        onClick={handleOpenModal}
                                        className="flex items-center gap-1.5 px-3 rounded-md font-bold text-xs transition shadow-sm"
                                    >
                                        <Play size={12} fill="currentColor" />
                                        Mulai Ujian
                                    </OsButton>
                                </div>
                            </div>

                            <div className="overflow-x-auto p-4 ">
                                <div className="rounded-lg border border-os-primary-pj overflow-clip">
                                    <table className="w-full text-left ">
                                        <thead>
                                            <tr className="border-b bg-orange-500 md:text-[12px] text-sm font-bold text-white uppercase tracking-wider">
                                                <th className="px-4 py-4 w-1/4">
                                                    NIM
                                                </th>
                                                <th className="px-4 py-4 w-1/2">
                                                    Mahasiswa
                                                </th>
                                                <th className="px-4 py-4 w-1/4 text-center">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 md:text-xs text-sm">
                                            {safeStudents.length > 0 ? (
                                                safeStudents.map(
                                                    (student, index) => (
                                                        <tr
                                                            key={
                                                                student.id_enrollment_osce ||
                                                                index
                                                            }
                                                            className="hover:bg-blue-50/50"
                                                        >
                                                            <td className="px-4 py-2.5 text-gray-600 font-mono">
                                                                {student.nim}
                                                            </td>
                                                            <td className="px-4 py-2.5 font-medium text-gray-900">
                                                                {student.nama}
                                                            </td>
                                                            <td className="px-4 py-2.5 text-center">
                                                                {student.status_penilaian ===
                                                                "Sudah Dinilai" ? (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                                                                        Selesai
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[10px] text-gray-400 italic">
                                                                        Menunggu
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="px-4 py-8 text-center text-gray-400"
                                                    >
                                                        <p className="text-xs">
                                                            Belum ada antrian.
                                                        </p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                    <OsCopyright variant="penguji" />
                </main>
            </div>

            <OsStepModal
                show={showModal}
                onClose={handleCloseModal}
                onSubmit={handleSubmitExam}
                steps={steps}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
            />
        </>
    );
}
