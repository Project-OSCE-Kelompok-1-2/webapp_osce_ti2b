import React, { useState } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import { Search, ArrowLeft } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsCopyright from "../../components/Copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsSearchBar from "../../components/searchbar";
import OsTableBody from "../../components/tablecontain";
import OsHeader from "../../components/Header";

// --- Definisi Kolom Tabel ---
const sesiColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
    },
    {
        key: "tanggal_sesi",
        content: "Tanggal & Waktu", // Ubah judul kolom
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key: "jumlah_mahasiswa",
        content: "Jumlah Mahasiswa",
        width: "w-80",
        classes: "justify-start items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-48",
        classes: "justify-center items-center px-4",
    },
];

export default function RekapSesiPage() {
    const { osce, sesi, filters, flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            `/admin/rekap-nilai/${osce.id_osce}/sesi`,
            { search },
            { preserveState: true, replace: true }
        );
    };

    // 6. Siapkan untuk isi data tabel
    const sesiRows = sesi.data.map((item, index) => ({
        no: sesi.from + index,
        // PERBAIKAN: Gunakan 'tampilan_sesi' yang sudah ada jamnya
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
            <button
                onClick={() =>
                    router.visit(
                        `/admin/rekap-nilai/${osce.id_osce}/sesi/${item.id_sesi}/mahasiswa`
                    )
                }
                className="bg-gray-800 h-[38px] w-full max-w-[100px] text-white text-os-small rounded-md hover:bg-gray-700"
            >
                Detail
            </button>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title={`Rekap Sesi - ${osce.nama_osce}`} />
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                <OsHeader variant="goback" backLink="/admin/rekap-nilai" />

                <div className="flex-1 overflow-auto">
                    {/* Notifikasi Sukses/Error */}
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
                        Menu Rekap Nilai
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Pilih salah satu sesi (berdasarkan tanggal dan waktu)
                        untuk melihat daftar mahasiswa.
                    </p>

                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari tanggal..."
                    />

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Sesi
                    </h2>
                    <OsTableHeader columns={sesiColumns} />

                    <OsTableBody data={sesiRows} columns={sesiColumns} />

                    {sesi.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data sesi tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {sesi.links && sesi.links.length > 3 && (
                        <div className="mt-8">
                            <OsPagination links={sesi.links} />
                        </div>
                    )}
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
