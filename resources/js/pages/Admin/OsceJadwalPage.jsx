import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Search, ArrowLeft } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";

// --- Definisi kolom tabel sesuai halaman OSCE Jadwal ---
const jadwalColumns = [
  { content: "No", width: "w-16", classes: "justify-center items-center" },
  { content: "Tanggal / Sesi", width: "flex-1", classes: "justify-start items-center px-4" },
  { content: "Jumlah Mahasiswa", width: "w-80", classes: "justify-start items-center px-4" },
  { content: "Action", width: "w-48", classes: "justify-center items-center px-4" },
];

// --- Mock data sementara ---
const mockFilters = { search: "" };
const mockSesi = {
  data: [
    { id: 1, tanggal: "Fri 01-01-2010 6:00", jumlah: "135 Mahasiswa" },
  ],
  from: 1,
  links: [
    { url: null, label: "&laquo; Previous", active: false },
    { url: "#", label: "1", active: true },
    { url: "#", label: "2", active: false },
    { url: null, label: "Next &raquo;", active: false },
  ],
};

// --- Komponen utama ---
export default function OsceJadwalPage() {
  const { sesi = mockSesi, filters = mockFilters } = usePage().props;
  const [search, setSearch] = useState(filters.search || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearch = () => {
    console.log("Mencari:", search);
  };

  return (
    <div className="relative bg-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
      <Sidebar onToggle={setSidebarOpen} />

      <main
        className={`grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 ${
          sidebarOpen ? "ml-0" : "ml-20"
        }`}
      >
        {/* === Breadcrumb === */}
        <OsBreadCrumb
          title="OSCE \\ OSCE Radiologi 01-A \\ Jadwal Sesi"
          icon={<ArrowLeft className="w-5 h-5" />}
          onClick={() => router.visit("/admin/dashboard")}
        />

        {/* === Konten Utama === */}
        <div className="flex-1 overflow-auto">
          {/* Navigasi */}
          <h2 className="font-semibold text-lg mb-2">Navigasi</h2>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => router.visit("/admin/stase")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-medium rounded-lg"
            >
              📄 Halaman Stase
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
            >
              📅 Jadwal Sesi
            </button>
          </div>

          {/* Menu OSCE */}
          <h2 className="font-semibold text-lg mb-1">Menu Sesi OSCE</h2>
          <p className="text-sm text-gray-600 mb-4 max-w-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis.
          </p>

          <button
            onClick={() => router.visit("/admin/tambahsesijadwal")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 mb-8"
          >
            ➕ Masukkan Sesi
          </button>

          {/* Filter/Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari data sesi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="h-[46px] px-6 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Cari
            </button>
          </div>

          {/* Tabel */}
          <h2 className="font-semibold text-lg mb-3">Table Mahasiswa</h2>
          <OsTableHeader columns={jadwalColumns} />

          {sesi.data.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center border-t border-gray-400 hover:bg-gray-50 transition"
            >
              <div className="w-16 px-4 py-3 text-center text-gray-800">
                {sesi.from + index}
              </div>
              <div className="flex-1 px-4 py-3 border-l border-gray-400 text-gray-800">
                {item.tanggal}
              </div>
              <div className="w-80 px-4 py-3 border-l border-gray-400 text-gray-800">
                {item.jumlah}
              </div>
              <div className="w-48 h-[70px] flex items-center justify-center border-l border-gray-400">
                <button
                  onClick={() => router.visit("/admin/enrollmentmhs")}
                  className="bg-gray-800 h-[38px] w-[120px] text-white text-sm rounded-md hover:bg-gray-700"
                >
                  Edit enrollment
                </button>
              </div>
            </div>
          ))}

          {sesi.data.length === 0 && (
            <div className="flex items-center border-t border-gray-400">
              <p className="w-full text-center text-sm py-4 text-gray-500">
                Data sesi tidak ditemukan.
              </p>
            </div>
          )}

          {/* Pagination */}
          {sesi.links && sesi.links.length > 0 && (
            <div className="mt-8">
              <OsPagination links={sesi.links} />
            </div>
          )}
        </div>

        <OsCopyright />
      </main>
    </div>
  );
}
