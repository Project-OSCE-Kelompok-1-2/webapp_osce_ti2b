import React, { useState, useEffect, useMemo } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import { Search, Bookmark, Table2, Info } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsCopyright from "../../components/Copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsHeader from "../../components/Header";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsInput from "../../components/input.jsx";
import OsButton from "../../components/button.jsx";

const rekapColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16 shrink-0",
        classes: "justify-center items-center",
    },
    {
        key: "nama_osce",
        content: "Nama OSCE",
        width: "w-[350px] flex-1 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "rentang_tanggal",
        content: "Rentang Tanggal",
        width: "w-80 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "tahun_akademik",
        content: "Tahun Akademik",
        width: "w-48 shrink-0",
        classes: "justify-center items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-48 shrink-0",
        classes: "justify-center items-center px-4",
    },
];

export default function RekapOscePage() {
    // 1. Ambil Data Full
    const { osce, flash, tahunAkademikOptions } = usePage().props;
    const allData = Array.isArray(osce) ? osce : osce?.data || [];

    // 2. State Filter & Pagination
    const [search, setSearch] = useState("");
    const [tahun, setTahun] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // Siapkan list opsi tahun
    const tahunList = [
        { value: "", label: "Semua Tahun" },
        ...(Array.isArray(tahunAkademikOptions) ? tahunAkademikOptions : []),
    ];

    // --- HELPER FUNCTIONS ---
    const formatDateIndo = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    const formatRentang = (rawString) => {
        if (!rawString) return "-";
        if (typeof rawString === "string" && rawString.includes(" - ")) {
            const [start, end] = rawString.split(" - ");
            return `${formatDateIndo(start)} - ${formatDateIndo(end)}`;
        }
        return formatDateIndo(rawString);
    };

    // --- LOGIC INSTANT FILTER ---

    // A. Reset halaman ke 1 saat filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search, tahun]);

    // B. Filter Data (Client Side)
    const filteredData = useMemo(() => {
        return allData.filter((item) => {
            // Filter Search (Nama OSCE)
            const term = search.toLowerCase();
            const matchSearch = item.nama_osce?.toLowerCase().includes(term);

            // Filter Tahun (ID Tahun Akademik)
            let matchTahun = true;
            if (tahun) {
                // Bandingkan sebagai string untuk keamanan tipe data
                matchTahun = String(item.id_tahun_akademik) === String(tahun);
            }

            return matchSearch && matchTahun;
        });
    }, [search, tahun, allData]);

    // C. Pagination Slice
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // D. Link Generator
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

    // --- TABLE ROWS MAPPING ---
    const tableData = paginatedData.map((item, index) => ({
        no: (currentPage - 1) * itemsPerPage + index + 1,
        nama_osce: (
            <div className="text-left px-4">
                <div className="font-medium text-gray-900">
                    {item.nama_osce}
                </div>
                <div className="text-sm text-gray-500">
                    {item.detail_mahasiswa || ""}
                    {item.detail_mahasiswa && item.detail_sesi && " | "}
                    {item.detail_sesi || ""}
                </div>
            </div>
        ),
        rentang_tanggal: (
            <span className="text-sm text-gray-700 whitespace-nowrap">
                {item.rentang_tanggal
                    ? formatRentang(item.rentang_tanggal)
                    : item.tanggal_mulai
                    ? `${formatDateIndo(item.tanggal_mulai)} - ${formatDateIndo(
                          item.tanggal_selesai
                      )}`
                    : "-"}
            </span>
        ),
        // Handle tampilan tahun akademik (Object Relasi atau String)
        tahun_akademik: item.tahun_akademik?.tahun
            ? `${item.tahun_akademik.tahun} - ${item.tahun_akademik.semester}`
            : item.tahun_akademik || "-",

        action: (
            <OsButton
                name="primary"
                onClick={() =>
                    router.visit(`/admin/rekap-nilai/${item.id_osce}/sesi`)
                }
                className="bg-os-primary h-[38px] w-full max-w-[100px] text-white text-os-small rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
                <Info size={18} />
                Detail
            </OsButton>
        ),
    }));

    return (
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader onMenuClick={handleSidebarToggle} />

                    <div className="flex-1 overflow-auto p-1">
                        {/* Notifikasi */}
                        {flash.success && (
                            <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
                                {flash.success}
                            </div>
                        )}
                        {flash.error && (
                            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
                                {flash.error}
                            </div>
                        )}

                        {/* <h2 className="font-semibold text-lg mb-1">
                        Menu Rekap Nilai
                    </h2> */}
                        <div className="flex gap-1 items-center justify-start my-2">
                            <Bookmark size={18} />
                            <h2 className="font-semibold text-lg">
                                Menu Rekap Nilai
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                            Pilih OSCE yang telah selesai untuk melihat
                            rekapitulasi nilai mahasiswa.
                        </p>

                        {/* SEARCH & FILTER SECTION (UPDATED) */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-2">
                            <div className="flex-grow">
                                <OsSearchBar
                                    search={search}
                                    setSearch={setSearch}
                                    placeholder="Cari data OSCE..."
                                />
                            </div>

                            {/* Dropdown Filter Tahun Akademik */}
                            <div className="w-full sm:w-64 shrink-0">
                                <OsInput
                                    type="select"
                                    value={tahun}
                                    onChange={(e) => {
                                        const val = e.target
                                            ? e.target.value
                                            : e;
                                        setTahun(val);
                                    }}
                                    options={tahunList}
                                    className="h-[46px]"
                                />
                            </div>
                        </div>

                        {/* <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table OSCE
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            (Total: {totalItems} data)
                        </span>
                    </h2> */}
                        <div className="flex gap-1 items-center justify-start mb-2">
                            <Table2 size={18} />
                            <h2 className="font-semibold text-lg">
                                Tabel OSCE
                            </h2>
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Total: {totalItems} data)
                            </span>
                        </div>

                        {/* TABEL */}
                        <section className="bg-white p-5 border border-os-primary overflow-x-auto rounded-xl shadow-sm">
                            <div className="min-w-max">
                                <OsTableHeader columns={rekapColumns} />
                                {filteredData.length > 0 ? (
                                    <OsTableBody
                                        data={tableData}
                                        columns={rekapColumns}
                                    />
                                ) : (
                                    <div className="flex items-center border-t border-gray-400">
                                        <p className="w-full text-center text-sm py-4 text-gray-500">
                                            Data rekap nilai tidak ditemukan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="mt-8">
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

                <div className="">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
