import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, Search, Edit2, Copy, Trash2 } from "lucide-react";

export const JadwalSesi = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("jadwal");

  const sessions = [
    {
      id: 1,
      tanggal: "Fri 01-01-2010 6:00",
      jumlah: "135 Mahasiswa",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-4 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg hover:bg-blue-700 flex-shrink-0"
            onClick={() => router.visit("/admin/dashboard")}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <input
            type="text"
            value="OSCE \ OSCE Radiologi 01-A \ Jadwal Sesi"
            readOnly
            className="flex-1 h-10 bg-white border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-700"
          />
        </div>

        <div className="border-b border-gray-300 mb-4"></div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-black mb-3">Navigasi</h3>
          <div className="flex gap-2">
            <button
              onClick={() => router.visit("/admin/stase")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "halaman"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              📄 Halaman Stase
            </button>
            <button
              onClick={() => setActiveTab("jadwal")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "jadwal"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              📅 Jadwal Sesi
            </button>
          </div>
        </div>

        {/* Menu Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-black mb-2">
            Menu Sesi OSCE
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed max-w-md mb-4">
            Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis.
          </p>

          <button
            onClick={() => router.visit("/admin/tambahsesijadwal")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            ➕ Masukkan Sesi
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-400 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="cari data sesi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-black placeholder-gray-400 focus:outline-none text-sm"
            />
          </div>

          <button className="px-8 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm">
            Cari
          </button>
        </div>

        {/* Table Title */}
        <h3 className="text-sm font-semibold text-black mb-3">Table Mahasiswa</h3>
        <div className="border-b border-gray-300"></div>
      </div>

      {/* Table Section */}
      <div className="px-6 pb-6">
        <div className="border border-gray-400 rounded-lg overflow-hidden mb-4">
          <table className="w-full">
            <thead>
              <tr className="bg-white border-b border-gray-400">
                <th className="px-4 py-3 text-left text-xs font-semibold text-black border-r border-gray-400 w-12">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black border-r border-gray-400 w-48">
                  Tanggal / Sesi
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black border-r border-gray-400 flex-1">
                  Jumlah Mahasiswa
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-black w-40">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session, index) => (
                <tr key={session.id} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="px-4 py-4 text-xs text-black border-r border-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 text-xs text-black border-r border-gray-300">
                    {session.tanggal}
                  </td>
                  <td className="px-4 py-4 text-xs text-black border-r border-gray-300">
                    {session.jumlah}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => router.visit("/admin/enrollmentmhs")}
                        className="px-3 py-1 bg-gray-800 text-white rounded text-xs font-medium hover:bg-gray-900"
                      >
                        Edit enrollment
                      </button>
                      <button className="flex items-center justify-center w-7 h-7 bg-black text-white rounded hover:bg-gray-800">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button className="flex items-center justify-center w-7 h-7 bg-white border border-gray-400 text-gray-600 rounded hover:bg-gray-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JadwalSesi;
