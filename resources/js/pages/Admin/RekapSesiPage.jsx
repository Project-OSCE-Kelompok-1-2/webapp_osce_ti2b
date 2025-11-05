import React, { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Link, usePage, router } from "@inertiajs/react";

import Sidebar from "../../components/Sidebar";
import OsBreadcrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";
import OsPagination from "../../components/pagination";
import OsTableHeader from "../../components/tableheader";

export default function RekapSesiPage() {
  //  Mock data
  const mockData = [
    { id: 1, tanggal: "Fri 01-01-2010 6:00", jumlah: "135 Mahasiswa" },
    { id: 2, tanggal: "Mon 03-01-2010 8:00", jumlah: "120 Mahasiswa" },
    { id: 3, tanggal: "Wed 05-01-2010 10:00", jumlah: "140 Mahasiswa" },
    { id: 4, tanggal: "Fri 07-01-2010 8:30", jumlah: "130 Mahasiswa" },
    { id: 5, tanggal: "Sun 09-01-2010 9:00", jumlah: "110 Mahasiswa" },
  ];

  const [search, setSearch] = useState("");

  const filteredData = mockData.filter((item) =>
    item.tanggal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      {/* DIUBAH: Menambahkan flex-col agar copyright bisa menempel di bawah */}
      <div className="flex-1 flex flex-col p-6">
        {/* Wrapper untuk konten utama agar bisa 'tumbuh' dan mendorong copyright ke bawah */}
        <div className="flex-grow">
          {/* Breadcrumb / Header */}
          <OsBreadcrumb
            title="OSCE \\ OSCE Radiologi 01-A"
            icon={<ArrowLeft className="w-5 h-5 mr-2" />}
          />

          {/* Menu Rekap Nilai */}
          <div className="bg-white p-6 rounded-2xl shadow mb-6">
            <h2 className="text-lg font-semibold mb-2">Menu Rekap Nilai</h2>
            <p className="text-gray-500 mb-4 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
              vulputate libero et velit interdum, ac aliquet odio mattis.
            </p>

            {/* Search Bar - DIUBAH */}
            <div className="flex items-center space-x-3">
              {/* Wrapper untuk input dan ikon */}
              <div className="relative flex-1">
                {/* Ikon Search di dalam input */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari data sesi..."
                  // DIUBAH: pl-10 agar teks tidak tumpang tindih dengan ikon
                  className="w-full border border-gray-300 rounded-xl p-2 pl-10 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              {/* DIUBAH: Ikon search dihapus dari tombol */}
              <button className="bg-blue-600 text-white rounded-xl px-5 py-2">
                Cari
              </button>
            </div>
          </div>

          {/* Table Mahasiswa */}
          <div className="bg-white p-6 rounded-2xl shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Table Mahasiswa</h2>
            <div className="overflow-x-auto">
              {/* DIUBAH: border dan rounded-xl dihapus dari table */}
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {/* DIUBAH: Styling header disesuaikan */}
                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600">
                      No
                    </th>
                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600">
                      Tanggal / Sesi
                    </th>
                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600">
                      Jumlah Mahasiswa
                    </th>
                    <th className="px-4 py-3 border-b-2 border-gray-200 text-right text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row, index) => (
                      // DIUBAH: text-center dihapus, border-b ditambah
                      <tr key={row.id} className="border-b border-gray-200">
                        {/* DIUBAH: border dihapus, padding disesuaikan */}
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-sm">{row.tanggal}</td>
                        <td className="px-4 py-3 text-sm">{row.jumlah}</td>
                        {/* DIUBAH: text-right untuk align tombol */}
                        <td className="px-4 py-3 text-right">
                          <button className="bg-gray-900 text-white px-4 py-1 rounded-xl hover:bg-gray-800">
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center text-gray-500 py-6 italic"
                      >
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {/* DIUBAH: justify-center menjadi justify-start */}
            <div className="flex justify-start mt-4">
              <OsPagination totalPages={5} currentPage={1} />
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* Dipindahkan ke luar wrapper flex-grow */}
        <OsCopyright />
      </div>
    </div>
  );
}