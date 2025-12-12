import React, { useState, useMemo } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import { Edit2, Trash2 } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsIcon from "../../components/icons";
import OsTableHeader from "../../components/tableheader";
import OsSearchBar from "../../components/searchbar";
import OsTableBody from "../../components/tablecontain.jsx";
import OsButton from "../../components/button.jsx";
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/input.jsx";
import Modals from "../../components/Modals.jsx";
// Import Pagination yang sudah diedit tadi
import OsPagination from "../../components/pagination.jsx";

const staseColumns = [
    // ... (kolom sama seperti sebelumnya) ...
    {
        key: "no",
        content: "No",
        width: "w-16 shrink-0",
        classes: "justify-center items-center",
    },
    {
        key: "nama_stase",
        content: "Nama Stase",
        width: "w-[400px] flex-1 shrink-0",
        classes: "justify-start items-center px-4",
    },
    {
        key: "jumlah_aspek",
        content: "Jumlah Aspek",
        width: "w-32 shrink-0",
        classes: "justify-center items-center px-4",
    },
    {
        key: "action",
        content: "Aksi",
        width: "w-48 min-w-[300px] shrink-0",
        classes: "justify-center items-center px-4",
    },
];

export default function Stase() {
    // 1. Ambil data full (Array)
    const { stase, mataKuliah, tujuanPembelajaran } = usePage().props;
    const allStaseData = Array.isArray(stase) ? stase : stase?.data || [];

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

    // 2. State untuk Client-Side Logic
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Bisa diubah, misal 5 atau 20

    // 3. Filter Data Instan
    const filteredData = useMemo(() => {
        if (currentPage !== 1 && search) setCurrentPage(1); // Reset page kalau searching

        return allStaseData.filter((item) => {
            const term = search.toLowerCase();
            return (
                item.nama_stase?.toLowerCase().includes(term) ||
                item.deskripsi?.toLowerCase().includes(term)
            );
        });
    }, [search, allStaseData]);

    // 4. Pagination Data (Potong Array)
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- 5. GENERATOR LINKS UTAMA (Magic Happens Here) ---
    // Fungsi ini membuat struktur array yang dimengerti oleh OsPagination
    const generatedLinks = useMemo(() => {
        const links = [];

        // A. Tombol Previous
        links.push({
            url: currentPage > 1 ? "#" : null,
            label: "&laquo; Previous",
            active: false,
            pageNumber: currentPage - 1,
        });

        // B. Tombol Angka (1, 2, 3...)
        // Logic sederhana: Tampilkan semua halaman jika < 7, atau pakai logic ellipsis sederhana
        for (let i = 1; i <= totalPages; i++) {
            // Tampilkan halaman 1, terakhir, halaman aktif, dan tetangga halaman aktif
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
                // Tambahkan Ellipsis (...) sekali saja
                links.push({ url: null, label: "...", active: false });
            }
        }

        // C. Tombol Next
        links.push({
            url: currentPage < totalPages ? "#" : null,
            label: "Next &raquo;",
            active: false,
            pageNumber: currentPage + 1,
        });

        return links;
    }, [currentPage, totalPages]);
    // ----------------------------------------------------

    // ... (Setup Form, Modal, Handlers sama seperti sebelumnya) ...
    const suggestMataKuliah =
        tujuanPembelajaran?.map((t) => t.tujuan).filter(Boolean) || [];
    const suggestTujuan =
        tujuanPembelajaran?.map((t) => t.tujuan).filter(Boolean) || [];

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        errors,
        reset,
        clearErrors,
    } = useForm({
        id: null,
        nama_stase: "",
        deskripsi: "",
        id_mata_kuliah: "",
        id_tujuan_pembelajaran: "",
        display_mata_kuliah: "",
        display_tujuan: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedName, setSelectedName] = useState("");

    // Handlers (MataKuliahChange, Modal controls, Submit, Delete) sama persis...
    // Saya singkat agar fokus ke Pagination:

    const handleMataKuliahChange = (e) => {
        /* logic sama */ const val = e?.target ? e.target.value : e;
        const s = mataKuliah.find((m) => m.nama_mata_kuliah === val);
        setData((prev) => ({
            ...prev,
            display_mata_kuliah: val,
            id_mata_kuliah: s?.id_mata_kuliah || "",
        }));
    };
    const handleTujuanChange = (e) => {
        /* logic sama */ const val = e?.target ? e.target.value : e;
        const s = tujuanPembelajaran.find((t) => t.tujuan === val);
        setData((prev) => ({
            ...prev,
            display_tujuan: val,
            id_tujuan_pembelajaran: s?.id_tujuan_pembelajaran || "",
        }));
    };

    const openAddModal = () => {
        setModalMode("add");
        clearErrors();
        reset();
        setShowModal(true);
    };
    const openEditModal = (item) => {
        setModalMode("edit");
        clearErrors();
        const mk = mataKuliah.find(
            (m) => m.id_mata_kuliah === item.id_mata_kuliah
        );
        const tp = tujuanPembelajaran.find(
            (t) => t.id_tujuan_pembelajaran === item.id_tujuan_pembelajaran
        );
        setData({
            id: item.id_stase,
            nama_stase: item.nama_stase,
            deskripsi: item.deskripsi,
            id_mata_kuliah: item.id_mata_kuliah,
            id_tujuan_pembelajaran: item.id_tujuan_pembelajaran,
            display_mata_kuliah: mk?.nama_mata_kuliah,
            display_tujuan: tp?.tujuan,
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const opts = {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
            preserveScroll: true,
        };
        modalMode === "edit"
            ? put(`/admin/stase/${data.id}`, opts)
            : post("/admin/stase", opts);
    };

    const handleConfirlgelete = () => {
        if (selectedId)
            destroy(`/admin/stase/${selectedId}`, {
                preserveScroll: true,
                onSuccess: () => setIsDeleteOpen(false),
            });
    };
    const openDeleteModal = (id, name) => {
        setSelectedId(id);
        setSelectedName(name);
        setIsDeleteOpen(true);
    };

    // Format Data Tabel dari 'paginatedData' (Bukan allStaseData)
    const tableData = paginatedData.map((item, index) => ({
        no: (currentPage - 1) * itemsPerPage + index + 1,
        nama_stase: item.nama_stase,
        jumlah_aspek: item.jumlah_aspek || 0,
        action: (
            <div className="flex items-center justify-center space-x-3">
                <OsButton
                    name="primary"
                    onClick={() =>
                        router.get(
                            `/admin/stase/${item.id_stase}/aspek-penilaian`
                        )
                    }
                    className="h-[38px] w-full flex justify-between items-center gap-3"
                >
                    <OsIcon name={"add"} className="os-icon-light h-[20px]" />{" "}
                    Edit Aspek Penilaian
                </OsButton>
                <OsButton name="edit" onClick={() => openEditModal(item)}>
                    <Edit2 size={18} />
                </OsButton>
                <OsButton
                    name="warning"
                    onClick={() =>
                        openDeleteModal(item.id_stase, item.nama_stase)
                    }
                >
                    <Trash2 size={18} className="text-os-white" />
                </OsButton>
            </div>
        ),
    }));

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="grid w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                <OsHeader onMenuClick={handleSidebarToggle} />

                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">Menu Stase</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                        Kelola konten Stase secara menyeluruh, termasuk daftar
                        kompetensi inti.
                    </p>

                    <OsButton
                        name="primary"
                        onClick={openAddModal}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />{" "}
                        Tambah Stase
                    </OsButton>

                    {/* SEARCHBAR INSTAN */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        placeholder="Cari stase secara instan..."
                    />

                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Stase
                    </h2>

                    <div className="w-full overflow-x-auto pb-4">
                        <div className="min-w-max">
                            <OsTableHeader columns={staseColumns} />
                            <OsTableBody
                                data={tableData}
                                columns={staseColumns}
                            />

                            {filteredData.length === 0 && (
                                <div className="flex items-center border-t border-gray-400">
                                    <p className="w-full text-center text-sm py-os-48 text-gray-500">
                                        Data tidak ditemukan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- IMPLEMENTASI PAGINATION DESIGN LAMA UNTUK DATA BARU --- */}
                    {totalPages > 1 && (
                        <OsPagination
                            links={generatedLinks}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    )}
                    {/* ----------------------------------------------------------- */}
                </div>
                <OsCopyright />
            </main>

            {/* Modal Components (Sama) */}
            <OsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                variant={modalMode}
                onClear={() => reset()}
                onSubmit={handleSubmit}
                title={
                    modalMode === "edit" ? "Edit Stase" : "Tambah Stase Baru"
                }
                subtitle={
                    modalMode === "edit"
                        ? "Ubah data stase"
                        : "Isi form di bawah"
                }
            >
                <div className="space-y-4">
                    <OsInput
                        label="Mata Kuliah"
                        type="suggest"
                        name="display_mata_kuliah"
                        value={data.display_mata_kuliah}
                        onChange={handleMataKuliahChange}
                        suggestions={suggestMataKuliah}
                        required
                    />
                    <OsInput
                        label="Tujuan Pembelajaran"
                        type="suggest"
                        name="display_tujuan"
                        value={data.display_tujuan}
                        onChange={handleTujuanChange}
                        suggestions={suggestTujuan}
                        required
                    />
                    <OsInput
                        label="Nama Stase"
                        type="text"
                        name="nama_stase"
                        value={data.nama_stase}
                        onChange={(e) => setData("nama_stase", e.target.value)}
                        required
                    />
                    <OsInput
                        label="Deskripsi"
                        type="textarea"
                        name="deskripsi"
                        value={data.deskripsi}
                        onChange={(e) => setData("deskripsi", e.target.value)}
                    />
                </div>
            </OsModal>

            <Modals
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirlgelete}
                variant="delete"
                title="Hapus Stase?"
                message="Yakin ingin menghapus?"
                confirmText="Hapus"
                dataToDelete={[{ key: "Nama", value: selectedName }]}
            />
        </div>
    );
}
