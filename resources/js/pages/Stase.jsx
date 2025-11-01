import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Opsional: Hapus jika Anda tidak pakai Layout

// --- PENTING ---
// Jika Anda tidak menggunakan layout default (seperti AuthenticatedLayout),
// hapus baris 'import AuthenticatedLayout' di atas
// dan ubah bagian '<AuthenticatedLayout>' di bawah menjadi '<div>' biasa.
// Saya akan membuatnya tanpa layout agar lebih sederhana.

export default function Stase({ stase, filters, flash }) {
  // State untuk menyimpan nilai input pencarian
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Fungsi untuk menangani submit filter
  function handleFilterSubmit(e) {
    e.preventDefault();
    
    // Gunakan router Inertia untuk mengirim request GET baru
    // dengan query parameter 'search'
    router.get(route('stase.index'), {
        search: searchTerm 
      }, {
        preserveState: true, // Pertahankan state komponen (misal: isi input)
        replace: true,       // Ganti histori browser agar tombol back berfungsi normal
      }
    );
  }

  return (
    // Hapus 'AuthenticatedLayout' dan ganti dengan '<div>' jika Anda tidak menggunakannya
    // <AuthenticatedLayout
    //   header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Stase</h2>}
    // >
    <div className="container mx-auto p-4"> 
      <Head title="Daftar Stase" />

      {/* 1. Menampilkan Notifikasi 'flash' (jika ada) */}
      {flash.message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p>{flash.message}</p>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Daftar Stase</h1>

      {/* 2. Form Filter Pencarian Sederhana */}
      <form onSubmit={handleFilterSubmit} className="mb-4">
        <label htmlFor="search" className="mr-2">Cari Stase:</label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1"
          placeholder="Nama stase..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded ml-2">
          Cari
        </button>
      </form>

      {/* 3. Tabel untuk Menampilkan Data 'stase' */}
      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Stase
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mata Kuliah
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deskripsi
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah Aspek
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* 4. Looping data 'stase' */}
            {stase.length > 0 ? (
              stase.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{item.nama_mata_kuliah}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{item.deskripsi}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.jumlah_aspek}
                  </td>
                </tr>
              ))
            ) : (
              // 5. Tampilkan pesan jika data kosong
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data stase yang ditemukan.
                  {filters.search && ` (untuk pencarian: "${filters.search}")`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    // </AuthenticatedLayout>
  );
}
