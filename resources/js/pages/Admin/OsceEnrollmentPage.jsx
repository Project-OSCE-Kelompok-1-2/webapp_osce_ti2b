import React, { useState } from "react";
// 1. [PERBAIKAN] Tambahkan useForm, Head, dan usePage
import { router, useForm, Head, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    Search,
    CheckSquare,
    Square,
    Save,
    XCircle,
} from "lucide-react"; // Tambah ikon

import Sidebar from "../../components/Sidebar";
import OsCopyright from "../../components/Copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";
import OsTableBody from "../../components/tablecontain.jsx";
import OsSearchBar from "../../components/searchbar.jsx";
import OsInput from "../../components/input.jsx";

const columns = [
    { key: "no", content: "No", width: "w-16", classes: "justify-center items-center" },
    {
        key: "nim_mahasiswa",
        content: "Nim Mahasiswa",
        width: "w-72",
        classes: "justify-start items-center px-4",
    },
    {
        key: "mahasiswa",
        content: "Mahasiswa",
        width: "flex-1",
        classes: "justify-start items-center px-4",
    },
    {
        key: "action",
        content: "Action",
        width: "w-48",
        classes: "justify-center items-center px-4",
    },
];

export default function OsceEnrollmentPage({
    osce,
    sesi,
    mahasiswa_list,
    filters,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [angkatan, setAngkatan] = useState(filters.angkatan || "");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Ambil flash message (untuk error)
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        id_mahasiswa_array: mahasiswa_list.data
            .filter((mhs) => mhs.is_enrolled)
            .map((mhs) => mhs.id_mahasiswa),
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            window.location.pathname,
            { search, angkatan }, // Kirim filter
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const handleCheck = (id) => {
        const { id_mahasiswa_array } = data;
        setData(
            "id_mahasiswa_array",
            id_mahasiswa_array.includes(id)
                ? id_mahasiswa_array.filter((x) => x !== id)
                : [...id_mahasiswa_array, id]
        );
    };

    const handleSave = (e) => {
        e.preventDefault();
        post(window.location.pathname, {
            preserveScroll: true,
        });
    };

    //siapin isi data tabel
    const tableData = mahasiswa_list.data.map((item, index) => ({
        no: mahasiswa_list.from + index,
        nim_mahasiswa: item.nim,
        mahasiswa: item.nama,
        action: (
            <button
                type="button"
                onClick={() => handleCheck(item.id_mahasiswa)}
                className={`flex items-center justify-center w-[36px] h-[36px] border border-gray-400 rounded-md transition-all ${
                    data.id_mahasiswa_array.includes(item.id_mahasiswa)
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
                {data.id_mahasiswa_array.includes(item.id_mahasiswa)
                    ? <CheckSquare size={16}/>
                    : <Square size={16}/>}
            </button>
        )
    }));

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            <Head title={`Enrollment - ${osce.nama_osce}`} />
            <Sidebar onToggle={setSidebarOpen} />

            <main
                className={`grid w-full h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 ${
                    sidebarOpen ? "ml-0" : "ml-20"
                }`}
            >
                {/* 9. [PERBAIKAN] Header/Breadcrumb dinamis */}
                <div className="flex items-center gap-3 text-sm text-gray-700 px-5 py-[10px] border-b border-gray-300 bg-white">
                    <button
                        onClick={() =>
                            router.visit(`/admin/osce/${osce.id_osce}/jadwal`)
                        }
                        className="bg-blue-600 text-white p-[10px] rounded-full hover:bg-blue-700 flex items-center justify-center shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex-1 border border-gray-400 rounded-lg px-4 py-[9px] text-sm font-medium bg-white leading-none">
                        OSCE / {osce.nama_osce} / Jadwal Sesi ({sesi.tanggal}) /
                        Enrollment Mahasiswa
                    </div>
                </div>

                {/* main content */}
                <div className="flex-1 overflow-auto px-8 pb-8">
                    <h2 className="font-semibold text-lg mb-2 mt-4">
                        Menu Enrollment Mahasiswa
                    </h2>
                    <p className="text-sm text-gray-600 mb-5 max-w-2xl">
                        Pilih mahasiswa yang akan mengikuti sesi ujian pada:{" "}
                        <br />
                        <strong>
                            Tanggal: {sesi.tanggal} (Pukul: {sesi.jam_mulai})
                        </strong>
                    </p>

                    {/* Notifikasi Error (jika ada) */}
                    {flash.error && (
                        <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center gap-3 mb-4">
                            <XCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{flash.error}</span>
                        </div>
                    )}

                    {/* searchbar */}
                    <OsSearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchClick={handleSearch}
                    >
                        {/* === DROPDOWN TAHUN DI TENGAH === */}
                        <div className="w-[150px]">
                            <Os_input
                                type="select"
                                value={angkatan}
                                onChange={(e) => setAngkatan(e.target.value)}
                                options={[
                                    { label: "All", value: "" },
                                    { label: "2023", value: "2023" },
                                    { label: "2024", value: "2024" },
                                    { label: "2025", value: "2025" },
                                ]}
                            />
                        </div>
                    </OsSearchBar>


                    {/* Tombol Simpan (di atas tabel) */}
                    <form onSubmit={handleSave} className="mb-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="h-[46px] px-6 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 text-sm transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save size={18} />
                            {processing
                                ? "Menyimpan..."
                                : "Simpan Perubahan Enrollment"}
                        </button>
                        {errors.id_mahasiswa_array && (
                            <div className="text-xs text-red-600 mt-1">
                                {errors.id_mahasiswa_array}
                            </div>
                        )}
                    </form>

                    {/* 11. [PERBAIKAN] Table dinamis */}
                    <h2 className="font-semibold text-lg mb-2 mt-os-8">
                        Table Mahasiswa
                    </h2>
                    <OsTableHeader columns={columns} />

                    <OsTableBody data={tableData} columns={columns} />
                    {/* Pesan Kosong */}
                    {mahasiswa_list.data.length === 0 && (
                        <div className="flex items-center border-t border-gray-400">
                            <p className="w-full text-center text-sm py-4 text-gray-500">
                                Data mahasiswa tidak ditemukan.
                            </p>
                        </div>
                    )}

                    {mahasiswa_list.links &&
                        mahasiswa_list.links.length > 3 && (
                            <div className="mt-8 border-t-4 border-black pt-4 flex justify-start">
                                <OsPagination links={mahasiswa_list.links} />
                            </div>
                        )}
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
