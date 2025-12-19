import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import {
    BookOpen,
    CheckCircle,
    Award,
    CalendarDays,
    Clock,
    AlertCircle,
    ArrowRight,
    Bookmark,
    CalendarRange,
    MapPin,
} from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/copyright";
import Calendar from "../../components/Calendar";
import OsIcon from "../../components/icons.jsx";

/* -------------------------------------------------
   COMPONENT: STATISTIC CARD
---------------------------------------------------*/
const StatCard = ({ title, value, description, icon, colorClass, href }) => {
    return (
        <article
            className={`w-full h-full border rounded-lg p-4 flex flex-col justify-between ${colorClass}`}
        >
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-medium text-sm text-white">
                            {title}
                        </h3>
                        <p className="text-xs text-white mt-1">{description}</p>
                    </div>
                    <div className="p-1 rounded bg-white/60 border">
                        <Bookmark size={16} className="text-gray-600" />
                    </div>
                </div>
            </div>

            <div className="flex items-end justify-between mt-4">
                <div>
                    <div className="text-4xl font-extrabold text-white leading-none">
                        {value}
                    </div>
                </div>

                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/60 border">
                    {icon}
                </div>
            </div>
        </article>
    );
};

/* -------------------------------------------------
   COMPONENT: URGENT / ALERT CARD (MODIFIKASI HARI INI)
---------------------------------------------------*/
const UrgentJadwalCard = ({ jadwal }) => {
    const isToday = jadwal.sisa_hari === 0;

    let labelWaktu = "";
    if (isToday) {
        labelWaktu = "HARI INI";
    } else if (jadwal.sisa_hari === 1) {
        labelWaktu = "BESOK";
    } else {
        labelWaktu = `H - ${jadwal.sisa_hari}`;
    }

    return (
        <div className="w-full bg-blue-600 rounded-xl p-5 text-white shadow-lg mb-6 relative overflow-hidden ring-4 ring-blue-100">
            {/* Dekorasi Background */}
            <div className="absolute -right-6 -top-6 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>

            <div className="flex items-start gap-4 relative z-10">
                {/* Icon Alert Merah */}
                <div className="bg-white p-3 rounded-xl shadow-md flex items-center justify-center min-w-[50px] min-h-[50px]">
                    <AlertCircle
                        size={28}
                        className="text-red-600 animate-pulse"
                    />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {/* Label HARI INI */}
                        <span className="bg-red-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wide">
                            {labelWaktu}
                        </span>

                        <span className="bg-orange-400 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                            PENTING
                        </span>
                    </div>

                    <h3 className="font-bold text-xl leading-tight mb-1">
                        {jadwal.nama_ujian}
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 mt-3 text-blue-50 text-sm">
                        <div className="flex items-center gap-2 bg-blue-700/50 px-2 py-1 rounded-md w-fit">
                            <CalendarDays size={14} />
                            <span className="font-medium">
                                {jadwal.tanggal_full}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-700/50 px-2 py-1 rounded-md w-fit">
                            <Clock size={14} />
                            <span className="font-medium">
                                {jadwal.jam} WIB
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* -------------------------------------------------
   COMPONENT: STANDARD JADWAL CARD
---------------------------------------------------*/
const JadwalItem = ({ jadwal }) => {
    const isPast = jadwal.sisa_hari < 0;
    const displaySisa = isPast ? "✓" : jadwal.sisa_hari;
    const displayLabel = isPast ? "Selesai" : "Hari";
    const bgClass = isPast ? "bg-gray-400" : "bg-blue-500";

    return (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between hover:bg-blue-100 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                {/* Badge Tanggal */}
                <div
                    className={`flex flex-col items-center justify-center w-12 h-12 ${bgClass} rounded-xl text-white shadow-sm group-hover:scale-105 transition-transform`}
                >
                    <span className="font-bold text-lg leading-none">
                        {displaySisa}
                    </span>
                    <span className="text-[9px] font-medium">
                        {displayLabel}
                    </span>
                </div>

                {/* Info */}
                <div>
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full uppercase">
                        {jadwal.tipe}
                    </span>
                    <h4 className="font-bold text-gray-800 text-sm mt-1">
                        {jadwal.nama_ujian}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <CalendarDays size={12} /> {jadwal.tanggal_pendek}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={12} /> {jadwal.jam}
                        </span>
                    </div>
                </div>
            </div>

            <ArrowRight
                size={18}
                className="text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
            />
        </div>
    );
};

/* -------------------------------------------------
   MAIN PAGE: MAHASISWA DASHBOARD
---------------------------------------------------*/
export default function DashboardMahasiswa() {
    const { auth, statistik, jadwal_penting, kalender_event, selected_date } =
        usePage().props;
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleDateSelect = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        router.get(
            "/mahasiswa/dashboard",
            { date: dateString },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["jadwal_penting", "selected_date", "kalender_event"],
            }
        );
    };

    // --- LOGIKA FILTER ---
    const isDateFiltered = !!selected_date;

    const urgentJadwal = isDateFiltered
        ? null
        : jadwal_penting?.find((j) => j.sisa_hari >= 0 && j.sisa_hari <= 1);

    const normalJadwal = isDateFiltered
        ? jadwal_penting
        : jadwal_penting?.filter((j) => j.sisa_hari > 1 || j.sisa_hari < 0);

    return (
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* Sidebar Universal */}
            <Sidebar
                type="mahasiswa"
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    {/* Header */}
                    <OsHeader
                        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                        variant="mahasiswa"
                    />

                    <div className="">
                        {/* WELCOME SECTION */}
                        <div className="mb-2">
                            <p className="text-gray-500 text-sm font-medium mb-1">
                                Selamat Datang!
                            </p>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {auth.user.name}
                            </h1>
                            <p className="text-gray-500">
                                Lihat dan kelola semua progres Ujian OSCE Anda
                                di sini.
                            </p>
                        </div>

                        <hr className="border-1 border-os-primary-mhs my-2" />

                        <div className="flex gap-os-8 items-center justify-start mb-2">
                            <OsIcon name={"stat"} className="h-[15px]" />
                            <h2 className="font-bold text-os-regular text-gray-900">
                                Statistika
                            </h2>
                        </div>

                        {/* STATS GRID */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <StatCard
                                title="Ujian OSCE Terdaftar"
                                description="Jumlah Ujian OSCE yang terdaftar"
                                value={statistik?.terdaftar || 0}
                                icon={
                                    <BookOpen
                                        size={24}
                                        className="text-red-950"
                                    />
                                }
                                colorClass="bg-red-400 border-red-500"
                            />
                            <StatCard
                                title="Ujian OSCE Selesai"
                                description="Jumlah Total Ujian OSCE selesai"
                                value={statistik?.selesai || 0}
                                icon={
                                    <CheckCircle
                                        size={24}
                                        className="text-green-950"
                                    />
                                }
                                colorClass="bg-green-500 border-green-300"
                                href="/penguji/osce"
                            />
                            <StatCard
                                title="Nilai Akhir"
                                description="Rata-rata hasil nilai akhir"
                                value={statistik?.nilai_akhir || "-"}
                                icon={
                                    <Award
                                        size={24}
                                        className="text-lime-950"
                                    />
                                }
                                colorClass="bg-lime-500 border-lime-300"
                                href="/penguji/riwayat"
                            />
                        </section>

                        <hr className="border-1 border-os-primary-mhs my-2" />

                        {/* CONTENT SPLIT: JADWAL & KALENDER */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* LEFT: JADWAL PENTING */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex gap-os-8 items-center justify-start">
                                        <CalendarRange size={18} />
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-bold text-os-regular text-gray-900">
                                                {selected_date
                                                    ? `Jadwal Tanggal: ${selected_date}`
                                                    : "Jadwal Penting"}
                                            </h2>
                                        </div>
                                    </div>
                                    <Link
                                        href="/mahasiswa/jadwal"
                                        className="text-blue-500 text-sm hover:underline flex items-center gap-1"
                                    >
                                        Lihat Jadwal Lengkap{" "}
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>

                                {/* CARD URGENT HARI INI / BESOK */}
                                {urgentJadwal && (
                                    <UrgentJadwalCard jadwal={urgentJadwal} />
                                )}

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                                        {selected_date
                                            ? "Daftar Ujian"
                                            : "Mendatang"}
                                    </h3>
                                    {normalJadwal && normalJadwal.length > 0 ? (
                                        normalJadwal.map((item, index) => (
                                            <JadwalItem
                                                key={index}
                                                jadwal={item}
                                            />
                                        ))
                                    ) : !urgentJadwal ? (
                                        <div className="p-6 text-center border border-dashed rounded-xl text-gray-400">
                                            {selected_date
                                                ? "Tidak ada jadwal ujian pada tanggal ini."
                                                : "Belum ada jadwal ujian mendatang."}
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* RIGHT: KALENDER */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                    <Calendar
                                        events={kalender_event}
                                        onDateSelect={handleDateSelect}
                                        variant="mahasiswa"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12">
                    <OsCopyright variant="mahasiswa" />
                </div>
            </main>
        </div>
    );
}
