// MenuMahasiswa.jsx
import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import {
    PlusCircle,
    FileSpreadsheet,
    Search,
    ArrowLeft,
    Pencil,
    Trash2,
} from "lucide-react";

export default function MenuMahasiswa() {
    // Ambil data mahasiswa dari props Inertia
    const { mahasiswa, filters, tahun } = usePage().props;

    const [search, setSearch] = useState(filters?.search || "");
    const [selectedYear, setSelectedYear] = useState(
        tahun || new Date().getFullYear()
    );

    // Fungsi untuk pencarian
    const handleSearch = () => {
        router.get(
            "/admin/mahasiswa",
            { search, tahun: selectedYear },
            { preserveState: true, replace: true }
        );
    };

    // Fungsi hapus mahasiswa
    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) {
            router.delete(`/admin/mahasiswa/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="p-6 pl-24 bg-white rounded-lg shadow-sm min-h-screen">
            {/* Header dan breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    href="/admin"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl border border-black"
                >
                    <ArrowLeft size={20} />
                </Link>

                <div className="flex-1 mx-3 border border-black rounded-xl px-4 py-2 bg-white">
                    <p className="text-black text-lg truncate">Mahasiswa</p>
                </div>
            </div>

            {/* Menu Deskripsi */}
            <div className="mb-6">
                <h2 className="text-xl font-medium text-black mb-1">
                    Menu Mahasiswa
                </h2>
                <p className="text-sm text-gray-600 max-w-md">
                    Halaman ini berisi daftar akun mahasiswa yang nanti bisa
                    di-enrollment ke dalam OSCE.
                </p>
            </div>

            {/* Tombol Tambah */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => router.get("/admin/mahasiswa/create")}
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-5 py-3 rounded-xl border border-black"
                >
                    <PlusCircle size={18} />
                    Tambah Mahasiswa Dengan Form
                </button>

                <button
                    onClick={() => router.get("/admin/mahasiswa/import-excel")}
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-5 py-3 rounded-xl border border-black"
                >
                    <FileSpreadsheet size={18} />
                    Tambah Mahasiswa Dengan Excel
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex flex-1 items-center gap-2 border border-black rounded-xl px-3 py-3">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Cari data mahasiswa..."
                        className="flex-1 outline-none text-sm text-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border border-black rounded-xl px-4 py-3 text-sm text-gray-700 bg-white"
                >
                    {[2025, 2024, 2023, 2022, 2021].map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleSearch}
                    className="px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl border border-black"
                >
                    Cari
                </button>
            </div>

            {/* Table Mahasiswa */}
            <h3 className="font-semibold mb-2">Table Mahasiswa</h3>
            <div className="relative overflow-x-auto border border-black rounded-xl shadow-sm">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-200 text-black border-b border-black">
                        <tr>
                            <th className="border-r border-black py-2 px-3 text-center w-12">
                                No
                            </th>
                            <th className="border-r border-black py-2 px-3 text-left">
                                NIM Mahasiswa
                            </th>
                            <th className="border-r border-black py-2 px-3 text-left">
                                Nama Mahasiswa
                            </th>
                            <th className="py-2 px-3 text-center w-28">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mahasiswa.data.length > 0 ? (
                            mahasiswa.data.map((item, idx) => (
                                <tr
                                    key={item.id_mahasiswa}
                                    className={`transition border-t border-black/30 ${
                                        idx % 2 === 1
                                            ? "bg-gray-100"
                                            : "bg-white"
                                    } hover:bg-gray-200`}
                                >
                                    <td className="border-r border-black/30 text-center py-3">
                                        {mahasiswa.from + idx}
                                    </td>
                                    <td className="border-r border-black/30 py-3 px-3">
                                        {item.nim}
                                    </td>
                                    <td className="border-r border-black/30 py-3 px-3 font-semibold">
                                        {item.nama}
                                    </td>
                                    <td className="py-2 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    `/admin/mahasiswa/${item.id_mahasiswa}/edit`
                                                )
                                            }
                                            className="p-2 text-white bg-blue-700 hover:bg-blue-500 border border-black rounded-lg"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(item.id_mahasiswa)
                                            }
                                            className="p-2 text-black bg-white hover:bg-red-600 hover:text-white border border-black rounded-lg transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center text-gray-500 py-4 border-t border-black/30"
                                >
                                    Data tidak ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Copyright */}
            <footer className="mt-8 border border-black rounded-xl px-4 py-4 text-sm text-gray-600">
                © Porem ipsum dolor sit amet, consectetur adipiscing elit.
            </footer>
        </div>
    );
}
