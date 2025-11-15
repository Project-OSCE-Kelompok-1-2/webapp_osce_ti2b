import { Link, usePage, router } from "@inertiajs/react";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";

// --- Import Komponen ---
// Catatan: Saya mengasumsikan OsPagination.jsx sudah diperbarui
// dengan logic arrow hover hitam seperti permintaan terakhir Anda.
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsIcon from "../../components/icons";
import OsTableHeader from "../../components/tableheader";
import OsSearchBar from "../../components/searchbar";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsButton from "../../components/button.jsx";
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/input.jsx";

// --- Definisi Kolom Tabel ---
const staseColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
    },
    {
        key: "nama_stase",
        content: "Nama Stase",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key: "jumlah_aspek",
        content: "Jumlah Aspek",
        width: "w-56",
        classes: "justify-center items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-80",
        classes: "justify-center items-center px-4",
    },
];

export default function Stase() {
    // 1. Ambil data 'stase' dan 'filters' dari props yang dikirim Controller
    const { stase, filters } = usePage().props;

    const [showModal, setShowModal] = useState(false);

    // 2. Siapkan state untuk input pencarian
    const [search, setSearch] = useState(filters.search || "");

    // 3. Fungsi untuk menjalankan pencarian
    const handleSearch = () => {
        router.get(
            "/admin/stase",
            { search },
            { preserveState: true, replace: true }
        );
    };

    // 4. Fungsi untuk menghapus data
    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus stase ini?")) {
            router.delete(`/admin/stase/${id}`, {
                preserveScroll: true,
            });
        }
    };

    // 5. Fungsi untuk siapin data isi tabel
    const tableData = stase.data.map((item, index) => ({
        no: stase.from + index,
        nama_stase: item.nama_stase,
        jumlah_aspek: item.aspek_penilaian_count,
        action: (
            <div className="flex items-center justify-center space-x-3">
                {/* Edit Aspek Penilaian */}
                <OsButton
                    onClick={() =>
                        router.get(
                            `/admin/stase/${item.id_stase}/aspek-penilaian`
                        )
                    }
                    className="h-[38px] text-os-small w-full"
                >
                    Edit Aspek Penilaian
                </OsButton>

                {/* Edit Stase */}
                <Link
                    href={`/admin/stase/${item.id_stase}/edit`}
                    className="bg-blue-600 p-2 rounded-md text-white"
                >
                    <Edit2 size={20} />
                </Link>

                {/* Delete Stase */}
                <button
                    onClick={() => handleDelete(item.id_stase)}
                    className="bg-white border border-gray-400 p-2 rounded-md"
                >
                    <Trash2 size={20} className="text-gray-700" />
                </button>
            </div>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            {/* ===== KONTEN UTAMA ===== */}
            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* Header/Breadcrumb */}
                <OsHeader></OsHeader>

                {/* ===== ISI HALAMAN (Scrollable Area) ===== */}
                <div className="flex-1 overflow-auto">
                    {/* Judul & Deskripsi */}
                    <h2 className="font-semibold text-lg mb-1">Menu Stase</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman stase mengatur ruangan yang nanti digunakan
                        untuk penguji menilai mahasiswa
                    </p>

                    {/* Tombol Tambah */}
                    <OsButton
                        // onClick={() => router.get("/admin/stase/create")}
                        onClick={() => setShowModal(true)}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />
                        Tambah Stase
                    </OsButton>

                    {/* Search Bar */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari stase..."
                    />

                    {/* Table Header */}
                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Stase
                    </h2>
                    <OsTableHeader columns={staseColumns} />

                    {/* Data Rows */}
                    <OsTableBody data={tableData} columns={staseColumns} />

                    {/* Pesan jika tidak ada data */}
                    {stase.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data stase tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {stase.links && stase.links.length > 0 && (
                        <div className="mt-8">
                            <OsPagination links={stase.links} />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <OsCopyright />

                {/* Modal Tambah Stase */}
                <OsModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    title="Tambah Stase Baru"
                    subtitle="Isi form di bawah untuk menambahkan stase baru."
                >
                    <OsInput
                        label="Matakuliah"
                        type="suggest"
                        name="nama_stase"
                        placeholder="Masukkan Matakuliah..."
                        required
                    />
                    <OsInput
                        label="Tujuan Pembelajaran"
                        type="suggest"
                        name="nama_stase"
                        placeholder="Masukkan Tujuan Pembelajaran..."
                        required
                    />
                    <OsInput
                        label="Nama Stase"
                        type="text"
                        name="nama_stase"
                        placeholder="Masukkan Nama Stase..."
                        required
                    />
                    <OsInput
                        label="Deskripsi"
                        type="textarea"
                        name="nama_stase"
                        placeholder="Masukkan Deskripsi Stase..."
                        required
                    />
                </OsModal>
            </main>
        </div>
    );
}
