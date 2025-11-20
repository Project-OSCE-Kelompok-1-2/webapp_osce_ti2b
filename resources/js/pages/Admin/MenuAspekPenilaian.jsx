import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { Trash2, Pencil, Search, Plus } from "lucide-react"; // Menambahkan Plus

// Mengimpor komponen yang hilang (asumsi lokasi dan nama file)
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsButton from "../../components/button.jsx";// Asumsi impor OsButton
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/input.jsx"; // Asumsi impor OsInput
import Modals from "../../components/Modals.jsx"; // Asumsi impor Modals untuk modal delete


// Definisi kolom tabel
const columns = [
    { key: "no", content: "No", width: "w-16", classes: "justify-center" },
    { key: "aspek", content: "Deskripsi", width: "flex-1", classes: "justify-start items-start px-4" },
    { key: "bobot_maksimum", content: "Bobot Maksimum", width: "w-[15%]", classes: "justify-center" },
    { key: "action", content: "Action", width: "w-[30%]", classes: "justify-center" },
];


export default function MenuAspekPenilaian() {
    const { stase, aspek_penilaian } = usePage().props;

    // ========= STATE ========
    const [showModal, setShowModal] = useState(false); // modal tambah
    const [editModalOpen, setEditModalOpen] = useState(false); // modal edit
    const [editData, setEditData] = useState(null);

    // ======== DELETE ========
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAspek, setSelectedAspek] = useState(null);

    const openDeleteModal = (aspek) => {
        setSelectedAspek(aspek);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedAspek) return;

        // Menggunakan id_aspek_penilaian dari selectedAspek
        router.delete(`/admin/aspek-penilaian/${selectedAspek.id_aspek_penilaian}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedAspek(null);
            },
        });
    };

    // ======== EDIT ========
    const openEditModal = (item) => {
        setEditData(item);
        setEditModalOpen(true);
    };

    const totalBobot = aspek_penilaian.data.reduce(
        (sum, item) => sum + item.bobot_maksimum,
        0
    );

    //3.Fungsi untuk menjalankkan pencarian
    const [search, setSearch] = useState("");

    const handleSearch = () => {
        router.get(
            `/admin/stase/${stase.id_stase}/aspek-penilaian`,
            { search },
            { preserveScroll: true, preserveState: true }
        );
    };

    //4.Fungsi untuk siapin data isi tabel
    const tableData = aspek_penilaian.data.map((item, index) => ({
        // Menambahkan properti id_aspek_penilaian untuk penggunaan di modal
        id_aspek_penilaian: item.id_aspek_penilaian,
        no: aspek_penilaian.from + index,

        aspek: (
            <div className="flex flex-col items-start leading-tight">
                <div className="font-semibold">{item.aspek}</div>
                <div className="text-xs text-gray-500">{item.jumlah_kompetensi} Kompetensi</div>
            </div>
        ),

        bobot_maksimum: item.bobot_maksimum,

        action: (
            <div className="flex justify-center gap-2">
                {/* Lihat Kompetensi */}
                <Link
                    href={`/admin/aspek-penilaian/${item.id_aspek_penilaian}/kompetensi`}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                    Lihat Kompetensi
                </Link>

                {/* Edit - Diubah untuk membuka modal */}
                <button
                    onClick={() => openEditModal(item)} // Mengganti Link dengan button untuk membuka modal
                    className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    title="Edit Aspek"
                >
                    <Pencil size={16} />
                </button>

                {/* Delete - Diubah untuk memanggil openDeleteModal */}
                <button
                    onClick={() => openDeleteModal(item)} // Mengganti handleDeleteClick yang tidak ada
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    title="Hapus Aspek"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        ),
    }));

    // Logic untuk mengupdate data di modal edit
    // Jika Anda ingin menyimpan perubahan dari modal edit, Anda perlu fungsi terpisah
    // untuk menangani submit, misalnya:
    /*
    const handleEditSubmit = (e) => {
        e.preventDefault();
        router.put(`/admin/aspek-penilaian/${editData.id_aspek_penilaian}`, editData, {
            preserveScroll: true,
            onSuccess: () => setEditModalOpen(false),
            onError: (errors) => console.error(errors),
        });
    };
    */


    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full min-w-min p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* HEADER */}
                <OsHeader variant="goback" backLink="/admin/stase" />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">Menu Aspek Penilaian</h2>

                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman ini berfungsi untuk menambahkan aspek penilaian <br />
                        pada stase "<strong>{stase.nama_stase}</strong>"
                    </p>

                    {/* BUTTON TAMBAH */}
                    <OsButton
                        onClick={() => setShowModal(true)}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <Plus size={20} className="mr-2" /> {/* Mengganti OsIcon dengan Plus */}
                        Tambah Aspek
                    </OsButton>

                    {/* SEARCH BAR */}
                    <div className="flex items-center w-full gap-3 mb-4">
                        <div className="relative flex-1">
                            {/* Menghapus div pointer-events-none yang berlebihan dan menutup div OsSearchBar */}
                            <OsSearchBar
                                search={search}
                                setSearch={setSearch}
                                onSearchClick={handleSearch}
                                placeholder="Cari aspek penilaian..."
                            />
                        </div>
                    </div>

                    {/* Tabel Aspek Penilaian */}
                    <div className="bg-white shadow rounded-lg overflow-x-auto">
                        <h3 className="px-4 py-3 border-b text-gray-700 font-semibold text-lg">
                            Table Aspek Penilaian
                        </h3>

                        {/* header */}
                        <OsTableHeader columns={columns} />

                        {tableData.length > 0 ? (
                            <OsTableBody data={tableData} columns={columns} />
                        ) : (
                            <div className="py-6 text-center text-gray-500">
                                Belum ada aspek penilaian untuk stase ini.
                            </div>
                        )}
                    </div>

                    {/* Baris Total */}
                    <div className="bg-os-white shadow rounded-lg overflow-x-auto mt-6">
                        <table className="w-full min-w-max">
                            <tfoot className="font-semibold">
                                <tr>
                                    <td className="py-3 px-4 text-left text-base w-[55%]">
                                        Total Bobot
                                    </td>
                                    <td className="py-3 px-3 text-center text-base w-[15%]">
                                        {totalBobot}
                                    </td>
                                    <td className="py-3 px-3 text-center w-[30%]">
                                        {totalBobot !== 100 && totalBobot > 0 && (
                                            <button className="bg-red-600 text-white text-sm px-3 py-2 rounded-lg shadow-md">
                                                Point Tidak Seimbang!
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>


                {/* ================= MODAL TAMBAH ================= */}
                <OsModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    title="Tambah Aspek Penilaian"
                    subtitle="Isi form di bawah"
                >
                    <OsInput label="Aspek" type="text" name="aspek" placeholder="Masukkan aspek..." required />
                    <OsInput label="Bobot" type="number" name="bobot" placeholder="Masukkan bobot..." required />
                </OsModal>

                {/* ================= MODAL EDIT ================= */}
                <OsModal
                    show={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    variant="edit" // Perlu form submit di OsModal untuk menyimpan data
                    title="Edit Aspek Penilaian"
                    subtitle={editData?.aspek}
                >
                    <OsInput
                        label="Aspek"
                        type="text"
                        name="aspek"
                        value={editData?.aspek || ''} // Tambahkan fallback value
                        onChange={(e) => setEditData({ ...editData, aspek: e.target.value })}
                    />

                    <OsInput
                        label="Bobot Maksimum"
                        type="number"
                        name="bobot_maksimum"
                        value={editData?.bobot_maksimum || ''} // Tambahkan fallback value
                        onChange={(e) =>
                            setEditData({ ...editData, bobot_maksimum: e.target.value })
                        }
                    />
                </OsModal>

                {/* ================= MODAL DELETE ================= */}
                <Modals
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    variant="delete"
                    dataToDelete={[
                        selectedAspek?.aspek,
                        `${selectedAspek?.bobot_maksimum} poin`,
                    ]}
                    onConfirm={confirmDelete}
                />
            </main>
        </div>
    );
}
