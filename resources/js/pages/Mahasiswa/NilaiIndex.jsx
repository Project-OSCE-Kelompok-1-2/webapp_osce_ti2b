import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { ChevronRight, FileText, User } from "lucide-react";

// --- 1. MOCK DATA (Data Palsu untuk Simulasi) ---
const MOCK_MAHASISWA = {
    nama: "MI. AULIA KURNIA WIDYARANI",
    nim: "4.33.24.1.13",
    prodi: "Kedokteran Gigi",
    status: "Aktif",
};

const MOCK_UJIAN_LIST = [
    {
        id: 1,
        nama_ujian: "OSCE Radiologi 01-A",
        dosen_penguji: "Prof. Dr. dr. Mahalul Azam, M.Kes",
        tanggal_ujian: "31 / 10 / 2025",
        semester: "5",
        tahun_ujian: "2025",
        status_lulus: true, // LULUS
    },
    {
        id: 2,
        nama_ujian: "OSCE Konservasi Gigi 02-B",
        dosen_penguji: "Dr. drg. Siti Aminah, Sp.KG",
        tanggal_ujian: "01 / 11 / 2025",
        semester: "5",
        tahun_ujian: "2025",
        status_lulus: true, // LULUS
    },
    {
        id: 3,
        nama_ujian: "OSCE Bedah Mulut Dasar",
        dosen_penguji: "drg. Budi Santoso, Sp.BM",
        tanggal_ujian: "20 / 05 / 2024",
        semester: "4",
        tahun_ujian: "2024",
        status_lulus: false, // TIDAK LULUS
    },
    {
        id: 4,
        nama_ujian: "OSCE Periodonsia Dasar",
        dosen_penguji: "drg. Ratna Sari, Sp.Perio",
        tanggal_ujian: "31 / 10 / 2025",
        semester: "5",
        tahun_ujian: "2025",
        status_lulus: true, // LULUS
    },
    {
        id: 5,
        nama_ujian: "OSCE Ortodonsia I",
        dosen_penguji: "Prof. Dr. dr. Mahalul Azam, M.Kes",
        tanggal_ujian: "31 / 10 / 2025",
        semester: "5",
        tahun_ujian: "2025",
        status_lulus: true, // LULUS
    },
];

