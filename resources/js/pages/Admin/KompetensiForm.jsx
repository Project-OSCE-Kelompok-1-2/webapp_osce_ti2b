import React, { useState } from "react";
import { Trash2, Save, X } from "lucide-react";
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
        <div className="min-h-screen flex flex-col bg-white rounded-lg p-4">
            {/* ======= HEADER ======= */}
            <header className="bg-white border-b border-gray-300 px-3 py-3 flex items-center justify-between gap-3">
                <button
                    onClick={() => router.visit("/admin/kompetensi")}
                    className="bg-red-600 text-white p-3 rounded-xl border border-black hover:bg-red-500 transition-all"
                >
                    <X size={20} />
                </button>

                <div className="flex-1 mx-3 border border-black rounded-xl px-4 py-2 bg-white">
                    <p className="text-black text-base sm:text-lg truncate">
                        Stase \ Persiapan \ Kompetensi \ Tambah Kompetensi
                    </p>
                </div>
            </header>

            {/* Form */}
            <main className="flex-1 flex justify-center items-center sm:items-center p-4 sm:p-10">
                <div className="w-full sm:max-w-md bg-white border border-gray-700 rounded-xl shadow-md overflow-hidden">
                    {/* Header Card */}
                    <div className="bg-neutral-800 text-white text-center py-6 px-4">
                        <h2 className="text-xl font-semibold">
                            Form Tambah Kompetensi
                        </h2>
                        <p className="text-sm text-gray-300 mt-1">
                            Jorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nunc vulputate libero et velit interdum, ac
                            aliquet odio mattis.
                        </p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-2">
                        {/* Deskripsi */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Deskripsi Kompetensi
                            </label>
                            <textarea
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                placeholder="Masukkan deskripsi kompetensi..."
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows={4}
                                required
                            />
                        </div>

                        {/* Bobot */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Bobot
                            </label>
                            <select
                                value={bobot}
                                onChange={(e) =>
                                    setBobot(Number(e.target.value))
                                }
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-500 text-white px-10 py-3 rounded-xl transition-all w-full"
                            >
                                <Save size={20} />
                                Submit
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    router.visit("/admin/kompetensi")
                                }
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-3 rounded-xl text-sm border transition-all w-full sm:w-auto"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* ======= FOOTER ======= */}
            <footer className="border border-black rounded-xl text-start px-4 py-4 text-sm text-gray-600">
                © Jorem ipsum dolor sit amet, consectetur adipiscing elit. 
            </footer>
        </div>
    );
}
