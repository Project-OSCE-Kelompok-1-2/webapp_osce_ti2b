import React, { useState } from "react";
import { Trash2, Save } from "lucide-react";

export default function KompetensiForm({ onClose, onSubmit }) {
    const [deskripsi, setDeskripsi] = useState("");
    const [bobot, setBobot] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ deskripsi, bobot });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[400px] shadow-xl border border-gray-300 overflow-hidden">
                {/* Header Form */}
                <div className="bg-neutral-800 text-white text-center py-4">
                    <h2 className="text-lg font-semibold">
                        Form Tambah Kompetensi
                    </h2>
                    <p className="text-sm text-gray-300 mt-1">
                        Form ini berisi semua data yang digunakan untuk membuat
                        kompetensi
                    </p>
                </div>

                {/* Isi Form */}
                <form onSubmit={handleSubmit} className="p-5">
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

                    {/* Tombol Submit & Hapus */}
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm w-1/2 mr-2 transition-all"
                        >
                            <Save size={16} />
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm w-1/2 transition-all"
                        >
                            <Trash2 size={16} />
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
