import React, { useState, useEffect, useMemo } from "react"; // [1] Tambah useEffect & useMemo
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright.jsx";
import OsButton from "../../components/button.jsx";
import OsIcon from "../../components/icons";
import OsInput from "../../components/input.jsx";
import OsModal from "../../components/Modal.jsx";
import { router, usePage } from "@inertiajs/react";
import OsPagination from "../../components/pagination";
import { Edit2, Trash2 } from "lucide-react";
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

export default function OsceListPage({
    osce,
    // filters, // Tidak dipakai lagi
    tahunAkademikOptions,
}) {
    // 1. Ambil Data Full
    const allOsceData = Array.isArray(osce) ? osce : osce?.data || [];

    // 2. State Filter & Pagination
    const [search, setSearch] = useState("");
    const [tahun, setTahun] = useState(""); // Default kosong biar tampil semua
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- LOGIC INSTANT FILTER ---
    // A. Reset halaman ke 1 jika filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search, tahun]);

    // B. Filter Data
    const filteredData = useMemo(() => {
        return allOsceData.filter((item) => {
            // Filter Search (Nama OSCE)
            const matchSearch = item.nama_osce
                ?.toLowerCase()
                .includes(search.toLowerCase());

            // Filter Tahun (String match atau ID match)
            // Asumsi: 'item.tahun_akademik_string' berisi misal "2025/2026"
            // Jika user pilih "2025", kita cek apakah string tersebut mengandung "2025"
            let matchTahun = true;
            if (tahun) {
                const taString = item.tahun_akademik_string || "";
                matchTahun = taString.includes(tahun);
            }

            return matchSearch && matchTahun;
        });
    }, [search, tahun, allOsceData]);

    // C. Pagination Slicing
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // D. Link Generator
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

    // Form Data
    const initialFormState = {
        nama_osce: "",
        id_tahun_akademik: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
    };
    const [formData, setFormData] = useState(initialFormState);

    // --- ACTION HANDLERS ---
    const openEditModal = (item) => {
        setEditData(item);
        setFormData({
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
        router.post("/admin/osce", formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                setFormData(initialFormState);
            },
            onError: (errors) => console.error("Gagal Validasi:", errors),
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editData) return;
        router.put(`/admin/osce/${editData.id_osce}`, formData, {
            onSuccess: () => {
                setIsEditOpen(false);
                setFormData(initialFormState);
            },
            onError: (errors) => console.error("Gagal Update:", errors),
        });
    };

    // --- TABLE ROWS (MAPPING DATA PAGINATION) ---
    // Gunakan 'paginatedData' di sini
    const rows = paginatedData.map((item, i) => ({
        no: (currentPage - 1) * itemsPerPage + i + 1,
        nama: (
            <div className="flex flex-col items-start leading-tight">
                <div className="font-semibold leading-tight">
                    {item.nama_osce}
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                    {item.detail_stase} | {item.detail_mahasiswa} |{" "}
                    {item.detail_sesi}
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
                {item.tahun_akademik_string}
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
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="grid w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                <OsHeader onMenuClick={handleSidebarToggle} />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">Menu OSCE</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman OSCE digunakan untuk mengelola daftar OSCE.
                    </p>

                    <OsButton
                        name="primary"
                        onClick={() => {
                            setFormData(initialFormState);
                            setIsAddOpen(true);
                        }}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />
                        Tambah OSCE
                    </OsButton>

                    <section>
                        {/* SEARCH BAR INSTAN */}
                        <OsSearchBar
                            search={search}
                            setSearch={setSearch} // Langsung update state
                            placeholder="Cari data OSCE..."
                        >
                            <OsInput
                                type="select"
                                label=""
                                options={[
                                    { label: "Semua Tahun", value: "" },
                                    { label: "2025", value: "2025" },
                                    { label: "2024", value: "2024" },
                                    { label: "2023", value: "2023" },
                                ]}
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)} // Langsung update state
                                className="w-[140px]"
                            />
                        </OsSearchBar>

                        <h2 className="text-lg font-semibold mb-2">
                            Table OSCE
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Total: {totalItems} data)
                            </span>
                        </h2>

                        <div className="w-full overflow-x-auto pb-4">
                            <div className="min-w-max">
                                <OsTableHeader columns={columns} />
                                {filteredData.length > 0 ? (
                                    <OsTableBody
                                        data={rows}
                                        columns={columns}
                                    />
                                ) : (
                                    <div className="flex items-center border-t border-gray-300">
                                        <p className="w-full text-center text-sm py-4 text-gray-500">
                                            Data OSCE tidak ditemukan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PAGINATION CLIENT SIDE */}
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

                <OsCopyright />
            </main>

            {/* ... SISA KODE MODAL (ADD, EDIT, DELETE) TETAP SAMA PERSIS ... */}
            {/* Saya sertakan modal add/edit/delete agar kode tetap lengkap, tidak ada logika yang berubah di sini */}

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
                              {
                                  key: "Tahun Akademik",
                                  value:
                                      selectedOsce.tahun_akademik_string || "-",
                              },
                          ]
                        : []
                }
                confirmText="Hapus"
            />

            <OsModal
                show={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Tambah OSCE Baru"
                subtitle="Masukkan detail ujian OSCE yang baru"
                variant="add"
                onSubmit={handleAddSubmit}
                onClear={() => setFormData(initialFormState)}
            >
                <div
                    className="flex flex-col gap-3"
                    key={isAddOpen ? "add-active" : "add-inactive"}
                >
                    <OsInput
                        type="text"
                        label="Nama OSCE"
                        placeholder="Contoh: OSCE Blok A Semester Ganjil"
                        value={formData.nama_osce}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                nama_osce: e.target.value,
                            })
                        }
                    />
                    <OsInput
                        type="select"
                        label="Tahun Akademik"
                        options={[
                            { label: "Pilih Tahun", value: "" },
                            ...(tahunAkademikOptions || []),
                        ]}
                        value={formData.id_tahun_akademik}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                id_tahun_akademik: e.target.value,
                            })
                        }
                    />
                    <div className="flex gap-3">
                        <OsInput
                            type="date"
                            label="Tanggal Mulai"
                            value={formData.tanggal_mulai}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    tanggal_mulai: e.target.value,
                                })
                            }
                            className="w-full"
                        />
                        <OsInput
                            type="date"
                            label="Tanggal Selesai"
                            value={formData.tanggal_selesai}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    tanggal_selesai: e.target.value,
                                })
                            }
                            className="w-full"
                        />
                    </div>
                </div>
            </OsModal>

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
                <div
                    className="flex flex-col gap-3"
                    key={editData ? editData.id_osce : "edit"}
                >
                    <OsInput
                        type="text"
                        label="Nama OSCE"
                        placeholder="Contoh: OSCE Blok A Semester Ganjil"
                        value={formData.nama_osce}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                nama_osce: e.target.value,
                            })
                        }
                    />
                    <OsInput
                        type="select"
                        label="Tahun Akademik"
                        options={[
                            { label: "Pilih Tahun", value: "" },
                            ...(tahunAkademikOptions || []),
                        ]}
                        value={formData.id_tahun_akademik}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                id_tahun_akademik: e.target.value,
                            })
                        }
                    />
                    <div className="flex gap-3">
                        <OsInput
                            type="date"
                            label="Tanggal Mulai"
                            value={formData.tanggal_mulai}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    tanggal_mulai: e.target.value,
                                })
                            }
                            className="w-full"
                        />
                        <OsInput
                            type="date"
                            label="Tanggal Selesai"
                            value={formData.tanggal_selesai}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    tanggal_selesai: e.target.value,
                                })
                            }
                            className="w-full"
                        />
                    </div>
                </div>
            </OsModal>
        </div>
    );
}
