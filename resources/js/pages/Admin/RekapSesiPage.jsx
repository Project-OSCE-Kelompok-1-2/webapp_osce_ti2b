import React, { useState, useEffect, useMemo } from "react"; // [1] Tambah Import Hooks
import { Link, usePage, router, Head } from "@inertiajs/react";
import { Search, ArrowLeft, Bookmark, Table2, Info } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsCopyright from "../../components/Copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsSearchBar from "../../components/searchbar";
import OsTableBody from "../../components/tablecontain";
import OsHeader from "../../components/Header";
import OsButton from "../../components/button";

const sesiColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16 shrink-0",
        classes: "justify-center items-center",
    },
    {
        key: "tanggal_sesi",
        content: "Tanggal & Waktu",
        width: "flex-1 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "jumlah_mahasiswa",
        content: "Jumlah Mahasiswa",
        width: "w-80 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-48 shrink-0",
        classes: "justify-center items-center px-4",
    },
];

export default function RekapSesiPage() {
    const { osce, sesi, filters, flash } = usePage().props;

    // 1. Ambil Data Full
    const allSesiData = Array.isArray(sesi) ? sesi : sesi?.data || [];

    // 2. State Filter & Pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // --- LOGIC INSTANT FILTER ---

    // A. Reset halaman saat search berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // B. Filter Data
    const filteredData = useMemo(() => {
        return allSesiData.filter((item) => {
            const term = searchTerm.toLowerCase();
            // Filter berdasarkan string tampilan sesi (Tanggal & Jam)
            return item.tampilan_sesi?.toLowerCase().includes(term);
        });
    }, [searchTerm, allSesiData]);

    // C. Slice Pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // D. Generate Pagination Links
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

    // --- TABLE ROWS MAPPING (Gunakan 'paginatedData') ---
    const sesiRows = paginatedData.map((item, index) => ({
        no: (currentPage - 1) * itemsPerPage + index + 1,
        tanggal_sesi: (
            <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                    {item.tampilan_sesi.split(" — ")[0]} {/* Tanggal */}
                </span>
                <span className="text-sm text-gray-500">
                    {item.tampilan_sesi.split(" — ")[1]} {/* Jam */}
                </span>
            </div>
        ),
        jumlah_mahasiswa: item.jumlah_mahasiswa + " Mahasiswa",
        action: (
            <OsButton
                name="primary"
                onClick={() =>
                    router.visit(
                        `/admin/rekap-nilai/${osce.id_osce}/sesi/${item.id_sesi}/mahasiswa`
                    )
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
            {/* <Head title={`Rekap Sesi - ${osce.nama_osce}`} /> */}
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader variant="goback" backLink="/admin/rekap-nilai" />

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
                        {/* <div className="flex gap-1 items-center justify-start my-2">
                            <Bookmark size={18} />
                            <h2 className="font-semibold text-lg p-1">
                                Menu Rekap Sesi
                            </h2>
                        </div> */}
                        <div className="flex gap-1 items-center justify-start my-2">
                            <Bookmark size={18} />
                            <h2 className="font-semibold text-lg">
                                Menu Rekap Sesi
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                            Pilih salah satu sesi (berdasarkan tanggal dan
                            waktu) <br />
                            untuk melihat daftar mahasiswa.
                        </p>

                        {/* SEARCH INSTANT */}
                        <OsSearchBar
                            search={searchTerm}
                            setSearch={setSearchTerm} // Instant update
                            placeholder="Cari tanggal atau jam..."
                        />

                        {/* <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Sesi
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            (Total: {totalItems} data)
                        </span>
                    </h2> */}
                        <div className="flex gap-1 items-center justify-start mb-2 mt-4">
                            <Table2 size={18} />
                            <h2 className="font-semibold text-lg">
                                Table Sesi
                            </h2>
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Total: {totalItems} data)
                            </span>
                        </div>

                        <section className="bg-white p-5 border border-os-primary overflow-x-auto rounded-xl shadow-sm">
                            <div className="min-w-max">
                                <OsTableHeader columns={sesiColumns} />
                                {filteredData.length > 0 ? (
                                    <OsTableBody
                                        data={sesiRows}
                                        columns={sesiColumns}
                                    />
                                ) : (
                                    <div className="flex items-center border-t border-gray-400">
                                        <p className="w-full text-center text-sm py-6 mt-2 text-gray-500">
                                            Data rekap sesi tidak ditemukan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* PAGINATION CLIENT-SIDE */}
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
