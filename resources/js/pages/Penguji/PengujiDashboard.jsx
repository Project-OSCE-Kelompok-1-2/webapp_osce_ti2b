import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import OsHeader from "../../components/Header";
import CustomDatePicker from "../../components/datepicker";
import OsCopyright from "../../components/Copyright";
import OsIcon from "../../components/icons";

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
        <div className="bg-white border rounded-xl shadow-sm px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div>
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                        {item.hari}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-blue-700 text-sm">
                        {item.nama_osce}
                    </h4>
                    <p className="text-xs text-gray-500">
                        {item.jumlah_mahasiswa} Mahasiswa | Sesi {item.sesi}
                    </p>
                </div>
            </div>

            <div>
                {item.status === "edit" ? (
                    <span className="px-4 py-2 rounded-full bg-yellow-400 text-white text-xs font-semibold">
                        Edit Nilai Belum Selesai
                    </span>
                ) : (
                    <span className="px-4 py-2 rounded-full bg-blue-200 text-blue-700 text-xs font-semibold">
                        OSCE Mendatang
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
    const { dashboard = {}, jadwal = [] } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const mendatang = dashboard.osce_mendatang ?? 0;
    const editNilai = dashboard.osce_edit ?? 0;
    const selesai = dashboard.osce_selesai ?? 0;

    return (
        <div className="relative bg-gray-50 w-full min-h-screen flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main
                className={`flex-1 p-6 transition-all duration-300 ${
                    sidebarOpen ? "md:ml-64" : "md:ml-20"
                }`}
            >
                {/* HEADER KOMPONEN UTAMA */}
                <OsHeader className="mb-6" />

                {/* WELCOME SECTION */}
                <div className="mb-6">
                    <p className="text-lg text-black">Selamat Datang!</p>
                    <h1 className="font-bold text-3xl my-2">
                        {dashboard.nama_penguji}
                    </h1>
                    <p className="text-gray-700 text-sm mt-1">
                        {dashboard.deskripsi ||
                            "Lorem ipsum dolor sit amet consectetur adipiscing elit"}
                    </p>
                </div>

                {/* STATISTIK */}
                <section className="my-6">
                    <div className="border-t border-b border-black">
                        <div className="py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard
                                    title="OSCE Mendatang"
                                    value={mendatang}
                                    icon={
                                        <OsIcon
                                            name="book"
                                            className="h-os-24 os-icon-dark"
                                        />
                                    }
                                />
                                <StatCard
                                    title="OSCE Edit Nilai"
                                    value={editNilai}
                                    icon={
                                        <OsIcon
                                            name="Edit"
                                            className="h-os-24 os-icon-dark"
                                        />
                                    }
                                />
                                <StatCard
                                    title="OSCE Selesai"
                                    value={selesai}
                                    icon={
                                        <OsIcon
                                            name="Mark (Yes)"
                                            className="h-os-24 os-icon-dark"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* JADWAL PENTING */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg text-gray-800">
                            Jadwal Penting
                        </h2>

                        <div className="flex items-center gap-3">
                            <CustomDatePicker />
                        </div>

                        <Link
                            href="/penguji/osce"
                            className="text-blue-400 text-sm hover:underline flex items-center gap-1"
                        >
                            Lihat Jadwal Lengkap
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        {jadwal.length > 0 ? (
                            jadwal.map((item, idx) => (
                                <JadwalCard key={idx} item={item} />
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4 bg-white border rounded-lg">
                                Tidak ada jadwal.
                            </p>
                        )}
                    </div>
                </section>

                {/* FOOTER COPYRIGHT */}
                <div className="mt-8">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
