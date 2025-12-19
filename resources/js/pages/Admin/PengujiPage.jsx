import React, { useState, useEffect, useMemo } from "react"; 
import { router, usePage, useForm } from "@inertiajs/react";
import { Trash2, Edit2, UserCheck, Table2 } from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/copyright.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/Input.jsx";
import OsButton from "../../components/button.jsx";
import Modals from "../../components/Modals.jsx";

const pengujiColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16 shrink-0",
        classes: "justify-center items-center",
    },
    {
        key: "nip_penguji",
        content: "NIP Penguji",
        width: "w-56 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "nama_penguji",
        content: "Nama Penguji",
        width: "min-w-[350px] !flex-1 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "action",
        content: "Aksi",
        width: "w-56 shrink-0",
        classes: "justify-center items-center px-4",
    },
];

export default function PengujiPage() {
    const { dosen, flash } = usePage().props;
    const allDosenData = Array.isArray(dosen) ? dosen : dosen?.data || [];

    // === STATE PENCARIAN & PAGINATION ===
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // === LOGIC FILTER INSTAN ===
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filteredData = useMemo(() => {
        return allDosenData.filter((item) => {
            const term = search.toLowerCase();
            return (
                item.nama?.toLowerCase().includes(term) ||
                item.nip?.toString().toLowerCase().includes(term)
            );
        });
    }, [search, allDosenData]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleClear = () => {
        setData({ nip: "", nama: "" });
        clearErrors();
    };

    const generatedLinks = useMemo(() => {
        if (totalPages <= 1) return [];
        const links = [];
        links.push({
            url: currentPage > 1 ? "#" : null,
            label: "&laquo; Previous",
            active: false,
            pageNumber: currentPage - 1,
        });
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                links.push({
                    url: "#",
                    label: i.toString(),
                    active: i === currentPage,
                    pageNumber: i,
                });
            } else if (
                (i === currentPage - 2 && i > 1) ||
                (i === currentPage + 2 && i < totalPages)
            ) {
                links.push({ url: null, label: "...", active: false });
            }
        }
        links.push({
            url: currentPage < totalPages ? "#" : null,
            label: "Next &raquo;",
            active: false,
            pageNumber: currentPage + 1,
        });
        return links;
    }, [currentPage, totalPages]);

    // === LOGIC CRUD ===
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPenguji, setEditingPenguji] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPenguji, setSelectedPenguji] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        data: dataAdd,
        setData: setDataAdd,
        post: postAdd,
        processing: processingAdd,
        errors: errorsAdd,
        reset: resetAdd,
        clearErrors: clearErrorsAdd,
    } = useForm({ nip: "", nama: "" });

    const {
        data: dataEdit,
        setData: setDataEdit,
        put: putEdit,
        processing: processingEdit,
        errors: errorsEdit,
        reset: resetEdit,
        clearErrors: clearErrorsEdit,
    } = useForm({ nip: "", nama: "" });

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        postAdd("/admin/dosen", {
            onSuccess: () => {
                setShowAddModal(false);
                resetAdd();
            },
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        if (!editingPenguji) return;
        putEdit(`/admin/dosen/${editingPenguji.id_penguji}`, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingPenguji(null);
                resetEdit();
            },
        });
    };

    const openEditModal = (penguji) => {
        setEditingPenguji(penguji);
        setDataEdit({ nip: penguji.nip || "", nama: penguji.nama || "" });
        clearErrorsEdit();
        setShowEditModal(true);
    };

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
            onError: () => setIsDeleting(false),
            onFinish: () => setIsDeleting(false),
        });
    };

    // === FORMAT DATA TABEL (Dari Paginated Data) ===
    const tableDisplayData = paginatedData.map((item, index) => ({
        no: (currentPage - 1) * itemsPerPage + index + 1,
        nip_penguji: item.nip,
        nama_penguji: item.nama,
        action: (
            <div className="flex space-x-3">
                <OsButton name="edit" onClick={() => openEditModal(item)}>
                    <Edit2 size={18} />
                </OsButton>
                <OsButton name="warning" onClick={() => openDeleteModal(item)}>
                    <Trash2 size={18} className="text-os-white" />
                </OsButton>
            </div>
        ),
    }));

    return (
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader
                        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    />

                    <div className="flex-1 overflow-auto p-1">
                        <div className="flex gap-1 items-center justify-start my-2">
                            <UserCheck size={18} />
                            <h2 className="font-semibold text-lg">
                                Menu Penguji
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                            Menu Penguji (Dosen) digunakan untuk mengelola
                            proses penilaian.
                        </p>

                        <OsButton
                            name="primary"
                            onClick={() => setShowAddModal(true)}
                            className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                        >
                            <OsIcon
                                name="add"
                                className="h-[18px] os-icon-light mr-os-8"
                            />{" "}
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

                        {/* INSTANT SEARCH BAR */}
                        <div className="w-full">
                            <OsSearchBar
                                search={search}
                                setSearch={setSearch} 
                                placeholder="Cari NIP atau Nama Penguji secara instan..."
                            />
                        </div>

                        <section>
                            {/* <h2 className="font-semibold text-lg mb-2">
                            Tabel Penguji
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Total: {totalItems} data)
                            </span>
                        </h2> */}
                            <div className="flex gap-1 items-center justify-start my-2">
                                <Table2 size={18} />
                                <h2 className="font-semibold text-lg">
                                    Tabel Penguji{" "}
                                </h2>
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    (Total: {totalItems} data)
                                </span>
                            </div>

                            <section className="bg-white p-5 border border-os-primary overflow-x-auto rounded-xl shadow-sm">
                                <div className="min-w-max">
                                    <OsTableHeader columns={pengujiColumns} />
                                    {tableDisplayData.length > 0 ? (
                                        <OsTableBody
                                            data={tableDisplayData}
                                            columns={pengujiColumns}
                                        />
                                    ) : (
                                        <div className="flex items-center border-t border-gray-400">
                                            <p className="w-full text-center text-sm py-6 mt-2 text-gray-500">
                                                Data Penguji tidak ditemukan.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Pagination Client Side */}
                            {totalPages > 1 && (
                                <div className="mt-8">
                                    <OsPagination
                                        links={generatedLinks}
                                        onPageChange={(page) =>
                                            setCurrentPage(page)
                                        }
                                    />
                                </div>
                            )}
                        </section>
                    </div>
                </div>
                <div className="">
                    <OsCopyright />
                </div>

                {/* MODAL TAMBAH */}
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
                    <div className="space-y-4">
                        <div>
                            <OsInput
                                label="NIP Penguji"
                                type="number"
                                name="nip"
                                value={dataAdd.nip}
                                onChange={(e) =>
                                    setDataAdd("nip", e.target.value)
                                }
                                placeholder="Masukkan NIP Penguji..."
                                required
                                className="[&_input]:[appearance:textfield] [&_input::-webkit-outer-spin-button]:appearance-none [&_input::-webkit-inner-spin-button]:appearance-none"
                            />
                            {errorsAdd.nip && (
                                <p className="text-red-500 text-xs mt-1 ml-1">
                                    {errorsAdd.nip}
                                </p>
                            )}
                        </div>
                        <div>
                            <OsInput
                                label="Nama Penguji"
                                type="text"
                                name="nama"
                                value={dataAdd.nama}
                                onChange={(e) =>
                                    setDataAdd("nama", e.target.value)
                                }
                                placeholder="Masukkan Nama Penguji..."
                                required
                            />
                            {errorsAdd.nama && (
                                <p className="text-red-500 text-xs mt-1 ml-1">
                                    {errorsAdd.nama}
                                </p>
                            )}
                        </div>
                        {processingAdd && (
                            <p className="text-blue-600 text-sm text-center animate-pulse">
                                Menyimpan data...
                            </p>
                        )}
                    </div>
                </OsModal>

                {/* MODAL EDIT */}
                <OsModal
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingPenguji(null);
                        resetEdit();
                    }}
                    variant="edit"
                    title="Penguji"
                    subtitle={`${editingPenguji?.nama || ""}`}
                    onSubmit={handleSubmitEdit}
                    onClear={handleClear}
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
                                }
                                placeholder="Masukkan NIP Penguji..."
                                required
                                className="[&_input]:[appearance:textfield] [&_input::-webkit-outer-spin-button]:appearance-none [&_input::-webkit-inner-spin-button]:appearance-none"
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
                                }
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
