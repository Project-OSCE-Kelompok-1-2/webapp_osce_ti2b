import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import {
    ArrowRight,
    UserCheck,
    Users,
    ClipboardList,
    Bookmark,
    CalendarRange,
    CalendarDays
} from "lucide-react";

import SidebarPenguji from "../../components/SidebarPenguji.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright";
import OsIcon from "../../components/icons";
import Calendar from "../../components/Calendar";
import Sidebar from "../../components/Sidebar.jsx";

/* -------------------------------------------------
   CARD STATISTIK
---------------------------------------------------*/
// const StatCard = ({ title, value, icon }) => (
//     <div className="w-full bg-blue-100 border rounded-xl p-5 flex flex-col justify-between">
//         <div className="flex justify-between mb-4">
//             <h3 className="font-bold text-lg text-gray-700">{title}</h3>
//             <div>{icon}</div>
//         </div>
//         <div className="text-6xl font-extrabold text-gray-900">{value}</div>
//     </div>
// );

const StatCard = ({ title, value, description, icon, colorClass, href }) => {
    return (
        <article
            className={`w-full h-full border rounded-lg p-4 flex flex-col justify-between ${colorClass}`}
        >
            <div>
                {/* ... (bagian judul dan deskripsi, tidak berubah) ... */}
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

                    {/* [UBAH] Mengganti <button> menjadi <Link> DAN UBAH STYLE */}
                    <Link
                        href={href} // Menggunakan href dari props
                        className="mt-2 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 transition-colors"
                    >
                        <ClipboardList size={14} />
                        <span>Tampilkan lebih</span>
                    </Link>
                    {/* [SELESAI UBAH] */}
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

    // return (
    //     <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
    //         <Sidebar
    //             isOpen={sidebarOpen}
    //             setIsOpen={setSidebarOpen}
    //             type={"penguji"}
    //         />

    //         <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                // <OsHeader />
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} type="penguji" onToggle={handleSidebarToggle} />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                <OsHeader variant="goback" backLink="#" onMenuClick={handleSidebarToggle} />

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* [UBAH] Tambahkan prop 'href' di sini */}
                        <StatCard
                            title="OSCE Mendatang"
                            description="lorem ipsum dolor "
                            value={statistik?.osce_mendatang ?? 0}
                            icon={
                                <ClipboardList
                                    size={22}
                                    className="text-blue-700"
                                />
                            }
                            colorClass="bg-blue-50 border-blue-200"
                            href="/admin/osce" // <-- Tautan ke menu OSCE
                        />
                        {/* [UBAH] Tambahkan prop 'href' di sini */}
                        <StatCard
                            title="Masa Penilaian"
                            description="lorem ipsum dolor "
                            value={statistik?.osce_edit_nilai ?? 0}
                            icon={<Users size={22} className="text-gray-700" />}
                            colorClass="bg-white border-gray-200"
                            href="/admin/mahasiswa" // <-- Tautan ke menu Mahasiswa
                        />
                        {/* [UBAH] Tambahkan prop 'href' di sini */}
                        <StatCard
                            title="OSCE Selesai"
                            description="lorem ipsum dolor"
                            value={statistik?.osce_selesai ?? 0}
                            icon={
                                <UserCheck
                                    size={22}
                                    className="text-gray-700"
                                />
                            }
                            colorClass="bg-white border-gray-200"
                            href="/admin/dosen" // <-- Tautan ke menu Dosen (Asumsi Penguji = Dosen)
                        />
                    </div>
                </section>

                <hr className="border-1 border-os-black opacity-os-alpha-25" />

                {/* JADWAL + CALENDAR GRID */}
                <section className="flex flex-col lg:flex-row">
                    {/* LEFT SIDE: Jadwal Penting */}
                    <div className="w-full lg:w-8/12 lg:mr-5 mb-8 lg:mb-0">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-os-8 items-center justify-start mb-2">
                                <CalendarRange size={18} />
                                <h2 className="font-bold text-os-regular text-gray-900">
                                    Jadwal Penilaian
                                </h2>
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
                                    Tidak ada jadwal ujian dalam waktu dekat.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Calendar */}
                    <div className="w-full lg:w-4/12">
                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                            <div className="flex gap-os-8 items-center justify-start mb-2">
                                <CalendarDays size={18} />
                                <h2 className="font-bold text-os-regular text-gray-900">
                                    Kalender
                                </h2>
                            </div>
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
