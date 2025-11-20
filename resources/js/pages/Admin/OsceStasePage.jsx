import React, { useState } from "react";
import Sidebar from "../../components/Sidebar"; // Pastikan path ini benar
import { Link, router, usePage } from "@inertiajs/react";
import {
    ClipboardList,
    CalendarClock,
    Plus,
    Search,
    Edit,
    Trash2,
} from "lucide-react";
import OsHeader from "../../components/Header"; // 1. Impor komponen breadcrumb
import OsButton from "../../components/button";
import OsCopyright from "../../components/Copyright";

// 2. Pastikan nama file komponen pagination Anda benar
import OsPagination from "../../components/pagination";

export default function OsceStasePage({ stase, osce, filters }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");

    function handleSearch(e) {
        e.preventDefault();
        router.get(
            `/admin/osce/${osce.id_osce}/stase`,
            { search: searchTerm },
            { preserveState: true, replace: true }
        );
    }

    function handleDelete(staseId) {
        if (confirm("Yakin ingin menghapus stase ini?")) {
            router.delete(`/admin/osce/${osce.id_osce}/stase/${staseId}`, {
                preserveScroll: true,
            });
        }
    }

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main
                className={`grid w-full min-w-min p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20`}
            >
                {/* 5. Pastikan backend mengirim prop 'osce' */}
                <OsHeader
                    variant="goback"
                    backLink="/admin/osce/"

                />

                <div className="flex-1">
                    {/* Navigasi */}
                    <section className="mb-2">
                        <h2 className="text-lg font-semibold mb-2">Navigasi</h2>

                        <div className="flex gap-2">
                            <OsButton className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                                onClick={() =>
                                    router.get(
                                        `/admin/osce/${osce.id_osce}/stase`
                                    )
                                }
                            >
                                <ClipboardList size={16} />
                                Halaman Stase
                            </OsButton>

                            <OsButton
                                onClick={() =>
                                    router.get(
                                        `/admin/osce/${osce.id_osce}/jadwal`
                                    )
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-white border text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                <CalendarClock size={16} />
                                Jadwal Sesi
                            </OsButton>
                        </div>
                    </section>

                    {/* Tambah Stase */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold mb-1">
                            Menu Halaman Stase
                        </h2>

                        <p className="text-sm text-gray-500 mb-4 max-w-lg">
                            Jorem ipsum dolor sit amet, consectetur adipiscing
                            elit.
                        </p>

                        <OsButton
                            onClick={() =>
                                router.get(
                                    `/admin/osce/${osce.id_osce}/stase/create`
                                )
                            }
                            className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            <Plus size={18} className="mr-2" />
                            Masukkan Stase
                        </OsButton>
                    </section>

                    {/* Search */}
                    <section className=" rounded-lg w-full shadow-sm">
                        <form
                            onSubmit={handleSearch}
                            className="mb-4 flex-wrap gap-3 "
                        >
                            <div className="flex items-center w-full mb-2 gap-3 ">
                                <div className="relative w-full">
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="cari data stase..."
                                        className="border rounded-lg pl-10 pr-4 py-2.5 text-sm w-full sm:w-80 outline-blue-500"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium w-full sm:w-auto"
                                >
                                    Cari
                                </button>
                            </div>

                            <h2 className="text-lg font-semibold text-gray-800">
                                Tabel Stase
                            </h2>
                        </form>

                        {/* Tabel */}
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-3 text-left w-16">
                                            No
                                        </th>
                                        <th className="p-3 text-left">
                                            Ruangan
                                        </th>
                                        <th className="p-3 text-left">Stase</th>
                                        <th className="p-3 text-left">
                                            Penguji
                                        </th>
                                        <th className="p-3 text-center w-32">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {stase.data.map((item, index) => (
                                        <tr
                                            key={item.id_osce_stase}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="p-3 font-medium">
                                                {stase.from + index}
                                            </td>

                                            <td className="p-3">
                                                Ruang {item.ruang.nomor_ruangan}
                                            </td>

                                            {/* ✅ Kolom Stase TANPA IKON MERAH */}
                                            <td className="p-3">
                                                {item.stase.nama_stase}
                                            </td>

                                            <td className="p-3">
                                                {item.penguji?.nama ||
                                                    "Belum diatur"}
                                            </td>

                                            {/* ✅ Action TANPA IKON BIRU */}
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() =>
                                                            router.get(
                                                                `/admin/osce/${osce.id_osce}/stase/${item.id_osce_stase}/edit`
                                                            )
                                                        }
                                                        className="p-2 rounded-md border bg-black text-white hover:bg-gray-400"
                                                        title="Edit"
                                                    >
                                                        <Edit size={14} />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id_osce_stase
                                                            )
                                                        }
                                                        className="p-2 rounded-md border text-red-600 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <OsPagination links={stase?.links} />
                    </section>
                </div>

                {/* Footer */}
                <footer >
                    <OsCopyright />
                </footer>
            </main>
        </div>
    );
}
