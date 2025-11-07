import React from "react";
import { X, Save, Trash2 } from "lucide-react";
import { Link, useForm, usePage } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";
import CustomBreadCrumb from "../../Components/CustomBreadCrumb";
import OsCopyright from "../../components/copyright";

export default function TambahPenguji() {
    const { penguji = null, errors } = usePage().props;
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
            put(`/admin/penguji/${penguji.id_penguji}`);
        } else {
            post("/admin/penguji");
        }
    }

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                <CustomBreadCrumb
                    title={isEditMode ? "Edit Penguji" : "Tambah Penguji"}
                    className="fixed"
                />

                <div className="flex-1 flex justify-center items-center">
                    <div className="w-full sm:max-w-md bg-white border border-gray-700 rounded-xl shadow-md overflow-hidden">
                        <div className="bg-neutral-800 text-white text-center py-6 px-4">
                            <h2 className="text-xl font-semibold">
                                Form Penguji
                            </h2>
                            <p className="text-sm text-gray-300 mt-1">
                                Form ini berisi data yang digunakan untuk{" "}
                                {isEditMode
                                    ? "memperbarui data penguji"
                                    : "menambahkan penguji baru"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-3">
                            <div>
                                <label className="block text-xs text-gray-700 font-semibold mb-1">
                                    NIP Penguji
                                </label>
                                <input
                                    value={data.nip}
                                    onChange={(e) =>
                                        setData("nip", e.target.value)
                                    }
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
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
