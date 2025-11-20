import { Head } from "@inertiajs/react";
import React, { useState } from "react";

// Layout & Components
import Sidebar from "../../components/Sidebar";
import OsCopyright from "../../components/Copyright";
import OsHeader from "../../components/Header"; // ← pastikan path benar
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsTableBody from "../../components/tablecontain";

// Struktur kolom
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
        width: "w-48",
        classes: "justify-center",
    },
    {
        key: "tanggal_akhir",
        content: "Tanggal Akhir",
        width: "w-48",
        classes: "justify-center",
    },
    {
        key: "status",
        content: "Status",
        width: "w-32",
        classes: "justify-center",
    },
    {
        key: "action",
        content: "Action",
        width: "w-48",
        classes: "justify-center",
    },
];

export default function PengujiOsceList() {
    // Dummy Data Sementara
    const [data] = useState([
        {
            id: 1,
            nama: "OSCE Blok 3",
            tanggal_mulai: "2025-01-10",
            tanggal_akhir: "2025-01-12",
            jumlah_mahasiswa: "120",
            sesi: "4",
            status: "Aktif",
            buttonLabel: "Detail",
            buttonColor: "#2563eb",
        },
        {
            id: 2,
            nama: "OSCE Blok 5",
            tanggal_mulai: "2025-02-15",
            tanggal_akhir: "2025-02-16",
            jumlah_mahasiswa: "98",
            sesi: "3",
            status: "Belum Dimulai",
            buttonLabel: "Lihat",
            buttonColor: "#6b7280",
        },
    ]);

    const [search, setSearch] = useState("");
    const [tahun, setTahun] = useState("2025/2026");

    const tahunList = [
        { value: "2025/2026", label: "2025/2026" },
        { value: "2024/2025", label: "2024/2025" },
        { value: "2023/2024", label: "2023/2024" },
    ];

    // Formatting data untuk OsTableBody
    const mappedData = data.map((item, index) => ({
        no: index + 1,
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
        status: item.status,
        action: (
            <button
                className="h-[38px] w-full max-w-[100px] text-white text-os-small rounded-md"
                style={{ background: item.buttonColor }}
            >
                {item.buttonLabel}
            </button>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title="Jadwal OSCE" />
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* 🔹 HEADER BAR (dari komponen OsHeader) */}
                <OsHeader variant="goback" backLink="/penguji/dashboard" />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        Menu Jadwal OSCE
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Pilih OSCE untuk melihat jadwal, detail sesi, dan daftar
                        mahasiswa.
                    </p>

                    {/* 🔹 Filter Bar */}
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col md:flex-row items-center gap-4 mb-5"
                    >
                        <div className="relative w-full md:flex-1">
                            <input
                                type="text"
                                placeholder="Cari data OSCE..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-4 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex w-full md:w-auto items-center gap-3">
                            <select
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)}
                                className="border border-gray-700 rounded-lg h-[46px] flex-1 w-auto md:flex-none md:w-40 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {tahunList.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 w-auto justify-center"
                            >
                                Cari
                            </button>
                        </div>
                    </form>

                    {/* Header tabel */}
                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Daftar OSCE
                    </h2>
                    <OsTableHeader columns={osceColumns} />

                    {/* Body tabel */}
                    <OsTableBody data={mappedData} columns={osceColumns} />

                    {/* Dummy Pagination */}
                    <div className="mt-8">
                        <OsPagination
                            links={[
                                { label: "1", active: true },
                                { label: "2", active: false },
                                { label: "3", active: false },
                            ]}
                        />
                    </div>
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
