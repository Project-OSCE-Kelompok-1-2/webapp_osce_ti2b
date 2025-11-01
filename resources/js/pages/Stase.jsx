import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";

export default function Stase() {
  // 🔹 Ambil semua props dari Laravel melalui Inertia
  const { data, filters = {}, flash = {} } = usePage().props;
  const stase = data;
  console.log(stase);

  // 🔹 State untuk pencarian
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // 🔹 Fungsi handle filter pencarian
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    router.get(
      route("stase.index"),
      { search: searchTerm },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  return (
    <div className="container mx-auto p-6">
      <Head title="Data Stase" />
      <h1 className="text-2xl font-bold mb-4">Daftar Stase</h1>

      {/* ✅ Notifikasi Flash Message */}
      {flash.message && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
          role="alert"
        >
          <p>{flash.message}</p>
        </div>
      )}

      {/* ✅ Form Pencarian */}
      <form onSubmit={handleFilterSubmit} className="mb-4 flex items-center">
        <label htmlFor="search" className="mr-2 font-medium">
          Cari Stase:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 mr-2 w-64"
          placeholder="Nama stase..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Cari
        </button>
      </form>

      {/* ✅ Tabel Data Stase */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nama Stase
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Jumlah Aspek
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stase && stase.length > 0 ? (
              stase.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    {item.jumlah_aspek}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-4 text-center text-gray-500 text-sm"
                >
                  Tidak ada data stase ditemukan
                  {filters.search && ` (pencarian: "${filters.search}")`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
