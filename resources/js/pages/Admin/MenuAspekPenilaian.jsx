import React from "react";
// 👇 [UBAH] Impor hook yang diperlukan dari Inertia
import { usePage, Link, router } from "@inertiajs/react";
import { Trash2, Home, Pencil, Search } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";

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

    return (
        <div className="relative bg-os-white w-full min-h-screen  flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* Header Breadcrumb (dibuat dinamis) */}
                <div className="flex items-center gap-3 text-sm text-gray-700 mb-6 border border-gray-400 rounded-lg p-2 bg-os-white shadow-sm">
                    <div className="bg-blue-600 text-white p-2 rounded-md flex items-center justify-center">
                        <Home size={20} />
                    </div>
                    <span className="font-medium">
                        Stase / {stase.nama_stase}
                    </span>
                </div>

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

                {/* Search Bar (untuk sementara statis, bisa diimplementasikan nanti) */}
                <div className="flex items-center w-full gap-3 mb-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari aspek penilaian..."
                            className="w-full border-2 border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                        />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg shadow font-medium">
                        Cari
                    </button>
                </div>

                {/* Tabel Aspek Penilaian */}
                <div className="bg-os-white shadow rounded-lg overflow-x-auto border border-gray-200">
                    <h3 className="px-4 py-3 border-b text-gray-700 font-semibold text-lg">
                        Table Aspek Penilaian
                    </h3>
                    <table className="w-full min-w-max">
                        {/* Header Tabel */}
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm font-medium border-b-2 border-gray-300">
                                <th className="py-3 px-3 text-center w-[5%]">
                                    No
                                </th>
                                <th className="py-3 px-4 text-left w-[50%] border-l border-gray-300">
                                    Deskripsi
                                </th>
                                <th className="py-3 px-3 text-center w-[15%] border-l border-gray-300">
                                    Bobot Maksimum
                                </th>
                                <th className="py-3 px-3 text-center w-[30%] border-l border-gray-300">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        {/* Body Tabel dinamis */}
                        <tbody>
                            {aspek_penilaian.data.length > 0 ? (
                                aspek_penilaian.data.map((item, index) => (
                                    <tr
                                        key={item.id_aspek_penilaian}
                                        className="text-gray-800 text-sm"
                                    >
                                        <td className="py-3 px-3 text-center">
                                            {aspek_penilaian.from + index}
                                        </td>
                                        <td className="py-3 px-4 border-l border-gray-300">
                                            <div className="font-semibold">
                                                {item.aspek}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {item.jumlah_kompetensi}{" "}
                                                Kompetensi
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-center border-l border-gray-300">
                                            {item.bobot_maksimum}
                                        </td>
                                        <td className="py-3 px-3 text-center border-l border-gray-300">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/admin/aspek-penilaian/${item.id_aspek_penilaian}/kompetensi`}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                                                >
                                                    Lihat Kompetensi
                                                </Link>
                                                <Link
                                                    href={`/admin/aspek-penilaian/${item.id_aspek_penilaian}/edit`}
                                                    className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                                    title="Edit Aspek"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            item.id_aspek_penilaian
                                                        )
                                                    }
                                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center py-6 text-gray-500"
                                    >
                                        Belum ada aspek penilaian untuk stase
                                        ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

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
