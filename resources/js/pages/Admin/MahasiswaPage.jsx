import React, { useState, useRef, useMemo } from "react";
import { router, usePage, useForm } from "@inertiajs/react";
import { Edit2, Trash2, AlertTriangle, X, Users, Table2 } from "lucide-react";

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

const mahasiswaColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16 shrink-0",
        classes: "justify-center items-center",
    },
    {
        key: "nim",
        content: "NIM Mahasiswa",
        width: "w-56 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "nama",
        content: "Nama Mahasiswa",
        width: "min-w-[350px] !flex-1 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "angkatan",
        content: "Angkatan",
        width: "w-32 shrink-0",
        classes: "justify-center items-center px-4",
    },
    {
        key: "kelas",
        content: "Kelas",
        width: "w-32 shrink-0",
        classes: "justify-center items-center px-4",
    },
    {
        key: "action",
        content: "Aksi",
        width: "w-56 shrink-0",
        classes: "justify-center items-center px-4",
    },
];

export default function MahasiswaPage() {
    const { mahasiswa, flash, list_tahun } = usePage().props;
    const allMahasiswaData = Array.isArray(mahasiswa)
        ? mahasiswa
        : mahasiswa?.data || [];

    // --- STATE UI ---
    const [search, setSearch] = useState("");
    const [angkatanFilter, setAngkatanFilter] = useState("SEMUA"); // State untuk filter
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isManualKelas, setIsManualKelas] = useState(false);

    // --- FILTERING CLIENT SIDE ---
    // Reset halaman ke 1 jika filter berubah
    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, angkatanFilter]);

    const filteredData = useMemo(() => {
        return allMahasiswaData.filter((item) => {
            const term = search.toLowerCase();

            // 1. Filter Search (Nama atau NIM)
            const matchSearch =
                item.nama?.toLowerCase().includes(term) ||
                item.nim?.toLowerCase().includes(term);

            // 2. Filter Angkatan (Client Side)
            // Cek apakah filter "SEMUA" atau item.angkatan cocok dengan filter yang dipilih
            const matchAngkatan =
                angkatanFilter === "SEMUA" || item.angkatan === angkatanFilter;

            return matchSearch && matchAngkatan;
        });
    }, [search, angkatanFilter, allMahasiswaData]);

    // --- PAGINATION (Berdasarkan data yang sudah difilter) ---
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Generate Pagination Links
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

    // --- MODAL STATES & FORM ---
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showExcelModal, setShowExcelModal] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [mahasiswaToEdit, setMahasiswaToEdit] = useState(null);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, put, reset, errors, clearErrors } = useForm({
        nim: "",
        nama: "",
        kelas: "",
        angkatan: "",
        prodi: "",
    });

    // List Tahun untuk Form Input & Filter
    const angkatanListOptions = [
        ...(list_tahun || []).map((tahun) => ({ value: tahun, label: tahun })),
    ];

    const kelasOptions = [
        { value: "A", label: "Kelas A" },
        { value: "B", label: "Kelas B" },
        { value: "C", label: "Kelas C" },
        { value: "D", label: "Kelas D" },
        { value: "E", label: "Kelas E" },
        { value: "F", label: "Kelas F" },
        { value: "MANUAL", label: "Lainnya (Input Manual)" },
    ];

    // --- HANDLERS ---
    const openAddModal = () => {
        reset();
        clearErrors();
        setIsManualKelas(false);
        setShowModal(true);
    };
    const handleClear = () => {
        setData({ nim: "", nama: "", kelas: "", angkatan: "", prodi: "" });
        clearErrors();
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

    const openEditModal = (item) => {
        setMahasiswaToEdit(item);
        clearErrors();
        const standardClasses = ["A", "B", "C", "D", "E", "F"];
        const isStandard = standardClasses.includes(item.kelas);
        setIsManualKelas(!isStandard);
        setData({
            nim: item.nim,
            nama: item.nama,
            kelas: item.kelas || "",
            prodi: item.prodi || "",
            angkatan: item.angkatan || "",
        });
        setShowEditModal(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        put(`/admin/mahasiswa/${mahasiswaToEdit.id_mahasiswa}`, {
            onSuccess: () => {
                setShowEditModal(false);
                reset();
            },
        });
    };
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

    const handleImport = (e) => {
        e.preventDefault();
        if (!importFile) return alert("Pilih file.");
        router.post(
            "/admin/mahasiswa/import",
            { file: importFile },
            {
                forceFormData: true,
                onSuccess: () => {
                    setShowExcelModal(false);
                    setImportFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                },
            }
        );
    };
    const handleClearImport = () => {
        setImportFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleKelasChange = (e) => {
        const val = e.target.value;
        if (val === "MANUAL") {
            setIsManualKelas(true);
            setData("kelas", "");
        } else {
            setIsManualKelas(false);
            setData("kelas", val);
        }
    };

    // --- TABLE DATA ---
    const tableDisplayData = paginatedData.map((item, index) => ({
        no: (currentPage - 1) * itemsPerPage + index + 1,
        nim: item.nim,
        nama: item.nama,
        angkatan: item.angkatan,
        kelas: item.kelas,
        action: (
            <div className="flex items-center justify-center space-x-3">
                <OsButton name="edit" onClick={() => openEditModal(item)}>
                    <Edit2 size={18} />
                </OsButton>
                <OsButton
                    name="warning"
                    onClick={() =>
                        openDeleteModal(item.id_mahasiswa, item.nama)
                    }
                >
                    <Trash2 size={18} />
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
                    <div className="flex-1 overflow-auto">
                        <div className="flex gap-1 items-center justify-start my-2">
                            <Users size={18} />
                            <h2 className="font-semibold text-lg">
                                Menu Mahasiswa
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                            Kelola data mahasiswa.
                        </p>

                        <div className="flex items-center gap-3 mb-5">
                            <OsButton
                                name="primary"
                                onClick={openAddModal}
                                className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                <OsIcon
                                    name="add"
                                    className="h-os-20 os-icon-light mr-os-8"
                                />{" "}
                                Tambah Mahasiswa via Form
                            </OsButton>
                            <OsButton
                                name="primary"
                                onClick={() => setShowExcelModal(true)}
                                className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                <OsIcon
                                    name="Download (2)"
                                    className="h-os-20 os-icon-light mr-os-8"
                                />{" "}
                                Tambah Mahasiswa via Excel
                            </OsButton>
                        </div>

                        {flash.success && (
                            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
                                {flash.success}
                            </div>
                        )}
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
                                <ul className="list-disc pl-4 text-sm">
                                    {Object.values(errors).map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* --- SEARCH BAR & FILTER ANGKATAN --- */}
                        {/* Menggunakan Flexbox agar sejajar */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-grow">
                                <OsSearchBar
                                    search={search}
                                    setSearch={setSearch}
                                    placeholder="Cari nama atau NIM..."
                                    
                                />
                            </div>

                            {/* DROPDOWN FILTER ANGKATAN (Client Side) */}
                            <div className="w-full sm:w-48 shrink-0">
                                <OsInput
                                    type="select"
                                    value={angkatanFilter}
                                    onChange={(e) => {
                                        // Handle event change dari select native atau custom component
                                        const val = e.target
                                            ? e.target.value
                                            : e;
                                        setAngkatanFilter(val);
                                    }}
                                    options={[
                                        {
                                            value: "SEMUA",
                                            label: "Semua Angkatan",
                                        },
                                        ...angkatanListOptions,
                                    ]}
                                    className="h-[46px]" // Sesuaikan tinggi dengan searchbar jika perlu
                                />
                            </div>
                        </div>

                        <section>
                            <div className="flex gap-1 items-center justify-start mb-2">
                                <Table2 size={18} />
                                <h2 className="font-semibold text-lg">
                                    Tabel Mahasiswa{" "}
                                </h2>
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    (Total: {totalItems} data)
                                </span>
                            </div>
                            <section className="bg-white p-5 border border-os-primary overflow-x-auto rounded-xl shadow-sm">
                                <div className="min-w-max">
                                    <OsTableHeader columns={mahasiswaColumns} />
                                    <OsTableBody
                                        data={tableDisplayData}
                                        columns={mahasiswaColumns}
                                    />
                                </div>
                            </section>
                            {totalPages > 1 && (
                                <div className="mt-2">
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

            {/* --- MODAL TAMBAH --- */}
            <OsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Tambah Mahasiswa Baru"
                subtitle="Isi form di bawah untuk menambahkan mahasiswa baru."
                variant="add"
                onSubmit={submitAdd}
                onClear={handleClear}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 w-full">
                        <div className="w-1/2">
                            <OsInput
                                label="NIM Mahasiswa"
                                name="nim"
                                value={data.nim}
                                onChange={(e) => setData("nim", e.target.value)}
                                placeholder="Masukkan NIM..."
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="w-1/2">
                            <OsInput
                                label="Tahun Angkatan"
                                type="select"
                                name="angkatan"
                                value={data.angkatan}
                                onChange={(e) =>
                                    setData("angkatan", e.target.value)
                                }
                                options={[
                                    { value: "", label: "Pilih Tahun..." },
                                    ...angkatanListOptions,
                                ]}
                                required
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 w-full items-end">
                        <div className="w-1/2 relative">
                            {!isManualKelas ? (
                                <OsInput
                                    label="Kelas"
                                    type="select"
                                    name="kelas"
                                    value={data.kelas}
                                    onChange={handleKelasChange}
                                    options={[
                                        { value: "", label: "Pilih Kelas..." },
                                        ...kelasOptions,
                                    ]}
                                    required
                                    className="w-full"
                                />
                            ) : (
                                <div className="flex w-full gap-2 items-end">
                                    <div className="flex-1">
                                        <OsInput
                                            label="Kelas Manual"
                                            name="kelas"
                                            value={data.kelas}
                                            onChange={(e) =>
                                                setData("kelas", e.target.value)
                                            }
                                            placeholder="Ketik nama kelas..."
                                            required
                                            className="w-full"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsManualKelas(false);
                                            setData("kelas", "");
                                        }}
                                        className="mb-[10px] p-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-600 transition"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="w-1/2">
                            <OsInput
                                label="Jurusan Mahasiswa"
                                name="prodi"
                                value={data.prodi}
                                onChange={(e) =>
                                    setData("prodi", e.target.value)
                                }
                                placeholder="Masukkan Jurusan..."
                                required
                                className="w-full"
                            />
                        </div>
                    </div>
                    <OsInput
                        label="Nama Mahasiswa"
                        name="nama"
                        value={data.nama}
                        onChange={(e) => setData("nama", e.target.value)}
                        placeholder="Masukkan Nama..."
                        required
                        className="w-full"
                    />
                </div>
            </OsModal>

            {/* --- MODAL EDIT --- */}
            <OsModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Mahasiswa"
                subtitle="Perbarui data mahasiswa yang dipilih."
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
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 w-full">
                        <div className="w-1/2">
                            <OsInput
                                label="NIM"
                                name="nim"
                                value={data.nim}
                                onChange={(e) => setData("nim", e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="w-1/2">
                            <OsInput
                                label="Tahun Angkatan"
                                type="select"
                                name="angkatan"
                                value={data.angkatan}
                                onChange={(e) =>
                                    setData("angkatan", e.target.value)
                                }
                                options={[
                                    { value: "", label: "Pilih Tahun..." },
                                    ...angkatanListOptions,
                                ]}
                                required
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 w-full items-end">
                        <div className="w-1/2 relative">
                            {!isManualKelas ? (
                                <OsInput
                                    label="Kelas"
                                    type="select"
                                    name="kelas"
                                    value={data.kelas}
                                    onChange={handleKelasChange}
                                    options={[
                                        { value: "", label: "Pilih Kelas..." },
                                        ...kelasOptions,
                                    ]}
                                    required
                                    className="w-full"
                                />
                            ) : (
                                <div className="flex w-full gap-2 items-end">
                                    <div className="flex-1">
                                        <OsInput
                                            label="Kelas Manual"
                                            name="kelas"
                                            value={data.kelas}
                                            onChange={(e) =>
                                                setData("kelas", e.target.value)
                                            }
                                            required
                                            className="w-full"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsManualKelas(false);
                                            setData("kelas", "");
                                        }}
                                        className="mb-[10px] p-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-600 transition"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="w-1/2">
                            <OsInput
                                label="Jurusan"
                                name="prodi"
                                value={data.prodi}
                                onChange={(e) =>
                                    setData("prodi", e.target.value)
                                }
                                required
                                className="w-full"
                            />
                        </div>
                    </div>
                    <OsInput
                        label="Nama"
                        name="nama"
                        value={data.nama}
                        onChange={(e) => setData("nama", e.target.value)}
                        required
                        className="w-full"
                    />
                </div>
            </OsModal>

            {/* --- MODAL DELETE & IMPORT EXCEL (Tidak Berubah) --- */}
            {showDeleteModal && (
                <Modals
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    variant="delete"
                    dataToDelete={[
                        { key: "Nama", value: selectedMahasiswa?.nama },
                    ]}
                    onConfirm={confirmDelete}
                />
            )}
            <OsModal
                show={showExcelModal}
                onClose={() => setShowExcelModal(false)}
                title="Template Excel Mahasiswa"
                subtitle="Download file excel dan isi data mahasiswa"
                variant="add"
                onSubmit={handleImport}
                onClear={handleClearImport}
            >
                <div className="w-full">
                    <button
                        type="button"
                        onClick={() =>
                            window.open("/admin/mahasiswa/template", "_blank")
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg mb-4 transition-colors"
                    >
                        Download Template Excel
                    </button>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3 items-start">
                        <div className="mt-0.5">
                            <AlertTriangle
                                className="text-yellow-500 fill-yellow-500 stroke-black"
                                strokeWidth={1.5}
                                size={20}
                            />
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-red-700 mb-1">
                                Perhatian!
                            </p>
                            <p className="text-red-600 leading-relaxed">
                                Jangan ubah heading pada file template agar
                                proses import tidak gagal.
                            </p>
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="import-file"
                            className="w-full border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 font-medium py-3 rounded-lg cursor-pointer text-center block transition-colors"
                        >
                            {importFile ? importFile.name : "Upload file Excel"}
                        </label>
                        <input
                            id="import-file"
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={(e) => setImportFile(e.target.files?.[0])}
                            className="hidden"
                        />
                    </div>
                </div>
            </OsModal>
        </div>
    );
}
