import React, { useState } from "react";
import { usePage, router, useForm } from "@inertiajs/react";
import { Edit2, Trash2 } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsIcon from "../../components/icons";
import OsTableHeader from "../../components/tableheader";
import OsSearchBar from "../../components/searchbar";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsButton from "../../components/button.jsx";
import OsModal from "../../components/Modal.jsx";
import OsInput from "../../components/Input.jsx";
import Modals from "../../components/Modals.jsx";

const staseColumns = [
    {
        key: "no",
        content: "No",
        width: "w-16",
        classes: "justify-center items-center",
    },
    {
        key: "nama_stase",
        content: "Nama Stase",
        width: "w-7/12",
        classes: "justify-start items-center px-4",
    },
    {
        key: "jumlah_aspek",
        content: "Jumlah Aspek",
        width: "w-2/12",
        classes: "justify-center items-center px-4",
    },
    {
        key: "action",
        content: "Aksi",
        width: "w-3/12",
        classes: "justify-center items-center px-4",
    },
];

export default function Stase() {
    // 1. AMBIL DATA DARI PROPS
    const { stase, filters, mataKuliah, tujuanPembelajaran } = usePage().props;

    // 2. SIAPKAN LIST UNTUK SUGGESTIONS (Hanya ambil Namanya saja)
    // Gunakan '|| []' untuk mencegah error jika data undefined
    const suggestMataKuliah = mataKuliah?.map((m) => m.nama_mata_kuliah) || [];

    // 🔥 PERBAIKAN: Pastikan mapping ke kolom yang benar (misal: deskripsi_tujuan)
    // Cek database Anda, apakah kolomnya 'deskripsi_tujuan', 'tujuan', atau 'nama_tujuan'?
    // Di sini saya asumsikan 'deskripsi_tujuan' berdasarkan kode sebelumnya.
    const suggestTujuan =
        tujuanPembelajaran?.map((t) => t.deskripsi_tujuan) || [];

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
        nama_stase: "",
        deskripsi: "",

        // DATA INTI (Yg dikirim ke DB)
        id_mata_kuliah: "",
        id_tujuan_pembelajaran: "",

        // DATA TAMPILAN (Yg muncul di Input Suggest)
        display_mata_kuliah: "",
        display_tujuan: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [search, setSearch] = useState(filters.search || "");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedName, setSelectedName] = useState("");

    const handleSearch = () => {
        router.get(
            "/admin/stase",
            { search },
            { preserveState: true, replace: true }
        );
    };

    const openDeleteModal = (id, name) => {
        setSelectedId(id);
        setSelectedName(name);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedId) return;
        destroy(`/admin/stase/${selectedId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                router.reload({ only: ["stase"] });
            },
        });
    };

    // --- HANDLE PERUBAHAN INPUT SUGGEST ---

    // Fungsi Khusus: Saat Mata Kuliah diketik/dipilih
    const handleMataKuliahChange = (e) => {
        const val = e.target.value; // Nilai teks (nama)

        // 1. Cari Object Mata Kuliah yang namanya cocok dengan inputan
        const selectedObj = mataKuliah.find((m) => m.nama_mata_kuliah === val);

        setData((prev) => ({
            ...prev,
            display_mata_kuliah: val, // Update Teks di Input
            id_mata_kuliah: selectedObj ? selectedObj.id_mata_kuliah : "", // Update ID (Hidden)
        }));
    };

    // Fungsi Khusus: Saat Tujuan Pembelajaran diketik/dipilih
    const handleTujuanChange = (e) => {
        const val = e.target.value; // Nilai teks (deskripsi)

        // Cari berdasarkan kolom yang sesuai (deskripsi_tujuan)
        const selectedObj = tujuanPembelajaran.find(
            (t) => t.deskripsi_tujuan === val
        );

        setData((prev) => ({
            ...prev,
            display_tujuan: val, // Update Teks di Input
            id_tujuan_pembelajaran: selectedObj
                ? selectedObj.id_tujuan_pembelajaran
                : "", // Update ID (Hidden)
        }));
    };

    // --- MODAL CONTROLS ---

    const openAddModal = () => {
        setModalMode("add");
        setData({
            id: null,
            nama_stase: "",
            deskripsi: "",
            id_mata_kuliah: "",
            id_tujuan_pembelajaran: "",
            display_mata_kuliah: "", // Reset tampilan kosong
            display_tujuan: "", // Reset tampilan kosong
        });
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setModalMode("edit");

        // Cari Nama berdasarkan ID untuk ditampilkan di input suggest
        const currentMK = mataKuliah.find(
            (m) => m.id_mata_kuliah === item.id_mata_kuliah
        );
        const currentTP = tujuanPembelajaran.find(
            (t) => t.id_tujuan_pembelajaran === item.id_tujuan_pembelajaran
        );

        setData({
            id: item.id_stase,
            nama_stase: item.nama_stase || "",
            deskripsi: item.deskripsi || "",
            id_mata_kuliah: item.id_mata_kuliah,
            id_tujuan_pembelajaran: item.id_tujuan_pembelajaran,
            // Isi tampilan input dengan Nama yang ditemukan
            display_mata_kuliah: currentMK ? currentMK.nama_mata_kuliah : "",
            display_tujuan: currentTP ? currentTP.deskripsi_tujuan : "",
        });
        setShowModal(true);
    };

    const handleClear = () => {
        setData({
            id: null,
            nama_stase: "",
            deskripsi: "",
            id_mata_kuliah: "",
            id_tujuan_pembelajaran: "",
            display_mata_kuliah: "",
            display_tujuan: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi Manual: Pastikan User memilih item yang valid (ID terisi)
        if (!data.id_mata_kuliah || !data.id_tujuan_pembelajaran) {
            alert(
                "Mohon pilih Mata Kuliah dan Tujuan Pembelajaran dari daftar saran yang tersedia."
            );
            return;
        }

        if (modalMode === "edit") {
            put(`/admin/stase/${data.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    router.reload({ only: ["stase"] });
                },
            });
        } else {
            post("/admin/stase", {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    router.reload({ only: ["stase"] });
                },
            });
        }
    };

    const tableData = stase.data.map((item, index) => ({
        no: stase.from + index,
        nama_stase: item.nama_stase,
        jumlah_aspek: item.aspek_penilaian_count,
        action: (
            <div className="flex items-center justify-center space-x-3">
                <OsButton
                    name="primary"
                    onClick={() =>
                        router.get(
                            `/admin/stase/${item.id_stase}/aspek-penilaian`
                        )
                    }
                    className="h-[38px] text-os-small w-full flex justify-between items-center gap-3"
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
            <Sidebar />
            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 md:ml-20">
                <OsHeader />
                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">Menu Stase</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                        Kelola konten Stase secara menyeluruh, termasuk daftar
                        kompetensi inti yang diujikan serta aspek penilaian.
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

                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari stase..."
                    />
                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Stase
                    </h2>
                    <OsTableHeader columns={staseColumns} />
                    <OsTableBody data={tableData} columns={staseColumns} />

                    {stase.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-os-48 text-gray-500">
                                Data stase tidak ditemukan.
                            </p>
                        </div>
                    )}
                    {stase.links?.length > 0 && (
                        <OsPagination links={stase.links} />
                    )}
                </div>
                <OsCopyright />
            </main>

            {/* MODAL ADD/EDIT STASE */}
            <OsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                variant={modalMode}
                onClear={handleClear}
                onSubmit={handleSubmit}
                title={
                    modalMode === "edit" ? "Edit Stase" : "Tambah Stase Baru"
                }
                subtitle={
                    modalMode === "edit"
                        ? `Ubah data stase: ${data.nama_stase}`
                        : "Isi form di bawah untuk menambahkan stase baru."
                }
            >
                <div className="space-y-4">
                    {/* 🔥 INPUT SUGGEST: MATA KULIAH */}
                    <div>
                        <OsInput
                            label="Mata Kuliah"
                            type="suggest"
                            name="display_mata_kuliah" // Gunakan field Display
                            value={data.display_mata_kuliah}
                            onChange={handleMataKuliahChange} // Gunakan handler khusus
                            suggestions={suggestMataKuliah} // List Nama Mata Kuliah
                            placeholder="Ketik atau pilih Mata Kuliah..."
                            required
                        />
                        {/* Debugging (Optional): Tampilkan error jika ID tidak ditemukan */}
                        {data.display_mata_kuliah && !data.id_mata_kuliah && (
                            <p className="text-red-500 text-xs mt-1">
                                Mata kuliah tidak ditemukan di database.
                            </p>
                        )}
                        {errors.id_mata_kuliah && (
                            <p className="text-red-500 text-xs">
                                {errors.id_mata_kuliah}
                            </p>
                        )}
                    </div>

                    {/* 🔥 INPUT SUGGEST: TUJUAN PEMBELAJARAN */}
                    <div>
                        <OsInput
                            label="Tujuan Pembelajaran"
                            type="suggest"
                            name="display_tujuan" // Gunakan field Display
                            value={data.display_tujuan}
                            onChange={handleTujuanChange} // Gunakan handler khusus
                            suggestions={suggestTujuan} // List Nama Tujuan
                            placeholder="Ketik atau pilih Tujuan..."
                            required
                        />
                        {data.display_tujuan &&
                            !data.id_tujuan_pembelajaran && (
                                <p className="text-red-500 text-xs mt-1">
                                    Tujuan pembelajaran tidak ditemukan.
                                </p>
                            )}
                        {errors.id_tujuan_pembelajaran && (
                            <p className="text-red-500 text-xs">
                                {errors.id_tujuan_pembelajaran}
                            </p>
                        )}
                    </div>

                    <OsInput
                        label="Nama Stase"
                        type="text"
                        name="nama_stase"
                        value={data.nama_stase}
                        onChange={(e) => setData("nama_stase", e.target.value)}
                        placeholder="Masukkan Nama Stase..."
                        required
                    />

                    <OsInput
                        label="Deskripsi"
                        type="textarea"
                        name="deskripsi"
                        value={data.deskripsi}
                        onChange={(e) => setData("deskripsi", e.target.value)}
                        placeholder="Masukkan Deskripsi..."
                    />

                    {(errors.nama_stase || errors.deskripsi) && (
                        <div className="text-red-600 text-xs space-y-1">
                            {errors.nama_stase && <p>{errors.nama_stase}</p>}
                            {errors.deskripsi && <p>{errors.deskripsi}</p>}
                        </div>
                    )}
                </div>
            </OsModal>

            <Modals
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                variant="delete"
                title="Hapus Stase?"
                message="Apakah Anda yakin ingin menghapus stase ini?"
                confirmText="Hapus"
                dataToDelete={[
                    { key: "Nama Stase", value: selectedName || "-" },
                ]}
            />
        </div>
    );
}
