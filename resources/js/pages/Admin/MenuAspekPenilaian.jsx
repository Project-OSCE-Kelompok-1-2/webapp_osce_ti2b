import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { Trash2, Pencil, Search } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsButton from "../../components/button.jsx";
import OsIcon from "../../components/icons.jsx";
import OSCopyright from "../../components/Copyright.jsx";
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/input.jsx";

import Modals from "../../components/Modals.jsx"; // ⬅️ IMPORT MODAL

export default function MenuAspekPenilaian() {
    const { stase, aspek_penilaian } = usePage().props;
    const [showModal, setShowModal] = useState(false);

    // === STATE MODAL DELETE ===
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAspek, setSelectedAspek] = useState(null);

    const openDeleteModal = (aspek) => {
        setSelectedAspek(aspek);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedAspek) return;

        router.delete(`/admin/aspek-penilaian/${selectedAspek.id_aspek_penilaian}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedAspek(null);
            },
        });
    };

    const totalBobot = aspek_penilaian.data.reduce(
        (sum, item) => sum + item.bobot_maksimum,
        0
    );

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full min-w-min p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* Header Breadcrumb (dibuat dinamis) */}
                <OsHeader variant="goback" backLink="/admin/stase" />
                <div className="flex-1 overflow-auto">
                    {/* Header Menu */}
                    <h2 className="font-semibold text-lg mb-1">
                        Menu Aspek Penilaian
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman ini berfungsi untuk menambahkan aspek penilaian <br />
                        pada stase "<strong>{stase.nama_stase}</strong>"
                    </p>

                    {/* Tombol Tambah diubah menjadi Link */}
                    {/* <div className="mb-4">
                <div className="mb-4">
                    <Link
                        href={`/admin/stase/${stase.id_stase}/aspek-penilaian/create`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow font-medium"
                    >
                        ＋ Tambah Aspek Penilaian
                    </Link>
                </div> */}

                    {/* Tombol Tambah */}
                    <OsButton
                        // onClick={() => router.get("/admin/stase/create")}
                        onClick={() => setShowModal(true)}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />
                        Tambah Stase
                    </OsButton>

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

                {/* ===== TABLE ===== */}
                <div className="bg-os-white shadow rounded-lg overflow-x-auto border border-gray-200">
                    <h3 className="px-4 py-3 border-b text-gray-700 font-semibold text-lg">
                        Table Aspek Penilaian
                    </h3>

                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm font-medium border-b-2 border-gray-300">
                                <th className="py-3 px-3 text-center w-[5%]">No</th>
                                <th className="py-3 px-4 text-left w-[50%] border-l border-gray-300">Deskripsi</th>
                                <th className="py-3 px-3 text-center w-[15%] border-l border-gray-300">Bobot Maksimum</th>
                                <th className="py-3 px-3 text-center w-[30%] border-l border-gray-300">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {aspek_penilaian.data.length > 0 ? (
                                aspek_penilaian.data.map((item, index) => (
                                    <tr key={item.id_aspek_penilaian} className="text-gray-800 text-sm">
                                        <td className="py-3 px-3 text-center">
                                            {aspek_penilaian.from + index}
                                        </td>

                                        <td className="py-3 px-4 border-l border-gray-300">
                                            <div className="font-semibold">{item.aspek}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {item.jumlah_kompetensi} Kompetensi
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
                                                >
                                                    <Pencil size={16} />
                                                </Link>

                                                {/* ==== BUTTON DELETE → OPEN MODAL ==== */}
                                                <button
                                                    onClick={() => openDeleteModal(item)}
                                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
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
                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                        Belum ada aspek penilaian untuk stase ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ===== TOTAL ===== */}
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

                <div className="text-center text-gray-400 text-sm mt-16 border-t pt-4">
                    Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit amet
                </div>
            </div>

            {/* ===== MODAL DELETE ===== */}
            <Modals
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                variant="delete"
                dataToDelete={[
                    selectedAspek?.aspek,
                    `${selectedAspek?.bobot_maksimum} poin`,
                ]}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
