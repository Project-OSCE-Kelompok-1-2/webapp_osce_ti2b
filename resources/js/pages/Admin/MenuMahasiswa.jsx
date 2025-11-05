// resources/js/pages/Admin/MenuMahasiswaPage.jsx
import { Link, usePage, router } from "@inertiajs/react";
import React, { useState } from "react";
import { Edit2, Trash2, PlusCircle } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../Components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";
import OsIcon from "../../components/icons";
import OsTableHeader from "../../components/tableheader";
import OsSearchBar from "../../components/searchbar";
import OsPagination from "../../components/pagination.jsx";

// --- Definisi Kolom Tabel ---
const mahasiswaColumns = [
    { content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        content: "NIM Mahasiswa",
        width: "w-56",
        classes: "justify-center items-center px-4",
    },
    {
        content: "Nama Mahasiswa",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Kelas",
        width: "w-48",
        classes: "justify-center items-center px-4",
    },
    {
        content: "Prodi",
        width: "w-48",
        classes: "justify-center items-center px-4",
    },
    {
        content: "Action",
        width: "w-64",
        classes: "justify-center items-center px-4",
    },
];

export default function MenuMahasiswaPage() {
    // Ambil data dari Controller via Inertia
    const { mahasiswa, filters } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [angkatan, setAngkatan] = useState(filters.angkatan || "2025");

    // Fungsi pencarian
    const handleSearch = () => {
        router.get(
            "/admin/mahasiswa",
            { search, angkatan },
            { preserveState: true, replace: true }
        );
    };

    // Fungsi hapus data
    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) {
            router.delete(`/admin/mahasiswa/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* Breadcrumb */}
                <OsBreadCrumb />

                {/* === ISI HALAMAN === */}
                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        Menu Mahasiswa
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman ini berisi daftar akun mahasiswa yang akan
                        digunakan untuk penilaian OSCE.
                    </p>

                    {/* Tombol Tambah */}
                    <button
                        onClick={() => router.visit('admin/mahasiswa/create')}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />
                        Tambah Mahasiswa
                    </button>

                    {/* Filter & Search */}
                    <div className="flex items-center gap-3 mb-6 w-full max-w-4xl">
                        <OsSearchBar
                            search={search}
                            setSearch={setSearch}
                            onSearchClick={handleSearch}
                            placeholder="Cari data mahasiswa..."
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                        />
                        <select
                            className="border border-gray-400 rounded-lg p-3 px-24 text-sm"
                            value={angkatan}
                            onChange={(e) => setAngkatan(e.target.value)}
                        >
                            {[2025, 2024, 2023, 2022, 2021].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Table Header */}
                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Mahasiswa
                    </h2>
                    <OsTableHeader columns={mahasiswaColumns} />

                    {/* Data Rows */}
                    {mahasiswa.data.map((item, index) => (
                        <div
                            key={item.id_mahasiswa}
                            className="flex items-center border-t border-gray-400"
                        >
                            <div className="w-16 px-4 py-3 text-center">
                                {mahasiswa.from + index}
                            </div>
                            <div className="w-56 px-4 py-3 border-l border-gray-400">
                                {item.nim}
                            </div>
                            <div className="flex-1 px-4 py-3 border-l border-gray-400">
                                {item.nama}
                            </div>
                            <div className="w-48 px-4 py-3 border-l border-gray-400 text-center">
                                {item.kelas}
                            </div>
                            <div className="w-48 px-4 py-3 border-l border-gray-400 text-center">
                                {item.prodi}
                            </div>
                            <div className="w-64 h-[70px] flex items-center justify-center border-l border-gray-400">
                                <div className="flex space-x-3">
                                    {/* Tombol Edit */}
                                    <Link
                                        href={`/admin/mahasiswa/${item.id_mahasiswa}/edit`}
                                        className="bg-blue-600 p-2 rounded-md text-white"
                                    >
                                        <Edit2 size={18} />
                                    </Link>
                                    {/* Tombol Hapus */}
                                    <button
                                        onClick={() =>
                                            handleDelete(item.id_mahasiswa)
                                        }
                                        className="bg-white border border-gray-400 p-2 rounded-md"
                                    >
                                        <Trash2
                                            size={18}
                                            className="text-gray-700"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pesan jika kosong */}
                    {mahasiswa.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data mahasiswa tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {mahasiswa.links && mahasiswa.links.length > 0 && (
                        <div className="mt-8">
                            <OsPagination links={mahasiswa.links} />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <OsCopyright />
            </main>
        </div>
    );
}
