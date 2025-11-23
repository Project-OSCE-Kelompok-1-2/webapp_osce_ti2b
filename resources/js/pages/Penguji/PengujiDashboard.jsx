import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";

import SidebarPenguji from "../../components/SidebarPenguji.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright";
import OsIcon from "../../components/icons";
import Calendar from "../../components/Calendar";

/* -------------------------------------------------
   CARD STATISTIK
---------------------------------------------------*/
const StatCard = ({ title, value, icon }) => (
    <div className="w-full bg-blue-100 border rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-700">{title}</h3>
            <div>{icon}</div>
        </div>
        <div className="text-6xl font-extrabold text-gray-900">{value}</div>
    </div>
);

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
                        href={`/penguji/osce`} // Bisa diarahkan ke detail penilaian nanti
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
    // 1. Ambil Props dari Backend (Sesuai nama di Controller)
    const { nama_penguji, statistik, jadwal_mendatang } = usePage().props;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative bg-gray-50 w-full min-h-screen flex font-sans">
            <SidebarPenguji isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main
                className={`flex-1 p-6 transition-all duration-300 ${
                    sidebarOpen ? "md:ml-64" : "md:ml-20"
                }`}
            >
                <OsHeader className="mb-6" />

                {/* WELCOME SECTION */}
                <div className="mb-8">
                    <p className="text-lg text-gray-600">Selamat Datang,</p>
                    <h1 className="font-bold text-3xl text-gray-900 my-1">
                        {nama_penguji}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Berikut adalah ringkasan aktivitas pengujian Anda.
                    </p>
                </div>

                {/* STATISTIK GRID */}
                <section className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="OSCE Mendatang"
                            value={statistik?.osce_mendatang ?? 0}
                            icon={
                                <OsIcon
                                    name="book"
                                    className="h-8 w-8 text-blue-600"
                                />
                            }
                        />
                        <StatCard
                            title="Masa Penilaian"
                            value={statistik?.osce_edit_nilai ?? 0}
                            icon={
                                <OsIcon
                                    name="Edit"
                                    className="h-8 w-8 text-blue-600"
                                />
                            }
                        />
                        <StatCard
                            title="OSCE Selesai"
                            value={statistik?.osce_selesai ?? 0}
                            icon={
                                <OsIcon
                                    name="Mark (Yes)"
                                    className="h-8 w-8 text-blue-600"
                                />
                            }
                        />
                    </div>
                </section>

                {/* JADWAL + CALENDAR GRID */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT SIDE: Jadwal Penting */}
                    <div className="lg:col-span-2 flex flex-col">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h2 className="font-bold text-xl text-gray-800">
                                Jadwal Ujian
                            </h2>
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
                                    Tidak ada jadwal ujian dalam waktu dekat.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Calendar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                            <h3 className="font-bold text-gray-700 mb-4 px-2">
                                Kalender
                            </h3>
                            <Calendar />
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <div className="mt-12">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
