import React, { useState, useEffect } from "react";
import { Link, router, usePage, Head } from "@inertiajs/react";

import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import Os_button from "../../components/button.jsx"; // Digunakan untuk tombol delete
import OsSearchBar from "../../components/searchbar.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsModal from "../../components/Modal.jsx"; // Modal utama
import OsInput from "../../components/input.jsx";
import OsButton from "../../components/button.jsx"; // Digunakan untuk tombol Tambah

import Modals from "../../components/Modals.jsx"; // Modal konfirmasi (Delete)

// --- Definisi Kolom Tabel Penguji ---

const pengujiColumns = [
    { key : "no", content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        key : "nip_penguji",
        content: "NIP Penguji",
        width: "w-56",
        classes: "justify-start items-center px-4",
    },
    {
        key : "nama_penguji",
        content: "Nama Penguji",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key : "action",
        content: "Action",
        width: "w-56",
        classes: "justify-center items-center px-4",
    },
];

// --- Komponen PengujiPage ---
export default function PengujiPage() {
    const { dosen, filters, flash } = usePage().props;

    // === STATE UNTUK MODAL TAMBAH ===
    const [showAddModal, setShowAddModal] = useState(false);
    const [addFormData, setAddFormData] = useState({ nip: "", nama: "" });

    // === STATE UNTUK MODAL EDIT ===
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPenguji, setEditingPenguji] = useState(null); // Data penguji yang sedang di-edit
    const [editFormData, setEditFormData] = useState({ nip: "", nama: "" });

    // === STATE UNTUK PENCARIAN ===
    const [search, setSearch] = useState(filters?.search || "");

    // === STATE UNTUK MODAL DELETE ===
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPenguji, setSelectedPenguji] = useState(null);

    // --- Efek untuk mengisi form edit saat data penguji dipilih ---
    useEffect(() => {
        if (editingPenguji) {
            setEditFormData({
                nip: editingPenguji.nip,
                nama: editingPenguji.nama,
            });
        } else {
            setEditFormData({ nip: "", nama: "" });
        }
    }, [editingPenguji]);

    // --- HANDLER PENCARIAN ---
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/admin/dosen",
            { search },
            { preserveState: true, replace: true }
        );
    };

    // --- HANDLER MODAL TAMBAH ---
    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        router.post("/admin/dosen", addFormData, {
            onSuccess: () => {
                setShowAddModal(false);
                setAddFormData({ nip: "", nama: "" }); // Reset form
            },
            onError: (errors) => {
                console.error("Error adding penguji:", errors);
                // In a real app, you'd handle specific form errors here, e.g., using Inertia's useForm
            },
        });
    };

    // --- HANDLER MODAL EDIT ---
    const openEditModal = (penguji) => {
        setEditingPenguji(penguji);
        setShowEditModal(true);
        // useEffect akan mengisi editFormData
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        if (!editingPenguji) return;

        router.put(`/admin/dosen/${editingPenguji.id_penguji}`, editFormData, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingPenguji(null); // Reset editing state
            },
            onError: (errors) => {
                console.error("Error editing penguji:", errors);
                // In a real app, you'd handle specific form errors here
            },
        });
    };

    // --- HANDLER MODAL DELETE ---
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
            onError: (errors) => {
                console.error("Error deleting penguji:", errors);
                // Handle error
            },
        });
    };

    // Fungsi untuk menutup modal dan mereset form tambah/edit
    const closeAddModal = () => {
        setShowAddModal(false);
        setAddFormData({ nip: "", nama: "" });
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingPenguji(null);
        setEditFormData({ nip: "", nama: "" });
    };

    //6. Siapin untuk isi data tabel 
    const tableData = dosen.data.map((item, index) => ({
        no: dosen.from + index,
        nip_penguji: item.nip,
        nama_penguji: item.nama,
        action: (
            <div className="flex space-x-3">
                <Link
                    href={`/admin/dosen/${item.id_penguji}/edit`}
                    className="w-10 h-10 flex items-center justify-center bg-blue-700 p-2 border border-black rounded-xl text-white hover:bg-blue-600 transition"
                >
                    <OsIcon name="Edit" className="h-os-20 w-os-20 os-icon-light" />
                </Link>
    
                <Os_button
                    onClick={() => handleDelete(item.id_penguji)}
                    className="w-10 h-10 flex items-center justify-center bg-white p-2 border border-black text-black rounded-xl hover:bg-gray-200 transition"
                >
                    <OsIcon name="Trash" className="w-5 h-5 aspect-square scale-[2.5] os-icon-dark" />
                </Os_button>
            </div>
        ),
    }));
    
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
                    <OsButton
                        onClick={() => setShowAddModal(true)}
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

                        {tableData.length > 0 ? (
                            <OsTableBody data={tableData} columns={pengujiColumns} />
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
                                            {/* Tombol Edit → pakai MODAL */}
                                            <OsButton
                                                onClick={() => openEditModal(item)}
                                                className="w-10 h-10 flex items-center justify-center bg-blue-700 p-2 border border-black rounded-xl text-white hover:bg-blue-600 transition"
                                            >
                                                <OsIcon
                                                    name="Edit"
                                                    className="h-os-20 w-os-20 os-icon-light"
                                                />
                                            </OsButton>

                                            {/* Tombol Delete → pakai MODAL DELETE */}
                                            <Os_button
                                                onClick={() => openDeleteModal(item)}
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
                        
                        {/* Paginasi */}

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

                {/* --- MODAL TAMBAH PENGUJI --- */}
                <OsModal
                    show={showAddModal}
                    onClose={closeAddModal}
                    title="Tambah Penguji Baru"
                    subtitle="Isi form di bawah untuk menambahkan penguji baru."
                >
                    <form onSubmit={handleSubmitAdd} className="space-y-4">
                        <OsInput
                            label="NIP Penguji"
                            type="text"
                            name="nip"
                            value={addFormData.nip}
                            onChange={handleAddFormChange}
                            placeholder="Masukkan NIP Penguji..."
                            required
                        />
                        <OsInput
                            label="Nama Penguji"
                            type="text"
                            name="nama"
                            value={addFormData.nama}
                            onChange={handleAddFormChange}
                            placeholder="Masukkan Nama Penguji..."
                            required
                        />
                    </form>
                </OsModal>

                {/* --- MODAL EDIT PENGUJI --- */}
                <OsModal
                    show={showEditModal}
                    onClose={closeEditModal}
                    title="Edit Data Penguji"
                    subtitle={`Ubah informasi untuk penguji: ${editingPenguji?.nama || ''}`}
                >
                    <form onSubmit={handleSubmitEdit} className="space-y-4">
                        <OsInput
                            label="NIP Penguji"
                            type="text"
                            name="nip"
                            value={editFormData.nip}
                            onChange={handleEditFormChange}
                            placeholder="Masukkan NIP Penguji..."
                            required
                        />
                        <OsInput
                            label="Nama Penguji"
                            type="text"
                            name="nama"
                            value={editFormData.nama}
                            onChange={handleEditFormChange}
                            placeholder="Masukkan Nama Penguji..."
                            required
                        />
                    </form>
                </OsModal>

                {/* === MODAL DELETE (TIDAK DIUBAH) === */}
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
            </main>
        </div>
    );
}
