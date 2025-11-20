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
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsButton from "../../components/button.jsx";



//Definisi kolom tabel
const tableColumns = [
    { content: "No", width: "w-16", classes: "justify-center" },
    { content: "Ruangan", width: "flex-1", classes: "justify-start px-4" },
    { content: "Stase", width: "flex-1", classes: "justify-start px-4" },
    { content: "Penguji", width: "flex-1", classes: "justify-start px-4" },
    { content: "Action", width: "w-32", classes: "justify-center" },
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
                onFinish: () => setIsAddOpen(false),
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
                onFinish: () => setIsEditOpen(false),
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
                onFinish: () => setIsModalOpen(false),
                preserveScroll: true,
            }
        );
    }

    //Siapin isi data tabel 
    const tableData = stase.data.map((item, index) => ({
        no: stase.from + index,
        ruangan: `Ruang ${item.ruang.nomor_ruangan}`,
        stase: item.stase.nama_stase,
        penguji: item.penguji?.nama || "Belum diatur",
        action: (
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() =>
                        router.get(`/admin/osce/${osce.id_osce}/stase/${item.id_osce_stase}/edit`)
                    }
                    className="p-2 rounded-md border bg-black text-white hover:bg-gray-400"
                >
                    <Edit size={14} />
                </button>
    
                <button
                    onClick={() => handleDelete(item.id_osce_stase)}
                    className="p-2 rounded-md border text-red-600 hover:bg-red-50"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        )
    }));
    
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
                        <h2 className="text-lg font-semibold mb-1">Menu Halaman Stase</h2>

                        <p className="text-sm text-gray-500 mb-4 max-w-lg">
                            Jorem ipsum dolor sit amet.
                        </p>

                        <OsButton
                            onClick={openAddModal}
                            className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            <Plus size={18} />
                            Masukkan Stase
                        </OsButton>

                    </section>

                    {/* Search */}
                        <OsSearchBar
                            search={searchTerm}
                            setSearch={setSearchTerm}
                            onSearchClick={handleSearch}
                            placeholder="Cari data stase..."
                        />

                            <h2 className="text-lg font-semibold text-gray-800">
                                Tabel Stase
                            </h2>
                       

                        {/* Tabel */}
                        <div className="mt-4">
                            <OsTableHeader columns={tableColumns} />
                            <OsTableBody
                                columns={[
                                    { key: "no", width: "w-16", classes: "justify-center" },
                                    { key: "ruangan", classes: "justify-start px-4" },
                                    { key: "stase", classes: "justify-start px-4" },
                                    { key: "penguji", classes: "justify-start px-4" },
                                    { key: "action", width: "w-32", classes: "justify-center" },
                                ]}
                                data={tableData}
                            />
                        </div>
                    </div>
                        <OsPagination links={stase?.links} />
              
                 {/* footer */}
                <footer className="mt-auto pt-6 border-t border-gray-200">
                    <OsCopyright />
                 </footer>
                        {/* Table */}
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-3">No</th>
                                        <th className="p-3">Ruangan</th>
                                        <th className="p-3">Stase</th>
                                        <th className="p-3">Penguji</th>
                                        <th className="p-3 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {stase.data.map((item, index) => (
                                        <tr key={item.id_osce_stase} className="border-b">
                                            <td className="p-3">{stase.from + index}</td>
                                            <td className="p-3">
                                                Ruang {item.ruang.nomor_ruangan}
                                            </td>
                                            <td className="p-3">
                                                {item.stase.nama_stase}
                                            </td>
                                            <td className="p-3">
                                                {item.penguji?.nama || "Belum diatur"}
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
                                                        onClick={() => openDeleteModal(item)}
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

                        <OsPagination links={stase?.links} />
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
                title="Hapus Stase?"
                message="Apakah Anda yakin ingin menghapus stase ini secara permanen?"
                dataToDelete={
                    selectedStase
                        ? [
                              { key: "Ruangan", value: selectedStase?.ruang?.nomor_ruangan },
                              { key: "Stase", value: selectedStase?.stase?.nama_stase },
                              { key: "Penguji", value: selectedStase?.penguji?.nama || "-" },
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
                        onChange={(e) =>
                            setFormData({ ...formData, ruangan: e.target.value })
                        }
                    />

                    <OsInput
                        type="suggest"
                        label="Stase"
                        placeholder="Nomor Stase"
                        value={formData.ruangan}
                        onChange={(e) =>
                            setFormData({ ...formData, ruangan: e.target.value })
                        }
                    />
                    <OsInput
                        type="suggest"
                        label="Penguji"
                        placeholder="Nomor Penguji"
                        value={formData.ruangan}
                        onChange={(e) =>
                            setFormData({ ...formData, ruangan: e.target.value })
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
                        onChange={(e) =>
                            setFormData({ ...formData, ruangan: e.target.value })
                        }
                    />

                    <OsInput
                        type="suggest"
                        label="Stase"
                        placeholder="Nomor Stase"
                        value={formData.nama_stase}
                        onChange={(e) =>
                            setFormData({ ...formData, ruangan: e.target.value })
                        }
                    />
                    <OsInput
                        type="suggest"
                        label="Penguji"
                        placeholder="Nomor Penguji"
                        value={formData.penguji}
                        onChange={(e) =>
                            setFormData({ ...formData, ruangan: e.target.value })
                        }
                    />
                </div>
            </OsModal>
        </div>
   
    );
}
