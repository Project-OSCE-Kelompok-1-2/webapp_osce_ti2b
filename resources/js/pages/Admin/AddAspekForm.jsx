import React, { useState } from "react";

// Ini adalah komponen HANYA UNTUK FORM (Anak)
export default function AddAspekForm({ onBack, onSubmit, mode, initialData }) {
  // Isi state form. Jika ada initialData (mode edit), pakai itu.
  const [nama, setNama] = useState(initialData?.nama || ""); 
  const [bobot, setBobot] = useState(initialData?.bobot || "30");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kirim data (nama, bobot) ke fungsi onSubmit yang dikirim dari parent
    onSubmit({
      nama: nama,
      bobot: parseInt(bobot) || 0,
    });
  };

  // Ubah judul dan breadcrumb berdasarkan 'mode'
  const isEditMode = mode === 'edit';
  const pageTitle = isEditMode ? 'Edit Aspek Kompetensi' : 'Tambah Aspek Kompetensi';
  const formTitle = isEditMode ? 'Form Edit Aspek Penilaian' : 'Form Tambah Aspek Penilaian';

  return (
    <div className="p-4 space-y-6">
      
      <div className="flex items-center gap-3 text-sm text-gray-700 mb-6 border rounded-lg p-2 bg-white shadow-sm">
        <button 
          onClick={onBack}
          className="bg-blue-600 text-white p-2 rounded-md flex items-center justify-center hover:bg-blue-700 transition"
          title="Kembali"
        >
          {/* Ikon Panah Kembali */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
        </button>
        {/* Breadcrumb dinamis */}
        <span className="font-medium">Stase \ Menu Aspek Penilaian\ {pageTitle}</span>
      </div>

      <div className="max-w-xl mx-auto border-2 rounded-lg shadow-xl overflow-hidden">
        
        <div className="bg-gray-800 text-white px-6 py-5 text-center">
          {/* Judul form dinamis */}
          <h2 className="font-semibold text-xl">{formTitle}</h2>
          <p className="text-sm text-gray-300 mt-1">
            Dosen Penguji : Tahan Prahara., S.T., M.Kom
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 space-y-5">
          <div>
            <label htmlFor="nama-aspek" className="text-sm font-medium text-gray-700 block mb-2">
              Nama Aspek Penilaian
            </label>
            <textarea
              id="nama-aspek"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
              rows={5}
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="bobot-maksimal" className="text-sm font-medium text-gray-700 block mb-2">
              Bobot Maksimal Aspek Penilaian
            </label>
            <input
              id="bobot-maksimal"
              type="number"
              value={bobot}
              onChange={(e) => setBobot(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 shadow-lg transition"
            >
              {/* Ikon Submit */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="text-center text-gray-400 text-sm mt-16 border-t pt-4">
          Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit amet
      </div>
    </div>
  );
}