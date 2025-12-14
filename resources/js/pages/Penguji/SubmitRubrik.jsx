import React, { useState, useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react"; // Tambah usePage
import {
    Pencil,
    AlertTriangle,
    X,
    DoorOpen,
    ExternalLink,
    ArrowLeft,
    Download,
    Search,
    FileText,
    User,
    Clock,
    UserCheck,
    Table2,
    Info,
} from "lucide-react";

import SidebarUniversal from "../../components/SidebarUniversal";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";
import Sidebar from "../../components/Sidebar";
import OsButton from "../../components/button.jsx";
import OsSearchBar from "../../components/searchbar";
import OsTableHeader from "../../components/tableheader";
import OsTableBody from "../../components/tablecontain.jsx";
import OsPagination from "../../components/pagination.jsx";

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

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="relative bg-orange-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* <Head title={`Rekap - ${osce_detail.nama_stase}`} /> */}
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={handleSidebarToggle}
                type={"penguji"}
            />

            {/* Container Utama */}
            <div className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                {/* WRAPPER KONTEN UTAMA */}
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

                            {/* CARD BODY */}
                            <div className="p-4">
                                {/* SECTION DETAIL - Menggunakan pola Info Grid dari contoh pertama */}
                                <div className="flex flex-col lg:flex-row border border-gray-400 rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-gray-400">
                                    {/* 1. Kotak Stasiun */}
                                    <div className="p-4 flex flex-col w-full lg:w-auto min-w-[120px] items-start">
                                        <span className="text-xs text-gray-600 mb-2">
                                            Stasiun
                                        </span>
                                        <div className="bg-os-secondary-pj text-white w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-md">
                                            01
                                        </div>
                                    </div>

                                    {/* 2. Kolom Rubrik (Nama Stase) */}
                                    {/* Catatan: Di sini ikon FileText diletakkan di bagian bawah seperti contoh pertama */}
                                    <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                        <div>
                                            <span className="text-xs text-gray-600 block">
                                                Nama Stase
                                            </span>
                                            <span className="text-sm font-bold block">
                                                {/* Data: osce_detail.nama_stase */}
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

                                    {/* 3. Kolom Waktu (Durasi per Mahasiswa) */}
                                    {/* Catatan: Ikon Clock (asumsi dari contoh pertama) menggantikan ExternalLink jika mengikuti pola ikon di contoh pertama.
           Jika maksud Anda elemen "clickable link" harus tetap ada, saya menyimpannya sebagai link di bawahnya. */}
                                    <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                        <div>
                                            <span className="text-xs text-gray-600 block">
                                                Durasi per mahasiswa
                                            </span>
                                            <span className="text-sm font-bold block">
                                                {/* Data: osce_detail.durasi_per_mahasiswa */}
                                                {
                                                    osce_detail.durasi_per_mahasiswa
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            {/* Ikon sesuai pola di contoh pertama */}
                                            <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                                <Clock // Asumsi ikon Clock digunakan di sini (mengikuti contoh pertama)
                                                    size={18}
                                                    className="text-white"
                                                />
                                            </div>
                                            {/* Link/Action dari kode Anda sebelumnya */}
                                            <a
                                                href="#"
                                                className="text-gray-400 hover:text-blue-600 self-end transition-colors p-1 -mr-1 rounded-md hover:bg-blue-50"
                                                title="Atur waktu"
                                            ></a>
                                        </div>
                                    </div>

                                    {/* 4. Kolom Enrollment (Total Mahasiswa) */}
                                    {/* Catatan: Ikon User (asumsi dari contoh pertama) menggantikan ExternalLink jika mengikuti pola ikon di contoh pertama. */}
                                    <div className="p-4 flex-1 flex flex-col-reverse justify-between">
                                        <div>
                                            <span className="text-xs text-gray-600 block">
                                                Enrollment Mahasiswa
                                            </span>
                                            <span className="text-sm font-bold block">
                                                {/* Data: osce_detail.total_mahasiswa */}
                                                {osce_detail.total_mahasiswa}{" "}
                                                Mahasiswa
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            {/* Ikon sesuai pola di contoh pertama */}
                                            <div className="p-2 bg-os-secondary-pj w-min rounded-full">
                                                <User // Asumsi ikon User digunakan di sini (mengikuti contoh pertama)
                                                    size={18}
                                                    className="text-white"
                                                />
                                            </div>
                                            {/* Link/Action dari kode Anda sebelumnya */}
                                            <a
                                                href="#"
                                                className="text-gray-400 hover:text-blue-600 self-end transition-colors p-1 -mr-1 rounded-md hover:bg-blue-50"
                                                title="Lihat daftar mahasiswa"
                                            ></a>
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
                                    {/* Menampilkan total dari data yang sudah difilter */}
                                    (Total: {mahasiswa_list.length} mahasiswa)
                                </span>
                            </div>

                    {/* BUTTON COPYRIGHT */}
                    <div className="p-4 bg-white rounded-lg border border-os-primary-pj">
                        {/* SECTION TABEL MAHASISWA */}
                        <div className="mb-8">
                            {/* <div className="flex items-end border-b border-gray-400 pb-1 mb-3">
                                <h3 className="text-sm text-gray-800">
                                    Mahasiswa{" "}
                                    <span className="text-gray-400 mx-1">
                                        |
                                    </span>{" "}
                                    menampilkan{" "}
                                    <strong>
                                        {mahasiswa_list.length} Mahasiswa
                                    </strong>
                                </h3>
                            </div> */}

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
                                    {mahasiswa_list.map((mhs, index) => (
                                        <div
                                            key={
                                                mhs.id_enrollment_osce || index
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
                                                    <Pencil size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
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

                    <div className="mt-8 w-full">
                        <OsCopyright variant="penguji" />
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
        </div>
    );
}
