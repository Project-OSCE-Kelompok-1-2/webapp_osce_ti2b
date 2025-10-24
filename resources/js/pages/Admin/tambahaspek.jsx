import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const TambahAspekPenilaian = () => {
  const [deskripsi, setDeskripsi] = useState("");
  const [nilaiMin, setNilaiMin] = useState(1);
  const [nilaiMax, setNilaiMax] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ deskripsi, nilaiMin, nilaiMax });
    // Logic untuk submit data ke backend di sini
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 border rounded px-4 py-1 w-full max-w-5xl">
        <button className="text-red-600 font-bold text-lg">❌</button>
        <span>Rubrik / Packet Rubrik 1 /</span>
        <span className="font-semibold">Tambah Aspek Penilaian</span>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-md w-full max-w-md shadow-md"
      >
        {/* Header */}
        <div className="bg-gray-800 text-white text-center rounded-t-md px-4 py-2">
          <h2 className="font-semibold text-lg">Form Tambah Aspek Penilaian</h2>
          <p className="text-xs">
            Form ini berisi semua data yang digunakan untuk membuat aspek
            penilaian
          </p>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs mb-1">Deskripsi aspek penilaian</label>
            <textarea
              rows={4}
              placeholder="Masukkan deskripsi..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-xs mb-1">Nilai Minimum</label>
              <select
                value={nilaiMin}
                onChange={(e) => setNilaiMin(Number(e.target.value))}
                className="w-full border rounded p-2 text-sm"
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label className="block text-xs mb-1">Nilai Maximum</label>
              <select
                value={nilaiMax}
                onChange={(e) => setNilaiMax(Number(e.target.value))}
                className="w-full border rounded p-2 text-sm"
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded w-full flex items-center justify-center gap-2"
            >
              <span>📥</span> Submit
            </button>
            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-700 p-2 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </form>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 border-t w-full max-w-5xl pt-2">
        Copyright Porem ipsum dolor sit amet | Porem ipsum dolor sit amet
      </footer>
    </div>
  );
};

export default TambahAspekPenilaian;
