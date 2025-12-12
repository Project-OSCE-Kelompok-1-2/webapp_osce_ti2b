import React, { useState, useRef, useMemo } from "react";
import { router, usePage, useForm } from "@inertiajs/react";
import { Edit2, Trash2 } from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx"; // Pastikan ini mengarah ke file pagination baru Anda
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
        key: "kelas",
        content: "Angkatan",
        width: "w-32 shrink-0",
        classes: "justify-center items-center px-4",
    }, // Saya tambah kolom angkatan agar terlihat filternya
    {
        key: "action",
        content: "Aksi",
        width: "w-56 shrink-0",
        classes: "justify-center items-center px-4",
    },
];

export default function MahasiswaPage() {
    // 1. Terima data sebagai Array penuh (Bukan Object Paginator)
    const { mahasiswa, flash, list_tahun } = usePage().props;

    // Pastikan data selalu array (jaga-jaga jika kosong/null)
    const allMahasiswaData = Array.isArray(mahasiswa)
        ? mahasiswa
        : mahasiswa?.data || [];

    // --- STATE UI CLIENT SIDE ---
    const [search, setSearch] = useState("");
    const [angkatanFilter, setAngkatanFilter] = useState("SEMUA");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Jumlah baris per halaman

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- FILTERING LOGIC (INSTAN) ---
    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, angkatanFilter]);

    // 2. useMemo hanya fokus memfilter data (Murni)
    const filteredData = useMemo(() => {
        return allMahasiswaData.filter((item) => {
            const term = search.toLowerCase();
            const matchSearch =
                item.nama?.toLowerCase().includes(term) ||
                item.nim?.toLowerCase().includes(term);

            const matchAngkatan =
                angkatanFilter === "SEMUA" || item.kelas === angkatanFilter;

            return matchSearch && matchAngkatan;
        });
    }, [search, angkatanFilter, allMahasiswaData]); // Dependensi: Berjalan tiap kali variabel ini berubah

    // --- PAGINATION LOGIC (POTONG ARRAY) ---
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- GENERATE PAGINATION LINKS ---
    // (Logic ini membuat array object yang dibutuhkan OsPagination)
    const generatedLinks = useMemo(() => {
        if (totalPages <= 1) return []; // Tidak butuh pagination jika cuma 1 page

        const links = [];
        // Previous Button
        links.push({
            url: currentPage > 1 ? "#" : null,
            label: "&laquo; Previous",
            active: false,
            pageNumber: currentPage - 1,
        });

        // Number Buttons
        for (let i = 1; i <= totalPages; i++) {
            // Logic Ellipsis: Tampilkan halaman pertama, terakhir, dan sekitar current page
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

        // Next Button
        links.push({
            url: currentPage < totalPages ? "#" : null,
            label: "Next &raquo;",
            active: false,
            pageNumber: currentPage + 1,
        });

        return links;
    }, [currentPage, totalPages]);

    // --- MODAL STATES ---
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showExcelModal, setShowExcelModal] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [mahasiswaToEdit, setMahasiswaToEdit] = useState(null);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const fileInputRef = useRef(null);

    // --- FORM HANDLING ---
    const { data, setData, post, put, reset, errors, clearErrors } = useForm({
        nim: "",
        nama: "",
        kelas: "",
        prodi: "",
    });

    const angkatanListOptions = [
        { value: "SEMUA", label: "Semua Angkatan" },
        ...(list_tahun || []).map((tahun) => ({ value: tahun, label: tahun })),
    ];

    // --- HANDLERS (Sama seperti sebelumnya, tapi tanpa router.get search) ---
    const openAddModal = () => {
        reset();
        clearErrors();
        setShowModal(true);
    };
    const handleClear = () => {
        setData({ nim: "", nama: "", kelas: "", prodi: "" });
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
        setData({
            nim: item.nim,
            nama: item.nama,
            kelas: item.kelas || "",
            prodi: item.prodi || "",
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
        /* Code Import sama seperti sebelumnya */
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

    // --- DATA TABEL DISPLAY (Dari Paginated Data) ---
    const tableDisplayData = paginatedData.map((item, index) => ({
        no: (currentPage - 1) * itemsPerPage + index + 1, // Hitung nomor urut berdasarkan page
        nim: item.nim,
        nama: item.nama,
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
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="grid w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                <OsHeader
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        Menu Mahasiswa
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                        Kelola data mahasiswa.
                    </p>

                    {/* Tombol Add & Import (Sama) */}
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
                            Tambah Manual
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
                            Import Excel
                        </OsButton>
                    </div>

                    {/* Notifikasi Error/Success (Sama) */}
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

                    {/* --- 5. SEARCH BAR & FILTER (INSTANT) --- */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch} // Mengubah state langsung -> mentrigger useMemo -> render ulang tabel instan
                        placeholder="Cari nama atau NIM..."
                    >
                        <OsInput
                            type="select"
                            value={angkatanFilter}
                            onChange={(e) => {
                                let val = e?.target?.value ?? e;
                                if (typeof val === "object" && val?.value)
                                    val = val.value;
                                setAngkatanFilter(!val ? "SEMUA" : val);
                            }}
                            options={angkatanListOptions}
                        />
                    </OsSearchBar>

                    {/* Tabel */}
                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            Tabel Mahasiswa
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Total: {totalItems} data)
                            </span>
                        </h2>

                        <div className="w-full overflow-x-auto pb-4">
                            <div className="min-w-max">
                                <OsTableHeader columns={mahasiswaColumns} />
                                {filteredData.length > 0 ? (
                                    <OsTableBody
                                        data={tableDisplayData} // Gunakan data yang sudah dipotong (page ini saja)
                                        columns={mahasiswaColumns}
                                    />
                                ) : (
                                    <div className="flex items-center border-t border-gray-400">
                                        <p className="w-full text-center text-sm py-4 text-gray-500">
                                            Data mahasiswa tidak ditemukan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- PAGINATION CLIENT SIDE --- */}
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
                <OsCopyright />
            </main>

            {/* ... Modal Tambah, Edit, Delete, Import (Kode Sama persis seperti sebelumnya) ... */}
            {/* Sertakan modal-modal di sini agar kode tetap lengkap, namun tidak saya tulis ulang agar ringkas */}
            <OsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Tambah Mahasiswa"
                variant="add"
                onSubmit={submitAdd}
                onClear={handleClear}
            >
                <div className="flex gap-4">
                    <OsInput
                        label="NIM"
                        name="nim"
                        value={data.nim}
                        onChange={(e) => setData("nim", e.target.value)}
                        required
                        className="w-full"
                    />
                    <OsInput
                        label="Angkatan"
                        type="select"
                        name="kelas"
                        value={data.kelas}
                        onChange={(e) => setData("kelas", e.target.value)}
                        options={angkatanListOptions}
                        required
                        className="w-full"
                    />
                </div>
                <OsInput
                    label="Nama"
                    name="nama"
                    value={data.nama}
                    onChange={(e) => setData("nama", e.target.value)}
                    required
                />
                <OsInput
                    label="Jurusan"
                    name="prodi"
                    value={data.prodi}
                    onChange={(e) => setData("prodi", e.target.value)}
                    required
                />
            </OsModal>

            <OsModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Mahasiswa"
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
                <div className="flex gap-4">
                    <OsInput
                        label="NIM"
                        name="nim"
                        value={data.nim}
                        onChange={(e) => setData("nim", e.target.value)}
                        required
                        className="w-full"
                    />
                    <OsInput
                        label="Angkatan"
                        type="select"
                        name="kelas"
                        value={data.kelas}
                        onChange={(e) => setData("kelas", e.target.value)}
                        options={angkatanListOptions.filter(
                            (o) => o.value !== "SEMUA"
                        )}
                        required
                        className="w-full"
                    />
                </div>
                <OsInput
                    label="Nama"
                    name="nama"
                    value={data.nama}
                    onChange={(e) => setData("nama", e.target.value)}
                    required
                />
                <OsInput
                    label="Jurusan"
                    name="prodi"
                    value={data.prodi}
                    onChange={(e) => setData("prodi", e.target.value)}
                    required
                />
            </OsModal>

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
                title="Import Excel"
                onSubmit={handleImport}
                onClear={handleClearImport}
            >
                <OsButton
                    name="primary"
                    className="w-full mb-3"
                    onClick={() =>
                        window.open("/admin/mahasiswa/template", "_blank")
                    }
                >
                    Download Template
                </OsButton>
                <div className="bg-red-50 border border-red-300 text-red-700 text-xs rounded-md p-3 mb-3">
                    ⚠️ Jangan ubah header template.
                </div>
                <div className="flex flex-col items-center gap-2 mb-4">
                    <label
                        htmlFor="import-file"
                        className="border border-blue-600 text-blue-600 py-2 px-4 rounded-md cursor-pointer w-full text-center"
                    >
                        {importFile ? importFile.name : "Upload Excel"}
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
            </OsModal>
        </div>
    );
}
