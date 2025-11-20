import React, { useState } from "react";
import { X, CornerUpLeft } from "lucide-react";
import { Link, useForm, usePage } from "@inertiajs/react";

import Os_button from "../../components/button.jsx";
import OsIcon from "../../components/icons.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import Modals from "../../components/Modals.jsx";

export default function TambahPenguji() {
    const { dosen = null, errors = {} } = usePage().props;
    const isEditMode = !!dosen;

    const { data, setData, post, put, processing, reset } = useForm({
        nip: dosen ? dosen.nip : "",
        nama: dosen ? dosen.nama : "",
    });

    const [isOpenDelete, setIsOpenDelete] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        if (isEditMode) {
            put(`/admin/dosen/${dosen.id_penguji}`);
        } else {
            post("/admin/dosen");
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-os-white rounded-lg p-4">
            {/* HEADER */}
            <header className="bg-white border-b border-gray-300 px-3 py-3 flex items-center justify-between gap-3">
                <Link
                    href="/admin/dosen"
                    className="bg-blue-600 text-white p-3 rounded-xl border border-black hover:bg-blue-700 transition"
                >
                    <CornerUpLeft size={20} />
                </Link>

                <div className="flex-1 mx-3 border border-black rounded-xl px-4 py-2 bg-white">
                    <p className="text-black text-base sm:text-lg truncate">
                        Penguji / {isEditMode ? "Edit Penguji" : "Tambah Penguji"}
                    </p>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex-1 flex justify-center items-center p-4 sm:p-10">
                <div className="w-full sm:max-w-md bg-white border border-gray-700 rounded-xl shadow-md overflow-hidden">
                    <div className="bg-neutral-800 text-white text-center py-6 px-4">
                        <h2 className="text-xl font-semibold">
                            Form {isEditMode ? "Edit" : "Tambah"} Dosen
                        </h2>
                        <p className="text-sm text-gray-300 mt-1">
                            Form ini berisi data untuk{" "}
                            {isEditMode ? "memperbarui" : "menambahkan"} dosen penguji
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-3">
                        {/* NIP */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                NIP Dosen
                            </label>
                            <input
                                value={data.nip}
                                onChange={(e) => setData("nip", e.target.value)}
                                placeholder="Masukkan NIP dosen..."
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                            {errors.nip && (
                                <p className="text-red-500 text-xs mt-1">{errors.nip}</p>
                            )}
                        </div>

                        {/* NAMA */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Nama Dosen
                            </label>
                            <input
                                value={data.nama}
                                onChange={(e) => setData("nama", e.target.value)}
                                placeholder="Masukkan nama dosen..."
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                            {errors.nama && (
                                <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
                            )}
                        </div>

                        {/* BUTTON */}
                        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                            <Os_button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center rounded-xl gap-2 w-full"
                            >
                                <OsIcon name="Save" className="h-os-20 os-icon-light" />
                                {processing
                                    ? "Menyimpan..."
                                    : isEditMode
                                    ? "Perbarui"
                                    : "Submit"}
                            </Os_button>

                            {/* BUTTON DELETE (RESET FORM) */}
                            <Os_button
                                type="button"
                                onClick={() => setIsOpenDelete(true)}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 rounded-xl w-full sm:w-auto"
                            >
                                <OsIcon name="Trash" className="h-os-20 os-icon-light" />
                            </Os_button>
                        </div>
                    </form>
                </div>
            </main>

            {/* FOOTER */}
            <OsCopyright />

            {/* MODAL DELETE */}
            <Modals
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                variant="delete"
                onConfirm={() => {
                    reset(); // kosongkan form
                    setIsOpenDelete(false);
                }}
                dataToDelete={[]}
            />
        </div>
    );
}
