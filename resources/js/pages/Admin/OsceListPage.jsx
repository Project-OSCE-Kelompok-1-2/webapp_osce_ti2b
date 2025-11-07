import React from "react";
import Sidebar from "../../Components/Sidebar"
import OsCopyright from "../../components/copyright";
import OsBreadCrumb from "../../components/breadcrumb";
import { Head, router } from "@inertiajs/react";
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

export default function AdminOsce() {
    const osceList = [
        {
            nama: "OSCE Radiologi 01-A",
            stase: 15,
            mahasiswa: 135,
            sesi: 2,
            rentang_tanggal: "Fri 01-01-2010 6:00 - Fri 01-01-2010 6:00",
            tahun: 2025,
        },
    ];

    return (
        <div className="min-h-screen flex bg-white">
            {/* Sidebar kosong */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 ml-[5rem]">
                <Head title="Admin OSCE" />

                {/* Header */}
             
                <OsBreadCrumb />

                {/* Menu OSCE */}
                <section className="mb-1 mt-2">
                    <h2 className="text-lg font-semibold mb-1">Menu OSCE</h2>
                    <p className="text-sm text-gray-500 mb-2 max-w-2xl">
                        Jorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nunc vulputate libero et velit interdum, ac aliquet odio
                        mattis.
                    </p>

                    {/* Tombol Tambah OSCE */}
                    <button
                        onClick={() => router.visit("/tambahosce")}
                        className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm mb-4"
                    >
                        <Plus size={18} className="mr-2" />
                        Tambah OSCE
                    </button>
                </section>

                {/* Table OSCE */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">Table OSCE</h2>

                    {/* Filter Bar */}
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-3 ">
                        <div className="flex items-center w-full sm:w-[450px] border border-black  rounded-lg px-3 py-2 ">
                            <Search size={18} className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="cari data OSCE..."
                                className="flex-1 text-sm outline-none"
                            />
                        </div>
                        <div className="flex items-center justify-end gap-3 max-w-[300px] w-full">
                            <select className="w-full border border-black rounded-lg px-3 py-2 text-sm h-[42px] ">
                                <option>2025</option>
                            </select>
                            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm w-32">
                                Cari
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden border rounded-lg">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-3 border-r w-10 text-center">
                                        No
                                    </th>
                                    <th className="p-3 border-r text-left w-[300px]">
                                        Nama Rubrik
                                    </th>
                                    <th className="p-3 border-r text-left w-[250px]">
                                        Rentan Tanggal
                                    </th>
                                    <th className="p-3 border-r w-32 text-center">
                                        Tahun Akademik
                                    </th>
                                    <th className="p-3 text-center w-56">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {osceList.map((osce, i) => (
                                    <tr
                                        key={i}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="p-3 text-center border-r">
                                            {i + 1}
                                        </td>
                                        <td className="p-3 border-r">
                                            <div className="font-semibold text-gray-900">
                                                {osce.nama}
                                            </div>
                                            <div className="text-gray-500 text-xs mt-1">
                                                {osce.stase} Stase |{" "}
                                                {osce.mahasiswa} Mahasiswa |{" "}
                                                {osce.sesi} Sesi
                                            </div>
                                        </td>
                                        <td className="p-3 border-r">
                                            {osce.rentang_tanggal}
                                        </td>
                                        <td className="p-3 border-r text-center">
                                            {osce.tahun}
                                        </td>
                                        <td className="p-3 flex items-center justify-center gap-2">
                                            <button className="bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-900 transition w-28 h-[38px]">
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
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination kiri bawah */}
                    <OsPagination/>
                </section>

                {/* Footer
                <OsCopyright/> */}
            </main>
        </div>
    );
}
