import React, { useState } from "react";
// [UBAH] Import router dari inertia
import { usePage, Link, router } from "@inertiajs/react";
import {
    ArrowRight,
    UserCheck,
    Users,
    ClipboardList,
    Bookmark,
    CalendarRange,
    CalendarDays,
    XCircle, // Icon untuk reset filter
} from "lucide-react";

import SidebarPenguji from "../../components/SidebarPenguji.jsx"; // Sesuaikan path jika perlu
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright";
import OsIcon from "../../components/icons";
import Calendar from "../../components/Calendar"; // Calendar tidak diubah
import Sidebar from "../../components/Sidebar.jsx";

/* -------------------------------------------------
   CARD STATISTIK
---------------------------------------------------*/
const StatCard = ({ title, value, description, icon, colorClass, href }) => {
    return (
        <article
            className={`w-full h-full border rounded-lg p-4 flex flex-col justify-between ${colorClass}`}
        >
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-medium text-sm text-gray-800">
                            {title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {description}
                        </p>
                    </div>
                    <div className="p-1 rounded bg-white/60 border">
                        <Bookmark size={16} className="text-gray-600" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div>
                    <div className="text-4xl font-extrabold text-gray-900 leading-none">
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
    return (
        <div className="bg-white border rounded-xl shadow-sm px-4 py-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                {/* Kolom Tanggal */}
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-red-500 rounded-xl text-white shadow-sm">
                    <span className="font-bold text-xl leading-none">
                        {item.hari}
                    </span>
                    <span className="text-[10px] uppercase font-medium">
                        {item.bulan}
                    </span>
                </div>

                {/* Kolom Info */}
                <div>
                    <h4 className="font-bold text-blue-700 text-sm line-clamp-1">
                        {item.nama_osce}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {item.jumlah_mahasiswa} Mahasiswa | Jam {item.sesi}
                    </p>
                </div>
            </div>

            {/* Kolom Aksi / Status */}
            <div>
                {item.status === "edit" ? (
                    <Link
                        href={`/penguji/osce`}
                        className="px-4 py-2 rounded-full bg-lime-600 text-white text-xs font-semibold border border-lime-700 hover:bg-lime-700 transition"
                    >
                        Nilai Sekarang
                    </Link>
                ) : (
                    <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border">
                        {item.status === "selesai" ? "Selesai" : "Mendatang"}
                    </span>
                )}
            </div>
        </div>
    );
};

/* -------------------------------------------------
   HALAMAN DASHBOARD PENGUJI
---------------------------------------------------*/
export default function PengujiDashboard() {
    // 1. Ambil Props
    // 'selected_date' dikirim dari controller (opsional)
    const { nama_penguji, statistik, jadwal_mendatang, selected_date } =
        usePage().props;
    console.log(statistik);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    // [BARU] Handler saat tanggal di kalender diklik
    const handleDateSelect = (dateObj) => {
        // Format tanggal JS ke 'YYYY-MM-DD' secara manual untuk menghindari masalah timezone
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        // Kirim request ke URL yang sama dengan query param ?date=...
        router.get(
            "/penguji/dashboard", // Pastikan URL ini sesuai rute Anda
            { date: dateString },
            {
                preserveState: true, // Jangan refresh full page state
                preserveScroll: true, // Jangan scroll ke atas
                only: ["jadwal_mendatang", "selected_date"], // Hanya update data ini agar cepat
            }
        );
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                type="penguji"
                onToggle={handleSidebarToggle}
            />

            <main className="grid w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                <OsHeader onMenuClick={handleSidebarToggle} />

                {/* WELCOME SECTION */}
                <div className="">
                    <p className=" text-gray-600 text-os-regular">
                        Selamat Datang,
                    </p>
                    <h1 className="font-bold text-os-title text-gray-900">
                        {nama_penguji}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Berikut adalah ringkasan aktivitas pengujian Anda.
                    </p>
                </div>

                <hr className="border-1 border-os-black opacity-os-alpha-25" />

                {/* STATISTIK GRID */}
                <section className="mb-2">
                    <div className="flex gap-os-8 items-center justify-start mb-2">
                        <OsIcon name={"stat"} className="h-[15px]" />
                        <h2 className="font-bold text-os-regular text-gray-900">
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
                                    className="text-blue-700"
                                />
                            }
                            colorClass="bg-blue-50 border-blue-200"
                            href="/penguji/osce"
                        />
                        <StatCard
                            title="Masa Penilaian"
                            description="Ujian sedang berlangsung"
                            value={statistik?.osce_edit_nilai ?? 0}
                            icon={<Users size={22} className="text-gray-700" />}
                            colorClass="bg-white border-gray-200"
                            href="/penguji/osce"
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
                            colorClass="bg-white border-gray-200"
                            href="/penguji/riwayat"
                        />
                    </div>
                </section>

                <hr className="border-1 border-os-black opacity-os-alpha-25" />

                {/* JADWAL + CALENDAR GRID */}
                <section className="flex flex-col lg:flex-row">
                    {/* LEFT SIDE: Jadwal Penting */}
                    <div className="w-full lg:w-8/12 lg:mr-5 mb-4 lg:mb-0">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-os-8 items-center justify-start">
                                <CalendarRange size={18} />
                                <div className="flex items-center gap-2">
                                    <h2 className="font-bold text-os-regular text-gray-900">
                                        {selected_date
                                            ? `Jadwal Tanggal: ${selected_date}`
                                            : "Jadwal Mendatang"}
                                    </h2>

                                    {/* Tombol Reset Filter jika tanggal dipilih */}
                                </div>
                            </div>
                            <Link
                                href="/penguji/osce"
                                className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                            >
                                Lihat Semua
                                <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* List Jadwal */}
                        <div className="flex flex-col gap-3">
                            {jadwal_mendatang && jadwal_mendatang.length > 0 ? (
                                jadwal_mendatang.map((item, idx) => (
                                    <JadwalCard
                                        key={item.id_osce_stase || idx}
                                        item={item}
                                    />
                                ))
                            ) : (
                                <div className="p-8 text-center bg-white border rounded-xl text-gray-500">
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
                            {/* [PENTING] Pass handler ke props onDateSelect */}
                            <Calendar onDateSelect={handleDateSelect} />
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <div className="mt-4 lg:mt-12">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
