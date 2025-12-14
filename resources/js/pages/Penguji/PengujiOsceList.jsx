import { Head, usePage, router, Link } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, FileText, Table2 } from "lucide-react";

// Sidebar khusus Penguji
import Sidebar from "../../components/Sidebar";

// Layout & Components
import OsCopyright from "../../components/Copyright";
import OsHeader from "../../components/Header";
import OsTableHeader from "../../components/tableheader";
import OsTableBody from "../../components/tablecontain";

// PERBAIKAN DI SINI: Sesuaikan nama file import dengan 'pagination' (huruf kecil)
import OsPagination from "../../components/pagination";

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
        width: "flex-1 min-w-[400px]",
        classes: "justify-start items-center px-4",
    },
    {
        key: "tanggal_mulai",
        content: "Tanggal Mulai",
        width: "w-36 ",
        classes: "justify-center items-center",
    },
    {
        key: "tanggal_akhir",
        content: "Tanggal Akhir",
        width: "w-36 ",
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

// Logic Styling Tombol
const getButtonStyle = (status) => {
    switch (status) {
        case "Aktif":
            return { className: "bg-blue-600 hover:bg-blue-700 text-white" };
        case "Telah Dinilai":
            return {
                className: "bg-indigo-500 hover:bg-indigo-600 text-white",
            };
        case "Selesai":
            return {
                className:
                    "bg-os-primary-pj hover:bg-os-primary-pj-dark text-white",
            };
        case "Belum Dimulai":
            return { className: "bg-gray-400 hover:bg-gray-500 text-white" };
        default:
            return { className: "bg-blue-500 text-white" };
    }
};

export default function PengujiOsceList() {
    // 1. Ambil Data dari Props (Backend)
    const { osce_list, filters, tahun_options } = usePage().props;

    // Ambil data array dan meta pagination
    const dataItems = osce_list.data || [];
    const meta = osce_list; // object ini berisi current_page, links, dll.

    // 2. State Management
    const [search, setSearch] = useState(filters?.search || "");
    const [tahun, setTahun] = useState(filters?.tahun || "");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Ref untuk mencegah search jalan saat mount pertama kali
    const isFirstRun = useRef(true);

    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // --- LOGIKA FILTER SERVER-SIDE ---

    // A. Handle Search dengan Delay (Debounce manual)
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                window.location.pathname,
                { search: search, tahun: tahun },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // B. Handle Ganti Tahun (Langsung Reload)
    const handleTahunChange = (e) => {
        const selectedTahun = e.target.value;
        setTahun(selectedTahun);

        router.get(
            window.location.pathname,
            { search: search, tahun: selectedTahun },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    // --- MAPPING DATA KE FORMAT TABEL ---
    const mappedData = dataItems.map((item, index) => {
        const btn = getButtonStyle(item.status);
        let linkHref;

        if (item.status === "Aktif") {
            linkHref = `/penguji/osce/${item.id_osce}/stase/${item.id_osce_stase}`;
        } else if (item.status === "Telah Dinilai") {
            linkHref = `/penguji/osce/${item.id_osce}/stase/${item.id_osce_stase}/submitrubrik`;
        } else if (item.status === "Selesai") {
            linkHref = `/penguji/osce/${item.id_osce}/stase/${item.id_osce_stase}/rekap`;
        }

        const rowNumber = (meta.current_page - 1) * meta.per_page + index + 1;

        return {
            no: rowNumber,
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
                            : item.status === "Telah Dinilai"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {item.status}
                </span>
            ),
            action: (
                <Link
                    href={linkHref || "#"}
                    as="button"
                    disabled={item.status === "Belum Dimulai"}
                    className={`${
                        btn.className
                    } h-[38px] w-full max-w-[140px] rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                        item.status === "Belum Dimulai"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                    }`}
                >
                    {item.tombol_label}
                </Link>
            ),
        };
    });

    return (
        <div className="relative bg-orange-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title="Jadwal OSCE" />
            <Sidebar
                isOpen={isSidebarOpen}
                type="penguji"
                onToggle={handleSidebarToggle}
            />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader
                        backLink="/penguji/dashboard"
                        onMenuClick={handleSidebarToggle}
                        variant="penguji"
                    />

                    <div className="flex-1 overflow-auto">
                        <div className="flex gap-1 items-center justify-start my-2">
                            <FileText size={18} />
                            <h2 className="font-semibold text-lg">
                                Menu Jadwal OSCE
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                            Pilih OSCE untuk melihat jadwal, detail sesi, dan
                            daftar mahasiswa.
                        </p>

                        {/* Filter Bar */}
                        <div className="flex flex-col md:flex-row w-full items-stretch md:items-center gap-4 mb-5">
                            <input
                                type="text"
                                placeholder="Cari data OSCE secara instan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full md:flex-1 pl-4 pr-4 py-2 h-[46px] border border-os-primary-pj rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />

                            <div className="flex w-full md:w-auto items-stretch md:items-center gap-3">
                                <select
                                    value={tahun}
                                    onChange={handleTahunChange}
                                    className="border border-gray-700 rounded-lg h-[46px] w-full md:w-40 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Semua Tahun</option>
                                    {tahun_options &&
                                        tahun_options.map((t, index) => (
                                            <option key={index} value={t.tahun}>
                                                {t.tahun}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-1 items-center justify-start my-2">
                            <Table2 size={18} />
                            <h2 className="font-semibold text-lg">
                                Table Stase
                            </h2>
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Total: {meta.total} data)
                            </span>
                        </div>

                        {/* Tabel Data */}
                        <section className="bg-white p-5 border border-os-primary-pj overflow-x-auto rounded-xl shadow-sm">
                            <div className="min-w-[900px]">
                                {mappedData.length > 0 ? (
                                    <>
                                        <OsTableHeader
                                            columns={osceColumns}
                                            variant="penguji"
                                        />
                                        <OsTableBody
                                            data={mappedData}
                                            columns={osceColumns}
                                            variant="penguji"
                                        />
                                    </>
                                ) : (
                                    <div className="p-10 text-center border rounded-xl bg-white text-gray-500 flex flex-col items-center justify-center gap-2">
                                        <AlertCircle
                                            size={24}
                                            className="text-gray-400"
                                        />
                                        <p>Tidak ada data OSCE ditemukan.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Pagination Komponen Baru */}
                        {meta.last_page > 1 && (
                            <div className="mt-8 flex justify-center">
                                <OsPagination
                                    links={meta.links}
                                    variant="penguji"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8">
                    <OsCopyright variant="penguji" />
                </div>
            </main>
        </div>
    );
}
