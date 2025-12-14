// === FINISHED ===

import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react"; // Pastikan Link di-import
import {
    ClipboardList,
    Users,
    UserCheck,
    ExternalLink,
    Bookmark,
    Bell,
} from "lucide-react";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import OsIcon from "../../components/icons.jsx";

// ... (Komponen StatCard dan NotificationItem TETAP SAMA, tidak perlu diubah) ...
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

            <div className="flex items-center justify-between mt-4">
                <div>
                    <div className="text-4xl font-extrabold text-white leading-none">
                        {value}
                    </div>

                    <Link
                        href={href}
                        className={`mt-2 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border text-white ${colorClass} hover:scale-105 transition`}
                    >
                        <ClipboardList size={14} />
                        <span>Tampilkan lebih</span>
                    </Link>
                </div>

                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/60 border">
                    {icon}
                </div>
            </div>
        </article>
    );
};

const NotificationItem = ({ stase, index }) => {
    return (
        <div className="flex items-start justify-between bg-white border rounded-lg  overflow-hidden">
            <div className="flex items-center px-4 py-4 border-r">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                    {index}
                </div>
            </div>

            <div className="md:flex md:justify-between w-full gap-5 p-4">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                        {stase.nama_stase}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                        {stase.sub_judul}
                    </p>
                </div>

                <div className="flex items-center max-w-[300px] gap-3 pt-1 md:pt-0">
                    <div className="px-4 py-2 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs font-semibold">
                        Nilai tidak seimbang ({stase.total_bobot}%)
                    </div>
                    <Link
                        href={`/admin/stase/${stase.id_stase}/edit`}
                        className="p-2 rounded-md border text-gray-600 hover:bg-gray-50"
                        title="Edit stase"
                    >
                        <ExternalLink size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    // 1. Ambil 'auth' dari usePage().props
    const {
        auth, // <-- Data user ada di sini (dari middleware)
        stats = { total_osce: 0, total_mahasiswa: 0, total_penguji: 0 },
        notifikasi = [],
    } = usePage().props || {};

    const user = auth?.user;

    // 2. Logika Penentuan Nama Tampilan (Mirip Sidebar)
    let displayName = "Pengguna"; // Default fallback

    if (user) {
        if (user.jenis_role === "admin") {
            // Untuk admin, pakai 'name' dari backend (yang sudah handle fallback username)
            displayName = user.name || user.username || "Admin Fakultas";
        } else {
            // Fallback umum
            displayName = user.name || user.username || displayName;
        }
    }

    const totalOsce = (stats.total_osce ?? 0).toString().padStart(2, "0");
    const totalMahasiswa = (stats.total_mahasiswa ?? 0)
        .toString()
        .padStart(2, "0");
    const totalPenguji = (stats.total_penguji ?? 0).toString().padStart(2, "0");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* Kirim user ke Sidebar juga agar sinkron */}
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={handleSidebarToggle}
                user={user}
            />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader onMenuClick={handleSidebarToggle} />

                    <section className=" w-full">
                        {/* MAIN */}
                        <div className="">
                            <p className=" text-gray-600 text-os-regular">
                                Selamat Datang,
                            </p>
                            <h1 className="font-bold text-os-title text-gray-900 capitalize">
                                {/* 3. Tampilkan Nama Dinamis */}
                                {displayName}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Berikut adalah ringkasan aktivitas pengujian
                                Anda.
                            </p>
                        </div>

                        <hr className="border-1 border-os-primary my-2" />

                        {/* ... (Sisa kode Statistika dan Notifikasi TETAP SAMA) ... */}
                        <section className="my-2 mb-4">
                            <div className="flex gap-os-8 items-center justify-start mb-2">
                                <OsIcon name={"stat"} className="h-[15px]" />
                                <h2 className="font-bold text-os-regular text-gray-900">
                                    Statistika
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <StatCard
                                    title="Total OSCE"
                                    description="Jumlah total OSCE yang terdaftar"
                                    value={totalOsce}
                                    icon={
                                        <ClipboardList
                                            size={22}
                                            className="text-blue-700"
                                        />
                                    }
                                    colorClass="bg-blue-400 border-blue-600"
                                    href="/admin/osce"
                                />
                                <StatCard
                                    title="Total Mahasiswa"
                                    description="Jumlah total mahasiswa terdaftar"
                                    value={totalMahasiswa}
                                    icon={
                                        <Users
                                            size={22}
                                            className="text-gray-700"
                                        />
                                    }
                                    colorClass="bg-red-400 border-red-600"
                                    href="/admin/mahasiswa"
                                />
                                <StatCard
                                    title="Total Penguji"
                                    description="Jumlah total penguji terdaftar"
                                    value={totalPenguji}
                                    icon={
                                        <UserCheck
                                            size={22}
                                            className="text-gray-700"
                                        />
                                    }
                                    colorClass="bg-lime-500 border-lime-600"
                                    href="/admin/dosen"
                                />
                            </div>
                        </section>

                        <hr className="border-1 border-os-primary my-2" />

                        <section>
                            <div className="flex gap-os-8 items-center justify-start my-2">
                                <Bell size={18} />
                                <h2 className="font-bold text-os-regular text-gray-900">
                                    Notifikasi
                                </h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                {notifikasi && notifikasi.length > 0 ? (
                                    notifikasi.map((item, idx) => (
                                        <NotificationItem
                                            key={item.id_stase ?? idx}
                                            stase={item}
                                            index={idx + 1}
                                        />
                                    ))
                                ) : (
                                    <p className="py-6 mt-2 text-center text-gray-500">
                                        Tidak ada notifikasi.
                                    </p>
                                )}
                            </div>
                        </section>
                    </section>
                </div>

                <div className="">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
