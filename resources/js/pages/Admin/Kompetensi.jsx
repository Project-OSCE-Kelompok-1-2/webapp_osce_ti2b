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
            <div className="flex items-center justify-between mb-6 bg-white">
                <button className="bg-blue-600 text-white p-3 rounded-xl border border-black">
                    <ArrowLeft size={20} />
                </button>

                <div className="flex-1 mx-3 border border-black rounded-xl px-4 py-2 bg-white">
                    <p className="text-black text-lg">
                        Stase \ Persiapan \ Kompetensi
                    </p>
                </div>
            </div>

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-medium text-black mb-1">
                    Menu Kompetensi
                </h2>
                <p className="text-sm text-gray-500 max-w-md">
                    Jorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc vulputate libero et velit interdum, ac aliquet odio
                    mattis.
                </p>

                <button
                    onClick={() => router.visit("/admin/kompetensi/form")}
                    className="flex items-center gap-2 mt-3 bg-blue-600 text-white px-5 py-3 rounded-xl border border-black"
                >
                    <PlusCircle size={20} />
                    Tambah Kompetensi
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex flex-1 items-center gap-2 border border-black rounded-xl px-3 py-2">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Tuliskan data kompetensi..."
                        className="flex-1 outline-none text-sm text-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button className="px-10 py-2 bg-blue-600 text-white rounded-xl border border-black">
                    Cari
                </button>
            </div>

            {/* Table */}
            <h3 className="font-semibold mb-2">Table Kompetensi</h3>
            <div className="relative">
                <table className="w-full border border-black rounded-xl overflow-hidden text-sm">
                    <thead className="bg-white text-black">
                        <tr className="border-b border-black/40">
                            <th className="border-r border-black/40 py-2">
                                No
                            </th>
                            <th className="border-r border-black/40 py-2 text-left px-3">
                                Deskripsi Kompetensi
                            </th>
                            <th className="border-r border-black/40 py-2">
                                Bobot
                            </th>
                            <th className="py-2">Action</th>
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

                {/* Pagination */}
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

            {/* Footer Total Kompetensi / Aspek Penilaian */}
            <div className="mt-6 border border-black rounded-xl flex items-center justify-between px-4 py-2">
                <p className="text-sm text-black">
                    Total bobot kompetensi / aspek penilaian
                </p>
                <div className="flex gap-3">
                    <div className="border border-black/50 rounded-xl px-8 py-1">
                        <span className="font-medium">Kompetensi:</span>{" "}
                        {kompetensi.length}
                    </div>
                    <div className="border border-black/50 rounded-xl px-8 py-1">
                        <span className="font-medium">Aspek Penilaian:</span>{" "}
                        {totalBobot}
                    </div>
                </div>
            </div>

            {/* Footer Copyright */}
            <footer className="mt-10 border border-black rounded-xl text-center py-4 text-sm text-gray-600">
                Copyright All right reserved.
            </footer>
        </div>
    );
}
