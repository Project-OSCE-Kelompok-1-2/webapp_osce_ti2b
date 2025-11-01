import { router } from "@inertiajs/react";
import React from "react";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Plus,
    Edit2,
    Trash2,
} from "lucide-react";

export default function Stase() {
    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* ===== KOLOM KIRI KOSONG (dengan garis pemisah kanan) ===== */}
            <aside className="w-20 border-r border-gray-300 flex flex-col items-center justify-between">
                <div className="mt-4"></div>
                <div className="flex-1"></div>
                <div className="mb-4"></div>
            </aside>

            {/* ===== KONTEN UTAMA ===== */}
            <main className="flex-1 flex flex-col h-full">
                {/* Header Input Stase */}
                <header className="border-b p-4 flex items-center space-x-3">
                    <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
                        <ChevronLeft size={18} />
                    </button>
                    <input
                        type="text"
                        value="Menu Stase"
                        disabled
                        className="border border-gray-400 rounded-lg px-4 py-2 text-sm w-full max-w-xl"
                    />
                </header>

                {/* ===== ISI HALAMAN ===== */}
                <div className="flex-1 px-8 py-6 overflow-auto">
                    {/* Judul & Deskripsi */}
                    <h2 className="font-semibold text-lg mb-1">Menu Stase</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman stase mengatur ruangan yang nanti digunakan
                        untuk penguji menilai mahasiswa
                    </p>

                    {/* Tombol Tambah */}
                    <button
                        onClick={() => router.visit("/admin/menustase/tambahstase")}
                        className="flex items-center bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <Plus size={16} className="mr-2" />
                        Tambah Stase
                    </button>

                    {/* Search Bar */}
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Cari data stase..."
                                className="w-full border border-gray-400 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none"
                            />
                        </div>
                        <button className="bg-blue-600 text-white text-sm px-6 py-2 rounded-lg">
                            Cari
                        </button>
                    </div>

                    {/* Table */}
                    <h2 className="font-semibold text-lg mb-2">Table State</h2>
                    <div className="border border-gray-400 rounded-lg overflow-hidden">
                        {/* Header Table */}
                        <div className="flex text-sm font-semibold bg-gray-50 border-b border-gray-400">
                            <div className="w-16 px-4 py-2 border-r border-gray-400 text-center">
                                No
                            </div>
                            <div className="flex-1 px-4 py-2 border-r border-gray-400">
                                Nama Stase
                            </div>
                            <div className="w-56 px-4 py-2 border-r border-gray-400 text-center">
                                Jumlah Aspek Penilaian
                            </div>
                            <div className="w-64 px-4 py-2 text-center">
                                Action
                            </div>
                        </div>

                        {/* Isi Table */}
                        <div className="flex items-center border-t border-gray-400">
                            <div className="w-16 px-4 py-3 text-center text-sm">
                                1
                            </div>
                            <div className="flex-1 px-4 py-3 border-l border-gray-400 text-sm">
                                5 Aspek Penilaian
                            </div>
                            <div className="w-56 px-4 py-3 border-l border-gray-400 text-center text-sm">
                                5
                            </div>
                            <div className="w-64 px-4 py-3 border-l border-gray-400 flex items-center justify-center space-x-3">
                                <button className="bg-blue-600 text-white text-xs px-3 py-2 rounded-md">
                                    Edit Aspek Penilaian
                                </button>
                                <button className="bg-blue-600 p-2 rounded-md text-white">
                                    <Edit2 size={14} />
                                </button>
                                <button className="bg-white border border-gray-400 p-2 rounded-md">
                                    <Trash2
                                        size={14}
                                        className="text-gray-700"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-start space-x-3 mt-3 text-sm text-gray-700">
                        <button className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white hover:opacity-80">
                            <ChevronLeft size={14} />
                        </button>

                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                className={`w-6 h-6 flex items-center justify-center rounded-full ${
                                    num === 1
                                        ? "text-black font-semibold"
                                        : "text-gray-500 hover:text-black"
                                }`}
                            >
                                {num}
                            </button>
                        ))}

                        <button className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white hover:opacity-80">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-300 p-3 text-center text-sm text-gray-600 bg-white">
                    Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit
                    amet
                </footer>
            </main>
        </div>
    );
}
