import React, { useState } from "react";
import { usePage, router, useForm } from "@inertiajs/react";
import { Pencil, Trash2, Search } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsIcon from "../../components/icons";
import OsTableHeader from "../../components/tableheader";
import OsSearchBar from "../../components/searchbar";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsButton from "../../components/button.jsx";
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/input.jsx";
import Modals from "../../components/Modals.jsx";
import OsCopyright from "../../components/Copyright.jsx";

// Definisi kolom tabel
const columns = [
    {
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
        key: "no",
    },
    {
        content: "Deskripsi",
        width: "w-8/12",
        classes: "justify-start items-center px-4",
        key: "kompetensi",
    },
    {
        content: "Bobot",
        width: "w-2/12",
        classes: "justify-center items-center",
        key: "bobot",
    },
    {
        content: "Aksi",
        width: "w-2/12",
        classes: "justify-center items-center",
        key: "action",
    },
];

export default function KompetensiPage() {
    const { aspek, kompetensi, filters } = usePage().props;

    // 🔥 1. HITUNG TOTAL BOBOT DI AWAL (Agar bisa dipakai validasi)
    const totalBobot = kompetensi.data.reduce(
        (acc, curr) => acc + Number(curr.bobot),
        0
    );

    // --- SETUP URL BACK BUTTON ---
    const backUrl = aspek.id_stase
        ? `/admin/stase/${aspek.id_stase}/aspek-penilaian`
        : "/admin/stase";

    // --- FORM INERTIA ---
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        id: null,
        kompetensi: "",
        bobot: "",
        id_aspek_penilaian: aspek.id_aspek_penilaian,
    });

    // SEARCH STATE
    const [search, setSearch] = useState(filters.search || "");

    // MODAL CONTROL
    const [modalType, setModalType] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    /* ----------------------- SEARCH ----------------------- */
    const handleSearch = () => {
        router.get(
            `/admin/aspek-penilaian/${aspek.id_aspek_penilaian}/kompetensi`,
            { search },
            { preserveState: true, replace: true }
        );
    };

    /* ----------------------- ADD DATA ----------------------- */
    const openAddModal = () => {
        // 🔥 2. CEK SEBELUM BUKA MODAL
        if (totalBobot >= 100) {
            alert(
                "Total bobot sudah mencapai 100%. Tidak dapat menambah kompetensi lagi."
            );
            return;
        }

        setModalType("add");
        setData({
            id: null,
            kompetensi: "",
            bobot: "",
            id_aspek_penilaian: aspek.id_aspek_penilaian,
        });
        setModalOpen(true);
    };

    /* ----------------------- EDIT DATA ----------------------- */
    const openEditModal = (item) => {
        setSelected(item);
        setModalType("edit");
        setData({
            id: item.id_poin_aspek_penilaian,
            kompetensi: item.kompetensi,
            bobot: item.bobot,
            id_aspek_penilaian: aspek.id_aspek_penilaian,
        });
        setModalOpen(true);
    };

    /* ----------------------- HANDLE CLEAR ----------------------- */
    const handleClear = () => {
        setData({
            id: null,
            kompetensi: "",
            bobot: "",
            id_aspek_penilaian: aspek.id_aspek_penilaian,
        });
    };

    /* ----------------------- SUBMIT HANDLER ----------------------- */
    const handleSubmit = (e) => {
        e.preventDefault();

        const inputBobot = Number(data.bobot);

        // 🔥 3. VALIDASI BOBOT MAKSIMAL 100 SAAT SUBMIT
        if (modalType === "add") {
            if (totalBobot + inputBobot > 100) {
                alert(
                    `Gagal! Total bobot akan menjadi ${
                        totalBobot + inputBobot
                    }%. Maksimal adalah 100%. Sisa bobot: ${100 - totalBobot}`
                );
                return; // Stop proses
            }

            post(
                `/admin/aspek-penilaian/${aspek.id_aspek_penilaian}/kompetensi`,
                {
                    onSuccess: () => {
                        setModalOpen(false);
                        reset();
                        router.reload({ only: ["kompetensi"] });
                    },
                }
            );
        } else if (modalType === "edit") {
            // Logika Edit: (Total Lama - Bobot Lama Item Ini) + Bobot Baru
            const oldBobot = selected ? Number(selected.bobot) : 0;
            const projectedTotal = totalBobot - oldBobot + inputBobot;

            if (projectedTotal > 100) {
                alert(
                    `Gagal! Total bobot akan menjadi ${projectedTotal}%. Maksimal adalah 100%.`
                );
                return; // Stop proses
            }

            put(`/admin/kompetensi/${data.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                    router.reload({ only: ["kompetensi"] });
                },
            });
        }
    };

    /* ----------------------- DELETE DATA ----------------------- */
    const openDeleteModal = (item) => {
        setSelected(item);
        setModalType("delete");
        setModalOpen(true);
    };

    const handleDeleteSubmit = () => {
        if (!selected) return;
        const deleteId = selected.id_poin_aspek_penilaian;

        destroy(`/admin/kompetensi/${deleteId}`, {
            onSuccess: () => {
                setModalOpen(false);
                router.reload({ only: ["kompetensi"] });
            },
        });
    };

    /* ----------------------- TABLE DATA ----------------------- */
    const tableData = kompetensi.data.map((item, idx) => ({
        no: kompetensi.from + idx,
        kompetensi: item.kompetensi,
        bobot: item.bobot,
        action: (
            <div className="flex gap-2 justify-center">
                <OsButton
                    name="edit"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-white bg-yellow-500 hover:bg-yellow-600 border border-transparent rounded-lg"
                >
                    <Pencil size={18} />
                </OsButton>

                <OsButton
                    name="warning"
                    onClick={() => openDeleteModal(item)}
                    className="p-1.5 text-white bg-red-600 hover:bg-red-700 border border-transparent rounded-lg"
                >
                    <Trash2 size={18} />
                </OsButton>
            </div>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                <OsHeader variant="goback" backLink={backUrl} />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">
                        {aspek.aspek}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                        Kelola dan definisikan poin-poin kompetensi
                        (sub-kriteria) yang spesifik dan terukur untuk Aspek
                        Penilaian.
                    </p>

                    {/* 🔥 4. TOMBOL TAMBAH DISABLE JIKA 100% */}
                    <OsButton
                        name="primary"
                        onClick={openAddModal}
                        // Tambahkan style visual disabled jika totalBobot >= 100
                        className={`flex h-[46px] items-center text-white text-sm py-2 px-4 rounded-lg mb-5 ${
                            totalBobot >= 100
                                ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        disabled={totalBobot >= 100}
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />
                        {totalBobot >= 100
                            ? "Bobot Penuh (100%)"
                            : "Tambah Kompetensi"}
                    </OsButton>

                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari kompetensi..."
                    />

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Kompetensi
                    </h2>

                    <OsTableHeader columns={columns} />

                    {tableData.length > 0 ? (
                        <OsTableBody data={tableData} columns={columns} />
                    ) : (
                        <div className="py-6 text-center text-gray-500 border-b">
                            Belum ada kompetensi untuk aspek ini.
                        </div>
                    )}

                    <OsPagination links={kompetensi.links} />

                    {/* Footer Total */}
                    <div className="relative border mt-3 h-[56px] border-black rounded-lg flex items-center justify-between px-4 py-2">
                        <p className="text-black w-[70%] ">
                            Total Bobot dan Jumlah Kompetensi
                        </p>
                        <div className="flex w-[30%] justify-end gap-4 text-sm">
                            <div className="flex w-full items-center justify-center gap-1.5 px-2 py-1 rounded-md">
                                <span className="text-sm">Total Bobot:</span>
                                {/* Indikator Warna Bobot */}
                                <span
                                    className={`font-bold ${
                                        totalBobot === 100
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {totalBobot}%
                                </span>
                            </div>
                            <div className="flex w-full items-center justify-center gap-1.5 px-2 py-1 rounded-md">
                                <span className="text-sm">Kompetensi:</span>
                                <span className="text-black font-bold">
                                    {kompetensi.total}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <footer>
                    <OsCopyright />
                </footer>
            </div>

            {/* MODAL FORM */}
            <OsModal
                show={modalOpen && modalType !== "delete"}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                onClear={handleClear}
                variant={modalType}
                title={
                    modalType === "add"
                        ? "Tambah Kompetensi"
                        : "Edit Kompetensi"
                }
                subtitle="Isi form berikut"
            >
                <div className="space-y-3">
                    <OsInput
                        label="Deskripsi Kompetensi"
                        type="textarea"
                        name="kompetensi"
                        value={data.kompetensi}
                        placeholder="Masukkan deskripsi kompetensi..."
                        onChange={(e) => setData("kompetensi", e.target.value)}
                        required
                    />
                    <OsInput
                        label="Bobot Kompetensi"
                        type="number"
                        name="bobot"
                        value={data.bobot}
                        placeholder="Masukkan bobot kompetensi..."
                        onChange={(e) => setData("bobot", e.target.value)}
                        required
                    />
                    {/* Pesan Sisa Bobot di Modal */}
                    <div className="text-xs text-gray-500">
                        Sisa bobot yang tersedia:{" "}
                        <span className="font-bold">
                            {100 -
                                (modalType === "edit"
                                    ? totalBobot -
                                      (selected ? selected.bobot : 0)
                                    : totalBobot)}
                        </span>
                    </div>

                    {(errors.kompetensi || errors.bobot) && (
                        <div className="text-red-500 text-xs">
                            {errors.kompetensi && <p>{errors.kompetensi}</p>}
                            {errors.bobot && <p>{errors.bobot}</p>}
                        </div>
                    )}
                </div>
            </OsModal>

            {/* MODAL DELETE */}
            <Modals
                isOpen={modalOpen && modalType === "delete"}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDeleteSubmit}
                variant="delete"
                title="Hapus Kompetensi?"
                message="Apakah Anda yakin ingin menghapus kompetensi ini?"
                confirmText="Hapus"
                dataToDelete={[
                    { key: "Deskripsi", value: selected?.kompetensi || "-" },
                    { key: "Bobot", value: selected?.bobot || "-" },
                ]}
            />
        </div>
    );
}
