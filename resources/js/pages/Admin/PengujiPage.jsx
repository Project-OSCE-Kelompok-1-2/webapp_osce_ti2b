import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Trash2, Edit2 } from "lucide-react";

// Komponen UI
import Sidebar from "../../Components/Sidebar.jsx";
import OsBreadCrumb from "../../components/breadcrumb.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/copyright.jsx";

const pengujiColumns = [
    { content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        content: "NIP Penguji",
        width: "w-56",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Nama Penguji",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Action",
        width: "w-56",
        classes: "justify-center items-center px-4",
    },
];

export default function MenuPenguji() {
    const { dosen: backendDosen, filters } = usePage().props;

    // Mock data (fallback)
    const mockDosen = {
        data: [
            { id_penguji: 1, nip: "1987654321", nama: "Dr. Andi Surya" },
            { id_penguji: 2, nip: "1987654322", nama: "Prof. Rina Dewi" },
            { id_penguji: 3, nip: "1987654323", nama: "Ir. Hendra Wijaya" },
        ],
        from: 1,
        links: [],
    };

    const dosen = backendDosen && backendDosen.data ? backendDosen : mockDosen;

    // State
    const [search, setSearch] = useState(filters?.search || "");

    // === Handlers ===
    const handleSearch = () => {
        router.get(
            "/admin/penguji",
            { search },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus penguji ini?")) {
            router.delete(`/admin/penguji/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex font-sans overflow-hidden">
            <Sidebar />

            <main className="flex flex-col flex-1 p-os-8 transition-all duration-300 md:ml-20">
                {/* Breadcrumb */}
                <OsBreadCrumb />

                {/* Konten Utama */}
                <div className="flex-1 overflow-auto">
                    <section className="mb-8">
                        <h2 className="font-semibold text-lg mb-1">
                            Menu Penguji
                        </h2>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                            Halaman ini digunakan untuk mengelola data penguji
                            (dosen yang akan menguji mahasiswa pada setiap
                            stase).
                        </p>

                        {/* Tombol Tambah Penguji */}
                        <div className="flex items-center gap-3 mb-5">
                            <button
                                onClick={() =>
                                    router.visit("/admin/penguji/create")
                                }
                                className="flex items-center h-[46px] bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                <OsIcon
                                    name="add"
                                    className="h-os-20 os-icon-light mr-os-8"
                                />
                                Tambah Penguji
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="flex items-center gap-3 mb-4">
                            <OsSearchBar
                                search={search}
                                setSearch={setSearch}
                                onSearchClick={handleSearch}
                                placeholder="cari data penguji..."
                            />
                        </div>
                    </section>

                    {/* Tabel Penguji */}
                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            Daftar Penguji
                        </h2>

                        <OsTableHeader columns={pengujiColumns} />

                        {dosen.data.length > 0 ? (
                            dosen.data.map((item, index) => (
                                <div
                                    key={item.id_penguji}
                                    className="flex items-center border-t border-gray-400"
                                >
                                    <div className="w-16 px-4 py-3 text-center">
                                        {dosen.from + index}
                                    </div>
                                    <div className="w-56 px-4 py-3 border-l border-gray-400">
                                        {item.nip}
                                    </div>
                                    <div className="flex-1 px-4 py-3 border-l border-gray-400">
                                        {item.nama}
                                    </div>
                                    <div className="w-56 h-[70px] flex items-center justify-center border-l border-gray-400">
                                        <div className="flex space-x-3">
                                            <Link
                                                href={`/admin/penguji/${item.id_penguji}/edit`}
                                                className="bg-blue-600 p-2 rounded-md text-white hover:bg-blue-700"
                                            >
                                                <Edit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id_penguji
                                                    )
                                                }
                                                className="bg-white border border-gray-400 p-2 rounded-md hover:bg-gray-100"
                                            >
                                                <Trash2
                                                    size={18}
                                                    className="text-gray-700"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center border-t border-gray-400">
                                <p className="w-full text-center text-sm py-4 text-gray-500">
                                    Data penguji tidak ditemukan.
                                </p>
                            </div>
                        )}

                        {dosen.links?.length > 0 && (
                            <div className="mt-8">
                                <OsPagination links={dosen.links} />
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer */}
                <footer className="mt-auto pt-6 border-t border-gray-200">
                    <OsCopyright />
                </footer>
            </main>
        </div>
    );
}
