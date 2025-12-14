import React, { useState, useEffect, useMemo } from "react";
import { router, usePage, useForm } from "@inertiajs/react"; // [1] Import useForm
import { Edit2, Trash2, FileText, Table2 } from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright.jsx";
import OsButton from "../../components/button.jsx";
import OsIcon from "../../components/icons";
import OsInput from "../../components/input.jsx";
import OsModal from "../../components/Modal.jsx";
import OsPagination from "../../components/pagination";
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import Modals from "../../components/Modals.jsx";

const columns = [
    {
        content: "No",
        width: "w-16 shrink-0",
        classes: "justify-center items-center",
        key: "no",
    },
    {
        content: "Nama OSCE",
        width: "w-[400px] flex-1 shrink-0",
        classes: "justify-start items-center px-4",
        key: "nama",
    },
    {
        content: "Rentang Tanggal",
        width: "w-52 shrink-0",
        classes: "justify-center items-center",
        key: "tanggal",
    },
    {
        content: "Tahun Akademik",
        width: "min-w-52 shrink-0 ",
        classes: "justify-center items-center",
        key: "tahun",
    },
    {
        content: "Aksi",
        width: "min-w-[300px] shrink-0",
        classes: "justify-center items-center",
        key: "aksi",
    },
];

export default function OsceListPage({ osce, tahunAkademikOptions }) {
    // 1. Ambil Data Full
    const allOsceData = Array.isArray(osce) ? osce : osce?.data || [];

    // 2. State Filter & Pagination
    const [search, setSearch] = useState("");
    const [tahunFilter, setTahunFilter] = useState("SEMUA");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- LOGIC INSTANT FILTER ---
    useEffect(() => {
        setCurrentPage(1);
    }, [search, tahunFilter]);

    const filteredData = useMemo(() => {
        return allOsceData.filter((item) => {
            const term = search.toLowerCase();
            const matchSearch = item.nama_osce?.toLowerCase().includes(term);
            const matchTahun =
                tahunFilter === "SEMUA" ||
                String(item.id_tahun_akademik) === String(tahunFilter);
            return matchSearch && matchTahun;
        });
    }, [search, tahunFilter, allOsceData]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

    // --- STATE MODAL & CRUD ---
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedOsce, setSelectedOsce] = useState(null);

    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // [2] Setup useForm menggantikan useState manual
    const { data, setData, post, put, reset, errors, clearErrors, setError } =
        useForm({
            nama_osce: "",
            id_tahun_akademik: "",
            tanggal_mulai: "",
            tanggal_selesai: "",
        });

    // --- VALIDATION LOGIC ---
    const validateForm = () => {
        let isValid = true;
        if (!data.nama_osce || data.nama_osce.trim() === "") {
            setError("nama_osce", "Nama OSCE wajib diisi.");
            isValid = false;
        }
        if (!data.id_tahun_akademik) {
            setError("id_tahun_akademik", "Tahun Akademik wajib dipilih.");
            isValid = false;
        }
        if (!data.tanggal_mulai) {
            setError("tanggal_mulai", "Tanggal Mulai wajib diisi.");
            isValid = false;
        }
        if (!data.tanggal_selesai) {
            setError("tanggal_selesai", "Tanggal Selesai wajib diisi.");
            isValid = false;
        }

        // Validasi Logika Tanggal
        if (data.tanggal_mulai && data.tanggal_selesai) {
            if (new Date(data.tanggal_mulai) > new Date(data.tanggal_selesai)) {
                setError(
                    "tanggal_selesai",
                    "Tanggal Selesai tidak boleh mendahului Tanggal Mulai."
                );
                isValid = false;
            }
        }
        return isValid;
    };

    // --- ACTION HANDLERS ---

    // Handler Buka Modal Add
    const openAddModal = () => {
        reset();
        clearErrors();
        setIsAddOpen(true);
    };

    // Handler Buka Modal Edit
    const openEditModal = (item) => {
        setEditData(item);
        clearErrors();
        setData({
            nama_osce: item.nama_osce,
            id_tahun_akademik: item.id_tahun_akademik || "",
            tanggal_mulai: item.tanggal_mulai,
            tanggal_selesai: item.tanggal_selesai,
        });
        setIsEditOpen(true);
    };

    const openDeleteModal = (item) => {
        setSelectedId(item.id_osce);
        setSelectedOsce(item);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedId) {
            router.delete(`/admin/osce/${selectedId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedId(null);
                    setSelectedOsce(null);
                },
            });
        }
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        clearErrors();

        if (!validateForm()) return;

        post("/admin/osce", {
            onSuccess: () => {
                setIsAddOpen(false);
                reset();
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        clearErrors();

        if (!validateForm()) return;
        if (!editData) return;

        put(`/admin/osce/${editData.id_osce}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                reset();
            },
        });
    };

    // --- TABLE ROWS ---
    const rows = paginatedData.map((item, i) => ({
        no: (currentPage - 1) * itemsPerPage + i + 1,
        nama: (
            <div className="flex flex-col items-start leading-tight">
                <div className="font-semibold leading-tight">
                    {item.nama_osce}
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                    {item.detail_stase || 0} {item.detail_mahasiswa || 0}{" "}
                    {item.detail_sesi || 0}
                </div>
            </div>
        ),
        tanggal: (
            <div className="h-full flex items-center justify-center">
                {item.tanggal_mulai} - {item.tanggal_selesai}
            </div>
        ),
        tahun: (
            <div className="h-full flex items-center justify-center">
                {item.tahun_akademik?.tahun
                    ? `${item.tahun_akademik.tahun} - ${item.tahun_akademik.semester}`
                    : "-"}
            </div>
        ),
        aksi: (
            <div className="flex justify-center gap-2">
                <OsButton
                    name="primary"
                    onClick={() =>
                        router.get(`/admin/osce/${item.id_osce}/jadwal`)
                    }
                    className="h-[38px] text-os-small w-full flex justify-between items-center gap-3"
                >
                    <OsIcon name={"add"} className="os-icon-light h-[20px]" />
                    Edit Property
                </OsButton>
                <OsButton
                    name="edit"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-black bg-white hover:bg-black hover:text-white border border-black rounded-lg"
                >
                    <Edit2 size={18} />
                </OsButton>
                <OsButton
                    name="warning"
                    onClick={() => openDeleteModal(item)}
                    className="p-1.5 text-black bg-white hover:bg-red-600 hover:text-white border border-black rounded-lg"
                >
                    <Trash2 size={18} />
                </OsButton>
            </div>
        ),
    }));

    return (
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader onMenuClick={handleSidebarToggle} />

                    <div className="flex-1 overflow-auto">
                        <div className="flex gap-1 items-center justify-start my-2">
                            <FileText size={18} />
                            <h2 className="font-semibold text-lg">Menu OSCE</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                            Halaman OSCE digunakan untuk mengelola daftar OSCE.
                        </p>

                        <OsButton
                            name="primary"
                            onClick={openAddModal}
                            className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                        >
                            <OsIcon
                                name="add"
                                className="h-os-20 os-icon-light mr-os-8"
                            />
                            Tambah OSCE
                        </OsButton>

                        <section>
                            {/* --- FILTER --- */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-grow">
                                    <OsSearchBar
                                        search={search}
                                        setSearch={setSearch}
                                        placeholder="Cari data OSCE secara instan..."
                                    />
                                </div>
                                <div className="w-full sm:w-64 shrink-0">
                                    <OsInput
                                        type="select"
                                        value={tahunFilter}
                                        onChange={(e) => {
                                            const val = e.target
                                                ? e.target.value
                                                : e;
                                            setTahunFilter(val);
                                        }}
                                        options={[
                                            {
                                                label: "Semua Angkatan",
                                                value: "SEMUA",
                                            },
                                            ...(tahunAkademikOptions || []),
                                        ]}
                                        className="h-[46px]"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-1 items-center justify-start mb-2">
                                <Table2 size={18} />
                                <h2 className="font-semibold text-lg">
                                    Table OSCE
                                </h2>
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    (Total: {totalItems} data)
                                </span>
                            </div>

                            <section className="bg-white p-5 border border-os-primary overflow-x-auto rounded-xl shadow-sm">
                                <div className="min-w-max">
                                    <OsTableHeader columns={columns} />
                                    <OsTableBody
                                        data={rows}
                                        columns={columns}
                                    />
                                </div>
                            </section>

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
                <div className="mt-8">
                    <OsCopyright />
                </div>
            </main>

            {/* --- MODAL DELETE --- */}
            <Modals
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                variant="delete"
                title="Hapus Data OSCE?"
                message={`Apakah Anda yakin ingin menghapus data OSCE: ${selectedOsce?.nama_osce} secara permanen?`}
                dataToDelete={
                    selectedOsce
                        ? [
                              {
                                  key: "Nama OSCE",
                                  value: selectedOsce.nama_osce,
                              },
                              {
                                  key: "Rentang Tanggal",
                                  value: `${selectedOsce.tanggal_mulai} - ${selectedOsce.tanggal_selesai}`,
                              },
                          ]
                        : []
                }
                confirmText="Hapus"
            />

            {/* --- MODAL TAMBAH --- */}
            <OsModal
                show={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Tambah OSCE Baru"
                subtitle="Masukkan detail ujian OSCE yang baru"
                variant="add"
                onSubmit={handleAddSubmit}
                onClear={() => {
                    reset();
                    clearErrors();
                }}
            >
                <div className="flex flex-col gap-3">
                    {/* INPUT NAMA OSCE */}
                    <div>
                        <OsInput
                            type="text"
                            label="Nama OSCE"
                            placeholder="Contoh: OSCE Blok A Semester Ganjil"
                            value={data.nama_osce}
                            onChange={(e) => {
                                setData("nama_osce", e.target.value);
                                if (errors.nama_osce) clearErrors("nama_osce");
                            }}
                            // required <-- Dihapus
                        />
                        {errors.nama_osce && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.nama_osce}
                            </p>
                        )}
                    </div>

                    {/* INPUT TAHUN AKADEMIK */}
                    <div>
                        <OsInput
                            type="select"
                            label="Tahun Akademik"
                            options={[
                                { label: "Pilih Tahun", value: "" },
                                ...(tahunAkademikOptions || []),
                            ]}
                            value={data.id_tahun_akademik}
                            onChange={(e) => {
                                setData("id_tahun_akademik", e.target.value);
                                if (errors.id_tahun_akademik)
                                    clearErrors("id_tahun_akademik");
                            }}
                            // required <-- Dihapus
                        />
                        {errors.id_tahun_akademik && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.id_tahun_akademik}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {/* INPUT TANGGAL MULAI */}
                        <div className="w-full">
                            <OsInput
                                type="date"
                                label="Tanggal Mulai"
                                value={data.tanggal_mulai}
                                onChange={(e) => {
                                    setData("tanggal_mulai", e.target.value);
                                    if (errors.tanggal_mulai)
                                        clearErrors("tanggal_mulai");
                                }}
                                className="w-full"
                                // required <-- Dihapus
                            />
                            {errors.tanggal_mulai && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.tanggal_mulai}
                                </p>
                            )}
                        </div>

                        {/* INPUT TANGGAL SELESAI */}
                        <div className="w-full">
                            <OsInput
                                type="date"
                                label="Tanggal Selesai"
                                value={data.tanggal_selesai}
                                onChange={(e) => {
                                    setData("tanggal_selesai", e.target.value);
                                    if (errors.tanggal_selesai)
                                        clearErrors("tanggal_selesai");
                                }}
                                className="w-full"
                                // required <-- Dihapus
                            />
                            {errors.tanggal_selesai && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.tanggal_selesai}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </OsModal>

            {/* --- MODAL EDIT --- */}
            <OsModal
                show={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit OSCE"
                subtitle={editData?.nama_osce || "Detail OSCE"}
                variant="edit"
                onSubmit={handleEditSubmit}
                onDelete={() => {
                    setIsEditOpen(false);
                    openDeleteModal(editData);
                }}
            >
                <div className="flex flex-col gap-3">
                    {/* INPUT NAMA OSCE */}
                    <div>
                        <OsInput
                            type="text"
                            label="Nama OSCE"
                            placeholder="Contoh: OSCE Blok A Semester Ganjil"
                            value={data.nama_osce}
                            onChange={(e) => {
                                setData("nama_osce", e.target.value);
                                if (errors.nama_osce) clearErrors("nama_osce");
                            }}
                        />
                        {errors.nama_osce && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.nama_osce}
                            </p>
                        )}
                    </div>

                    {/* INPUT TAHUN AKADEMIK */}
                    <div>
                        <OsInput
                            type="select"
                            label="Tahun Akademik"
                            options={[
                                { label: "Pilih Tahun", value: "" },
                                ...(tahunAkademikOptions || []),
                            ]}
                            value={data.id_tahun_akademik}
                            onChange={(e) => {
                                setData("id_tahun_akademik", e.target.value);
                                if (errors.id_tahun_akademik)
                                    clearErrors("id_tahun_akademik");
                            }}
                        />
                        {errors.id_tahun_akademik && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.id_tahun_akademik}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {/* INPUT TANGGAL MULAI */}
                        <div className="w-full">
                            <OsInput
                                type="date"
                                label="Tanggal Mulai"
                                value={data.tanggal_mulai}
                                onChange={(e) => {
                                    setData("tanggal_mulai", e.target.value);
                                    if (errors.tanggal_mulai)
                                        clearErrors("tanggal_mulai");
                                }}
                                className="w-full"
                            />
                            {errors.tanggal_mulai && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.tanggal_mulai}
                                </p>
                            )}
                        </div>

                        {/* INPUT TANGGAL SELESAI */}
                        <div className="w-full">
                            <OsInput
                                type="date"
                                label="Tanggal Selesai"
                                value={data.tanggal_selesai}
                                onChange={(e) => {
                                    setData("tanggal_selesai", e.target.value);
                                    if (errors.tanggal_selesai)
                                        clearErrors("tanggal_selesai");
                                }}
                                className="w-full"
                            />
                            {errors.tanggal_selesai && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.tanggal_selesai}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </OsModal>
        </div>
    );
}
