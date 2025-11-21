import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react"; // Pastikan Link di-import
import {
    ClipboardList,
    Users,
    UserCheck,
    ExternalLink,
    Bookmark,
} from "lucide-react";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import Sidebar from "../../components/Sidebar.jsx";

/**
 * props: title, value, description, icon, colorClass, href
 */
// [UBAH] Tambahkan 'href' sebagai properti
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

/**
 * NotificationItem: layout sesuai mock
 */
const NotificationItem = ({ stase, index }) => {
    // Komponen ini tidak diubah
    return (
        <div className="flex items-center justify-between bg-white border rounded-lg  overflow-hidden">
            {/* Left: number */}
            <div className="flex items-center px-4 py-4 border-r">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                    {index}
                </div>
            </div>

            {/* Middle: title + subtitle */}
            <div className="flex-1 px-4 py-4">
                <h4 className="font-semibold text-gray-800">
                    {stase.nama_stase}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{stase.sub_judul}</p>
            </div>

            {/* Right: pill + external link */}
            <div className="flex items-center gap-3 px-4 py-4">
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
    );
};

export default function Dashboard() {
    // fallback aman jika props belum ada
    const {
        stats = { total_osce: 0, total_mahasiswa: 0, total_penguji: 0 },
        notifikasi = [],
    } = usePage().props || {};
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // format angka (2 digit seperti mock)
    const totalOsce = (stats.total_osce ?? 0).toString().padStart(2, "0");
    const totalMahasiswa = (stats.total_mahasiswa ?? 0)
        .toString()
        .padStart(2, "0");
    const totalPenguji = (stats.total_penguji ?? 0).toString().padStart(2, "0");

    return (
        <div className="relative bg-gray-50 w-full min-h-screen flex justify-start font-sans overflow-hidden">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main
                className={`flex flex-col flex-1 transition-all duration-300 ${
                    sidebarOpen ? "md:ml-64" : "md:ml-20"
                } p-os-20 gap-os-12`}
            >
                {/* Header / Breadcrumb */}
                <OsHeader/>

                {/* MAIN */}
                <div className="flex-1 overflow-auto">
                    {/* Statistika */}
                    <section className="mb-8">
                        <h2 className="font-bold text-lg text-gray-900 mb-4">
                            Statistika
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* [UBAH] Tambahkan prop 'href' di sini */}
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
                                colorClass="bg-blue-50 border-blue-200"
                                href="/admin/osce" // <-- Tautan ke menu OSCE
                            />
                            {/* [UBAH] Tambahkan prop 'href' di sini */}
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
                                colorClass="bg-white border-gray-200"
                                href="/admin/mahasiswa" // <-- Tautan ke menu Mahasiswa
                            />
                            {/* [UBAH] Tambahkan prop 'href' di sini */}
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
                                colorClass="bg-white border-gray-200"
                                href="/admin/dosen" // <-- Tautan ke menu Dosen (Asumsi Penguji = Dosen)
                            />
                        </div>
                    </section>

                    {/* Notifikasi */}
                    <section>
                        <h2 className="font-bold text-lg text-gray-900 mb-4">
                            Notifikasi
                        </h2>

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
                                <p className="text-sm text-gray-500 text-center py-4 bg-white border rounded-lg">
                                    Tidak ada notifikasi.
                                </p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-8">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
