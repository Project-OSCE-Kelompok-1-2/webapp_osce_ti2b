import React from "react";
import { X } from "lucide-react";
import { Link, useForm, usePage } from "@inertiajs/react";

import Os_button from "../../components/button.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/copyright.jsx";

export default function TambahPenguji() {
    const { penguji = null, errors = {} } = usePage().props;
    const isEditMode = !!penguji;

    const { data, setData, post, put, processing, reset } = useForm({
        nip: penguji ? penguji.nip : "",
        nama: penguji ? penguji.nama : "",
        alamat: penguji ? penguji.alamat : "",
        email: penguji ? penguji.email : "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (isEditMode) {
            put(`/admin/dosen/${penguji.id_penguji}`);
        } else {
            post("/admin/dosen");
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-os-white rounded-lg p-4">
            {/* HEADER */}
            <header className="bg-white border-b border-gray-300 px-3 py-3 flex items-center justify-between gap-3">
                {/* Tombol kembali */}
                <Link
                    href="/admin/penguji"
                    className="bg-red-600 text-white p-3 rounded-xl border border-black hover:bg-red-500 transition"
                >
                    <X size={20} />
                </Link>

                <div className="flex-1 mx-3 border border-black rounded-xl px-4 py-2 bg-white">
                    <p className="text-black text-base sm:text-lg truncate">
                        Penguji /{" "}
                        {isEditMode ? "Edit Penguji" : "Tambah Penguji"}
                    </p>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex-1 flex justify-center items-center sm:items-center p-4 sm:p-10">
                <div className="w-full sm:max-w-md bg-white border border-gray-700 rounded-xl shadow-md overflow-hidden">
                    <div className="bg-neutral-800 text-white text-center py-6 px-4">
                        <h2 className="text-xl font-semibold">
                            Form {isEditMode ? "Edit" : "Tambah"} Penguji
                        </h2>
                        <p className="text-sm text-gray-300 mt-1">
                            Form ini berisi semua data yang digunakan untuk
                            {isEditMode ? " memperbarui" : " membuat"} penguji
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-3">
                        {/* NIP */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                NIP Penguji
                            </label>
                            <input
                                value={data.nip}
                                onChange={(e) => setData("nip", e.target.value)}
                                placeholder="Masukkan NIP penguji..."
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                            {errors.nip && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.nip}
                                </p>
                            )}
                        </div>

                        {/* NAMA */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Nama Penguji
                            </label>
                            <input
                                value={data.nama}
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                placeholder="Masukkan nama penguji..."
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                            {errors.nama && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        {/* ALAMAT */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Alamat Penguji
                            </label>
                            <textarea
                                value={data.alamat}
                                onChange={(e) =>
                                    setData("alamat", e.target.value)
                                }
                                placeholder="Masukkan alamat penguji..."
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows={4}
                            />
                            {errors.alamat && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.alamat}
                                </p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Email Penguji
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="Masukkan email penguji..."
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

                            <Os_button
                                type="button"
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Yakin ingin mengosongkan form?"
                                        )
                                    )
                                        reset();
                                }}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 rounded-xl w-full sm:w-auto"
                            >
                                <OsIcon
                                    name="Trash"
                                    className="h-os-20 os-icon-light"
                                />
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
