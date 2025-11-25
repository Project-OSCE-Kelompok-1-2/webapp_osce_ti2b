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
    Edit,
    Edit2, // Import 'Edit' yang hilang
} from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import Modals from "../../components/Modals.jsx"; // Modal delete lama
import OsModal from "../../components/Modal"; // Modal add + edit
import OsIcon from "../../components/icons.jsx";
import OsStepModal from "../../components/StepModal.jsx";

// Asumsi impor untuk komponen lain yang hilang di kode asli
import OsInput from "../../components/Input.jsx";
import OsButton from "../../components/button.jsx";
import OsHeader from "../../components/Header.jsx"; // Diperlukan untuk header goback

const jadwalColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
    },
    {
        key: "tanggal_sesi",
        content: "Tanggal / Sesi",
        width: "w-7/12",
        classes: "justify-start items-center px-4",
    },
    {
        key: "jumlah_mahasiswa",
        content: "Jumlah Mahasiswa",
        width: "w-2/12",
        classes: "justify-start items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-3/12",
        classes: "justify-center items-center",
    },
];

// Memperbaiki definisi komponen agar hanya ada satu 'export default'
export default function SesiOscePage({ sesi, osce, filters }) {
    // State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");

    const [isStepOpen, setIsStepOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);


    // --- DATA DUMMY ---
    const dummyStase = [
        { value: "bedah", label: "Bedah" },
        { value: "anak", label: "Ilmu Kesehatan Anak" },
        { value: "internis", label: "Penyakit Dalam" },
        { value: "neurologi", label: "Neurologi" },
        { value: "obsgyn", label: "Obstetri & Ginekologi" },
        { value: "paru", label: "Pulmonologi" },
    ];

    const dummyRuangan = [
        { value: "r1", label: "Ruangan 1" },
        { value: "r2", label: "Ruangan 2" },
        { value: "r3", label: "Ruangan 3" },
        { value: "lab1", label: "Laboratorium 1" },
        { value: "lab2", label: "Laboratorium 2" },
    ];

    const dummyPenguji = [
        { value: "dr-farhan", label: "dr. Farhan" },
        { value: "dr-silvia", label: "dr. Silvia" },
        { value: "dr-bagus", label: "dr. Bagus" },
        { value: "dr-nadira", label: "dr. Nadira" },
    ];

    // formData hanya untuk tampilan (tidak dijalankan)
    const [formData, setFormData] = useState({
        stase: [],
        tanggalMulai: "",
        tanggalSelesai: "",
        sesi: [],
        ruangan: "",
        penguji: [],
        keterangan: "",
    });

    // Modal Delete
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSesi, setSelectedSesi] = useState(null);

    // Modal Add / Edit
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

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
    const handleEditEnrollment = (id_osce_stase) => {
        // Rute yang benar di Laravel: /admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment
        // Menggunakan osce.id_osce (dari props) dan id_osce_stase (dari item baris)
        router.visit(
            `/admin/osce/${osce.id_osce}/jadwal/${id_osce_stase}/enrollment`
        );
    };

    // Fungsi penanganan aksi (diperbaiki agar sesuai dengan logika modal)
    const handleEditSesi = (item) => openEditModal(item);
    const handleDeleteSesi = (item) => openDeleteModal(item);

    // siapin isi data tabel
    const rows = sesi.data.map((item, index) => ({
        no: sesi.from + index,
        tanggal_sesi: `${item.tanggal_formatted} (Pukul ${item.jam_mulai_formatted})`,
        jumlah_mahasiswa: `${item.jumlah_mahasiswa} Mahasiswa`,
        action: (
            <div className="flex items-center justify-between w-full gap-4 px-5">
                {/* Tombol Edit Enrollment (Tetap menggunakan router.visit) */}
                <OsButton
                    name="primary"
                    onClick={() => handleEditEnrollment(item.id_osce_stase)}
                    className="h-[38px] text-os-small w-full flex justify-around items-center gap-1"
                >
                    <OsIcon
                        name={"student"}
                        className="os-icon-light h-[20px]"
                    />
                    Edit Jumlah Mahasiswa
                </OsButton>

                <div className="flex items-center gap-2">
                    {/* Tombol Edit Sesi (Memanggil openEditModal) */}
                    <OsButton name="edit" onClick={() => handleEditSesi(item)}>
                        <Edit2 size={18} />
                    </OsButton>

                    {/* Tombol Delete Sesi (Memanggil openDeleteModal) */}
                    <OsButton
                        name="warning"
                        onClick={() => handleDeleteSesi(item)}
                    >
                        <Trash2 size={17} />
                    </OsButton>
                </div>
            </div>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                <OsHeader variant="goback" backLink="/admin/osce/" />

                <div className="flex-1 overflow-auto ">
                    {/* Tombol Add dan Deskripsi */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold mb-1">
                            [Nama OSCEnya]
                        </h2>
                        <p className="text-sm text-gray-500 mb-4 max-w-lg">
                            Halaman ini digunakan untuk mengelola **Jadwal
                            Sesi** ujian OSCE secara keseluruhan. Anda dapat
                            mendefinisikan waktu, tanggal, durasi, dan detail
                            setiap sesi.
                        </p>
                        <OsButton
                            name="primary"
                            onClick={() => {
                                setCurrentStep(0);
                                setIsStepOpen(true);
                            }}
                            className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            <OsIcon
                                name="add"
                                className="h-os-20 os-icon-light mr-os-8"
                            />
                            Tambah Sesi
                        </OsButton>
                    </section>

                    {/* Search Bar */}
                    <section className="rounded-lg w-full">
                        <OsSearchBar
                            search={searchTerm}
                            setSearch={setSearchTerm}
                            onSearchClick={handleSearch}
                            placeholder="Cari sesi..."
                        />
                    </section>

                    {/* === 📋 TABLE === */}
                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Stase
                    </h2>
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
                              {
                                  key: "Nama Sesi",
                                  value: selectedSesi?.nama_sesi,
                              },
                              {
                                  key: "Durasi",
                                  value: selectedSesi?.durasi + " menit",
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
                        type="date"
                        label="Tanggal sesi"
                        placeholder="Masukkan tanggal sesi..."
                        value={formData.nama_sesi}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                nama_sesi: e.target.value,
                            })
                        }
                    />

                    <div className="flex gap-3">
                        <OsInput
                            type="clock"
                            label="Jam Mulai"
                            placeholder="Durasi..."
                            value={formData.durasi}
                            className="w-full"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    durasi: e.target.value,
                                })
                            }
                        />

                        <OsInput
                            type="clock"
                            label="Jam Selesai"
                            placeholder="Durasi..."
                            value={formData.durasi}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    durasi: e.target.value,
                                })
                            }
                            className="w-full"
                        />
                    </div>

                    <OsInput
                        type="multi-select" // Diubah menjadi textarea jika memungkinkan untuk keterangan
                        label="Pilih Stase untuk Sesi Ini"
                        placeholder="Keterangan..."
                        value={formData.keterangan}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                keterangan: e.target.value,
                            })
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
                        type="date"
                        label="Tanggal sesi"
                        placeholder="Masukkan tanggal sesi..."
                        value={formData.nama_sesi}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                nama_sesi: e.target.value,
                            })
                        }
                    />

                    <div className="flex gap-3">
                        <OsInput
                            type="clock"
                            label="Jam Mulai"
                            placeholder="Durasi..."
                            value={formData.durasi}
                            className="w-full"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    durasi: e.target.value,
                                })
                            }
                        />

                        <OsInput
                            type="clock"
                            label="Jam Selesai"
                            placeholder="Durasi..."
                            value={formData.durasi}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    durasi: e.target.value,
                                })
                            }
                            className="w-full"
                        />
                    </div>

                    <OsInput
                        type="multi-select" // Diubah menjadi textarea jika memungkinkan untuk keterangan
                        label="Pilih Stase untuk Sesi Ini"
                        placeholder="Keterangan..."
                        value={formData.keterangan}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                keterangan: e.target.value,
                            })
                        }
                    />
                </div>
            </OsModal>

            <OsStepModal
                show={isStepOpen}
                onClose={() => setIsStepOpen(false)}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                steps={[
                    {
                        title: "Stase",
                        content: (
                            <div>
                                <OsInput
                                    type="multi-select" // Diubah menjadi textarea jika memungkinkan untuk keterangan
                                    label="Pilih Stase untuk Sesi Ini"
                                    options={dummyStase}
                                    placeholder="Keterangan..."
                                    value={formData.keterangan}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            keterangan: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        ),
                    },
                    {
                        title: "Sesi",
                        content: (
                            <div className="flex flex-col gap-2">
                                <OsInput
                                    type="date" // Diubah menjadi textarea jika memungkinkan untuk keterangan
                                    label="tanggal mulai"
                                    placeholder="Keterangan..."
                                    value={formData.keterangan}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            keterangan: e.target.value,
                                        })
                                    }
                                />
                                <div className="flex gap-3">
                                    <OsInput
                                        type="clock" // Diubah menjadi textarea jika memungkinkan untuk keterangan
                                        label="tanggal mulai"
                                        placeholder="Keterangan..."
                                        value={formData.keterangan}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                keterangan: e.target.value,
                                            })
                                        }
                                        className="w-full"
                                    />{" "}
                                    <OsInput
                                        type="clock" // Diubah menjadi textarea jika memungkinkan untuk keterangan
                                        label="tanggal mulai"
                                        placeholder="Keterangan..."
                                        value={formData.keterangan}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                keterangan: e.target.value,
                                            })
                                        }
                                        className="w-full"
                                    />
                                </div>
                                <OsInput
                                    type="multi-input"
                                    label="Jadwal pada stase ini"
                                    value={formData.jadwal}
                                    options={dummyStase}
                                    name="jadwal"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            keterangan: e.target.value,
                                        })
                                    }
                                    inputType="date"
                                    inputName="tanggal"
                                    inputPlaceholder="Pilih tanggal"
                                />
                            </div>
                        ),
                    },
                    {
                        title: "Ruangan",
                        content: (
                            <div>
                                <div>
                                    <OsInput
                                        type="single-select"
                                        label="Pilih ruangan untuk Sesi Ini"
                                        placeholder="Keterangan..."
                                        options={dummyRuangan}
                                        value={formData.keterangan}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                keterangan: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        title: "Penguji",
                        content: (
                            <div>
                                <OsInput
                                    type="multi-input-drop"
                                    label="Input penguji kedalam stase"
                                    value={formData.jadwal}
                                    options={dummyStase} // untuk list stase
                                    suggestOptions={["Budi", "Sinta", "Andi", "Joko"]} // untuk input suggest dosen
                                    name="jadwal"
                                    inputName="dosen" // name untuk suggest
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        ),
                    },
                ]}
                onSubmit={() => {
                    console.log("Step modal selesai");
                    setIsStepOpen(false);
                }}
            />
        </div>
    );
}
