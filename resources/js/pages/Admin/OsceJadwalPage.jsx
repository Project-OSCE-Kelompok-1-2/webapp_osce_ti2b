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
} from "lucide-react";

import OsHeader from "../../components/Header";
import OsButton from "../../components/button";
import OsCopyright from "../../components/Copyright";
import OsPagination from "../../components/pagination";
import OsInput from "../../components/input";

// Modal delete lama (jangan diubah)
import Modals from "../../components/Modals";

// Modal add + edit
import OsModal from "../../components/Modal";

export default function SesiOscePage({ sesi, osce, filters }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");

    // ================================
    // DELETE MODAL
    // ================================
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSesi, setSelectedSesi] = useState(null);

    // ================================
    // ADD / EDIT MODAL
    // ================================
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
            nama_sesi: item?.nama_sesi,
            durasi: item?.durasi,
            keterangan: item?.keterangan,
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

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className="grid w-full min-w-min p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 md:ml-20">

                <OsHeader variant="goback" backLink="/admin/osce/" />

                <div className="flex-1">
                    {/* Navigasi */}
                    <section className="mb-2">
                        <h2 className="text-lg font-semibold mb-2">Navigasi</h2>

                        <div className="flex gap-2">
                            <OsButton
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                                onClick={() =>
                                    router.get(`/admin/osce/${osce.id_osce}/stase`)
                                }
                            >
                                <ClipboardList size={16} />
                                Halaman Stase
                            </OsButton>

                            <OsButton
                                onClick={() =>
                                    router.get(`/admin/osce/${osce.id_osce}/jadwal`)
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-white border text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                <CalendarClock size={16} />
                                Jadwal Stase
                            </OsButton>
                        </div>
                    </section>

                    {/* Tombol Add */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold mb-1">Menu Halaman Sesi</h2>

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

                    {/* Search */}
                    <section className="rounded-lg w-full shadow-sm">
                        <form
                            onSubmit={handleSearch}
                            className="mb-4 flex-wrap gap-3"
                        >
                            <div className="flex items-center w-full mb-2 gap-3">
                                <div className="relative w-full">
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cari sesi..."
                                        className="border rounded-lg pl-10 pr-4 py-2.5 text-sm w-full sm:w-80 outline-blue-500"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
                                >
                                    Cari
                                </button>
                            </div>

                            <h2 className="text-lg font-semibold text-gray-800">
                                Tabel Sesi
                            </h2>
                        </form>

                        {/* Table */}
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-3">No</th>
                                        <th className="p-3">Nama Sesi</th>
                                        <th className="p-3">Durasi</th>
                                        <th className="p-3">Keterangan</th>
                                        <th className="p-3 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sesi.data.map((item, index) => (
                                        <tr key={item.id_sesi} className="border-b">
                                            <td className="p-3">{sesi.from + index}</td>
                                            <td className="p-3">{item.nama_sesi}</td>
                                            <td className="p-3">{item.durasi} menit</td>
                                            <td className="p-3">
                                                {item.keterangan || "-"}
                                            </td>

                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(item)
                                                        }
                                                        className="p-2 rounded-md border bg-black text-white hover:bg-gray-400"
                                                        title="Edit"
                                                    >
                                                        <Edit size={14} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal(item)
                                                        }
                                                        className="p-2 rounded-md border text-red-600 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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
                        type="text"
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
                        type="text"
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
