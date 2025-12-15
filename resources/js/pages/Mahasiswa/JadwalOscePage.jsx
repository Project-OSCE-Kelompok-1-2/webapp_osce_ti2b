import React, { useState, useEffect, useMemo, useCallback } from "react";
// Import library dari Inertia untuk handling head dan router
import { Head, router } from "@inertiajs/react";
// Import ikon dari library lucide-react
import { Calendar, Clock, Timer, CheckSquare, ChevronDown } from "lucide-react";

// Sesuaikan path import komponen UI Anda
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsSearchBar from "../../components/searchbar.jsx";

// ============================================
// --- KOMPONEN UTAMA HALAMAN ---
// ============================================
export default function JadwalOsce({
    examHeader,
    jadwalStase,
    enrollmentDates,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ============================================
    // 1. LOGIKA COUNTDOWN
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

    const countdownColorClass = useMemo(() => {
        if (isFinished) return "bg-gray-700 shadow-xl shadow-gray-300";
        const { days } = timeLeft;
        if (days <= 1)
            return "bg-red-600 shadow-xl shadow-red-300 hover:bg-red-700";
        else if (days <= 3)
            return "bg-orange-600 shadow-xl shadow-orange-300 hover:bg-orange-700";
        else return "bg-blue-600 shadow-xl shadow-blue-300 hover:bg-blue-700";
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

    // Generator Links Pagination (Client-Side)
    const paginationLinks = useMemo(() => {
        if (totalPages <= 1) return [];

        const links = [];

        links.push({
            url: currentPage > 1 ? `?page=${currentPage - 1}` : null,
            label: "&laquo; Previous",
            active: false,
        });

        for (let i = 1; i <= totalPages; i++) {
            links.push({
                url: `?page=${i}`,
                label: i.toString(),
                active: i === currentPage,
            });
        }

        links.push({
            url: currentPage < totalPages ? `?page=${currentPage + 1}` : null,
            label: "Next &raquo;",
            active: false,
        });

        return links;
    }, [currentPage, totalPages]);

    // --- Definisi Kolom Tabel ---
    const tableColumns = [
        {
            content: "No",
            key: "no",
            width: "w-[40px] md:w-16 shrink-0",
            classes: "flex items-center justify-center f",
        },
        {
            content: "Stase Keterampilan Klinik",
            key: "stase",
            width: "flex-1 min-w-[300px]",
            classes: "flex items-center justify-start px-3 md:px-6 ",
        },
        {
            content: "Penguji",
            key: "penguji",
            width: "w-[150px] md:w-[250px] shrink-0",
            classes:
                "hidden sm:flex items-center text-start px-6  leading-relaxed ",
        },
        {
            content: "Ruangan",
            key: "ruangan",
            width: "w-48 shrink-0",
            classes: "flex items-center justify-center  text-center",
        },
        {
            content: "Waktu",
            key: "waktu",
            width: "w-44 shrink-0",
            classes: "flex items-center justify-center text-sm font-medium",
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
    // 4. HELPER COMPONENT (Untuk Baris Timer)
    // ============================================
    const TimerSegment = ({ value, label }) => (
        <div className="flex flex-col items-center justify-center min-w-[60px] md:min-w-[80px]">
            <div className="text-white text-3xl md:text-5xl font-extrabold mb-1">
                {value.toString().padStart(2, "0")}
            </div>
            <div className="text-blue-100 text-xs md:text-sm font-medium">
                {label}
            </div>
        </div>
    );

    // ============================================
    // 5. RENDER UI
    // ============================================
    return (
        // PERBAIKAN 1: Tambahkan overflow-x-hidden pada wrapper utama
        // untuk mencegah scroll horizontal yang tidak diinginkan dari elemen yang kelebihan lebar.
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-x-hidden">
            {/* <Head title="Jadwal OSCE" /> */}
            <Sidebar
                type="mahasiswa"
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* PERBAIKAN 2:
                - Gunakan `flex-1` agar `<main>` mengambil sisa lebar yang tersedia.
                - Hapus `w-full` yang redundan.
                - Gunakan `max-w-full` untuk mencegah elemen di dalam `<main>` mendorongnya melebihi lebar viewport.
                - Atur `margin-left` secara kondisional hanya untuk layar besar (`lg+`) saat sidebar terbuka.
            */}
            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader
                        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                        variant="mahasiswa"
                    />

                    <div className="flex-1 overflow-auto p-1">
                        {/* Judul Halaman */}
                        <div className="flex gap-1 items-center justify-start my-2">
                            <Calendar size={20} />
                            <h2 className="font-semibold text-xl">
                                Jadwal Stase Mahasiswa
                            </h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 max-w-2xl text-justify">
                            Informasi detail ujian OSCE Anda, termasuk tanggal,
                            waktu, dan hitung mundur menuju ujian.
                        </p>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 mb-2">
                            {/* KIRI: Info Detail Ujian & Filter Tanggal */}
                            <div className="lg:col-span-7 bg-green-600 rounded-xl p-6 shadow-sm border w-full">
                                <div className="rounded-full text-white">
                                    <Calendar size={24} />
                                </div>
                                <h2 className="text-xl py-2 font-bold text-white">
                                    {examHeader?.judul || "Detail Ujian OSCE"}
                                </h2>

                                <hr className="border-1 border-white" />

                                {/* Area Pemilihan Tanggal */}
                                <div className="py-2 w-full">
                                    <p className="text-sm font-medium text-white mb-2 w-full">
                                        Pilih Tanggal Ujian:
                                    </p>
                                    <div className="relative inline-block w-full">
                                        <select
                                            value={selectedDateRaw || ""}
                                            onChange={handleDateSelect}
                                            className="appearance-none bg-white text-green-700 p-3 pr-10 rounded-lg border border-blue-200 w-full shadow-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                                enrollmentDates.map(
                                                    (dateItem) => (
                                                        <option
                                                            key={
                                                                dateItem.date_raw
                                                            }
                                                            value={
                                                                dateItem.date_raw
                                                            }
                                                        >
                                                            {
                                                                dateItem.date_label
                                                            }
                                                        </option>
                                                    )
                                                )
                                            )}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-700">
                                            <ChevronDown className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Waktu dan Tanggal Terpilih */}
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <div className="flex flex-1 items-center gap-3 bg-os-primary-mhs text-white p-4 rounded-xl min-w-[180px]">
                                        <Calendar
                                            size={20}
                                            className="shrink-0"
                                        />
                                        <div>
                                            <p className="text-xs opacity-80">
                                                Tanggal Terpilih
                                            </p>
                                            <p className="lg:text-lg text-sm font-semibold">
                                                {examHeader?.tanggal_formatted ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 items-center gap-3 bg-os-primary-mhs text-white p-4 rounded-xl min-w-[140px]">
                                        <Clock size={20} className="shrink-0" />
                                        <div>
                                            <p className="text-xs opacity-80">
                                                Waktu Mulai
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {examHeader?.waktu_mulai || "-"}{" "}
                                                WIB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* KANAN: Countdown Timer */}
                            <div
                                className={`lg:col-span-5 rounded-xl ${countdownColorClass} p-6 text-white flex flex-col justify-between transition-colors duration-500`}
                            >
                                <div>
                                    <div className="flex flex-col gap-1 items-start mb-4 justify-start">
                                        <Clock size={20} />
                                        <h2 className="font-semibold text-xl">
                                            Countdown Ujian
                                        </h2>
                                    </div>

                                    <hr className="border-1 border-white" />
                                </div>

                                <p className="text-sm font-medium lg:mt-0 mt-2 text-white mb-2 w-full">
                                    Sisa waktu sebelum Osce Dimulai
                                </p>

                                <div>
                                    <div className="flex justify-between items-center text-center mt-4 lg:mt-0 px-2">
                                        {/* Menggunakan Helper Component TimerSegment */}
                                        <TimerSegment
                                            value={timeLeft.days}
                                            label="Hari"
                                        />
                                        <TimerSegment
                                            value={timeLeft.hours}
                                            label="Jam"
                                        />
                                        <TimerSegment
                                            value={timeLeft.minutes}
                                            label="Menit"
                                        />
                                        <TimerSegment
                                            value={timeLeft.seconds}
                                            label="Detik"
                                        />
                                    </div>
                                    {isFinished && (
                                        <p className="text-center text-red-700 mt-4 font-bold bg-white p-2 rounded-xl text-sm animate-pulse">
                                            Ujian Telah Dimulai / Selesai!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* --- TABLE SECTION: Jadwal Per Stase --- */}
                        <div className="mt-2">
                            <div className="flex gap-1 items-center justify-start my-2">
                                <CheckSquare size={18} />
                                <h2 className="font-semibold text-lg">
                                    Jadwal Stase ({selectedDateLabel})
                                </h2>
                            </div>

                            {/* Search Bar */}
                            <div className="mb-4">
                                <OsSearchBar
                                    search={search}
                                    setSearch={setSearch}
                                    placeholder="Cari stase, penguji, atau ruangan..."
                                />
                            </div>

                            {/* Table Container - Responsive Horizontal Scroll */}
                            {/* Pastikan container ini memiliki overflow-x-auto, yang sudah benar */}
                            <div className="bg-white p-5 border border-os-primary-mhs overflow-x-auto rounded-xl shadow-sm">
                                <div className="w-full pb-2 ">
                                    {/* Hapus overflow-x-auto yang redundan di sini */}
                                    <div className="min-w-max">
                                        <OsTableHeader
                                            columns={tableColumns}
                                            variant="mahasiswa"
                                        />
                                        {tableData.length > 0 ? (
                                            <OsTableBody
                                                data={tableData}
                                                columns={tableColumns}
                                                variant="mahasiswa"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 gap-3 border-t border-gray-100">
                                                {!isFinished ? (
                                                    <>
                                                        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                                                            <CheckSquare
                                                                size={32}
                                                            />
                                                        </div>
                                                        <p className="text-gray-800 font-bold text-lg">
                                                            Detail Stase
                                                            Terkunci
                                                        </p>
                                                        <p className="text-gray-500 text-sm text-center max-w-md">
                                                            Daftar stase,
                                                            penguji, dan ruangan
                                                            akan muncul otomatis
                                                            saat hitung mundur
                                                            berakhir dan ujian
                                                            dimulai.
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">
                                                        Data jadwal tidak
                                                        ditemukan untuk tanggal
                                                        ini.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <OsPagination
                                        links={paginationLinks}
                                        variant="mahasiswa"
                                        onPageChange={(page) => {
                                            setCurrentPage(Number(page));
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="">
                    <OsCopyright variant="mahasiswa" />
                </div>
            </main>
        </div>
    );
}
