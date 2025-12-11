import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import {
    Calendar,
    Clock,
    Timer,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// --- IMPORT PATHS DARI KODE ASLI ANDA ---
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsPagination from "../../components/pagination.jsx";

// 1. MENERIMA PROPS DARI CONTROLLER (examHeader, jadwalStase)
export default function JadwalOsce({ examHeader, jadwalStase }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // STATE UNTUK COUNTDOWN (INITIAL STATE 0 AGAR COCOK DENGAN TAMPILAN KOSONG DI AWAL)
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // LOGIC COUNTDOWN (INTEGRASI BACKEND)
    useEffect(() => {
        // Hanya dijalankan jika data header dan countdown_target tersedia
        if (!examHeader?.countdown_target) return;

        const targetDate = new Date(examHeader.countdown_target).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [examHeader]);

    // 1. Definisi Kolom (Menggunakan key 'no' dan 'stase' untuk mapping)
    const tableColumns = [
        {
            content: "No",
            key: "no",
            width: "w-16",
            classes: "justify-center font-bold",
        },
        {
            content: "Stase Keterampilan Klinik",
            key: "stase",
            width: "flex-[2]",
            classes: "justify-center",
        },
        {
            content: "Waktu",
            key: "waktu",
            width: "flex-1",
            classes: "justify-center",
        },
        {
            content: "Ruangan",
            key: "ruangan",
            width: "flex-1",
            classes: "justify-center",
        },
        {
            content: "Penguji",
            key: "penguji",
            width: "flex-1",
            classes: "justify-center",
        },
    ];

    // 2. MAPPING DATA DARI BACKEND KE FRONTEND
    const tableData = jadwalStase?.data
        ? jadwalStase.data.map((item) => ({
              // Mapping 'no' dan 'stase_keterampilan' dari backend
              id: item.no,
              no: item.no,
              stase: item.stase_keterampilan,
              waktu: item.waktu,
              ruangan: item.ruangan,
              penguji: item.penguji,
          }))
        : [];

    // 3. Links untuk Pagination
    const paginationLinks = jadwalStase?.links || [];

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title="Jadwal OSCE" />

            {/* SIDEBAR */}
            <Sidebar
                type="mahasiswa"
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* MAIN CONTENT WRAPPER */}
            <div className="bg-white w-full min-h-screen flex justify-center p-6 font-sans md:ml-20 transition-all duration-300">
                <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14">
                    {/* --- 1. HEADER --- */}
                    <OsHeader variant="default" className="w-full" />

                    <main className="flex flex-col gap-6">
                        {/* --- 2. Info Cards Section --- */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* Kartu Kiri: Info Ujian (Blue) */}
                            {/* [UBAH] bg-[#F77B07] -> bg-blue-600 */}
                            <div className="lg:col-span-7 rounded-2xl bg-blue-600 p-6 text-white shadow-md relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Calendar
                                            size={28}
                                            className="text-white"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-bold">
                                        {/* DATA BINDING: JUDUL */}
                                        {examHeader?.judul || "Ujian OSCE"}
                                    </h2>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    {/* Tanggal */}
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 min-w-[180px]">
                                        {/* [UBAH] text-[#F77B07] -> text-blue-600 */}
                                        <div className="bg-white text-blue-600 p-2 rounded-lg">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            {/* [UBAH] text-orange-100 -> text-blue-100 */}
                                            <p className="text-xs text-blue-100 opacity-80">
                                                Tanggal
                                            </p>
                                            <p className="text-lg font-bold">
                                                {/* DATA BINDING: TANGGAL */}
                                                {examHeader?.tanggal_formatted}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Waktu Mulai */}
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 min-w-[140px]">
                                        {/* [UBAH] text-[#F77B07] -> text-blue-600 */}
                                        <div className="bg-white text-blue-600 p-2 rounded-lg">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            {/* [UBAH] text-orange-100 -> text-blue-100 */}
                                            <p className="text-xs text-blue-100 opacity-80">
                                                Waktu Mulai
                                            </p>
                                            <p className="text-lg font-bold">
                                                {/* DATA BINDING: MULAI */}
                                                {examHeader?.waktu_mulai}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Waktu Selesai */}
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 min-w-[140px]">
                                        {/* [UBAH] text-[#F77B07] -> text-blue-600 */}
                                        <div className="bg-white text-blue-600 p-2 rounded-lg">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            {/* [UBAH] text-orange-100 -> text-blue-100 */}
                                            <p className="text-xs text-blue-100 opacity-80">
                                                Waktu Selesai
                                            </p>
                                            <p className="text-lg font-bold">
                                                {/* DATA BINDING: SELESAI */}
                                                {examHeader?.waktu_selesai}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kartu Kanan: Waktu Tersisa (Countdown) */}
                            {/* [UBAH] bg-[#F77B07] -> bg-blue-600 */}
                            <div className="lg:col-span-5 rounded-2xl bg-blue-600 p-6 text-white shadow-md flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Timer
                                            size={24}
                                            className="text-white"
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold">
                                        Waktu Tersisa
                                    </h2>
                                </div>
                                <div className="flex justify-between items-center text-center px-2">
                                    {/* BINDING: HARI */}
                                    <div>
                                        {/* [UBAH] text-[#0B0931] -> text-white (Supaya terbaca di background biru) */}
                                        <div className="text-white text-3xl md:text-4xl font-extrabold mb-1">
                                            {timeLeft.days
                                                .toString()
                                                .padStart(2, "0")}
                                        </div>
                                        {/* [UBAH] text-orange-100 -> text-blue-100 */}
                                        <div className="text-blue-100 text-sm">
                                            Hari
                                        </div>
                                    </div>
                                    {/* BINDING: JAM */}
                                    <div>
                                        {/* [UBAH] text-[#0B0931] -> text-white */}
                                        <div className="text-white text-3xl md:text-4xl font-extrabold mb-1">
                                            {timeLeft.hours
                                                .toString()
                                                .padStart(2, "0")}
                                        </div>
                                        <div className="text-blue-100 text-sm">
                                            Jam
                                        </div>
                                    </div>
                                    {/* BINDING: MENIT */}
                                    <div>
                                        {/* [UBAH] text-[#0B0931] -> text-white */}
                                        <div className="text-white text-3xl md:text-4xl font-extrabold mb-1">
                                            {timeLeft.minutes
                                                .toString()
                                                .padStart(2, "0")}
                                        </div>
                                        <div className="text-blue-100 text-sm">
                                            Menit
                                        </div>
                                    </div>
                                    {/* BINDING: DETIK */}
                                    <div>
                                        {/* [UBAH] text-[#0B0931] -> text-white */}
                                        <div className="text-white text-3xl md:text-4xl font-extrabold mb-1">
                                            {timeLeft.seconds
                                                .toString()
                                                .padStart(2, "0")}
                                        </div>
                                        <div className="text-blue-100 text-sm">
                                            Detik
                                        </div>
                                    </div>
                                </div>
                                {/* Opsional: Tampilkan pesan expired */}
                                {timeLeft.days <= 0 &&
                                    timeLeft.hours <= 0 &&
                                    timeLeft.minutes <= 0 &&
                                    timeLeft.seconds <= 0 && (
                                        <p className="text-center text-red-700 mt-2 font-bold bg-white p-1 rounded">
                                            Ujian Telah Dimulai/Selesai!
                                        </p>
                                    )}
                            </div>
                        </div>

                        {/* --- 3. Table Section --- */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <CheckSquare size={32} className="text-black" />
                                <h2 className="text-2xl font-bold text-black">
                                    Jadwal Per Stase
                                </h2>
                            </div>

                            <div className="flex flex-col gap-2">
                                {/* PANGGIL KOMPONEN TABEL */}
                                <OsTableHeader columns={tableColumns} />
                                <OsTableBody
                                    data={tableData} // Menggunakan data hasil mapping backend
                                    columns={tableColumns}
                                />
                            </div>

                            {/* Pagination */}
                            <div className="mt-4">
                                <OsPagination links={paginationLinks} />{" "}
                                {/* Menggunakan links dari backend */}
                            </div>
                        </div>
                    </main>

                    {/* --- 4. FOOTER --- */}
                    <OsCopyright />
                </div>
            </div>
        </div>
    );
}
