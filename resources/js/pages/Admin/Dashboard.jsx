import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import {
    ClipboardList,
    Users,
    UserCheck,
    ExternalLink,
    Bookmark,
    Bell,
    AlertCircle, // Tambahan icon jika perlu
} from "lucide-react";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import OsIcon from "../../components/icons.jsx";

// ... (StatCard TETAP SAMA) ...
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
                        className="mt-2 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border text-white border-yellow-200 hover:bg-blue-200 transition-colors"
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

// --- UPDATE KOMPONEN INI ---
const NotificationItem = ({ item, index }) => {
    // Helper untuk warna badge berdasarkan warning_color dari backend
    const getBadgeStyle = (color) => {
        switch (color) {
            case "red":
                return "bg-red-100 border-red-300 text-red-700";
            case "yellow":
                return "bg-yellow-100 border-yellow-300 text-yellow-700";
            default:
                return "bg-gray-100 border-gray-300 text-gray-700";
        }
    };

    return (
        <div className="flex items-start justify-between bg-white border rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
            <div className="flex items-center px-4 py-4 border-r bg-gray-50 self-stretch">
                <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-sm font-semibold text-gray-700">
                    {index}
                </div>
            </div>

            <div className="md:flex md:justify-between items-center w-full gap-5 p-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {/* Badge Kategori (OSCE / Stase) */}
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 border px-1.5 rounded">
                            {item.category}
                        </span>
                    </div>
                    <h4 className="font-semibold text-gray-800">
                        {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                    </p>
                </div>

                <div className="flex items-center gap-3 pt-3 md:pt-0">
                    <div
                        className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-1 ${getBadgeStyle(
                            item.warning_color
                        )}`}
                    >
                        <AlertCircle size={14} />
                        {item.warning_label}
                    </div>

                    <Link
                        href={item.link}
                        className="p-2 rounded-md border text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                        title="Perbaiki / Lihat Detail"
                    >
                        <ExternalLink size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    // 1. Ambil Props
    const {
        auth,
        stats = { total_osce: 0, total_mahasiswa: 0, total_penguji: 0 },
        notifikasi = [], // Data notifikasi baru ada di sini
    } = usePage().props || {};

    const user = auth?.user;

    // 2. Logic Display Name
    let displayName = "Pengguna";
    if (user) {
        if (user.jenis_role === "admin") {
            displayName = user.name || user.username || "Admin Fakultas";
        } else {
            displayName = user.name || user.username || displayName;
        }
    }

    const totalOsce = (stats.total_osce ?? 0).toString().padStart(2, "0");
    const totalMahasiswa = (stats.total_mahasiswa ?? 0)
        .toString()
        .padStart(2, "0");
    const totalPenguji = (stats.total_penguji ?? 0).toString().padStart(2, "0");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={handleSidebarToggle}
                user={user}
            />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader onMenuClick={handleSidebarToggle} />

                    <section className="w-full">
                        <div className="">
                            <p className="text-gray-600 text-os-regular">
                                Selamat Datang,
                            </p>
                            <h1 className="font-bold text-os-title text-gray-900 capitalize">
                                {displayName}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Berikut adalah ringkasan aktivitas pengujian
                                Anda.
                            </p>
                        </div>

                        <hr className="border-1 border-os-primary my-2" />

                        {/* STATISTIKA SECTION (TETAP) */}
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
                                    colorClass="bg-blue-400 border-blue-300"
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
                                    colorClass="bg-red-400 border-blue-300"
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
                                    colorClass="bg-lime-500 border-blue-300"
                                    href="/admin/dosen"
                                />
                            </div>
                        </section>

                        <hr className="border-1 border-os-primary my-2" />

                        {/* NOTIFIKASI SECTION (UPDATED) */}
                        <section>
                            <div className="flex gap-os-8 items-center justify-start my-2">
                                <Bell size={18} />
                                <h2 className="font-bold text-os-regular text-gray-900">
                                    Notifikasi{" "}
                                    {notifikasi.length > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
                                            {notifikasi.length}
                                        </span>
                                    )}
                                </h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                {notifikasi && notifikasi.length > 0 ? (
                                    notifikasi.map((item, idx) => (
                                        <NotificationItem
                                            key={item.id || idx} // Gunakan ID unik dari backend
                                            item={item} // Pass seluruh objek item
                                            index={idx + 1}
                                        />
                                    ))
                                ) : (
                                    <div className="py-8 mt-2 text-center border-2 border-dashed rounded-lg bg-gray-50/50">
                                        <p className="text-gray-500 font-medium">
                                            Semua lengkap!
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Tidak ada notifikasi perbaikan yang
                                            diperlukan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </section>
                </div>

                <div className="mt-8">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
