import React, { useState, useEffect } from "react";
import { Link, router, usePage, Head, useForm } from "@inertiajs/react";
import { Trash2, X, Edit2 } from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/Copyright.jsx";
<<<<<<< HEAD
import Os_button from "../../components/button.jsx"; // Digunakan untuk tombol delete di tabel
import OsSearchBar from "../../components/searchbar.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsModal from "../../components/Modal.jsx"; 
import OsInput from "../../components/Input.jsx";
import OsButton from "../../components/button.jsx"; // Digunakan untuk tombol umum
import Modals from "../../components/Modals.jsx"; 
=======
import Os_button from "../../components/button.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/input.jsx";
import OsButton from "../../components/button.jsx";
import Modals from "../../components/Modals.jsx";
>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d

// --- Definisi Kolom Tabel Penguji ---
const pengujiColumns = [
    { key: "no", content: "No", width: "w-16", classes: "justify-center items-center" },
    { key: "nip_penguji", content: "NIP Penguji", width: "w-56", classes: "justify-start items-center px-4" },
    { key: "nama_penguji", content: "Nama Penguji", width: "flex-1", classes: "justify-start items-center px-4" },
    { key: "action", content: "Aksi", width: "w-56", classes: "justify-center items-center px-4" },
];

export default function PengujiPage() {
    const { dosen, filters, flash } = usePage().props;

<<<<<<< HEAD
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
=======
    // === STATE PENCARIAN ===
    const [search, setSearch] = useState(filters?.search || "");

    // ==========================================
    // 1. LOGIC TAMBAH (Create)
    // ==========================================
    const [showAddModal, setShowAddModal] = useState(false);

    // Inisialisasi useForm persis seperti di TambahPenguji
    const {
        data: dataAdd,
        setData: setDataAdd,
        post: postAdd,
        processing: processingAdd,
        errors: errorsAdd,
        reset: resetAdd,
        clearErrors: clearErrorsAdd,
    } = useForm({
        nip: "",
        nama: "",
    });

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        // Menggunakan post seperti di TambahPenguji
        postAdd("/admin/dosen", {
            onSuccess: () => {
                setShowAddModal(false);
                resetAdd();
            },
        });
    };

    // ==========================================
    // 2. LOGIC EDIT (Update)
    // ==========================================
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPenguji, setEditingPenguji] = useState(null);

    const {
        data: dataEdit,
        setData: setDataEdit,
        put: putEdit,
        processing: processingEdit,
        errors: errorsEdit,
        reset: resetEdit,
        clearErrors: clearErrorsEdit,
    } = useForm({
        nip: "",
        nama: "",
    });

    // Mengisi form edit saat tombol diklik (Logic dari useEffect sebelumnya tetap valid untuk modal)
>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d
    useEffect(() => {
        if (editingPenguji) {
            setDataEdit({
                nip: editingPenguji.nip || "",
                nama: editingPenguji.nama || "",
            });
            clearErrorsEdit();
        }
    }, [editingPenguji]);

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        if (!editingPenguji) return;

        // Menggunakan put seperti di TambahPenguji
        putEdit(`/admin/dosen/${editingPenguji.id_penguji}`, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingPenguji(null);
                resetEdit();
            },
        });
    };

    // ==========================================
    // 3. LOGIC LAINNYA (Search & Delete)
    // ==========================================
    const handleSearch = (e) => {
        if(e) e.preventDefault();
        router.get("/admin/dosen", { search }, { preserveState: true, replace: true });
    };

