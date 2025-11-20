import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { Pencil, Trash2, PlusCircle, Search, ArrowLeft } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsButton from "../../components/button.jsx";
import OsInput from "../../components/input.jsx";
import OsModal from "../../components/Modal.jsx";
import Modals from "../../components/Modals.jsx"; // ⬅️ Tambahkan import

export default function KompetensiPage() {
    const { aspek, kompetensi, filters } = usePage().props;
    const [showModal, setShowModal] = useState(false);

    const [search, setSearch] = useState(filters.search || "");

    // ==============================
    // 🆕 STATE UNTUK MODAL DELETE
    // ==============================
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedKompetensi, setSelectedKompetensi] = useState(null);

    const handleSearch = () => {
        router.get(
            `/admin/aspek-penilaian/${aspek.id_aspek_penilaian}/kompetensi`,
            { search },
            { preserveState: true, replace: true }
        );
    };

    // ====================================
    // 🆕 OPEN MODAL DELETE
    // ====================================
    const openDeleteModal = (item) => {
        setSelectedKompetensi(item);
        setIsModalOpen(true);
    };

    // ====================================
    // 🆕 KONFIRMASI DELETE DARI MODAL
    // ====================================
    const handleDeleteConfirm = () => {
        if (!selectedKompetensi) return;

        router.delete(
            `/admin/kompetensi/${selectedKompetensi.id_poin_aspek_penilaian}`,
            {
                preserveScroll: true,
                onFinish: () => setIsModalOpen(false),
            }
        );
    };

    const totalBobot = kompetensi.data.reduce(
        (acc, curr) => acc + Number(curr.bobot),
        0
    );

    return (
        // 🆕 Tambahkan relative dan overflow-hidden agar sidebar overlay bisa muncul di atas dashboard
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* Sidebar dipanggil langsung tanpa kontrol dari dashboard */}
            <Sidebar />

            <main className="grid w-full min-w-min p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* Breadcrumb */}
                <OsHeader
                    variant="goback"
                    backLink={`/admin/stase/${aspek.stase.id_stase}/aspek-penilaian`}
                />

                {/* Header */}
                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        Menu Kompetensi
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman untuk mengelola poin-poin kompetensi dari aspek
                        penilaian "<strong>{aspek.aspek}</strong>"
                    </p>

                    {/* 👇 [UBAH] Tombol tambah diubah menjadi Link */}
                    <OsButton
                        // onClick={() =>
                        //     router.get(
                        //         `/admin/aspek-penilaian/${aspek.id_aspek_penilaian}/kompetensi/create`
                        //     )
                        // }
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 mt-3 bg-blue-700 hover:bg-blue-600 text-white px-5 py-3 rounded-xl"
                    >
                        <PlusCircle size={20} />
                        Tambah Kompetensi
                    </OsButton>
                </div>

                {/* Search Bar */}
                <div className="flex items-center w-full gap-3 mb-4">
                    <div className="flex flex-1 items-center gap-2 border border-black rounded-xl px-3 py-3">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Tuliskan data kompetensi..."
                            className="flex-1 outline-none text-sm text-gray-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-24 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl border border-black"
                    >
                        Cari
                    </button>
                </div>

                <h3 className="font-semibold mb-2">Table Kompetensi</h3>
                <div className="relative overflow-x-auto border border-black rounded-xl shadow-sm">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-200 text-black border-b border-black">
                            <tr>
                                <th className="border-b border-black py-2 px-3 text-center w-12">No</th>
                                <th className="border-x border-b border-black py-2 px-3 text-left">
                                    Deskripsi Kompetensi
                                </th>
                                <th className="border-r border-b border-black py-2 px-3 text-center w-24">
                                    Bobot
                                </th>
                                <th className="border-b border-black py-2 px-3 text-center w-28">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {kompetensi.data.length > 0 ? (
                                kompetensi.data.map((item, idx) => (
                                    <tr
                                        key={item.id_poin_aspek_penilaian}
                                        className="hover:bg-gray-50 transition border-t border-black/30"
                                    >
                                        <td className="border-r border-black/30 text-center py-2">
                                            {kompetensi.from + idx}
                                        </td>
                                        <td className="border-r border-black/30 py-2 px-3 text-gray-800">
                                            {item.kompetensi}
                                        </td>
                                        <td className="border-r border-black/30 text-center py-2">
                                            {item.bobot}
                                        </td>

                                        <td className="py-2 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() =>
                                                    router.get(
                                                        `/admin/kompetensi/${item.id_poin_aspek_penilaian}/edit`
                                                    )
                                                }
                                                className="p-1.5 text-white bg-blue-700 hover:bg-blue-500 border border-black rounded-lg"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            {/* ================
                                                🆕 BUTTON OPEN MODAL DELETE
                                            ================= */}
                                            <button
                                                onClick={() => openDeleteModal(item)}
                                                className="p-1.5 text-black bg-white hover:bg-red-600 hover:text-white border border-black rounded-lg transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center text-gray-500 py-4 border-t border-black/30"
                                    >
                                        Data tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION (Untuk sementara dihapus agar tidak error, bisa diganti dengan komponen Paginasi nanti) */}

                {/* Footer Total Kompetensi / Aspek Penilaian */}
                <div className="relative mt-2 my-2 border border-black rounded-xl flex items-center justify-between px-4 py-2">
                    <p className="text-sm text-black">
                        Total bobot kompetensi / aspek penilaian
                    </p>
                    <div className="flex gap-3">
                        <div className="border border-black rounded-xl px-8 py-2">
                            <span className="font-medium">Kompetensi:</span> {kompetensi.total}
                        </div>
                        <div className="border border-black rounded-xl px-8 py-2">
                            <span className="font-medium">Total Bobot:</span> {totalBobot}
                        </div>
                    </div>
                </div>

                {/* Footer Copyright */}
                <footer>
                    <OsCopyright />
                </footer>
                {/* Modal Tambah Stase */}
                <OsModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    title="Tambah Menu Kompetensi Baru"
                    subtitle="Isi form di bawah untuk menambahkan kompetensi baru."
                >
                    <OsInput
                        label="Deskripsi Kompetensi"
                        type="textarea"
                        name="nama_stase"
                        placeholder="Masukkan Deskripsi Kompetensi..."
                        required
                    />
                    <OsInput
                        label="Bobot Kompetensi"
                        type="number"
                        name="nama_stase"
                        placeholder="Masukkan Bobot Kompetensi..."
                        required
                    />
                </OsModal>
            </main>
                <footer className="border border-black rounded-xl text-start px-4 py-4 text-sm text-gray-600">
                    © Jorem ipsum dolor sit amet, consectetur adipiscing elit.
                </footer>
            </div>

            {/* ======================================================
                 🆕 MODAL DELETE (PAKE Modals.jsx)
            ======================================================= */}
            <Modals
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                variant="delete"
                dataToDelete={
                    selectedKompetensi
                        ? [selectedKompetensi.kompetensi]
                        : []
                }
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
