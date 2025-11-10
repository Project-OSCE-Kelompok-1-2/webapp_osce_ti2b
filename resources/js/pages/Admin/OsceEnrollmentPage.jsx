import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { ArrowLeft, Search, CheckSquare, Square } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import OsCopyright from "../../components/copyright";
import OsTableHeader from "../../components/tableheader";
import OsPagination from "../../components/pagination";

const columns = [
  { content: "No", width: "w-16", classes: "justify-center items-center" },
  { content: "Nim Mahasiswa", width: "w-72", classes: "justify-start items-center px-4" },
  { content: "Mahasiswa", width: "flex-1", classes: "justify-start items-center px-4" },
  { content: "Action", width: "w-48", classes: "justify-center items-center px-4" },
];

const mockData = [
  { id: 1, nim: "4.33.24.1.2301827492", nama: "Riko Aditiya Zaki Sir Raja" },
  { id: 2, nim: "4.33.24.1.2301827492", nama: "Ray Egan Primodium Insya Allah tahun depan" },
  { id: 3, nim: "4.33.24.1.2301827492", nama: "Bang Ucup AKA Ifad Dahlil Zangetsu" },
];

export default function EnrollmentMhs() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2025");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // list ID mahasiswa yang lagi di-check
  const [selectedIds, setSelectedIds] = useState([]);

  // handle tombol cari (buat nanti nyari data)
  const handleSearch = () => console.log("🔍 nyari:", search);

  // toggle checklist (klik = pilih / batal)
  const handleCheck = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative bg-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
      <Sidebar onToggle={setSidebarOpen} />

      <main
        className={`grid w-full h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 ${
          sidebarOpen ? "ml-0" : "ml-20"
        }`}
      >
        {/* header navigasi atas */}
        <div className="flex items-center gap-3 text-sm text-gray-700 px-5 py-[10px] border-b border-gray-300 bg-white">
          <button
            onClick={() => router.visit("/admin/tambahjadwal")}
            className="bg-blue-600 text-white p-[10px] rounded-full hover:bg-blue-700 flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1 border border-gray-400 rounded-lg px-4 py-[9px] text-sm font-medium bg-white leading-none">
            OSCE \ OSCE Radiologi 01-A \ Jadwal Sesi \ Enrollment Mahasiswa
          </div>
        </div>

        {/* main content */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <h2 className="font-semibold text-lg mb-2 mt-4">Menu Enrollment Mahasiswa</h2>
          <p className="text-sm text-gray-600 mb-5 max-w-2xl">
            bagian ini buat lihat daftar mahasiswa + checklist siapa aja yang ikut sesi.
          </p>

          {/* filter bar */}
          <div className="flex items-center gap-3 mb-6 w-full">
            {/* kolom search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="cari data mahasiswa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 h-[46px] border border-gray-400 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* dropdown tahun */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-[46px] w-[160px] border border-gray-400 rounded-md px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>

            {/* tombol cari */}
            <button
              onClick={handleSearch}
              className="h-[46px] w-[120px] bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 text-sm transition-all"
            >
              Cari
            </button>
          </div>

          {/* table mahasiswa */}
          <h2 className="font-semibold text-lg mb-2 mt-os-8">Table Mahasiswa</h2>
          <OsTableHeader columns={columns} />

          {mockData.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center border-t border-gray-400 ${
                index % 2 === 1 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="w-16 px-4 py-3 text-center">{index + 1}</div>
              <div className="w-72 px-4 py-3 border-l border-gray-400">{item.nim}</div>
              <div className="flex-1 px-4 py-3 border-l border-gray-400">{item.nama}</div>

              {/* tombol checklist */}
              <div className="w-48 h-[70px] flex items-center justify-center">
                <div className="border-l border-gray-400 h-[50px] w-full flex items-center justify-center">
                  <button
                    onClick={() => handleCheck(item.id)}
                    className={`flex items-center justify-center w-[36px] h-[36px] border border-gray-400 rounded-md transition-all ${
                      selectedIds.includes(item.id)
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {selectedIds.includes(item.id) ? (
                      <CheckSquare size={16} />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* pagination */}
          <div className="mt-8 border-t-4 border-black pt-4 flex justify-start">
            <OsPagination
              links={[
                { label: "«", url: "#" },
                { label: "1", url: "#", active: true },
                { label: "2", url: "#" },
                { label: "3", url: "#" },
                { label: "»", url: "#" },
              ]}
            />
          </div>
        </div>

        <OsCopyright />
      </main>
    </div>
  );
}
