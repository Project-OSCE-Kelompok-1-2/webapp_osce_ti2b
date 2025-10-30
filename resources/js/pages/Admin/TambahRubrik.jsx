import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Trash2, Save } from "lucide-react";

export default function TambahStase() {
    const { flash } = usePage().props;
    const { data, setData, post, reset, errors } = useForm({
        nama_stase: "",
        jumlah_template: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("stase.store"), { onSuccess: () => reset() });
    };

    return (
        <>
            <Head title="Stase | Tambah Stase" />

            <div className="flex flex-col min-h-screen bg-white">
                {/* ===== Breadcrumb Header ===== */}
                <div className="flex items-center border-b px-4 py-3">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 mr-3"
                    >
                        ←
                    </button>
                    <span className="text-gray-700 font-medium">
                        Stase \{" "}
                        <span className="text-gray-500">Tambah Stase</span>
                    </span>
                </div>

                {/* ===== Form Container ===== */}
                <div className="flex flex-1 items-center justify-center">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md border rounded-xl shadow-sm overflow-hidden"
                    >
                        {/* ===== Header Form ===== */}
                        <div className="bg-neutral-800 text-white text-center py-4">
                            <h2 className="text-lg font-semibold">
                                Form Tambah Stase
                            </h2>
                            <p className="text-gray-300 text-sm">
                                Form ini berisi semua data yang digunakan untuk
                                membuat Stase
                            </p>
                        </div>

                        {/* ===== Isi Form ===== */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm text-gray-700">
                                    Nama stase
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_stase}
                                    onChange={(e) =>
                                        setData("nama_stase", e.target.value)
                                    }
                                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Masukkan nama stase..."
                                />
                                {errors.nama_stase && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.nama_stase}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">
                                    Jumlah Template Aspek Penilaian
                                </label>
                                <input
                                    type="number"
                                    value={data.jumlah_template}
                                    onChange={(e) =>
                                        setData(
                                            "jumlah_template",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-200 text-gray-700 focus:outline-none"
                                    placeholder="Masukkan jumlah template..."
                                />
                                {errors.jumlah_template && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.jumlah_template}
                                    </p>
                                )}
                            </div>

                            {/* ===== Tombol Aksi ===== */}
                            <div className="flex justify-between items-center pt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    Submit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* ===== Footer ===== */}
                <footer className="border-t mt-auto text-center text-gray-500 text-sm py-2">
                    Copyright Porem ipsum dolor sit amet
                </footer>
            </div>
        </>
    );
}
