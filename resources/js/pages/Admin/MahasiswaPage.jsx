import React, { useState } from "react";
import { router, usePage, useForm } from "@inertiajs/react"; // 1. Tambah useForm

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
import Modals from "../../components/Modals.jsx";

// 2. Sesuaikan key dengan data dari Controller
const mahasiswaColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
    },
    {
        key: "nim",
        content: "NIM Mahasiswa",
        width: "w-56",
        classes: "justify-start items-center px-4",
    },
    {
        key: "nama",
        content: "Nama Mahasiswa",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key: "action",
        content: "Aksi",
        width: "w-56",
        classes: "justify-center items-center px-4",
    },
];

export default function MahasiswaPage() {
    const { mahasiswa, filters, flash, list_tahun } = usePage().props;

    // --- STATE UI & FILTER ---
    const [search, setSearch] = useState(filters?.search || "");
    const [angkatanFilter, setAngkatanFilter] = useState(
        filters?.angkatan || ""
    );

    // --- STATE MODAL ---
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showExcelModal, setShowExcelModal] = useState(false);

    // --- STATE PENDUKUNG ---
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [mahasiswaToEdit, setMahasiswaToEdit] = useState(null); // Untuk Judul Modal Edit
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null); // Untuk Hapus

    // 3. GUNAKAN USEFORM (Pengganti state manual & defaultValue)
    // Nama field disesuaikan dengan Controller: nim, nama, kelas, prodi
    const { data, setData, post, put, reset, errors, clearErrors } = useForm({
        nim: "",
        nama: "",
        kelas: "",
        prodi: "",
    });

    // UBAH LIST JADI DINAMIS DARI DATABASE
    // Jika list_tahun ada isinya, kita pakai. Jika tidak, pakai array kosong.
    const angkatanList = [
        { value: "SEMUA", label: "Semua Angkatan" },
        // Mapping data ['2025/2026', '2024/2025'] menjadi format dropdown
        ...(list_tahun || []).map((tahun) => ({
            value: tahun,
            label: tahun,
        })),
    ];

    // --- LOGIKA FILTER & SEARCH ---
    const handleSearch = () => {
        router.get(
            "/admin/mahasiswa",
            { search, angkatan: angkatanFilter || undefined },
            { preserveState: true, replace: true }
        );
    };

    // --- HANDLE ADD ---
    const openAddModal = () => {
        reset(); // Kosongkan form
        clearErrors();
        setShowModal(true);
    };

    const submitAdd = (e) => {
        e.preventDefault();
        post("/admin/mahasiswa", {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    // --- HANDLE EDIT ---
    const openEditModal = (item) => {
        setMahasiswaToEdit(item); // Simpan item asli untuk judul modal
        clearErrors();

        // 4. Isi Form dengan Data (Mapping field Controller -> Form)
        setData({
            nim: item.nim,
            nama: item.nama,
            // Jika data lama tidak cocok dengan list baru, tetap tampilkan apa adanya
            kelas: item.kelas || (list_tahun && list_tahun[0]) || "", // Handle jika controller kirim 'kelas'
            prodi: item.prodi || "", // Handle jika controller kirim 'prodi'
        });

        setShowEditModal(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        // Pastikan ID dikirim di URL
        put(`/admin/mahasiswa/${mahasiswaToEdit.id_mahasiswa}`, {
            onSuccess: () => {
                setShowEditModal(false);
                reset();
            },
        });
    };

    // --- HANDLE DELETE ---
    const openDeleteModal = (id, nama) => {
        setSelectedMahasiswa({ id, nama });
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(`/admin/mahasiswa/${selectedMahasiswa.id}`, {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    // --- HANDLE IMPORT ---
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

    // --- DATA TABEL ---
    const tableData = mahasiswa.data.map((item, index) => ({
        no: mahasiswa.from + index,
        nim: item.nim,
        nama: item.nama,
        action: (
            <div className="flex items-center justify-center space-x-3">
                <OsButton name="edit" onClick={() => openEditModal(item)}>
                    <OsIcon name="Edit" className="h-os-20 os-icon-light" />
                </OsButton>
                <OsButton
                    name="warning"
                    onClick={() =>
                        openDeleteModal(item.id_mahasiswa, item.nama)
                    }
                >
                    <OsIcon name="Trash" className="h-os-20 os-icon-light" />
                </OsButton>
            </div>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                <OsHeader />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        Menu Mahasiswa
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                        Menu Mahasiswa berisi berbagai fitur yang digunakan
                        untuk mengelola data.
                    </p>

                    <div className="flex items-center gap-3">
                        <OsButton
                            name="primary"
                            onClick={openAddModal}
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

                    {/* Notifikasi */}
                    {flash.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
                            <ul className="list-disc pl-4 text-sm">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 5. PERBAIKAN FILTER LOGIC */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari nama mahasiswa..."
                    >
                        <OsInput
                            type="select"
                            value={angkatanFilter}
                            onChange={(e) => {
                                // A. Ambil nilai (handle jika object)
                                let val = e?.target?.value ?? e;
                                // Jaga-jaga jika library UI mengembalikan object {value: "...", label: "..."}
                                if (
                                    typeof val === "object" &&
                                    val !== null &&
                                    val?.value !== undefined
                                ) {
                                    val = val.value;
                                }

                                // B. Update State UI
                                setAngkatanFilter(val);

                                // 4. Update URL
                                // Kirim "SEMUA" jika user memilih opsi pertama.
                                const valueToSend =
                                    !val || val === "" ? "SEMUA" : val;

                                router.get(
                                    "/admin/mahasiswa",
                                    {
                                        search,
                                        angkatan: valueToSend,
                                    },
                                    { preserveState: true, replace: true }
                                );
                            }}
                            options={angkatanList}
                        />
                    </OsSearchBar>

                    {/* Tabel */}
                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            Tabel Mahasiswa
                        </h2>
                        <OsTableHeader columns={mahasiswaColumns} />
                        {mahasiswa.data.length > 0 ? (
                            <OsTableBody
                                data={tableData}
                                columns={mahasiswaColumns}
                            />
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

            {/* ===== MODAL TAMBAH (ADD) ===== */}
            <OsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Tambah Mahasiwa Baru"
                subtitle="Isi form di bawah untuk menambahkan mahasiswa baru."
                variant="add"
                onSubmit={submitAdd}
            >
                {/* Gunakan Controlled Component (value & onChange) */}
                <div className="flex gap-4">
                    <OsInput
                        label="NIM Mahasiswa"
                        type="text"
                        name="nim" // Harus 'nim'
                        value={data.nim}
                        onChange={(e) => setData("nim", e.target.value)}
                        placeholder="Masukkan NIM..."
                        required
                    />
                    <OsInput
                        label="Angkatan Mahasiswa"
                        type="select"
                        name="kelas" // Harus 'kelas'
                        value={data.kelas}
                        onChange={(e) => setData("kelas", e.target.value)}
                        options={angkatanList}
                        required
                    />
                </div>
                <OsInput
                    label="Nama Mahasiswa"
                    type="text"
                    name="nama" // Harus 'nama'
                    value={data.nama}
                    onChange={(e) => setData("nama", e.target.value)}
                    placeholder="Masukkan Nama..."
                    required
                />
                <OsInput
                    label="Jurusan Mahasiswa"
                    type="text" // Suggest sementara diganti text dulu biar aman
                    name="prodi" // Harus 'prodi'
                    value={data.prodi}
                    onChange={(e) => setData("prodi", e.target.value)}
                    placeholder="Masukkan Jurusan..."
                    required
                />
            </OsModal>

            {/* ===== MODAL EDIT ===== */}
            <OsModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Mahasiswa"
                subtitle={
                    mahasiswaToEdit
                        ? mahasiswaToEdit.nama
                        : "Data tidak ditemukan"
                }
                variant="edit"
                onSubmit={submitEdit}
                onDelete={() => {
                    setShowEditModal(false);
                    openDeleteModal(
                        mahasiswaToEdit.id_mahasiswa,
                        mahasiswaToEdit.nama
                    );
                }}
            >
                {/* Form Edit menggunakan state yang sama (data) yang sudah di-set saat openEditModal */}
                <div className="flex gap-4">
                    <OsInput
                        label="NIM Mahasiswa"
                        type="text"
                        name="nim"
                        value={data.nim}
                        onChange={(e) => setData("nim", e.target.value)}
                        placeholder="Masukkan NIM..."
                        required
                    />
                    <OsInput
                        label="Angkatan Mahasiswa"
                        type="select"
                        name="kelas"
                        value={data.kelas}
                        onChange={(e) => setData("kelas", e.target.value)}
                        options={angkatanList.filter(
                            (o) => o.value !== "SEMUA"
                        )}
                        required
                    />
                </div>
                <OsInput
                    label="Nama Mahasiswa"
                    type="text"
                    name="nama"
                    value={data.nama}
                    onChange={(e) => setData("nama", e.target.value)}
                    placeholder="Masukkan Nama..."
                    required
                />
                <OsInput
                    label="Jurusan Mahasiswa"
                    type="text"
                    name="prodi"
                    value={data.prodi}
                    onChange={(e) => setData("prodi", e.target.value)}
                    placeholder="Masukkan Jurusan..."
                    required
                />
            </OsModal>

            {/* ===== MODAL DELETE ===== */}
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
                    onConfirm={confirmDelete}
                />
            )}

            {/* ===== MODAL IMPORT EXCEL ===== */}
            <OsModal
                show={showExcelModal}
                onClose={() => setShowExcelModal(false)}
                title="Template Excel Mahasiswa"
                subtitle="Download file excel dan isi data mahasiswa"
            >
                <OsButton
                    name="primary"
                    className="w-full mb-3"
                    onClick={() => router.get("/admin/mahasiswa/template")}
                >
                    Download Template Excel
                </OsButton>
                <div className="bg-red-50 border border-red-300 text-red-700 text-xs rounded-md p-3 leading-relaxed mb-3">
                    <strong>⚠️ Perhatian!</strong>
                    <br />
                    Jangan ubah heading pada file template agar proses import
                    tidak gagal.
                </div>
                <div className="flex flex-col items-center gap-2 mb-4">
                    <label
                        htmlFor="mahasiswa-import-file"
                        className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-md cursor-pointer text-sm font-medium w-full text-center transition-colors"
                    >
                        {importFile ? importFile.name : "Upload file Excel"}
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
                </div>
                <OsButton
                    name="primary"
                    className="w-full"
                    disabled={importing}
                    onClick={handleImport}
                >
                    {importing ? "Mengunggah..." : "Import Data Mahasiswa"}
                </OsButton>
            </OsModal>
        </div>
    );
}
