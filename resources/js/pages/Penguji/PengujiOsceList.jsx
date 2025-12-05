import { Head, usePage, router, Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

// Sidebar khusus Penguji
import SidebarPenguji from "../../components/SidebarPenguji";

// Layout & Components
import OsCopyright from "../../components/Copyright";
import OsHeader from "../../components/Header";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsTableBody from "../../components/tablecontain";
import Sidebar from "../../components/Sidebar";

// Struktur kolom tabel
const osceColumns = [
    { key: "no", content: "No", width: "w-16", classes: "justify-center" },
    {
        key: "nama",
        content: "Nama OSCE",
        width: "flex-1",
        classes: "justify-start px-4",
    },
    {
        key: "tanggal_mulai",
        content: "Tanggal Mulai",
        width: "w-32 sm:w-40 md:w-48",
        classes: "justify-center",
    },
    {
        key: "tanggal_akhir",
        content: "Tanggal Akhir",
        width: "w-32 sm:w-40 md:w-48",
        classes: "justify-center",
    },
    {
        key: "status",
        content: "Status",
        width: "w-32 sm:w-40 md:w-48",
        classes: "justify-center",
    },
    {
        key: "action",
        content: "Action",
        width: "w-32 sm:w-40 md:w-48-48",
        classes: "justify-center",
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
            return {
                label: "Detail",
                className: "bg-blue-500 text-white",
            };
    }
};

export default function PengujiOsceList() {
    // 1. AMBIL PROPS DARI INERTIA (Backend)
    const { osce_list, filters } = usePage().props;
    const { data, links, current_page, from } = osce_list; // Destructure data pagination
        const [sidebarOpen, setSidebarOpen] = useState(false);

    // State Search & Filter (Inisialisasi dari props filter agar persisten)
    const [search, setSearch] = useState(filters.search || "");
    const [tahun, setTahun] = useState(filters.tahun || "");

    const tahunList = [
        { value: "", label: "Semua Tahun" }, // Opsi default
        { value: "2025/2026", label: "2025/2026" },
        { value: "2024/2025", label: "2024/2025" },
        { value: "2023/2024", label: "2023/2024" },
    ];

    // 2. HANDLE FILTER CHANGE (Server-side Filtering via Inertia)
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/penguji/osce",
            { search, tahun },
            { preserveState: true, replace: true }
        );
    };

    // Auto-submit saat dropdown tahun berubah
    useEffect(() => {
        if (tahun !== filters.tahun) {
            router.get(
                "/penguji/osce",
                { search, tahun },
                { preserveState: true, replace: true }
            );
        }
    }, [tahun]);

    // 3. MAPPING DATA KE TABEL UI
    const mappedData = data.map((item, index) => {
        const btn = getButtonStyle(item.status);

        // Tentukan link berdasarkan status
        let linkHref;
        if (item.status === "Aktif") {
            // Ke halaman antrian (Live)
            linkHref = `/penguji/osce/${item.id_osce}/stase/${item.id_osce_stase}`;
        } else if (item.status === "Selesai") {
            // Ke halaman rekap (Read Only)
            linkHref = `/penguji/osce/${item.id_osce}/stase/${item.id_osce_stase}/rekap`;
        }

        return {
            no: from + index, // Nomor urut sesuai pagination
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
                    href={linkHref}
                    as="button"
                    className={`${btn.className} h-[38px] w-full max-w-[140px] rounded-lg text-sm font-medium transition-colors flex items-center justify-center`}
                    disabled={item.status === "Belum Dimulai"}
                >
                    {btn.label}
                </Link>
            ),
        };
    });

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start px-4 sm:px-6 md:px-os-12 py-os-12">
            <Head title="Jadwal OSCE" />

            {/* Sidebar Penguji */}
            {/* <SidebarPenguji /> */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} type={'penguji'}/>


            <main className="flex flex-col w-full px-4 sm:px-6 md:px-os-8 h-fit gap-os-14 ml-0 md:ml-20">
                <OsHeader variant="goback" backLink="/penguji/dashboard" />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        Menu Jadwal OSCE
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Pilih OSCE untuk melihat jadwal, detail sesi, dan daftar
                        mahasiswa.
                    </p>

                    {/* Filter Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row w-full items-stretch md:items-center gap-4 mb-5"
                    >
                        <input
                            type="text"
                            placeholder="Cari data OSCE..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full md:flex-1 pl-4 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg"
                        />

                        <div className="flex w-full md:w-auto items-stretch md:items-center gap-3">
                            <select
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)}
                                className="border border-gray-700 rounded-lg h-[46px] w-full md:w-40 bg-white"
                            >
                                {tahunList.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-[46px] px-5 transition-colors"
                            >
                                Cari
                            </button>
                        </div>
                    </form>

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Daftar OSCE
                    </h2>

                    {/* Tabel Data */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[900px]">
                            {data.length > 0 ? (
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
                            )}</div>
                            </div>

                    {/* Pagination */}
                    <div className="mt-8">
                        <OsPagination links={links} />
                    </div>
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
