import { Head, usePage, router, Link } from "@inertiajs/react";
import React, { useState, useEffect, useMemo } from "react"; // [1] Import Hooks

// Sidebar khusus Penguji
import Sidebar from "../../components/Sidebar";

// Layout & Components
import OsCopyright from "../../components/Copyright";
import OsHeader from "../../components/Header";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsTableBody from "../../components/tablecontain";

// Struktur kolom tabel
const osceColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
    },
    {
        key: "nama",
        content: "Nama OSCE",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key: "tanggal_mulai",
        content: "Tanggal Mulai",
        width: "w-32 ",
        classes: "justify-center items-center",
    },
    {
        key: "tanggal_akhir",
        content: "Tanggal Akhir",
        width: "w-32 ",
        classes: "justify-center items-center",
    },
    {
        key: "status",
        content: "Status",
        width: "w-32 ",
        classes: "justify-center items-center",
    },
    {
        key: "action",
        content: "Aksi",
        width: "w-52",
        classes: "justify-center items-center",
    },
];

// Button Style Logic
const getButtonStyle = (status) => {
    switch (status) {
        case "Aktif":
            return {
                label: "Mulai Ujian",
                className: "bg-blue-600 hover:bg-blue-700 text-white",
            };
        case "Tidak Aktif":
            return {
                label: "Ajukan Edit Nilai",
                className: "bg-blue-400 hover:bg-blue-500 text-white",
            };
        case "Selesai":
            return {
                label: "Lihat Rekap Nilai",
                className: "bg-blue-700 hover:bg-blue-800 text-white",
            };
        case "Belum Dimulai":
            return {
                label: "Lihat",
                className: "bg-gray-400 hover:bg-gray-500 text-white",
            };
        default:
            return { label: "Detail", className: "bg-blue-500 text-white" };
    }
};

export default function PengujiOsceList() {
    // 1. Ambil Data Full
    const { osce_list } = usePage().props;
    const allData = Array.isArray(osce_list)
        ? osce_list
        : osce_list?.data || [];

    // 2. State Search, Filter & Pagination
    const [search, setSearch] = useState("");
    const [tahun, setTahun] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    const tahunList = [
        { value: "", label: "Semua Tahun" },
        { value: "2025/2026", label: "2025/2026" },
        { value: "2024/2025", label: "2024/2025" },
        { value: "2023/2024", label: "2023/2024" },
    ];

    // --- INSTANT FILTER LOGIC ---

    // A. Reset halaman saat filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search, tahun]);

    // B. Filter Data
    const filteredData = useMemo(() => {
        return allData.filter((item) => {
            const term = search.toLowerCase();
            const matchSearch = item.nama?.toLowerCase().includes(term);

            let matchTahun = true;
            if (tahun) {
                // Asumsi: item.tahun_akademik dikirim dari controller
                // Filter "contains" agar lebih fleksibel (misal "2024" cocok dengan "2024/2025")
                matchTahun = item.tahun_akademik?.toString().includes(tahun);
            }

            return matchSearch && matchTahun;
        });
    }, [search, tahun, allData]);

    // C. Slice Pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // D. Generate Links
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

    // --- MAPPING DATA KE TABEL UI ---
    const mappedData = paginatedData.map((item, index) => {
        const btn = getButtonStyle(item.status);
        let linkHref;
        if (item.status === "Aktif") {
            linkHref = `/penguji/osce/${item.id_osce}/stase/${item.id_osce_stase}`;
        } else if (item.status === "Selesai") {
            linkHref = `/penguji/osce/${item.id_osce}/stase/${item.id_osce_stase}/rekap`;
        }

        return {
            no: (currentPage - 1) * itemsPerPage + index + 1,
            nama: (
                <div className="text-left px-2">
                    <div className="font-medium text-gray-900">{item.nama}</div>
                    <div className="text-xs text-gray-500">
                        {item.jumlah_mahasiswa} Mahasiswa | Sesi {item.sesi}
                    </div>
                </div>
            ),
            tanggal_mulai: item.tanggal_mulai,
            tanggal_akhir: item.tanggal_akhir,
            status: (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Aktif"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Belum Dimulai"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {item.status}
                </span>
            ),
            action: (
                <Link
                    href={linkHref || "#"}
                    as="button"
                    className={`${
                        btn.className
                    } h-[38px] w-full max-w-[140px] rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                        item.status === "Belum Dimulai"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                    }`}
                    disabled={item.status === "Belum Dimulai"}
                >
                    {btn.label}
                </Link>
            ),
        };
    });

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title="Jadwal OSCE" />
            <Sidebar
                isOpen={isSidebarOpen}
                type="penguji"
                onToggle={handleSidebarToggle}
            />

            <main className="grid w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                <OsHeader
                    backLink="/penguji/dashboard"
                    onMenuClick={handleSidebarToggle}
                />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        Menu Jadwal OSCE
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Pilih OSCE untuk melihat jadwal, detail sesi, dan daftar
                        mahasiswa.
                    </p>

                    {/* Filter Bar */}
                    <div className="flex flex-col md:flex-row w-full items-stretch md:items-center gap-4 mb-5">
                        <input
                            type="text"
                            placeholder="Cari data OSCE..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full md:flex-1 pl-4 pr-4 py-2 h-[46px] border border-os-primary rounded-lg"
                        />

                        <div className="flex w-full md:w-auto items-stretch md:items-center gap-3">
                            <select
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)} // Instant Update
                                className="border border-gray-700 rounded-lg h-[46px] w-full md:w-40 bg-white"
                            >
                                {tahunList.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                            {/* Tombol Cari dihapus atau dijadikan dummy karena instant search */}
                        </div>
                    </div>

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Daftar OSCE
                    </h2>

                    {/* Tabel Data */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[900px]">
                            {mappedData.length > 0 ? (
                                <>
                                    <OsTableHeader columns={osceColumns} />
                                    <OsTableBody
                                        data={mappedData}
                                        columns={osceColumns}
                                    />
                                </>
                            ) : (
                                <div className="p-10 text-center border rounded-xl bg-white text-gray-500">
                                    Tidak ada data OSCE ditemukan.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8">
                            <OsPagination
                                links={generatedLinks}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    )}
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
