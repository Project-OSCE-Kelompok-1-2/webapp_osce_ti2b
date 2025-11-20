import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsButton from "../../components/button.jsx";
import OsInput from "../../components/input.jsx";
import OsModal from "../../components/Modal.jsx";
import Modals from "../../components/Modals.jsx";

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
            `/admin/kompetensi/${aspek.id_aspek_penilaian}`,
            {
                kompetensi: form.deskripsi,
                bobot: form.bobot,
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

        router.delete(
            `/admin/kompetensi/${selected.id_poin_aspek_penilaian}`,
            { onSuccess: () => setModalOpen(false) }
        );
    };

    /* ----------------------- TOTAL BOBOT ----------------------- */
    const totalBobot = kompetensi.data.reduce(
        (acc, curr) => acc + Number(curr.bobot),
        0
    );

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full min-w-min p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 md:ml-20">
                <OsHeader
                    variant="goback"
                    backLink={`/admin/stase/${aspek.stase.id_stase}/aspek-penilaian`}
                />

                {/* TITLE */}
                <div>
                    <h2 className="font-semibold text-lg mb-1">Menu Kompetensi</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Kelola kompetensi untuk aspek "<strong>{aspek.aspek}</strong>"
                    </p>

                    <OsButton
                        onClick={openAddModal}
                        className="flex items-center gap-2 mt-3 bg-blue-700 hover:bg-blue-600 text-white px-5 py-3 rounded-xl"
                    >
                        <PlusCircle size={20} />
                        Tambah Kompetensi
                    </OsButton>
                </div>

                {/* SEARCH */}
                <div className="flex items-center w-full gap-3 mb-4">
                    <div className="flex flex-1 items-center gap-2 border border-black rounded-xl px-3 py-3">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Cari kompetensi..."
                            className="flex-1 outline-none text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-24 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl border border-black"
                    >
                        Cari
                    </button>
                </div>

                {/* TABLE */}
                <h3 className="font-semibold mb-2">Table Kompetensi</h3>

                <div className="relative overflow-x-auto border border-black rounded-xl shadow-sm">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-200 text-black border-b border-black">
                            <tr>
                                <th className="border-b border-black py-2 px-3 text-center w-12">No</th>
                                <th className="border-x border-b border-black py-2 px-3 text-left">Deskripsi Kompetensi</th>
                                <th className="border-r border-b border-black py-2 px-3 text-center w-24">Bobot</th>
                                <th className="border-b border-black py-2 px-3 text-center w-28">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {kompetensi.data.length > 0 ? (
                                kompetensi.data.map((item, idx) => (
                                    <tr
                                        key={item.id_poin_aspek_penilaian}
                                        className="hover:bg-gray-50 border-t border-black/30"
                                    >
                                        <td className="border-r border-black/30 text-center py-2">
                                            {kompetensi.from + idx}
                                        </td>
                                        <td className="border-r border-black/30 py-2 px-3">
                                            {item.kompetensi}
                                        </td>
                                        <td className="border-r border-black/30 text-center py-2">
                                            {item.bobot}
                                        </td>

                                        <td className="py-2 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-1.5 text-white bg-blue-700 hover:bg-blue-500 border border-black rounded-lg"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                onClick={() => openDeleteModal(item)}
                                                className="p-1.5 bg-white text-black hover:bg-red-600 hover:text-white border border-black rounded-lg transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-500 py-4 border-t border-black/30">
                                        Data tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER TOTAL */}
                <div className="mt-2 border border-black rounded-xl flex items-center justify-between px-4 py-2">
                    <p className="text-sm text-black">Total Bobot Kompetensi</p>
                    <div className="flex gap-3">
                        <div className="border border-black rounded-xl px-8 py-2">
                            <span className="font-medium">Kompetensi:</span> {kompetensi.total}
                        </div>
                        <div className="border border-black rounded-xl px-8 py-2">
                            <span className="font-medium">Total Bobot:</span> {totalBobot}
                        </div>
                    </div>
                </div>

                <footer>
                    <OsCopyright />
                </footer>
            </main>

{/* 🔥 MODAL ADD / EDIT (pakai OsModal) */}
<OsModal
    show={modalOpen && modalType !== "delete"}
    onClose={() => setModalOpen(false)}
    onSubmit={
        modalType === "add"
            ? handleAddSubmit
            : handleEditSubmit
    }
    variant={modalType}
    title="Kompetensi"
    subtitle="Isi form berikut"
>
    <OsInput
        label="Deskripsi Kompetensi"
        type="textarea"
        name="deskripsi"
        value={form.deskripsi}
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
        onChange={(e) =>
            setForm({ ...form, bobot: e.target.value })
        }
        required
    />
</OsModal>

{/* 🗑️ MODAL DELETE (pakai modal lama, TIDAK DIUBAH) */}
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
