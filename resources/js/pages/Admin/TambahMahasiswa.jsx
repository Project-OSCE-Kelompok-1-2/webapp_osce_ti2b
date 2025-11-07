import React from "react";
import { X, Save, Trash2 } from "lucide-react";
import { Link, useForm, usePage } from "@inertiajs/react";

import Sidebar from "../../Components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";

export default function TambahMahasiswa() {
    // Ambil props dari Inertia (atau mock data)
    const { mahasiswa: realMahasiswa = null, errors = {} } = usePage().props;

    // Mock data (aktif kalau backend belum kirim data mahasiswa)
    const mockMahasiswa = {
        id_mahasiswa: 999,
        nim: "TI23001",
        nama: "Robin",
        angkatan: "2023",
        prodi: "Teknik Komputer",
        email: "robin@example.com",
    };

    // Gunakan mockMahasiswa kalau belum ada data dari backend (simulasi edit)
    const mahasiswa =
        realMahasiswa ??
        (window.location.search.includes("mockEdit=true")
            ? mockMahasiswa
            : null);
    const isEditMode = !!mahasiswa;

    const { data, setData, post, put, processing, reset } = useForm({
        nim: mahasiswa ? mahasiswa.nim : "",
        nama: mahasiswa ? mahasiswa.nama : "",
        angkatan: mahasiswa ? mahasiswa.angkatan : "",
        prodi: mahasiswa ? mahasiswa.prodi : "",
        email: mahasiswa ? mahasiswa.email : "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (isEditMode) {
            alert("Simulasi PUT ke backend untuk update data mahasiswa (mock)");
        } else {
            alert("Simulasi POST ke backend untuk tambah mahasiswa (mock)");
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-os-white rounded-lg p-4">
            {/* HEADER */}
            <header className="bg-white border-b border-gray-300 px-3 py-3 flex items-center justify-between gap-3">
                <Link
                    href="/admin/mahasiswa"
                    className="bg-red-600 text-white p-3 rounded-xl border border-black hover:bg-red-500"
                >
                    <X size={20} />
                </Link>

                <div className="flex-1 mx-3 border border-black rounded-xl px-4 py-2 bg-white">
                    <p className="text-black text-base sm:text-lg truncate">
                        Mahasiswa /{" "}
                        {isEditMode ? " Edit Mahasiswa" : " Tambah Mahasiswa"}
                    </p>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex-1 flex justify-center items-center sm:items-center p-4 sm:p-10">
                <div className="w-full sm:max-w-md bg-white border border-gray-700 rounded-xl shadow-md overflow-hidden">
                    <div className="bg-neutral-800 text-white text-center py-6 px-4">
                        <h2 className="text-xl font-semibold">
                            Form {isEditMode ? "Edit" : "Tambah"} Mahasiswa
                        </h2>
                        <p className="text-sm text-gray-300 mt-1">
                            Form ini berisi semua data yang digunakan untuk
                            {isEditMode ? " memperbarui" : " membuat"} mahasiswa
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-3">
                        {/* NIM & ANGKATAN */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="w-full">
                                <label className="block text-xs text-gray-700 font-semibold mb-1">
                                    NIM Mahasiswa
                                </label>
                                <input
                                    value={data.nim}
                                    onChange={(e) =>
                                        setData("nim", e.target.value)
                                    }
                                    placeholder="Masukkan NIM mahasiswa..."
                                    className="w-full border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                                {errors.nim && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.nim}
                                    </p>
                                )}
                            </div>

                            <div className="w-full sm:w-1/3">
                                <label className="block text-xs text-gray-700 font-semibold mb-1">
                                    Angkatan
                                </label>
                                <select
                                    value={data.angkatan}
                                    onChange={(e) =>
                                        setData("angkatan", e.target.value)
                                    }
                                    className="w-full border border-gray-700 rounded-lg p-3 text-sm bg-os-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                >
                                    <option value="">Pilih</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                                {errors.angkatan && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.angkatan}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* NAMA MAHASISWA */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Nama Mahasiswa
                            </label>
                            <input
                                value={data.nama}
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                placeholder="Masukkan nama mahasiswa..."
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                            {errors.nama && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        {/* JURUSAN */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Jurusan
                            </label>
                            <select
                                value={data.prodi}
                                onChange={(e) =>
                                    setData("prodi", e.target.value)
                                }
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm bg-os-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            >
                                <option value="">Pilih jurusan</option>
                                <option value="Teknik Komputer">
                                    Teknik Komputer
                                </option>
                                <option value="Ahli pernafasan hidung dan mulut">
                                    Ahli pernafasan hidung dan mulut
                                </option>
                            </select>
                            {errors.prodi && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.prodi}
                                </p>
                            )}
                        </div>

                        {/* EMAIL MAHASISWA */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Email Mahasiswa
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="Masukkan email mahasiswa..."
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* TOMBOL */}
                        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-500 text-white px-10 py-3 rounded-xl transition-all w-full disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing
                                    ? "Menyimpan..."
                                    : isEditMode
                                    ? "Perbarui"
                                    : "Submit"}
                            </button>

                            <button
                                type="button"
                                onClick={() => reset()}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-3 rounded-xl text-sm border transition-all w-full sm:w-auto"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* FOOTER */}
            <OsCopyright />
        </div>
    );
}