<<<<<<< HEAD
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
=======
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPenguji, setSelectedPenguji] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d
    const openDeleteModal = (penguji) => {
        setSelectedPenguji(penguji);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedPenguji || isDeleting) return;
        setIsDeleting(true);

        router.delete(`/admin/dosen/${selectedPenguji.id_penguji}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedPenguji(null);
                setIsDeleting(false);
            },
<<<<<<< HEAD
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
=======
            onError: () => setIsDeleting(false),
            onFinish: () => setIsDeleting(false),
        });
    };

    // Fungsi helper UI
    const openEditModal = (penguji) => {
        setEditingPenguji(penguji);
        setShowEditModal(true);
    };

>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d
    const tableData = dosen.data.map((item, index) => ({
        no: dosen.from + index,
        nip_penguji: item.nip,
        nama_penguji: item.nama,
        action: (
            <div className="flex space-x-3">
<<<<<<< HEAD
                {/* Tombol Edit */}
                <OsButton name="edit" onClick={() => openEditModal(item)}>
                    <Edit2 size={18} />
                </OsButton>

                {/* Tombol Delete (Perbaikan Typo) */}
=======
                <OsButton name="edit" onClick={() => openEditModal(item)}>
                    <Edit2 size={18} />
                </OsButton>
>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d
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
<<<<<<< HEAD
                <OsHeader/>
=======
                <OsHeader />
>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">Menu Penguji</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
<<<<<<< HEAD
                        Menu Penguji (Dosen) digunakan untuk mengelola proses penilaian, 
                        pemantauan, dan evaluasi mahasiswa.
=======
                        Menu Penguji (Dosen) digunakan untuk mengelola proses
                        penilaian...
>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d
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
<<<<<<< HEAD
                        <h2 className="font-semibold text-lg mb-2">Tabel Penguji</h2>
=======
                        <h2 className="font-semibold text-lg mb-2">
                            Tabel Penguji
                        </h2>
>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d
                        <OsTableHeader columns={pengujiColumns} />
                        {tableData.length > 0 ? (
<<<<<<< HEAD
                            <OsTableBody data={tableData} columns={pengujiColumns} />
=======
                            <OsTableBody
                                data={tableData}
                                columns={pengujiColumns}
                            />
>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d
                        ) : (
                            <div className="flex items-center border-t border-gray-400">
                                <p className="w-full text-center text-sm py-4 text-gray-500">
                                    Data penguji tidak ditemukan.
                                </p>
                            </div>
                        )}
<<<<<<< HEAD

=======
>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d
                        {dosen.links && dosen.links.length > 3 && (
                            <div className="mt-8">
                                <OsPagination links={dosen.links} />
                            </div>
                        )}
                    </section>
                </div>

                <OsCopyright />

<<<<<<< HEAD
                {/* --- MODAL TAMBAH --- */}
=======
                {/* ============================================== */}
                {/* MODAL TAMBAH (Implementasi dari TambahPenguji) */}
                {/* ============================================== */}
>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d
                <OsModal
                    show={showAddModal}
                    onClose={() => {
                        setShowAddModal(false);
                        resetAdd();
                    }}
                    title="Tambah Penguji Baru"
                    subtitle="Isi form di bawah untuk menambahkan penguji baru."
                    onSubmit={handleSubmitAdd}
                    onClear={() => resetAdd()}
                >
<<<<<<< HEAD
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
=======
                    <div className="space-y-4">
                        {/* NIP - Menggunakan logic onChange spesifik seperti TambahPenguji */}
                        <div>
                            <OsInput
                                label="NIP Penguji"
                                type="number"
                                name="nip"
                                value={dataAdd.nip}
                                onChange={(e) =>
                                    setDataAdd("nip", e.target.value)
                                } // Perubahan utama disini
                                placeholder="Masukkan NIP Penguji..."
                                required
                            />
                            {errorsAdd.nip && (
                                <p className="text-red-500 text-xs mt-1 ml-1">
                                    {errorsAdd.nip}
                                </p>
                            )}
                        </div>

                        {/* NAMA - Menggunakan logic onChange spesifik seperti TambahPenguji */}
                        <div>
                            <OsInput
                                label="Nama Penguji"
                                type="text"
                                name="nama"
                                value={dataAdd.nama}
                                onChange={(e) =>
                                    setDataAdd("nama", e.target.value)
                                } // Perubahan utama disini
                                placeholder="Masukkan Nama Penguji..."
                                required
                            />
                            {errorsAdd.nama && (
                                <p className="text-red-500 text-xs mt-1 ml-1">
                                    {errorsAdd.nama}
                                </p>
                            )}
                        </div>

                        {/* Loading Indicator */}
                        {processingAdd && (
                            <p className="text-blue-600 text-sm text-center animate-pulse">
                                Menyimpan data...
                            </p>
                        )}
                    </div>
                </OsModal>

                {/* ============================================== */}
                {/* MODAL EDIT (Implementasi dari TambahPenguji)   */}
                {/* ============================================== */}
>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d
                <OsModal
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingPenguji(null);
                        resetEdit();
                    }}
                    variant="edit"
                    title="Edit Data Penguji"
<<<<<<< HEAD
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
=======
                    subtitle={`Ubah informasi untuk penguji: ${
                        editingPenguji?.nama || ""
                    }`}
                    onSubmit={handleSubmitEdit}
                    onClear={() => resetEdit()}
                >
                    <div className="space-y-4">
                        <div>
                            <OsInput
                                label="NIP Penguji"
                                type="number"
                                name="nip"
                                value={dataEdit.nip}
                                onChange={(e) =>
                                    setDataEdit("nip", e.target.value)
                                } // Perubahan utama disini
                                placeholder="Masukkan NIP Penguji..."
                                required
                            />
                            {errorsEdit.nip && (
                                <p className="text-red-500 text-xs mt-1 ml-1">
                                    {errorsEdit.nip}
                                </p>
                            )}
                        </div>

                        <div>
                            <OsInput
                                label="Nama Penguji"
                                type="text"
                                name="nama"
                                value={dataEdit.nama}
                                onChange={(e) =>
                                    setDataEdit("nama", e.target.value)
                                } // Perubahan utama disini
                                placeholder="Masukkan Nama Penguji..."
                                required
                            />
                            {errorsEdit.nama && (
                                <p className="text-red-500 text-xs mt-1 ml-1">
                                    {errorsEdit.nama}
                                </p>
                            )}
                        </div>

                        {processingEdit && (
                            <p className="text-blue-600 text-sm text-center animate-pulse">
                                Memperbarui data...
                            </p>
                        )}
                    </div>
                </OsModal>

>>>>>>> d4ae118430d7719a23aba715e3394844d1a14d8d
                <Modals
                    isOpen={isModalOpen}
                    onClose={() => !isDeleting && setIsModalOpen(false)}
                    variant="delete"
                    dataToDelete={[
                        { key: "Nama", value: selectedPenguji?.nama },
                        { key: "NIP", value: selectedPenguji?.nip },
                    ]}
                    onConfirm={confirmDelete}
                />
            </main>
        </div>
    );
}