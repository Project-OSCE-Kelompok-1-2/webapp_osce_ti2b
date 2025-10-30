import React, { useState } from "react";
import { mockKompetensi } from "../../mockdata/mockKompetensi";
import { Pencil, Trash2, PlusCircle, Search, ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";

export default function KompetensiPage() {
    const [kompetensi, setKompetensi] = useState(mockKompetensi);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");

    const handleAdd = (dataBaru) => {
        setKompetensi([
            ...kompetensi,
            { ...dataBaru, id: kompetensi.length + 1 },
        ]);
        setShowForm(false);
    };

    const handleDelete = (id) => {
        setKompetensi(kompetensi.filter((item) => item.id !== id));
    };

    const filteredData = kompetensi.filter((item) =>
        item.deskripsi.toLowerCase().includes(search.toLowerCase())
    );

    const totalBobot = kompetensi.reduce(
        (acc, curr) => acc + Number(curr.bobot),
        0
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4">
                <button className="bg-blue-600 text-white p-2 rounded-md">
                    <ArrowLeft size={18} />
                </button>
                <input
                    type="text"
                    value="Stase \ Stase Lorem Ipsum Dolor \ Kompetensi"
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
                    onClick={() => router.visit('/admin/kompetensi/form')}
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
                        placeholder="Tuliskan data aspek penilaian..."
                        className="border w-full rounded-md pl-10 pr-3 py-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="bg-blue-600 text-white px-6 rounded-md">
                    Cari
                </button>
            </div>

            {/* Table */}
            <h3 className="font-semibold mb-2">Table Kompetensi</h3>
            <table className="w-full border border-gray-300 rounded-md text-sm">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-2 text-center w-10">No</th>
                        <th className="p-2 text-left">Kompetensi</th>
                        <th className="p-2 text-center w-20">Bobot</th>
                        <th className="p-2 text-center w-24">Rentang Skor</th>
                        <th className="p-2 text-center w-28">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={item.id} className="border-t hover:bg-gray-50">
                            <td className="p-2 text-center">{index + 1}</td>
                            <td className="p-2 font-medium">
                                {item.deskripsi}
                            </td>
                            <td className="p-2 text-center">{item.bobot}</td>
                            <td className="p-2 text-center">0 - 4</td>
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
                </tbody>
            </table>

            {/* ======= Pagination (dummy) ======= */}
            <div className="flex items-center justify-center gap-2 mt-3 text-gray-600">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        className={`w-6 h-6 flex items-center justify-center rounded-full ${
                            n === 1
                                ? "bg-black text-white"
                                : "border border-gray-400"
                        }`}
                    >
                        {n}
                    </button>
                ))}
            </div>

            {/* ======= Footer Total ======= */}
            <div className="flex justify-between items-center mt-4 border-t pt-3">
                <div className="font-semibold">Total</div>
                <div className="flex gap-2 items-center">
                    <span className="border px-4 py-1 rounded-md bg-gray-50">
                        {totalBobot}
                    </span>
                    <button className="bg-red-600 text-white px-4 py-1 rounded-md text-sm">
                        Point Tidak Seimbang!
                    </button>
                </div>
            </div>

            {/* ======= Footer Copyright ======= */}
            <footer className="text-sm text-gray-500 mt-6 border-t pt-2 text-center">
                Copyright Porem ipsum dolor sit amet
            </footer>
        </div>
    );
}
