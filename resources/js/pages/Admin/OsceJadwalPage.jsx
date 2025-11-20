import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import {
    Search,
    ArrowLeft,
    Pencil,
    Trash2,
    ClipboardList,
    CalendarClock,
    Plus,
    Edit, // Import 'Edit' yang hilang
} from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import Modals from "../../components/Modals.jsx";// Modal delete lama
import OsModal from "../../components/Modal"; // Modal add + edit

// Asumsi impor untuk komponen lain yang hilang di kode asli
import OsInput from "../../components/input.jsx";
import OsButton from "../../components/button.jsx";
import OsHeader from "../../components/Header.jsx"; // Diperlukan untuk header goback

const jadwalColumns = [
    { key: "no", content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        key: "tanggal_sesi",
        content: "Tanggal / Sesi",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key: "jumlah_mahasiswa",
        content: "Jumlah Mahasiswa",
        width: "w-80",
        classes: "justify-start items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-60",
        classes: "justify-center items-center",
    }
];

// Memperbaiki definisi komponen agar hanya ada satu 'export default'
export default function SesiOscePage({ sesi, osce, filters }) {
    // State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");

    // Modal Delete
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSesi, setSelectedSesi] = useState(null);

    // Modal Add / Edit
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [formData, setFormData] = useState({
        nama_sesi: "",
        durasi: "",
        keterangan: "",
    });

    // SEARCH
    function handleSearch(e) {
        e.preventDefault();
        router.get(
            `/admin/osce/${osce.id_osce}/sesi`,
            { search: searchTerm },
            { preserveState: true, replace: true }
        );
    }

    // ============================
    // OPEN ADD
    // ============================
    function openAddModal() {
        setFormData({ nama_sesi: "", durasi: "", keterangan: "" });
        setIsAddOpen(true);
    }

    // ============================
    // OPEN EDIT
    // ============================
    function openEditModal(item) {
        setSelectedSesi(item);
        setFormData({
            nama_sesi: item?.nama_sesi || "",
            durasi: item?.durasi || "",
            keterangan: item?.keterangan || "",
        });
        setIsEditOpen(true);
    }

    // ============================
    // SUBMIT ADD
    // ============================
    function handleSubmitAdd(e) {
        e.preventDefault();

        router.post(
            `/admin/osce/${osce.id_osce}/sesi`,
            { ...formData },
            {
                onFinish: () => setIsAddOpen(false),
                preserveScroll: true,
            }
        );
    }

    // ============================
    // SUBMIT EDIT
    // ============================
    function handleSubmitEdit(e) {
        e.preventDefault();

        if (!selectedSesi) return;

        router.put(
            `/admin/osce/${osce.id_osce}/sesi/${selectedSesi.id_sesi}`,
            { ...formData },
            {
                onFinish: () => setIsEditOpen(false),
                preserveScroll: true,
            }
        );
    }

    // ============================
    // DELETE FROM EDIT MODAL
    // ============================
    function handleDeleteInsideEdit() {
        if (!selectedSesi) return;

        router.delete(
            `/admin/osce/${osce.id_osce}/sesi/${selectedSesi.id_sesi}`,
            {
                onFinish: () => setIsEditOpen(false),
                preserveScroll: true,
            }
        );
    }

    // ============================
    // DELETE CONFIRM
    // ============================
    function openDeleteModal(item) {
        setSelectedSesi(item);
        setIsModalOpen(true);
    }

    function confirmDelete() {
        if (!selectedSesi) return;

        router.delete(
            `/admin/osce/${osce.id_osce}/sesi/${selectedSesi.id_sesi}`,
            {
                onFinish: () => setIsModalOpen(false),
                preserveScroll: true,
            }
        );
    }

    // Fungsi tambahan untuk penanganan tombol di tabel
    const handleEditEnrollment = (id) => {
        router.visit(`/admin/osce-stase/${id}/enrollment/edit`);
    };

    // Fungsi penanganan aksi (diperbaiki agar sesuai dengan logika modal)
    const handleEditSesi = (item) => openEditModal(item);
    const handleDeleteSesi = (item) => openDeleteModal(item);


    // siapin isi data tabel
    const rows = sesi.data.map((item, index) => ({
        no: sesi.from + index,
        "tanggal_sesi": `${item.tanggal_formatted} (Pukul ${item.jam_mulai_formatted})`,
        jumlah_mahasiswa: `${item.jumlah_mahasiswa} Mahasiswa`,
        action: (
            <div className="flex items-center justify-between w-full px-5">

                {/* Tombol Edit Enrollment (Tetap menggunakan router.visit) */}
                <button
                    onClick={() => handleEditEnrollment(item.id_osce_stase)}
                    className="h-[44px] px-5 bg-neutral-800 text-white text-sm rounded-xl hover:bg-neutral-700"
                >
                    Edit enrollment
                </button>

                <div className="h-8 w-px bg-gray-300 mx-3" />

                <div className="flex items-center gap-2">
                    {/* Tombol Edit Sesi (Memanggil openEditModal) */}
                    <button
                        onClick={() => handleEditSesi(item)}
                        className="flex items-center justify-center w-[38px] h-[38px] rounded-xl bg-neutral-800 text-white hover:bg-neutral-700"
                    >
                        <Pencil size={17} />
                    </button>

                    {/* Tombol Delete Sesi (Memanggil openDeleteModal) */}
                    <button
                        onClick={() => handleDeleteSesi(item)}
                        className="flex items-center justify-center w-[38px] h-[38px] rounded-xl border border-gray-400 text-gray-800 hover:bg-gray-100"
                    >
                        <Trash2 size={17} />
                    </button>
                </div>
            </div>
        )
    }));


    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className="grid w-full min-w-min p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 md:ml-20">

                {/* Header GoBack */}
                {/* Asumsi osce memiliki property yang diperlukan, jika tidak, ganti dengan link statis atau hapus */}
                <OsHeader variant="goback" backLink="/admin/osce/" />

                <div className="flex-1 overflow-auto px-8 pb-8">
                    {/* Navigasi */}
                    <section className="mb-2">
                        <h2 className="text-lg font-semibold mb-2">Navigasi</h2>

                        <div className="flex gap-2">
                            <OsButton
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-medium rounded-lg"
                                onClick={() =>
                                    router.get(`/admin/osce/${osce.id_osce}/stase`)
                                }
                            >
                                <ClipboardList size={16} />
                                Halaman Stase
                            </OsButton>

                            <OsButton
                                onClick={() =>
                                    router.get(`/admin/osce/${osce.id_osce}/sesi`)
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                            >
                                <CalendarClock size={16} />
                                Jadwal Sesi
                            </OsButton>
                        </div>
                    </section>

                    {/* Tombol Add dan Deskripsi */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold mb-1">
                            Menu Halaman Sesi
                        </h2>
                        <p className="text-sm text-gray-500 mb-4 max-w-lg">
                            Atur sesi OSCE sesuai kebutuhan.
                        </p>
                        <OsButton
                            onClick={openAddModal}
                            className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            <Plus size={18} className="mr-2" />
                            Tambah Sesi
                        </OsButton>
                    </section>

                    {/* Search Bar */}
                    <section className="rounded-lg w-full shadow-sm mb-6">
                        <OsSearchBar
                            search={searchTerm}
                            setSearch={setSearchTerm}
                            onSearchClick={handleSearch}
                            placeholder="Cari sesi..."
                        />
                    </section>

                    {/* === 📋 TABLE === */}
                    <section>
                        <h2 className="font-semibold text-lg mb-3">Tabel Sesi</h2>
                        <div className="border rounded-lg overflow-hidden">
                            {/* HEADER */}
                            <OsTableHeader columns={jadwalColumns} />

                            {/* BODY */}
                            {rows.length > 0 ? (
                                <OsTableBody data={rows} columns={jadwalColumns} />
                            ) : (
                                <div className="flex items-center justify-center border-t border-gray-200">
                                    <p className="w-full text-center text-sm py-4 text-gray-500">
                                        Data sesi tidak ditemukan.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* PAGINATION */}
                        <OsPagination links={sesi?.links} />
                    </section>
                </div>

                <footer>
                    <OsCopyright />
                </footer>
            </main>

            {/* DELETE CONFIRM MODAL */}
            <Modals
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                variant="delete"
                title="Hapus Sesi?"
                message="Apakah Anda yakin ingin menghapus sesi ini?"
                dataToDelete={
                    selectedSesi
                        ? [
                              { key: "Nama Sesi", value: selectedSesi?.nama_sesi },
                              { key: "Durasi", value: selectedSesi?.durasi + " menit" },
                          ]
                        : []
                }
                confirmText="Hapus"
            />

            {/* ADD MODAL */}
            <OsModal
                show={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Tambah Sesi"
                subtitle="Masukkan data sesi"
                variant="add"
                onSubmit={handleSubmitAdd}
                onClear={() =>
                    setFormData({ nama_sesi: "", durasi: "", keterangan: "" })
                }
            >
                <div className="flex flex-col gap-3">
                    <OsInput
                        type="text"
                        label="Nama Sesi"
                        placeholder="Nama Sesi..."
                        value={formData.nama_sesi}
                        onChange={(e) =>
                            setFormData({ ...formData, nama_sesi: e.target.value })
                        }
                    />

                    <OsInput
                        type="number"
                        label="Durasi (menit)"
                        placeholder="Durasi..."
                        value={formData.durasi}
                        onChange={(e) =>
                            setFormData({ ...formData, durasi: e.target.value })
                        }
                    />

                    <OsInput
                        type="textarea" // Diubah menjadi textarea jika memungkinkan untuk keterangan
                        label="Keterangan"
                        placeholder="Keterangan..."
                        value={formData.keterangan}
                        onChange={(e) =>
                            setFormData({ ...formData, keterangan: e.target.value })
                        }
                    />
                </div>
            </OsModal>

            {/* EDIT MODAL */}
            <OsModal
                show={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Sesi"
                subtitle={selectedSesi?.nama_sesi}
                variant="edit"
                onSubmit={handleSubmitEdit}
                onDelete={handleDeleteInsideEdit}
            >
                <div className="flex flex-col gap-3">
                    <OsInput
                        type="text"
                        label="Nama Sesi"
                        value={formData.nama_sesi}
                        onChange={(e) =>
                            setFormData({ ...formData, nama_sesi: e.target.value })
                        }
                    />

                    <OsInput
                        type="number"
                        label="Durasi (menit)"
                        value={formData.durasi}
                        onChange={(e) =>
                            setFormData({ ...formData, durasi: e.target.value })
                        }
                    />

                    <OsInput
                        type="textarea" // Diubah menjadi textarea jika memungkinkan untuk keterangan
                        label="Keterangan"
                        value={formData.keterangan}
                        onChange={(e) =>
                            setFormData({ ...formData, keterangan: e.target.value })
                        }
                    />
                </div>
            </OsModal>
        </div>
    );
}
