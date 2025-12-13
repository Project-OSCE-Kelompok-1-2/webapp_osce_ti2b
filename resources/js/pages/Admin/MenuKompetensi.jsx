import React, { useState, useEffect, useMemo } from "react"; // [1] Import useEffect & useMemo
import { usePage, router, useForm } from "@inertiajs/react";
import { Pencil, Trash2 } from "lucide-react";

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

const columns = [
    {
        content: "No",
        width: "w-16 shrink-0",
        classes: "justify-center items-center",
        key: "no",
    },
    {
        content: "Deskripsi",
        width: "w-[500px] flex-1 shrink-0",
        classes: "justify-start items-center px-4",
        key: "kompetensi",
    },
    {
        content: "Bobot",
        width: "w-32 shrink-0",
        classes: "justify-center items-center",
        key: "bobot",
    },
    {
        content: "Aksi",
        width: "w-32 shrink-0",
        classes: "justify-center items-center",
        key: "action",
    },
];

export default function KompetensiPage() {
    // 1. Ambil Data Full
    const { aspek, kompetensi, filters } = usePage().props;
    const allData = Array.isArray(kompetensi)
        ? kompetensi
        : kompetensi?.data || [];

    // 2. State Filter & Pagination
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- INSTANT FILTER LOGIC ---

    // A. Reset Page ke 1 saat search berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // B. Filter Data (Client Side)
    const filteredData = useMemo(() => {
        return allData.filter((item) => {
            const term = search.toLowerCase();
            return (
                item.kompetensi?.toLowerCase().includes(term) ||
                item.bobot?.toString().includes(term)
            );
        });
    }, [search, allData]);

    // C. Slice Pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // D. Generate Pagination Links
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

    // 🔥 HITUNG TOTAL BOBOT (Dari semua data, bukan yang difilter)
    const totalBobot = allData.reduce(
        (acc, curr) => acc + Number(curr.bobot),
        0
    );

    // --- SETUP URL BACK BUTTON ---
    const backUrl = aspek.id_stase
        ? `/admin/stase/${aspek.id_stase}/aspek-penilaian`
        : "/admin/stase";

    // --- FORM & MODAL STATE ---
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
    } = useForm({
        id: null,
        kompetensi: "",
        bobot: "",
        id_aspek_penilaian: aspek.id_aspek_penilaian,
    });

    const [modalType, setModalType] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // --- HANDLERS ---
    const openAddModal = () => {
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

    const handleClear = () => {
        setData({
            id: null,
            kompetensi: "",
            bobot: "",
            id_aspek_penilaian: aspek.id_aspek_penilaian,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const inputBobot = Number(data.bobot);

        if (modalType === "add") {
            if (totalBobot + inputBobot > 100) {
                alert(
                    `Gagal! Total bobot akan menjadi ${
                        totalBobot + inputBobot
                    }%. Maksimal adalah 100%. Sisa bobot: ${100 - totalBobot}`
                );
                return;
            }
            post(
                `/admin/aspek-penilaian/${aspek.id_aspek_penilaian}/kompetensi`,
                {
                    onSuccess: () => {
                        setModalOpen(false);
                        reset();
                    }, // Router reload dihapus karena Inertia auto-reload
                }
            );
        } else if (modalType === "edit") {
            const oldBobot = selected ? Number(selected.bobot) : 0;
            const projectedTotal = totalBobot - oldBobot + inputBobot;
            if (projectedTotal > 100) {
                alert(
                    `Gagal! Total bobot akan menjadi ${projectedTotal}%. Maksimal adalah 100%.`
                );
                return;
            }
            put(`/admin/kompetensi/${data.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const openDeleteModal = (item) => {
        setSelected(item);
        setModalType("delete");
        setModalOpen(true);
    };

    const handleDeleteSubmit = () => {
        if (!selected) return;
        destroy(`/admin/kompetensi/${selected.id_poin_aspek_penilaian}`, {
            onSuccess: () => {
                setModalOpen(false);
            },
        });
    };

    // --- TABLE DATA MAPPING (Use paginatedData) ---
    const tableData = paginatedData.map((item, idx) => ({
        no: (currentPage - 1) * itemsPerPage + idx + 1,
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
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader
                        variant="goback"
                        backLink={backUrl}
                        onMenuClick={handleSidebarToggle}
                    />

                    <div className="flex-1 overflow-auto">
                        <h2 className="font-semibold text-lg mb-1">
                            {aspek.aspek}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                            Kelola dan definisikan poin-poin kompetensi
                            (sub-kriteria) yang spesifik dan terukur untuk Aspek
                            Penilaian.
                        </p>

                        <OsButton
                            name="primary"
                            onClick={openAddModal}
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

                        {/* SEARCH INSTANT */}
                        <OsSearchBar
                            search={search}
                            setSearch={setSearch}
                            placeholder="Cari kompetensi..."
                        />

                        <h2 className="font-semibold text-lg mb-2 mt-os-8">
                            Table Kompetensi
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Total: {totalItems} data)
                            </span>
                        </h2>

                        <div className="w-full overflow-x-auto pb-4">
                            <div className="min-w-max">
                                <OsTableHeader columns={columns} />
                                {tableData.length > 0 ? (
                                    <OsTableBody
                                        data={tableData}
                                        columns={columns}
                                    />
                                ) : (
                                    <div className="py-6 text-center text-gray-500 border-b">
                                        Belum ada kompetensi untuk aspek ini.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PAGINATION */}
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
                    </div>
                </div>
                <div className="mt-8">
                    <OsCopyright />
                </div>
            </main>

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
