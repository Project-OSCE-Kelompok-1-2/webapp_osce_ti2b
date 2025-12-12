import React, { useState, useEffect, useMemo } from "react";
import { Head } from "@inertiajs/react";
import {
    Calendar,
    Clock,
    Timer,
    CheckSquare,
    Search, // Icon Search
} from "lucide-react";

// --- IMPORT KOMPONEN ---
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsSearchBar from "../../components/searchbar.jsx"; // [1] Import SearchBar

export default function JadwalOsce({ examHeader, jadwalStase }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // [2] Ambil Data Full (Handle baik Array maupun Object Paginator)
    const allStaseData = useMemo(() => {
        return Array.isArray(jadwalStase)
            ? jadwalStase
            : jadwalStase?.data || [];
    }, [jadwalStase]);

    // [3] State Filter & Pagination
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- INSTANT FILTER LOGIC ---
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filteredData = useMemo(() => {
        return allStaseData.filter((item) => {
            const term = search.toLowerCase();
            return (
                (item.stase_keterampilan || "").toLowerCase().includes(term) ||
                (item.penguji || "").toLowerCase().includes(term) ||
                (item.ruangan || "").toLowerCase().includes(term) ||
                (item.waktu || "").toLowerCase().includes(term)
            );
        });
    }, [search, allStaseData]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // [PENTING] Data yang ditampilkan di tabel adalah hasil slice ini
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const generatedLinks = useMemo(() => {
        if (totalPages <= 1) return [];
        const links = [];
        links.push({
            url: currentPage > 1 ? "#" : null,
            label: "&laquo; Previous",
            active: false,
            pageNumber: currentPage - 1,
        });
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                links.push({
                    url: "#",
                    label: i.toString(),
                    active: i === currentPage,
                    pageNumber: i,
                });
            } else if (
                (i === currentPage - 2 && i > 1) ||
                (i === currentPage + 2 && i < totalPages)
            ) {
                links.push({ url: null, label: "...", active: false });
            }
        }
        links.push({
            url: currentPage < totalPages ? "#" : null,
            label: "Next &raquo;",
            active: false,
            pageNumber: currentPage + 1,
        });
        return links;
    }, [currentPage, totalPages]);

    // --- STATE COUNTDOWN (TETAP) ---
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
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
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [examHeader]);

    // Definisi Kolom
    const tableColumns = [
        {
            content: "No",
            key: "no",
            width: "w-16 shrink-0",
            classes: "justify-center font-bold",
        },
        {
            content: "Stase Keterampilan Klinik",
            key: "stase",
            width: "w-[400px] flex-1 shrink-0",
            classes: "justify-start px-4",
        },
        {
            content: "Waktu",
            key: "waktu",
            width: "w-40 shrink-0",
            classes: "justify-center",
        },
        {
            content: "Ruangan",
            key: "ruangan",
            width: "w-32 shrink-0",
            classes: "justify-center",
        },
        {
            content: "Penguji",
            key: "penguji",
            width: "w-48 shrink-0",
            classes: "justify-start px-4",
        },
    ];

    // [PENTING] Mapping Data menggunakan 'paginatedData' (hasil slice), BUKAN jadwalStase mentah
    const tableData = paginatedData.map((item, index) => ({
        id: item.id_osce_stase,
        no: (currentPage - 1) * itemsPerPage + index + 1,
        stase: item.stase_keterampilan,
        waktu: item.waktu,
        ruangan: item.ruangan,
        penguji: item.penguji,
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            <Head title="Jadwal OSCE" />

            <Sidebar
                type="mahasiswa"
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            <main className="grid w-full p-4 md:p-8 lg:p-12 flex-1 grid-cols-1 grid-rows-[auto_1fr_auto] gap-8 transition-all duration-300 lg:ml-20">
                <OsHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                <div className="flex flex-col gap-6">
                    {/* INFO CARDS (TETAP SAMA) */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-7 rounded-2xl bg-blue-600 p-6 text-white shadow-md relative overflow-hidden">
                            {/* ... Isi Card Ujian ... */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Calendar
                                        size={28}
                                        className="text-white"
                                    />
                                </div>
                                <h2 className="text-2xl font-bold">
                                    {examHeader?.nama_ujian || "Ujian OSCE"}
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 min-w-[180px]">
                                    <div className="bg-white text-blue-600 p-2 rounded-lg">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-100 opacity-80">
                                            Tanggal
                                        </p>
                                        <p className="text-lg font-bold">
                                            {examHeader?.tanggal_formatted ||
                                                "-"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 min-w-[140px]">
                                    <div className="bg-white text-blue-600 p-2 rounded-lg">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-100 opacity-80">
                                            Waktu
                                        </p>
                                        <p className="text-lg font-bold">
                                            {examHeader?.waktu || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 rounded-2xl bg-blue-600 p-6 text-white shadow-md flex flex-col justify-center">
                            {/* ... Isi Card Countdown ... */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Timer size={24} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold">
                                    Waktu Tersisa
                                </h2>
                            </div>
                            <div className="flex justify-between items-center text-center px-2">
                                <div>
                                    <div className="text-white text-3xl md:text-4xl font-extrabold mb-1">
                                        {timeLeft.days
                                            .toString()
                                            .padStart(2, "0")}
                                    </div>
                                    <div className="text-blue-100 text-sm">
                                        Hari
                                    </div>
                                </div>
                                <div>
                                    <div className="text-white text-3xl md:text-4xl font-extrabold mb-1">
                                        {timeLeft.hours
                                            .toString()
                                            .padStart(2, "0")}
                                    </div>
                                    <div className="text-blue-100 text-sm">
                                        Jam
                                    </div>
                                </div>
                                <div>
                                    <div className="text-white text-3xl md:text-4xl font-extrabold mb-1">
                                        {timeLeft.minutes
                                            .toString()
                                            .padStart(2, "0")}
                                    </div>
                                    <div className="text-blue-100 text-sm">
                                        Menit
                                    </div>
                                </div>
                                <div>
                                    <div className="text-white text-3xl md:text-4xl font-extrabold mb-1">
                                        {timeLeft.seconds
                                            .toString()
                                            .padStart(2, "0")}
                                    </div>
                                    <div className="text-blue-100 text-sm">
                                        Detik
                                    </div>
                                </div>
                            </div>
                            {timeLeft.days <= 0 &&
                                timeLeft.hours <= 0 &&
                                timeLeft.minutes <= 0 &&
                                timeLeft.seconds <= 0 && (
                                    <p className="text-center text-red-700 mt-2 font-bold bg-white p-1 rounded">
                                        Ujian Telah Dimulai/Selesai!
                                    </p>
                                )}
                        </div>
                    </div>

                    {/* TABLE SECTION */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <CheckSquare size={32} className="text-black" />
                            <h2 className="text-2xl font-bold text-black">
                                Jadwal Per Stase
                            </h2>
                        </div>

                        {/* [4] SEARCH BAR */}
                        <div className="mb-4">
                            <OsSearchBar
                                search={search}
                                setSearch={setSearch} // Instant Update
                                placeholder="Cari stase, penguji, atau ruangan..."
                            />
                        </div>

                        {/* TABLE */}
                        <div className="w-full overflow-x-auto pb-4">
                            <div className="min-w-max border rounded-lg overflow-hidden">
                                <OsTableHeader columns={tableColumns} />
                                {tableData.length > 0 ? (
                                    <OsTableBody
                                        data={tableData}
                                        columns={tableColumns}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center border-t border-gray-200 py-8">
                                        <p className="text-gray-500 text-sm">
                                            {allStaseData.length === 0
                                                ? "Belum ada jadwal stase."
                                                : "Data tidak ditemukan."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="mt-4">
                                <OsPagination
                                    links={generatedLinks}
                                    onPageChange={(page) =>
                                        setCurrentPage(page)
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
