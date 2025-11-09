import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";

import Sidebar from "../../Components/Sidebar.jsx";
import OsBreadCrumb from "../../components/breadcrumb.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/copyright.jsx";
import Os_button from "../../components/button.jsx";
import OsSearchBar from "../../components/searchbar.jsx";

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

export default function PengujiPage() {
    const { dosen: backendDosen, filters } = usePage().props;

    // Data dummy jika backend kosong
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
    const [search, setSearch] = useState(filters?.search || "");

    const handleSearch = () => {
        router.get(
            "/admin/dosen", // ✅ endpoint GET sesuai instruksi tugas
            { search },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus penguji ini?")) {
            router.delete(`/admin/dosen/${id}`, { preserveScroll: true }); // ✅ endpoint DELETE sesuai tugas
        }
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="flex flex-col flex-1 p-os-8 transition-all duration-300 md:ml-20">
                <OsBreadCrumb />

                <div className="flex-1 overflow-auto">
                    {/* === HEADER SECTION === */}
                    <section className="mb-8">
                        <h2 className="font-semibold text-lg my-2">
                            Menu Penguji
                        </h2>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                            Halaman ini digunakan untuk mengelola data penguji
                            (dosen yang akan menguji mahasiswa pada setiap
                            stase).
                        </p>

                        {/* Tombol Tambah Penguji */}
                        <div className="flex items-center gap-3 mb-5">
                            <Os_button
                                onClick={() =>
                                    router.visit("/admin/dosen/create")
                                } // ✅ endpoint tambah
                                className="flex items-center h-[46px] rounded-xl"
                            >
                                <OsIcon
                                    name="add"
                                    className="h-os-20 os-icon-light mr-os-8"
                                />
                                Tambah Penguji
                            </Os_button>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full">
                            <OsSearchBar
                                search={search}
                                setSearch={setSearch}
                                onSearchClick={handleSearch}
                                placeholder="Cari data penguji..."
                            />
                        </div>
                    </section>

                    {/* === TABEL PENGUJI === */}
                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            Tabel Penguji
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
                                            {/* Tombol Edit */}
                                            <Link
                                                href={`/admin/dosen/${item.id_penguji}/edit`} // ✅ endpoint edit
                                                className="w-10 h-10 flex items-center justify-center bg-blue-700 p-2 border border-black rounded-xl text-white hover:bg-blue-600 transition"
                                            >
                                                <OsIcon
                                                    name="Edit"
                                                    className="h-os-20 w-os-20 os-icon-light"
                                                />
                                            </Link>

                                            {/* Tombol Delete */}
                                            <Os_button
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id_penguji
                                                    )
                                                }
                                                className="w-10 h-10 flex items-center justify-center bg-white p-2 border border-black text-black rounded-xl hover:bg-gray-200 transition"
                                            >
                                                <OsIcon
                                                    name="Trash"
                                                    className="w-5 h-5 aspect-square scale-[2.5] os-icon-dark"
                                                />
                                            </Os_button>
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

                {/* === FOOTER === */}
                <footer className="mt-auto pt-6 border-t border-gray-200">
                    <OsCopyright />
                </footer>
            </main>
        </div>
    );
}
