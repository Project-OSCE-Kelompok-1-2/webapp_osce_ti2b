import React, { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Link, usePage, router } from "@inertiajs/react";

import Sidebar from "../../components/Sidebar";
import OsBreadcrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";
import OsPagination from "../../components/pagination";
import OsTableHeader from "../../components/tableheader";


export default function RekapSesiPage() {
  //  Mock data
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
      <div className="flex-1 p-6">
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

          {/* Search Bar */}
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari data sesi..."
              className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button className="bg-blue-600 text-white rounded-xl px-5 py-2 flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Cari
            </button>
          </div>
        </div>

        {/* Table Mahasiswa */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Table Mahasiswa</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-xl">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border">No</th>
                  <th className="px-4 py-2 border">Tanggal / Sesi</th>
                  <th className="px-4 py-2 border">Jumlah Mahasiswa</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={row.id} className="text-center">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{row.tanggal}</td>
                      <td className="px-4 py-2 border">{row.jumlah}</td>
                      <td className="px-4 py-2 border">
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
                      className="text-center text-gray-500 py-4 italic"
                    >
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <OsPagination totalPages={5} currentPage={1} />
          </div>
        </div>

        {/* Footer */}
        <OsCopyright />
      </div>
    </div>
  );
}
