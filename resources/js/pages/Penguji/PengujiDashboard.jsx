import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import {
    ArrowRight,
    UserCheck,
    Users,
    ClipboardList,
    Bookmark,
    CalendarRange,
    CalendarDays,
} from "lucide-react";

import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright";
import OsIcon from "../../components/icons";
import Calendar from "../../components/Calendar";
import Sidebar from "../../components/Sidebar.jsx";

/* -------------------------------------------------
   CARD STATISTIK
---------------------------------------------------*/
const StatCard = ({ title, value, description, icon, colorClass }) => {
    return (
        <article
            className={`w-full h-full border rounded-lg p-4 flex flex-col justify-between ${colorClass}`}
        >
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-medium text-lg text-white">
                            {title}
                        </h3>
                        <p className="text-sm text-white mt-1">{description}</p>
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
   ITEM JADWAL PENTING
---------------------------------------------------*/
const JadwalCard = ({ item }) => {
    let statusClass = "bg-gray-100 text-gray-600 border-gray-200";

    switch (item.status) {
        case "Aktif":
            statusClass = "bg-green-100 text-green-800 border-green-200";
            break;
        case "Belum Dimulai":
            statusClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
            break;
        case "Telah Dinilai":
            statusClass = "bg-indigo-100 text-indigo-800 border-indigo-200";
            break;
        case "Belum Dinilai":
            statusClass = "bg-red-100 text-red-800 border-red-200";
            break;
        default:
            break;
    }

    return (
        <Link
            href={`/penguji/osce?search=${encodeURIComponent(item.nama_osce)}`}
            className="block group"
        >
            {/* Flex container utama */}
            <div className="bg-white border rounded-xl shadow-sm px-4 py-4 flex items-center justify-between hover:shadow-md transition-all hover:border-orange-300 cursor-pointer">
                {/* KIRI: Tanggal + Info OSCE */}
                <div className="flex items-center gap-3 flex-shrink">
                    {/* Tanggal */}
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-orange-500 rounded-xl text-white shadow-sm group-hover:bg-orange-600 transition-colors shrink-0">
                        <span className="font-bold text-xl leading-none">
                            {item.hari}
                        </span>
                        <span className="text-[10px] uppercase font-medium">
                            {item.bulan}
                        </span>
                    </div>

                    {/* Info OSCE */}
                    <div>
                        <h4 className="font-bold text-orange-700 text-sm line-clamp-1 group-hover:text-orange-800 transition-colors">
                            {item.nama_osce}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {item.jumlah_mahasiswa} Mahasiswa | Jam {item.sesi}
                        </p>
                    </div>
                </div>

                {/* KANAN: STATUS LABEL (DIPERBAIKI) */}
                <div className="ml-2 flex-shrink-0">
                    <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${statusClass}`}
                    >
                        {item.status}
                    </span>
                </div>
            </div>
        </Link>
    );
};

/* -------------------------------------------------
   HALAMAN DASHBOARD PENGUJI
---------------------------------------------------*/
export default function PengujiDashboard() {
    // MENERIMA PROPS calendar_events
    const {
        nama_penguji,
        statistik,
        jadwal_mendatang,
        selected_date,
        calendar_events,
    } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleDateSelect = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        router.get(
            "/penguji/dashboard",
            { date: dateString },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["jadwal_mendatang", "selected_date"],
            }
        );
    };

    return (
        <div className="relative bg-orange-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                type="penguji"
                onToggle={handleSidebarToggle}
            />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader
                        onMenuClick={handleSidebarToggle}
                        variant="penguji"
                    />

                    <div className="flex-1 overflow-auto">
                        {/* WELCOME SECTION */}
                        <div className="">
                            <p className=" text-gray-600 text-os-regular">
                                Selamat Datang,
                            </p>
                            <h1 className="font-bold text-os-title text-gray-900">
                                {nama_penguji}
                            </h1>
                            <p className="text-gray-500 md:text-sm">
                                Berikut adalah ringkasan aktivitas pengujian
                                Anda.
                            </p>
                        </div>

                        <hr className="border-1 border-os-primary-pj my-2" />

                        {/* STATISTIK GRID */}
                        <section className="mb-2">
                            <div className="flex gap-os-8 items-center justify-start mb-2">
                                <OsIcon name={"stat"} className="h-[15px]" />
                                <h2 className="font-bold md:text-os-regular text-lg text-gray-900">
                                    Statistika
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <StatCard
                                    title="OSCE Mendatang"
                                    description="Jadwal ujian akan datang"
                                    value={statistik?.osce_mendatang ?? 0}
                                    icon={
                                        <ClipboardList
                                            size={22}
                                            className="text-orange-700"
                                        />
                                    }
                                    colorClass="bg-orange-400 border-orange-300"
                                />
                                <StatCard
                                    title="Masa Penilaian"
                                    description="Ujian sedang berlangsung"
                                    value={statistik?.osce_edit_nilai ?? 0}
                                    icon={
                                        <Users
                                            size={22}
                                            className="text-gray-700"
                                        />
                                    }
                                    colorClass="bg-red-400 border-orange-300"
                                />
                                <StatCard
                                    title="OSCE Selesai"
                                    description="Riwayat ujian selesai"
                                    value={statistik?.osce_selesai ?? 0}
                                    icon={
                                        <UserCheck
                                            size={22}
                                            className="text-gray-700"
                                        />
                                    }
                                    colorClass="bg-lime-500 border-orange-300"
                                />
                            </div>
                        </section>

                        <hr className="border-1 border-os-primary-pj my-2" />

                        {/* JADWAL + CALENDAR GRID */}
                        <section className="flex flex-col lg:flex-row">
                            {/* LEFT SIDE: Jadwal Penting */}
                            <div className="w-full lg:w-8/12 lg:mr-5 mb-4 lg:mb-0">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex gap-os-8 items-center justify-start">
                                        <CalendarRange size={18} />
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-bold md:text-os-regular text-lg text-gray-900">
                                                {selected_date
                                                    ? `Jadwal Tanggal: ${selected_date}`
                                                    : "Jadwal Mendatang"}
                                            </h2>
                                        </div>
                                    </div>
                                    <Link
                                        href="/penguji/osce"
                                        className="text-orange-600 text-sm font-medium hover:underline flex items-center gap-1"
                                    >
                                        Lihat Semua <ArrowRight size={16} />
                                    </Link>
                                </div>

                                {/* List Jadwal */}
                                <div className="flex flex-col gap-3 ">
                                    {jadwal_mendatang &&
                                    jadwal_mendatang.length > 0 ? (
                                        jadwal_mendatang.map((item, idx) => (
                                            <JadwalCard
                                                key={item.id_osce_stase || idx}
                                                item={item}
                                            />
                                        ))
                                    ) : (
                                        <div className="p-5 text-center bg-white border rounded-xl text-gray-500">
                                            {selected_date
                                                ? "Tidak ada jadwal ujian pada tanggal ini."
                                                : "Tidak ada jadwal ujian dalam waktu dekat."}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-1 block lg:hidden border-os-black opacity-os-alpha-25 mb-4" />

                            {/* RIGHT SIDE: Calendar */}
                            <div className="w-full lg:w-4/12">
                                <div className="bg-white p-4 rounded-xl border shadow-sm sticky top-5">
                                    <div className="flex gap-os-8 items-center justify-start mb-2">
                                        <CalendarDays size={18} />
                                        <h2 className="font-bold text-os-regular text-gray-900">
                                            Kalender
                                        </h2>
                                    </div>
                                    {/* MENGIRIM EVENTS KE KOMPONEN CALENDAR */}
                                    <Calendar
                                        onDateSelect={handleDateSelect}
                                        events={calendar_events}
                                        variant="penguji"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-4 lg:mt-12">
                    <OsCopyright variant="penguji" />
                </div>
            </main>
        </div>
    );
}
