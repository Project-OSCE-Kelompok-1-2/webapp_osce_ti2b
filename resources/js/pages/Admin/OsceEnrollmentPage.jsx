import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, Search, Check } from "lucide-react";

export default function Section() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [currentPage, setCurrentPage] = useState(1);

  const students = [
    { id: 1, nim: "4.33.24.1.2301827492", name: "Riko Aditya Zaki Sir Raja" },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="px-6 pt-4 pb-0">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.visit("/admin/jadwalsesi")}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <input
            type="text"
            value="OSCE \ OSCE Radiologi 01-A \ Jadwal Sesi \ Enrollment Mahasiswa"
            readOnly
            className="flex-1 h-10 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700"
          />
        </div>

        {/* Konten table sama seperti sebelumnya */}
      </div>
    </div>
  );
}
