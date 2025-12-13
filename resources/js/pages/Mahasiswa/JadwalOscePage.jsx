import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Head, router } from "@inertiajs/react";
import { Calendar, Clock, Timer, CheckSquare } from "lucide-react";

// Sesuaikan path import komponen UI Anda
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsSearchBar from "../../components/searchbar.jsx";

export default function JadwalOsce({
    examHeader,
    jadwalStase,
    enrollmentDates,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ============================================
    // 1. LOGIKA COUNTDOWN PRESISI
    // ============================================

    const calculateTimeLeft = useCallback(() => {
        if (!examHeader?.countdown_target) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
        }

        const targetDate = new Date(examHeader.countdown_target).getTime();
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            total: difference,
        };
    }, [examHeader]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const initial = calculateTimeLeft();
        if (initial.total <= 0) {
            setIsFinished(true);
        } else {
            setIsFinished(false);
            setTimeLeft(initial);
        }

        const timer = setInterval(() => {
            const currentStats = calculateTimeLeft();
            if (currentStats.total <= 0) {
                clearInterval(timer);
                setIsFinished(true);
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    total: 0,
                });
            } else {
                setTimeLeft(currentStats);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    // ============================================
    // [BARU] LOGIKA WARNA DINAMIS
    // ============================================
    const countdownColorClass = useMemo(() => {
        if (isFinished) {
            return "bg-gray-700"; // Warna jika waktu habis
        }

        const { days } = timeLeft;

        if (days <= 1) {
            return "bg-red-600"; // H-1: Merah (Sangat Mendesak)
        } else if (days <= 3) {
            return "bg-orange-600"; // H-3: Oranye (Peringatan)
        } else if (days <= 5) {
            return "bg-teal-600"; // H-5: Hijau Teal (Mulai Bersiap)
        } else {
            return "bg-blue-600"; // Default: Biru
        }
    }, [timeLeft.days, isFinished]);

    // ============================================
    // 2. LOGIKA FILTER TANGGAL
    // ============================================

    const selectedDateRaw = useMemo(() => {
        return enrollmentDates?.find((date) => date.is_selected)?.date_raw;
    }, [enrollmentDates]);

    const selectedDateLabel = useMemo(() => {
        return (
            enrollmentDates?.find((date) => date.is_selected)?.date_label ||
            "Tanggal Tidak Dipilih"
        );
    }, [enrollmentDates]);

    const handleDateSelect = useCallback(
        (event) => {
            const dateRaw = event.target.value;
            if (dateRaw && dateRaw !== selectedDateRaw) {
                router.get(
                    "/mahasiswa/jadwal",
                    { date: dateRaw },
                    { preserveState: true, preserveScroll: true }
                );
            }
        },
        [selectedDateRaw]
    );

    // ============================================
    // 3. LOGIKA TABLE, SEARCH, & PAGINATION
    // ============================================

    const allStaseData = useMemo(() => {
        return Array.isArray(jadwalStase)
            ? jadwalStase
            : jadwalStase?.data || [];
    }, [jadwalStase]);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

    const tableData = paginatedData.map((item, index) => ({
        id: item.id_osce_stase,
        no: (currentPage - 1) * itemsPerPage + index + 1,
        stase: item.stase_keterampilan,
        waktu: item.waktu,
        ruangan: item.ruangan,
        penguji: item.penguji,
    }));

    // ============================================
    // 4. RENDER UI
    // ============================================
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
                    {/* --- HEADER INFO SECTION --- */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* KIRI: Info Detail Ujian (Tetap Biru) */}
                        <div className="lg:col-span-7 rounded-2xl bg-blue-600 p-6 text-white shadow-md relative overflow-hidden">
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

                            {/* Dropdown Tanggal */}
                            <div className="mb-6 pb-4 border-b border-white/20">
                                <p className="text-sm font-semibold text-blue-100 mb-2">
                                    Pilih Tanggal Ujian:
                                </p>
                                <div className="relative inline-block w-full sm:w-auto">
                                    <select
                                        value={selectedDateRaw || ""}
                                        onChange={handleDateSelect}
                                        className="appearance-none bg-white text-blue-600 p-3 pr-10 rounded-xl border border-white shadow-lg font-bold w-full sm:min-w-[200px] focus:outline-none focus:ring-2 focus:ring-white"
                                        disabled={
                                            !enrollmentDates ||
                                            enrollmentDates.length === 0
                                        }
                                    >
                                        {!enrollmentDates ||
                                        enrollmentDates.length === 0 ? (
                                            <option value="">
                                                Tidak ada jadwal aktif
                                            </option>
                                        ) : (
                                            enrollmentDates.map((dateItem) => (
                                                <option
                                                    key={dateItem.date_raw}
                                                    value={dateItem.date_raw}
                                                >
                                                    {dateItem.date_label}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-600">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Waktu */}
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
                                            {examHeader?.waktu_mulai || "-"} WIB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KANAN: Countdown Timer (BERUBAH WARNA) */}
                        {/* ClassName diganti menjadi variabel countdownColorClass */}
                        <div
                            className={`lg:col-span-5 rounded-2xl ${countdownColorClass} p-6 text-white shadow-md flex flex-col justify-center transition-colors duration-500`}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Timer size={24} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold">
                                    Waktu Tersisa
                                </h2>
                            </div>

                            {/* Angka Countdown */}
                            <div className="flex justify-between items-center text-center px-2">
                                <div>
                                    <div className="text-white text-3xl md:text-4xl font-extrabold mb-1">
                                        {timeLeft.days
                                            .toString()
                                            .padStart(2, "0")}
                                    </div>
                                    {/* Text-blue-100 tetap aman digunakan di atas background gelap (merah/orange) */}
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

                            {/* Pesan jika selesai */}
                            {isFinished && (
                                <p className="text-center text-red-700 mt-4 font-bold bg-white p-2 rounded-xl text-sm animate-pulse">
                                    Ujian Telah Dimulai / Selesai!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* --- TABLE SECTION --- */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <CheckSquare size={32} className="text-black" />
                            <h2 className="text-2xl font-bold text-black">
                                Jadwal Per Stase ({selectedDateLabel})
                            </h2>
                        </div>

                        <div className="mb-4">
                            <OsSearchBar
                                search={search}
                                setSearch={setSearch}
                                placeholder="Cari stase, penguji, atau ruangan..."
                            />
                        </div>

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
                                                ? "Belum ada jadwal stase yang sudah dilewati pada tanggal ini."
                                                : "Data tidak ditemukan."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-4">
                                <OsPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
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
