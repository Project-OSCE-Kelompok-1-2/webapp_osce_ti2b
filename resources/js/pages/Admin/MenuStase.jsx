import React, { useState, useMemo } from "react";
import { usePage, router, useForm } from "@inertiajs/react";
import { Edit2, Trash2, X, AlertCircle, FileText, Table2 } from "lucide-react"; // Import AlertCircle & X

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
import OsPagination from "../../components/pagination.jsx"; // Cukup satu kali import

const staseColumns = [
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
        width: "w-52 min-w-[350px] shrink-0",
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
    const itemsPerPage = 10;

    // 3. Filter Data Instan
    // [PERBAIKAN] Gunakan useEffect untuk reset page, useMemo murni untuk filter
    React.useEffect(() => {
        if (search) setCurrentPage(1);
    }, [search]);

    const filteredData = useMemo(() => {
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

    // --- 5. GENERATOR LINKS UTAMA ---
    const generatedLinks = useMemo(() => {
        if (totalPages <= 1) return []; // Return empty array if only 1 page

        const links = [];

        // A. Tombol Previous
        links.push({
            url: currentPage > 1 ? "#" : null,
            label: "&laquo; Previous",
            active: false,
            pageNumber: currentPage - 1,
        });

        // B. Tombol Angka (1, 2, 3...)
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

        // C. Tombol Next
        links.push({
            url: currentPage < totalPages ? "#" : null,
            label: "Next &raquo;",
            active: false,
            pageNumber: currentPage + 1,
        });

        return links;
    }, [currentPage, totalPages]);

    // --- Suggestion Lists ---
    const suggestMataKuliah =
        mataKuliah?.map((m) => m.nama_mata_kuliah).filter(Boolean) || [];

    const allSuggestTujuan =
        [
            ...new Set(
                tujuanPembelajaran?.map((t) => t.tujuan).filter(Boolean)
            ),
        ] || [];

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        id: null,
        nama_stase: "",
        deskripsi: "",
        id_mata_kuliah: "",
        // id_tujuan_pembelajaran: "", // Hapus jika tidak dipakai langsung (diganti array string)
        display_mata_kuliah: "",
        tujuan_pembelajaran: [], // Array string untuk menampung tujuan yang dipilih
        // display_tujuan: "", // Tidak perlu di state form utama jika hanya untuk input helper
    });

    // Filter saran agar yang SUDAH DIPILIH tidak muncul lagi di dropdown
    const availableSuggestTujuan = allSuggestTujuan.filter(
        (tujuan) => !data.tujuan_pembelajaran.includes(tujuan)
    );

    // State Lokal
    const [tujuanInput, setTujuanInput] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedName, setSelectedName] = useState("");

    // --- HANDLE FORM LOGIC ---

    const handleMataKuliahChange = (e) => {
        const val = e?.target ? e.target.value : e;
        const s = mataKuliah.find((m) => m.nama_mata_kuliah === val);
        setData((prev) => ({
            ...prev,
            display_mata_kuliah: val,
            id_mata_kuliah: s?.id_mata_kuliah || "",
        }));
    };

    // --- LOGIC MULTI SELECT TUJUAN ---
    const MAX_TUJUAN = 5;

    const handleAddTujuan = (val) => {
        const valueToAdd = val || tujuanInput;

        if (data.tujuan_pembelajaran.length >= MAX_TUJUAN) {
            alert(
                `Maksimal hanya boleh menambahkan ${MAX_TUJUAN} Tujuan Pembelajaran.`
            );
            return;
        }

        if (valueToAdd && valueToAdd.trim() !== "") {
            if (!data.tujuan_pembelajaran.includes(valueToAdd)) {
                // Update array tujuan_pembelajaran
                setData("tujuan_pembelajaran", [
                    ...data.tujuan_pembelajaran,
                    valueToAdd,
                ]);
                setTujuanInput("");
            } else {
                setTujuanInput("");
            }
        }
    };

    const removeTujuan = (indexToRemove) => {
        setData(
            "tujuan_pembelajaran",
            data.tujuan_pembelajaran.filter((_, i) => i !== indexToRemove)
        );
    };

    const handleTujuanInputChange = (e) => {
        const val = e?.target ? e.target.value : e;
        setTujuanInput(val);
    };

    const openAddModal = () => {
        setModalMode("add");
        clearErrors();
        reset();
        setTujuanInput("");
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setModalMode("edit");
        clearErrors();
        setTujuanInput("");

        const currentMK = mataKuliah.find(
            (m) => m.id_mata_kuliah === item.id_mata_kuliah
        );

        // Ambil data tujuan dari item (sesuaikan dengan format dari backend, misal array of objects)
        const rawTujuan = item.tujuan_pembelajaran || item.tujuanPembelajaran;
        const currentTujuanList = Array.isArray(rawTujuan)
            ? rawTujuan.map((t) => (typeof t === "string" ? t : t.tujuan)) // Handle jika string atau object
            : [];

        setData({
            id: item.id_stase,
            nama_stase: item.nama_stase,
            deskripsi: item.deskripsi,
            id_mata_kuliah: item.id_mata_kuliah,
            display_mata_kuliah: currentMK ? currentMK.nama_mata_kuliah : "",
            tujuan_pembelajaran: currentTujuanList,
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.id_mata_kuliah) {
            alert(
                "Mata Kuliah tidak valid. Harap pilih dari daftar yang tersedia."
            );
            return;
        }

        if (data.tujuan_pembelajaran.length === 0) {
            alert("Mohon masukkan minimal satu Tujuan Pembelajaran.");
            return;
        }

        const options = {
            onSuccess: () => {
                setShowModal(false);
                reset();
                setTujuanInput("");
            },
            preserveScroll: true,
        };

        modalMode === "edit"
            ? put(`/admin/stase/${data.id}`, options)
            : post("/admin/stase", options);
    };

    const openDeleteModal = (id, name) => {
        setSelectedId(id);
        setSelectedName(name);
        setIsDeleteOpen(true);
    };

    // [PERBAIKAN TYPO] handleConfirmDelete
    const handleConfirmDelete = () => {
        if (!selectedId) return;
        destroy(`/admin/stase/${selectedId}`, {
            preserveScroll: true,
            onSuccess: () => setIsDeleteOpen(false),
        });
    };

    // Format Data Tabel dari 'paginatedData'
    // Format Data Tabel dari 'paginatedData'
    const tableData = paginatedData.map((item, index) => ({
        // Hitung nomor urut berdasarkan halaman saat ini
        no: (currentPage - 1) * itemsPerPage + index + 1,

        nama_stase: item.nama_stase,
        // Pastikan properti ini sesuai dengan respon JSON backend
        jumlah_aspek: item.aspek_penilaian_count || item.jumlah_aspek || 0,

        action: (
            <div className="flex items-center justify-center space-x-3">
                {/* ... tombol aksi tetap sama ... */}
                <OsButton
                    name="primary"
                    onClick={() =>
                        router.get(
                            `/admin/stase/${item.id_stase}/aspek-penilaian`
                        )
                    }
                    className="h-[38px] text-os-small w-full flex justify-between items-center gap-3"
                >
                    <OsIcon name={"add"} className="os-icon-light h-[20px]" />
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
                    <Trash2 size={18} />
                </OsButton>
            </div>
        ),
    }));

    const isMataKuliahInvalid =
        data.display_mata_kuliah && !data.id_mata_kuliah;

    return (
        <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="flex flex-col w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                <OsHeader onMenuClick={handleSidebarToggle} />

                <div className="flex-1 overflow-auto">
                    <div className="flex gap-1 items-center justify-start my-2">
                        <FileText size={18} />
                        <h2 className="font-semibold text-lg">Menu Stase</h2>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                        Kelola konten Stase secara menyeluruh, termasuk daftar
                        kompetensi inti dan aspek penilaian.
                    </p>

                    <OsButton
                        name="primary"
                        onClick={openAddModal}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />
                        Tambah Stase
                    </OsButton>

                    {/* SEARCHBAR INSTAN */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        placeholder="Cari stase secara instan..."
                    />

                    <div className="flex gap-1 items-center justify-start my-2">
                        <Table2 size={18} />
                        <h2 className="font-semibold text-lg">Table Stase</h2>
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            (Total: {totalItems} data)
                        </span>
                    </div>

                    <section className="bg-white p-5 border border-os-primary overflow-x-auto rounded-xl shadow-sm">
                        <div className="min-w-max">
                            <OsTableHeader columns={staseColumns} />
                            <OsTableBody
                                data={tableData}
                                columns={staseColumns}
                            />
                            {filteredData.length === 0 && (
                                <div className="flex items-center border-t border-gray-400">
                                    <p className="w-full text-center text-sm py-6 mt-2 text-gray-500">
                                        Data tidak ditemukan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* <hr className="border-1 border-os-primary my-2" /> */}

                    {/* --- PAGINATION --- */}
                    {totalPages > 1 && (
                        <div className="mt-2">
                            <OsPagination
                                links={generatedLinks}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    )}
                </div>
                <OsCopyright />
            </main>

            {/* Modal Components */}
            <OsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                variant={modalMode}
                onClear={() => {
                    reset();
                    setTujuanInput("");
                    clearErrors();
                }}
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
                    {/* INPUT MATA KULIAH */}
                    <div>
                        <OsInput
                            label="Mata Kuliah"
                            type="suggest"
                            name="display_mata_kuliah"
                            value={data.display_mata_kuliah}
                            onChange={handleMataKuliahChange}
                            suggestions={suggestMataKuliah}
                            placeholder="Ketik untuk mencari, lalu KLIK."
                            required
                        />

                        {isMataKuliahInvalid ? (
                            <div className="flex items-start gap-1 mt-1 text-red-500">
                                <AlertCircle size={14} className="mt-0.5" />
                                <p className="text-xs">
                                    Pilihan tidak valid. Anda{" "}
                                    <b>wajib memilih</b> dari daftar saran yang
                                    muncul.
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 mt-1">
                                *Wajib memilih (klik) dari daftar saran. Tidak
                                bisa input manual.
                            </p>
                        )}

                        {errors.id_mata_kuliah && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.id_mata_kuliah}
                            </p>
                        )}
                    </div>

                    {/* INPUT MULTI SELECT TUJUAN PEMBELAJARAN */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">
                                Tujuan Pembelajaran *
                            </label>
                            {/* Counter Indikator */}
                            <span
                                className={`text-xs font-medium ${
                                    data.tujuan_pembelajaran.length >=
                                    MAX_TUJUAN
                                        ? "text-red-600"
                                        : "text-gray-500"
                                }`}
                            >
                                {data.tujuan_pembelajaran.length}/{MAX_TUJUAN}{" "}
                                Item
                            </span>
                        </div>

                        {/* LIST ITEMS (BOX STYLE) */}
                        {data.tujuan_pembelajaran.length > 0 && (
                            <div className="flex flex-col gap-2 mb-2 max-h-60 overflow-y-auto pr-1">
                                {data.tujuan_pembelajaran.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="relative flex items-start justify-between gap-3 p-3 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-700 shadow-sm hover:border-blue-400 transition-colors"
                                    >
                                        <span className="leading-snug text-justify flex-1">
                                            {item}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeTujuan(idx)}
                                            className="shrink-0 text-slate-400 hover:text-red-600 transition-colors mt-0.5"
                                            title="Hapus"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2 items-end">
                            <div className="w-full">
                                <OsInput
                                    type="suggest"
                                    name="tujuanInput"
                                    value={tujuanInput}
                                    onChange={handleTujuanInputChange}
                                    suggestions={availableSuggestTujuan}
                                    placeholder={
                                        data.tujuan_pembelajaran.length >=
                                        MAX_TUJUAN
                                            ? "Batas maksimal tercapai."
                                            : "Ketik tujuan lalu tekan Tambah..."
                                    }
                                    // Disable input jika sudah max
                                    disabled={
                                        data.tujuan_pembelajaran.length >=
                                        MAX_TUJUAN
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddTujuan();
                                        }
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleAddTujuan()}
                                // Disable tombol jika sudah max
                                disabled={
                                    data.tujuan_pembelajaran.length >=
                                    MAX_TUJUAN
                                }
                                className={`px-4 py-2 rounded h-[42px] text-sm font-medium transition-colors ${
                                    data.tujuan_pembelajaran.length >=
                                    MAX_TUJUAN
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" // Style disabled
                                        : "bg-gray-200 hover:bg-gray-300 text-gray-700" // Style normal
                                }`}
                            >
                                {data.tujuan_pembelajaran.length >= MAX_TUJUAN
                                    ? "Full"
                                    : "Tambah"}
                            </button>
                        </div>

                        {/* Pesan Helper jika kosong atau error */}
                        {errors.tujuan_pembelajaran ? (
                            <p className="text-red-500 text-xs">
                                {errors.tujuan_pembelajaran}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-400">
                                Minimal 1, Maksimal 5 tujuan pembelajaran.
                            </p>
                        )}
                    </div>

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
                onConfirm={handleConfirmDelete}
                variant="delete"
                title="Hapus Stase?"
                message="Yakin ingin menghapus?"
                confirmText="Hapus"
                dataToDelete={[{ key: "Nama", value: selectedName }]}
            />
        </div>
    );
}
