import React, { useState } from "react";
import { usePage, Link, router, useForm } from "@inertiajs/react";
import { Trash2, Pencil } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsButton from "../../components/button.jsx";
import OsModal from "../../components/Modal.jsx"; // Modal Tambah/Edit
import OsInput from "../../components/input.jsx";
import Modals from "../../components/Modals.jsx"; // Modal Konfirmasi Hapus
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/Copyright.jsx";

// Definisi kolom tabel
// const columns = [
//     {
//         key: "no",
//         content: "No",
//         width: "w-16",
//         classes: "justify-center items-center",
//     },
//     {
//         key: "aspek",
//         content: "Deskripsi",
//         width: "w-7/12",
//         classes: "justify-start items-center px-4",
//     },
//     {
//         key: "bobot_maksimum",
//         content: "Bobot Maksimum",
//         width: "w-2/12",
//         classes: "justify-center items-center",
//     },
//     {
//         key: "action",
//         content: "Aksi",
//         width: "w-3/12",
//         classes: "justify-center items-center",
//     },
// ];
const columns = [
    {
        key: "no",
        content: "No",
        width: "w-16 shrink-0",
        classes: "justify-center items-center",
    },
    {
        key: "aspek",
        content: "Deskripsi",
        width: "w-[400px] flex-1 shrink-0", // Ganti w-7/12
        classes: "justify-start items-center px-4",
    },
    {
        key: "bobot_maksimum",
        content: "Bobot Maksimum",
        width: "w-32 shrink-0", // Ganti w-2/12
        classes: "justify-center items-center",
    },
    {
        key: "action",
        content: "Aksi",
        width: " shrink-0 min-w-[300px]", // Ganti w-3/12
        classes: "justify-center items-center",
    },
];

