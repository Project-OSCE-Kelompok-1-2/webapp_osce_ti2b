import React, { useRef, useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { ChevronLeft, Trash2, Calendar, Save } from "lucide-react";

export default function TambahSesiJadwal() {
  const [tanggal, setTanggal] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tanggal) {
      alert("⚠️ Silakan pilih tanggal terlebih dahulu!");
      return;
    }

    // Simpan ke localStorage
    const newData = { id: Date.now(), tanggal, jumlah: "0 Mahasiswa" };
    const existing = JSON.parse(localStorage.getItem("mockSesi")) || [];
    localStorage.setItem("mockSesi", JSON.stringify([...existing, newData]));

    alert(`✅ Jadwal berhasil disimpan untuk tanggal: ${tanggal}`);
    router.visit("/admin/tambahjadwal"); // arahkan balik ke halaman jadwal
  };

  const openDatePicker = () => inputRef.current?.showPicker?.();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      input[type="date"]::-webkit-calendar-picker-indicator {
        display: none !important;
        -webkit-appearance: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="flex items-center gap-3 text-sm text-gray-700 p-4 border-b border-gray-300 bg-white">
        <button
          onClick={() => router.visit("/admin/tambahjadwal")}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 border border-gray-400 rounded-lg px-4 py-2 text-sm font-medium bg-white">
          OSCE \ OSCE Radiologi 01-A \ Jadwal Sesi \Tambah Sesi
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md border rounded-lg shadow-sm bg-white overflow-hidden text-center"
        >
          <div className="bg-gray-900 text-white p-5">
            <h2 className="text-lg font-semibold">Form Jadwal Ujian</h2>
            <p className="text-xs text-gray-300 mt-1">
              Pilih tanggal mulai ujian sesuai jadwal OSCE.
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div className="text-left">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Jadwal mulai
              </label>

              <div className="relative">
                <input
                  ref={inputRef}
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg p-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={openDatePicker}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-blue-600"
                >
                  <Calendar size={18} />
                </button>
              </div>
            </div>

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

      <footer className="border-t border-gray-300 p-3 text-center text-xs text-gray-600 bg-white">
        Copyright © Lorem ipsum dolor sit amet.
      </footer>
    </div>
  );
}
