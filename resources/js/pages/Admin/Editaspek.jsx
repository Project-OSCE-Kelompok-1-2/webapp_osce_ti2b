import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function EditAspek() {
  const [deskripsi, setDeskripsi] = useState("kompetensi 1");
  const [nilaiMin, setNilaiMin] = useState(1);
  const [nilaiMax, setNilaiMax] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Data disimpan!\nDeskripsi: " + deskripsi);
    // TODO: kirim data ke backend
  };

  return (
    <div className="p-4 space-y-6">
      {/* ❌ Tombol Close + Breadcrumb */}
      <div className="flex items-center gap-2 border rounded-md p-2">
        <button className="bg-red-600 text-white w-8 h-8 rounded">
          ❌
        </button>
        <span className="text-sm text-gray-700">
          Rubrik / Packet Rubrik 1 / <b>Aspek Penilaian</b> /{" "}
          <span className="font-semibold">Edit Aspek Penilaian</span>
        </span>
      </div>

      {/* Card Form */}
      <div className="max-w-md mx-auto border rounded-md overflow-hidden">
        {/* Header hitam */}
        <div className="bg-gray-900 text-white px-4 py-2 text-center">
          <h2 className="font-semibold text-lg">Form Edit Aspek Penilaian</h2>
          <p className="text-xs text-gray-300">
            Anda mengubah Aspek Penilaian : Aspek Penilaian 1
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 space-y-4">
          <div>
            <label className="text-xs block mb-1">Deskripsi aspek penilaian</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Masukkan deskripsi..."
              className="w-full border rounded-md p-2 text-sm"
              rows={4}
            ></textarea>
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="text-xs block mb-1">Nilai Minimum</label>
              <select
                value={nilaiMin}
                onChange={(e) => setNilaiMin(e.target.value)}
                className="w-full border rounded-md p-2 text-sm"
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val}>{val}</option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="text-xs block mb-1">Nilai Maximum</label>
              <select
                value={nilaiMax}
                onChange={(e) => setNilaiMax(e.target.value)}
                className="w-full border rounded-md p-2 text-sm"
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val}>{val}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit & Hapus */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm w-full flex justify-center items-center gap-2"
            >
              💬 Submit
            </button>
            <button
              type="button"
              className="text-white bg-red-600 p-2 rounded-md ml-2"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="border rounded-md p-2 text-center text-xs text-gray-500">
        Copyright Porem ipsum dolor sit amet | Porem ipsum dolor sit amet
      </div>
    </div>
  );
}
