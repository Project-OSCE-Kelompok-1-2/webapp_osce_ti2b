import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Link, router } from "@inertiajs/react";
import {
    ClipboardList,
    CalendarClock,
    Plus,
    Search,
    Edit,
    Trash2,
    Edit2
} from "lucide-react";

import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright";
import OsPagination from "../../components/pagination";
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsButton from "../../components/button.jsx";
import OsIcon from "../../components/icons.jsx";

// Definisi kolom tabel
const tableColumns = [
    { content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        content: "Ruangan",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Stase",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Penguji",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Action",
        width: "w-32",
        classes: "justify-center items-center",
    },
];
import OsInput from "../../components/input";

// 🔥 Modal Delete Konfirmasi (versi lama)
import Modals from "../../components/Modals";

// 🔥 Modal ADD + EDIT
import OsModal from "../../components/Modal";

export default function OsceStasePage({ stase, osce, filters }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");

    // ================================
    //  DELETE MODAL STATES
    // ================================
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStase, setSelectedStase] = useState(null);

    // ================================
    //  ADD / EDIT MODAL STATES
    // ================================
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Form fields (sederhana saja)
    const [formData, setFormData] = useState({
        ruangan: "",
        nama_stase: "",
        penguji: "",
    });

    function handleSearch(e) {
        e.preventDefault();
        router.get(
            `/admin/osce/${osce.id_osce}/stase`,
            { search: searchTerm },
            { preserveState: true, replace: true }
        );
    }

    // ============================
    //  OPEN MODAL ADD
    // ============================
    function openAddModal() {
        setFormData({
            ruangan: "",
            nama_stase: "",
            penguji: "",
        });
        setIsAddOpen(true);
    }

    // ============================
    //  OPEN MODAL EDIT
    // ============================
    function openEditModal(item) {
        setSelectedStase(item);
        setFormData({
            ruangan: item?.ruang?.nomor_ruangan || "",
            nama_stase: item?.stase?.nama_stase || "",
            penguji: item?.penguji?.nama || "",
        });
        setIsEditOpen(true);
    }

    // ============================
    //  ADD SUBMIT
    // ============================
    function handleSubmitAdd(e) {
        e.preventDefault();

        router.post(
            `/admin/osce/${osce.id_osce}/stase`,
            { ...formData },
            {
                onFinish: () => {
                    setIsAddOpen(false);
                    setFormData({ ruangan: "", nama_stase: "", penguji: "" }); // Reset form
                },
            }
        );
    }

    // ============================
    //  EDIT SUBMIT
    // ============================
    function handleSubmitEdit(e) {
        e.preventDefault();

        if (!selectedStase) return;

        router.put(
            `/admin/osce/${osce.id_osce}/stase/${selectedStase.id_osce_stase}`,
            { ...formData },
            {
                onFinish: () => setIsEditOpen(false),
            }
        );
    }

    // ============================
    //  DELETE FROM EDIT MODAL
    // ============================
    function handleDeleteInsideEdit() {
        if (!selectedStase) return;

        router.delete(
            `/admin/osce/${osce.id_osce}/stase/${selectedStase.id_osce_stase}`,
            {
                onFinish: () => {
                    setIsEditOpen(false);
                    setSelectedStase(null);
                },
            }
        );
    }

    // ============================
    //  DELETE CONFIRM MODAL
    // ============================
    function openDeleteModal(item) {
        setSelectedStase(item);
        setIsModalOpen(true);
    }

    function confirmDelete() {
        if (!selectedStase) return;

        router.delete(
            `/admin/osce/${osce.id_osce}/stase/${selectedStase.id_osce_stase}`,
            {
                onFinish: () => {
                    setIsModalOpen(false);
                    setSelectedStase(null);
                },
                preserveScroll: true,
            }
        );
    }

    // Siapin isi data tabel
    const tableData = stase.data.map((item, index) => ({
        no: stase.from + index,
        ruangan: `Ruang ${item.ruang.nomor_ruangan}`,
        stase: item.stase.nama_stase,
        penguji: item.penguji?.nama || "Belum diatur",
        action: (
            <div className="flex items-center justify-center gap-2">
                <OsButton
                name="edit"
                    onClick={() =>
                        // Mengganti router.get ke openEditModal(item) untuk menggunakan modal
                        openEditModal(item)
                    }
                    className="p-2 rounded-md border bg-black text-white hover:bg-gray-400"
                    title="Edit"
                >
                    <Edit2 size={18} />
                </OsButton>

                <OsButton
                name="warning"
                    onClick={() => openDeleteModal(item)} // Menggunakan openDeleteModal(item)
                    className="p-2 rounded-md border text-red-600 hover:bg-red-50"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </OsButton>
            </div>
        ),
    }));

    // Fungsi helper untuk handle perubahan form data
    function handleFormChange(field, value) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                <OsHeader variant="goback" backLink="/admin/osce/" />

                <div className="flex-1">
                    {/* Navigasi */}
                    <section className="mb-2">
                        <h2 className="text-lg font-semibold mb-2">Navigasi</h2>

                        <div className="flex gap-2">
                            <OsButton
                                name="primary"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                                onClick={() =>
                                    router.get(
                                        `/admin/osce/${osce.id_osce}/stase`
                                    )
                                }
                            >
                                <ClipboardList size={16} />
                                Halaman Stase
                            </OsButton>

                            <OsButton
                                name="primary"
                                onClick={() =>
                                    router.get(
                                        `/admin/osce/${osce.id_osce}/jadwal`
                                    )
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-white border text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                <CalendarClock size={16} />
                                Jadwal Sesi
                            </OsButton>
                        </div>
                    </section>
                    {/* --- */}

                    {/* Tombol Add */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold mb-1">
                            [Nama OSCEnya]
                        </h2>

                        <p className="text-sm text-gray-500 mb-4 max-w-lg">
                            Kelola dan definisikan seluruh Stase yang digunakan
                            dalam ujian OSCE. Di halaman ini, Anda juga dapat
                            menetapkan Daftar Penguji yang bertugas pada setiap
                            stase untuk siklus penilaian yang sedang berjalan.
                        </p>

                        <OsButton
                            name="primary"
                            onClick={openAddModal}
                            className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            <OsIcon
                                name="add"
                                className="h-os-20 os-icon-light mr-os-8"
                            />
                            Masukkan Stase
                        </OsButton>
                    </section>
                    {/* --- */}

                    {/* Search */}
                    <OsSearchBar
                        search={searchTerm}
                        setSearch={setSearchTerm}
                        onSearchClick={handleSearch}
                        placeholder="Cari data stase..."
                    />
                    {/* --- */}

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Stase
                    </h2>

                    {/* Tabel */}
                    <div>
                        <OsTableHeader columns={tableColumns} />
                        <OsTableBody
                            columns={[
                                {
                                    key: "no",
                                    width: "w-16",
                                    classes: "justify-center",
                                },
                                {
                                    key: "ruangan",
                                    width: "flex-1",
                                    classes: "justify-start px-4",
                                },
                                {
                                    key: "stase",
                                    width: "flex-1",
                                    classes: "justify-start px-4",
                                },
                                {
                                    key: "penguji",
                                    width: "flex-1",
                                    classes: "justify-start px-4",
                                },
                                {
                                    key: "action",
                                    width: "w-32",
                                    classes: "justify-center",
                                },
                            ]}
                            data={tableData}
                        />
                    </div>

                    <OsPagination links={stase?.links} />
                </div>

                {/* footer */}
                <OsCopyright />
            </main>

            {/* DELETE CONFIRM MODAL */}
            <Modals
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                variant="delete"
                title="Hapus Stase?"
                message="Apakah Anda yakin ingin menghapus stase ini secara permanen?"
                dataToDelete={
                    selectedStase
                        ? [
                              {
                                  key: "Ruangan",
                                  value: selectedStase?.ruang?.nomor_ruangan,
                              },
                              {
                                  key: "Stase",
                                  value: selectedStase?.stase?.nama_stase,
                              },
                              {
                                  key: "Penguji",
                                  value: selectedStase?.penguji?.nama || "-",
                              },
                          ]
                        : []
                }
                confirmText="Hapus"
            />

            {/* ADD MODAL */}
            <OsModal
                show={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Tambah Stase"
                subtitle="Masukkan data stase baru"
                variant="add"
                onSubmit={handleSubmitAdd}
                onClear={() =>
                    setFormData({ ruangan: "", nama_stase: "", penguji: "" })
                }
            >
                {/* Form ADD */}
                <div className="flex flex-col gap-3">
                    <OsInput
                        type="suggest"
                        label="Nomor Ruangan"
                        placeholder="Nomor Ruangan"
                        value={formData.ruangan}
                        onChange={
                            (e) => handleFormChange("ruangan", e.target.value) // FIXED: Menggunakan handleFormChange
                        }
                    />

                    <OsInput
                        type="suggest"
                        label="Stase"
                        placeholder="Nama Stase" // Diubah agar lebih sesuai
                        value={formData.nama_stase} // FIXED: Menggunakan formData.nama_stase
                        onChange={
                            (e) =>
                                handleFormChange("nama_stase", e.target.value) // FIXED: Menggunakan handleFormChange
                        }
                    />
                    <OsInput
                        type="suggest"
                        label="Penguji"
                        placeholder="Nama Penguji" // Diubah agar lebih sesuai
                        value={formData.penguji} // FIXED: Menggunakan formData.penguji
                        onChange={
                            (e) => handleFormChange("penguji", e.target.value) // FIXED: Menggunakan handleFormChange
                        }
                    />
                </div>
            </OsModal>

            {/* EDIT MODAL */}
            <OsModal
                show={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Stase"
                subtitle={selectedStase?.stase?.nama_stase}
                variant="edit"
                onSubmit={handleSubmitEdit}
                onDelete={handleDeleteInsideEdit}
            >
                {/* Form EDIT */}
                <div className="flex flex-col gap-3">
                    <OsInput
                        type="suggest"
                        label="Nomor Ruangan"
                        placeholder="Nomor Ruangan"
                        value={formData.ruangan}
                        onChange={
                            (e) => handleFormChange("ruangan", e.target.value) // FIXED: Menggunakan handleFormChange
                        }
                    />

                    <OsInput
                        type="suggest"
                        label="Stase"
                        placeholder="Nama Stase" // Diubah agar lebih sesuai
                        value={formData.nama_stase} // FIXED: Menggunakan formData.nama_stase
                        onChange={
                            (e) =>
                                handleFormChange("nama_stase", e.target.value) // FIXED: Menggunakan handleFormChange
                        }
                    />
                    <OsInput
                        type="suggest"
                        label="Penguji"
                        placeholder="Nama Penguji" // Diubah agar lebih sesuai
                        value={formData.penguji} // FIXED: Menggunakan formData.penguji
                        onChange={
                            (e) => handleFormChange("penguji", e.target.value) // FIXED: Menggunakan handleFormChange
                        }
                    />
                </div>
            </OsModal>
        </div>
    );
}
