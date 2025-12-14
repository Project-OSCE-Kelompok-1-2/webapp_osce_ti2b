import React, { useState, useEffect, useMemo } from "react";
import { usePage, Link, router, useForm } from "@inertiajs/react";
import { Trash2, Pencil, FileText, Table2 } from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsTableHeader from "../../components/tableheader.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsButton from "../../components/button.jsx";
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/input.jsx";
import Modals from "../../components/Modals.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsPagination from "../../components/pagination.jsx";

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
        width: "w-[400px] flex-1 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "bobot_maksimum",
        content: "Bobot Maksimum",
        width: "w-32 shrink-0",
        classes: "justify-center items-center",
    },
    {
        key: "action",
        content: "Aksi",
        width: " shrink-0 min-w-[300px]",
        classes: "justify-center items-center",
    },
];

export default function MenuAspekPenilaian() {
    // 1. Ambil Data Full
    const { stase, aspek_penilaian } = usePage().props;
    const allData = Array.isArray(aspek_penilaian)
        ? aspek_penilaian
        : aspek_penilaian?.data || [];

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
                item.aspek?.toLowerCase().includes(term) ||
                item.bobot_maksimum?.toString().includes(term)
            );
        });
    }, [search, allData]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // D. Generate Links
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

    // ========= STATE FORM & MODAL ========
    const {
        data,
        setData,
        post,
        put,
        reset,
        delete: destroy,
        processing,
        errors,
        setError, // <--- 1. Tambah setError
        clearErrors, // <--- 2. Tambah clearErrors
    } = useForm({
        id: null,
        aspek: "",
        bobot_maksimum: "",
        id_stase: stase.id_stase,
    });

    const [modalMode, setModalMode] = useState("add");
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // HAPUS state errorMessage manual
    // const [errorMessage, setErrorMessage] = useState("");

    const [showFullWeightWarning, setShowFullWeightWarning] = useState(false);

    // Hitung Total Bobot saat ini (dari data DB)
    const totalBobot = allData.reduce(
        (sum, item) => sum + item.bobot_maksimum,
        0
    );

    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // --- HANDLERS ---
    const openAddModal = () => {
        if (totalBobot >= 100) {
            setShowFullWeightWarning(true);
            return;
        }
        setShowFullWeightWarning(false);
        setModalMode("add");
        setSelectedItem(null);
        clearErrors(); // Bersihkan error lama
        setData({
            id: null,
            aspek: "",
            bobot_maksimum: "",
            id_stase: stase.id_stase,
        });
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setModalMode("edit");
        setSelectedItem(item);
        clearErrors(); // Bersihkan error lama
        setData({
            id: item.id_aspek_penilaian,
            aspek: item.aspek,
            bobot_maksimum: item.bobot_maksimum,
            id_stase: stase.id_stase,
        });
        setShowModal(true);
    };

    // --- 3. LOGIC HANDLE SUBMIT (VALIDASI INLINE) ---
    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors(); // Reset error state

        let isValid = true;

        // A. Validasi Field Kosong
        if (!data.aspek || data.aspek.trim() === "") {
            setError("aspek", "Nama Aspek wajib diisi.");
            isValid = false;
        }
        if (!data.bobot_maksimum) {
            setError("bobot_maksimum", "Bobot wajib diisi.");
            isValid = false;
        }

        // B. Validasi Logika Bobot (> 100)
        const inputBobot = Number(data.bobot_maksimum) || 0;
        let projectedTotal = 0;

        if (modalMode === "add") {
            projectedTotal = totalBobot + inputBobot;
        } else if (modalMode === "edit") {
            const oldBobot = selectedItem
                ? Number(selectedItem.bobot_maksimum)
                : 0;
            projectedTotal = totalBobot - oldBobot + inputBobot;
        }

        if (isValid && projectedTotal > 100) {
            // Cek hanya jika field tidak kosong
            setError(
                "bobot_maksimum",
                `Gagal! Total bobot menjadi ${projectedTotal}. Maksimal 100 (Sisa: ${
                    100 - (projectedTotal - inputBobot)
                }).`
            );
            isValid = false;
        }

        if (!isValid) return; // Stop jika ada error

        const options = {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        };
        if (modalMode === "edit") {
            put(`/admin/aspek-penilaian/${data.id}`, options);
        } else {
            post(`/admin/stase/${stase.id_stase}/aspek-penilaian`, options);
        }
    };

    const handleClear = () =>
        setData({ ...data, aspek: "", bobot_maksimum: "" });

    const openDeleteModal = (aspekItem) => {
        setDataToDelete({
            id: aspekItem.id_aspek_penilaian,
            aspek: aspekItem.aspek,
            bobot: aspekItem.bobot_maksimum,
        });
        setIsDeleteModalOpen(true);
    };

    const handleDeleteFromEdit = () => {
        setShowModal(false);
        setDataToDelete({
            id: data.id,
            aspek: data.aspek,
            bobot: data.bobot_maksimum,
        });
        setIsDeleteModalOpen(true);
    };

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

    // --- TABLE DATA MAPPING ---
    const tableDisplayData = paginatedData.map((item, index) => ({
        id_aspek_penilaian: item.id_aspek_penilaian,
        no: (currentPage - 1) * itemsPerPage + index + 1,
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
                    <OsIcon name={"add"} className="os-icon-light h-[20px]" />{" "}
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

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                <div className="flex flex-col gap-os-8">
                    <OsHeader
                        variant="goback"
                        backLink="/admin/stase"
                        onMenuClick={handleSidebarToggle}
                    />

                    <div className="flex-1 overflow-auto">
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
                                    Total bobot sudah mencapai batas maksimum
                                    (100).
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
                                {stase.nama_stase}
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                            Halaman ini didedikasikan untuk mengatur seluruh
                            Aspek Penilaian...
                        </p>

                        <OsButton
                            name="primary"
                            onClick={openAddModal}
                            className={`flex h-[46px] items-center text-white text-sm py-2 px-4 rounded-lg mb-5 ${
                                totalBobot >= 100
                                    ? "bg-gray-400 hover:bg-gray-500"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            <OsIcon
                                name="add"
                                className="h-os-20 os-icon-light mr-os-8"
                            />{" "}
                            {totalBobot >= 100
                                ? "Bobot Penuh"
                                : "Tambah Aspek Penilaian"}
                        </OsButton>

                        {/* SEARCH INSTANT */}
                        <OsSearchBar
                            search={search}
                            setSearch={setSearch}
                            placeholder="Cari aspek penilaian secara instan..."
                        />

                        <div className="flex gap-1 items-center justify-start my-2">
                            <Table2 size={18} />
                            <h2 className="font-semibold text-lg">
                                Table Aspek Penilaian
                            </h2>
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Total: {totalItems} data)
                            </span>
                        </div>

                        <section className="bg-white p-5 border border-os-primary overflow-x-auto rounded-xl shadow-sm">
                            <div className="w-full overflow-x-auto pb-2">
                                <div className="min-w-max">
                                    <OsTableHeader columns={columns} />
                                    {tableDisplayData.length > 0 ? (
                                        <OsTableBody
                                            data={tableDisplayData}
                                            columns={columns}
                                        />
                                    ) : (
                                        <div className="py-6 mt-2 text-center text-gray-500">
                                            Belum ada aspek penilaian untuk
                                            stase ini.
                                        </div>
                                    )}
                                </div>
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

                        {/* FOOTER TOTAL BOBOT */}
                        <div className="bg-os-white rounded-lg overflow-hidden border-os-1 border-os-black mt-3 h-[56px]">
                            <table className="w-full h-[56px]">
                                <tfoot>
                                    <tr className="w-full h-full flex justify-between p-2">
                                        <td className="flex text-start items-center pl-2 flex-1">
                                            Total Bobot
                                        </td>
                                        <td className="flex px-3 text-center w-32 items-center justify-center">
                                            <span className="text-sm">
                                                Bobot:
                                            </span>
                                            <span className="text-black font-bold pl-1.5">
                                                {totalBobot}
                                            </span>
                                        </td>
                                        <td className=" px-2 hidden md:flex text-center justify-end md:w-[290px] ">
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
                        {/* Mobile Footer Indicator */}
                        {totalBobot == 100 ? (
                            <div className="bg-green-600 text-white w-full text-sm px-3 py-4 mt-3 rounded-lg inline-block md:hidden">
                                Point Seimbang (100%)
                            </div>
                        ) : (
                            totalBobot > 0 && (
                                <div className="bg-red-600 text-white w-full text-sm px-3 py-4 mt-3 rounded-lg inline-block md:hidden">
                                    Point Tidak Seimbang! ({totalBobot}%)
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="mt-8">
                    <OsCopyright />
                </div>
            </main>

            {/* MODALS */}
            <OsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                variant={modalMode}
                onSubmit={handleSubmit}
                onClear={handleClear}
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
                    {/* INPUT NAMA ASPEK */}
                    <div>
                        <OsInput
                            label="Nama Aspek Penilaian"
                            type="text"
                            name="aspek"
                            value={data.aspek}
                            onChange={(evt) => {
                                setData("aspek", evt.target.value);
                                if (errors.aspek) clearErrors("aspek"); // Hilangkan error saat mengetik
                            }}
                            placeholder="Masukkan nama aspek penilaian..."
                            // required <-- Dihapus agar custom validation jalan
                        />
                        {errors.aspek && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.aspek}
                            </p>
                        )}
                    </div>

                    {/* INPUT BOBOT MAKSIMUM */}
                    <div>
                        <OsInput
                            label="Bobot Maksimum"
                            type="number"
                            name="bobot_maksimum"
                            value={data.bobot_maksimum}
                            onChange={(evt) => {
                                setData("bobot_maksimum", evt.target.value);
                                if (errors.bobot_maksimum)
                                    clearErrors("bobot_maksimum");
                            }}
                            placeholder="Masukkan bobot..."
                            // required <-- Dihapus
                        />
                        {/* Error Message Disini */}
                        {errors.bobot_maksimum && (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {errors.bobot_maksimum}
                            </p>
                        )}
                    </div>

                    {/* HELPER TEXT UNTUK SISA BOBOT (VISUAL ONLY) */}
                    {(() => {
                        const inputVal = Number(data.bobot_maksimum) || 0;
                        const currentUsed =
                            modalMode === "edit"
                                ? totalBobot -
                                  (selectedItem
                                      ? Number(selectedItem.bobot_maksimum)
                                      : 0)
                                : totalBobot;
                        const sisa = 100 - (currentUsed + inputVal);

                        // Kita sembunyikan text helper ini jika sudah ada error merah dari 'errors.bobot_maksimum'
                        // supaya tidak double pesan, tapi terserah preferensi Anda.
                        // Di sini saya biarkan agar user tetap tahu matematikanya.
                        return (
                            <div
                                className={`text-xs ${
                                    sisa < 0
                                        ? "text-red-400" // Warna lebih soft karena error utama sudah ada di atas
                                        : "text-gray-500"
                                }`}
                            >
                                {sisa < 0 ? (
                                    <span>
                                        (Hitungan: Melebihi batas sebesar{" "}
                                        {Math.abs(sisa)} poin)
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

            <Modals
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                variant="delete"
                title="Hapus Aspek Penilaian?"
                message="Apakah Anda yakin ingin menghapus aspek penilaian ini?"
                confirmText="Hapus"
                dataToDelete={[
                    { key: "Aspek", value: dataToDelete?.aspek || "-" },
                    { key: "Bobot", value: `${dataToDelete?.bobot || 0} poin` },
                ]}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
