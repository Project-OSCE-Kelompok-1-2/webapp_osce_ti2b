import React from "react";
import { ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";

export default function AddKompetensi() {
  const handleBack = () => {
    router.visit("/admin/kompetensi");
  };

  return (
    <div className="p-6">
      <button onClick={handleBack} className="text-blue-600 mb-4 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Kembali ke List Kompetensi
      </button>

      <div className="max-w-md mx-auto bg-white p-6 border rounded-xl shadow">
        <h2 className="text-center font-bold text-lg mb-4">Form Nilai Kompetensi</h2>

        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nama Kompetensi</label>
            <input className="w-full border p-2 rounded-md" placeholder="Masukkan nama kompetensi..." />
          </div>

          <div>
            <label className="text-sm font-medium">Deskripsi Kompetensi</label>
            <textarea className="w-full border p-2 rounded-md" placeholder="Masukkan deskripsi..." />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Nilai Minimum</label>
              <select className="w-full border p-2 rounded-md">
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Nilai Maksimum</label>
              <select className="w-full border p-2 rounded-md">
                {[1, 2, 3, 4, 5, 10, 20].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md w-full font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
