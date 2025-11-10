import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Trash2, X } from "lucide-react";

import Sidebar from "../../Components/Sidebar.jsx";
import OsBreadCrumb from "../../components/breadcrumb.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsPagination from "../../components/pagination.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/copyright.jsx";
import Os_button from "../../components/button.jsx"; 

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

    const [search, setSearch] = useState(filters?.search || "");
    const [angkatan, setAngkatan] = useState(filters?.angkatan || "");
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [showExcelModal, setShowExcelModal] = useState(false);

    const angkatanList = [
        { value: "2025/2026", label: "2025/2026" },
        { value: "2024/2025", label: "2024/2025" },
        { value: "2023/2024", label: "2023/2024" },
        { value: "2022/2023", label: "2022/2023" },
        { value: "2021/2022", label: "2021/2022" },
    ];

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

        try {
            setImporting(true);
            const formData = new FormData();
            formData.append("file", importFile);

            await router.post("/admin/mahasiswa/import", formData, {
                forceFormData: true,
                onSuccess: () => {
                    alert("File Excel berhasil diunggah!");
                    setShowExcelModal(false);
                    setImportFile(null);
                },
                onError: () => {
                    alert("Terjadi kesalahan saat mengunggah file.");
                },
                onFinish: () => setImporting(false),
            });
        } catch (error) {
            console.error("Upload error:", error);
            alert("Gagal mengunggah file.");
            setImporting(false);
        }
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="flex flex-col flex-1 p-os-8 transition-all duration-300 md:ml-20">
                <OsBreadCrumb />

                <div className="flex-1 overflow-auto">
                    <section className="mb-8">
                        <h2 className="font-semibold text-lg my-2">
                            Menu Mahasiswa
                        </h2>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                            Halaman ini berisi daftar akun mahasiswa yang dapat
                            di-enroll ke dalam OSCE.
                        </p>

                        {/* Tombol Tambah & Import */}
                        <div className="flex items-center gap-3 mb-5">
                            <Os_button
                                onClick={() =>
                                    router.visit("/admin/mahasiswa/create")
                                }
                                className="flex items-center h-[46px] rounded-xl"
                            >
                                <OsIcon
                                    name="add"
                                    className="h-os-20 os-icon-light mr-os-8"
                                />
                                Tambah Mahasiswa Dengan Form
                            </Os_button>

                            <Os_button
                                onClick={() => setShowExcelModal(true)}
                                className="flex items-center h-[46px] rounded-xl"
                            >
                                <OsIcon
                                    name="Upload"
                                    className="h-os-20 os-icon-light mr-os-8"
                                />
                                Tambah Mahasiswa Dengan Excel
                            </Os_button>
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-3 mb-4">
                            {/* Input pencarian */}
                            <div className="relative flex-1">
                                <OsIcon
                                    name="Search"
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-os-20"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari data mahasiswa..."
                                    className="border border-black rounded-xl pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            {/* Dropdown Tahun Angkatan */}
                            <select
                                value={angkatan}
                                onChange={(e) => setAngkatan(e.target.value)}
                                className="border border-black rounded-xl px-24 py-3"
                            >
                                {angkatanList.map((a) => (
                                    <option key={a.value} value={a.value}>
                                        {a.label}
                                    </option>
                                ))}
                            </select>

                            {/* Tombol Cari */}
                            <Os_button
                                onClick={handleSearch}
                                className="border border-black rounded-xl px-28 py-3"
                            >
                                Cari
                            </Os_button>
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
                                                className="w-10 h-10 flex items-center justify-center bg-blue-700 p-2 border border-black rounded-xl text-white hover:bg-blue-600 transition"
                                            >
                                                <OsIcon
                                                    name="Edit"
                                                    className="h-os-20 w-os-20 os-icon-light"
                                                />
                                            </Link>

                                            <Os_button
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id_mahasiswa
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

                        {mahasiswa.links?.length > 0 && (
                            <div className="mt-8">
                                <OsPagination links={mahasiswa.links} />
                            </div>
                        )}
                    </section>
                </div>

                <footer className="mt-auto pt-6 border-t border-gray-200">
                    <OsCopyright />
                </footer>
            </main>

            {/* === MODAL IMPORT EXCEL === */}
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
                                sesuai kolom yang tersedia
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
                            <Os_button className="w-full">
                                Download Template Excel
                            </Os_button>

                            <div className="bg-red-50 border border-red-300 text-red-700 text-xs rounded-md p-3 leading-relaxed">
                                <strong>⚠️ Perhatian!</strong>
                                <br />
                                Jangan ubah heading karena menjadi patokan
                                program untuk membuat data mahasiswa.
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
                            <Os_button
                                onClick={handleImport}
                                disabled={importing}
                                className="w-full mr-2"
                            >
                                {importing ? "Mengunggah..." : "Submit"}
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
        </div>
    );
}
