import React, { useState, useMemo } from "react";
import { mockKompetensi } from "../../mockdata/mockKompetensi";
import { Pencil, Trash2, PlusCircle, Search, ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";

export default function KompetensiPage() {
    const [kompetensi, setKompetensi] = useState(mockKompetensi);
    const [search, setSearch] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // sesuaikan jumlah baris per halaman

    const handleDelete = (id) => {
        setKompetensi(kompetensi.filter((item) => item.id !== id));
    };

    const filteredData = useMemo(
        () =>
            kompetensi.filter((item) =>
                item.deskripsi.toLowerCase().includes(search.toLowerCase())
            ),
        [kompetensi, search]
    );

    // Pagination helpers
    const totalItems = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // pastikan currentPage valid saat jumlah item berubah
    if (currentPage > totalPages) {
        setCurrentPage(totalPages);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const totalBobot = kompetensi.reduce(
        (acc, curr) => acc + Number(curr.bobot),
        0
    );

    return (
        <div className="p-6 pl-24 bg-white rounded-lg shadow-sm">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4">
                <button className="bg-blue-600 text-white p-2 rounded-md">
                    <ArrowLeft size={18} />
                </button>
                <input
                    type="text"
                    value="Stase \ A. Persiapan \ Kompetensi"
                    readOnly
                    className="border rounded-md px-3 py-2 w-full text-sm"
                />
            </div>

            {/* Header */}
            <div className="mb-4">
                <h2 className="font-semibold text-lg mb-1">Menu Kompetensi</h2>
                <p className="text-sm text-gray-600 mb-3">
                    Halaman ini berisi aspek-aspek yang nanti dinilai oleh
                    penguji, setiap rubrik bisa memiliki berbagai macam aspek
                    penilaian
                </p>

                <button
                    onClick={() => router.visit("/admin/kompetensi/form")}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    <PlusCircle size={18} />
                    Tambah Kompetensi
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2 mb-4">
                <div className="relative flex-grow">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                        type="text"
                        placeholder="Tuliskan data kompetensi..."
                        className="border w-full rounded-md pl-10 pr-3 py-2"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1); // reset page ketika mencari
                        }}
                    />
                </div>
                <button className="bg-blue-600 text-white px-24 rounded-md">
                    Cari
                </button>
            </div>

            {/* Table */}
            <h3 className="font-semibold mb-2">Table Kompetensi</h3>
            <div className="relative">
                <table className="w-full border border-gray-300 rounded-md text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-2 text-center w-10">No</th>
                            <th className="p-2 text-left">
                                Deskripsi Kompetensi
                            </th>
                            <th className="p-2 text-center w-20">Bobot</th>
                            <th className="p-2 text-center w-28">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, idx) => (
                            <tr
                                key={item.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="p-2 text-center">
                                    {startIndex + idx + 1}
                                </td>
                                <td className="p-2 font-medium">
                                    {item.deskripsi}
                                </td>
                                <td className="p-2 text-center">
                                    {item.bobot}
                                </td>
                                <td className="p-2 text-center flex justify-center gap-2">
                                    <button className="text-blue-600 p-1 hover:bg-blue-100 rounded">
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-600 p-1 hover:bg-red-100 rounded"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {/* jika tidak ada data di halaman ini */}
                        {paginatedData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-4 text-center text-gray-500"
                                >
                                    Data tidak ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination: di bawah kiri tabel, ukuran kecil */}
                <div className="mt-3 flex items-center justify-start gap-2 text-sm text-gray-600">
                    {/* tombol previous */}
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className={`px-2 py-0.5 rounded text-xs border ${
                            currentPage === 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                    >
                        &lt;
                    </button>

                    {/* nomor halaman */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs border ${
                                    pageNum === currentPage
                                        ? "bg-black text-white"
                                        : "bg-white"
                                }`}
                                title={`Halaman ${pageNum}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {/* tombol next */}
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className={`px-2 py-0.5 rounded text-xs border ${
                            currentPage === totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Footer Total Kompetensi / Aspek Penilaian (tampilan sesuai gambar) */}
            <div className="mt-6">
                <div className="w-full rounded-full border px-3 py-2 flex items-center justify-between">
                    <div className="text-xs text-gray-700">
                        Total bobot kompetensi / aspek penilaian
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="px-4 py-1 border rounded-lg bg-white text-xs">
                            <span className="font-medium">Kompetensi: </span>
                            <span>{kompetensi.length}</span>
                        </div>
                        <div className="px-4 py-1 border rounded-lg bg-white text-xs">
                            <span className="font-medium">
                                Aspek Penilaian:{" "}
                            </span>
                            <span>{totalBobot}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Copyright */}
            <footer className="text-sm text-gray-500 mt-6 border-t pt-2 text-center">
                Copyright Porem ipsum dolor sit amet
            </footer>
        </div>
    );
}
