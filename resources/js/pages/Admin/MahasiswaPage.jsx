import React, { useState } from "react";
import { Link, router, usePage, Head } from "@inertiajs/react";
import { Trash2, X, Edit2 } from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsHeader from "../../components/Header.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsInput from "../../components/input.jsx";
import OsModal from "../../components/Modal.jsx";
import OsButton from "../../components/button.jsx";

import Modals from "../../components/Modals.jsx"; // 🔥 MODAL IMPORT

// Kolom tabel (sudah benar)
const mahasiswaColumns = [
    { key : "no",content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        key : "nim_mahasiswa",
        content: "NIM Mahasiswa",
        width: "w-56",
        classes: "justify-start items-center px-4",
    },
    {
        key : "nama_mahasiswa",
        content: "Nama Mahasiswa",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key : "action",
        content: "Action",
        width: "w-56",
        classes: "justify-center items-center px-4",
    },
];

export default function MahasiswaPage() {
    const { mahasiswa, filters, flash } = usePage().props;

    const [search, setSearch] = useState(filters?.search || "");
    const [angkatan, setAngkatan] = useState(filters?.angkatan || "");
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [showExcelModal, setShowExcelModal] = useState(false);
    const [showModal, setShowModal] = useState(false); // Modal Tambah

    // 🔥 STATE UNTUK DELETE MODAL
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

    // 🔥 STATE UNTUK EDIT MODAL
    const [showEditModal, setShowEditModal] = useState(false);
    const [mahasiswaToEdit, setMahasiswaToEdit] = useState(null);
    // Asumsi: Anda akan memiliki state form terpisah untuk edit,
    // tapi untuk sementara kita hanya menyimpan datanya.

    const angkatanList = [
        { value: "", label: "Semua Angkatan" },
        { value: "2025", label: "2025" },
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
        { value: "2022", label: "2022" },
        { value: "2021", label: "2021" },
    ];

    const handleSearch = () => {
        router.get("/admin/mahasiswa", { search, angkatan });
    };



    // 🔥 HANDLE EDIT DENGAN MODAL
    const handleEdit = (item) => {
        setMahasiswaToEdit(item);
        setShowEditModal(true);
    };

    // 🔥 PLACEHOLDER UNTUK SUBMIT EDIT
    const handleSubmitEdit = (e) => {
        e.preventDefault();
        // Logika Inertia/API PUT/PATCH untuk update data mahasiswa
        console.log("Submitting edit for:", mahasiswaToEdit);
        // router.put(`/admin/mahasiswa/${mahasiswaToEdit.id_mahasiswa}`, formData, { ... })
        setShowEditModal(false);
    };


    // 🔥 HANDLE DELETE DENGAN MODAL (Kode asli tidak diubah)
    const handleDelete = (id, nama) => {
        setSelectedMahasiswa({ id, nama });
        setShowDeleteModal(true);
    };

    // 6. Fungsi import (sudah benar)
    const handleImport = async (e) => {
        e.preventDefault();
        if (!importFile) return alert("Pilih file Excel terlebih dahulu.");
        setImporting(true);
        router.post(
            "/admin/mahasiswa/import",
            { file: importFile },
            {
                forceFormData: true,
                onSuccess: () => {
                    alert("File Excel berhasil diunggah!");
                    setShowExcelModal(false);
                    setImportFile(null);
                },
                onError: () => alert("Terjadi kesalahan saat mengunggah file."),
                onFinish: () => setImporting(false),
            }
        );
    };

    //7. Siapin untuk isi data tabel
    const tableData = mahasiswa.data.map((item, index) => ({
        no: mahasiswa.from + index,
        nim_mahasiswa: item.nim,
        nama_mahasiswa: item.nama,
        action: (
            <div className="flex items-center justify-center space-x-3">
                <OsButton name="edit" onClick={() => setShowEditModal(item)}>
                    <Edit2 size={18} />
                </OsButton>

                <OsButton
                    name="warning"
                    onClick={() => handleDelete(item.id_mahasiswa)}

                >
                    <Trash2 size={18} className="text-os-white" />
                </OsButton>
            </div>
        )
    }));


    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                {/* HEADER */}
                <OsHeader variant="goback" backLink="/admin/stase" />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        Menu Mahasiswa
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                        Menu Mahasiswa berisi berbagai fitur yang digunakan
                        untuk mengelola data, aktivitas, dan kebutuhan mahasiswa
                        dalam sistem.
                    </p>

                    {/* Tombol Tambah & Import */}
                    <div className="flex items-center gap-3">
                        <OsButton
                            name="primary"
                            onClick={() => setShowModal(true)}
                            className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                        >
                            <OsIcon
                                name="add"
                                className="h-os-20 os-icon-light mr-os-8"
                            />
                            Tambah Mahasiswa Via Form
                        </OsButton>
                        <OsButton
                        name="primary"
                            onClick={() => setShowExcelModal(true)}
                            className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                        >
                            <OsIcon
                                name="Download (2)"
                                className="h-os-20 os-icon-light mr-os-8"
                            />
                            Tambah Mahasiswa Via Excel
                        </OsButton>
                    </div>

                    {/* Notifikasi Sukses/Error */}
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

                    {/* 7. [PERBAIKAN] Filter dibungkus <form> */}
                    {/* HANYA PERLU SATU FORM UNTUK FILTER, MENGHAPUS DUPLIKASI */}
                    <form
                        onSubmit={handleSearch}
                        className="flex items-start gap-3"
                    >
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari data mahasiswa..."
                                className="border border-black rounded-xl pl-4 pr-4 w-full h-[46px] focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* search + dropdown tahun*/}


                        <OsSearchBar
                            search={search}
                            setSearch={setSearch}
                            onSearchClick={handleSearch}
                            placeholder="Cari Angkatan mahasiswa..."
                        >
                            <div className="w-60">
                                <OsInput
                                    type="select"
                                    value={angkatan}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setAngkatan(val);

                                        router.get(
                                            "/admin/mahasiswa",
                                            { search, angkatan: val },
                                            { preserveState: true, replace: true, preserveScroll: true }
                                        );
                                    }}


                                    options={angkatanList}
                                />
                            </div>
                        </OsSearchBar>
                    </form>

                    {/* Tabel Mahasiswa */}
                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            Tabel Mahasiswa
                        </h2>
                        <OsTableHeader columns={mahasiswaColumns} />


                        {mahasiswa.data.length > 0 ? (
                            <OsTableBody data={tableData} columns={mahasiswaColumns} />
                        ) : (
                            <div className="flex items-center border-t border-gray-400">
                                <p className="w-full text-center text-sm py-4 text-gray-500">
                                    Data mahasiswa tidak ditemukan.
                                </p>
                            </div>
                        )}

                        {mahasiswa.links && mahasiswa.links.length > 3 && (
                            <div className="mt-2">
                                <OsPagination links={mahasiswa.links} />
                            </div>
                        )}
                    </section>
                </div>

                <OsCopyright />
            </main>

            {/* 🔥 MODAL DELETE MAHASISWA (Tidak diubah) */}
            {showDeleteModal && (
                <Modals
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    variant="delete"
                    dataToDelete={[
                        {
                            key: "Nama Mahasiswa",
                            value: selectedMahasiswa?.nama,
                        },
                        { key: "ID", value: selectedMahasiswa?.id },
                    ]}
                    onConfirm={() => {
                        router.delete(
                            `/admin/mahasiswa/${selectedMahasiswa.id}`,
                            {
                                preserveScroll: true,
                                onSuccess: () =>
                                    setShowDeleteModal(false),
                            }
                        );
                    }}
                />
            )}

            {/* ===== MODAL IMPORT EXCEL (Tidak diubah) =====
                Saya komentari karena ada duplikasi di bawah dengan OsModal
            {showExcelModal && ( ... )
            */}

            {/* ===== MODAL TAMBAH (ADD) - Menggunakan OsModal */}
            <OsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Tambah Mahasiwa Baru"
                subtitle="Isi form di bawah untuk menambahkan mahasiswa baru."
                // onSubmit={() => alert('Submit Tambah')} // Tambahkan fungsi submit Anda
            >
                <div className="flex gap-4">
                    <OsInput
                        label="NIM Mahasiswa"
                        type="text"
                        name="nim_mahasiswa"
                        placeholder="Masukkan NIM Mahasiswa..."
                        required
                    />

                                        <OsInput
                        label="Angkatan Mahasiswa"
                        type="suggest"
                        name="nim_mahasiswa"
                        placeholder="Masukkan Angkatan Mahasiswa..."
                        required
                    />
                </div>
                <OsInput
                    label="Nama Mahasiswa"
                    type="text"
                    name="nama_mahasiswa"
                    placeholder="Masukkan Nama Mahasiswa..."
                    required
                />
                <OsInput
                    label="Jurusan Mahasiswa"
                    type="suggest" // Asumsi OsInput bisa handle suggest/select
                    name="jurusan_mahasiswa"
                    placeholder="Masukkan Jurusan Mahasiswa..."
                    required
                />
            </OsModal>

            {/* 🔥 ===== MODAL EDIT - Menggunakan OsModal dengan variant="edit" ===== */}
            <OsModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Mahasiswa"
                subtitle={mahasiswaToEdit?.nama || "Data tidak ditemukan"}
                variant="edit"
                onSubmit={handleSubmitEdit}
                onDelete={() => {
                    // Panggil modal delete, pastikan data terisi
                    handleDelete(mahasiswaToEdit?.id_mahasiswa, mahasiswaToEdit?.nama);
                    setShowEditModal(false); // Tutup modal edit
                }}
            >
                {/* Isi form dengan data mahasiswaToEdit.
                    Anda harus menambahkan state form di MahasiswaPage dan
                    mengisi nilai input dari mahasiswaToEdit (misalnya menggunakan useEffect)
                    untuk fungsionalitas edit yang sebenarnya.
                */}
                <div className="flex gap-4">
                    <OsInput
                        label="NIM Mahasiswa"
                        type="text"
                        name="nim_mahasiswa_edit"
                        placeholder="Masukkan NIM Mahasiswa..."
                        defaultValue={mahasiswaToEdit?.nim} // Menggunakan defaultValue sementara
                        required
                    />
                    <OsInput
                        label="Angkatan Mahasiswa"
                        type="suggest"
                        name="nim_mahasiswa_edit"
                        placeholder="Masukkan Angkatan Mahasiswa..."
                        defaultValue={mahasiswaToEdit?.nim} // Menggunakan defaultValue sementara
                        required
                    />
                </div>
                <OsInput
                    label="Nama Mahasiswa"
                    type="text"
                    name="nama_mahasiswa_edit"
                    placeholder="Masukkan Nama Mahasiswa..."
                    defaultValue={mahasiswaToEdit?.nama} // Menggunakan defaultValue sementara
                    required
                />
                <OsInput
                    label="Jurusan Mahasiswa"
                    type="suggest"
                    name="jurusan_mahasiswa_edit"
                    placeholder="Masukkan Jurusan Mahasiswa..."
                    defaultValue={mahasiswaToEdit?.jurusan} // Menggunakan defaultValue sementara
                    required
                />
            </OsModal>


            {/* ===== MODAL IMPORT EXCEL (OsModal) - Dihapus duplikasi manual */}
            <OsModal
                show={showExcelModal}
                onClose={() => setShowExcelModal(false)}
                title="Template Excel Mahasiswa"
                subtitle="Download file excel dan isi data mahasiswa"
            >
                {/* Body content */}
                <OsButton className="w-full">
                    Download Template Excel
                </OsButton>

                <div className="bg-red-50 border border-red-300 text-red-700 text-xs rounded-md p-3 leading-relaxed">
                    <strong>⚠️ Perhatian!</strong>
                    <br />
                    Jangan ubah heading untuk patokan program.
                </div>

                <div className="flex flex-col items-center gap-2">
                    <label
                        htmlFor="mahasiswa-import-file"
                        className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-md cursor-pointer text-sm font-medium w-full text-center transition-colors"
                    >
                        {importFile ? importFile.name : "Upload file excel"}
                    </label>

                    <input
                        id="mahasiswa-import-file"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={(e) =>
                            setImportFile(e.target.files?.[0] ?? null)
                        }
                        className="hidden"
                    />

                    <a className="text-xs text-blue-600 underline hover:text-blue-800">
                        Ada masalah? Hubungi admin
                    </a>
                </div>
                {/* Menggunakan OsModal, tidak ada footer default,
                    jadi tombol Submit dan Cancel harus dimasukkan di sini
                    atau di handle oleh OsModal jika memiliki slot/logic footer
                    yang lebih kompleks. Karena OsModal yang Anda berikan
                    sudah memiliki footer, kita abaikan yang manual.
                */}
            </OsModal>

        </div>
    );
}
