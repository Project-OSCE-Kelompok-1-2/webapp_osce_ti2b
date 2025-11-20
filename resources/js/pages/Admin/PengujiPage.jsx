import React, { useState } from "react";
import { Link, router, usePage, Head } from "@inertiajs/react";

import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import Os_button from "../../components/button.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/input.jsx";
import OsButton from "../../components/button.jsx";

// --- Definisi Kolom Tabel Penguji ---

import Modals from "../../components/Modals.jsx"; // === Tambah import

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
    const { dosen, filters, flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);

    const [search, setSearch] = useState(filters?.search || "");

    // === STATE UNTUK MODAL DELETE ===
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPenguji, setSelectedPenguji] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/admin/dosen",
            { search },
            { preserveState: true, replace: true }
        );
    };

    const openDeleteModal = (penguji) => {
        setSelectedPenguji(penguji);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedPenguji) return;

        router.delete(`/admin/dosen/${selectedPenguji.id_penguji}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedPenguji(null);
            },
        });
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title="Manajemen Penguji" />
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                <OsHeader />

                <div className="flex-1 overflow-auto">
                    {/* === HEADER SECTION === */}
                    <h2 className="font-semibold text-lg mb-1">Menu Penguji</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Menu Penguji (Dosen) digunakan untuk mengelola proses penilaian,
                        pemantauan, dan evaluasi mahasiswa selama kegiatan atau
                        stase berlangsung.
                    </p>

                    {/* Tombol Tambah Penguji */}
                    {/* <div className="flex items-center gap-3 mb-5">
                            <Os_button
                                onClick={() =>
                                    router.visit("/admin/dosen/create")
                                }
                                className="flex items-center h-[46px] rounded-xl"
                            >
                                <OsIcon
                                    name="add"
                                    className="h-os-20 os-icon-light mr-os-8"
                                />
                                Tambah Penguji
                            </Os_button>
                        </div> */}
                    <OsButton
                        // onClick={() => router.get("/admin/stase/create")}
                        onClick={() => setShowModal(true)}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />
                        Tambah Penguji
                    </OsButton>

                    {/* [BARU] Notifikasi Sukses/Error */}
                    {flash.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                        {/* Flash message */}
                        {flash.success && (
                            <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
                                {flash.success}
                            </div>
                        )}
                        {flash.error && (
                            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
                                {flash.error}
                            </div>
                        )}

                        <div className="w-full">
                            <OsSearchBar
                                onSubmit={handleSearch}
                                search={search}
                                setSearch={setSearch}
                                onSearchClick={handleSearch}
                                placeholder="Cari NIP atau Nama Penguji..."
                            />
                        </div>


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
                                                href={`/admin/dosen/${item.id_penguji}/edit`}
                                                className="w-10 h-10 flex items-center justify-center bg-blue-700 p-2 border border-black rounded-xl text-white hover:bg-blue-600 transition"
                                            >
                                                <OsIcon
                                                    name="Edit"
                                                    className="h-os-20 w-os-20 os-icon-light"
                                                />
                                            </Link>

                                            {/* Tombol Delete → pakai MODAL */}
                                            <Os_button
                                                onClick={() =>
                                                    openDeleteModal(item)
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

                        {dosen.links && dosen.links.length > 3 && (
                            <div className="mt-8">
                                <OsPagination links={dosen.links} />
                            </div>
                        )}
                    </section>
                </div>

                {/* FOOTER */}
                <footer className="mt-auto pt-6 border-t border-gray-200">
                    <OsCopyright />
                </footer>

                {/* Modal Tambah Stase */}
                <OsModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    title="Tambah Penguji Baru"
                    subtitle="Isi form di bawah untuk menambahkan penguji baru."
                >
                    <OsInput
                        label="NIP Penguji"
                        type="text"
                        name="nama_stase"
                        placeholder="Masukkan NIP Penguji..."
                        required
                    />
                    <OsInput
                        label="Nama Penguji"
                        type="text"
                        name="nama_stase"
                        placeholder="Masukkan Nama Penguji..."
                        required
                    />
                </OsModal>
            </main>

            {/* === MODAL DELETE === */}
            <Modals
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                variant="delete"
                dataToDelete={[
                    selectedPenguji?.nama,
                    selectedPenguji?.nip,
                ]}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
