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
import OsIcon from "../../components/icons";
import OsTableHeader from "../../components/tableheader";
import OsSearchBar from "../../components/searchbar";
import OsPagination from "../../components/pagination.jsx";

const staseColumns = [
  { content: 'No', width: 'w-16', classes: 'justify-center items-center' },
  { content: 'Nama Stase', width: 'flex-1', classes: 'justify-start items-center px-4' },
  { content: 'Jumlah Aspek', width: 'w-56', classes: 'justify-center items-center px-4' },
  { content: 'Action', width: 'w-80', classes: 'justify-center items-center px-4' },
];

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
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm  py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon name="add" className="h-os-20 os-icon-light mr-os-8" />
                        Tambah Stase
                    </button>

                    {/* Search Bar dihubungkan ke state dan fungsi */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch} // Ini yang benar! Meneruskan fungsi Inertia
                        placeholder="Cari stase..."
                    />

                    {/* Table */}
                    <h2 className="font-semibold text-lg mb-2 mt-os-8   ">Table Stase</h2>
                    <OsTableHeader columns={staseColumns} />
                    {stase.data.map((item, index) => (
                            <div
                                key={item.id_stase}
                                className="flex items-center border-t border-gray-400"
                            >
                                <div className="w-16 px-4 py-3 text-center text-os-paragraft">
                                    {stase.from + index}
                                </div>
                                <div className="flex-1 px-4 py-3 border-l border-gray-400 text-os-paragraft">
                                    {item.nama_stase}
                                </div>
                                <div className="w-56 px-4 py-3 border-l border-gray-400 text-center text-os-paragraft">
                                    {item.aspek_penilaian_count}
                                </div>
                                <div className="w-80 h-[70px] px-4 py-3 border-l border-gray-400 flex items-center justify-center space-x-3">
                                    <Link
                                        href={`/admin/stase/${item.id_stase}/aspek-penilaian`}
                                        className="bg-blue-600 h-[38px] w-full text-white text-os-small rounded-md text-center flex items-center justify-center"
                                    >
                                        Edit Aspek Penilaian
                                    </Link>
                                    <Link
                                        href={`/admin/stase/${item.id_stase}/edit`}
                                        className="bg-blue-600 p-2 rounded-md text-white"
                                    >
                                        <Edit2 size={20} />
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDelete(item.id_stase)
                                        }
                                        className="bg-white border border-gray-400 p-2 rounded-md"
                                    >
                                        <Trash2
                                            size={20}
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

                    {/* Bagian Pagination Dihapus dari Tampilan */}
                    {stase.links && stase.links.length > 0 && (
                    <div className="mt-8">
                        <OsPagination links={stase.links} />
                    </div>
    )}
                </div>

                {/* Footer */}
                <OsCopyright/>
            </main>
        </div>
    );
}
