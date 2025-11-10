import React, { useState } from "react";
import Sidebar from "../../components/Sidebar"; // Pastikan path ini benar
import { Link, router, usePage } from "@inertiajs/react";
import {
    ClipboardList,
    CalendarClock,
    Plus,
    Search,
    ExternalLink,
    ArrowUpRightFromSquare,
    Edit,
    Trash2,
} from "lucide-react";
import OsHeader from "../../components/Header"; // 1. Impor komponen breadcrumb

// 2. Pastikan nama file komponen pagination Anda benar
import OsBreadCrumb from "../../components/breadcrumb";
import OsPagination from "../../components/pagination";

// 1. Terima props 'stase', 'osce', dan 'filters' dari controller
export default function HalamanStase({ stase, osce, filters }) {
    // State untuk sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 2. State untuk search bar, ambil nilai default dari 'filters'
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");

    // 3. [PERBAIKAN] Hapus pengambilan data yang salah dari usePage
    // const { data } = usePage().props;
    // const osceStase = data;

    /**
     * 4. [PERBAIKAN] Fungsi untuk menangani submit pencarian
     */
    function handleSearch(e) {
        e.preventDefault(); // Mencegah reload halaman

        // Arahkan ke endpoint Ifad yang benar
        router.get(
            `/admin/osce/${osce.id_osce}/stase`,
            { search: searchTerm }, // Data query parameter
            {
                preserveState: true, // Jaga state (seperti sidebar)
                replace: true, // Tidak menambah history browser
            }
        );
    }

    return (
        <div className="min-h-screen flex ">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main
                className={`flex-1 flex p-6 flex-col transition-all duration-300 ${
                    isSidebarOpen ? "ml-64" : "ml-20"
                }`}
            >
                {/* 5. Pastikan Ifad mengirim prop 'osce' */}
                <OsBreadCrumb osce={osce} />

                <div className="flex-1 p-2">
                    {/* Navigasi Tabs */}
                    <section className="mb-2">
                        <h2 className="text-lg font-semibold mb-3">Navigasi</h2>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                                <ClipboardList size={16} />
                                Halaman Stase
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                                <CalendarClock size={16} />
                                Jadwal Sesi
                            </button>
                        </div>
                    </section>

                    {/* Menu Halaman Stase */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold mb-1">
                            Menu Halaman Stase
                        </h2>
                        <p className="text-sm text-gray-500 mb-4 max-w-lg">
                            Jorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nunc vulputate libero et velit interdum, ac
                            aliquet odio mattis.
                        </p>
                        <button
                            onClick={() => router.visit("/tambahoscestase")} // Asumsi ini adalah route 'create'
                            className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            <Plus size={18} className="mr-2" />
                            Masukkan Stase
                        </button>
                    </section>

                    {/* Filter & Table OSCE */}
                    <section className="bg-white rounded-lg shadow-sm">
                        {/* 6. Filter Bar (Form sudah benar) */}
                        <form
                            onSubmit={handleSearch}
                            className="mb-4 flex-wrap gap-3"
                        >
                            <div className="flex items-center mb-2 gap-3">
                                <div className="relative">
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="cari data stase..."
                                        className="border rounded-lg pl-10 pr-4 py-2.5 text-sm w-full sm:w-80 outline-blue-500"
                                        // State input sudah benar
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
                                Table OSCE
                            </h2>
                        </form>

                        {/* Table */}
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
                                    {/* 7. [PERBAIKAN] Loop 'stase.data' dari props paginasi */}
                                    {stase.data.map((item, index) => (
                                        <tr
                                            // 8. [PERBAIKAN] Gunakan ID unik
                                            key={item.id_osce_stase}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="p-3 font-medium">
                                                {/* 9. [PERBAIKAN] Gunakan 'from' untuk nomor paginasi */}
                                                {stase.from + index}
                                            </td>
                                            <td className="p-3">
                                                Ruang {item.ruang.nomor_ruangan}
                                            </td>
                                            <td className="p-3">
                                                {item.stase.nama_stase}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-1.5">
                                                    <ExternalLink
                                                        size={14}
                                                        className="text-blue-600"
                                                    />
                                                    {item.penguji?.nama ||
                                                        "Belum diatur"}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        className="p-2 rounded-md border hover:bg-gray-100"
                                                        title="Open"
                                                    >
                                                        <ArrowUpRightFromSquare
                                                            size={14}
                                                        />
                                                    </button>
                                                    <button
                                                        className="p-2 rounded-md border bg-black text-white hover:bg-gray-400"
                                                        title="Edit"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
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

                        {/* 10. Pagination (sudah benar) */}
                        <OsPagination links={stase?.links} />
                    </section>
                </div>

                {/* Footer */}
                <footer className="p-4 bg-white border-t mt-auto">
                    <div className="border rounded-lg px-4 py-3 text-center text-gray-500 text-xs">
                        Copyright Porem ipsum dolor sit ametPorem ipsum dolor
                        sit amet
                    </div>
                </footer>
            </main>
        </div>
    );
}
