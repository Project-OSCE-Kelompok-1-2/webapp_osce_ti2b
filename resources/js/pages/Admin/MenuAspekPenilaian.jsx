import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { Trash2, Home, Pencil, Search } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsTableHeader from "../../components/tableheader.jsx"; 
import OsSearchBar from "../../components/searchbar.jsx"; 
import OsTableBody from "../../components/tablecontain.jsx";


// Definisi kolom tabel 
const columns = [
    { key: "no", content: "No", width: "w-16", classes: "justify-center" },
    { key: "aspek", content: "Deskripsi", width: "flex-1", classes: "justify-start items-start px-4" },
    { key: "bobot_maksimum", content: "Bobot Maksimum", width: "w-[15%]", classes: "justify-center" },
    { key: "action", content: "Action", width: "w-[30%]", classes: "justify-center" },
];


export default function MenuAspekPenilaian() {
    // 1. Ambil data 'stase' dan 'aspek_penilaian' dari props
    const { stase, aspek_penilaian } = usePage().props;

    // 2. Fungsi untuk menghapus data
    const handleDeleteClick = (aspekId) => {
        if (confirm("Apakah kamu yakin ingin menghapus aspek ini?")) {
            // URL untuk hapus data, sesuai dengan shallow resource route
            router.delete(`/admin/aspek-penilaian/${aspekId}`, {
                preserveScroll: true,
            });
        }
    };

    // [BARU] Hitung total bobot dari data yang diterima
    const totalBobot = aspek_penilaian.data.reduce(
        (sum, item) => sum + item.bobot_maksimum,
        0
    );

    //3.Fungsi untuk menjalankkan pencarian
    const [search, setSearch] = useState("");

    const handleSearch = () => {
        router.get(
            `/admin/stase/${stase.id_stase}/aspek-penilaian`,
            { search },
            { preserveScroll: true, preserveState: true }
        );
    };

    //4.Fungsi untuk siapin data isi tabel
    const tableData = aspek_penilaian.data.map((item, index) => ({
        no: aspek_penilaian.from + index,
    
        aspek: (
            <div className="flex flex-col items-start leading-tight">
                <div className="font-semibold">{item.aspek}</div>
                <div className="text-xs text-gray-500">{item.jumlah_kompetensi} Kompetensi</div>
            </div>
        ),
    
        bobot_maksimum: item.bobot_maksimum,
    
        action: (
            <div className="flex justify-center gap-2">
                {/* Lihat Kompetensi */}
                <Link
                    href={`/admin/aspek-penilaian/${item.id_aspek_penilaian}/kompetensi`}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                    Lihat Kompetensi
                </Link>
    
                {/* Edit */}
                <Link
                    href={`/admin/aspek-penilaian/${item.id_aspek_penilaian}/edit`}
                    className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    title="Edit Aspek"
                >
                    <Pencil size={16} />
                </Link>
    
                {/* Delete */}
                <button
                    onClick={() => handleDeleteClick(item.id_aspek_penilaian)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    title="Hapus Aspek"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        ),
    }));
    
    return (
        <div className="relative bg-os-white w-full min-h-screen  flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* Header Breadcrumb (dibuat dinamis) */}
                <OsHeader variant="goback" backLink="/admin/stase"/>

                {/* Header Menu */}
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Menu Aspek Penilaian
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Halaman ini berfungsi untuk menambahkan aspek penilaian
                        pada stase "{stase.nama_stase}"
                    </p>
                </div>
                
                {/* Tombol Tambah diubah menjadi Link */}
                <div className="mb-4">
                    <Link
                        href={`/admin/stase/${stase.id_stase}/aspek-penilaian/create`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow font-medium"
                    >
                        ＋ Tambah Aspek Penilaian
                    </Link>
                </div>

                {/* Search */}
                <OsSearchBar
                    search={search}
                    setSearch={setSearch}
                    onSearchClick={handleSearch}
                    placeholder="Cari aspek penilaian..."
                />

                {/* Tabel Aspek Penilaian */}
                <h3 className="px-4 py-3 border-b text-gray-700 font-semibold text-lg">
                    Table Aspek Penilaian
                </h3>
                
                {/* header */}
                <OsTableHeader columns={columns} />

                    {tableData.length > 0 ? (
                        <OsTableBody data={tableData} columns={columns} />
                    ) : (
                        <div className="py-6 text-center text-gray-500">
                            Belum ada aspek penilaian untuk stase ini.
                        </div>
                    )}
               
                {/* Baris Total */}
                <div className="bg-os-white shadow rounded-lg overflow-x-auto mt-6">
                    <table className="w-full min-w-max">
                        <tfoot className="font-semibold">
                            <tr>
                                <td className="py-3 px-4 text-left text-base w-[55%]">
                                    Total Bobot
                                </td>
                                <td className="py-3 px-3 text-center text-base w-[15%]">
                                    {totalBobot}
                                </td>
                                <td className="py-3 px-3 text-center w-[30%]">
                                    {totalBobot !== 100 && totalBobot > 0 && (
                                        <button className="bg-red-600 text-white text-sm px-3 py-2 rounded-lg shadow-md">
                                            Point Tidak Seimbang!
                                        </button>
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer Copyright */}
                <div className="text-center text-gray-400 text-sm mt-16 border-t pt-4">
                    Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit
                    amet
                </div>
            </div>
        </div>
    );
}
