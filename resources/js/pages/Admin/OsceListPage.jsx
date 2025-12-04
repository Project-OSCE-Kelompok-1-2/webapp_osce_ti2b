import React, { useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright.jsx";
import OsButton from "../../components/button.jsx";
import OsIcon from "../../components/icons";
import OsInput from "../../components/Input.jsx";
import OsModal from "../../components/Modal.jsx";
import { Head, router, usePage, Link } from "@inertiajs/react";
import OsPagination from "../../components/pagination";
import {
    Home,
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Copyright,
} from "lucide-react";
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import Modals from "../../components/Modals.jsx";

//Definisi kolom tabel
const columns = [
    {
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
        key: "no",
    },
    {
        content: "Nama OSCE",
        width: "flex-1",
        classes: "justify-start items-center px-4",
        key: "nama",
    },
    {
        content: "Rentang Tanggal",
        width: "w-2/12",
        classes: "justify-center items-center",
        key: "tanggal",
    },
    {
        content: "Tahun Akademik",
        width: "w-2/12",
        classes: "justify-center items-center",
        key: "tahun",
    },
    {
        content: "Aksi",
        width: "w-3/12",
        classes: "justify-center items-center",
        key: "aksi",
    },
];

export default function OsceListPage({
    osce,
    filters,
    tahunAkademikOptions,
    errors,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [tahun, setTahun] = useState(filters.tahun || "2025");

    // STATE MODAL
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // STATE MODAL DELETE
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedOsce, setSelectedOsce] = useState(null);

    // STATE DATA FORM
    const initialFormState = {
        nama_osce: "",
        id_tahun_akademik: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
    };
    const [formData, setFormData] = useState(initialFormState);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/admin/osce",
            { search, tahun },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

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

    // 1. Siapin isi data tabel
    const rows = osce.data.map((item, i) => ({
        no: osce.from + i,
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

    const handleAddSubmit = (e) => {
        e.preventDefault();
        // console.log("DATA ADD:", formData); // Debugging
        router.post("/admin/osce", formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                setFormData(initialFormState);
            },
            onError: (errors) => {
                console.error("Gagal Validasi:", errors);
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editData) return;
        // console.log("DATA EDIT:", formData); // Debugging
        router.put(`/admin/osce/${editData.id_osce}`, formData, {
            onSuccess: () => {
                setIsEditOpen(false);
                setFormData(initialFormState);
            },
            onError: (errors) => {
                console.error("Gagal Update:", errors);
            },
        });
    };

    const handleClearForm = () => {
        setFormData(initialFormState);
    };

    // Kita tidak pakai handleFormChange generic lagi karena OsInput bermasalah dengan 'name'
    // Kita akan pasang onChange manual di setiap input di bawah.

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                <OsHeader />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">Menu OSCE</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman OSCE digunakan untuk mengelola daftar OSCE,
                        termasuk pencarian data, filter tahun akademik, serta
                        pengaturan properti seperti stase, sesi, dan mahasiswa
                        yang terlibat.
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
                        <OsSearchBar
                            search={search}
                            setSearch={setSearch}
                            onSearchClick={handleSearch}
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
                                onChange={(e) => setTahun(e.target.value)}
                                className="w-[140px]"
                            />
                        </OsSearchBar>
                        <h2 className="text-lg font-semibold mb-2">
                            Table OSCE
                        </h2>
                        <OsTableHeader columns={columns} />
                        <OsTableBody data={rows} columns={columns} />

                        {osce.data.length === 0 && (
                            <div className="flex items-center border-t border-gray-300">
                                <p className="w-full text-center text-sm py-4 text-gray-500">
                                    Data OSCE tidak ditemukan.
                                </p>
                            </div>
                        )}

                        {osce.links && osce.links.length > 3 && (
                            <div className="mt-8">
                                <OsPagination links={osce.links} />
                            </div>
                        )}
                    </section>
                </div>

                <OsCopyright />
            </main>

            {/* DELETE CONFIRMATION MODAL */}
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

            {/* ADD MODAL */}
            <OsModal
                show={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Tambah OSCE Baru"
                subtitle="Masukkan detail ujian OSCE yang baru"
                variant="add"
                onSubmit={handleAddSubmit}
                onClear={handleClearForm}
            >
                {/* KEY PROP: Penting! 
                   Karena OsInput punya state lokal (inputValue) dan tidak mereset diri saat value prop berubah,
                   kita harus memaksa OsInput hancur & buat baru saat modal dibuka.
                */}
                <div
                    className="flex flex-col gap-3"
                    key={isAddOpen ? "add-active" : "add-inactive"}
                >
                    <OsInput
                        type="text"
                        label="Nama OSCE"
                        placeholder="Contoh: OSCE Blok A Semester Ganjil"
                        value={formData.nama_osce}
                        // FIX: Manual set state karena OsInput text tidak kirim 'name'
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
                        // FIX: Manual set state
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
                            // FIX: Manual set state
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
                            // FIX: Manual set state
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

            {/* EDIT MODAL */}
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
                {/* KEY PROP: Memaksa input ter-refresh saat data edit berubah */}
                <div
                    className="flex flex-col gap-3"
                    key={editData ? editData.id_osce : "edit"}
                >
                    <OsInput
                        type="text"
                        label="Nama OSCE"
                        placeholder="Contoh: OSCE Blok A Semester Ganjil"
                        value={formData.nama_osce}
                        // FIX: Manual set state
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
                        // FIX: Manual set state
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
                            // FIX: Manual set state
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
                            // FIX: Manual set state
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
