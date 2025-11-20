import React, { useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/Copyright.jsx";
import OsButton from "../../components/button.jsx";
import OsIcon from "../../components/icons";
import OsInput from "../../components/input.jsx";
// [PERBAIKAN] Import OsModal dan Modals
import OsModal from "../../components/Modal.jsx";
// [PERBAIKAN] Import usePage untuk mengambil props
import { Head, router, usePage, Link } from "@inertiajs/react";
import OsPagination from "../../components/pagination";
import {
    Home,
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Copyright,
} from "lucide-react";
import OsTableHeader from "../../components/tableheader.jsx";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import Os_input from "../../components/Input.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/copyright.jsx";
import OsButton from "../../components/button.jsx";


//Definisi kolom tabel 
const columns = [
    { content: "No", width: "w-16", classes: "justify-center items-center", key: "no" },
    { content: "Nama OSCE", width: "flex-1", classes: "justify-start px-4", key: "nama" },
    { content: "Rentang Tanggal", width: "w-48", classes: "justify-center", key: "tanggal" },
    { content: "Tahun Akademik", width: "w-32", classes: "justify-center", key: "tahun" },
    { content: "Aksi", width: "w-[240px]", classes: "justify-center", key: "aksi" },
];

// 🔥 Import komponen Modals (untuk delete)
import Modals from "../../components/Modals.jsx";

export default function OsceListPage({ osce, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [tahun, setTahun] = useState(filters.tahun || "2025");
    // const [showModal, setShowModal] = useState(false); // 🔥 Hapus state lama, ganti dengan state khusus add/edit

    // 🔥 STATE MODAL BARU
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState(null); // Data OSCE yang akan diedit

    // 🔥 STATE MODAL DELETE
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedOsce, setSelectedOsce] = useState(null);

    // 🔥 STATE DATA FORM (untuk Add dan Edit)
    const initialFormState = {
        nama_osce: "",
        tahun_akademik: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
    };
    const [formData, setFormData] = useState(initialFormState);


    const handleSearch = (e) => {
        e.preventDefault();
        // [PERBAIKAN] Ganti route() dengan URL string
        router.get(
            "/admin/osce", // <-- Endpoint GET
            { search, tahun },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // 🔥 FUNGSI BARU: Membuka modal edit
    const openEditModal = (item) => {
        setEditData(item);
        setFormData({
            nama_osce: item.nama_osce,
            tahun_akademik: item.tahun_akademik, // Asumsi ada prop tahun_akademik di item
            tanggal_mulai: item.tanggal_mulai,
            tanggal_selesai: item.tanggal_selesai,
        });
        setIsEditOpen(true);
    };

    // 🔥 FUNGSI BARU: Membuka modal delete
    const openDeleteModal = (item) => {
        setSelectedId(item.id_osce);
        setSelectedOsce(item);
        setIsDeleteOpen(true);
    };

    // 🔥 FUNGSI BARU: Konfirmasi hapus (menggantikan logika confirm lama)
    const handleConfirmDelete = () => {
        if (selectedId) {
            // [PERBAIKAN] Gunakan router.delete dengan URL string
            router.delete(`/admin/osce/${selectedId}`, {
                preserveScroll: true,
                onFinish: () => {
                    setIsDeleteOpen(false); // Tutup modal setelah selesai
                    setSelectedId(null);
                    setSelectedOsce(null);
                },
            });
        }
    };


    // 1. Siapin isi data tabel 
    const rows = osce.data.map((item, i) => ({
        no: osce.from + i,
        nama: (
            <div className="flex flex-col items-start leading-tight">
                <div className="font-semibold leading-tight">{item.nama_osce}</div>
                <div className="text-xs text-gray-500 leading-tight">
                    {item.detail_stase} | {item.detail_mahasiswa} | {item.detail_sesi}
                </div>
            </div>
        ),
                
        tanggal: (
            <div className="h-full flex items-center justify-center">
                {item.tanggal_mulai} - {item.tanggal_selesai}
            </div>
        ),
        tahun: (
            <div className="h-full flex items-center justify-center">
                {item.tahun_akademik_string}
            </div>
        ),
        
            aksi: (
                <div className="flex flex-wrap gap-2 justify-center items-center min-w-[220px]">
                    <OsButton
                        name="primary"
                        onClick={() => router.get(`/admin/osce/${item.id_osce}/stase`)}
                        className="min-w-[110px]"
                    >
                        Edit Property
                    </OsButton>
            
                    <OsButton
                        name="edit"
                        onClick={() => router.get(`/admin/osce/${item.id_osce}/edit`)}
                        className="p-1.5 text-black bg-white hover:bg-red-600 hover:text-white
                                   border border-black rounded-lg"
                    >
                        <Edit2 size={14} />
                    </OsButton>
            
                    <OsButton
                        name="warning"
                        onClick={() => handleDelete(item.id_osce)}
                        className="p-1.5 text-black bg-white hover:bg-red-600 hover:text-white
                                   border border-black rounded-lg"
                    >
                        <Trash2 size={14} />
                    </OsButton>
                </div>
            )
            
              
    }));
    // 🔥 FUNGSI BARU: Submit form Add/Edit
    const handleAddSubmit = (e) => {
        e.preventDefault();
        // Implementasi logika submit untuk Tambah data OSCE
        console.log("Submit Tambah OSCE:", formData);
        // Contoh: router.post("/admin/osce", formData, { onFinish: () => setIsAddOpen(false) });
        // Untuk saat ini, hanya log dan tutup modal
        setIsAddOpen(false);
        setFormData(initialFormState);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        // Implementasi logika submit untuk Edit data OSCE
        console.log(`Submit Edit OSCE ID ${editData.id_osce}:`, formData);
        // Contoh: router.put(`/admin/osce/${editData.id_osce}`, formData, { onFinish: () => setIsEditOpen(false) });
        // Untuk saat ini, hanya log dan tutup modal
        setIsEditOpen(false);
        setFormData(initialFormState);
    };

    const handleClearForm = () => {
        setFormData(initialFormState);
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />
            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                <OsHeader />
                <div className="flex-1 overflow-auto">
                    <h2 className="font-semibold text-lg mb-1">Menu OSCE</h2>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                        Halaman OSCE digunakan untuk mengelola daftar OSCE,
                        termasuk pencarian data, filter tahun akademik, serta
                        pengaturan properti seperti stase, sesi, dan mahasiswa
                        yang terlibat.
                    </p>

                    <OsButton
                        // onClick={() => router.get("/admin/stase/create")}
                        onClick={() => {
                            setFormData(initialFormState); // Reset form
                            setIsAddOpen(true); // Buka modal add
                        }}
                        className="flex h-[46px] items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg mb-5 hover:bg-blue-700"
                    >
                        <OsIcon
                            name="add"
                            className="h-os-20 os-icon-light mr-os-8"
                        />
                        Tambah OSCE
                    </OsButton>

                    <section>
                        <h2 className="text-lg font-semibold mb-4">
                            Table OSCE
                        </h2>

                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                        placeholder="Cari data OSCE..."
                    >
                        {/* Dropdown / filter di tengah (slot children) */}
                        <Os_input
                            type="select"
                            label=""
                            options={[
                                { label: "Semua Tahun", value: "" },
                                { label: "2025", value: "2025" },
                                { label: "2024", value: "2024" },
                                { label: "2023", value: "2023" },
                            ]}
                            value={tahun}
                            onChange={(e) => setTahun(e.target.value)}
                            className="w-[140px]"
                        />
                    </OsSearchBar>


                    {/* Table */}
                    <OsTableHeader columns={columns} />
                    <OsTableBody data={rows} columns={columns} />

                               
                    {/* Pesan jika data kosong */}
                    {osce.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-300">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data OSCE tidak ditemukan.
                            </p>
                        </div>
                    )}


                    {/* Pagination */}
                    {osce.links && osce.links.length > 0 && (
                    <div className="mt-8">
                        <OsPagination links={osce.links} />
                    </div>
                )}
       
                </section>

                {/* footer */}
                <footer className="mt-auto pt-6 border-t border-gray-200">
                    <OsCopyright />
                 </footer>
            </main>
        </div>
    );
}

// Catatan: Definisi OsModal yang Anda berikan di awal sudah benar dan TIDAK PERLU diulang di sini.
// Saya hanya menampilkan implementasi OsceListPage yang sudah diperbarui.
