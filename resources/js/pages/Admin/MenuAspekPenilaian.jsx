import React, { useState, useEffect, useMemo } from "react"; // [1] Tambah useEffect & useMemo
import { usePage, Link, router, useForm } from "@inertiajs/react";
import { Trash2, Pencil } from "lucide-react";

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
import OsPagination from "../../components/pagination.jsx"; // Jangan lupa import Pagination

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
    const { stase, aspek_penilaian, filters } = usePage().props;
    const allData = Array.isArray(aspek_penilaian)
        ? aspek_penilaian
        : aspek_penilaian?.data || [];

    // 2. State Filter & Pagination
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- INSTANT FILTER LOGIC ---

    // A. Reset Page
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // B. Filter Data
    const filteredData = useMemo(() => {
        return allData.filter((item) => {
            const term = search.toLowerCase();
            return (
                item.aspek?.toLowerCase().includes(term) ||
                item.bobot_maksimum?.toString().includes(term)
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

    // ========= STATE FORM & MODAL (Sama seperti sebelumnya) ========
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

    const [modalMode, setModalMode] = useState("add");
    const [showModal, setShowModal] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // --- HANDLERS ---
    const openAddModal = () => {
        setModalMode("add");
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
        setData({
            id: item.id_aspek_penilaian,
            aspek: item.aspek,
            bobot_maksimum: item.bobot_maksimum,
            id_stase: stase.id_stase,
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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

    // --- TABLE DATA MAPPING (Gunakan 'paginatedData') ---
    const totalBobot = allData.reduce(
        (sum, item) => sum + item.bobot_maksimum,
        0
    );

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

            <main className="flex flex-col w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 items-center justify-center  lg:ml-20">
                <OsHeader
                    variant="goback"
                    backLink="/admin/stase"
                    onMenuClick={handleSidebarToggle}
                />

                <section className="lg:w-10/12 w-full">
                    <div className="flex-1 overflow-auto">
                        <h2 className="font-semibold text-lg mb-1">
                            {stase.nama_stase}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                            Halaman ini didedikasikan untuk mengatur seluruh
                            Aspek Penilaian...
                        </p>

                        {totalBobot == 100 ? (
                            <OsButton
                                name="secondary"
                                className="flex h-[46px] items-center !bg-white border border-os-primary !text-os-secondary text-sm py-2 px-4 rounded-lg mb-5 hover:bg-gray-700 !scale-100 !pointer-events-none"
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
                                />{" "}
                                Tambah Aspek Penilaian
                            </OsButton>
                        )}

                        {/* SEARCH INSTANT */}
                        <OsSearchBar
                            search={search}
                            setSearch={setSearch}
                            placeholder="Cari aspek penilaian..."
                        />

                        <h2 className="font-semibold text-lg mb-2 mt-os-8">
                            Table Aspek Penilaian
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Total: {totalItems} data)
                            </span>
                        </h2>

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
                                        Belum ada aspek penilaian untuk stase
                                        ini.
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="border-1 border-os-primary my-2" />

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

                    <div className="mt-2">
                        <OsCopyright />
                    </div>
                </section>
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
