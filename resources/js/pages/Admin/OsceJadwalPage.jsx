import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Search, ArrowLeft, Pencil, Trash2 } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";

const jadwalColumns = [
  { content: "No", width: "w-16", classes: "justify-center items-center" },
  { content: "Tanggal / Sesi", width: "flex-1", classes: "justify-start items-center px-4" },
  { content: "Jumlah Mahasiswa", width: "w-80", classes: "justify-start items-center px-4" },
  { content: "Action", width: "w-72", classes: "justify-center items-center px-4" },
];

const mockFilters = { search: "" };
const mockSesi = {
  data: [{ id: 1, tanggal: "Fri 01-01-2010 6:00", jumlah: "135 Mahasiswa" }],
  from: 1,
  links: [
    { url: null, label: "&laquo; Previous", active: false },
    { url: "#", label: "1", active: true },
    { url: "#", label: "2", active: false },
    { url: null, label: "Next &raquo;", active: false },
  ],
};

export default function OsceJadwalPage() {
  const { sesi = mockSesi, filters = mockFilters } = usePage().props;
  const [search, setSearch] = useState(filters.search || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearch = () => console.log("🔍 Mencari:", search);
  const handleEdit = (id) => router.visit(`/admin/enrollmentmhs`);
  const handleDelete = (id) => confirm("Yakin hapus data ini?") && console.log("🗑️ Hapus:", id);

  return (
    <div className="relative bg-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
      <Sidebar onToggle={setSidebarOpen} />

      <main
        className={`grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 ${
          sidebarOpen ? "ml-0" : "ml-20"
        }`}
      >
        <OsBreadCrumb
          title="OSCE \\ OSCE Radiologi 01-A \\ Jadwal Sesi"
          icon={<ArrowLeft className="w-5 h-5" />}
          onClick={() => router.visit("/admin/dashboard")}
        />

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
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
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
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="cari data sesi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 h-[46px] border border-gray-700 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 h-[46px] bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-sm"
            >
              Cari
            </button>
          </div>

          {/* === Table === */}
          <h2 className="font-semibold text-lg mb-3">Table Mahasiswa</h2>
          <div className="mb-3 w-full overflow-hidden">
            <OsTableHeader columns={jadwalColumns} />

            {sesi.data.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center text-sm hover:bg-gray-50 transition border-t border-gray-300 min-h-[70px]"
              >
                <div className="w-16 px-4 py-3 text-center">{sesi.from + index}</div>
                <div className="flex-1 px-4 py-3 border-l border-gray-300">{item.tanggal}</div>
                <div className="w-80 px-4 py-3 border-l border-gray-300">{item.jumlah}</div>

                {/* ✅ Kolom Action — tampilan baru */}
                <div className="w-[310px] px-5 py-3 border-l border-gray-300">
                  <div className="w-full flex items-center justify-between pr-2">
                    {/* Tombol besar */}
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="h-11 px-5 bg-neutral-800 text-white text-base rounded-2xl whitespace-nowrap
                                 hover:bg-neutral-700 transition-colors"
                    >
                      Edit enrollment
                    </button>

                    {/* Garis pemisah */}
                    <span className="mx-4 h-10 w-px bg-gray-300" />

                    {/* Dua ikon kanan */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => alert(`Edit ID ${item.id}`)}
                        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-neutral-800 text-white
                                   hover:bg-neutral-700 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center justify-center w-11 h-11 rounded-2xl border border-gray-400
                                   text-gray-800 bg-white hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pesan kosong */}
          {sesi.data.length === 0 && (
            <div className="flex items-center border-t border-gray-400">
              <p className="w-full text-center text-sm py-4 text-gray-500">
                Data sesi tidak ditemukan.
              </p>
            </div>
          )}

          {/* Pagination kiri bawah */}
          {sesi.links && sesi.links.length > 0 && (
            <div className="mt-6 border-t-4 border-black pt-4 flex justify-start">
              <OsPagination links={sesi.links} />
            </div>
          )}
        </div>

        <OsCopyright />
      </main>
    </div>
  );
}
