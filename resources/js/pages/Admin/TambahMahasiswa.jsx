import React from "react";
import { X } from "lucide-react";
import { Link, useForm, usePage, Head } from "@inertiajs/react"; // 1. Import Head

import OsCopyright from "../../components/copyright.jsx";
import Os_button from "../../components/button.jsx";
import OsIcon from "../../components/icons.jsx";

export default function TambahMahasiswa() {
    const { mahasiswa = null, errors = {} } = usePage().props;
    const isEditMode = !!mahasiswa;

    const { data, setData, post, put, processing, reset } = useForm({
        nim: mahasiswa?.nim || "",
        nama: mahasiswa?.nama || "",
        kelas: mahasiswa?.kelas || "",
        prodi: mahasiswa?.prodi || "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (isEditMode) {
            // Kirim PUT ke route 'update'
            put(`/admin/mahasiswa/${mahasiswa.id_mahasiswa}`, {
                onSuccess: () => reset(),
            });
        } else {
            // Kirim POST ke route 'store'
            post("/admin/mahasiswa", {
                onSuccess: () => reset(),
            });
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-os-white rounded-lg p-4">
            <Head title={isEditMode ? "Edit Mahasiswa" : "Tambah Mahasiswa"} />

            {/* HEADER */}
            <header className="bg-white border-b border-gray-300 px-3 py-3 flex items-center justify-between gap-3">
                {/* Tombol kembali */}
                <Link
                    href="/admin/mahasiswa"
                    className="bg-red-600 text-white p-3 rounded-xl border border-black hover:bg-red-500 transition"
                >
                    <X size={20} />
                </Link>

                <div className="flex-1 mx-3 border border-black rounded-xl px-4 py-2 bg-white">
                    <p className="text-black text-base sm:text-lg truncate">
                        Mahasiswa /
                        {isEditMode ? " Edit Mahasiswa" : " Tambah Mahasiswa"}
                    </p>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex-1 flex justify-center items-center p-4 sm:p-10">
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
                        {/* NIM & ANGKATAN (KELAS) */}
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
                                    className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:outline-none ${
                                        errors.nim
                                            ? "border-red-500"
                                            : "border-gray-700"
                                    }`}
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
                                    value={data.kelas}
                                    onChange={(e) =>
                                        setData("kelas", e.target.value)
                                    }
                                    className={`w-full border rounded-lg p-3 text-sm bg-os-white focus:ring-2 focus:outline-none ${
                                        errors.kelas
                                            ? "border-red-500"
                                            : "border-gray-700"
                                    }`}
                                    required
                                >
                                    <option value="">Pilih</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                </select>
                                {errors.kelas && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.kelas}
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
                                className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:outline-none ${
                                    errors.nama
                                        ? "border-red-500"
                                        : "border-gray-700"
                                }`}
                                required
                            />
                            {errors.nama && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        {/* JURUSAN (PRODI) */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Jurusan (Prodi)
                            </label>
                            <select
                                value={data.prodi}
                                onChange={(e) =>
                                    setData("prodi", e.target.value)
                                }
                                className={`w-full border rounded-lg p-3 text-sm bg-os-white focus:ring-2 focus:outline-none ${
                                    errors.prodi
                                        ? "border-red-500"
                                        : "border-gray-700"
                                }`}
                                required
                            >
                                <option value="">Pilih jurusan</option>
                                <option value="Kedokteran">Kedokteran</option>
                                <option value="Keperawatan">Keperawatan</option>
                            </select>
                            {errors.prodi && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.prodi}
                                </p>
                            )}
                        </div>

                        {/* TOMBOL */}
                        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                            <Os_button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center rounded-xl gap-2 w-full"
                            >
                                <OsIcon
                                    name="Save"
                                    className="h-os-20 os-icon-light"
                                />
                                {processing
                                    ? "Menyimpan..."
                                    : isEditMode
                                    ? "Perbarui"
                                    : "Submit"}
                            </Os_button>
                        </div>
                    </form>
                </div>
            </main>

            {/* FOOTER */}
            <OsCopyright />
        </div>
    );
}
