import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

// Sidebar khusus Penguji
import SidebarPenguji from "../../components/SidebarPenguji";

// Layout & Components
import OsCopyright from "../../components/Copyright";
import OsHeader from "../../components/Header";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsTableBody from "../../components/tablecontain";

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

// Button Style
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
    // State Data OSCE
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search & Filter Tahun
    const [search, setSearch] = useState("");
    const [tahun, setTahun] = useState("2025/2026");

    const tahunList = [
        { value: "2025/2026", label: "2025/2026" },
        { value: "2024/2025", label: "2024/2025" },
        { value: "2023/2024", label: "2023/2024" },
    ];

    // =============================
    // FETCH LOGIC
    // =============================
    const fetchData = async () => {
        try {
            setLoading(true);

            // Kirim query ke backend
            const res = await fetch(
                `/penguji/osce?search=${search}&tahun=${tahun}`
            );
            const json = await res.json();

            setData(json.data || []);
        } catch (error) {
            console.error("Gagal fetch OSCE:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch pertama kali saat halaman dibuka
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch ulang ketika search atau tahun berubah
    useEffect(() => {
        fetchData();
    }, [search, tahun]);

    // Mapping data ke tabel
    const mappedData = data.map((item, index) => {
        const btn = getButtonStyle(item.status);

        return {
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
                    className={`${btn.className} h-[38px] w-full max-w-[140px] rounded-lg text-sm font-medium`}
                >
                    {btn.label}
                </button>
            ),
        };
    });

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title="Jadwal OSCE" />

            {/* Sidebar Penguji */}
            <SidebarPenguji />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
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
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col md:flex-row items-center gap-4 mb-5"
                    >
                        <input
                            type="text"
                            placeholder="Cari data OSCE..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full md:flex-1 pl-4 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg"
                        />

                        <div className="flex w-full md:w-auto items-center gap-3">
                            <select
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)}
                                className="border border-gray-700 rounded-lg h-[46px] w-full md:w-40"
                            >
                                {tahunList.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-[46px] px-5"
                            >
                                Cari
                            </button>
                        </div>
                    </form>

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Daftar OSCE
                    </h2>

                    {loading ? (
                        <p className="text-gray-600 text-sm">Memuat data...</p>
                    ) : (
                        <>
                            <OsTableHeader columns={osceColumns} />
                            <OsTableBody
                                data={mappedData}
                                columns={osceColumns}
                            />
                        </>
                    )}

                    <div className="mt-8">
                        <OsPagination />
                    </div>
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
