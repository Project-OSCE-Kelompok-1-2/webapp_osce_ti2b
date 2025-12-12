import React, { useState } from "react";
import { usePage, router, useForm } from "@inertiajs/react";
import { Edit2, Trash2, Plus } from "lucide-react"; // Pastikan import Plus ada

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
import OsInput from "../../components/input.jsx";
import Modals from "../../components/Modals.jsx";

// const staseColumns = [
//     {
//         key: "no",
//         content: "No",
//         width: "w-16",
//         classes: "justify-center items-center",
//     },
//     {
//         key: "nama_stase",
//         content: "Nama Stase",
//         width: "w-7/12",
//         classes: "justify-start items-center px-4",
//     },
//     {
//         key: "jumlah_aspek",
//         content: "Jumlah Aspek",
//         width: "w-2/12",
//         classes: "justify-center items-center px-4",
//     },
//     {
//         key: "action",
//         content: "Aksi",
//         width: "w-3/12",
//         classes: "justify-center items-center px-4",
//     },
// ];

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
        width: "w-[400px] flex-1 shrink-0", // Ganti w-7/12
        classes: "justify-start items-center px-4",
    },
    {
        key: "jumlah_aspek",
        content: "Jumlah Aspek",
        width: "w-32 shrink-0", // Ganti w-2/12
        classes: "justify-center items-center px-4",
    },
    {
        key: "action",
        content: "Aksi",
        width: "w-48 min-w-[300px] shrink-0", // Ganti w-3/12
        classes: "justify-center items-center px-4",
    },
];

export default function Stase() {
    const { stase, filters, mataKuliah, tujuanPembelajaran } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    // 🔥 PERBAIKAN DI SINI: Ganti 'deskripsi_tujuan' menjadi 'tujuan' sesuai Model
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
        processing,
        errors,
        reset,
        clearErrors, // Tambahkan clearErrors
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

    const handleConfirlgelete = () => {
        if (!selectedId) return;
        destroy(`/admin/stase/${selectedId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                // Tidak perlu reload manual
            },
        });
    };

    // --- HANDLE PERUBAHAN INPUT SUGGEST ---

    const handleMataKuliahChange = (e) => {
        const val = e?.target ? e.target.value : e;
        const selectedObj = mataKuliah.find((m) => m.nama_mata_kuliah === val);

        setData((prev) => ({
            ...prev,
            display_mata_kuliah: val,
            id_mata_kuliah: selectedObj ? selectedObj.id_mata_kuliah : "",
        }));
    };

    const handleTujuanChange = (e) => {
        const val = e?.target ? e.target.value : e;

        // 🔥 PERBAIKAN DI SINI: Cari berdasarkan 'tujuan'
        const selectedObj = tujuanPembelajaran.find((t) => t.tujuan === val);

        setData((prev) => ({
            ...prev,
            display_tujuan: val,
            id_tujuan_pembelajaran: selectedObj
                ? selectedObj.id_tujuan_pembelajaran
                : "",
        }));
    };

    // --- MODAL CONTROLS ---

    const openAddModal = () => {
        setModalMode("add");
        clearErrors();
        reset(); // Reset semua field termasuk display
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setModalMode("edit");
        clearErrors();

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
            display_mata_kuliah: currentMK ? currentMK.nama_mata_kuliah : "",
            // 🔥 PERBAIKAN DI SINI: Tampilkan 'tujuan' saat edit
            display_tujuan: currentTP ? currentTP.tujuan : "",
        });
        setShowModal(true);
    };

    const handleClear = () => {
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.id_mata_kuliah || !data.id_tujuan_pembelajaran) {
            alert(
                "Mohon pilih Mata Kuliah dan Tujuan Pembelajaran dari daftar saran yang tersedia."
            );
            return;
        }

        const options = {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
            preserveScroll: true,
        };

        if (modalMode === "edit") {
            put(`/admin/stase/${data.id}`, options);
        } else {
            post("/admin/stase", options);
        }
    };

    // --- TABLE RENDER ---
    const tableData = stase.data.map((item, index) => ({
        no: stase.from + index,
        nama_stase: item.nama_stase,
        // PERBAIKAN DISINI: Ubah 'item.jumlah_aspek' menjadi 'item.aspek_penilaian_count'
        jumlah_aspek: item.aspek_penilaian_count || 0,
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
                    <Trash2 size={18}/>
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

                    <div className="w-full overflow-x-auto pb-4">
                        <div className="min-w-max">
                            <OsTableHeader columns={staseColumns} />
                            <OsTableBody
                                data={tableData}
                                columns={staseColumns}
                            />

                            {stase.data.length === 0 && (
                                <div className="flex items-center border-t border-gray-400">
                                    <p className="w-full text-center text-sm py-os-48 text-gray-500">
                                        Data stase tidak ditemukan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
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
                    {/* INPUT SUGGEST: MATA KULIAH */}
                    <div>
                        <OsInput
                            label="Mata Kuliah"
                            type="suggest"
                            name="display_mata_kuliah"
                            value={data.display_mata_kuliah}
                            onChange={handleMataKuliahChange}
                            suggestions={suggestMataKuliah}
                            placeholder="Ketik atau pilih Mata Kuliah..."
                            required
                        />
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

                    {/* INPUT SUGGEST: TUJUAN PEMBELAJARAN */}
                    <div>
                        <OsInput
                            label="Tujuan Pembelajaran"
                            type="suggest"
                            name="display_tujuan"
                            value={data.display_tujuan}
                            onChange={handleTujuanChange}
                            suggestions={suggestTujuan}
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
                onConfirm={handleConfirlgelete}
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
