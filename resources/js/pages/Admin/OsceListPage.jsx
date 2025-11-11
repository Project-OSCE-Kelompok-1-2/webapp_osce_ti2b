import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import OsCopyright from "../../components/copyright";
import OsBreadCrumb from "../../components/breadcrumb";
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

export default function OsceListPage({ osce, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [tahun, setTahun] = useState(filters.tahun || "2025"); // Asumsi default

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

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data OSCE ini?")) {
            // [PERBAIKAN] Gunakan router.delete dengan URL string
            router.delete(`/admin/osce/${id}`, {
                preserveScroll: true,
            });
        }
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

                    <button
                        onClick={() => router.get("/admin/osce/create")}
                        className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm mb-4"
                    >
                        <Plus size={18} className="mr-2" />
                        Tambah OSCE
                    </button>
                </section>

                <section>
                    <h2 className="text-lg font-semibold mb-4">Table OSCE</h2>

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
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-end gap-3 max-w-[300px] w-full">
                            <select
                                className="w-full border border-black rounded-lg px-3 py-2 text-sm h-[42px] "
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)}
                            >
                                <option value="">Semua Tahun</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm w-32"
                            >
                                Cari
                            </button>
                        </div>
                    </form>

                    {/* Table */}
                    <div className="overflow-hidden border rounded-lg">
                        <table className="w-full text-sm border-collapse">
                            <tbody>
                                {osce.data.map((item, i) => (
                                    <tr
                                        key={item.id_osce}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="p-3 text-center border-r">
                                            {osce.from + i}
                                        </td>
                                        <td className="p-3 border-r">
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
                                            <button
                                                onClick={() =>
                                                    router.get(
                                                        `/admin/osce/${item.id_osce}/stase`
                                                    )
                                                }
                                                className="bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-900 transition w-28 h-[38px]"
                                            >
                                                Edit Property
                                            </button>

                                            {/* Tombol Edit: Gunakan <Link> */}
                                            <Link
                                                href={`/admin/osce/${item.id_osce}/edit`}
                                                className="border bg-black text-white rounded-lg hover:bg-gray-700 w-10 h-[38px] flex items-center justify-center"
                                            >
                                                <Edit2 size={14} />
                                            </Link>

                                            {/* Tombol Delete: Gunakan <button> */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id_osce)
                                                }
                                                className="border rounded-lg hover:bg-gray-100 text-red-600 hover:border-red-600 w-10 h-[38px] flex items-center justify-center"
                                            >
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

                    <OsPagination links={osce.links} />
                </section>

                {/* <OsCopyright/> */}
            </main>
        </div>
    );
}
