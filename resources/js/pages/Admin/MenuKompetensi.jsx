import React, { useState, useEffect, useMemo } from "react";
import { usePage, router, useForm } from "@inertiajs/react";
import { Pencil, Trash2, FileText, Table2 } from "lucide-react";

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
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filteredData = useMemo(() => {
        return allData.filter((item) => {
            const term = search.toLowerCase();
            return (
                item.kompetensi?.toLowerCase().includes(term) ||
                item.bobot?.toString().includes(term)
            );
        });
    }, [search, allData]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

    // Ambil bobot maksimum dari aspek (default 100 jika tidak ada)
    const maxBobot = Number(aspek.bobot_maksimum || 100);

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
        errors, // 1. Tambah errors
        setError, // 2. Tambah setError
        clearErrors, // 3. Tambah clearErrors
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
    // Hapus manual error message state
    // const [errorMessage, setErrorMessage] = useState("");

    const [showFullWeightWarning, setShowFullWeightWarning] = useState(false);

    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // --- HANDLERS ---
    const openAddModal = () => {
        if (totalBobot >= maxBobot) {
            setShowFullWeightWarning(true);
            return;
        }
        setShowFullWeightWarning(false);
        setModalType("add");
        clearErrors(); // Reset error saat buka modal
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
        clearErrors(); // Reset error saat buka modal
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
        clearErrors();
    };

    // --- LOGIC VALIDASI & SUBMIT ---
    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors(); // Bersihkan error lama

        let isValid = true;

        // A. Validasi Field Kosong
        if (!data.kompetensi || data.kompetensi.trim() === "") {
            setError("kompetensi", "Deskripsi kompetensi wajib diisi.");
            isValid = false;
        }
        if (!data.bobot) {
            setError("bobot", "Bobot wajib diisi.");
            isValid = false;
        }

        // B. Validasi Logic Bobot
        const inputBobot = Number(data.bobot) || 0;
        let projectedTotal = 0;

        if (modalType === "add") {
            projectedTotal = totalBobot + inputBobot;
        } else if (modalType === "edit") {
            const oldBobot = selected ? Number(selected.bobot) : 0;
            projectedTotal = totalBobot - oldBobot + inputBobot;
        }

        // Cek hanya jika field bobot tidak kosong
        if (data.bobot && projectedTotal > maxBobot) {
            setError(
                "bobot",
                `Gagal! Total bobot menjadi ${projectedTotal}. Maksimal ${maxBobot}.`
            );
            isValid = false;
        }

        if (!isValid) return; // Stop jika ada error

        // C. Eksekusi Submit
        if (modalType === "add") {
            post(
                `/admin/aspek-penilaian/${aspek.id_aspek_penilaian}/kompetensi`,
                {
                    onSuccess: () => {
                        setModalOpen(false);
                        reset();
                    },
                }
            );
        } else if (modalType === "edit") {
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

    // --- TABLE DATA MAPPING ---
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
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader
                        variant="goback"
                        backLink={backUrl}
                        onMenuClick={handleSidebarToggle}
                    />

                    <div className="flex-1 overflow-auto p-1">
                        {showFullWeightWarning && (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                role="alert"
                            >
                                <strong className="font-bold">
                                    Perhatian!
                                </strong>
                                <span className="block sm:inline">
                                    {" "}
                                    Total bobot sudah mencapai batas maksimum (
                                    {maxBobot}). Tidak dapat menambah kompetensi
                                    lagi.
                                </span>
                                <span
                                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                                    onClick={() =>
                                        setShowFullWeightWarning(false)
                                    }
                                >
                                    <svg
                                        className="fill-current h-6 w-6 text-red-500"
                                        role="button"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <title>Close</title>
                                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                    </svg>
                                </span>
                            </div>
                        )}
                        <div className="flex gap-1 items-center justify-start my-2">
                            <FileText size={18} />
                            <h2 className="font-semibold text-lg">
                                {aspek.aspek}
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                            Kelola dan definisikan poin-poin kompetensi
                            (sub-kriteria) yang spesifik dan terukur untuk Aspek
                            Penilaian.
                        </p>

                        <OsButton
                            name="primary"
                            onClick={openAddModal}
                            className={`flex h-[46px] items-center text-white text-sm py-2 px-4 rounded-lg mb-5 ${
                                totalBobot >= maxBobot
                                    ? "bg-gray-400 hover:bg-gray-500"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            <OsIcon
                                name="add"
                                className="h-[18px] os-icon-light mr-os-8"
                            />
                            {totalBobot >= maxBobot
                                ? "Bobot Penuh"
                                : "Tambah Kompetensi"}
                        </OsButton>

                        {/* SEARCH INSTANT */}
                        <OsSearchBar
                            search={search}
                            setSearch={setSearch}
                            placeholder="Cari kompetensi secara instan..."
                        />

                        <div className="flex gap-1 items-center justify-start my-2">
                            <Table2 size={18} />
                            <h2 className="font-semibold text-lg">
                                Tabel Kompetensi{" "}
                            </h2>
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Total: {totalItems} data)
                            </span>
                        </div>

                        <section className="bg-white p-5 border border-os-primary overflow-x-auto rounded-xl shadow-sm">
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
                        </section>

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
                <div className="">
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
                    {/* INPUT DESKRIPSI KOMPETENSI */}
                    <div>
                        <OsInput
                            label="Deskripsi Kompetensi"
                            type="textarea"
                            name="kompetensi"
                            value={data.kompetensi}
                            placeholder="Masukkan deskripsi kompetensi..."
                            onChange={(e) => {
                                setData("kompetensi", e.target.value);
                                if (errors.kompetensi)
                                    clearErrors("kompetensi");
                            }}
                            // required <-- Hapus agar validasi custom jalan
                        />
                        {errors.kompetensi && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.kompetensi}
                            </p>
                        )}
                    </div>

                    {/* INPUT BOBOT */}
                    <div>
                        <OsInput
                            label="Bobot Kompetensi"
                            type="number"
                            name="bobot"
                            value={data.bobot}
                            placeholder="Masukkan bobot kompetensi..."
                            onChange={(e) => {
                                setData("bobot", e.target.value);
                                if (errors.bobot) clearErrors("bobot");
                            }}
                            // required <-- Hapus
                        />
                        {errors.bobot && (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {errors.bobot}
                            </p>
                        )}
                    </div>

                    {/* HELPER TEXT UNTUK SISA BOBOT */}
                    {(() => {
                        const inputVal = Number(data.bobot) || 0;
                        const currentUsed =
                            modalType === "edit"
                                ? totalBobot -
                                  (selected ? Number(selected.bobot) : 0)
                                : totalBobot;
                        const sisa = maxBobot - (currentUsed + inputVal);

                        return (
                            <div
                                className={`text-xs ${
                                    sisa < 0 ? "text-red-400" : "text-gray-500"
                                }`}
                            >
                                {sisa < 0 ? (
                                    <span>
                                        (Hitungan: Melebihi batas maksimum
                                        sebesar {Math.abs(sisa)}!)
                                    </span>
                                ) : (
                                    <>
                                        Sisa bobot yang tersedia:{" "}
                                        <span className="font-bold">
                                            {sisa}
                                        </span>
                                    </>
                                )}
                            </div>
                        );
                    })()}
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
