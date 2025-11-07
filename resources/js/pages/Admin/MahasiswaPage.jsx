import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Trash2, Edit2, UploadCloud, X } from "lucide-react";

// Komponen UI
import Sidebar from "../../Components/Sidebar.jsx";
import OsBreadCrumb from "../../components/breadcrumb.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/copyright.jsx";

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
    const { mahasiswa: backendMahasiswa, filters } = usePage().props;

    // Mock data (fallback)
    const mockMahasiswa = {
        data: [
            { id_mahasiswa: 1, nim: "TI23001", nama: "Ivan Hakim" },
            { id_mahasiswa: 2, nim: "TI23002", nama: "Rafi Pratama" },
            { id_mahasiswa: 3, nim: "TI23003", nama: "Nadia Putri" },
            { id_mahasiswa: 4, nim: "TI23004", nama: "Ilham Nur" },
        ],
        from: 1,
        links: [],
    };

    const mahasiswa =
        backendMahasiswa && backendMahasiswa.data
            ? backendMahasiswa
            : mockMahasiswa;

    // State
    const [search, setSearch] = useState(filters?.search || "");
    const [angkatan, setAngkatan] = useState(filters?.angkatan || "");
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [showExcelModal, setShowExcelModal] = useState(false);

    const angkatanList = [
        { value: "2025", label: "2025" },
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
        { value: "2022", label: "2022" },
        { value: "2021", label: "2021" },
    ];

    // === Handlers ===
    const handleSearch = () => {
        router.get(
            "/admin/mahasiswa",
            { search, angkatan },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) {
            router.delete(`/admin/mahasiswa/${id}`, { preserveScroll: true });
        }
    };

    const handleImport = async (e) => {
        e.preventDefault();
        if (!importFile) {
            alert("Pilih file Excel terlebih dahulu.");
            return;
        }
        alert("Mock: file berhasil diunggah");
        setShowExcelModal(false);
        setImportFile(null);
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex font-sans overflow-hidden">
            <Sidebar />

            <main className="flex flex-col flex-1 p-os-8 transition-all duration-300 md:ml-20">
                {/* Breadcrumb */}
                <OsBreadCrumb />

                {/* Konten Utama */}
                <div className="flex-1 overflow-auto">
                    <section className="mb-8">
                        <h2 className="font-semibold text-lg mb-1">
                            Menu Mahasiswa
                        </h2>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                            Halaman ini berisi daftar akun mahasiswa yang dapat
                            di-enroll ke dalam OSCE.
                        </p>

                        {/* Tombol Tambah & Import */}
                        <div className="flex items-center gap-3 mb-5">
                            <button
                                onClick={() =>
                                    router.visit("/admin/mahasiswa/create")
                                }
                                className="flex items-center h-[46px] bg-blue-700 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                <OsIcon
                                    name="add"
                                    className="h-os-20 os-icon-light mr-os-8"
                                />
                                Tambah Mahasiswa Dengan Form
                            </button>

                            <button
                                onClick={() => setShowExcelModal(true)}
                                className="flex items-center h-[46px] bg-blue-700 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                <OsIcon
                                    name="Upload"
                                    className="h-os-20 os-icon-light mr-os-8"
                                />
                                Tambah Mahasiswa Dengan Excel
                            </button>
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-3 mb-4">
                            {/* Input pencarian */}
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="cari data mahasiswa..."
                                className="border border-gray-400 rounded-md px-4 py-3 flex-1"
                            />

                            {/* Dropdown Tahun Angkatan */}
                            <select
                                value={angkatan}
                                onChange={(e) => setAngkatan(e.target.value)}
                                className="border border-gray-400 rounded-md px-4 py-3"
                            >
                                {angkatanList.map((a) => (
                                    <option key={a.value} value={a.value}>
                                        {a.label}
                                    </option>
                                ))}
                            </select>

                            {/* Tombol Cari */}
                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                            >
                                Cari
                            </button>
                        </div>
                    </section>

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
                                                className="bg-blue-600 p-2 rounded-md text-white hover:bg-blue-700"
                                            >
                                                <Edit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id_mahasiswa
                                                    )
                                                }
                                                className="bg-white border border-gray-400 p-2 rounded-md hover:bg-gray-100"
                                            >
                                                <Trash2
                                                    size={18}
                                                    className="text-gray-700"
                                                />
                                            </button>
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

                        {mahasiswa.links?.length > 0 && (
                            <div className="mt-8">
                                <OsPagination links={mahasiswa.links} />
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer */}
                <footer className="mt-auto pt-6 border-t border-gray-200">
                    <OsCopyright />
                </footer>
            </main>

            {/* === MODAL TAMBAH MAHASISWA DENGAN EXCEL === */}
            {showExcelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-[420px] shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gray-900 text-white text-center py-3 relative">
                            <h2 className="text-base font-semibold">
                                Template Excel Mahasiswa
                            </h2>
                            <p className="text-xs text-gray-300">
                                Download file excel dan isi data mahasiswa
                                sesuai dengan kolom yang tersedia
                            </p>
                            <button
                                onClick={() => setShowExcelModal(false)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 flex flex-col gap-4">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md text-sm font-medium transition-colors">
                                Download Template Excel
                            </button>

                            <div className="bg-red-50 border border-red-300 text-red-700 text-xs rounded-md p-3 leading-relaxed">
                                <strong>⚠️ Perhatian!</strong>
                                <br />
                                Jangan ubah heading karena menjadi patokan
                                program untuk membuat data mahasiswa. Jangan
                                menempatkan foto/video di dalam cell.
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <label
                                    htmlFor="mahasiswa-import-file"
                                    className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-md cursor-pointer text-sm font-medium w-full text-center transition-colors"
                                >
                                    Upload file excel
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

                        {/* Footer Modal */}
                        <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-t">
                            <button
                                onClick={handleImport}
                                disabled={importing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium w-full mr-2 transition-colors"
                            >
                                {importing ? "Mengunggah..." : "Submit"}
                            </button>

                            <button
                                onClick={() => setShowExcelModal(false)}
                                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
