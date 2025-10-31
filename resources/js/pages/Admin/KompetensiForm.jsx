import React, { useState } from "react";
import { Trash2, Save, ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";

export default function KompetensiForm() {
    const [deskripsi, setDeskripsi] = useState("");
    const [bobot, setBobot] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ deskripsi, bobot });
        router.visit("/admin/kompetensi");
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => router.visit("/admin/kompetensi")}
                    className="bg-red-600 text-white p-2 rounded-md"
                >
                    <ArrowLeft size={18} />
                </button>
                <input
                    type="text"
                    value="Stase \ A. Persiapan \ Kompetensi \ Tambah Kompetensi"
                    readOnly
                    className="border rounded-md px-3 py-2 w-full text-sm"
                />
            </div>

            {/* Form Card di tengah */}
            <div className="flex justify-center mt-10">
                <div className="max-w-md w-full border border-gray-300 rounded-xl shadow-md overflow-hidden">
                    <div className="bg-neutral-800 text-white text-center py-4">
                        <h2 className="text-lg font-semibold">
                            Form Tambah Kompetensi
                        </h2>
                        <p className="text-sm text-gray-300 mt-1 px-4">
                            Form ini berisi semua data yang digunakan untuk membuat kompetensi
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 bg-white">
                        <div className="mb-4">
                            <label className="block text-xs text-gray-700 font-medium mb-1">
                                Deskripsi Kompetensi
                            </label>
                            <textarea
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                placeholder="Masukkan deskripsi..."
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs text-gray-700 font-medium mb-1">
                                Bobot
                            </label>
                            <select
                                value={bobot}
                                onChange={(e) => setBobot(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-36 py-2 rounded-md text-sm transition-all"
                            >
                                <Save size={16} />
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => router.visit("/admin/kompetensi")}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded-md text-sm transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-sm text-gray-500 mt-32 border-t pt-2 text-center">
                Copyright Porem ipsum dolor sit amet
            </footer>
        </div>
    );
}
