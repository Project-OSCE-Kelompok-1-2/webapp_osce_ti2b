import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { ChevronLeft, Trash2, Calendar, Save } from "lucide-react";

export default function TambahSesiJadwal() {
  const [tanggal, setTanggal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Data jadwal berhasil disimpan!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ===== Header Breadcrumb ===== */}
      <header className="flex items-center gap-3 text-sm text-gray-700 p-4 border-b border-gray-300 bg-white">
        <button
          onClick={() => router.visit("/admin/tambahjadwal")}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-1 border border-gray-400 rounded-lg px-4 py-2 text-sm font-medium bg-white">
          OSCE \ OSCE Radiologi 01-A \ Jadwal Sesi \ Tambah Sesi
        </div>
      </header>

      {/* ===== Main Form Section ===== */}
      <main className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md border rounded-lg shadow-sm bg-white overflow-hidden text-center"
        >
          {/* Header Form */}
          <div className="bg-gray-900 text-white p-5">
            <h2 className="text-lg font-semibold">Form jadwal Ujian</h2>
            <p className="text-xs text-gray-300 mt-1">
              Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis.
            </p>
          </div>

          {/* Isi Form */}
          <div className="p-6 space-y-5">
            <div className="text-left">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Jadwal mulai
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Fri 01-01-2025"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg p-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Calendar className="text-gray-500" size={18} />
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center gap-3 pt-4 justify-center">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Save size={16} /> Submit
              </button>
              <button
                type="button"
                onClick={() => setTanggal("")}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* ===== Footer Copyright ===== */}
      <footer className="border-t border-gray-300 p-3 text-center text-xs text-gray-600 bg-white">
        Copyright © Lorem ipsum dolor sit amet.  
      </footer>
    </div>
  );
}
