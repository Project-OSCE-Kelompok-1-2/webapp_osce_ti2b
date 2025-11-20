import React, { useState } from "react";
import { Link, router, usePage, Head } from "@inertiajs/react";
import { Trash2, X } from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import Os_button from "../../components/button.jsx";
import OsHeader from "../../components/Header.jsx";
import OsInput from "../../components/input.jsx";
import OsModal from "../../components/Modal.jsx";
import OsButton from "../../components/button.jsx";

import Modals from "../../components/Modals.jsx"; // 🔥 MODAL IMPORT

// Kolom tabel (sudah benar)
const mahasiswaColumns = [
    { content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        content: "Nim Mahasiswa",
        width: "w-56",
        classes: "justify-start items-center px-4",
    },
    {
        content: "Nama Mahasiswa",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
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
    const [showModal, setShowModal] = useState(false);

    // 🔥 STATE UNTUK DELETE MODAL
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

    const angkatanList = [
        { value: "", label: "Semua Angkatan" },
        { value: "2025", label: "2025" },
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
        { value: "2022", label: "2022" },
        { value: "2021", label: "2021" },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/admin/mahasiswa",
            { search, angkatan },
            { preserveState: true, replace: true }
        );
    };

    // 🔥 HANDLE DELETE DENGAN MODAL
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

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title="Manajemen Mahasiswa" />
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                <OsHeader />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        Menu Mahasiswa
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Menu Mahasiswa berisi berbagai fitur yang digunakan
                        untuk mengelola data, aktivitas, dan kebutuhan mahasiswa
                        dalam sistem.
                    </p>

                    {/* Tombol Tambah & Import */}
                    <div className="flex items-center gap-3">
                        {/* <OsButtonF
                                onClick={() =>
                                    router.visit("/admin/mahasiswa/create")
                                }
                                className="flex items-center h-[38px] rounded-xl"
                            >
                                <OsIcon
                                    name="add"
                                    className="h-os-20 os-icon-light mr-os-8"
                                />
                                Tambah Mahasiswa
                            </OsButtonF>
                            <OsButton
                                onClick={() => setShowExcelModal(true)}
                                className="flex items-center h-[38px] rounded-xl"
                            >
                                <OsIcon
                                    name="Upload"
                                    className="h-os-20 os-icon-light mr-os-8"
                                />
                                Import dari Excel
                            </OsButton> */}
                        <OsButton
                            // onClick={() => router.get("/admin/stase/create")}
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
                            // onClick={() => router.get("/admin/stase/create")}
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
                        {/* Filter Search */}
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="relative flex-1">
                                <OsIcon
                                    name="Search"
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-os-20"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Cari data mahasiswa..."
                                    className="border border-black rounded-xl pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <select
                                value={angkatan}
                                onChange={(e) =>
                                    setAngkatan(e.target.value)
                                }
                                className="border border-black rounded-xl px-4 py-3"
                            >
                                {angkatanList.map((a) => (
                                    <option key={a.value} value={a.value}>
                                        {a.label}
                                    </option>
                                ))}
                            </select>

                        <Os_button
                            type="submit"
                            className="border border-black rounded-xl px-8 py-3"
                        >
                            Cari
                        </Os_button>
                    </form>

                    {/* Tabel Mahasiswa */}
                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            Tabel Mahasiswa
                        </h2>
                        <OsTableHeader columns={mahasiswaColumns} />

                        {mahasiswa.data.length > 0 ? (
                            mahasiswa.data.map((item, index) => (
                                <div
                                    key={item.id_mahasiswa}
                                    className="flex items-center border-t border-gray-400"
                                >
                                    <div className="w-16 px-4 py-3 text-center">
                                        {mahasiswa.from + index}
                                    </div>
                                    <div className="w-56 px-4 py-3 border-l border-gray-400">
                                        {item.nim}
                                    </div>
                                    <div className="flex-1 px-4 py-3 border-l border-gray-400">
                                        {item.nama}
                                    </div>
                                    <div className="w-56 h-[70px] flex items-center justify-center border-l border-gray-400">
                                        <div className="flex space-x-3">
                                            <Link
                                                href={`/admin/mahasiswa/${item.id_mahasiswa}/edit`}
                                                className="w-10 h-10 flex items-center justify-center bg-blue-700 p-2 border border-black rounded-xl text-white hover:bg-blue-600 transition"
                                            >
                                                <OsIcon
                                                    name="Edit"
                                                    className="h-os-20 w-os-20 os-icon-light"
                                                />
                                            </Link>

                                            {/* 🔥 GANTI DELETE BUTTON → MODAL */}
                                            <Os_button
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id_mahasiswa,
                                                        item.nama
                                                    )
                                                }
                                                className="w-10 h-10 flex items-center justify-center bg-white p-2 border border-black text-black rounded-xl hover:bg-gray-200 transition"
                                            >
                                                <OsIcon
                                                    name="Trash"
                                                    className="w-5 h-5 aspect-square scale-[3] os-icon-dark"
                                                />
                                            </Os_button>
                                        </div>
                                    </div>
                                </div>
                            ))
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

                <footer>
                    <OsCopyright />
                </footer>
            </main>

            {/* === MODAL IMPORT EXCEL === (Kode modal Anda sudah benar) */}
            {/* {showExcelModal && (
            {/* 🔥 MODAL DELETE MAHASISWA */}
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

            {/* ===== MODAL IMPORT EXCEL (TIDAK DIUBAH) ===== */}
            {showExcelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-[420px] shadow-xl overflow-hidden">
                        <div className="bg-gray-900 text-white text-center py-3 relative">
                            <h2 className="text-base font-semibold">
                                Template Excel Mahasiswa
                            </h2>
                            <p className="text-xs text-gray-300">
                                Download file excel dan isi data mahasiswa
                            </p>
                            <button
                                onClick={() => setShowExcelModal(false)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 flex flex-col gap-4">
                            <Os_button className="w-full">
                                Download Template Excel
                            </Os_button>
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
                                    {importFile
                                        ? importFile.name
                                        : "Upload file excel"}
                                </label>
                                <input
                                    id="mahasiswa-import-file"
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) =>
                                        setImportFile(
                                            e.target.files?.[0] ?? null
                                        )
                                    }
                                    className="hidden"
                                />

                                <a
                                    href="#"
                                    className="text-xs text-blue-600 underline hover:text-blue-800"
                                >
                                    Ada masalah? Hubungi admin
                                </a>
                            </div>
                        </div>

                        <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-t">
                            <Os_button
                                onClick={handleImport}
                                disabled={importing || !importFile}
                                className="w-full mr-2 disabled:opacity-50"
                            >
                                {importing
                                    ? "Mengunggah..."
                                    : "Submit"}
                            </Os_button>

                            <Os_button
                                onClick={() => setShowExcelModal(false)}
                                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </Os_button>
                        </div>
                    </div>
                </div>
            )}
            <OsModal
                show={showExcelModal}
                onClose={() => setShowExcelModal(false)}
                title="Template Excel Mahasiswa"
                subtitle="Download file excel dan isi data mahasiswa"
            >
                {/* Body content */}
                <Os_button className="w-full">
                    Download Template Excel
                </Os_button>

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
            </OsModal>
            <OsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Tambah Mahasiwa Baru"
                subtitle="Isi form di bawah untuk menambahkan mahasiswa baru."
            >
                <div className="flex gap-4">
                    <OsInput
                        label="NIM Mahasiswa"
                        type="text"
                        name="nama_stase"
                        placeholder="Masukkan NIM Mahasiswa..."
                        required
                    />
                    <OsInput
                        label="Angkatan"
                        type="suggest"
                        name="nama_stase"
                        placeholder="Masukkan Angkatan..."
                        required
                    />
                </div>
                <OsInput
                    label="Nama Mahasiswa"
                    type="text"
                    name="nama_stase"
                    placeholder="Masukkan Nama Mahasiswa..."
                    required
                />
                <OsInput
                    label="Jurusan Mahasiswa"
                    type="suggest"
                    name="nama_stase"
                    placeholder="Masukkan Jurusan Mahasiswa..."
                    required
                />
            </OsModal>
        </div>
    );
}
