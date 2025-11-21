import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";

// Mengimpor komponen yang hilang (asumsi lokasi dan nama file)
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsIcon from "../../components/icons";
import OsTableHeader from "../../components/tableheader";
import OsSearchBar from "../../components/searchbar";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsButton from "../../components/button.jsx";

// Tambahan impor untuk komponen yang tidak ada
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/input.jsx";
import Modals from "../../components/Modals.jsx";
import OsCopyright from "../../components/Copyright.jsx"; // Asumsi nama file

//Definisi kolom tabel
const columns = [
    {
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
        key: "no",
    },
    {
        content: "Deskripsi",
        width: "w-8/12",
        classes: "justify-start items-center px-4",
        key: "kompetensi",
    },
    {
        content: "Bobot",
        width: "w-2/12",
        classes: "justify-center items-center",
        key: "bobot",
    },
    {
        content: "Aksi",
        width: "w-2/12",
        classes: "justify-center items-center",
        key: "action",
    },
];

export default function KompetensiPage() {
    const { aspek, kompetensi, filters } = usePage().props;

    // FORM STATES
    const [search, setSearch] = useState(filters.search || "");
    const [form, setForm] = useState({ deskripsi: "", bobot: "" });

    // MODAL CONTROL
    const [modalType, setModalType] = useState(""); // add | edit | delete
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    /* ----------------------- SEARCH ----------------------- */
    const handleSearch = () => {
        router.get(
            `/admin/aspek-penilaian/${aspek.id_aspek_penilaian}/kompetensi`,
            { search },
            { preserveState: true, replace: true }
        );
    };

    /* ----------------------- ADD DATA ----------------------- */
    const openAddModal = () => {
        setForm({ deskripsi: "", bobot: "" });
        setModalType("add");
        setModalOpen(true);
    };

    const handleAddSubmit = () => {
        router.post(
            // Perbaiki rute post, harusnya ke endpoint kompetensi/tambah
            `/admin/kompetensi/add`, // Menggunakan rute add umum atau rute yang spesifik jika ada
            {
                kompetensi: form.deskripsi,
                bobot: form.bobot,
                // Tambahkan ID aspek yang diperlukan untuk menyimpan
                id_aspek_penilaian: aspek.id_aspek_penilaian,
            },
            { onSuccess: () => setModalOpen(false) }
        );
    };

    /* ----------------------- EDIT DATA ----------------------- */
    const openEditModal = (item) => {
        setSelected(item);
        setForm({
            deskripsi: item.kompetensi,
            bobot: item.bobot,
        });
        setModalType("edit");
        setModalOpen(true);
    };

    const handleEditSubmit = () => {
        if (!selected) return;

        router.put(
            `/admin/kompetensi/${selected.id_poin_aspek_penilaian}`,
            {
                kompetensi: form.deskripsi,
                bobot: form.bobot,
            },
            { onSuccess: () => setModalOpen(false) }
        );
    };

    /* ----------------------- DELETE DATA ----------------------- */
    const openDeleteModal = (item) => {
        setSelected(item);
        setModalType("delete");
        setModalOpen(true);
    };

    const handleDeleteSubmit = () => {
        if (!selected) return;

        router.delete(`/admin/kompetensi/${selected.id_poin_aspek_penilaian}`, {
            onSuccess: () => setModalOpen(false),
        });
    };

    /* ----------------------- TOTAL BOBOT ----------------------- */
    const totalBobot = kompetensi.data.reduce(
        (acc, curr) => acc + Number(curr.bobot),
        0
    );

    // 6. Fungsi untuk siapin data isi tabel
    const tableData = kompetensi.data.map((item, idx) => ({
        no: kompetensi.from + idx,
        kompetensi: item.kompetensi,
        bobot: item.bobot,
        action: (
            <div className="flex gap-2 justify-center">
                <OsButton
                    name="edit"
                    onClick={() => openEditModal(item)} // 🔥 Diubah: Memanggil fungsi openEditModal
                    className="p-1.5 text-white bg-blue-700 hover:bg-blue-500 border border-black rounded-lg"
                >
                    <Pencil size={18} />
                </OsButton>

                <OsButton
                    name="warning"
                    onClick={() => openDeleteModal(item)} // 🔥 Diubah: Memanggil openDeleteModal
                    className="p-1.5 text-black bg-white hover:bg-red-600 hover:text-white border border-black rounded-lg"
                >
                    <Trash2 size={18} />
                </OsButton>
            </div>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                <OsHeader
                    variant="goback"
                    backLink={`/admin/stase/${aspek.id_aspek_penilaian}`}
                />

                {/* Header */}
                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        {aspek.aspek}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                        Kelola dan definisikan poin-poin kompetensi
                        (sub-kriteria) yang spesifik dan terukur untuk Aspek
                        Penilaian. Poin-poin ini menjadi dasar penilaian harian
                        oleh penguji.
                    </p>

                    {/* Tombol tambah diubah untuk membuka modal Add */}
                    <OsButton
                        name="primary"
                        onClick={openAddModal} // 🔥 Diubah: Memanggil openAddModal
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />
                        Tambah Kompetensi
                    </OsButton>

                    {/* Search Bar */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari kompetensi..."
                    />

                    {/* TABLE */}
                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Kompetensi
                    </h2>

                    <OsTableHeader columns={columns} />

                    {tableData.length > 0 ? (
                        <OsTableBody data={tableData} columns={columns} />
                    ) : (
                        <div className="py-6 text-center text-gray-500 border-b">
                            Belum ada kompetensi untuk aspek ini.
                        </div>
                    )}

                    {/* PAGINATION */}
                    <OsPagination links={kompetensi.links} />

                    {/* Footer Total Kompetensi / Aspek Penilaian */}
                    <div className="relative border mt-3 h-[56px] border-black rounded-lg flex items-center justify-between px-4 py-2">
                        {/* Kolom Kiri: Deskripsi Total (Lebar 7/12) */}
                        <p className="text-black w-[70%] ">
                            Total Bobot dan Jumlah Kompetensi
                        </p>

                        {/* Kolom Kanan: Nilai Total (Lebar 5/12) - Menggunakan Flex untuk 2 Sub-Kolom */}
                        <div className="flex w-[30%] justify-end gap-4 text-sm">
                            {/* Total Bobot (2.5/12) */}
                            <div className="flex w-full items-center justify-center gap-1.5 px-2 py-1 rounded-md">
                                <span className="text-sm">
                                    Total Bobot:
                                </span>
                                <span className="text-black font-bold">
                                    {totalBobot}
                                </span>
                            </div>

                            {/* Total Kompetensi (2.5/12) */}
                            <div className="flex w-full items-center justify-center gap-1.5 px-2 py-1 rounded-md">
                                <span className="text-sm">
                                    Kompetensi:
                                </span>
                                <span className="text-black font-bold">
                                    {kompetensi.total}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <footer>
                    <OsCopyright />
                </footer>
            </div>

            {/* 🔥 MODAL ADD / EDIT (pakai OsModal) */}
            <OsModal
                show={modalOpen && modalType !== "delete"}
                onClose={() => setModalOpen(false)}
                onSubmit={
                    modalType === "add" ? handleAddSubmit : handleEditSubmit
                }
                variant={modalType}
                title={
                    modalType === "add"
                        ? "Tambah Kompetensi"
                        : "Edit Kompetensi"
                }
                subtitle="Isi form berikut"
            >
                <OsInput
                    label="Deskripsi Kompetensi"
                    type="textarea"
                    name="deskripsi"
                    value={form.deskripsi}
                    placeholder="Masukkan deskripsi kompetensi..."
                    onChange={(e) =>
                        setForm({ ...form, deskripsi: e.target.value })
                    }
                    required
                />

                <OsInput
                    label="Bobot Kompetensi"
                    type="number"
                    name="bobot"
                    value={form.bobot}
                    placeholder="Masukkan bobot kompetensi..."
                    onChange={(e) =>
                        setForm({ ...form, bobot: e.target.value })
                    }
                    required
                />
            </OsModal>

            {/* 🗑️ MODAL DELETE (pakai modal lama) */}
            <Modals
                isOpen={modalOpen && modalType === "delete"}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDeleteSubmit}
                variant="delete"
                title="Hapus Kompetensi?"
                message="Apakah Anda yakin ingin menghapus kompetensi ini?"
                confirmText="Hapus"
                dataToDelete={[
                    { key: "Deskripsi", value: selected?.kompetensi || "-" },
                    { key: "Bobot", value: selected?.bobot || "-" },
                ]}
            />
        </div>
    );
}
