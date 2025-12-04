import React, { useState, useEffect } from "react";
import { Link, router, usePage, Head } from "@inertiajs/react";
import { Trash2, X, Edit2 } from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import Os_button from "../../components/button.jsx"; // Digunakan untuk tombol delete di tabel
import OsSearchBar from "../../components/searchbar.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsModal from "../../components/Modal.jsx"; 
import OsInput from "../../components/Input.jsx";
import OsButton from "../../components/button.jsx"; // Digunakan untuk tombol umum
import Modals from "../../components/Modals.jsx"; 

// --- Definisi Kolom Tabel Penguji ---
const pengujiColumns = [
    { key: "no", content: "No", width: "w-16", classes: "justify-center items-center" },
    { key: "nip_penguji", content: "NIP Penguji", width: "w-56", classes: "justify-start items-center px-4" },
    { key: "nama_penguji", content: "Nama Penguji", width: "flex-1", classes: "justify-start items-center px-4" },
    { key: "action", content: "Aksi", width: "w-56", classes: "justify-center items-center px-4" },
];

export default function PengujiPage() {
    const { dosen, filters, flash } = usePage().props;

    // === STATE ===
    const [showAddModal, setShowAddModal] = useState(false);
    const [addFormData, setAddFormData] = useState({ nip: "", nama: "" });

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPenguji, setEditingPenguji] = useState(null);
    const [editFormData, setEditFormData] = useState({ nip: "", nama: "" });

    const [search, setSearch] = useState(filters?.search || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPenguji, setSelectedPenguji] = useState(null);

    // --- EFFECT: Isi form edit saat data dipilih ---
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
        if(e) e.preventDefault();
        router.get("/admin/dosen", { search }, { preserveState: true, replace: true });
    };

    // --- HANDLER TAMBAH ---
    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        router.post("/admin/dosen", addFormData, {
            onSuccess: () => {
                setShowAddModal(false);
                setAddFormData({ nip: "", nama: "" });
            },
            onError: (errors) => console.error("Error adding:", errors),
        });
    };

    // --- HANDLER EDIT ---
    const openEditModal = (penguji) => {
        setEditingPenguji(penguji); // Set data dulu
        setShowEditModal(true);     // Baru buka modal
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        if (!editingPenguji) return;

        // Pastikan route backend menerima ID
        router.put(`/admin/dosen/${editingPenguji.id_penguji}`, editFormData, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingPenguji(null);
            },
            onError: (errors) => console.error("Error editing:", errors),
        });
    };

    // --- HANDLER DELETE ---
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

    const closeAddModal = () => {
        setShowAddModal(false);
        setAddFormData({ nip: "", nama: "" });
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingPenguji(null);
        setEditFormData({ nip: "", nama: "" });
    };

    // --- PREPARE TABLE DATA ---
    const tableData = dosen.data.map((item, index) => ({
        no: dosen.from + index,
        nip_penguji: item.nip,
        nama_penguji: item.nama,
        action: (
            <div className="flex space-x-3">
                {/* Tombol Edit */}
                <OsButton name="edit" onClick={() => openEditModal(item)}>
                    <Edit2 size={18} />
                </OsButton>

                {/* Tombol Delete (Perbaikan Typo) */}
                <OsButton name="warning" onClick={() => openDeleteModal(item)}>
                    <Trash2 size={18} className="text-os-white" />
                </OsButton>
            </div>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                <OsHeader/>

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">Menu Penguji</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                        Menu Penguji (Dosen) digunakan untuk mengelola proses penilaian, 
                        pemantauan, dan evaluasi mahasiswa.
                    </p>

                    <OsButton
                        name="primary"
                        onClick={() => setShowAddModal(true)}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon name="add" className="h-os-20 os-icon-light mr-os-8" />
                        Tambah Penguji
                    </OsButton>

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

                    <section>
                        <h2 className="font-semibold text-lg mb-2">Tabel Penguji</h2>
                        <OsTableHeader columns={pengujiColumns} />

                        {tableData.length > 0 ? (
                            <OsTableBody data={tableData} columns={pengujiColumns} />
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

                <OsCopyright />

                {/* --- MODAL TAMBAH --- */}
                <OsModal
                    show={showAddModal}
                    onClose={closeAddModal}
                    title="Tambah Penguji Baru"
                    subtitle="Isi form di bawah untuk menambahkan penguji baru."
                >
                    <form onSubmit={handleSubmitAdd} className="space-y-4">
                        <OsInput
                            label="NIP Penguji" type="number" name="nip"
                            value={addFormData.nip} onChange={handleAddFormChange}
                            placeholder="Masukkan NIP Penguji..." required
                        />
                        <OsInput
                            label="Nama Penguji" type="text" name="nama"
                            value={addFormData.nama} onChange={handleAddFormChange}
                            placeholder="Masukkan Nama Penguji..." required
                        />
                        {/* Tombol Submit Wajib Ada */}
                        <div className="flex justify-end pt-4">
                             <OsButton type="submit" name="primary" className="bg-blue-600 text-white px-4 py-2 rounded">
                                Simpan Data
                            </OsButton>
                        </div>
                    </form>
                </OsModal>

                {/* --- MODAL EDIT --- */}
                <OsModal
                    show={showEditModal}
                    onClose={closeEditModal}
                    variant="edit"
                    title="Edit Data Penguji"
                    subtitle={`Ubah informasi untuk penguji: ${editingPenguji?.nama || ""}`}
                >
                    <form onSubmit={handleSubmitEdit} className="space-y-4">
                        <OsInput
                            label="NIP Penguji" type="number" name="nip"
                            value={editFormData.nip} onChange={handleEditFormChange}
                            placeholder="Masukkan NIP Penguji..." required
                        />
                        <OsInput
                            label="Nama Penguji" type="text" name="nama"
                            value={editFormData.nama} onChange={handleEditFormChange}
                            placeholder="Masukkan Nama Penguji..." required
                        />
                        {/* Tombol Submit Wajib Ada */}
                        <div className="flex justify-end pt-4">
                             <OsButton type="submit" name="primary" className="bg-blue-600 text-white px-4 py-2 rounded">
                                Simpan Perubahan
                            </OsButton>
                        </div>
                    </form>
                </OsModal>

                {/* --- MODAL DELETE --- */}
                <Modals
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    variant="delete"
                    dataToDelete={[selectedPenguji?.nama, selectedPenguji?.nip]}
                    onConfirm={confirmDelete}
                />
            </main>
        </div>
    );
}