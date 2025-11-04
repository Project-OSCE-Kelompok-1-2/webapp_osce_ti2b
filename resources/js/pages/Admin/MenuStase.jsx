import { Link, usePage, router } from "@inertiajs/react";
import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Plus,
    Edit2,
    Trash2,
} from "lucide-react";
import Sidebar from "../../Components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";

export default function Stase() {
    // 1. Ambil data 'stase' dan 'filters' dari props yang dikirim Controller
    const { stase, filters } = usePage().props;

    // 2. Siapkan state untuk input pencarian
    const [search, setSearch] = useState(filters.search || "");

    // 3. Fungsi untuk menjalankan pencarian
    const handleSearch = () => {
        router.get(
            "/admin/stase",
            { search },
            { preserveState: true, replace: true }
        );
    };

    // 4. Fungsi untuk menghapus data
    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus stase ini?")) {
            router.delete(`/admin/stase/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen  flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar/>

            {/* ===== KONTEN UTAMA ===== */}
            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* Header Input Stase */}
                <OsBreadCrumb className="fixed" />

                {/* ===== ISI HALAMAN ===== */}
                <div className="flex-1 overflow-auto">
                    {/* Judul & Deskripsi */}
                    <h2 className="font-semibold text-lg mb-1">Menu Stase</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman stase mengatur ruangan yang nanti digunakan
                        untuk penguji menilai mahasiswa
                    </p>

                    {/* Tombol Tambah */}
                    <button
                        onClick={() => router.get("/admin/stase/create")}
                        className="flex items-center bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <Plus size={16} className="mr-2" />
                        Tambah Stase
                    </button>

                    {/* Search Bar dihubungkan ke state dan fungsi */}
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Cari data stase..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border border-gray-400 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white text-sm px-6 py-2 rounded-lg"
                        >
                            Cari
                        </button>
                    </div>

                    {/* Table */}
                    <h2 className="font-semibold text-lg mb-2">Table Stase</h2>
                    <div className="border border-gray-400 rounded-lg overflow-hidden">
                        {/* Header Table */}
                        <div className="flex text-sm font-semibold bg-os-white border-b border-gray-400">
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

                        {/* Isi Table dinamis dari database */}
                        {stase.data.map((item, index) => (
                            <div
                                key={item.id_stase}
                                className="flex items-center border-t border-gray-400"
                            >
                                <div className="w-16 px-4 py-3 text-center text-sm">
                                    {stase.from + index}
                                </div>
                                <div className="flex-1 px-4 py-3 border-l border-gray-400 text-sm">
                                    {item.nama_stase}
                                </div>
                                <div className="w-56 px-4 py-3 border-l border-gray-400 text-center text-sm">
                                    {item.aspek_penilaian_count}
                                </div>
                                <div className="w-64 px-4 py-3 border-l border-gray-400 flex items-center justify-center space-x-3">
                                    <Link
                                        href={`/admin/stase/${item.id_stase}/aspek-penilaian`}
                                        className="bg-blue-600 text-white text-xs px-3 py-2 rounded-md"
                                    >
                                        Edit Aspek Penilaian
                                    </Link>
                                    <Link
                                        href={`/admin/stase/${item.id_stase}/edit`}
                                        className="bg-blue-600 p-2 rounded-md text-white"
                                    >
                                        <Edit2 size={14} />
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDelete(item.id_stase)
                                        }
                                        className="bg-os-white border border-gray-400 p-2 rounded-md"
                                    >
                                        <Trash2
                                            size={14}
                                            className="text-gray-700"
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {/* Pesan jika tidak ada data */}
                        {stase.data.length === 0 && (
                            <div className="flex items-center border-t border-gray-400">
                                <p className="w-full text-center text-sm py-4 text-gray-500">
                                    Data stase tidak ditemukan.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Bagian Pagination Dihapus dari Tampilan */}
                </div>

                {/* Footer */}
                <OsCopyright/>
            </main>
        </div>
    );
}
