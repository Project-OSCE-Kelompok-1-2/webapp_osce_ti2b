import { Link, usePage, router } from "@inertiajs/react";
import React, { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsIcon from "../../components/icons";
import OsTableHeader from "../../components/tableheader";
import OsSearchBar from "../../components/searchbar";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsButton from "../../components/button.jsx";
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/input.jsx";

// 🔥 Modal delete
import Modals from "../../components/Modals.jsx";

const staseColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
    },
    {
        key: "nama_stase",
        content: "Nama Stase",
        width: "w-7/12",
        classes: "justify-start items-center px-4",
    },
    {
        key: "jumlah_aspek",
        content: "Jumlah Aspek",
        width: "w-2/12",
        classes: "justify-center items-center px-4",
    },
    {
        key: "action",
        content: "Aksi",
        width: "w-3/12",
        classes: "justify-center items-center px-4",
    },
];

export default function Stase() {
    const { stase, filters } = usePage().props;

    // 🔥 State Form
    const [form, setForm] = useState({
        id: null,
        nama_stase: "",
        matakuliah: "",
        tujuan: "",
        deskripsi: "",
    });

    // 🔥 State Modal Add/Edit
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'

    // 🔥 State Search
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = () => {
        router.get(
            "/admin/stase",
            { search },
            { preserveState: true, replace: true }
        );
    };

    // 🔥 STATE DELETE MODAL
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedName, setSelectedName] = useState("");

    // 🔥 BUKA MODAL DELETE
    const openDeleteModal = (id, name) => {
        setSelectedId(id);
        setSelectedName(name);
        setIsDeleteOpen(true);
    };

    // 🔥 DELETE ACTION
    const handleConfirmDelete = () => {
        router.delete(`/admin/stase/${selectedId}`, {
            preserveScroll: true,
            onFinish: () => setIsDeleteOpen(false),
        });
    };

    // ============================
    // 🔵 OPEN MODAL TAMBAH
    // ============================
    const openAddModal = () => {
        setModalMode("add");
        setForm({
            id: null,
            nama_stase: "",
            matakuliah: "",
            tujuan: "",
            deskripsi: "",
        });
        setShowModal(true);
    };

    // ============================
    // 🔵 OPEN MODAL EDIT
    // ============================
    const openEditModal = (item) => {
        setModalMode("edit");
        setForm({
            id: item.id_stase,
            nama_stase: item.nama_stase,
            matakuliah: item.matakuliah || "",
            tujuan: item.tujuan || "",
            deskripsi: item.deskripsi || "",
        });
        setShowModal(true);
    };

    // ============================
    // 🔵 SUBMIT MODAL ADD/EDIT
    // ============================
    const handleSubmit = (e) => {
        e.preventDefault();

        if (modalMode === "edit") {
            router.put(`/admin/stase/${form.id}`, form, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            router.post(`/admin/stase`, form, {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    // ============================
    // 🔵 DATA TABEL
    // ============================
    const tableData = stase.data.map((item, index) => ({
        no: stase.from + index,
        nama_stase: item.nama_stase,
        jumlah_aspek: item.aspek_penilaian_count,
        action: (
            <div className="flex items-center justify-center space-x-3">
                {/* Edit Aspek Penilaian */}
                <OsButton
                    name="primary"
                    onClick={() =>
                        router.get(
                            `/admin/stase/${item.id_stase}/aspek-penilaian`
                        )
                    }
                    className="h-[38px] text-os-small w-full flex justify-between items-center gap-3"
                >
                    <OsIcon name={"add"} className="os-icon-light h-[20px]" />
                    Edit Aspek Penilaian
                </OsButton>

                {/* EDIT */}
                <OsButton name="edit" onClick={() => openEditModal(item)}>
                    <Edit2 size={18} />
                </OsButton>

                {/* DELETE */}
                <OsButton
                    name="warning"
                    onClick={() =>
                        openDeleteModal(item.id_stase, item.nama_stase)
                    }
                >
                    <Trash2 size={18} className="text-os-white" />
                </OsButton>
            </div>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                <OsHeader />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">Menu Stase</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                        Kelola konten Stase secara menyeluruh, termasuk daftar
                        kompetensi inti yang diujikan serta aspek penilaian
                        (kriteria checklist atau skor) yang digunakan penguji
                        untuk mengukur pencapaian kompetensi tersebut.
                    </p>

                    {/* 🔵 BUTTON TAMBAH */}
                    <OsButton
                        name="primary"
                        onClick={openAddModal}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />
                        Tambah Stase
                    </OsButton>

                    {/* Search */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari stase..."
                    />

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Stase
                    </h2>
                    <OsTableHeader columns={staseColumns} />
                    <OsTableBody data={tableData} columns={staseColumns} />

                    {stase.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-os-48 text-gray-500">
                                Data stase tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {stase.links?.length > 0 && (
                        <OsPagination links={stase.links} />
                    )}
                </div>

                <OsCopyright />
            </main>

            {/* ============================
                🔵 MODAL ADD/EDIT STASE
            ============================ */}
            <OsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                variant={modalMode}
                title={
                    modalMode === "edit" ? "Edit Stase" : "Tambah Stase Baru"
                }
                subtitle={
                    modalMode === "edit"
                        ? `Ubah data stase: ${form.nama_stase}`
                        : "Isi form di bawah untuk menambahkan stase baru."
                }
            >
                <form onSubmit={handleSubmit} className="space-y-3">
                    <OsInput
                        label="Mata kuliah"
                        type="suggest"
                        name="matakuliah"
                        value={form.matakuliah}
                        onChange={(e) =>
                            setForm({ ...form, matakuliah: e.target.value })
                        }
                        placeholder="Masukkan Mata kuliah..."
                        required
                    />
                    <OsInput
                        label="Tujuan Pembelajaran"
                        type="suggest"
                        name="tujuan"
                        value={form.tujuan}
                        onChange={(e) =>
                            setForm({ ...form, tujuan: e.target.value })
                        }
                        placeholder="Masukkan Tujuan..."
                        required
                    />
                    <OsInput
                        label="Nama Stase"
                        type="text"
                        name="nama_stase"
                        value={form.nama_stase}
                        onChange={(e) =>
                            setForm({ ...form, nama_stase: e.target.value })
                        }
                        placeholder="Masukkan Nama Stase..."
                        required
                    />
                    <OsInput
                        label="Deskripsi"
                        type="textarea"
                        name="deskripsi"
                        value={form.deskripsi}
                        onChange={(e) =>
                            setForm({ ...form, deskripsi: e.target.value })
                        }
                        placeholder="Masukkan Deskripsi..."
                        required
                    />
                </form>
            </OsModal>

            {/* 🔥 MODAL DELETE */}
            <Modals
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                variant="delete"
                title="Hapus Stase?"
                message="Apakah Anda yakin ingin menghapus stase ini?"
                confirmText="Hapus"
                dataToDelete={[
                    { key: "Nama Stase", value: selectedName || "-" },
                ]}
            />
        </div>
    );
}
