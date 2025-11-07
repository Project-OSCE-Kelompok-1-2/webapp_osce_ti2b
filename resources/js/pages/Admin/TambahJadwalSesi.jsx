import React from "react";
import { router } from "@inertiajs/react";
import { ChevronLeft, Trash2, Calendar, Save } from "lucide-react";

export default function TambahlahJadwalOsce() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Data berhasil dikirim!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 text-sm text-gray-700 p-4 border-b border-gray-300 bg-white">
        <button
          onClick={() => router.visit("/admin/tambahjadwal")}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-1 border border-gray-400 rounded-lg px-4 py-2 text-sm font-medium bg-white">
          OSCE \ OSCE Radiologi 01-A \ Jadwal Sesi \ Tambah Sesi
        </div>
      </header>

      {/* Form */}
      <main className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg border rounded-xl shadow-lg bg-white overflow-hidden"
        >
          <div className="bg-neutral-800 text-white text-center p-6">
            <h2 className="text-xl font-semibold">Form Jadwal Ujian</h2>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Jadwal mulai
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-400 rounded-lg p-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Fri 01-01-2025"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Calendar className="text-gray-500" size={18} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Save size={16} /> Submit
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
