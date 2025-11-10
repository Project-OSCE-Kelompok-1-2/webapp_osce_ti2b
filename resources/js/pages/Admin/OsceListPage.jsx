import React, { useState } from "react"; // [PERBAIKAN] Import useState
import Sidebar from "../../Components/Sidebar";
import OsCopyright from "../../components/copyright";
import OsBreadCrumb from "../../components/breadcrumb";
// [PERBAIKAN] Import usePage untuk mengambil props
import { Head, router, usePage } from "@inertiajs/react";
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

// [PERBAIKAN] Terima props 'osce' dan 'filters' dari Controller Bintang
export default function OsceListPage({ osce, filters }) {
    // [PERBAIKAN] Hapus mock data 'osceList'
    // const osceList = [ ... ];

    // [PERBAIKAN] Tambahkan state untuk filter, ambil nilai dari props
    const [search, setSearch] = useState(filters.search || "");
    const [tahun, setTahun] = useState(filters.tahun || "2025"); // Asumsi default

    // [PERBAIKAN] Buat handler untuk tombol "Cari"
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.osce.index"), // Panggil route 'GET /admin/osce'
            { search, tahun }, // Kirim state filter sebagai query parameter
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <div className="min-h-screen flex bg-white">
            <Sidebar />
            <main className="flex-1 p-6 ml-[5rem]">
                <Head title="Admin OSCE" />
                <OsBreadCrumb />

                <section className="mb-1 mt-2">
                    <h2 className="text-lg font-semibold mb-1">Menu OSCE</h2>
                    <p className="text-sm text-gray-500 mb-2 max-w-2xl">
                        {/* ... (Deskripsi) ... */}
                    </p>

                    {/* [PERBAIKAN] Arahkan ke route 'create' */}
                    <button
                        onClick={() => router.get(route("admin.osce.create"))} // Asumsi route create
                        className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm mb-4"
                    >
                        <Plus size={18} className="mr-2" />
                        Tambah OSCE
                    </button>
                </section>

                <section>
                    <h2 className="text-lg font-semibold mb-4">Table OSCE</h2>

                    {/* [PERBAIKAN] Bungkus filter dengan <form> */}
                    <form
                        onSubmit={handleSearch}
                        className="flex justify-between items-center mb-4 flex-wrap gap-3 "
                    >
                        <div className="flex items-center w-full sm:w-[450px] border border-black rounded-lg px-3 py-2 ">
                            <Search size={18} className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="cari data OSCE..."
                                className="flex-1 text-sm outline-none"
                                // [PERBAIKAN] Hubungkan ke state
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-end gap-3 max-w-[300px] w-full">
                            <select
                                className="w-full border border-black rounded-lg px-3 py-2 text-sm h-[42px] "
                                // [PERBAIKAN] Hubungkan ke state
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)}
                            >
                                <option value="">Semua Tahun</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                            <button
                                type="submit" // [PERBAIKAN] Tipe submit
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm w-32"
                            >
                                Cari
                            </button>
                        </div>
                    </form>

                    {/* Table */}
                    <div className="overflow-hidden border rounded-lg">
                        <table className="w-full text-sm border-collapse">
                            {/* ... (thead Anda sudah benar) ... */}
                            <tbody>
                                {/* [PERBAIKAN] Loop data dari 'osce.data' (props) */}
                                {osce.data.map((item, i) => (
                                    <tr
                                        key={item.id_osce} // [PERBAIKAN] Gunakan ID unik
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="p-3 text-center border-r">
                                            {/* [PERBAIKAN] Gunakan 'from' untuk nomor paginasi */}
                                            {osce.from + i}
                                        </td>
                                        <td className="p-3 border-r">
                                            {/* [PERBAIKAN FATAL] Ganti key sesuai Props Contract */}
                                            <div className="font-semibold text-gray-900">
                                                {item.nama_osce}
                                            </div>
                                            <div className="text-gray-500 text-xs mt-1">
                                                {item.detail_stase} |{" "}
                                                {item.detail_mahasiswa} |{" "}
                                                {item.detail_sesi}
                                            </div>
                                        </td>
                                        <td className="p-3 border-r">
                                            {item.tanggal_mulai} -{" "}
                                            {item.tanggal_selesai}
                                        </td>
                                        <td className="p-3 border-r text-center">
                                            {item.tahun_akademik_string}
                                        </td>
                                        <td className="p-3 flex items-center justify-center gap-2">
                                            {/* [PERBAIKAN] Arahkan tombol ke halaman yang benar */}
                                            <button
                                                onClick={() =>
                                                    router.get(
                                                        `/admin/osce/${item.id_osce}/stase`
                                                    )
                                                } // Ke halaman stase (Tugas Ifad/Zian)
                                                className="bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-900 transition w-28 h-[38px]"
                                            >
                                                Edit Property
                                            </button>
                                            <button className="border bg-black text-white rounded-lg hover:bg-gray-100 w-10 h-[38px] flex items-center justify-center">
                                                <Edit2 size={14} />
                                            </button>
                                            <button className="border rounded-lg hover:bg-gray-100 w-10 h-[38px] flex items-center justify-center">
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {/* [PERBAIKAN] Tampilkan pesan jika data kosong */}
                                {osce.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="p-4 text-center text-gray-500"
                                        >
                                            Data OSCE tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* [PERBAIKAN] Kirim 'links' dari props ke pagination */}
                    <OsPagination links={osce.links} />
                </section>

                {/* <OsCopyright/> */}
            </main>
        </div>
    );
}
