import { Link, usePage, router } from "@inertiajs/react";
import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2,
} from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsIcon from "../../components/icons";
import OsTableHeader from "../../components/tableheader";
import OsSearchBar from "../../components/searchbar";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsButton from "../../components/button.jsx";

// 🔥 Import modal delete
import Modals from "../../components/Modals.jsx";

const staseColumns = [
    { key: "no", content: "No", width: "w-16", classes: "justify-center items-center" },
    { key: "nama_stase", content: "Nama Stase", width: "flex-1", classes: "justify-start items-center px-4" },
    { key: "jumlah_aspek", content: "Jumlah Aspek", width: "w-56", classes: "justify-center items-center px-4" },
    { key: "action", content: "Action", width: "w-80", classes: "justify-center items-center px-4" },
];

export default function Stase() {
    const { stase, filters } = usePage().props;

    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = () => {
        router.get(
            "/admin/stase",
            { search },
            { preserveState: true, replace: true }
        );
    };

    // 🔥 STATE MODAL DELETE
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedName, setSelectedName] = useState("");

    // 🔥 BUKA MODAL
    const openDeleteModal = (id, name) => {
        setSelectedId(id);
        setSelectedName(name);
        setIsDeleteOpen(true);
    };

    // 🔥 KONFIRMASI HAPUS
    const handleConfirmDelete = () => {
        router.delete(`/admin/stase/${selectedId}`, {
            preserveScroll: true,
            onFinish: () => setIsDeleteOpen(false),
        });
    };

    // --- DATA TABEL ---
    const tableData = stase.data.map((item, index) => ({
        no: stase.from + index,
        nama_stase: item.nama_stase,
        jumlah_aspek: item.aspek_penilaian_count,
        action: (
            <div className="flex items-center justify-center space-x-3">

                {/* Edit Aspek Penilaian */}
                <OsButton
                    onClick={() => router.get(`/admin/stase/${item.id_stase}/aspek-penilaian`)}
                    className="h-[38px] text-os-small w-full"
                >
                    Edit Aspek Penilaian
                </OsButton>

                {/* Edit */}
                <Link
                    href={`/admin/stase/${item.id_stase}/edit`}
                    className="bg-blue-600 p-2 rounded-md text-white"
                >
                    <Edit2 size={20} />
                </Link>

                {/* DELETE (PAKAI MODAL) */}
                <button
                    onClick={() => openDeleteModal(item.id_stase, item.nama_stase)}
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

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                <OsHeader />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">Menu Stase</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman stase mengatur ruangan yang nanti digunakan
                        untuk penguji menilai mahasiswa
                    </p>

                    <OsButton
                        onClick={() => router.get("/admin/stase/create")}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />
                        Tambah Stase
                    </OsButton>

                    {/* Search */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari stase..."
                    />

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">Table Stase</h2>
                    <OsTableHeader columns={staseColumns} />
                    <OsTableBody data={tableData} columns={staseColumns} />

                    {stase.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data stase tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {stase.links && stase.links.length > 0 && (
                        <div className="mt-8">
                            <OsPagination links={stase.links} />
                        </div>
                    )}
                </div>

                <OsCopyright />
            </main>

            {/* 🔥 MODAL DELETE */}
            <Modals
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                variant="delete"
                title="Hapus Stase?"
                message="Apakah Anda yakin ingin menghapus stase ini? Data tidak dapat dikembalikan."
                confirmText="Hapus"
                dataToDelete={[
                    { key: "Nama Stase", value: selectedName || "-" },
                ]}
            />
        </div>
    );
}