export default function OsceGradePage() {
    // State untuk Filter UI
    const [filterSemester, setFilterSemester] = useState("");
    const [filterTahun, setFilterTahun] = useState("");

    // State untuk Data yang ditampilkan
    const [filteredData, setFilteredData] = useState(MOCK_UJIAN_LIST);

    // --- 2. LOGIKA FILTER CLIENT-SIDE ---
    useEffect(() => {
        let result = MOCK_UJIAN_LIST;

        if (filterSemester) {
            result = result.filter((item) => item.semester === filterSemester);
        }

        if (filterTahun) {
            result = result.filter((item) => item.tahun_ujian === filterTahun);
        }

        setFilteredData(result);
    }, [filterSemester, filterTahun]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans text-slate-800">
            <Head title="Hasil Penilaian OSCE" />

            {/* --- BREADCRUMB --- */}
            <div className="mb-6 flex items-center text-sm text-gray-500">
                <Link
                    href="#"
                    className="hover:text-blue-600 transition-colors"
                >
                    Dashboard
                </Link>
                <ChevronRight className="mx-2 h-4 w-4" />
                <span className="font-semibold text-blue-600">
                    Hasil Penilaian
                </span>
            </div>

            {/* --- JUDUL HALAMAN --- */}
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
                    <FileText className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Hasil Penilaian OSCE
                </h1>
            </div>

            {/* --- CARD INFORMASI MAHASISWA (UTAMA) --- */}
            {/* Mengubah warna bg-red-500 menjadi bg-blue-600 sesuai tema referensi */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-blue-600 p-8 text-white shadow-lg">
                {/* Dekorasi Background Abstract */}
                <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl"></div>

                <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
                    {/* Kolom Kiri: Info Mahasiswa */}
                    <div className="lg:col-span-7 space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <User className="h-6 w-6 text-white" />
                            </div>
                            <div className="space-y-4 w-full">
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4 border-b border-blue-400/30 pb-2">
                                    <span className="font-medium text-blue-100">
                                        Nama
                                    </span>
                                    <span className="text-lg font-bold uppercase tracking-wide">
                                        {MOCK_MAHASISWA.nama}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4 border-b border-blue-400/30 pb-2">
                                    <span className="font-medium text-blue-100">
                                        NIM
                                    </span>
                                    <span className="text-lg font-medium">
                                        {MOCK_MAHASISWA.nim}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <span className="font-medium text-blue-100">
                                        Program Studi
                                    </span>
                                    <span className="text-lg font-medium">
                                        {MOCK_MAHASISWA.prodi}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Filter & Status */}
                    <div className="lg:col-span-5 flex flex-col justify-between gap-4 rounded-lg bg-blue-700/30 p-4 backdrop-blur-sm">
                        <div className="space-y-4">
                            {/* Filter Semester */}
                            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-blue-100">
                                    Semester
                                </label>
                                <select
                                    value={filterSemester}
                                    onChange={(e) =>
                                        setFilterSemester(e.target.value)
                                    }
                                    className="w-full rounded-md border border-blue-400/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-blue-200 focus:border-white focus:ring-1 focus:ring-white cursor-pointer"
                                >
                                    <option value="" className="text-gray-800">
                                        Semua Semester
                                    </option>
                                    <option value="4" className="text-gray-800">
                                        Semester 4
                                    </option>
                                    <option value="5" className="text-gray-800">
                                        Semester 5
                                    </option>
                                </select>
                            </div>

                            {/* Filter Tahun */}
                            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-blue-100">
                                    Tahun Ujian
                                </label>
                                <select
                                    value={filterTahun}
                                    onChange={(e) =>
                                        setFilterTahun(e.target.value)
                                    }
                                    className="w-full rounded-md border border-blue-400/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-blue-200 focus:border-white focus:ring-1 focus:ring-white cursor-pointer"
                                >
                                    <option value="" className="text-gray-800">
                                        Semua Tahun
                                    </option>
                                    <option
                                        value="2024"
                                        className="text-gray-800"
                                    >
                                        2024
                                    </option>
                                    <option
                                        value="2025"
                                        className="text-gray-800"
                                    >
                                        2025
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Status Mahasiswa Badge */}
                        <div className="flex items-center justify-end border-t border-blue-400/30 pt-4 mt-2">
                            <span className="mr-3 text-sm font-medium text-blue-100">
                                Status Mahasiswa:
                            </span>
                            <span className="rounded-full bg-green-500 px-4 py-1 text-sm font-bold text-white shadow-sm ring-2 ring-green-400/50">
                                {MOCK_MAHASISWA.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TABEL PENILAIAN --- */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h3 className="text-lg font-bold text-gray-800">
                        Daftar Nilai Ujian
                    </h3>
                    <span className="text-sm text-gray-500">
                        Total: {filteredData.length} Data
                    </span>
                </div>
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 font-bold uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-center w-16">No</th>
                            <th className="px-6 py-4">Ujian OSCE</th>
                            <th className="px-6 py-4">Dosen Penguji</th>
                            <th className="px-6 py-4 text-center">Tanggal</th>
                            <th className="px-6 py-4 text-center">Aksi</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.length > 0 ? (
                            filteredData.map((ujian, index) => (
                                <tr
                                    key={ujian.id}
                                    className="hover:bg-blue-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-center font-medium text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        {ujian.nama_ujian}
                                    </td>
                                    <td className="px-6 py-4">
                                        {ujian.dosen_penguji}
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium">
                                        {ujian.tanggal_ujian}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {/* Mengubah warna tombol menjadi biru terang (blue-600) */}
                                        <button
                                            onClick={() =>
                                                alert(`Detail ID: ${ujian.id}`)
                                            }
                                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                                        >
                                            Lihat Nilai
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`inline-block w-28 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-sm ${
                                                ujian.status_lulus
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {ujian.status_lulus
                                                ? "LULUS"
                                                : "TIDAK LULUS"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-12 text-center text-gray-400"
                                >
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="rounded-full bg-gray-100 p-4">
                                            <FileText className="h-8 w-8 text-gray-300" />
                                        </div>
                                        <span>Data ujian tidak ditemukan.</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Styled) */}
            <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    Menampilkan{" "}
                    <span className="font-bold text-gray-900">
                        {filteredData.length}
                    </span>{" "}
                    data
                </span>
                <div className="flex items-center gap-2">
                    <button
                        disabled
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-400 cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button className="rounded-md border border-blue-600 bg-blue-600 px-3 py-1.5 text-sm font-bold text-white shadow-sm">
                        1
                    </button>
                    <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition">
                        2
                    </button>
                    <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
