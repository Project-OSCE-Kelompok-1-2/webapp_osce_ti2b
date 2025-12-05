import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    Calendar,
    Clock,
    Timer,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// --- PERBAIKAN IMPORT PATH ---
// Kita gunakan path relatif (../../) agar lebih aman jika alias '@' bermasalah
// Naik 3 level: Mahasiswa -> pages -> js -> components
import SidebarUniversal from "../../components/SidebarUniversal.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx"; // Pastikan nama file C besar jika filenya Copyright.jsx
import OsTableHeader from "../../components/tableheader.jsx"; // Pastikan nama file t kecil/besar sesuai aslinya
import OsTableBody from "../../components/tablecontain.jsx"; // Pastikan nama file t kecil/besar sesuai aslinya
import OsPagination from "../../components/pagination.jsx";

export default function JadwalOsce() {
    const { examHeader, jadwalStase } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // --- COUNTDOWN LOGIC ---
    useEffect(() => {
        if (!examHeader?.countdown_target) return;

        const targetDate = new Date(examHeader.countdown_target).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(
                        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    ),
                    minutes: Math.floor(
                        (distance % (1000 * 60 * 60)) / (1000 * 60)
                    ),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [examHeader]);

    // 1. Definisi Kolom
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

    // 2. Mapping Data dari Backend ke Format Tabel
    const tableData =
        jadwalStase?.data?.map((item, index) => ({
            id: item.id_osce_stase, // Key unik untuk React
            no:
                index +
                1 +
                (jadwalStase.current_page - 1) * jadwalStase.per_page,
            stase: item.stase?.nama_stase || "-",
            waktu: `${item.jam_mulai?.substring(
                0,
                5
            )} - ${item.jam_selesai?.substring(0, 5)}`,
            ruangan: item.ruang?.nama_ruang || "-",
            penguji: item.penguji?.pengguna?.nama || "-",
        })) || [];

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title="Jadwal OSCE" />

            {/* SIDEBAR */}
            <SidebarUniversal
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                type={"mahasiswa"}
            />

            {/* MAIN CONTENT WRAPPER */}
            <div className="bg-white w-full min-h-screen flex justify-center p-6 font-sans md:ml-20 transition-all duration-300">
                <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14">
                    {/* --- 1. HEADER --- */}
                    <OsHeader variant="default" className="w-full" />

                    <main className="flex flex-col gap-6">
                        {/* --- 2. Info Cards Section --- */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* Kartu Kiri: Info Ujian (Orange) */}
                            <div className="lg:col-span-7 rounded-2xl bg-[#F77B07] p-6 text-white shadow-md relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Calendar
                                            size={28}
                                            className="text-white"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-bold">
                                        {examHeader?.judul || "Ujian OSCE"}
                                    </h2>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    {/* Tanggal */}
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 min-w-[180px]">
                                        <div className="bg-white text-[#F77B07] p-2 rounded-lg">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-orange-100 opacity-80">
                                                Tanggal
                                            </p>
                                            <p className="text-lg font-bold">
                                                {examHeader?.tanggal_formatted ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Waktu Mulai */}
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 min-w-[140px]">
                                        <div className="bg-white text-[#F77B07] p-2 rounded-lg">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-orange-100 opacity-80">
                                                Waktu Mulai
                                            </p>
                                            <p className="text-lg font-bold">
                                                {examHeader?.waktu_mulai || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Waktu Selesai */}
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 min-w-[140px]">
                                        <div className="bg-white text-[#F77B07] p-2 rounded-lg">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-orange-100 opacity-80">
                                                Waktu Selesai
                                            </p>
                                            <p className="text-lg font-bold">
                                                {examHeader?.waktu_selesai ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kartu Kanan: Waktu Tersisa (Orange) */}
                            <div className="lg:col-span-5 rounded-2xl bg-[#F77B07] p-6 text-white shadow-md flex flex-col justify-center">
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
                                    <div>
                                        <div className="text-[#0B0931] text-3xl md:text-4xl font-extrabold mb-1">
                                            {timeLeft.days}
                                        </div>
                                        <div className="text-orange-100 text-sm">
                                            Hari
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[#0B0931] text-3xl md:text-4xl font-extrabold mb-1">
                                            {timeLeft.hours}
                                        </div>
                                        <div className="text-orange-100 text-sm">
                                            Jam
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[#0B0931] text-3xl md:text-4xl font-extrabold mb-1">
                                            {timeLeft.minutes}
                                        </div>
                                        <div className="text-orange-100 text-sm">
                                            Menit
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[#0B0931] text-3xl md:text-4xl font-extrabold mb-1">
                                            {timeLeft.seconds}
                                        </div>
                                        <div className="text-orange-100 text-sm">
                                            Detik
                                        </div>
                                    </div>
                                </div>
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
                                    data={tableData}
                                    columns={tableColumns}
                                />
                            </div>

                            {/* Pagination */}
                            <div className="mt-4">
                                <OsPagination
                                    links={jadwalStase?.links || []}
                                />
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
