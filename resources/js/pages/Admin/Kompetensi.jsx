import React, { useState, useMemo, useEffect } from "react";
import { mockKompetensi } from "../../mockdata/mockKompetensi";
import { Pencil, Trash2, PlusCircle, Search, ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";

export default function KompetensiPage() {
    const [kompetensi, setKompetensi] = useState(mockKompetensi);
    const [search, setSearch] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // sesuaikan jumlah baris per halaman

    // Reset halaman ke 1 setiap kali search berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

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

    // Pastikan currentPage tidak melebihi totalPages
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

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
                <button className="bg-blue-600 hover:bg-blue-600 text-white p-3 rounded-xl border border-black">
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
                    onClick={() =>
                        router.visit("/admin/kompetensi/tambahkompetensi")
                    }
                    className="flex items-center gap-2 mt-3 bg-blue-700 hover:bg-blue-600 text-white px-5 py-3 rounded-xl"
                >
                    <PlusCircle size={20} />
                    Tambah Kompetensi
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex flex-1 items-center gap-2 border border-black rounded-xl px-3 py-3">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Tuliskan data kompetensi..."
                        className="flex-1 outline-none text-sm text-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button className="px-24 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl border border-black">
                    Cari
                </button>
            </div>

            {/* Tabel Kompetensi */}
            <h3 className="font-semibold mb-2">Table Kompetensi</h3>
            <div className="relative overflow-x-auto border border-black rounded-xl shadow-sm">
                <table className="w-full text-sm border-collapse">
                    {/* ======= HEADER ======= */}
                    <thead className="bg-gray-200 text-black border-b border-black">
                        <tr>
                            <th className="border-b border-black py-2 px-3 text-center w-12">
                                No
                            </th>
                            <th className="border-x border-b border-black py-2 px-3 text-center">
                                Deskripsi Kompetensi
                            </th>
                            <th className="border-r border-b border-black py-2 px-3 text-center w-24">
                                Bobot
                            </th>
                            <th className="border-b border-black py-2 px-3 text-center w-28">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, idx) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 transition border-t border-black/30"
                                >
                                    <td className="border-r border-black/30 text-center py-2">
                                        {startIndex + idx + 1}
                                    </td>

                                    <td className="border-r border-black/30 py-2 px-3 text-gray-800">
                                        {item.deskripsi}
                                    </td>

                                    <td className="border-r border-black/30 text-center py-2">
                                        {item.bobot}
                                    </td>

                                    <td className="py-2 flex items-center justify-center gap-2">
                                        <button className="p-1.5 text-white bg-blue-700 hover:bg-blue-500 border border-black rounded-lg">
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="p-1.5 text-black bg-white hover:bg-red-600 hover:text-white border border-black rounded-lg transition"
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

            {/* PAGINATION */}
            <div className="mt-3 flex items-center justify-start gap-2 text-sm text-gray-600">
                {/* tombol previous */}
                <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-2 py-0.5 rounded text-xs border border-black ${
                        currentPage === 1
                            ? "opacity-50 cursor-not-allowed bg-gray-200"
                            : "hover:bg-gray-100"
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
                            className={`w-7 h-7 flex items-center justify-center rounded-full text-xs border border-black transition ${
                                pageNum === currentPage
                                    ? "bg-gray-300 text-black font-semibold"
                                    : "bg-white hover:bg-gray-100"
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
                    className={`px-2 py-0.5 rounded text-xs border border-black ${
                        currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed bg-gray-200"
                            : "hover:bg-gray-100"
                    }`}
                >
                    &gt;
                </button>
            </div>

            {/* Footer Total Kompetensi / Aspek Penilaian */}
            <div className="relative mt-12 my-6 border border-black rounded-xl flex items-center justify-between px-4 py-2">
                <p className="text-sm text-black">
                    Total bobot kompetensi / aspek penilaian
                </p>
                <div className="flex gap-3">
                    <div className="border border-black rounded-xl px-8 py-2">
                        <span className="font-medium">Kompetensi:</span>{" "}
                        {kompetensi.length}
                    </div>
                    <div className="border border-black rounded-xl px-8 py-2">
                        <span className="font-medium">Aspek Penilaian:</span>{" "}
                        {totalBobot}
                    </div>
                </div>
            </div>

            {/* Footer Copyright */}
            <footer className="border border-black rounded-xl text-start px-4 py-4 text-sm text-gray-600">
                © Jorem ipsum dolor sit amet, consectetur adipiscing elit.
            </footer>
        </div>
    );
}
