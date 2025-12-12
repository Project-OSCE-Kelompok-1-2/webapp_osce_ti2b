import React, { useState, useEffect, useMemo } from "react"; // [1] Import Hooks
import { Link, usePage, router, Head } from "@inertiajs/react";
import { Search, ArrowLeft } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsCopyright from "../../components/Copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsHeader from "../../components/Header";
import OsSearchBar from "../../components/searchbar.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsInput from "../../components/input.jsx";

const mahasiswaColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16 shrink-0",
        classes: "justify-center items-center",
    },
    {
        key: "nim_mahasiswa",
        content: "NIM Mahasiswa",
        width: "w-80 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "nama_mahasiswa",
        content: "Nama Mahasiswa",
        width: "w-[350px] flex-1 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-48 shrink-0",
        classes: "justify-center items-center px-4",
    },
];

export default function RekapMahasiswaPage() {
    const { osce, sesi, mahasiswa_list, filters, flash } = usePage().props;

    // 1. Ambil Data Full
    const allData = Array.isArray(mahasiswa_list)
        ? mahasiswa_list
        : mahasiswa_list?.data || [];

    // 2. State Filter & Pagination
    const [search, setSearch] = useState("");
    const [angkatan, setAngkatan] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    const angkatanList = [
        { value: "", label: "Semua Angkatan" },
        { value: "2025", label: "2025" },
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
        // Anda bisa menambahkan opsi dinamis jika ada props 'listAngkatan'
    ];

    // --- INSTANT FILTER LOGIC ---

    // A. Reset halaman saat filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search, angkatan]);

    // B. Filter Data
    const filteredData = useMemo(() => {
        return allData.filter((item) => {
            // Filter Search (Nama atau NIM)
            const term = search.toLowerCase();
            const matchSearch =
                item.nama?.toLowerCase().includes(term) ||
                item.nim?.toLowerCase().includes(term);

            // Filter Angkatan (Kelas)
            // Asumsi: field di DB adalah 'kelas', sesuaikan jika beda
            let matchAngkatan = true;
            if (angkatan) {
                matchAngkatan = item.kelas === angkatan;
            }

            return matchSearch && matchAngkatan;
        });
    }, [search, angkatan, allData]);

    // C. Pagination Slice
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

    // --- TABLE ROWS MAPPING (Gunakan 'paginatedData') ---
    const tableData = paginatedData.map((item, index) => ({
        no: (currentPage - 1) * itemsPerPage + index + 1,
        nim_mahasiswa: item.nim,
        nama_mahasiswa: item.nama,
        action: (
            <button
                onClick={() =>
                    router.visit(
                        `/admin/rekap-nilai/mahasiswa/${item.id_mahasiswa}/osce/${osce.id_osce}`
                    )
                }
                className="bg-blue-600 h-[38px] w-full max-w-[100px] text-white text-os-small rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
                Lihat Nilai
            </button>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head
                title={`Mahasiswa Sesi ${sesi.tanggal_formatted} - ${osce.nama_osce}`}
            />
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="grid w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                <OsHeader
                    variant="goback"
                    backLink={`/admin/rekap-nilai/${osce.id_osce}/sesi`}
                />

                <div className="flex-1 overflow-auto">
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

                    <h2 className="font-semibold text-lg mb-1">
                        Menu Nilai Mahasiswa
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Daftar mahasiswa yang ter-enroll di sesi tanggal{" "}
                        {sesi.tanggal_formatted}.
                    </p>

                    {/* SEARCH INSTANT */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch} // Update state langsung
                        placeholder="Cari NIM atau Nama Mahasiswa..."
                    >
                        <OsInput
                            type="select"
                            value={angkatan}
                            onChange={(e) => setAngkatan(e.target.value)} // Update state langsung
                            options={angkatanList}
                            className="w-[160px]"
                        />
                    </OsSearchBar>

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Mahasiswa
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            (Total: {totalItems} data)
                        </span>
                    </h2>

                    <div className="w-full overflow-x-auto pb-4">
                        <div className="min-w-max">
                            <OsTableHeader columns={mahasiswaColumns} />
                            {filteredData.length > 0 ? (
                                <OsTableBody
                                    data={tableData}
                                    columns={mahasiswaColumns}
                                />
                            ) : (
                                <div className="flex items-center border-t border-gray-400">
                                    <p className="w-full text-center text-sm py-4 text-gray-500">
                                        Data mahasiswa tidak ditemukan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PAGINATION CLIENT-SIDE */}
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
