import React from "react";
import { Trash2, Save, X } from "lucide-react";
import { useForm, usePage, Link, router } from "@inertiajs/react";

export default function TambahMahasiswa() {
    // Ambil data & error dari backend
    const { jurusan = [], errors } = usePage().props;

    // Inisialisasi form
    const { data, setData, post, processing, reset } = useForm({
        nim: "",
        nama_mahasiswa: "",
        angkatan: "2025",
        jurusan_id: "",
        email: "",
    });

    // Fungsi submit
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/mahasiswa"); // ganti sesuai route backend yang digunakan
    };

    return (
        <div className="min-h-screen flex flex-col bg-os-white rounded-lg p-4">
            {/* ======= HEADER ======= */}
            <header className="bg-white border-b border-gray-300 px-3 py-3 flex items-center justify-between gap-3">
                <Link
                    href="/admin/mahasiswa"
                    className="bg-red-600 text-white p-3 rounded-xl border border-black hover:bg-red-500 transition-all"
                >
                    <X size={20} />
                </Link>

                <div className="flex-1 mx-3 border border-black rounded-xl px-4 py-2 bg-white">
                    <p className="text-black text-base sm:text-lg truncate">
                        Mahasiswa / Tambah Mahasiswa
                    </p>
                </div>
            </header>

            {/* ======= FORM ======= */}
            <main className="flex-1 flex justify-center items-center sm:items-center p-4 sm:p-10">
                <div className="w-full sm:max-w-md bg-white border border-gray-700 rounded-xl shadow-md overflow-hidden">
                    {/* Header Form */}
                    <div className="bg-neutral-800 text-white text-center py-6 px-4">
                        <h2 className="text-xl font-semibold">
                            Form Tambah Mahasiswa
                        </h2>
                        <p className="text-sm text-gray-300 mt-1">
                            Form ini berisi semua data yang digunakan untuk
                            membuat mahasiswa baru
                        </p>
                    </div>

                    {/* Isi Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-3">
                        {/* NIM + Angkatan */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-xs text-gray-700 font-semibold mb-1">
                                    NIM Mahasiswa
                                </label>
                                <input
                                    type="text"
                                    value={data.nim}
                                    onChange={(e) =>
                                        setData("nim", e.target.value)
                                    }
                                    placeholder="Masukkan nim mahasiswa..."
                                    className="w-full border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                                {errors.nim && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.nim}
                                    </p>
                                )}
                            </div>

                            <div className="w-32">
                                <label className="block text-xs text-gray-700 font-semibold mb-1">
                                    Angkatan
                                </label>
                                <select
                                    value={data.angkatan}
                                    onChange={(e) =>
                                        setData("angkatan", e.target.value)
                                    }
                                    className="w-full border border-gray-700 rounded-lg p-3 text-sm bg-os-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    {[2025, 2024, 2023, 2022, 2021].map(
                                        (year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Nama Mahasiswa */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Nama Mahasiswa
                            </label>
                            <input
                                type="text"
                                value={data.nama_mahasiswa}
                                onChange={(e) =>
                                    setData("nama_mahasiswa", e.target.value)
                                }
                                placeholder="Masukkan nama mahasiswa..."
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                            {errors.nama_mahasiswa && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.nama_mahasiswa}
                                </p>
                            )}
                        </div>

                        {/* Jurusan */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Jurusan
                            </label>
                            <select
                                value={data.jurusan_id}
                                onChange={(e) =>
                                    setData("jurusan_id", e.target.value)
                                }
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm bg-os-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            >
                                <option value="">Pilih jurusan...</option>
                                {jurusan.map((item) => (
                                    <option
                                        key={item.id_jurusan}
                                        value={item.id_jurusan}
                                    >
                                        {item.nama_jurusan}
                                    </option>
                                ))}
                            </select>
                            {errors.jurusan_id && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.jurusan_id}
                                </p>
                            )}
                        </div>

                        {/* Email */}
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
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-500 text-white px-10 py-3 rounded-xl transition-all w-full disabled:opacity-50"
                            >
                                <Save size={20} />
                                {processing ? "Menyimpan..." : "Submit"}
                            </button>

                            <button
                                type="button"
                                onClick={() => reset()}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-3 rounded-xl text-sm border transition-all w-full sm:w-auto"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* ======= FOOTER ======= */}
                <OsCopyright />
            </main>
        </div>
    );
}