export default function MenuAspekPenilaian() {
    const { stase, aspek_penilaian, filters } = usePage().props;

    // ========= STATE UTAMA (Inertia useForm) ========
    const {
        data,
        setData,
        post,
        put,
        reset,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        id: null,
        aspek: "",
        bobot_maksimum: "",
        id_stase: stase.id_stase,
    });

    // ========= STATE UI (Modal & Search) ========
    const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'
    const [showModal, setShowModal] = useState(false);

    // ======== STATE MODAL DELETE ========
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // Kita simpan data sementara yang mau dihapus di sini
    const [dataToDelete, setDataToDelete] = useState(null);

    // ======== STATE SEARCH ========
    const [search, setSearch] = useState(filters?.search || "");

    // ======== HANDLER SEARCH ========
    const handleSearch = () => {
        router.get(
            `/admin/stase/${stase.id_stase}/aspek-penilaian`,
            { search },
            { preserveScroll: true, preserveState: true }
        );
    };

    // ======== OPEN MODAL TAMBAH ========
    const openAddModal = () => {
        setModalMode("add");
        // Reset form saat membuka modal tambah
        setData({
            id: null,
            aspek: "",
            bobot_maksimum: "",
            id_stase: stase.id_stase,
        });
        setShowModal(true);
    };

    // ======== OPEN MODAL EDIT ========
    const openEditModal = (item) => {
        setModalMode("edit");
        setData({
            id: item.id_aspek_penilaian,
            aspek: item.aspek,
            bobot_maksimum: item.bobot_maksimum,
            id_stase: stase.id_stase,
        });
        setShowModal(true);
    };

    // ======== HANDLE SUBMIT (TAMBAH/EDIT) ========
    const handleSubmit = (e) => {
        e.preventDefault();

        if (modalMode === "edit") {
            put(`/admin/aspek-penilaian/${data.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post(`/admin/stase/${stase.id_stase}/aspek-penilaian`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    // ======== HANDLE CLEAR (RESET FORM) ========
    const handleClear = () => {
        // Kita harus mereset input manual menggunakan setData
        setData({
            ...data, // Pertahankan data lain (seperti id_stase)
            aspek: "", // Kosongkan input Aspek
            bobot_maksimum: "", // Kosongkan input Bobot
        });
    };

    // ======== OPEN MODAL DELETE (Trigger dari tabel utama) ========
    const openDeleteModal = (aspekItem) => {
        setDataToDelete({
            id: aspekItem.id_aspek_penilaian,
            aspek: aspekItem.aspek,
            bobot: aspekItem.bobot_maksimum,
        });
        setIsDeleteModalOpen(true);
    };

    // ======== HANDLE DELETE DARI DALAM MODAL EDIT ========
    // Fungsi ini dipanggil saat tombol sampah di dalam modal edit ditekan
    const handleDeleteFromEdit = () => {
        // 1. Tutup modal edit dulu
        setShowModal(false);

        // 2. Siapkan data yang mau dihapus (ambil dari form state saat ini)
        setDataToDelete({
            id: data.id,
            aspek: data.aspek,
            bobot: data.bobot_maksimum,
        });

        // 3. Buka modal konfirmasi hapus
        setIsDeleteModalOpen(true);
    };

    // ======== CONFIRM DELETE ACTION ========
    const confirmDelete = () => {
        if (!dataToDelete) return;

        router.delete(`/admin/aspek-penilaian/${dataToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDataToDelete(null);
            },
        });
    };

    // ======== DATA TABEL ========
    const totalBobot = aspek_penilaian.data.reduce(
        (sum, item) => sum + item.bobot_maksimum,
        0
    );

    const tableData = aspek_penilaian.data.map((item, index) => ({
        id_aspek_penilaian: item.id_aspek_penilaian,
        no: aspek_penilaian.from + index,

        aspek: (
            <div className="flex flex-col items-start leading-tight">
                <div className="font-semibold">{item.aspek}</div>
                <div className="text-xs text-gray-500">
                    {item.jumlah_kompetensi} Kompetensi
                </div>
            </div>
        ),

        bobot_maksimum: item.bobot_maksimum,

        action: (
            <div className="flex justify-center gap-2">
                <OsButton
                    name="primary"
                    onClick={() =>
                        router.get(
                            `/admin/aspek-penilaian/${item.id_aspek_penilaian}/kompetensi`
                        )
                    }
                    className="h-[38px] text-os-small w-full flex justify-between items-center gap-3"
                >
                    <OsIcon name={"add"} className="os-icon-light h-[20px]" />
                    Edit Kompetensi
                </OsButton>

                <OsButton
                    name="edit"
                    onClick={() => openEditModal(item)}
                    className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    title="Edit Aspek"
                >
                    <Pencil size={18} />
                </OsButton>

                <OsButton
                    name="warning"
                    onClick={() => openDeleteModal(item)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    title="Hapus Aspek"
                >
                    <Trash2 size={18} className="text-os-white" />
                </OsButton>
            </div>
        ),
    }));

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
              <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />


            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                {/* HEADER */}
                <OsHeader variant="goback" backLink="/admin/stase" onMenuClick={handleSidebarToggle}/>

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        {stase.nama_stase}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                        Halaman ini didedikasikan untuk mengatur seluruh Aspek
                        Penilaian yang terikat pada Stase. Anda dapat menambah,
                        mengubah, dan menghapus setiap aspek, serta menetapkan
                        bobot maksimumnya.
                    </p>

                    {/* BUTTON TAMBAH */}
                    {totalBobot == 100 ? (
                        <OsButton
                            name="secondary"
                            className="flex h-[46px] items-center bg-gray-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-gray-700 !scale-100 !pointer-events-none"
                        >
                            Bobot sudah penuh
                        </OsButton>
                    ) : (
                        <OsButton
                            name="primary"
                            onClick={openAddModal}
                            className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                        >
                            <OsIcon
                                name="add"
                                className="h-os-20 os-icon-light mr-os-8"
                            />
                            Tambah Aspek Penilaian
                        </OsButton>
                    )}

                    {/* SEARCH BAR */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari aspek penilaian..."
                    />

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Aspek Penilaian
                    </h2>

                    <div className="w-full overflow-x-auto pb-4">
                        <div className="min-w-max">
                            <OsTableHeader columns={columns} />

                            {tableData.length > 0 ? (
                                <OsTableBody data={tableData} columns={columns} />
                            ) : (
                                <div className="py-6 text-center text-gray-500">
                                    Belum ada aspek penilaian untuk stase ini.
                                </div>
                            )}

                            {/* Footer Total Bobot tetap di dalam scroll biar sejajar */}
                             <div className="bg-os-white rounded-lg overflow-hidden border-os-1 border-os-black mt-3 h-[56px]">
                                {/* ... isi footer ... */}
                            </div>
                        </div>
                    </div>

                    <div className="bg-os-white rounded-lg overflow-hidden border-os-1 border-os-black mt-3 h-[56px]">
                        <table className="w-full h-[56px]">
                            <tfoot>
                                <tr className="w-full">
                                    <td className="pl-4 text-left w-[60%] h-full">
                                        Total Bobot
                                    </td>
                                    <td className=" px-3 text-center w-2/12">
                                        <span className="text-sm">Bobot:</span>
                                        <span className="text-black font-bold pl-1.5">
                                            {totalBobot}
                                        </span>
                                    </td>
                                    <td className=" px-5  text-center w-3/12">
                                        {totalBobot == 100 ? (
                                            <div className="bg-green-600 text-white w-full text-sm px-3 py-2 rounded-lg inline-block">
                                                Point Seimbang (100%)
                                            </div>
                                        ) : (
                                            totalBobot > 0 && (
                                                <div className="bg-red-600 text-white w-full text-sm px-3 py-2 rounded-lg inline-block">
                                                    Point Tidak Seimbang! (
                                                    {totalBobot}%)
                                                </div>
                                            )
                                        )}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <OsCopyright />
            </main>

            {/* ================= MODAL ADD/EDIT TUNGGAL ================= */}
            <OsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                variant={modalMode}
                onSubmit={handleSubmit}
                // 🔥 Sini kuncinya: Menghubungkan handleClear ke tombol merah di mode Add
                onClear={handleClear}
                // 🔥 Menghubungkan handleDeleteFromEdit ke tombol merah di mode Edit
                onDelete={handleDeleteFromEdit}
                title={
                    modalMode === "edit"
                        ? "Edit Aspek Penilaian"
                        : "Tambah Aspek Penilaian"
                }
                subtitle={
                    modalMode === "edit"
                        ? `Ubah data aspek: ${data.aspek}`
                        : "Isi form di bawah untuk menambahkan aspek baru."
                }
            >
                <div className="space-y-3">
                    <OsInput
                        label="Nama Aspek Penilaian"
                        type="text"
                        name="aspek"
                        value={data.aspek}
                        onChange={(evt) => setData("aspek", evt.target.value)}
                        placeholder="Masukkan nama aspek penilaian..."
                        required
                    />
                    <OsInput
                        label="Bobot Maksimum"
                        type="number"
                        name="bobot_maksimum"
                        value={data.bobot_maksimum}
                        onChange={(evt) =>
                            setData("bobot_maksimum", evt.target.value)
                        }
                        placeholder="Masukkan bobot..."
                        required
                    />
                </div>
            </OsModal>

            {/* ================= MODAL DELETE ================= */}
            <Modals
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                variant="delete"
                title="Hapus Aspek Penilaian?"
                message="Apakah Anda yakin ingin menghapus aspek penilaian ini?"
                confirmText="Hapus"
                dataToDelete={[
                    { key: "Aspek", value: dataToDelete?.aspek || "-" },
                    {
                        key: "Bobot",
                        value: `${dataToDelete?.bobot || 0} poin`,
                    },
                ]}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
